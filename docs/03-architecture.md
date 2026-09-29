# Architecture

How the app works inside: what runs where, where the data lives, and what happens at each
step of the [journey](01-how-it-works.md). Setup, environments, tests and deployment are in
the [README](../README.md).

## The big picture

```
 Browser (React app on GitHub Pages)
   │   Google sign-in (popup) or an email link (Firebase Auth)
   │   reads and writes directly
   ├── callable startDraw ──► Cloud Functions (europe-central2)
   ▼                             │
 Firestore ◄─────────────────────┘
```

There is **no server to manage**: Firebase hosts the app's callable Cloud Function. The
browser reads and writes Firestore directly for ordinary operations; its security rules
protect those requests. The draw function uses the Admin SDK, so it checks the owner, draw
state and player count itself before generating and writing the complete result in one
transaction.

- **App:** React 19, TypeScript, MUI 9, React Router with hash routes (`#/draw/…`, see
  [D2](04-decisions.md)), i18next with Polish and English (the language switch is in the footer).
- **Firebase:** Authentication (Google, or a sign-in link by email – [D38](04-decisions.md)),
  Firestore, and Cloud Functions v2 on the Blaze plan ([D40](04-decisions.md)). The draw
  callable runs in `europe-central2` on Node.js 22.
- **Hosting:** GitHub Pages. On pushes to `master`, GitHub Actions builds the app before
  deploying Firestore rules and Cloud Functions, then publishes the built app. `public/` contains the PWA
  manifest and install icons; there is no service worker.

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
| `#/admin/messages` | Read user messages; requires the verified admin account. |

## Search and link previews

index.html contains Polish page metadata, Open Graph and Twitter tags, JSON-LD, and a short
static introduction with FAQs inside #root. src/main.tsx mounts React with createRoot,
which replaces that fallback when the app starts. The hash router gives search engines one
indexable page, so its canonical URL is the GitHub Pages homepage.

The social preview image is public/og-image.png. Its HTML source and Playwright renderer are
in scripts/og-image.html and scripts/renderOgImage.mjs; regenerate it with
node scripts/renderOgImage.mjs.

## Data

Everything about one draw lives under `draws/{drawId}`. Each subcollection exists because
it has different readers:

| Path | Holds | Who reads it |
|---|---|---|
| `draws/{id}` | Name, description, budget, currency, date, place, owner, optional `ownerPlays` (missing means true), `participantUuids`, status, draw date | Anyone signed in who knows the id |
| `…/participants/{uid}` | Name and photo (must match the Google profile), `hasWish`, optional `giftBought` (missing means false) | Participants |
| `…/letters/{uid}` | `wish` (items joined by newlines; at most 10 items of 100 characters in the app), optional `comment` (up to 1000 characters); written by its author before the draw only | The author; after the draw also the one person who drew the author |
| `…/thanks/{uid}` | `text` (up to 500 characters), written by the recipient after the draw | The author and, after the draw, the person who drew the author |
| `…/exclusions/{a}_{b}` | A pair who must not draw each other (`a < b`) | The owner, before the draw |
| `…/assignments/{uid}` | `toUuid`: whom `uid` buys for | Only `uid` |
| `…/joinKeys/{key}` | Proof of the password or of the invite link's key (a hash, never the secret) | The owner, to confirm the password when starting the draw; before the draw the owner may add keys and remove any but the current invite link's |
| `…/invite/link` | The invite link's key | Participants |
| `appData/stats` | App-wide counters of draws and results | Everyone signed in |
| `messages/{uid}_{date}` | Messages to the author, one per person per day | The author (their own message) and the verified admin account (in the app) |

Before the draw the owner can edit or delete it and take someone out, and participants can
leave. After it, the draw, assignments and letters stay fixed; the post-draw gift status and
thanks can change as described below.

## Rules the data follows

- A draw name is at most 80 characters and its description at most 1000; `wish` is at most
  2000 characters and `comment` at most 1000; a thank-you is at most 500 and a feedback
  message at most 1000. In the app a wish has at most 10 items of 100 characters each. Older
  letters without `comment` read as an empty string, and existing wish lines load as items.
- A draw supports up to 100 participants and currencies `PLN`, `EUR`, `USD`, or `GBP`.
- The password form requires at least 6 characters. The owner stays a participant for management access, and `ownerPlays` decides whether they are included among the players; missing means `true` for older draws.
- Draw status moves from `WAITING_FOR_DRAW` to `DRAWED`; `DRAWED` is terminal. Only the server can start a draw or write assignments.

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
batch, `hasWish` in their participant document; the rules check that it matches whether the
letter has any items or a comment. Other participants see only "List gotowy" / "Bez listu",
never the text.

**Exclusions** (`ExclusionsSection`). The pair's id is the two uids sorted and joined with
`_`, so A-B and B-A are the same document; the rules require `a < b` and refuse writing an
existing pair. Before saving, the app checks that a draw is still possible
(`isDrawPossible` in [`pairs.ts`](../src/services/pairs.ts)).

**Starting the draw** (`StartDrawModal` -> `DrawService.startDraw` -> callable `startDraw`).
The owner types the password, which the app checks against the join key (the invite link's
key does not count). The client does inexpensive checks, then sends only the draw id to the
callable. In a Firestore transaction the function checks ownership, status and the player
count, reads the private exclusions, and calls the shared `generatePairs` algorithm. It first
looks for **one circle through everyone** (A -> B -> C -> A); if exclusions make that
impossible, it finds any valid one-to-one assignment. It writes the status, server timestamp,
one `assignments/{giver}` document per player and the `winnersCount` increment together. The
organizer's browser receives the draw date, never the pairs ([D41](04-decisions.md)).

**Marking a gift and thanking a Santa** (`WinnerSection`, `ParticipantsSection`). A player
updates only `giftBought` on their own participant document after the draw and only if they
have an assignment. Participants see that status and the organizer sees a count among
players; neither reveals whom the giver drew. A player writes `thanks/{uid}` for themselves.
Only they and the person whose assignment points to them can read the note; the organizer
cannot unless they are that person's Santa.

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

**Supporting the author** (`Footer`, `DrawPage`). Both places link to the
configured buycoffee.to profile; the draw page shows its link to participants
after the draw. Payments happen entirely on that external site; Santa App stores
no payment or click data and has no payment integration.

## Trade-offs and known limits

- The callable uses the Admin SDK and bypasses Firestore rules, so its owner and matching checks are the trusted boundary; clients cannot start draws or write assignments ([D41](04-decisions.md)).
- Large waiting-draw deletion handles many exclusions by deleting them in chunks first ([F17](../BACKLOG.md)).
- Reads cast documents to types without runtime validation; schema changes needing migrations require a versioned script and compatibility tests with that change ([S9](../BACKLOG.md)).

## Where things are in the code

| Folder | What is there |
|---|---|
| `src/pages/` | One file per screen: `LoginPage`, `DrawsListPage`, `CreatePage`, `JoinToDrawPage`, `DrawPage`, `HelpPage`, `PrivacyPage` |
| `src/components/draw/` | Parts of the draw page: header, letter, envelope and result, participants, exclusions, invite, start/edit dialogs |
| `src/components/common/` | The design's building blocks: `PaperCard`, `Postmark`, `StampAvatar`, `ConfirmDialog` |
| `src/components/form/` | Form fields on paper, the password field, form buttons |
| `src/services/` | Everything that talks to Firebase (`DrawService`, `MessageService`, `AppDataService`), the pairing algorithm (`pairs.ts`), password hashing, in-app browser detection |
| `functions/src/` | Callable server functions; the build copies the shared pairing algorithm here |
| `src/styles/theme.ts` | Colour tokens, fonts, the MUI theme, the focus ring |
| `src/i18n.ts` | All texts, Polish and English |
| `firestore.rules` | Client read/write authorization and validation rules |
| `scripts/` | Test data for the emulators (`seedEmulators.mjs`) |
| `tests/` | `rules`, `services` (against emulators), `components` (React Testing Library), `unit` |
| `e2e/` | Playwright: the whole Secret Santa with several people, on desktop and phone |

`useAuth` and `useNotify` provide shared state; there is no global store. Services use
one-shot Firestore reads and writes, with no `onSnapshot` subscriptions. Firestore documents
are cast to TypeScript types without runtime shape validation.
