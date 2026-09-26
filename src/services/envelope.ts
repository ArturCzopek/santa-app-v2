import { storage } from './storage';

// Whether someone has opened their result envelope, kept in this browser:
// opening it is a one-time moment, and another device showing it sealed
// again does no harm.
const openedKey = (drawId: string, uid: string) =>
  `santa-app.envelope-opened.${drawId}.${uid}`;

export const wasEnvelopeOpened = (drawId: string, uid: string) =>
  storage.get(openedKey(drawId, uid)) === '1';

export const rememberEnvelopeOpened = (drawId: string, uid: string) =>
  storage.set(openedKey(drawId, uid), '1');
