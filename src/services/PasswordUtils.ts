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
  // Secret carried by the invite link: 128 random bits, base64url.
  newInviteKey: (): string =>
    btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''),

  // Key stored as a document id in draws/{drawId}/joinKeys, for the password
  // and for the invite link's secret alike. Salted with the
  // draw id so the same password gives different keys in different draws.
  // Keys of old draws were migrated from sha256(password), so this shape
  // must stay or their passwords stop working.
  joinKey: async (drawId: string, password: string): Promise<string> =>
    sha256Hex(`${drawId}:${await sha256Hex(password)}`),
};
