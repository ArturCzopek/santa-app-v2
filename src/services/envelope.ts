// Whether someone has opened their result envelope, kept in this browser:
// opening it is a one-time moment, and another device showing it sealed
// again does no harm.
const openedKey = (drawId: string, uid: string) =>
  `santa-app.envelope-opened.${drawId}.${uid}`;

export const wasEnvelopeOpened = (drawId: string, uid: string) => {
  try {
    return localStorage.getItem(openedKey(drawId, uid)) === '1';
  } catch {
    return false;
  }
};

export const rememberEnvelopeOpened = (drawId: string, uid: string) => {
  try {
    localStorage.setItem(openedKey(drawId, uid), '1');
  } catch {
    // Private mode: the envelope is sealed again next time, which is fine.
  }
};
