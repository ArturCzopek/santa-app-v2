// Fills the running local emulators (npm run emulators) with test accounts
// and draws, so multi-person flows can be tried without clicking everything
// together. Run: npm run emulators:seed
//
// Accounts show up in the emulator's Google sign-in picker. Draw password
// for all seeded draws: test123
import { createHash, randomInt } from 'crypto';

const PROJECT_ID = 'demo-santa-app';
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const PASSWORD = 'test123';

const PEOPLE = [
  ['olga', 'Olga Organizatorka'],
  ['ania', 'Ania Test'],
  ['bartek', 'Bartek Test'],
  ['celina', 'Celina Test'],
  ['darek', 'Darek Test'],
  ['ewa', 'Ewa Test'],
];

const WISHES = {
  olga: 'Książka o górach',
  ania: 'Skarpetki w renifery',
  bartek: 'Dobra kawa ziarnista',
  celina: 'Puzzle 1000 elementów',
};

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const check = async (response, what) => {
  if (!response.ok) {
    throw new Error(`${what} failed (${response.status}): ${await response.text()}`);
  }
  return response.json();
};

// Signs in through the emulator with an unsigned Google token; creates the
// account on first use and returns the same uid afterwards.
const googleAccount = async (sub, name) => {
  const idToken = JSON.stringify({
    sub,
    name,
    email: `${sub}@example.com`,
    email_verified: true,
  });
  const body = {
    postBody: `id_token=${encodeURIComponent(idToken)}&providerId=google.com`,
    requestUri: 'http://localhost',
    returnSecureToken: true,
  };
  const result = await check(
    await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=fake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    `Account ${sub}`,
  );
  return { uid: result.localId, sub, name };
};

// Firestore REST value encoding for the few types we need.
const value = (v) => {
  if (v === null) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(value) } };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'object') return { mapValue: { fields: fields(v) } };
  return { stringValue: String(v) };
};
const fields = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, value(v)]));

// "Bearer owner" bypasses security rules in the emulator.
const setDoc = async (path, data) =>
  check(
    await fetch(`${FIRESTORE}/${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
      body: JSON.stringify({ fields: fields(data) }),
    }),
    `Write ${path}`,
  );

const shuffledCircle = (uids) => {
  const shuffled = [...uids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((from, i) => [from, shuffled[(i + 1) % shuffled.length]]);
};

const seedDraw = async (drawId, name, owner, people, drawn) => {
  const now = new Date();
  await setDoc(`draws/${drawId}`, {
    createdDate: now,
    ownerUuid: owner.uid,
    ownerName: owner.name,
    ownerPhotoUrl: '',
    budget: 100,
    currency: 'PLN',
    drawName: name,
    description: 'Losowanie testowe z npm run emulators:seed. Hasło: test123',
    participantUuids: people.map((p) => p.uid),
    status: drawn ? 'DRAWED' : 'WAITING_FOR_DRAW',
    drawDate: drawn ? now : null,
  });
  await setDoc(`draws/${drawId}/joinKeys/${sha256(`${drawId}:${sha256(PASSWORD)}`)}`, {
    createdDate: now,
  });
  for (const person of people) {
    await setDoc(`draws/${drawId}/participants/${person.uid}`, {
      userName: person.name,
      userUuid: person.uid,
      userPhotoUrl: '',
      entryDate: now,
      wish: WISHES[person.sub] ?? '',
    });
  }
  if (drawn) {
    for (const [from, to] of shuffledCircle(people.map((p) => p.uid))) {
      await setDoc(`draws/${drawId}/assignments/${from}`, { toUuid: to });
    }
  }
};

try {
  await fetch(`${AUTH}/`);
} catch {
  console.error('Emulators are not running. Start them first: npm run emulators');
  process.exit(1);
}

const people = [];
for (const [sub, name] of PEOPLE) people.push(await googleAccount(sub, name));
const [owner] = people;

await seedDraw('seed-waiting', 'Testowa Wigilia (czeka na losowanie)', owner, people, false);
await seedDraw('seed-drawn', 'Testowe Mikołajki (rozlosowane)', owner, people.slice(0, 4), true);

console.log(`Accounts (pick them in the Google sign-in window):`);
for (const p of people) console.log(`  ${p.name.padEnd(20)} ${p.sub}@example.com`);
console.log(`\nDraws (password ${PASSWORD}):`);
console.log(`  Testowa Wigilia – all 6 people, waiting; Olga can start it`);
console.log(`  Testowe Mikołajki – Olga, Ania, Bartek, Celina; already drawn`);
console.log(`Join link for new accounts: http://localhost:5173/#/join/seed-waiting`);
