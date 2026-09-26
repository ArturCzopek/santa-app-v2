# Known issues and risks

Findings from a static repository audit on 2026-09-26. This document records issues; it does not implement fixes. Priorities are relative and need Claude/product-owner review.

## Confirmed in repository code

### P1 — Pair secrecy and server-enforced validity depend on the organizer's client

The current `generatePairs` algorithm returns only a result that passes `isValidDraw`: it checks one giver and recipient per participant, no self-pair, no outsiders, and no excluded pair; otherwise it throws. So the ordinary client algorithm does guarantee a valid result when it returns successfully.

The system-level gap remains: `DrawService.startDraw` runs this algorithm in the organizer's browser, where a technically skilled or malicious organizer can inspect or alter the pairs. `firestore.rules` checks each assignment for owner, membership, and no self-assignment, but does not enforce a complete one-to-one matching. A modified client can submit an incomplete or duplicate result set and move the draw to `DRAWED`. This is the accepted confidentiality trade-off in [D3](04-decisions.md#d3-the-pairs-are-drawn-in-the-organizers-browser-accepted), with the additional integrity gap recorded here.

**Owner:** Claude. Decide whether the trust model is acceptable or whether a server-authoritative draw is required. Any remediation changes architecture, billing/hosting, and domain/security boundaries.

### P3 — Deleting a very large waiting draw can exceed one Firestore batch

`DrawService.deleteDraw` is available only before the draw; the rules forbid deleting a drawn result. A waiting draw has no assignments, but it can have participant documents, letters, and exclusions. Rules currently cap membership at 100, and a dense but still feasible exclusion set can make the single delete batch exceed the JavaScript SDK `WriteBatch` maximum of 500 writes. Firestore documents the limit in the [JavaScript API reference](https://firebase.google.com/docs/reference/js/firestore#writebatch). This is a rare large-group edge case, not a post-draw deletion issue.

**Priority:** low at the current scale. Keep deletion pre-draw only. Revisit batch strategy and matching rule semantics if large groups become a supported use case.

### P2 — Removing a participant does not revoke a password they know

Removing a participant deletes their documents, but keeps the draw password key. Rotating the invite link revokes its current link key only; it does not invalidate the separate password. Someone who joined with and knows the password can rejoin until the owner changes that password. The UI's removal guidance should be checked against this behavior.

**Decision:** the owner should be told that rotating the invite link does not change the password; if the removed person knows it, both credentials need rotation. This bounded UI copy/test task is recorded as Codex-ready F16 in [BACKLOG.md](../BACKLOG.md).

### P2 — Privacy policy omits local browser data

`src/pages/privacyPolicy.ts` says the app stores **only** the opened-envelope flag in `localStorage`. The code also stores unsaved wish drafts (`src/services/letterDraft.ts`) and language preference (`src/i18n.ts`). The draft may contain personal information and persists in that browser until saved or discarded. The policy also says deletion is available on request, while the app has no account-deletion flow; the operational request path is not documented in the repo.

**Owner:** Claude/product owner approves privacy promises. The factual PL/EN storage disclosure is marked Codex-ready in [BACKLOG.md](../BACKLOG.md); changes to legal basis, retention, or deletion promises still need owner review.

### P2 — Deployment changes production rules before building the app

`.github/workflows/deploy.yml` deploys staging rules, then production rules, and only afterwards runs `npm run build`. CI does not run the production build. If the build fails after production rules changed, the old published client may be incompatible with the new rules. The deploy precheck verifies the production project ID and service account, not every `VITE_FIREBASE_*` value.

**Owner:** Claude decides release sequencing and rollback expectations. First build and validate the production-configured app before any live rules changes. That reduces avoidable partial deploys but is not atomic across Firebase and GitHub Pages. For rules that require a new client, use an expand/contract rollout: deploy backward-compatible rules, publish the client, then tighten rules in a later release. Codex can implement an approved sequence.

### P3 — Migration discipline does not validate arbitrary Firestore documents at runtime

Services cast `DocumentSnapshot.data()` to TypeScript model types; strict type checking cannot validate stored document shape at runtime. This is not a blocker if schema changes include and test the required migrations. The F14 one-off migration was removed after rollout in commit `458ba21`; the current checkout has no reusable migration runner.

**Owner:** Claude owns schema and migration policy. For each change, keep any required migration and compatibility tests in the repository; a general runtime schema layer is a separate design choice, not an implied requirement.

## Roadmap and external state

The roadmap and outstanding items are now tracked in [`BACKLOG.md`](../BACKLOG.md). It includes security-console hardening (Firebase API-key HTTP referrers/authorized domains, optional App Check and CSP, least-privilege service account), email-link authentication, admin message review, server-side drawing, and product ideas. The checkout cannot verify actual Firebase/GCP console settings, deployed rules, GitHub secrets, data retention, or IAM roles. Treat those as unverified, not confirmed misconfigurations.

`PRODUCT.md` had a stale feature list during this audit and has been corrected to current behavior. Other decision-log entries are historical; later decisions may supersede them.

## Suggested order for follow-up

1. Claude reviews the P1 draw trust/integrity issue and decides the target security model; the current algorithm itself returns validated matchings.
2. Delegate the factual PL/EN privacy-policy update to Codex; Claude reviews legal/retention claims.
3. Delegate a clear participant-removal warning to Codex: rotating the invite key does not rotate the password; tell the owner when both credentials need changing.
4. Claude chooses a production rollout strategy; first build with production configuration, then use backward-compatible rule releases where client/rule changes are coupled.
5. Leave the rare delete-batch edge case low priority unless larger draws are part of the product target.
6. Delegate routine CRUD, focused tests, simple bugs, mechanical refactors, documentation, and bounded UI changes to Codex with behavior and acceptance criteria stated.
7. Treat email auth, admin access, server-side drawing, annual no-repeat, reminders, chat, wishlist expansion, and monetization as Claude-led decisions before implementation.

## Audit validation

`npm run lint`, `npm run typecheck`, and the Vite production build passed during this audit. Vitest and Playwright were not run; see [DEVELOPMENT.md](DEVELOPMENT.md) for test scope and counts.
