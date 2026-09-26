# Architecture

This describes the repository as it exists on 2026-09-26. It is an engineering reference; the user journey is also described in [How the app works](01-how-it-works.md), and domain rules are in [DOMAIN.md](DOMAIN.md).

## Runtime shape

```text
Browser: React SPA (GitHub Pages)
  ├── Firebase Authentication (Google popup)
  └── Cloud Firestore (Firebase Web SDK, direct client access)
        └── firestore.rules enforce reads and writes
```

There is no application server, Cloud Function, or server-side job in this repository. The browser is an untrusted client. Firestore rules are therefore the authorization boundary; hiding a control in the UI is not access control.

## Application structure

| Area | Responsibility and main files |
|---|---|
| Entry and shell | `src/main.tsx` mounts React; `src/App.tsx` configures the MUI theme, global CSS, snowfall, error boundary, auth and notification providers. |
| Routing | `src/routes.tsx` uses `HashRouter` for GitHub Pages. `/draws`, `/create`, and `/draw/:drawId` require sign-in; `/join/:drawId`, `/help`, and `/privacy` are route-accessible without a session. Draw data still requires sign-in under Firestore rules. |
| Pages | `src/pages/` owns screen-level loading, form state, navigation, and page composition. `DrawPage` orchestrates most draw interactions. |
| Components | `src/components/draw/` contains draw-page sections and dialogs; `common/`, `form/`, `layout/`, and `navbar/` contain reusable UI. |
| Services | `src/services/DrawService.ts` performs Firestore draw operations; `AppDataService.ts` updates counters; `MessageService.ts` sends feedback. Other files contain pair generation, password hashing, calendar export, browser detection, and local storage helpers. |
| Shared state | `useAuth` provides the Firebase user and session-loading state; `useNotify` provides the app-wide snackbar. Other state is React component/page state. There is no Redux/Zustand/query-cache layer. |
| Models and presentation | `src/models/` contains TypeScript shapes; `src/i18n.ts` contains Polish and English text; `src/styles/theme.ts` and `DESIGN.md` define the visual system. |
| Policy boundary | `firestore.rules` is the backend authorization logic; `firestore.indexes.json` is the index configuration. `firebase.json` configures local Auth and Firestore emulators. |

Pages call service methods directly. The services use one-shot Firestore reads and writes; there are no `onSnapshot` subscriptions. A page refresh or an action-triggered refetch brings in other users' changes. Firestore documents are generally cast to TypeScript types at read time; TypeScript types do not validate stored documents at runtime.

## Routes and main flows

| Route | Access and purpose |
|---|---|
| `#/` | Login and introduction; signed-in users are directed to their draws. |
| `#/draws` | Signed-in user's draw list, create/join entry points, and app counters. |
| `#/create` | Create a draw. |
| `#/join/:drawId` | Invite details and join. Preserves this location through Google sign-in. An invite key is in the query portion of the hash URL. |
| `#/draw/:drawId` | Waiting-stage management or the signed-in participant's result. |
| `#/help`, `#/privacy` | Public help and privacy screens. |

The main user journey is: organizer creates a draw and becomes its first participant; participants join with a password or invite-link key; each writes a private letter; the organizer starts the draw; each participant reads only their own assignment and their recipient's letter. The complete states and invariants are in [DOMAIN.md](DOMAIN.md).

## Firestore layout and access

| Path | Data | Access enforced by rules |
|---|---|---|
| `draws/{id}` | Draw details, owner, participant UID list, status and dates | Any signed-in user can `get` a known ID; only participants can list it in their draws query. Owner edits/deletes before draw; allowed participants join/leave; owner starts once. |
| `participants/{uid}` | Display name/photo, join date, `hasWish`, plus a derived `joinKey` written by the client | Draw participants can read participant documents. User creates their own; only the user's `hasWish` can be updated before draw, in step with their letter. |
| `letters/{uid}` | Wish text | Author can read/write before draw; after draw the author and their assigned giver can read. |
| `exclusions/{a}_{b}` | A symmetric, sorted pair | Owner reads and changes before draw. |
| `joinKeys/{key}` | SHA-256-derived password or invite proof document | Owner reads; valid key existence is checked on join writes. |
| `invite/link` | Current invite key and its join-key reference | Participants can read/share; owner can replace before draw. |
| `assignments/{giverUid}` | Recipient UID | Only that giver can read. Owner can create assignment documents in the same batch as the status transition. Rules check membership and self-assignment but do not prove the whole set is complete or one-to-one. |
| `appData/stats` | Monotonic draw and participant-result counters | Signed-in read; rules constrain counter changes to a draw create/start batch. |
| `messages/{uid}_{UTC-date}` | Feedback to the author | Sender can get their document; create-only rule enforces one per UTC day and a 1000-character limit. Messages are read by the owner in Firebase Console. |

Details are in `firestore.rules`; tests under `tests/rules/` exercise much of this authorization contract. The full result is intentionally not stored in one readable document.

## Important implementation flows

- **Create:** `DrawService.createDraw` batches the draw, owner participant, password join key, invite key and aggregate counter.
- **Join:** the browser derives a join key and batches the participant document with the UID appended to `participantUuids`; rules check that the key exists and that the user is adding themselves.
- **Save wish:** `updateWish` batches the letter and its public `hasWish` marker.
- **Start:** the organizer's browser reads the exclusions, runs `generatePairs` from `src/services/pairs.ts`, and batches the status change, one assignment per giver, and counter increment.
- **Read result:** the browser reads `assignments/{currentUid}`, then reads the assigned recipient's letter. The letter rule permits that read only after the draw and only for that giver.
- **Local convenience state:** `src/services/letterDraft.ts` stores an unsaved letter by draw and UID; `envelope.ts` stores whether the envelope was opened; `i18n.ts` stores language choice. These use guarded `localStorage` access in `storage.ts`.

## Boundaries and design trade-offs

- Authentication is Google-only. `FirebaseConfig.ts` connects to local emulators only when `VITE_USE_EMULATORS=true`; other builds connect to the Firebase project selected by environment variables.
- The client and Firestore rules both express important behavior. Rules protect data, but not every multi-document domain invariant can be expressed there. The pairing algorithm itself runs only in the organizer's browser.
- The organizer's browser temporarily holds all pairs and can inspect or alter them. This is an accepted trade-off recorded in [decision D3](04-decisions.md#d3-the-pairs-are-drawn-in-the-organizers-browser-accepted); server-side drawing would change the hosting/billing/operations model.
- Firestore reads are cast to TypeScript types without runtime shape validation. The F14 one-off migration was removed after rollout in commit `458ba21`; there is no reusable migration runner in this checkout. Keep a versioned migration and compatibility tests with each schema change that needs them; migration discipline and runtime validation are separate concerns.
- The service layer is a set of Firebase operations, not a separate domain/application layer. Pages coordinate UI state and call services directly. This is the current implementation, not a claim that it is the ideal architecture.

## Environments and delivery

Local development and automated tests use Auth and Firestore emulators. Staging uses a local `.env.staging` file and the dev Firebase project. Production builds receive Firebase web configuration from GitHub Actions secrets and are published to GitHub Pages. `.github/workflows/ci.yml` runs lint, typecheck, Vitest, and Playwright; `.github/workflows/deploy.yml` deploys Firestore rules/indexes before building and publishing the app. See [DEVELOPMENT.md](DEVELOPMENT.md) and the delivery risk in [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
