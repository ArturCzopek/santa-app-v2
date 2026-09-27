import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ALICE, authed, BOB, createTestEnv, MALLORY, OWNER } from './setup';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createTestEnv();
});

afterAll(async () => {
  await env.cleanup();
});

const seedDraw = (status: 'WAITING_FOR_DRAW' | 'DRAWED', ownerPlays = true) =>
  env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'draws/d1'), {
      ownerUuid: OWNER,
      ownerPlays,
      participantUuids: [OWNER, ALICE, BOB, MALLORY],
      status,
    });
    for (const uid of [OWNER, ALICE, BOB, MALLORY]) {
      await setDoc(doc(db, `draws/d1/participants/${uid}`), {
        userUuid: uid,
        giftBought: false,
      });
    }
    const assignments = ownerPlays
      ? [
          [OWNER, BOB],
          [BOB, MALLORY],
          [MALLORY, ALICE],
          [ALICE, OWNER],
        ]
      : [
          [ALICE, BOB],
          [BOB, MALLORY],
          [MALLORY, ALICE],
        ];
    for (const [giver, recipient] of assignments) {
      await setDoc(doc(db, `draws/d1/assignments/${giver}`), {
        toUuid: recipient,
      });
    }
  });

beforeEach(async () => {
  await env.clearFirestore();
});

describe('gift bought', () => {
  it('lets a player with an assignment update only their own giftBought after the draw', async () => {
    await seedDraw('DRAWED');
    await assertSucceeds(
      updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
        giftBought: true,
      }),
    );
  });

  it('refuses giftBought before the draw', async () => {
    await seedDraw('WAITING_FOR_DRAW');
    await assertFails(
      updateDoc(doc(authed(env, ALICE), `draws/d1/participants/${ALICE}`), {
        giftBought: true,
      }),
    );
  });

  it('refuses another person’s document, non-booleans and other fields in the same write', async () => {
    await seedDraw('DRAWED');
    const db = authed(env, ALICE);
    await assertFails(
      updateDoc(doc(db, `draws/d1/participants/${BOB}`), {
        giftBought: true,
      }),
    );
    await assertFails(
      updateDoc(doc(db, `draws/d1/participants/${ALICE}`), {
        giftBought: 'yes',
      }),
    );
    await assertFails(
      updateDoc(doc(db, `draws/d1/participants/${ALICE}`), {
        giftBought: true,
        userName: 'Changed name',
      }),
    );
  });

  it('refuses the non-playing owner, who has no assignment', async () => {
    await seedDraw('DRAWED', false);
    await assertFails(
      updateDoc(doc(authed(env, OWNER), `draws/d1/participants/${OWNER}`), {
        giftBought: true,
      }),
    );
  });
});

describe('thanks', () => {
  it('lets the author create and update a thank-you after the draw', async () => {
    await seedDraw('DRAWED');
    const ref = doc(authed(env, ALICE), `draws/d1/thanks/${ALICE}`);
    await assertSucceeds(setDoc(ref, { text: 'Thank you!' }));
    await assertSucceeds(setDoc(ref, { text: 'Thank you very much!' }));
  });

  it('refuses thanks before the draw, over 500 characters, and writes by another user', async () => {
    await seedDraw('WAITING_FOR_DRAW');
    await assertFails(
      setDoc(doc(authed(env, ALICE), `draws/d1/thanks/${ALICE}`), {
        text: 'Thank you!',
      }),
    );

    await seedDraw('DRAWED');
    await assertFails(
      setDoc(doc(authed(env, ALICE), `draws/d1/thanks/${ALICE}`), {
        text: 'x'.repeat(501),
      }),
    );
    await assertFails(
      setDoc(doc(authed(env, BOB), `draws/d1/thanks/${ALICE}`), {
        text: 'Thank you!',
      }),
    );
  });

  it('lets the author and their Santa read it, but not the organizer or another participant', async () => {
    await seedDraw('DRAWED');
    await env.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), `draws/d1/thanks/${ALICE}`), {
        text: 'Thank you!',
      }),
    );
    await assertSucceeds(
      getDoc(doc(authed(env, ALICE), `draws/d1/thanks/${ALICE}`)),
    );
    await assertSucceeds(
      getDoc(doc(authed(env, MALLORY), `draws/d1/thanks/${ALICE}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, OWNER), `draws/d1/thanks/${ALICE}`)),
    );
    await assertFails(
      getDoc(doc(authed(env, BOB), `draws/d1/thanks/${ALICE}`)),
    );
  });

  it('refuses a thank-you from a non-playing owner', async () => {
    await seedDraw('DRAWED', false);
    await assertFails(
      setDoc(doc(authed(env, OWNER), `draws/d1/thanks/${OWNER}`), {
        text: 'Thank you!',
      }),
    );
  });
});
