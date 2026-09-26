# Domain model

This is the current behavior implemented in `src/models/Draw.ts`, `src/services/DrawService.ts`, `src/services/pairs.ts`, the UI, and `firestore.rules` (snapshot 2026-09-26). A product proposal in the backlog is not a domain rule until it is implemented and approved.

## People and roles

- **Organizer/owner:** the signed-in user who creates the draw. The owner is also the first participant and gets a normal assignment.
- **Participant:** a signed-in user who joined. Before draw, participants may invite others, write their own wish, and leave unless they are the owner. The owner may edit the draw, manage exclusions, remove another participant, rotate credentials, or delete the draw before it starts.
- **Guest:** may view public app pages. Joining requires Google sign-in. A signed-in user with a known draw ID can read draw-level details before joining; they cannot read the participant list or letters until rules allow it.

There is no owner-who-does-not-play mode. Account deletion and post-draw self-service deletion are not in the app.

## Draw lifecycle

```text
Create → WAITING_FOR_DRAW → DRAWED
```

`DRAWED` is terminal. A draw has at least two participants to start and supports up to 100 participant UIDs under the join rule. Core draw fields include the name (max 80), description (max 1000), positive budget, supported currency (`PLN`, `EUR`, `USD`, `GBP`), optional event date/place, owner, participants, creation/draw dates, and status.

## Invariants

| Concept | Current rule |
|---|---|
| Membership | A joining user adds only their own UID and participant document. Password or invite-link proof must resolve to an existing join-key document. |
| Identity | Participant display name and photo must match the signed-in Google token values checked by Firestore rules. |
| Wish | Each participant has one plain-text wish, max 2000 characters. Only its author can write it, and only before the draw. The participant's `hasWish` marker changes in the same batch. |
| Pairing | Each participant should give to and receive from exactly one other participant; no self-gifting; every configured exclusion forbids both directions. The client prefers one cycle through everyone and falls back to another matching if needed. |
| Exclusions | Symmetric pair, stored once using sorted UIDs. Only the owner can read/change them before draw. The client checks feasibility before saving and before start. |
| Results | One `assignments/{giverUid}` document per giver is intended. Each giver may read only their own assignment. The giver may read the recipient's wish only after the draw. |
| Frozen state | After the draw, draw details, membership, wishes, exclusions, assignments, and status cannot be changed through the client rules. |
| Password | Minimum length is 6 in the client form. The plaintext is not stored; the browser stores a SHA-256-derived document key, salted with draw ID. The password allows joining and is required for the owner to start. |
| Invite link | A fresh 128-bit random key is carried after `#` in the invite URL; it grants join access without typing the password. Participants can read/share the current link. Owner can rotate the link before draw. |
| Feedback | Up to one non-empty message per signed-in user per UTC day, max 1000 characters. Message docs are not listed/read in the app; the owner uses Firebase Console. |

`generatePairs` returns only if `isValidDraw` confirms a complete matching under these invariants; otherwise it throws. Current Firestore rules validate assignment documents one at a time and do not prove that a client submitted the complete matching. A modified client can bypass the algorithm, so see [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## Data visibility

- Draw details and `participantUuids` are readable by any signed-in user who knows the draw ID; listing draws is limited to a user's memberships.
- Participants can read participant documents (names, photos, `hasWish`). The actual wish text is a separate collection.
- Before draw, a wish is readable only by its author. After draw, the author and their assigned giver can read it. The organizer has no special access to letters.
- The owner alone reads exclusions and password join-key documents. A participant can read the current invite-link key to share the invite.
- Each giver reads only their result. The organizer's client temporarily sees every generated pair while starting the draw (accepted limitation).

## Local-only state and lifecycle

- An unsaved wish draft is stored per draw and UID in browser `localStorage` and is cleared on successful save or explicit discard.
- The opened-envelope flag is stored per draw and UID on that device; it is not synced between devices.
- The selected language is stored in the browser.
- The privacy policy currently describes only the opened-envelope flag as local storage; it does not mention drafts or language preference. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## Implemented versus proposed

Current: draw CRUD before start, leave/remove, password and invite-key rotation, exclusions, dates/place, calendar export, wish, result reveal, help/privacy pages, Polish and English UI, and one-a-day feedback.

Ideas still needing product/domain decisions include email-link sign-in, organizer non-participation, no-repeat pair history, anonymous chat, structured wishlists, bought/status tracking, push/email reminders, PWA, QR invitation, and monetization. See the shared [BACKLOG.md](../BACKLOG.md), and validate roadmap status against code before taking work from it.
