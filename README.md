# Santa App V2

## About

**Santa App V2** is a Christmas-themed draw and messaging app built with React, Firebase, and Material UI.

- **Author**: Artur Czopek
- **Technologies**:
  - React 18
  - Firebase
  - Material UI
  - TypeScript

## Developer Setup

### Prerequisites

1. **Install Node.js 24 LTS** (comes with npm). Java 21+ is needed for the
   Firebase emulators (tests and local development).

2. **Create a Firebase project**:
   - Enable **Google Authentication**.
   - Set up **Firestore Database**.
   - Enable **Analytics** for logging.

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/santa-app-v2.git
   cd santa-app-v2
   ```
2. Install dependencies:

`npm install`

3. Configure Firebase:
   Go to Firebase Console.
   Copy your Firebase project configuration (API Key, Auth Domain, etc.).
   Create a .env file in the root of the project and add the following:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_URL=http://localhost:5173 # path to your application, without '/' at the end!
```

4. Run the app: To start the development server, run:

`npm run dev`

### Local development without a Firebase project

Requires Java (for the emulators). In two terminals:

```bash
npm run emulators       # Auth + Firestore emulators, fake demo project
npm run dev:emulators   # the app, connected to the emulators
```

Data is kept between runs in `.emulator-data/` (saved when the emulators
stop with Ctrl+C). `npm run emulators:save` saves while they run,
`npm run emulators:reset` starts from scratch. Tests always use a clean,
separate emulator run and never touch this data.

`npm run emulators:seed` (with the emulators running) adds six test Google
accounts and two draws (password `test123`): one waiting to be drawn and one
already drawn.

Sign-in opens the emulator's fake Google account picker, where the seeded
accounts are listed and any number of new test accounts can be added. To be signed in as several people at once,
use separate incognito windows or browser profiles.

### Staging (dev Firebase project)

For real Google sign-in without touching production: copy
`.env.staging.example` to `.env.staging`, fill in the dev project's web app
config and run `npm run dev:staging`. The deploy workflow keeps the dev
project's rules and data format up to date when the
`FIREBASE_SERVICE_ACCOUNT_DEV` secret is set.

### Checks and tests

All need Java (they start the Firebase emulators).

```bash
npm run lint
npm run typecheck
npm test           # rules, services, components, unit, migration
npm run test:e2e   # Playwright; first time: npx playwright install chromium
```

CI (`.github/workflows/ci.yml`) runs all of them on pull requests and
branches.

## Deployment

Pushing to `master` deploys automatically (`.github/workflows/deploy.yml`):
all checks, then migration of old draws (no-op once done), Firestore rules
and indexes, and the app on GitHub Pages. It can also be started by hand
from the Actions tab, optionally with a release tag.

Required repository secrets: the `VITE_FIREBASE_*` / `VITE_APP_URL` values
and `FIREBASE_SERVICE_ACCOUNT` - a service account key JSON (Firebase console
-> Project settings -> Service accounts -> Generate new private key). The
account needs the "Firebase Admin" and "Service Usage Consumer" roles in
Google Cloud IAM to deploy rules. Optional `FIREBASE_SERVICE_ACCOUNT_DEV`
(same, for the dev project) enables staging, deployed before production.

## Security model

There is no backend: the browser talks to Firestore directly and
[`firestore.rules`](firestore.rules) is what protects the data.

- `draws/{id}` - public draw info only (anyone signed in who knows the id).
- `draws/{id}/participants/{uid}` - name and wish, readable by participants,
  only the user can change their own wish.
- `draws/{id}/assignments/{uid}` - who `uid` gives a gift to, readable only by
  `uid`, written once when the owner starts the draw.
- `draws/{id}/joinKeys/{key}` - the password check; the key is
  `sha256(drawId + ":" + sha256(password))`, never readable by others.

Rules and indexes are deployed by the deploy workflow. To do it by hand:

```bash
npx firebase login
npx firebase use --add
npm run deploy:rules
```

### Migrating draws created before the security update

The deploy workflow runs this on every deploy. By hand (dry run unless
`--apply`; never commit the key):

```bash
node scripts/migrate.mjs path/to/service-account-key.json
node scripts/migrate.mjs path/to/service-account-key.json --apply
```
