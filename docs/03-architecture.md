# Architecture

How the app works inside: what runs where, where the data lives, and what happens at each
step of the [journey](01-how-it-works.md). Setup, environments, tests and deployment are in
the [README](../README.md).

## The big picture

```
 Browser (React app on GitHub Pages)
   │   Google sign-in (Firebase Auth, popup)
   │   reads and writes directly
   ▼
 Firestore ── firestore.rules decide every read and write
```

There is **no server of our own** ([D1](04-decisions.md)). The browser talks to Firebase
directly, and the security rules in [`firestore.rules`](../firestore.rules) are the only
thing that protects the data. That is why the rules carry most of the logic that would
normally sit in a backend (who may join, who may read a letter, that a result is written
once), and why they have the largest test suite (`tests/rules`).

- **App:** React 19, TypeScript, MUI 9, React Router with hash routes (`#/draw/…`, see
  [D2](04-decisions.md)), i18next with Polish and English (the language switch is in the footer).
- **Firebase:** Authentication (Google only) and Firestore. Free Spark plan: no Cloud
  Functions, so nothing runs on a server or on a schedule.
- **Hosting:** GitHub Pages. On pushes to `master`, GitHub Actions builds the app before
  deploying Firestore rules, then publishes the built app.

## Routes

| Route | Purpose and access |
|---|---|
| `#/` | Login and introduction; signed-in users are directed to their draws. |
| `#/draws` | Signed-in users' draws, create/join entry points and app counters. |
| `#/create` | Create a draw; requires sign-in. |
| `#/join/:drawId` | Invite details and joining; the route is public, but joining and draw data require sign-in. |
| `#/draw/:drawId` | Waiting-stage management or a participant's result; requires sign-in. |
| `#/help` | Public help page. |
| `#/privacy` | Public privacy page. |

## Data

Everything about one draw lives under `draws/{drawId}`. Each subcollection exists because
it has different readers:

| Path | Holds | Who reads it |
|---|---|---|
| `draws/{id}` | Name, description, budget, currency, date, place, owner, optional `ownerPlays` (missing means true), `participantUuids`, status, draw date | Anyone signed in who knows the id |
| `…/participants/{uid}` | Name and photo (must match the Google profile), `hasWish` | Participants |
| `…/letters/{uid}` | The letter to Santa, written by its author before the draw only | The author; after the draw also the one person who drew the author |
| `…/exclusions/{a}_{b}` | A pair who must not draw each other (`a < b`) | The owner, before the draw |
| `…/assignments/{uid}` | `toUuid`: whom `uid` buys for | Only `uid` |
| `…/joinKeys/{key}` | Proof of the password or of the invite link's key (a hash, never the secret) | The owner, to confirm the password when starting the draw; before the draw the owner may add keys and remove any but the current invite link's |
| `…/invite/link` | The invite link's key | Participants |
| `appData/stats` | App-wide counters of draws and results | Everyone signed in |
| `messages/{uid}_{date}` | Messages to the author, one per person per day | The author of the message (the app owner reads them in the Firebase console) |

Before the draw the owner can edit or delete it and take someone out, and participants can
leave; after it, the rules freeze the draw so every result stays valid.

## Rules the data follows

- A draw name is at most 80 characters and its description at most 1000; a wish is at most
  2000 characters and a feedback message at most 1000.
- A draw supports up to 100 participants and currencies `PLN`, `EUR`, `USD`, or `GBP`.
- The password form requires at least 6 characters. The owner stays a participant for management access, and `ownerPlays` decides whether they are included among the players; missing means `true` for older draws.
- Draw status moves from `WAITING_FOR_DRAW` to `DRAWED`; `DRAWED` is terminal.

## What happens at each step

**Creating a draw** (`CreatePage` -> `DrawService.createDraw`). One batch writes the draw
and the owner's participant document, the join key for the password and a first invite link.
The password itself is never stored: the join key is `sha256(drawId + ":" + sha256(password))`.

**Inviting** (`InviteDrawModal`). The link is `#/join/{id}?k={key}`, where the key is 128
random bits stored in `invite/link`. It sits in the URL fragment (after `#`), which browsers
never send to the web server. Replacing the link writes a new key and removes the old join
key, so the old link stops working while people who joined stay.

**Joining** (`JoinToDrawPage` -> `DrawService.joinToDraw`). The browser computes the join key
from the password or from the link's key and writes, in one batch, its own participant
document (carrying that join key) and its uid into `participantUuids`. The rules accept the
batch only if `joinKeys/{thatKey}` exists, so a wrong password shows up as a refused write.

**Writing a letter** (`UserWishSection`). A player writes `letters/{uid}` and, in the same
batch, `hasWish` in their participant document; the rules check that the two match. Other
participants see only "List gotowy" / "Bez listu", never the text.

**Exclusions** (`ExclusionsSection`). The pair's id is the two uids sorted and joined with
`_`, so A-B and B-A are the same document; the rules require `a < b` and refuse writing an
existing pair. Before saving, the app checks that a draw is still possible
(`isDrawPossible` in [`pairs.ts`](../src/services/pairs.ts)).

**Starting the draw** (`StartDrawModal` -> `DrawService.startDraw`). The owner types the
password, which the app checks against the join key (the invite link's key does not count,
so whoever has the link still cannot start the draw). Then the owner's browser:

1. reads the exclusions (only the owner may),
2. gets the players from `participantUuids` (excluding the owner only when `ownerPlays` is
   false; see `getDrawPlayers` in [`Draw.ts`](../src/models/Draw.ts)), then draws the pairs
   with `generatePairs`: first it looks for **one circle through everyone** (A -> B -> C -> A),
   which feels most like drawing from a hat; if exclusions make that impossible, it takes
   any valid set where everyone gives and receives exactly once. Exclusions involving a
   non-player are ignored. It never pairs anyone with themselves or with an excluded
   partner, and uses the browser's cryptographic random numbers,
3. writes, in one batch, the status change and one `assignments/{giver}` document per
   player, readable only by that giver.

From then on no browser holds the whole result.

**Setting a new password** (`SetPasswordModal` -> `DrawService.setDrawPassword`). In one batch
the owner removes every join key except the current invite link's and adds the key of the
new password, so the old password stops working, the new one starts the draw and lets
people join, and the link and everyone who joined stay.

**Opening the result** (`WinnerSection`, `SealedEnvelope`). A player reads
`assignments/{me}` and then the recipient's letter, which the rules allow only because of
that assignment. An organizer who opted out has no assignment or envelope. Whether the
envelope was opened is remembered in the browser's
`localStorage`, per draw and person (`services/envelope.ts`), and so is a letter being
written until it is saved (`services/letterDraft.ts`).

## Trade-offs and known limits

- The organizer's browser temporarily holds every pair ([D3](04-decisions.md#d3-the-pairs-are-drawn-in-the-organizers-browser-accepted)).
- Rules check assignment documents individually and do not prove the full result is a complete one-to-one matching ([F13](../BACKLOG.md)).
- Deleting a large waiting draw with many exclusions may exceed the 500-write batch limit ([F17](../BACKLOG.md)).
- Reads cast documents to types without runtime validation; schema changes needing migrations require a versioned script and compatibility tests with that change ([S9](../BACKLOG.md)).

## Where things are in the code

| Folder | What is there |
|---|---|
| `src/pages/` | One file per screen: `LoginPage`, `DrawsListPage`, `CreatePage`, `JoinToDrawPage`, `DrawPage`, `HelpPage`, `PrivacyPage` |
| `src/components/draw/` | Parts of the draw page: header, letter, envelope and result, participants, exclusions, invite, start/edit dialogs |
| `src/components/common/` | The design's building blocks: `PaperCard`, `Postmark`, `StampAvatar`, `ConfirmDialog` |
| `src/components/form/` | Form fields on paper, the password field, form buttons |
| `src/services/` | Everything that talks to Firebase (`DrawService`, `MessageService`, `AppDataService`), the pairing algorithm (`pairs.ts`), password hashing, in-app browser detection |
| `src/styles/theme.ts` | Colour tokens, fonts, the MUI theme, the focus ring |
| `src/i18n.ts` | All texts, Polish and English |
| `firestore.rules` | The security rules, i.e. the backend |
| `scripts/` | Test data for the emulators (`seedEmulators.mjs`) |
| `tests/` | `rules`, `services` (against emulators), `components` (React Testing Library), `unit` |
| `e2e/` | Playwright: the whole Secret Santa with several people, on desktop and phone |

`useAuth` and `useNotify` provide shared state; there is no global store. Services use
one-shot Firestore reads and writes, with no `onSnapshot` subscriptions. Firestore documents
are cast to TypeScript types without runtime shape validation.
