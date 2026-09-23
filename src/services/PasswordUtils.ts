export const MIN_PASSWORD_LENGTH = 6;

const sha256Hex = async (text: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const PasswordUtils = {
  // Key stored as a document id in draws/{drawId}/joinKeys. Salted with the
  // draw id so the same password gives different keys in different draws.
  // The inner hash matches what older versions stored, which lets existing
  // draws be migrated without knowing their passwords.
  joinKey: async (drawId: string, password: string): Promise<string> =>
    sha256Hex(`${drawId}:${await sha256Hex(password)}`),
};
