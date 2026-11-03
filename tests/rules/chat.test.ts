import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ALICE, authed, BOB, createTestEnv, MALLORY, OWNER } from './setup';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

// Santa -> recipient: OWNER -> BOB, BOB -> MALLORY, MALLORY -> ALICE,
// ALICE -> OWNER. So BOB's chat is between BOB and OWNER.
const seedDraw = (status: 'WAITING_FOR_DRAW' | 'DRAWED') =>
  env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'draws/d1'), {
      ownerUuid: OWNER,
      participantUuids: [OWNER, ALICE, BOB, MALLORY],
      status,
    });
    for (const [giver, recipient] of [
      [OWNER, BOB],
      [BOB, MALLORY],
      [MALLORY, ALICE],
      [ALICE, OWNER],
    ]) {
      await setDoc(doc(db, `draws/d1/assignments/${giver}`), {
        toUuid: recipient,
      });
    }
  });

const messages = (uid: string, chatOf = BOB) =>
  collection(authed(env, uid), `draws/d1/chats/${chatOf}/messages`);

const message = (from: 'santa' | 'recipient', extra = {}) => ({
  from,
  text: 'Hello',
  createdDate: serverTimestamp(),
  ...extra,
});

beforeEach(async () => {
  await env.clearFirestore();
});

describe('anonymous chat', () => {
  it('lets the Santa write as santa and the recipient as recipient after the draw', async () => {
    await seedDraw('DRAWED');
    await assertSucceeds(addDoc(messages(OWNER), message('santa')));
    await assertSucceeds(addDoc(messages(BOB), message('recipient')));
  });

  it('lets only the two sides read the chat, not the organizer or other players', async () => {
    await seedDraw('DRAWED');
    await assertSucceeds(addDoc(messages(OWNER), message('santa')));
    await assertSucceeds(getDocs(messages(OWNER)));
    await assertSucceeds(getDocs(messages(BOB)));
    // ALICE is somebody else's Santa/recipient; MALLORY is BOB's Santa's... neither.
    await assertFails(getDocs(messages(ALICE)));
    await assertFails(getDocs(messages(MALLORY)));
  });

  it('refuses posing as the other side', async () => {
    await seedDraw('DRAWED');
    await assertFails(addDoc(messages(BOB), message('santa')));
    await assertFails(addDoc(messages(OWNER), message('recipient')));
    await assertFails(addDoc(messages(ALICE), message('santa')));
    await assertFails(addDoc(messages(ALICE), message('recipient')));
  });

  it('refuses writes before the draw, long or empty text, extra fields and forged time', async () => {
    await seedDraw('WAITING_FOR_DRAW');
    await assertFails(addDoc(messages(BOB), message('recipient')));
    await seedDraw('DRAWED');
    await assertFails(
      addDoc(messages(BOB), message('recipient', { text: 'x'.repeat(501) })),
    );
    await assertFails(
      addDoc(messages(BOB), message('recipient', { text: '' })),
    );
    await assertFails(
      addDoc(messages(BOB), message('recipient', { senderUid: BOB })),
    );
    await assertFails(
      addDoc(messages(BOB), message('recipient', { createdDate: new Date(0) })),
    );
  });

  it('refuses editing and deleting messages', async () => {
    await seedDraw('DRAWED');
    const ref = await addDoc(messages(BOB), message('recipient'));
    const own = doc(authed(env, BOB), ref.path);
    await assertFails(updateDoc(own, { text: 'changed' }));
    await assertFails(deleteDoc(own));
  });
});
