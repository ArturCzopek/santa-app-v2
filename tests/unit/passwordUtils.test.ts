import { createHash } from 'crypto';
import { describe, expect, it } from 'vitest';
import { PasswordUtils } from '../../src/services/PasswordUtils';

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

describe('PasswordUtils.joinKey', () => {
  it('is sha256(drawId + ":" + sha256(password)), compatible with legacy hashes', async () => {
    // Old draws stored sha256(password); their migrated keys rely on this shape.
    const legacyHash = sha256('secret1');
    expect(await PasswordUtils.joinKey('draw-1', 'secret1')).toBe(
      sha256(`draw-1:${legacyHash}`),
    );
  });

  it('differs between draws for the same password', async () => {
    expect(await PasswordUtils.joinKey('draw-1', 'secret1')).not.toBe(
      await PasswordUtils.joinKey('draw-2', 'secret1'),
    );
  });
});
