import { beforeEach, describe, expect, it } from 'vitest';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  LimitExceeded,
  PER_ADDRESS_LIMIT,
  PER_ADDRESS_WINDOW_MS,
  PER_DAY_LIMIT,
  takeLoginLinkSlot,
} from '../../functions/src/loginLimits';
import { PROJECT_ID } from '../rules/setup';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';

const db = getFirestore(
  getApps()[0] ?? initializeApp({ projectId: PROJECT_ID }),
);
const NOW = new Date('2026-12-01T10:00:00Z');

beforeEach(async () => {
  await db.recursiveDelete(db.collection('loginLinkLimits'));
});

describe('takeLoginLinkSlot', () => {
  it('lets an address have a few links, then refuses', async () => {
    for (let i = 0; i < PER_ADDRESS_LIMIT; i++) {
      await takeLoginLinkSlot(db, 'ania@example.com', NOW);
    }
    await expect(
      takeLoginLinkSlot(db, 'Ania@Example.com ', NOW),
    ).rejects.toMatchObject({ scope: 'address' });
    // Another address is not affected.
    await takeLoginLinkSlot(db, 'basia@example.com', NOW);
  });

  it('starts over when the window has passed', async () => {
    for (let i = 0; i < PER_ADDRESS_LIMIT; i++) {
      await takeLoginLinkSlot(db, 'ania@example.com', NOW);
    }
    await takeLoginLinkSlot(
      db,
      'ania@example.com',
      new Date(NOW.getTime() + PER_ADDRESS_WINDOW_MS + 1),
    );
  });

  it('stops everyone when the day is spent, and stores no plain address', async () => {
    await db.doc('loginLinkLimits/d_2026-12-01').set({ count: PER_DAY_LIMIT });
    const error = await takeLoginLinkSlot(db, 'ania@example.com', NOW).catch(
      (e) => e,
    );
    expect(error).toBeInstanceOf(LimitExceeded);
    expect(error.scope).toBe('global');

    const ids = (await db.collection('loginLinkLimits').get()).docs.map(
      (d) => d.id,
    );
    expect(ids.join()).not.toContain('ania');
  });
});
