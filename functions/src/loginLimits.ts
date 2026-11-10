import { createHash } from 'crypto';
import { Firestore } from 'firebase-admin/firestore';

// Sending a mail to any address the caller names is what makes this function
// abusable, so it is limited twice: per address (nobody gets a pile of links)
// and per day overall (the shared free mailbox has a daily sending cap and the
// reminders need room too). Counters live in `loginLinkLimits`, which no client
// can read or write; addresses are stored only as hashes.
export const PER_ADDRESS_LIMIT = 3;
export const PER_ADDRESS_WINDOW_MS = 10 * 60 * 1000;
export const PER_DAY_LIMIT = 300;

export type LimitScope = 'address' | 'global';

export class LimitExceeded extends Error {
  constructor(readonly scope: LimitScope) {
    super(`Login link limit reached: ${scope}`);
  }
}

const hashAddress = (email: string) =>
  createHash('sha256').update(email.trim().toLowerCase()).digest('hex');

// Counts one more link or throws LimitExceeded. Nothing is counted when
// either limit is reached.
export const takeLoginLinkSlot = async (
  db: Firestore,
  email: string,
  now: Date,
): Promise<void> => {
  const collection = db.collection('loginLinkLimits');
  const addressRef = collection.doc(`a_${hashAddress(email)}`);
  const dayRef = collection.doc(`d_${now.toISOString().slice(0, 10)}`);

  await db.runTransaction(async (transaction) => {
    const [address, day] = await Promise.all([
      transaction.get(addressRef),
      transaction.get(dayRef),
    ]);

    const dayCount = (day.data()?.count as number | undefined) ?? 0;
    if (dayCount >= PER_DAY_LIMIT) throw new LimitExceeded('global');

    const since = address.data()?.since as number | undefined;
    const inWindow =
      since !== undefined && now.getTime() - since < PER_ADDRESS_WINDOW_MS;
    const addressCount = inWindow
      ? ((address.data()?.count as number | undefined) ?? 0)
      : 0;
    if (addressCount >= PER_ADDRESS_LIMIT) throw new LimitExceeded('address');

    transaction.set(addressRef, {
      count: addressCount + 1,
      since: inWindow ? since : now.getTime(),
    });
    transaction.set(dayRef, { count: dayCount + 1 });
  });
};
