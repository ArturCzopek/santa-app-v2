import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
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
  batch.set(doc(db, `draws/${drawId}/participants/${OWNER}`), newParticipant(OWNER));
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

    it('counts participants in the batch that starts the draw', async () => {
      await assertSucceeds(startCounting(3));
    });

    it('cannot count more winners than participants', async () => {
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
    await assertSucceeds(setDoc(doc(db, `messages/${todayId(ALICE)}`), message(ALICE)));
    await assertFails(setDoc(doc(db, `messages/${todayId(ALICE)}`), message(ALICE)));
  });

  it('cannot use another day or another user id', async () => {
    const db = authed(env, ALICE);
    await assertFails(setDoc(doc(db, `messages/${ALICE}_2000-1-1`), message(ALICE)));
    await assertFails(setDoc(doc(db, `messages/${todayId(BOB)}`), message(BOB)));
    await assertFails(setDoc(doc(db, 'messages/random-id'), message(ALICE)));
  });

  it('cannot spoof the name or send huge messages', async () => {
    const db = authed(env, ALICE);
    await assertFails(
      setDoc(doc(db, `messages/${todayId(ALICE)}`), message(ALICE, { userName: 'Santa' })),
    );
    await assertFails(
      setDoc(
        doc(db, `messages/${todayId(ALICE)}`),
        message(ALICE, { message: 'x'.repeat(1001) }),
      ),
    );
  });

  it('users can check only their own message and nobody can list them', async () => {
    await setDoc(doc(authed(env, ALICE), `messages/${todayId(ALICE)}`), message(ALICE));

    await assertSucceeds(getDoc(doc(authed(env, ALICE), `messages/${todayId(ALICE)}`)));
    await assertFails(getDoc(doc(authed(env, BOB), `messages/${todayId(ALICE)}`)));
    await assertFails(getDocs(collection(authed(env, ALICE), 'messages')));
  });
});
