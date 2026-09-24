import { describe, expect, it } from 'vitest';
import {
  blockingExclusions,
  cryptoRandomInt,
  Exclusion,
  generatePairs,
  isDrawPossible,
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
        expect(new Set(pairs.map((p) => p.fromUuid))).toEqual(
          new Set(participants),
        );
        expect(new Set(pairs.map((p) => p.toUuid))).toEqual(
          new Set(participants),
        );
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
    expect(generatePairs(['a', 'b', 'c'], [], alwaysZero)).toEqual(
      generatePairs(['a', 'b', 'c'], [], alwaysZero),
    );
  });
});

describe('exclusions', () => {
  it('never pairs excluded people, in either direction', () => {
    const participants = uuids(6);
    const exclusions: Exclusion[] = [
      ['user-0', 'user-1'],
      ['user-2', 'user-3'],
      ['user-4', 'user-5'],
    ];
    for (let run = 0; run < 300; run++) {
      const pairs = generatePairs(participants, exclusions);
      expect(isValidDraw(pairs, participants, exclusions)).toBe(true);
    }
  });

  it('still finds a draw when a single circle is impossible', () => {
    // 'a' and 'b' may only give to 'c' or 'd' and the other way round, so
    // the only draws are two swaps: a<->c/b<->d or a<->d/b<->c.
    const participants = ['a', 'b', 'c', 'd'];
    const exclusions: Exclusion[] = [
      ['a', 'b'],
      ['c', 'd'],
    ];
    for (let run = 0; run < 100; run++) {
      const pairs = generatePairs(participants, exclusions);
      expect(isValidDraw(pairs, participants, exclusions)).toBe(true);
    }
  });

  it('knows when the draw is impossible', () => {
    expect(isDrawPossible(['a', 'b'])).toBe(true);
    expect(isDrawPossible(['a', 'b'], [['a', 'b']])).toBe(false);
    // With three people, 'a' and 'b' would both have to give to 'c'.
    expect(isDrawPossible(['a', 'b', 'c'], [['a', 'b']])).toBe(false);
    expect(isDrawPossible(['a', 'b', 'c', 'd'], [['a', 'b']])).toBe(true);
    // 'a' is excluded with everyone else.
    expect(
      isDrawPossible(
        ['a', 'b', 'c', 'd'],
        [
          ['a', 'b'],
          ['a', 'c'],
          ['a', 'd'],
        ],
      ),
    ).toBe(false);
    expect(() => generatePairs(['a', 'b'], [['a', 'b']])).toThrow();
  });

  it('ignores exclusions of people who left the draw', () => {
    expect(isDrawPossible(['a', 'b'], [['a', 'gone']])).toBe(true);
    expect(generatePairs(['a', 'b'], [['a', 'gone']])).toHaveLength(2);
  });

  it('names the exclusions whose removal makes the draw possible', () => {
    expect(blockingExclusions(['a', 'b'], [['a', 'b']])).toEqual([['a', 'b']]);
    expect(
      blockingExclusions(
        ['a', 'b', 'c', 'd'],
        [
          ['a', 'b'],
          ['a', 'c'],
          ['a', 'd'],
        ],
      ),
    ).toHaveLength(3);
  });

  it('copes with 100 people and many exclusions quickly', () => {
    const participants = uuids(100);
    const exclusions: Exclusion[] = participants
      .slice(0, 98)
      .map((uuid, i) => [uuid, participants[i + 1]] as Exclusion);
    const started = Date.now();
    const pairs = generatePairs(participants, exclusions);
    expect(isValidDraw(pairs, participants, exclusions)).toBe(true);
    expect(Date.now() - started).toBeLessThan(2000);
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
