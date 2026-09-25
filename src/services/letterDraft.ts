// The letter being written, kept in this browser until it is saved or
// thrown away, so a reload does not lose it. Storage can be unavailable
// (private mode, blocked site data); then there is simply no draft.
export const letterDraft = (drawId: string, uid: string) => {
  const key = `santa-app.letter-draft.${drawId}.${uid}`;

  return {
    read: (): string | null => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    write: (text: string) => {
      try {
        localStorage.setItem(key, text);
      } catch {
        // No draft, then.
      }
    },
    clear: () => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Nothing was kept.
      }
    },
  };
};
