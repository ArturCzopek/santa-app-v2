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
  OWNER,
  seedDrawn,
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
  await env.withSecurityRulesDisabled((ctx) =>
    setDoc(doc(ctx.firestore(), 'draws/d1'), {
      ownerUuid: OWNER,
      participantUuids: [OWNER, ALICE, BOB],
      status: 'WAITING_FOR_DRAW',
    }),
  );
});

const VALID_PAIRS: [string, string][] = [
  [OWNER, ALICE],
  [ALICE, BOB],
  [BOB, OWNER],
];

const clientStartBatch = (uid: string) => {
  const db = authed(env, uid);
  const batch = writeBatch(db);
  batch.update(doc(db, 'draws/d1'), {
    status: 'DRAWED',
    drawDate: serverTimestamp(),
  });
  VALID_PAIRS.forEach(([giverUid, toUuid]) =>
    batch.set(doc(db, `draws/d1/assignments/${giverUid}`), { toUuid }),
  );
  return batch.commit();
};

describe('assignments', () => {
  it('clients cannot create assignments, even in the owner start batch', async () => {
    await assertFails(clientStartBatch(OWNER));
    await assertFails(clientStartBatch(ALICE));
    await assertFails(
      setDoc(doc(authed(env, OWNER), `draws/d1/assignments/${OWNER}`), {
        toUuid: ALICE,
      }),
    );
  });

  it('only the giver can get their assignment', async () => {
    await seedDrawn(env, 'd1', VALID_PAIRS);

    await assertSucceeds(
      getDoc(doc(authed(env, ALICE), `draws/d1/assignments/${ALICE}`)),
    );
    await assertSucceeds(
      getDoc(doc(authed(env, OWNER), `draws/d1/assignments/${OWNER}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, BOB), `draws/d1/assignments/${ALICE}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, OWNER), `draws/d1/assignments/${ALICE}`)),
    );
  });

  it('clients cannot change or delete assignments', async () => {
    await seedDrawn(env, 'd1', VALID_PAIRS);
    const giver = authed(env, ALICE);
    await assertFails(
      updateDoc(doc(giver, `draws/d1/assignments/${ALICE}`), {
        toUuid: OWNER,
      }),
    );
    await assertFails(deleteDoc(doc(giver, `draws/d1/assignments/${ALICE}`)));
  });

  it('nobody can list all assignments', async () => {
    await seedDrawn(env, 'd1', VALID_PAIRS);
    await assertFails(
      getDocs(collection(authed(env, OWNER), 'draws/d1/assignments')),
    );
  });
});
