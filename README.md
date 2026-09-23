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

### Tests

`npm test` runs the Firestore security rules tests (and unit tests) against
the emulator. Requires Java.

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

Deploy rules and indexes after changing them:

```bash
npx firebase login
npx firebase use --add
npm run deploy:rules
```

### Migrating draws created before the security update

```bash
node scripts/migrate.mjs path/to/service-account-key.json           # dry run
node scripts/migrate.mjs path/to/service-account-key.json --apply   # write
```

The key comes from Firebase console -> Project settings -> Service accounts.
Never commit it.
