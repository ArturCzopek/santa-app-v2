import { describe, expect, it } from 'vitest';
import {
  cryptoRandomInt,
  generatePairs,
  isValidDraw,
} from '../../src/services/pairs';

const uuids = (count: number) =>
  Array.from({ length: count }, (_, i) => `user-${i}`);

describe('generatePairs', () => {
  it.each([2, 3, 5, 10, 50])(
    'with %i participants everyone gives and receives exactly once, never to themselves',
    (count) => {
      const participants = uuids(count);
      for (let run = 0; run < 200; run++) {
        const pairs = generatePairs(participants);
        expect(isValidDraw(pairs, participants)).toBe(true);
        expect(new Set(pairs.map((p) => p.fromUuid))).toEqual(new Set(participants));
        expect(new Set(pairs.map((p) => p.toUuid))).toEqual(new Set(participants));
        expect(pairs.some((p) => p.fromUuid === p.toUuid)).toBe(false);
      }
    },
  );

  it('rejects draws with fewer than two distinct participants', () => {
    expect(() => generatePairs([])).toThrow();
    expect(() => generatePairs(['solo'])).toThrow();
    expect(() => generatePairs(['same', 'same'])).toThrow();
  });

  it('does not always produce the same circle', () => {
    const participants = uuids(6);
    const results = new Set(
      Array.from({ length: 50 }, () =>
        JSON.stringify(generatePairs(participants)),
      ),
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it('uses the injected random source', () => {
    const alwaysZero = () => 0;
    expect(generatePairs(['a', 'b', 'c'], alwaysZero)).toEqual(
      generatePairs(['a', 'b', 'c'], alwaysZero),
    );
  });
});

describe('cryptoRandomInt', () => {
  it('stays within range and covers all values', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const value = cryptoRandomInt(5);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(5);
      seen.add(value);
    }
    expect(seen.size).toBe(5);
  });
});

describe('isValidDraw', () => {
  it('rejects self-gifting, duplicates and outsiders', () => {
    const people = ['a', 'b', 'c'];
    expect(
      isValidDraw(
        [
          { fromUuid: 'a', toUuid: 'a' },
          { fromUuid: 'b', toUuid: 'c' },
          { fromUuid: 'c', toUuid: 'b' },
        ],
        people,
      ),
    ).toBe(false);
    expect(
      isValidDraw(
        [
          { fromUuid: 'a', toUuid: 'b' },
          { fromUuid: 'b', toUuid: 'b' },
          { fromUuid: 'c', toUuid: 'a' },
        ],
        people,
      ),
    ).toBe(false);
    expect(
      isValidDraw(
        [
          { fromUuid: 'a', toUuid: 'b' },
          { fromUuid: 'b', toUuid: 'x' },
          { fromUuid: 'c', toUuid: 'a' },
        ],
        people,
      ),
    ).toBe(false);
  });
});
