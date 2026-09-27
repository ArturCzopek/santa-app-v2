import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  ALICE,
  authed,
  BOB,
  createTestEnv,
  JOIN_KEY,
  newDraw,
  newParticipant,
  OWNER,
} from './setup';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

const createDrawCounting = (drawId: string, by: number) => {
  const db = authed(env, OWNER);
  const batch = writeBatch(db);
  batch.set(doc(db, `draws/${drawId}`), newDraw(OWNER));
  batch.set(
    doc(db, `draws/${drawId}/participants/${OWNER}`),
    newParticipant(OWNER),
  );
  batch.set(doc(db, `draws/${drawId}/joinKeys/${JOIN_KEY}`), {
    createdDate: serverTimestamp(),
  });
  batch.set(
    doc(db, 'appData/stats'),
    { drawsCount: increment(by), lastDrawId: drawId },
    { merge: true },
  );
  return batch.commit();
};

describe('stats', () => {
  it('counts a draw in the batch that creates it', async () => {
    await assertSucceeds(createDrawCounting('d1', 1));
    await assertSucceeds(createDrawCounting('d2', 1));
    const stats = await getDoc(doc(authed(env, ALICE), 'appData/stats'));
    if (stats.data()?.drawsCount !== 2) throw new Error('Expected 2 draws');
  });

  it('cannot inflate the draw counter', async () => {
    await assertFails(createDrawCounting('d1', 100));
  });

  it('cannot count a draw that is not being created', async () => {
    await createDrawCounting('d1', 1);
    await assertFails(
      setDoc(
        doc(authed(env, OWNER), 'appData/stats'),
        { drawsCount: increment(1), lastDrawId: 'd1' },
        { merge: true },
      ),
    );
    await assertFails(
      setDoc(doc(authed(env, OWNER), 'appData/stats'), {
        drawsCount: 999,
        winnersCount: 999,
      }),
    );
  });

  describe('winners', () => {
    beforeEach(async () => {
      await env.withSecurityRulesDisabled((ctx) =>
        setDoc(doc(ctx.firestore(), 'draws/d1'), {
          ownerUuid: OWNER,
          ownerPlays: false,
          participantUuids: [OWNER, ALICE, BOB],
          status: 'WAITING_FOR_DRAW',
        }),
      );
    });

    const startCounting = (winners: number) => {
      const db = authed(env, OWNER);
      const batch = writeBatch(db);
      batch.update(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      batch.set(
        doc(db, 'appData/stats'),
        { winnersCount: increment(winners), lastDrawId: 'd1' },
        { merge: true },
      );
      return batch.commit();
    };

    it('counts players in the batch that starts the draw', async () => {
      await assertSucceeds(startCounting(2));
    });

    it('does not count the non-playing owner', async () => {
      await assertFails(startCounting(3));
    });

    it('cannot count more winners than players', async () => {
      await assertFails(startCounting(10));
    });
  });
});

const todayId = (uid: string) => {
  const now = new Date();
  return `${uid}_${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
};

const message = (uid: string, overrides: Record<string, unknown> = {}) => ({
  userUid: uid,
  userName: `${uid} name`,
  message: 'Great app!',
  date: serverTimestamp(),
  ...overrides,
});

describe('messages', () => {
  it('user can send one message today', async () => {
    const db = authed(env, ALICE);
    await assertSucceeds(
      setDoc(doc(db, `messages/${todayId(ALICE)}`), message(ALICE)),
    );
    await assertFails(
      setDoc(doc(db, `messages/${todayId(ALICE)}`), message(ALICE)),
    );
  });

  it('cannot use another day or another user id', async () => {
    const db = authed(env, ALICE);
    await assertFails(
      setDoc(doc(db, `messages/${ALICE}_2000-1-1`), message(ALICE)),
    );
    await assertFails(
      setDoc(doc(db, `messages/${todayId(BOB)}`), message(BOB)),
    );
    await assertFails(setDoc(doc(db, 'messages/random-id'), message(ALICE)));
  });

  it('cannot spoof the name or send huge messages', async () => {
    const db = authed(env, ALICE);
    await assertFails(
      setDoc(
        doc(db, `messages/${todayId(ALICE)}`),
        message(ALICE, { userName: 'Santa' }),
      ),
    );
    await assertFails(
      setDoc(
        doc(db, `messages/${todayId(ALICE)}`),
        message(ALICE, { message: 'x'.repeat(1001) }),
      ),
    );
  });

  it('the verified admin can list and get every message', async () => {
    await setDoc(
      doc(authed(env, ALICE), `messages/${todayId(ALICE)}`),
      message(ALICE),
    );
    await setDoc(
      doc(authed(env, BOB), `messages/${todayId(BOB)}`),
      message(BOB),
    );

    const admin = env
      .authenticatedContext('admin-uid', {
        email: 'arturcz32@gmail.com',
        email_verified: true,
      })
      .firestore();
    const messages = await assertSucceeds(
      getDocs(collection(admin, 'messages')),
    );
    if (messages.size !== 2)
      throw new Error('Expected admin to list both messages');
    await assertSucceeds(getDoc(doc(admin, `messages/${todayId(ALICE)}`)));
  });

  it('requires a verified email for admin access', async () => {
    await setDoc(
      doc(authed(env, ALICE), `messages/${todayId(ALICE)}`),
      message(ALICE),
    );
    const unverifiedAdmin = env
      .authenticatedContext('unverified-admin', {
        email: 'arturcz32@gmail.com',
        email_verified: false,
      })
      .firestore();

    await assertFails(getDocs(collection(unverifiedAdmin, 'messages')));
    await assertFails(
      getDoc(doc(unverifiedAdmin, `messages/${todayId(ALICE)}`)),
    );
  });

  it('ordinary users can get only their own message and cannot list', async () => {
    await setDoc(
      doc(authed(env, ALICE), `messages/${todayId(ALICE)}`),
      message(ALICE),
    );
    await setDoc(
      doc(authed(env, BOB), `messages/${todayId(BOB)}`),
      message(BOB),
    );

    await assertSucceeds(
      getDoc(doc(authed(env, ALICE), `messages/${todayId(ALICE)}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, BOB), `messages/${todayId(ALICE)}`)),
    );
    await assertFails(getDocs(collection(authed(env, ALICE), 'messages')));
  });

  it('nobody can update or delete a message', async () => {
    await setDoc(
      doc(authed(env, ALICE), `messages/${todayId(ALICE)}`),
      message(ALICE),
    );
    const admin = env
      .authenticatedContext('admin-uid', {
        email: 'arturcz32@gmail.com',
        email_verified: true,
      })
      .firestore();

    for (const db of [admin, authed(env, ALICE), authed(env, BOB)]) {
      const messageRef = doc(db, `messages/${todayId(ALICE)}`);
      await assertFails(updateDoc(messageRef, { message: 'Changed' }));
      await assertFails(deleteDoc(messageRef));
    }
  });
});
