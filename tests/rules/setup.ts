import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

export const PROJECT_ID = 'demo-santa-app';

export const createTestEnv = (): Promise<RulesTestEnvironment> =>
  initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });

export const OWNER = 'owner-uid';
export const ALICE = 'alice-uid';
export const BOB = 'bob-uid';
export const MALLORY = 'mallory-uid';

export const JOIN_KEY = 'a'.repeat(64);

export const authed = (env: RulesTestEnvironment, uid: string) =>
  env
    .authenticatedContext(uid, { name: `${uid} name`, picture: '' })
    .firestore();

type Db = ReturnType<typeof authed>;

export const newParticipant = (uid: string) => ({
  userName: `${uid} name`,
  userUuid: uid,
  userPhotoUrl: '',
  entryDate: serverTimestamp(),
  hasWish: false,
});

export const newDraw = (uid: string) => ({
  createdDate: serverTimestamp(),
  ownerUuid: uid,
  ownerName: `${uid} name`,
  ownerPhotoUrl: '',
  budget: 50,
  currency: 'PLN',
  drawName: 'Office party',
  description: 'Gifts!',
  participantUuids: [uid],
  status: 'WAITING_FOR_DRAW',
  drawDate: null,
});

export const createDraw = (
  db: Db,
  drawId: string,
  uid: string,
  overrides: Record<string, unknown> = {},
) => {
  const batch = writeBatch(db);
  batch.set(doc(db, `draws/${drawId}`), { ...newDraw(uid), ...overrides });
  batch.set(
    doc(db, `draws/${drawId}/participants/${uid}`),
    newParticipant(uid),
  );
  batch.set(doc(db, `draws/${drawId}/joinKeys/${JOIN_KEY}`), {
    createdDate: serverTimestamp(),
  });
  return batch.commit();
};

export const joinDraw = (
  db: Db,
  drawId: string,
  uid: string,
  joinKey = JOIN_KEY,
) => {
  const batch = writeBatch(db);
  batch.set(doc(db, `draws/${drawId}/participants/${uid}`), {
    ...newParticipant(uid),
    joinKey,
  });
  batch.update(doc(db, `draws/${drawId}`), {
    participantUuids: arrayUnion(uid),
  });
  return batch.commit();
};

// Writes a letter the way the app does: together with the hasWish mark.
export const writeLetter = (
  db: Db,
  drawId: string,
  uid: string,
  wish: string,
  hasWish = wish.length > 0,
) => {
  const batch = writeBatch(db);
  batch.set(doc(db, `draws/${drawId}/letters/${uid}`), { wish });
  batch.update(doc(db, `draws/${drawId}/participants/${uid}`), { hasWish });
  return batch.commit();
};
