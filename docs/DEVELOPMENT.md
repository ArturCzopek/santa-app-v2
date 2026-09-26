# Development

For product and architecture context, see [ARCHITECTURE.md](ARCHITECTURE.md) and [DOMAIN.md](DOMAIN.md). This page records commands and checks defined by the current repository.

## Requirements and configuration

- Node.js 24 and npm (the lockfile is `package-lock.json`).
- Java 21 or newer for Firebase emulators.
- Playwright Chromium for browser tests (`npx playwright install chromium`).
- `.env.emulators` contains fake values and enables local emulator connections. `.env.staging` is local, ignored by Git, and contains the dev Firebase web configuration; create it from `.env.staging.example`. Never put service-account JSON or other private credentials in the repo.
- Production web configuration and Firebase service-account credentials are GitHub Actions secrets. The `VITE_FIREBASE_*` web configuration is embedded in the browser bundle; Firestore rules, not secrecy of the web API key, are the data authorization boundary.

## Local workflows

```bash
npm install
npm run emulators       # Auth :9099, Firestore :8080; imports/exports .emulator-data
npm run dev:emulators   # Vite :5173, emulator mode
```

`npm run emulators:seed` resets the two named demo draws in the running emulator and creates six fake accounts. `npm run emulators:save` exports emulator state; `npm run emulators:reset` deletes the local export and should only be used when that local data is disposable.

For the real Google sign-in flow against the dev Firebase project, fill in `.env.staging` and run `npm run dev:staging`. This uses real dev-project data and accounts.

## Checks

| Command | What it covers |
|---|---|
| `npm run lint` | ESLint over the repository, with config-specific browser, Node, React and Hooks rules. |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.tests.json`; includes source, tests, E2E files and TypeScript config files. Strict mode is on, but `noImplicitAny` is explicitly off. |
| `npm run build` | Vite/Rolldown production bundle into `build/`. Vite transpiles but does not replace the separate TypeScript check. |
| `npm test` | Starts clean Auth/Firestore emulators with `firebase emulators:exec`, then runs Vitest: rule, service, component, and unit tests. Vitest uses one worker sequence because tests share an emulator. |
| `npm run test:e2e` | Starts emulators and Playwright; the configured desktop Chrome and Pixel 7 projects run serially. The E2E web server uses emulator mode on port 5173. |

The emulator-based test commands use ports 8080, 9099, and 5173. Stop manually started development emulators first. CI runs lint, typecheck, unit/rules/service/component tests, and E2E on pull requests and non-`master` branches. The deployment workflow invokes CI for `master`.

### Audit baseline (2026-09-26)

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Production bundle: passed when run as `npm run build -- --outDir .audit-build`; the temporary output was removed after inspection.
- Vitest and Playwright were not run during this documentation-only audit. Static inventory found 154 Vitest test declarations and 4 Playwright test declarations; this is not a test result.

## Deploy

Every push to `master` triggers the deploy workflow. It waits for CI, deploys Firestore rules and indexes to staging when the dev service-account secret is configured, deploys them to production, then builds and publishes `build/` to GitHub Pages. A manually started workflow may also create a release tag. Only the project owner/authorized release operator should change Firebase console configuration or run production deploys. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for a sequencing risk in the current workflow.
