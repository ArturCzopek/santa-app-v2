import { Pair } from '../models/Draw';

export type RandomInt = (maxExclusive: number) => number;

// Uniform random integer in [0, maxExclusive) from the browser's CSPRNG.
export const cryptoRandomInt: RandomInt = (maxExclusive) => {
  const range = 2 ** 32;
  const limit = range - (range % maxExclusive); // avoid modulo bias
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % maxExclusive;
};

// Fisher-Yates shuffle algorithm
export const shuffle = <T>(array: T[], randomInt: RandomInt): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const isValidDraw = (pairs: Pair[], participantUuids: string[]): boolean => {
  if (pairs.length !== participantUuids.length) return false;

  const fromUuids = new Set(pairs.map((p) => p.fromUuid));
  const toUuids = new Set(pairs.map((p) => p.toUuid));

  return (
    fromUuids.size === participantUuids.length &&
    toUuids.size === participantUuids.length &&
    [...fromUuids].every((uuid) => participantUuids.includes(uuid)) &&
    [...toUuids].every((uuid) => participantUuids.includes(uuid)) &&
    pairs.every((pair) => pair.fromUuid !== pair.toUuid)
  );
};

// Shuffles the participants into a single gift-giving circle, so everyone
// gives and receives exactly once and nobody draws themselves.
export const generatePairs = (
  participantUuids: string[],
  randomInt: RandomInt = cryptoRandomInt,
): Pair[] => {
  if (new Set(participantUuids).size < 2) {
    throw new Error('Unable to generate valid draw pairs');
  }

  const shuffledUuids = shuffle(participantUuids, randomInt);
  const pairs = shuffledUuids.map((uuid, index) => ({
    fromUuid: uuid,
    toUuid: shuffledUuids[(index + 1) % shuffledUuids.length],
  }));

  if (!isValidDraw(pairs, participantUuids)) {
    throw new Error('Unable to generate valid draw pairs');
  }
  return pairs;
};
