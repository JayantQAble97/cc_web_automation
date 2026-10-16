# package.json — Scripts & Dependencies

Reference for everything declared in [`package.json`](package.json): what each dependency is for, what every npm script runs, and how to use them. For the underlying `PROJECT`/`CLIENT` mechanics these scripts wrap, see [USER_GUIDE.md](USER_GUIDE.md) and [config/README.md](config/README.md).

## Package metadata

| Field | Value | Note |
|---|---|---|
| `name` / `version` | `poc` / `1.0.0` | Internal test-automation repo, never published to a registry (`"private": true`) |
| `main` | `env.js` | Stale — this file doesn't exist in the repo. Harmless (nothing `require()`s this package as a module), but don't rely on it. |
| `type` | `commonjs` | `.js` files (e.g. `send-report-email.js`) use `require`/`module.exports`; `.ts` files use `ts-node`/Playwright's own TS support instead of this field |
| `directories.test` | `tests` | Metadata only — Playwright's actual test discovery is controlled by `testDir` logic in `playwright.config.ts` (product-based: `TripStacc/tests` or `ShopStacc/tests`), not by this field |

## Dependencies

| Package | Type | Purpose |
|---|---|---|
| `@playwright/test` | dev | The test runner and browser automation library everything in this repo is built on |
| `@types/node` | dev | TypeScript types for Node built-ins (`process`, `fs`, etc.) used in config/helpers |
| `cross-env` | dev | Sets environment variables (`PROJECT`, `CLIENT`, `HEADED`, ...) in an npm script in a way that works on both macOS/Linux and Windows shells |
| `dotenv` | dev | Loads `.env` files, if present, for local environment configuration |
| `nodemailer` | dev | Sends the email test report (`utils/send-report-email.js`, `npm run mail`) |
| `undici-types` | prod | Type definitions pulled in transitively; not used directly in this repo's own code |

## Scripts

### Reporting

| Script | Runs | Purpose |
|---|---|---|
| `test` | `npx playwright test` | Runs the suite with whatever `PROJECT`/`CLIENT` are already set in the shell — no defaults are applied, so `PROJECT` must be exported first (see the product-specific scripts below for the normal way to run) |
| `report` | `npx playwright show-report` | Opens the last run's HTML report |
| `report:generate` | `node .github/scripts/generate-report-summary.js reports/test-results.json reports/email-summary.txt` | Parses the JSON reporter output into a plain-text pass/fail summary |
| `mail` | `node utils/send-report-email.js` | Emails that summary (see [utils/README.md](utils/README.md#note-on-secrets) — SMTP credentials are currently hardcoded in this script, a known issue) |
| `report:mail` | `report:generate` then `mail` | Convenience combination of the two above |

### TripStacc

Every TripStacc script hardcodes `PROJECT` (browser + environment) and `CLIENT` (`BOB` or `IDFC`), and targets `TripStacc/tests`.

| Script | Client | Env | Browser | Mode |
|---|---|---|---|---|
| `test:tripstacc:bob:qa` / `test:tripstacc:idfc:qa` | BOB / IDFC | QA | Chrome | headless |
| `test:tripstacc:bob:uat` / `test:tripstacc:idfc:uat` | BOB / IDFC | UAT | Chrome | headless |
| `test:tripstacc:bob:uat:headed` / `test:tripstacc:idfc:uat:headed` | BOB / IDFC | UAT | Chrome | headed |
| `test:tripstacc:bob:uat:firefox:headed` / `test:tripstacc:idfc:uat:firefox:headed` | BOB / IDFC | UAT | Firefox | headed |
| `test:tripstacc:bob:uat:webkit:headed` / `test:tripstacc:idfc:uat:webkit:headed` | BOB / IDFC | UAT | WebKit | headed |
| `test:tripstacc:bob:uat:mobile:iphone13:headed` / `test:tripstacc:idfc:uat:mobile:iphone13:headed` | BOB / IDFC | UAT | Chrome, iPhone13 emulation | headed |
| `test:tripstacc:bob:uat:loginpage:headed` | BOB | UAT | Chrome, `@loginpage`-tagged only | headed |

Grid / LambdaTest variants (see [utils/README.md](utils/README.md) `lambdaGrid.ts`/`testBase.ts`):

| Script | What it adds |
|---|---|
| `test:tripstacc:bob:uat:local` | Explicit `IS_GRID=false` (same as omitting it) — runs local browsers |
| `test:tripstacc:bob:uat:grid` | `IS_GRID=true` — runs against the LambdaTest desktop/emulated grid instead of local browsers |
| `test:tripstacc:bob:uat:grid:loginpage` | Grid run, `@loginpage`-tagged only |
| `test:tripstacc:bob:uat:grid:multitag` | Grid run, filtered with `--grep "@Loginpage\|@Hotel"` |
| `test:tripstacc:bob:uat:grid:android:real` | Real Android hardware via LambdaTest (`LAMBDA_REAL_DEVICE=true`, `LAMBDA_PLATFORM_NAME=android`) |
| `test:tripstacc:bob:uat:grid:ios:real` | Real iOS hardware via LambdaTest (`LAMBDA_REAL_DEVICE=true`, `LAMBDA_PLATFORM_NAME=ios`) |

### ShopStacc

Every ShopStacc script hardcodes `CLIENT=BOBCARD` and targets `ShopStacc/tests`.

| Script | Env | Browser | Mode |
|---|---|---|---|
| `test:shopstacc:bobcard:qa` / `test:shopstacc:bobcard:uat` | QA / UAT | Chrome | headless |
| `test:shopstacc:bobcard:qa:headed` / `test:shopstacc:bobcard:uat:headed` | QA / UAT | Chrome | headed |
| `test:shopstacc:bobcard:qa:firefox:headed` / `test:shopstacc:bobcard:uat:firefox:headed` | QA / UAT | Firefox | headed |
| `test:shopstacc:bobcard:qa:mobile:iphone13` / `test:shopstacc:bobcard:uat:mobile:iphone13` | QA / UAT | Chrome, iPhone13 emulation | headless |
| `test:shopstacc:bobcard:qa:mobile:iphone13:headed` / `test:shopstacc:bobcard:uat:mobile:iphone13:headed` | QA / UAT | Chrome, iPhone13 emulation | headed |

## Usage examples

Run a predefined script as-is:

```bash
npm run test:tripstacc:bob:uat:headed
```

Append extra Playwright CLI flags after `--` — they pass straight through to `npx playwright test`:

```bash
# Only tests tagged @Loginpage
npm run test:tripstacc:idfc:uat:headed -- --grep "@Loginpage"

# Re-run only what failed last time
npm run test:tripstacc:idfc:uat:headed -- --last-failed

# Run a single spec file
npm run test:tripstacc:bob:uat -- TripStacc/tests/LoginPage.test.ts
```

Generate and email a report after a run:

```bash
npm run test:tripstacc:bob:uat
npm run report:mail
```

Run something not covered by a predefined script — set `PROJECT`/`CLIENT` yourself the same way the scripts do:

```bash
cross-env PROJECT=tripstacc-firefox-QA CLIENT=IDFC npx playwright test TripStacc/tests --grep "@Smoke"
```

## Known issue: two non-functional entries

Lines 49–50 in `scripts` are not real npm scripts — they're full command strings used as keys, mapped to a plain description string as the value:

```json
"npm run test:tripstacc:idfc:uat:headed -- --grep IDFC": "Executes TripStacc IDFC UAT (headed mode) with IDFC tag",
"npm run test:tripstacc:idfc:uat:headed -- --last-failed": "Retries only failed TripStacc IDFC UAT (headed mode):",
```

`npm run` requires a plain script name — these can't be invoked as scripts and don't do anything if run. They read as inline documentation for the two `--grep`/`--last-failed` patterns already covered under [Usage examples](#usage-examples) above; treat those two entries as safe to remove rather than something to fix or invoke.

## Adding a new script

- Follow the existing naming convention: `test:{product}:{client}:{env}[:{browser}][:mobile:{device}][:headed][:grid[:...]]`.
- Set `PROJECT` and `CLIENT` explicitly with `cross-env` rather than relying on the defaults baked into `playwright.config.ts` — every existing script does this so the command is self-describing.
- If it's a one-off filter (a specific tag, `--last-failed`, a single spec file), prefer the `-- <flag>` pattern from [Usage examples](#usage-examples) over adding a new permanent script.
