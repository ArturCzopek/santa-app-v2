// localStorage for small things kept in this browser. It can be unavailable
// (private mode, blocked site data); then nothing is kept and reads come
// back empty.
export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Not kept, then.
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing was kept.
    }
  },
};
