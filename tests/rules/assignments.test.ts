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
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { ALICE, authed, BOB, createTestEnv, OWNER } from './setup';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'draws/d1'), {
      ownerUuid: OWNER,
      participantUuids: [OWNER, ALICE, BOB],
      status: 'WAITING_FOR_DRAW',
    });
  });
});

const startDraw = (uid: string, pairs: [string, string][]) => {
  const db = authed(env, uid);
  const batch = writeBatch(db);
  batch.update(doc(db, 'draws/d1'), {
    status: 'DRAWED',
    drawDate: serverTimestamp(),
  });
  pairs.forEach(([from, to]) =>
    batch.set(doc(db, `draws/d1/assignments/${from}`), { toUuid: to }),
  );
  return batch.commit();
};

const VALID_PAIRS: [string, string][] = [
  [OWNER, ALICE],
  [ALICE, BOB],
  [BOB, OWNER],
];

describe('assignments', () => {
  it('owner can write assignments together with starting the draw', async () => {
    await assertSucceeds(startDraw(OWNER, VALID_PAIRS));
  });

  it('non-owner cannot start the draw with assignments', async () => {
    await assertFails(startDraw(ALICE, VALID_PAIRS));
  });

  it('assignments cannot be written without the status transition', async () => {
    const db = authed(env, OWNER);
    await assertFails(
      setDoc(doc(db, `draws/d1/assignments/${OWNER}`), { toUuid: ALICE }),
    );
  });

  it('assignments cannot be rewritten after the draw', async () => {
    await startDraw(OWNER, VALID_PAIRS);
    const db = authed(env, OWNER);
    await assertFails(
      setDoc(doc(db, `draws/d1/assignments/${ALICE}`), { toUuid: OWNER }),
    );
  });

  it('rejects self-assignment and outsiders', async () => {
    await assertFails(startDraw(OWNER, [[OWNER, OWNER]]));
    await assertFails(startDraw(OWNER, [[OWNER, 'stranger-uid']]));
  });

  it('only the giver can read their assignment', async () => {
    await startDraw(OWNER, VALID_PAIRS);

    await assertSucceeds(
      getDoc(doc(authed(env, ALICE), `draws/d1/assignments/${ALICE}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, BOB), `draws/d1/assignments/${ALICE}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, OWNER), `draws/d1/assignments/${ALICE}`)),
    );
  });

  it('nobody can list all assignments', async () => {
    await startDraw(OWNER, VALID_PAIRS);
    await assertFails(
      getDocs(collection(authed(env, OWNER), 'draws/d1/assignments')),
    );
  });
});
