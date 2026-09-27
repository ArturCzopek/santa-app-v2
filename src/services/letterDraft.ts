import { storage } from './storage';
import { Letter } from '../models/Draw';

// The letter being written, kept in this browser until it is saved or
// thrown away, so a reload does not lose it.
export const letterDraft = (drawId: string, uid: string) => {
  const key = `santa-app.letter-draft.${drawId}.${uid}`;

  return {
    read: (): Letter | null => {
      const draft = storage.get(key);
      if (draft === null) return null;

      try {
        const parsed: unknown = JSON.parse(draft);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'wish' in parsed &&
          typeof parsed.wish === 'string'
        ) {
          return {
            wish: parsed.wish,
            comment:
              'comment' in parsed && typeof parsed.comment === 'string'
                ? parsed.comment
                : '',
          };
        }
      } catch {
        // Existing drafts were plain wish text.
      }

      return { wish: draft, comment: '' };
    },
    write: (letter: Letter) => storage.set(key, JSON.stringify(letter)),
    clear: () => storage.remove(key),
  };
};
