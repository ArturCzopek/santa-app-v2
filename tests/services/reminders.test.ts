import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { sendDueReminders } from '../../functions/src/reminders';
import { PROJECT_ID } from '../rules/setup';

// The Admin SDK finds the emulators through these variables, which
// `firebase emulators:exec` sets; the defaults match firebase.json.
process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';

const app = getApps()[0] ?? initializeApp({ projectId: PROJECT_ID });
const db = getFirestore(app);
const auth = getAuth(app);

const NOW = new Date('2026-12-17T07:00:00Z'); // 7 days before 24 Dec
const LINK_BASE = 'https://example.com';

const seedUser = async (uid: string, email: string) => {
  await auth.createUser({ uid, email }).catch(() => undefined);
};

const seedDraw = async (
  id: string,
  fields: Record<string, unknown>,
  participants: Record<string, Record<string, unknown>>,
) => {
  await db.doc(`draws/${id}`).set({
    drawName: 'Test',
    budget: 50,
    currency: 'PLN',
    status: 'DRAWED',
    eventDate: '2026-12-24',
    ...fields,
  });
  for (const [uid, data] of Object.entries(participants)) {
    await db.doc(`draws/${id}/participants/${uid}`).set(data);
  }
};

beforeEach(async () => {
  const draws = await db.collection('draws').get();
  await Promise.all(draws.docs.map((d) => db.recursiveDelete(d.ref)));
  await seedUser('rem-a', 'a@example.com');
  await seedUser('rem-b', 'b@example.com');
});

describe('sendDueReminders', () => {
  it('mails only those who opted in, in their language, once', async () => {
    await seedDraw(
      'd1',
      {},
      {
        'rem-a': { remindByEmail: true, remindLang: 'en' },
        'rem-b': { remindByEmail: false },
      },
    );
    const send = vi.fn().mockResolvedValue(undefined);

    const first = await sendDueReminders(db, auth, send, NOW, LINK_BASE);
    expect(first).toEqual({ sent: 1, failed: 0 });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0].to).toBe('a@example.com');
    expect(send.mock.calls[0][0].subject).toContain('in a week');
    expect(send.mock.calls[0][0].text).toContain(`${LINK_BASE}/#/draw/d1`);
    expect((await db.doc('draws/d1').get()).data()?.remindersSent).toEqual([
      '7d',
    ]);

    await sendDueReminders(db, auth, send, NOW, LINK_BASE);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('ignores draws on other days and draws not yet drawn', async () => {
    await seedDraw(
      'later',
      { eventDate: '2026-12-31' },
      {
        'rem-a': { remindByEmail: true },
      },
    );
    await seedDraw(
      'waiting',
      { status: 'WAITING_FOR_DRAW' },
      {
        'rem-a': { remindByEmail: true },
      },
    );
    const send = vi.fn().mockResolvedValue(undefined);
    expect(await sendDueReminders(db, auth, send, NOW, LINK_BASE)).toEqual({
      sent: 0,
      failed: 0,
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('sends the one-day reminder after the week one and counts failures', async () => {
    await seedDraw(
      'd2',
      { remindersSent: ['7d'] },
      {
        'rem-a': { remindByEmail: true },
        'rem-b': { remindByEmail: true },
      },
    );
    const send = vi
      .fn()
      .mockRejectedValueOnce(new Error('smtp down'))
      .mockResolvedValue(undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const day = new Date('2026-12-23T07:00:00Z');
    expect(await sendDueReminders(db, auth, send, day, LINK_BASE)).toEqual({
      sent: 1,
      failed: 1,
    });
    expect((await db.doc('draws/d2').get()).data()?.remindersSent).toEqual([
      '7d',
      '1d',
    ]);
  });
});
