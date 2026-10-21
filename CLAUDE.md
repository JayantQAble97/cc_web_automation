# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Playwright + TypeScript UI test automation (Page Object Model) for two loyalty products:
- **TripStacc** (travel) — clients `BOB`, `IDFC` — `TripStacc/`
- **ShopStacc** (e-commerce) — client `BOBCARD` (+ an incomplete HDFC suite) — `ShopStacc/`

`SSV2/` is a separate suite with its own `SSV2/playwright.config.ts` (the `test:ssv2:*` scripts, client `HDFC`). It is currently untracked in git, and the `SSV2*.zip` files in the root are snapshots of it. Treat it as out of scope unless explicitly asked.

## Commands

```bash
npm ci                          # install (lockfile-exact)
npx playwright install chrome   # browsers (or firefox / webkit)

npm run test:tripstacc:bob:uat            # see package.json for all client/env/browser/device combos
npm run test:shopstacc:bobcard:uat:headed

# Single file / single test — pass extra args after `--`
npm run test:tripstacc:bob:uat -- TripStacc/tests/LoginPage.test.ts --grep "SC_001"
npm run test:tripstacc:idfc:uat:headed -- --last-failed

# Ad-hoc combination (PROJECT and CLIENT are both required in practice)
npx cross-env PROJECT=tripstacc-firefox-QA CLIENT=IDFC npx playwright test TripStacc/tests --grep "@smoke"

npm run report        # open last HTML report
npm run report:mail   # summarize reports/test-results.json and email it
```

There is no lint step, and `typescript` is not a dependency — Playwright transpiles without type-checking, so a missing export or method only fails at runtime. Type errors are visible in VS Code only.

## How a run is configured (spans several files)

1. **`PROJECT` env var** is parsed in `playwright.config.ts`:
   `{product}-{browser}-{ENV}[-mobile-{device}][-{tag}]`, e.g. `tripstacc-chrome-UAT-mobile-iPhone13-loginpage`.
   - `browser`: `chrome`/`edge` (channel), `firefox`, `webkit`/`safari`.
   - `device` must match a `name` in `mobileDevices.js` (case-insensitive) → viewport/UA/touch emulation.
   - trailing `tag` becomes `grep: /@tag/i`. On desktop the 4th segment is a tag unless it matches a device name.
   - Exactly one Playwright project is generated per run.
2. **`cc.config.yaml`** (via `utils/projectsConfig.ts`) maps product → `testDir` and product/client/env → `baseUrl`; unknown env falls back to `QA`. Adding a client/environment is a YAML edit. (Docs mentioning `config/ts.config.ts` are stale — that file no longer exists.)
3. **`CLIENT` env var** (default `BOB`) selects the URL above, the test-data block, and client branches in page objects.
4. **`utils/dataProvider.ts`** exports `Data`, deep-merged in order `common` → `common.<ENV>` → `<CLIENT>` → `<CLIENT>.<ENV>` from `{Product}/testData/*.json`. It throws at import time if `CLIENT` has no matching key. Test data in the repo uses `__CONFIGURE_*__` placeholders that must be replaced with real UAT values locally.
5. **`utils/deviceHelper.ts`** — `DeviceHelper.isMobile()` decides mobile vs desktop by string-matching `PROJECT`, not the viewport.
6. **LambdaTest grid**: `IS_GRID=true` (or `GRID_PROFILE=<name>` from `cc.config.yaml` `grid.profiles`) makes the config set `connectOptions.wsEndpoint` (`utils/lambdaGrid.ts`). Real devices (`LAMBDA_REAL_DEVICE=true`) instead go through a `browser`-fixture shim in `utils/testBase.ts` using `_android.connect()`. Note `testBase.ts` reads only the raw env vars, not grid profiles. Credentials: `LAMBDA_USER`/`LAMBDA_KEY` in `.env`.

Global settings (`playwright.config.ts`): 300 s test timeout, **no retries in config** (`retries` is commented out — CI passes `--retries=1`), workers 2 locally / 1 when `CI` is set, `fullyParallel`; screenshot, video and trace are always `on`. Runs are headless unless `HEADED=true`, which also switches desktop to a maximized window (`viewport: null`) instead of 1920×1080. `.env` is loaded via `dotenv`. Reporters: list + JSON (`reports/test-results.json`) + HTML (`playwright-report/`).

The top-level `tests/example.spec.ts`, `config/` and `specs/` hold only stubs/READMEs; real tests live under `TripStacc/tests` and `ShopStacc/tests`.

## Code structure and conventions

Layering: **tests → pages → (`utils` helpers + locators + `Data`)**. `RULES.md` is the authoritative style guide; key points:

- **Tests** import `test`, `Page`, `BrowserContext` from `utils/testBase` (never `@playwright/test`, or real-device runs break). Each file uses module-level `context`/`page`, created in `beforeEach` from the `browser` fixture and closed in `afterEach`. TripStacc post-login suites call `BaseHelper.launchAndLogin(page)` (`TripStacc/pages/CommonMethods.ts`), which handles the restricted-access page, OTP login, and BOB's card-selection popup.
- Test titles start with a scenario ID (`SC_0NN: ...`) — keep IDs stable. Every test has a `tag` array (client `@bob`/`@idfc`/`@common`/`@bobcard`, feature like `@loginpage`/`@homepageflight`/`@checkout`, suite `@smoke`/`@sanity`/`@regression`; also `@flaky`, `@earn`, `@testmode`). CI `feature` inputs and `PROJECT` tags filter on these. Steps are wrapped in `test.step(...)`.
- **Pages**: classes with only `static async method(page, ...)`; no state except a few static fields in `FlightHomePage`. Interactions go through `ElementHelper` (actions) and `VerificationHelpers` (hard + `...SoftAssert` assertions). Client differences use `process.env.CLIENT?.toUpperCase()` switches or parallel `...ForIDFC` methods; viewport differences use `DeviceHelper.isMobile()`.
- **Locators**: one `export const {Page}Locators = { ... }` per page, mostly XPath. BOB/IDFC variants are often combined with `|` in one XPath; mobile variants use a `Mobile` suffix; a few are functions (`dateCell(day)`) or contain `{placeholder}` tokens replaced in the page object.
- `ElementHelper.clickElement` scrolls to centre, waits for visible, then force-clicks. `ElementHelper.waitForElementVisible` waits a fixed 100 s after a first miss, and `VerificationHelpers.elementIsVisible` reloads the page and retries — both can mask or slow failures.
- `utils/verificationHelper.ts` unconditionally requires `TripStacc/testData/tripStacc.json`.

## CI / reporting

- `.github/workflows/`: six workflows (`tripstacc-{web,mobile}-{bob,idfc}.yml`, `shopstacc-{web,mobile}.yml`). Nightly cron + `workflow_dispatch`; each builds `PROJECT` from inputs, runs with `--workers=1 --retries=1`, writes a job summary, deploys the HTML report to GitHub Pages (`gh-pages`), and sends email + MS Teams. Stats are computed inline in each YAML.
- `jenkins/run-tests.sh` is the Jenkins equivalent and uses `.github/scripts/generate-report-summary.js` (writes `reports/email-summary.txt` + `reports/stats.env`) and `utils/send-report-email.js`.
- `.github/agents/*.agent.md` define Playwright test planner/generator/healer agents (Copilot + Playwright MCP).

## Known broken or stale items

- `ShopStacc/pages/HdfcHomePage.ts` imports `HdfcHomePageLocators`, which is not exported; there is no `HDFC` client under `shopstacc` in `cc.config.yaml` and no npm script for it.
- `ShopStacc/tests/HomePageGuest.test.ts` calls a nonexistent `HomePage.verifyGuestHomepage`.
- Two `package.json` "scripts" are description strings, not commands.
- README/USER_GUIDE/RULES describe older layouts (`config/ts.config.ts`, ~12 workflows, 4 CI workers) — trust the code over the docs.
- Report emails are sent as `jignesh.shah@customer-capital.com` via smtp.office365.com; the password comes from the `SMTP_PASSWORD` GitHub secret (workflows) or `SMTP_PASSWORD` in `.env` (`utils/send-report-email.js`). Recipients are still hardcoded in each workflow YAML and the JS file.
