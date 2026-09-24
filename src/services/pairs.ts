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

// Two people who must not draw each other (either way), e.g. a couple.
export type Exclusion = [string, string];

const excludedSet = (exclusions: Exclusion[]) =>
  new Set(exclusions.flatMap(([a, b]) => [`${a}>${b}`, `${b}>${a}`]));

const allowedFor = (exclusions: Exclusion[]) => {
  const excluded = excludedSet(exclusions);
  return (from: string, to: string) =>
    from !== to && !excluded.has(`${from}>${to}`);
};

export const isValidDraw = (
  pairs: Pair[],
  participantUuids: string[],
  exclusions: Exclusion[] = [],
): boolean => {
  if (pairs.length !== participantUuids.length) return false;

  const fromUuids = new Set(pairs.map((p) => p.fromUuid));
  const toUuids = new Set(pairs.map((p) => p.toUuid));
  const allowed = allowedFor(exclusions);

  return (
    fromUuids.size === participantUuids.length &&
    toUuids.size === participantUuids.length &&
    [...fromUuids].every((uuid) => participantUuids.includes(uuid)) &&
    [...toUuids].every((uuid) => participantUuids.includes(uuid)) &&
    pairs.every((pair) => allowed(pair.fromUuid, pair.toUuid))
  );
};

// Everyone gets a different recipient among the allowed ones: a perfect
// matching between givers and recipients (Kuhn's augmenting paths). The
// order of the candidates is shuffled, so the result is random too.
const findMatching = (
  participants: string[],
  allowed: (from: string, to: string) => boolean,
  randomInt: RandomInt,
): Pair[] | null => {
  const recipientOf = new Map<string, string>();
  const giverOf = new Map<string, string>();
  const candidates = new Map(
    participants.map((from) => [
      from,
      shuffle(
        participants.filter((to) => allowed(from, to)),
        randomInt,
      ),
    ]),
  );

  const tryAssign = (from: string, visited: Set<string>): boolean => {
    for (const to of candidates.get(from)!) {
      if (visited.has(to)) continue;
      visited.add(to);
      const currentGiver = giverOf.get(to);
      if (currentGiver === undefined || tryAssign(currentGiver, visited)) {
        recipientOf.set(from, to);
        giverOf.set(to, from);
        return true;
      }
    }
    return false;
  };

  for (const from of shuffle(participants, randomInt)) {
    if (!tryAssign(from, new Set())) return null;
  }
  return participants.map((from) => ({
    fromUuid: from,
    toUuid: recipientOf.get(from)!,
  }));
};

// One gift-giving circle through everyone, found by a depth-first search
// with a step limit (a circle is hard to find when many pairs are excluded).
const findCircle = (
  participants: string[],
  allowed: (from: string, to: string) => boolean,
  randomInt: RandomInt,
): Pair[] | null => {
  const order = shuffle(participants, randomInt);
  const [start] = order;
  const path = [start];
  const used = new Set(path);
  let steps = 0;

  const extend = (): boolean => {
    if (++steps > 20_000) return false;
    const last = path[path.length - 1];
    if (path.length === order.length) return allowed(last, start);
    for (const next of shuffle(order, randomInt)) {
      if (used.has(next) || !allowed(last, next)) continue;
      path.push(next);
      used.add(next);
      if (extend()) return true;
      path.pop();
      used.delete(next);
    }
    return false;
  };

  if (!extend()) return null;
  return path.map((uuid, index) => ({
    fromUuid: uuid,
    toUuid: path[(index + 1) % path.length],
  }));
};

// Only exclusions between people still in the draw count.
const relevant = (participantUuids: string[], exclusions: Exclusion[]) =>
  exclusions.filter(
    ([a, b]) => participantUuids.includes(a) && participantUuids.includes(b),
  );

// Whether the draw can happen with these exclusions.
export const isDrawPossible = (
  participantUuids: string[],
  exclusions: Exclusion[] = [],
): boolean =>
  new Set(participantUuids).size >= 2 &&
  findMatching(
    participantUuids,
    allowedFor(relevant(participantUuids, exclusions)),
    () => 0,
  ) !== null;

// When the draw is impossible: the exclusions whose removal alone would
// make it possible (empty if more than one has to go).
export const blockingExclusions = (
  participantUuids: string[],
  exclusions: Exclusion[],
): Exclusion[] => {
  const current = relevant(participantUuids, exclusions);
  return current.filter((exclusion) =>
    isDrawPossible(
      participantUuids,
      current.filter((other) => other !== exclusion),
    ),
  );
};

// Pairs everyone up so that each person gives and receives exactly once,
// never to themselves or to someone they are excluded with. One circle
// through everyone when possible, otherwise any valid set of pairs.
export const generatePairs = (
  participantUuids: string[],
  exclusions: Exclusion[] = [],
  randomInt: RandomInt = cryptoRandomInt,
): Pair[] => {
  if (new Set(participantUuids).size < 2) {
    throw new Error('Unable to generate valid draw pairs');
  }

  const current = relevant(participantUuids, exclusions);
  const allowed = allowedFor(current);
  const pairs =
    findCircle(participantUuids, allowed, randomInt) ??
    findMatching(participantUuids, allowed, randomInt);

  if (!pairs || !isValidDraw(pairs, participantUuids, current)) {
    throw new Error('Unable to generate valid draw pairs');
  }
  return pairs;
};
