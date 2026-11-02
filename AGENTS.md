# Agent roles

## Ownership

- **Claude is the lead agent** and owns architecture, technology, domain, security, product direction, and decisions that cross system boundaries.
- **Codex is the execution assistant.** Work from a clear task and acceptance criteria; keep changes within the assigned scope. Report risks and uncertain assumptions before expanding scope.

## Codex may complete independently

- Bounded CRUD and simple feature work with defined behavior and existing patterns.
- Tests, straightforward bug fixes, mechanical refactors, and documentation.
- UI changes with an explicit screen, interaction, and visual scope.
- Investigation and proposals for larger work; do not turn a finding into an unapproved architecture change.

Claude should delegate self-contained implementation tasks to Codex when the decision and expected behavior are already clear, especially routine CRUD, tests, small bug fixes, mechanical edits, docs, and bounded UI work.

## Delegation context

- Claude names the exact repository/checkout and base branch in every Codex handoff. Select that project/worktree explicitly when the tool offers a choice; a prompt alone does not select a Codex project.
- Before editing, Codex verifies `git rev-parse --show-toplevel` and `git status --short --branch`, then reports the repository root and branch. Stop before edits if they do not match the handoff. Preserve any existing uncommitted changes.
- Model, reasoning effort and the exact Codex command line are set on Artur's machine, in the gitignored `CLAUDE.local.md`, not in this public repo. Claude writes the handoff to a scratchpad file (repository and branch, context, scope and allowed files, out of scope, validation commands, report format; no commit, push or deploy) and runs it in the background as that file says. If the integration cannot set or confirm the chosen model and effort, tell Artur; do not imply that the preference was honored. Never claim a delegation that did not run.
- Fallback: if Codex still cannot do the task after at most three attempts (tool or sandbox failure, no file access, model unavailable), Claude implements it itself within the same scope and tells Artur plainly that it was not delegated and why.
- Claude does not edit Codex's files while it runs. Afterwards Claude reviews the diff, runs the validation itself, and reports to Artur separately: the handoff, Codex's result, Claude's review.
- `BACKLOG.md` is the repository's shared backlog. Claude owns prioritization and product decisions; Codex may update an item's status when its assigned work is verified, without broadening its scope.

## Public repository

This repository is public and the app is used by real people. Keep out of it: secrets and keys, business plans (pricing, revenue, accounting), personal machine and tool setup, and detailed security configuration. Those live outside the repo; the repo keeps the decision and its effect.

## Claude decision required

Ask Claude to decide before changing architecture, dependencies or hosting; authentication or authorization; Firestore rules or data shape; domain invariants or draw behavior; security/privacy promises; cross-boundary flows; or significant UX/product direction. Claude also owns difficult incidents and compatibility or migration decisions. Codex may implement an approved plan in a defined scope.

Codex must not independently change live Firebase settings, secrets, deployment behavior, or publish/deploy. Do not commit or push unless the task explicitly authorizes it.

## Before implementing a backlog item

Before any code changes, tell Artur what the item is: a short description of the feature or problem in plain words (what the user sees today, what changes, why), then the plan (files to touch, tests, what stays out of scope). Only then implement.

## Validation

- Run `npm run lint`, `npm run typecheck`, and `npm run build` for code changes.
- Run `npm test` for rules, services, components, and unit coverage; run `npm run test:e2e` when a user journey, routing, or responsive behavior changes.
- Changes to Firestore rules or domain invariants require emulator rule tests and Claude review. Never report a check as passed unless it was run.
- See the [development and validation details](README.md).
