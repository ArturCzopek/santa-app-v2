import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  ALICE,
  authed,
  BOB,
  createDraw,
  createTestEnv,
  joinDraw,
  JOIN_KEY,
  MALLORY,
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

describe('draws', () => {
  it('requires authentication', async () => {
    const anon = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, 'draws/some-draw')));
  });

  it('lets a signed-in user open a draw by id (join page)', async () => {
    await assertSucceeds(getDoc(doc(authed(env, ALICE), 'draws/some-draw')));
  });

  describe('create', () => {
    it('owner creates a draw with their participant document', async () => {
      await assertSucceeds(createDraw(authed(env, OWNER), 'd1', OWNER));
    });

    it('cannot create a draw for someone else', async () => {
      await assertFails(
        createDraw(authed(env, MALLORY), 'd1', MALLORY, { ownerUuid: OWNER }),
      );
    });

    it('cannot create a draw pre-filled with participants or results', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        createDraw(db, 'd1', OWNER, { participantUuids: [OWNER, ALICE] }),
      );
      await assertFails(createDraw(db, 'd2', OWNER, { status: 'DRAWED' }));
      await assertFails(createDraw(db, 'd3', OWNER, { pairs: [] }));
    });

    it('validates field sizes', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        createDraw(db, 'd1', OWNER, { drawName: 'x'.repeat(81) }),
      );
      await assertFails(createDraw(db, 'd2', OWNER, { budget: -5 }));
      await assertFails(createDraw(db, 'd3', OWNER, { currency: 'BTC' }));
    });

    it('accepts an optional gift exchange date and place', async () => {
      const db = authed(env, OWNER);
      await assertSucceeds(
        createDraw(db, 'd1', OWNER, {
          eventDate: '2026-12-24',
          eventPlace: 'At grandma’s, 6 pm',
        }),
      );
      await assertSucceeds(
        createDraw(db, 'd2', OWNER, { eventDate: '', eventPlace: '' }),
      );
      await assertFails(createDraw(db, 'd3', OWNER, { eventDate: 'tomorrow' }));
      await assertFails(
        createDraw(db, 'd4', OWNER, { eventPlace: 'x'.repeat(201) }),
      );
    });

    it('owner name and photo must come from their own profile', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        createDraw(db, 'd1', OWNER, { ownerName: 'Santa Claus' }),
      );
      await assertFails(
        createDraw(db, 'd2', OWNER, {
          ownerPhotoUrl: 'https://evil/photo.png',
        }),
      );
    });

    it('cannot create a draw without the owner participant document', async () => {
      const db = authed(env, OWNER);
      await assertFails(setDoc(doc(db, 'draws/d1'), newDraw(OWNER)));
    });
  });

  describe('join', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
    });

    it('user can add themselves', async () => {
      await assertSucceeds(joinDraw(authed(env, ALICE), 'd1', ALICE));
    });

    it('two users joining concurrently are both kept', async () => {
      await Promise.all([
        joinDraw(authed(env, ALICE), 'd1', ALICE),
        joinDraw(authed(env, BOB), 'd1', BOB),
      ]);
      const snapshot = await getDoc(doc(authed(env, OWNER), 'draws/d1'));
      const uuids = snapshot.data()?.participantUuids;
      if (!uuids.includes(ALICE) || !uuids.includes(BOB)) {
        throw new Error(`Lost a participant: ${uuids}`);
      }
    });

    it('cannot add someone else', async () => {
      const db = authed(env, MALLORY);
      const batch = writeBatch(db);
      batch.set(doc(db, `draws/d1/participants/${BOB}`), newParticipant(BOB));
      batch.update(doc(db, 'draws/d1'), { participantUuids: arrayUnion(BOB) });
      await assertFails(batch.commit());
    });

    it("cannot join under someone else's name or photo", async () => {
      for (const spoof of [
        { userName: `${OWNER} name` },
        { userPhotoUrl: 'https://evil/photo.png' },
      ]) {
        const db = authed(env, MALLORY);
        const batch = writeBatch(db);
        batch.set(doc(db, `draws/d1/participants/${MALLORY}`), {
          ...newParticipant(MALLORY),
          joinKey: JOIN_KEY,
          ...spoof,
        });
        batch.update(doc(db, 'draws/d1'), {
          participantUuids: arrayUnion(MALLORY),
        });
        await assertFails(batch.commit());
      }
    });

    it('cannot join with a wrong password', async () => {
      await assertFails(joinDraw(authed(env, ALICE), 'd1', ALICE, 'wrong-key'));
    });

    it('cannot join without a password', async () => {
      const db = authed(env, ALICE);
      const batch = writeBatch(db);
      batch.set(
        doc(db, `draws/d1/participants/${ALICE}`),
        newParticipant(ALICE),
      );
      batch.update(doc(db, 'draws/d1'), {
        participantUuids: arrayUnion(ALICE),
      });
      await assertFails(batch.commit());
    });

    it('cannot join without a participant document', async () => {
      await assertFails(
        updateDoc(doc(authed(env, ALICE), 'draws/d1'), {
          participantUuids: arrayUnion(ALICE),
        }),
      );
    });

    it('cannot join a draw that already took place', async () => {
      await env.withSecurityRulesDisabled((ctx) =>
        updateDoc(doc(ctx.firestore(), 'draws/d1'), { status: 'DRAWED' }),
      );
      await assertFails(joinDraw(authed(env, ALICE), 'd1', ALICE));
    });
  });

  describe('tampering', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await joinDraw(authed(env, BOB), 'd1', BOB);
    });

    it('participant cannot remove others or edit draw fields', async () => {
      const db = authed(env, ALICE);
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), { participantUuids: [ALICE] }),
      );
      await assertFails(updateDoc(doc(db, 'draws/d1'), { budget: 1 }));
      await assertFails(updateDoc(doc(db, 'draws/d1'), { ownerUuid: ALICE }));
      await assertFails(deleteDoc(doc(db, 'draws/d1')));
    });

    it('participant cannot start the draw', async () => {
      await assertFails(
        updateDoc(doc(authed(env, ALICE), 'draws/d1'), {
          status: 'DRAWED',
          drawDate: serverTimestamp(),
        }),
      );
    });

    it('owner cannot reset a finished draw', async () => {
      await env.withSecurityRulesDisabled((ctx) =>
        updateDoc(doc(ctx.firestore(), 'draws/d1'), { status: 'DRAWED' }),
      );
      await assertFails(
        updateDoc(doc(authed(env, OWNER), 'draws/d1'), {
          status: 'WAITING_FOR_DRAW',
        }),
      );
    });

    it('users can change only their own wish', async () => {
      await assertSucceeds(
        updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
          wish: 'Socks',
        }),
      );
      await assertFails(
        updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${BOB}`), {
          wish: 'Coal',
        }),
      );
      await assertFails(
        updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
          userName: 'Owner',
        }),
      );
    });
  });

  describe('password (joinKeys)', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
    });

    it('draw document does not contain the password', async () => {
      await assertFails(
        createDraw(authed(env, OWNER), 'd2', OWNER, { password: 'hash' }),
      );
    });

    it('key must be a SHA-256 hex digest', async () => {
      const db = authed(env, OWNER);
      const batch = writeBatch(db);
      batch.set(doc(db, 'draws/d2'), newDraw(OWNER));
      batch.set(
        doc(db, `draws/d2/participants/${OWNER}`),
        newParticipant(OWNER),
      );
      batch.set(doc(db, 'draws/d2/joinKeys/1234'), {
        createdDate: serverTimestamp(),
      });
      await assertFails(batch.commit());
    });

    it('only the owner can check a password', async () => {
      await assertSucceeds(
        getDoc(doc(authed(env, OWNER), `draws/d1/joinKeys/${JOIN_KEY}`)),
      );
      await assertFails(
        getDoc(doc(authed(env, ALICE), `draws/d1/joinKeys/${JOIN_KEY}`)),
      );
      await assertFails(
        getDoc(doc(authed(env, MALLORY), `draws/d1/joinKeys/${JOIN_KEY}`)),
      );
    });

    it('nobody can list keys or add one later', async () => {
      await assertFails(
        getDocs(collection(authed(env, OWNER), 'draws/d1/joinKeys')),
      );
      await assertFails(
        setDoc(doc(authed(env, MALLORY), 'draws/d1/joinKeys/my-key'), {
          createdDate: serverTimestamp(),
        }),
      );
      await assertFails(
        setDoc(doc(authed(env, OWNER), 'draws/d1/joinKeys/another-key'), {
          createdDate: serverTimestamp(),
        }),
      );
    });
  });

  describe('invite link', () => {
    const LINK_KEY = 'b'.repeat(64);
    const NEW_LINK_KEY = 'c'.repeat(64);

    const setInvite = (
      db: ReturnType<typeof authed>,
      joinKey: string,
      retire?: string,
    ) => {
      const batch = writeBatch(db);
      batch.set(doc(db, `draws/d1/joinKeys/${joinKey}`), {
        createdDate: serverTimestamp(),
      });
      batch.set(doc(db, 'draws/d1/invite/link'), {
        key: 'k'.repeat(22),
        joinKey,
        createdDate: serverTimestamp(),
      });
      if (retire) batch.delete(doc(db, `draws/d1/joinKeys/${retire}`));
      return batch.commit();
    };

    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
    });

    it('owner can make a link, and its key lets people join', async () => {
      await assertSucceeds(setInvite(authed(env, OWNER), LINK_KEY));
      await assertSucceeds(joinDraw(authed(env, ALICE), 'd1', ALICE, LINK_KEY));
    });

    it('participants can read the link, outsiders cannot', async () => {
      await setInvite(authed(env, OWNER), LINK_KEY);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await assertSucceeds(
        getDoc(doc(authed(env, ALICE), 'draws/d1/invite/link')),
      );
      await assertFails(
        getDoc(doc(authed(env, MALLORY), 'draws/d1/invite/link')),
      );
    });

    it('only the owner makes links, and only before the draw', async () => {
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await assertFails(setInvite(authed(env, ALICE), LINK_KEY));
      await assertFails(setInvite(authed(env, MALLORY), LINK_KEY));

      await updateDoc(doc(authed(env, OWNER), 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(setInvite(authed(env, OWNER), LINK_KEY));
    });

    it('a new link retires the old one but keeps the password', async () => {
      await setInvite(authed(env, OWNER), LINK_KEY);
      await assertSucceeds(
        setInvite(authed(env, OWNER), NEW_LINK_KEY, LINK_KEY),
      );

      await assertFails(joinDraw(authed(env, ALICE), 'd1', ALICE, LINK_KEY));
      await assertSucceeds(
        joinDraw(authed(env, ALICE), 'd1', ALICE, NEW_LINK_KEY),
      );
      await assertSucceeds(joinDraw(authed(env, BOB), 'd1', BOB, JOIN_KEY));
    });

    it('the password key cannot be deleted', async () => {
      await setInvite(authed(env, OWNER), LINK_KEY);
      await assertFails(
        deleteDoc(doc(authed(env, OWNER), `draws/d1/joinKeys/${JOIN_KEY}`)),
      );
      await assertFails(setInvite(authed(env, OWNER), NEW_LINK_KEY, JOIN_KEY));
    });

    it('a link must point to a key created with it', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        setDoc(doc(db, 'draws/d1/invite/link'), {
          key: 'k'.repeat(22),
          joinKey: LINK_KEY,
          createdDate: serverTimestamp(),
        }),
      );
    });
  });

  describe('reading', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
    });

    it('participants can read the participant list, outsiders cannot', async () => {
      await assertSucceeds(
        getDocs(collection(authed(env, ALICE), 'draws/d1/participants')),
      );
      await assertFails(
        getDocs(collection(authed(env, MALLORY), 'draws/d1/participants')),
      );
    });

    it('users can list only their own draws', async () => {
      const db = authed(env, MALLORY);
      await assertSucceeds(
        getDocs(
          query(
            collection(db, 'draws'),
            where('participantUuids', 'array-contains', MALLORY),
          ),
        ),
      );
      await assertFails(getDocs(collection(db, 'draws')));
    });
  });
});
