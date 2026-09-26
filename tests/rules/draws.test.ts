import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  arrayRemove,
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
  writeLetter,
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

    it('participant documents change only through a letter', async () => {
      await assertFails(
        updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
          userName: 'Owner',
        }),
      );
      await assertFails(
        updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
          wish: 'Socks',
        }),
      );
    });
  });

  describe('letters', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await joinDraw(authed(env, BOB), 'd1', BOB);
    });

    const letter = (uid: string) => `draws/d1/letters/${uid}`;

    it('only the author writes a letter, with a true hasWish mark', async () => {
      await assertSucceeds(
        writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks'),
      );
      await assertSucceeds(writeLetter(authed(env, ALICE), 'd1', ALICE, ''));
      await assertFails(writeLetter(authed(env, BOB), 'd1', ALICE, 'Coal'));
      await assertFails(
        writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks', false),
      );
      await assertFails(writeLetter(authed(env, ALICE), 'd1', ALICE, '', true));
      await assertFails(
        writeLetter(authed(env, ALICE), 'd1', ALICE, 'x'.repeat(2001)),
      );
      await assertFails(writeLetter(authed(env, MALLORY), 'd1', MALLORY, 'Hi'));
    });

    it('before the draw nobody but the author reads it, not even the owner', async () => {
      await writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks');
      await assertSucceeds(getDoc(doc(authed(env, ALICE), letter(ALICE))));
      await assertFails(getDoc(doc(authed(env, BOB), letter(ALICE))));
      await assertFails(getDoc(doc(authed(env, OWNER), letter(ALICE))));
      await assertFails(getDoc(doc(authed(env, MALLORY), letter(ALICE))));
      await assertFails(
        getDocs(collection(authed(env, OWNER), 'draws/d1/letters')),
      );
    });

    it('after the draw only the Santa reads the recipient’s letter', async () => {
      await writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks');
      const db = authed(env, OWNER);
      const batch = writeBatch(db);
      batch.update(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      // Bob gives to Alice.
      batch.set(doc(db, `draws/d1/assignments/${BOB}`), { toUuid: ALICE });
      batch.set(doc(db, `draws/d1/assignments/${ALICE}`), { toUuid: OWNER });
      batch.set(doc(db, `draws/d1/assignments/${OWNER}`), { toUuid: BOB });
      await batch.commit();

      await assertSucceeds(getDoc(doc(authed(env, BOB), letter(ALICE))));
      await assertSucceeds(getDoc(doc(authed(env, ALICE), letter(ALICE))));
      await assertFails(getDoc(doc(authed(env, OWNER), letter(ALICE))));
      await assertFails(getDoc(doc(authed(env, BOB), letter(OWNER))));
      await assertFails(getDoc(doc(authed(env, MALLORY), letter(ALICE))));
    });

    it('after the draw nobody writes, changes or clears a letter', async () => {
      await writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks');
      await updateDoc(doc(authed(env, OWNER), 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });

      await assertFails(
        writeLetter(authed(env, ALICE), 'd1', ALICE, 'A bike instead'),
      );
      await assertFails(writeLetter(authed(env, ALICE), 'd1', ALICE, ''));
      await assertFails(writeLetter(authed(env, BOB), 'd1', BOB, 'Late wish'));
      await assertFails(
        setDoc(doc(authed(env, ALICE), letter(ALICE)), { wish: 'A bike' }),
      );
      await assertFails(
        updateDoc(doc(authed(env, BOB), `draws/d1/participants/${BOB}`), {
          hasWish: false,
        }),
      );
    });

    it('participants see only whether a letter is written', async () => {
      await writeLetter(authed(env, ALICE), 'd1', ALICE, 'Socks');
      const alice = await getDoc(
        doc(authed(env, BOB), `draws/d1/participants/${ALICE}`),
      );
      expect(alice.data()?.hasWish).toBe(true);
      expect(alice.data()?.wish).toBeUndefined();
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

    it('only the owner can list and add keys, and only before the draw', async () => {
      const key = 'e'.repeat(64);
      await assertSucceeds(
        getDocs(collection(authed(env, OWNER), 'draws/d1/joinKeys')),
      );
      await assertFails(
        getDocs(collection(authed(env, ALICE), 'draws/d1/joinKeys')),
      );
      for (const person of [ALICE, MALLORY]) {
        await assertFails(
          setDoc(doc(authed(env, person), `draws/d1/joinKeys/${key}`), {
            createdDate: serverTimestamp(),
          }),
        );
      }
      await assertFails(
        setDoc(doc(authed(env, OWNER), 'draws/d1/joinKeys/another-key'), {
          createdDate: serverTimestamp(),
        }),
      );
      await assertSucceeds(
        setDoc(doc(authed(env, OWNER), `draws/d1/joinKeys/${key}`), {
          createdDate: serverTimestamp(),
        }),
      );

      await updateDoc(doc(authed(env, OWNER), 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(
        setDoc(doc(authed(env, OWNER), `draws/d1/joinKeys/${'f'.repeat(64)}`), {
          createdDate: serverTimestamp(),
        }),
      );
    });
  });

  describe('edit', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
    });

    const changes = {
      drawName: 'Christmas Eve',
      description: '',
      budget: 100,
      currency: 'EUR',
      eventDate: '2026-12-24',
      eventPlace: 'At grandma’s',
    };

    it('owner can change the details before the draw', async () => {
      await assertSucceeds(
        updateDoc(doc(authed(env, OWNER), 'draws/d1'), changes),
      );
    });

    it('participants and outsiders cannot', async () => {
      await assertFails(
        updateDoc(doc(authed(env, ALICE), 'draws/d1'), changes),
      );
      await assertFails(
        updateDoc(doc(authed(env, MALLORY), 'draws/d1'), changes),
      );
    });

    it('nothing changes after the draw', async () => {
      const db = authed(env, OWNER);
      await updateDoc(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(updateDoc(doc(db, 'draws/d1'), changes));
    });

    it('cannot touch participants or status, or break the limits', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), {
          ...changes,
          participantUuids: [OWNER],
        }),
      );
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), { ...changes, ownerUuid: ALICE }),
      );
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), { ...changes, drawName: '' }),
      );
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), { ...changes, eventDate: '24.12' }),
      );
    });
  });

  describe('delete and leave', () => {
    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
    });

    const deleteAll = (db: ReturnType<typeof authed>) => {
      const batch = writeBatch(db);
      batch.delete(doc(db, `draws/d1/participants/${OWNER}`));
      batch.delete(doc(db, `draws/d1/participants/${ALICE}`));
      batch.delete(doc(db, `draws/d1/joinKeys/${JOIN_KEY}`));
      batch.delete(doc(db, 'draws/d1/invite/link'));
      batch.delete(doc(db, 'draws/d1'));
      return batch.commit();
    };

    const leave = (db: ReturnType<typeof authed>, uid: string) => {
      const batch = writeBatch(db);
      batch.delete(doc(db, `draws/d1/participants/${uid}`));
      batch.update(doc(db, 'draws/d1'), {
        participantUuids: arrayRemove(uid),
      });
      return batch.commit();
    };

    it('owner deletes the draw with everything in it', async () => {
      await assertSucceeds(deleteAll(authed(env, OWNER)));
    });

    it('nobody else can delete it, and the owner not after the draw', async () => {
      await assertFails(deleteAll(authed(env, ALICE)));
      await assertFails(deleteAll(authed(env, MALLORY)));

      const db = authed(env, OWNER);
      await updateDoc(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(deleteAll(db));
    });

    it('owner cannot remove a participant without taking them off the list', async () => {
      await assertFails(
        deleteDoc(doc(authed(env, OWNER), `draws/d1/participants/${ALICE}`)),
      );
    });

    // The owner takes someone out: the list, their participant document,
    // their letter and the exclusions they were in, in one batch.
    const removeParticipant = (
      db: ReturnType<typeof authed>,
      uid: string,
      exclusionIds: string[] = [],
    ) => {
      const batch = writeBatch(db);
      batch.delete(doc(db, `draws/d1/participants/${uid}`));
      batch.delete(doc(db, `draws/d1/letters/${uid}`));
      exclusionIds.forEach((id) =>
        batch.delete(doc(db, `draws/d1/exclusions/${id}`)),
      );
      batch.update(doc(db, 'draws/d1'), {
        participantUuids: arrayRemove(uid),
      });
      return batch.commit();
    };

    it('owner takes a participant out before the draw, with their letter and pairs', async () => {
      await joinDraw(authed(env, BOB), 'd1', BOB);
      await writeLetter(authed(env, ALICE), 'd1', ALICE, 'Skarpetki');
      const [a, b] = [ALICE, BOB].sort();
      await setDoc(doc(authed(env, OWNER), `draws/d1/exclusions/${a}_${b}`), {
        a,
        b,
      });

      await assertSucceeds(
        removeParticipant(authed(env, OWNER), ALICE, [`${a}_${b}`]),
      );
      const snapshot = await getDoc(doc(authed(env, OWNER), 'draws/d1'));
      expect(snapshot.data()?.participantUuids).toEqual([OWNER, BOB]);
    });

    it('owner cannot take out two people at once, themselves, or anyone after the draw', async () => {
      await joinDraw(authed(env, BOB), 'd1', BOB);
      const db = authed(env, OWNER);

      const both = writeBatch(db);
      both.delete(doc(db, `draws/d1/participants/${ALICE}`));
      both.delete(doc(db, `draws/d1/participants/${BOB}`));
      both.update(doc(db, 'draws/d1'), {
        participantUuids: arrayRemove(ALICE, BOB),
      });
      await assertFails(both.commit());

      await assertFails(removeParticipant(db, OWNER));

      // The participant document must go with the name on the list.
      await assertFails(
        updateDoc(doc(db, 'draws/d1'), { participantUuids: arrayRemove(BOB) }),
      );

      await updateDoc(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(removeParticipant(db, ALICE));
    });

    it('a participant cannot take someone else out', async () => {
      await joinDraw(authed(env, BOB), 'd1', BOB);
      await assertFails(removeParticipant(authed(env, BOB), ALICE));
    });

    it('a participant can leave before the draw', async () => {
      await assertSucceeds(leave(authed(env, ALICE), ALICE));
      const snapshot = await getDoc(doc(authed(env, OWNER), 'draws/d1'));
      expect(snapshot.data()?.participantUuids).toEqual([OWNER]);
    });

    it('cannot take someone else out, the owner cannot leave, nobody leaves after the draw', async () => {
      await joinDraw(authed(env, BOB), 'd1', BOB);
      await assertFails(leave(authed(env, BOB), ALICE));
      await assertFails(leave(authed(env, OWNER), OWNER));

      await updateDoc(doc(authed(env, OWNER), 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(leave(authed(env, ALICE), ALICE));
    });
  });

  describe('exclusions', () => {
    const pairId = [ALICE, BOB].sort().join('_');
    const [a, b] = [ALICE, BOB].sort();

    beforeEach(async () => {
      await createDraw(authed(env, OWNER), 'd1', OWNER);
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await joinDraw(authed(env, BOB), 'd1', BOB);
    });

    it('owner adds, reads and removes a pair before the draw', async () => {
      const db = authed(env, OWNER);
      await assertSucceeds(
        setDoc(doc(db, `draws/d1/exclusions/${pairId}`), { a, b }),
      );
      await assertSucceeds(getDocs(collection(db, 'draws/d1/exclusions')));
      await assertSucceeds(deleteDoc(doc(db, `draws/d1/exclusions/${pairId}`)));
    });

    it('participants can neither see nor change them', async () => {
      await setDoc(doc(authed(env, OWNER), `draws/d1/exclusions/${pairId}`), {
        a,
        b,
      });
      const db = authed(env, ALICE);
      await assertFails(getDocs(collection(db, 'draws/d1/exclusions')));
      await assertFails(deleteDoc(doc(db, `draws/d1/exclusions/${pairId}`)));
    });

    it('a pair is two different participants under its own id', async () => {
      const db = authed(env, OWNER);
      await assertFails(
        setDoc(doc(db, `draws/d1/exclusions/${b}_${a}`), { a: b, b: a }),
      );
      await assertFails(setDoc(doc(db, 'draws/d1/exclusions/x_y'), { a, b }));
      // Nobody is paired with themselves.
      await assertFails(
        setDoc(doc(db, `draws/d1/exclusions/${a}_${a}`), { a, b: a }),
      );
      await assertFails(
        setDoc(doc(db, `draws/d1/exclusions/${a}_${MALLORY}`), {
          a,
          b: MALLORY,
        }),
      );
    });

    it('keeps each pair once, whichever way round it is given', async () => {
      const db = authed(env, OWNER);
      await assertSucceeds(
        setDoc(doc(db, `draws/d1/exclusions/${pairId}`), { a, b }),
      );
      // A-B and B-A share one id, and an existing pair cannot be written again.
      await assertFails(
        setDoc(doc(db, `draws/d1/exclusions/${pairId}`), { a, b }),
      );
    });

    it('nothing changes after the draw', async () => {
      const db = authed(env, OWNER);
      await updateDoc(doc(db, 'draws/d1'), {
        status: 'DRAWED',
        drawDate: serverTimestamp(),
      });
      await assertFails(
        setDoc(doc(db, `draws/d1/exclusions/${pairId}`), { a, b }),
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

    it('the owner can replace the password; the link keeps working', async () => {
      const NEW_PASSWORD_KEY = 'd'.repeat(64);
      await setInvite(authed(env, OWNER), LINK_KEY);

      const db = authed(env, OWNER);
      const batch = writeBatch(db);
      batch.delete(doc(db, `draws/d1/joinKeys/${JOIN_KEY}`));
      batch.set(doc(db, `draws/d1/joinKeys/${NEW_PASSWORD_KEY}`), {
        createdDate: serverTimestamp(),
      });
      await assertSucceeds(batch.commit());

      await assertFails(joinDraw(authed(env, ALICE), 'd1', ALICE, JOIN_KEY));
      await assertSucceeds(
        joinDraw(authed(env, ALICE), 'd1', ALICE, NEW_PASSWORD_KEY),
      );
      await assertSucceeds(joinDraw(authed(env, BOB), 'd1', BOB, LINK_KEY));
    });

    it('the current link key and other people cannot remove keys', async () => {
      await setInvite(authed(env, OWNER), LINK_KEY);
      await assertFails(
        deleteDoc(doc(authed(env, OWNER), `draws/d1/joinKeys/${LINK_KEY}`)),
      );
      await joinDraw(authed(env, ALICE), 'd1', ALICE);
      await assertFails(
        deleteDoc(doc(authed(env, ALICE), `draws/d1/joinKeys/${JOIN_KEY}`)),
      );
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
