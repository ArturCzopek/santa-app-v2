import { createHash } from 'crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { migrateDraws } from '../../scripts/migrateDraws.mjs';
import { PasswordUtils } from '../../src/services/PasswordUtils';
import {
  ALICE,
  authed,
  BOB,
  createTestEnv,
  joinDraw,
  OWNER,
  PROJECT_ID,
} from '../rules/setup';

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

const legacyParticipant = (uid: string, wish = '') => ({
  userName: `${uid} name`,
  userUuid: uid,
  userPhotoUrl: `https://photos/${uid}`,
  entryDate: Timestamp.now(),
  wish,
});

let env: RulesTestEnvironment;
const adminApp = initializeApp({ projectId: PROJECT_ID }, 'migration-test');
const adminDb = getFirestore(adminApp);
const silent = () => {};

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
  await deleteApp(adminApp);
});

beforeEach(async () => {
  await env.clearFirestore();

  const legacyDraw = {
    createdDate: Timestamp.now(),
    ownerUuid: OWNER,
    ownerName: `${OWNER} name`,
    budget: '50',
    currency: 'PLN',
    drawName: 'Legacy',
    description: 'Old format',
    password: sha256('secret1'),
    participants: [legacyParticipant(OWNER, 'Book'), legacyParticipant(ALICE)],
    participantUuids: [OWNER, ALICE],
    pairs: [],
    status: 'WAITING_FOR_DRAW',
    drawDate: null,
  };

  await adminDb.doc('draws/waiting').set(legacyDraw);
  await adminDb.doc('draws/drawn').set({
    ...legacyDraw,
    status: 'DRAWED',
    drawDate: Timestamp.now(),
    pairs: [
      { fromUuid: OWNER, toUuid: ALICE },
      { fromUuid: ALICE, toUuid: OWNER },
    ],
  });
});

describe('migrateDraws', () => {
  it('dry run changes nothing', async () => {
    expect(await migrateDraws(adminDb, { apply: false, log: silent })).toBe(2);
    expect((await adminDb.doc('draws/waiting').get()).data()?.password).toBeDefined();
  });

  it('moves legacy data out of the draw document', async () => {
    await migrateDraws(adminDb, { apply: true, log: silent });

    const draw = (await adminDb.doc('draws/drawn').get()).data();
    expect(draw?.participants).toBeUndefined();
    expect(draw?.pairs).toBeUndefined();
    expect(draw?.password).toBeUndefined();
    expect(draw?.budget).toBe(50);
    expect(draw?.ownerPhotoUrl).toBe(`https://photos/${OWNER}`);

    const participants = await adminDb.collection('draws/drawn/participants').get();
    expect(participants.size).toBe(2);
    expect(
      (await adminDb.doc(`draws/drawn/participants/${OWNER}`).get()).data()?.wish,
    ).toBe('Book');
  });

  it('is idempotent', async () => {
    await migrateDraws(adminDb, { apply: true, log: silent });
    expect(await migrateDraws(adminDb, { apply: true, log: silent })).toBe(0);
  });

  it('migrated draws work with the new client and rules', async () => {
    await migrateDraws(adminDb, { apply: true, log: silent });

    // Results are private to each giver.
    const alice = authed(env, ALICE);
    const assignment = await assertSucceeds(
      getDoc(doc(alice, `draws/drawn/assignments/${ALICE}`)),
    );
    expect(assignment.data()?.toUuid).toBe(OWNER);
    await assertFails(getDoc(doc(alice, `draws/drawn/assignments/${OWNER}`)));

    // The old password still works, a wrong one does not.
    await assertFails(
      joinDraw(authed(env, BOB), 'waiting', BOB, await PasswordUtils.joinKey('waiting', 'nope')),
    );
    await assertSucceeds(
      joinDraw(authed(env, BOB), 'waiting', BOB, await PasswordUtils.joinKey('waiting', 'secret1')),
    );
  });
});
