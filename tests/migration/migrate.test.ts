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
import { migrateDraws, migrateLetters } from '../../scripts/migrateDraws.mjs';
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
    const owner = (await adminDb.doc(`draws/drawn/participants/${OWNER}`).get()).data();
    expect(owner?.wish).toBeUndefined();
    expect(owner?.hasWish).toBe(true);
    expect((await adminDb.doc(`draws/drawn/letters/${OWNER}`).get()).data()).toEqual({
      wish: 'Book',
    });
    expect((await adminDb.doc(`draws/drawn/participants/${ALICE}`).get()).data()?.hasWish).toBe(
      false,
    );
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

describe('migrateLetters', () => {
  beforeEach(async () => {
    // A draw from before letters moved out: wishes in participant documents.
    await adminDb.doc('draws/d1').set({ participantUuids: [OWNER, ALICE], status: 'DRAWED' });
    await adminDb.doc(`draws/d1/participants/${OWNER}`).set(legacyParticipant(OWNER, 'Book'));
    await adminDb.doc(`draws/d1/participants/${ALICE}`).set(legacyParticipant(ALICE));
    await adminDb.doc(`draws/d1/assignments/${ALICE}`).set({ toUuid: OWNER });
  });

  it('dry run changes nothing', async () => {
    expect(await migrateLetters(adminDb, { apply: false, log: silent })).toBe(2);
    expect((await adminDb.doc(`draws/d1/participants/${OWNER}`).get()).data()?.wish).toBe(
      'Book',
    );
  });

  it('moves wishes into letters, leaves hasWish, and runs once', async () => {
    expect(await migrateLetters(adminDb, { apply: true, log: silent })).toBe(2);
    expect(await migrateLetters(adminDb, { apply: true, log: silent })).toBe(0);

    const owner = (await adminDb.doc(`draws/d1/participants/${OWNER}`).get()).data();
    expect(owner?.wish).toBeUndefined();
    expect(owner?.hasWish).toBe(true);
    expect((await adminDb.doc(`draws/d1/letters/${OWNER}`).get()).data()).toEqual({
      wish: 'Book',
    });
    expect((await adminDb.doc(`draws/d1/letters/${ALICE}`).get()).exists).toBe(false);

    // Now only the owner's Santa (Alice) can read it.
    await assertSucceeds(getDoc(doc(authed(env, ALICE), `draws/d1/letters/${OWNER}`)));
  });
});

