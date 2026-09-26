# Santa App V2

Secret Santa draws with friends, family or colleagues:
[arturczopek.github.io/santa-app-v2](https://arturczopek.github.io/santa-app-v2)

Sign in with Google, create a draw (name, description, budget, password),
share the invite link, let everybody write a wish, and start the draw. Each
person sees only who they buy a gift for, together with that person's wish.

**Author:** Artur Czopek · **License:** MIT

## Documentation

| Doc | Contents |
|---|---|
| [How the app works](docs/01-how-it-works.md) | The app from the user's side: roles, the journey step by step, every screen, what can be changed and when |
| [The design explained](docs/02-design.md) | Why it looks the way it does: the Christmas-mail idea, what each screen puts first, words, motion, accessibility |
| [Architecture](docs/03-architecture.md) | What runs where, the data and who can read it, what happens at each step, where things are in the code |
| [Decisions](docs/04-decisions.md) | Decision log: why X and not Y |
| [DESIGN.md](DESIGN.md) | The design system for building screens: colours, type, layout, components |
| [PRODUCT.md](PRODUCT.md) | Who the app is for and what success means |

This README covers setting up, running, testing and deploying.

## Tech stack

- React 19, TypeScript 6, Vite 8, MUI 9, React Router 8, i18next (Polish / English)
- Firebase 12: Authentication (Google) and Firestore - there is no own backend
- Tests: Vitest 4, React Testing Library, Playwright, Firebase emulators
- Hosting: GitHub Pages, deployed by GitHub Actions

## Environments

| Environment | Data | Sign-in | How to run |
|---|---|---|---|
| **Local** | Firebase emulators on your computer (fake project `demo-santa-app`) | Fake Google accounts | `npm run emulators` + `npm run dev:emulators` |
| **Staging** | Your dev Firebase project | Real Google | `npm run dev:staging` |
| **Production** | Production Firebase project | Real Google | Push to `master` (automatic deploy) |

Use local for everyday work and for trying things with many accounts; use
staging to check real Google sign-in before it reaches production.

## Getting started

Requirements: [Node.js 24 LTS](https://nodejs.org) (includes npm),
[Java 21+](https://adoptium.net) (the Firebase emulators need it) and Git.

```bash
git clone https://github.com/ArturCzopek/santa-app-v2.git
cd santa-app-v2
npm install
npx playwright install chromium   # only needed for the E2E tests
```

## Local development (emulators)

Two terminals:

```bash
npm run emulators        # terminal 1: Auth + Firestore emulators
npm run dev:emulators    # terminal 2: the app at http://localhost:5173
```

### Test data (`npm run emulators:seed`)

With the emulators running, one command sets up people and draws to click
through:

```bash
npm run emulators:seed
```

It creates six test Google accounts and two draws (password `test123`):

| Account | Testowa Wigilia (waiting) | Testowe Mikołajki (drawn) |
|---|---|---|
| Olga Organizatorka (`olga`) | owner, letter written | owner, letter written |
| Ania Test (`ania`) | letter written | letter written |
| Bartek Test (`bartek`) | letter written | letter written |
| Celina Test (`celina`) | letter written | letter written |
| Darek Test (`darek`) | no letter yet | – |
| Ewa Test (`ewa`) | no letter yet | – |

*Testowa Wigilia* also has a gift exchange date (the next Christmas Eve) and
place, and one exclusion: Ania and Bartek do not draw each other.

**Every run resets both test draws** to exactly this state: people who
joined, letters, results, exclusions and invite links from earlier runs are
removed first. Your other local draws are not touched. So after playing a
draw through, run the seed again to start over.

What you can try with it:

- **Organizer before the draw:** sign in as Olga, open *Testowa Wigilia* -
  invite, exclusions, edit or delete the draw, "Rozpocznij losowanie"
  (password `test123`). The dialog warns that Darek and Ewa have no letter.
- **Participant without a letter:** Darek or Ewa - write the first letter.
- **The result:** Ania, Bartek or Celina in *Testowe Mikołajki* - open the
  sealed envelope. Each sees only their own result.
- **Joining as a new person:** in the account picker choose "Add new account",
  then open `http://localhost:5173/#/join/seed-waiting` and type `test123`
  (or use the invite link Olga copies, which needs no password).

**Signing in:** "Zaloguj przez Google" opens the emulator's fake account
picker. Pick a seeded account or click "Add new account" to create any number
of new ones - no real Google account is involved. Faster, from the browser's
developer console (emulator mode only; the code is not in production builds):

```js
await window.__santaTest.signIn('ania', 'Ania Test')
```

A browser window is signed in as one person at a time; to act as several
people at once, use separate incognito windows or browser profiles.

How it works: the Auth emulator accepts unsigned Google tokens, so the seed
script and `__santaTest.signIn` sign in with a made-up token (name and
`<id>@example.com`), and the seed writes the draws straight to the Firestore
emulator, past the security rules.

### The local database

- Everything the app writes locally (accounts, draws, wishes, results) lives
  only in the emulators. Nothing is sent to a real Firebase project.
- The data is kept in the `.emulator-data/` folder in the project (ignored by
  git). It is loaded when `npm run emulators` starts and **saved when you
  stop the emulators with Ctrl+C** in their terminal.
- Closing the terminal window or killing the process does **not** save -
  changes since the last save are lost. To save without stopping, run
  `npm run emulators:save` in another terminal.
- `npm run emulators:reset` deletes the folder (emulators stopped), so the
  next start is empty.
- Tests (`npm test`, `npm run test:e2e`) start their own clean emulators and
  never read or change this data. They use the same ports, so stop
  `npm run emulators` before running tests.

## Staging (dev Firebase project)

Runs the app on your computer against the dev Firebase project, with real
Google sign-in.

One-time setup:

1. Copy `.env.staging.example` to `.env.staging` (ignored by git).
2. Fill it with the dev project's web app config: Firebase console ->
   dev project -> Project settings -> General -> Your apps -> Config.

Then:

```bash
npm run dev:staging      # the app at http://localhost:5173, using the dev project
```

The dev project's Firestore rules, indexes and data format are updated by
the deploy workflow on every push to `master`, before production (see
Deployment). Anything you do in staging uses real accounts and real data of
the dev project - not production.

## Checks and tests

```bash
npm run lint
npm run typecheck
npm test            # Firestore rules, services, components, unit (emulators)
npm run test:e2e    # Playwright end-to-end tests in real browsers (emulators)
```

CI (`.github/workflows/ci.yml`) runs all of them on pull requests and on
pushes to branches other than `master`.

## Deployment

Every push to `master` runs `.github/workflows/deploy.yml`:

1. All checks and tests (the CI workflow).
2. **Staging** (only when `FIREBASE_SERVICE_ACCOUNT_DEV` is set): deploy
   Firestore rules and indexes to the dev project.
3. **Production:** deploy Firestore rules and indexes, build the app and
   publish it to GitHub Pages.

If a step fails, the following steps do not run, so production is only
touched when the tests and staging passed. The workflow can also be started
by hand in the Actions tab, optionally creating a release tag.

Repository secrets (Settings -> Secrets and variables -> Actions):

| Secret | Purpose |
|---|---|
| `VITE_FIREBASE_*`, `VITE_APP_URL` | Production web app config, built into the app |
| `FIREBASE_SERVICE_ACCOUNT` | Service account key JSON of the production project |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | Service account key JSON of the dev project (enables staging) |

A key comes from Firebase console -> Project settings -> Service accounts ->
Generate new private key. The `firebase-adminsdk-...` account it belongs to
needs the **Firebase Admin** and **Service Usage Consumer** roles
(Google Cloud console -> IAM) to deploy rules; new roles can take a few
minutes to start working. Delete the downloaded key file after adding it as a
secret and never commit it.

## Security model

There is no backend: the browser talks to Firestore directly and
[`firestore.rules`](firestore.rules) is what protects the data (covered by
tests in `tests/rules`).

- `draws/{id}` - public draw info only (anyone signed in who knows the id).
  Before the draw the owner may edit its details or delete it with everything
  under it, or take one other participant out (with their letter), and
  participants other than the owner may leave; after the draw
  it does not change.
- `draws/{id}/participants/{uid}` - name, photo and whether the letter is
  written (`hasWish`), readable by participants; names/photos must match the
  Google profile.
- `draws/{id}/letters/{uid}` - the letter to Santa, readable only by its
  author and, after the draw, by the one person whose result is the author.
  Written only by the author, together with `hasWish`.
- `draws/{id}/exclusions/{a}_{b}` - pairs who must not draw each other; only
  the owner reads and changes them, before the draw.
- `draws/{id}/assignments/{uid}` - who `uid` gives a gift to, readable only by
  `uid`, written once when the owner starts the draw.
- `draws/{id}/joinKeys/{key}` - the join check; the key is
  `sha256(drawId + ":" + sha256(secret))`, where the secret is the password or
  the invite link's key, and is never readable by others. Before the draw the
  owner can replace the password's key with a new one ("Ustaw nowe hasło").
- `draws/{id}/invite/link` - the invite link's key (128 random bits), readable
  by participants so they can share the link. The link is
  `#/join/{id}?k={key}`; the key stays in the URL fragment, so it never reaches
  the web server. The owner can replace it, which retires the old key; people
  who already joined stay. The password is still needed to start the draw.
- `appData/stats`, `messages` - counters that only grow together with real
  draws, and at most one message per user per day.

Known trade-off: the owner's browser shuffles the pairs, so a determined
owner could look at the result in the browser's developer tools. Other
participants cannot.

## Maintenance

Deploy rules by hand (normally the workflow does it):

```bash
npx firebase login
npx firebase deploy --only firestore --project <project-id>
```

## Scripts

| Command | What it does |
|---|---|
| `npm run emulators` | Start local Auth + Firestore emulators (data kept in `.emulator-data/`) |
| `npm run emulators:seed` | Add test accounts and (re)set the two test draws in the running emulators |
| `npm run emulators:save` | Save emulator data without stopping |
| `npm run emulators:reset` | Delete saved emulator data |
| `npm run dev:emulators` | Run the app against the local emulators |
| `npm run dev:staging` | Run the app against the dev Firebase project (`.env.staging`) |
| `npm run build` | Production build into `build/` |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm test` | Rules, services, components and unit tests |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run deploy:rules` | Deploy Firestore rules/indexes to the project selected with `firebase use` |
