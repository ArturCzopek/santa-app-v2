import { storage } from './storage';

// The letter being written, kept in this browser until it is saved or
// thrown away, so a reload does not lose it.
export const letterDraft = (drawId: string, uid: string) => {
  const key = `santa-app.letter-draft.${drawId}.${uid}`;

  return {
    read: () => storage.get(key),
    write: (text: string) => storage.set(key, text),
    clear: () => storage.remove(key),
  };
};
