# User Guide

A practical guide to running, triggering, and extending the TripStacc / ShopStacc Playwright automation suite. For a deep architectural reference (folder layout, helper API, project-string format) see [README.md](README.md).

Two products are covered:

| Product | Client(s) | Test folder |
|---|---|---|
| **TripStacc** | BOB, IDFC | `TripStacc/tests` |
| **ShopStacc** | BOBCard | `ShopStacc/tests` |

---

## 1. Running tests from GitHub Actions (no local setup needed)

This is the recommended way for QA/stakeholders to trigger a run without installing anything.

1. Go to the repo's **Actions** tab.
2. Pick a workflow from the list below.
3. Click **Run workflow**, choose the inputs, and click the green **Run workflow** button.
4. Watch the run; when it finishes, results are delivered three ways:
   - **Job summary** on the run page (pass/fail table, failed test list).
   - **Email** to the configured recipients (see the `Send email report` step in each workflow).
   - **MS Teams** message via webhook.
   - A link to the full **HTML report**, published to GitHub Pages.

### Available workflows

| Workflow file | Purpose | Inputs |
|---|---|---|
| `tripstacc.yml` | TripStacc, desktop or mobile viewport, either client | client, environment, browser, viewport (Web/iPhone13/GalaxyS21), feature tag |
| `bob-uat.yml` | Generic UAT runner (BOB or IDFC) | client, environment, feature tag |
| `tripstacc-bob-uat.yml` / `tripstacc-idfc-uat.yml` | TripStacc, fixed client, desktop | environment, browser, feature tag |
| `tripstacc-bob-iphone13-uat.yml` / `tripstacc-idfc-iphone13-uat.yml` | TripStacc, fixed client, iPhone13 viewport | environment, feature tag |
| `tripstacc-bob-galaxys21-uat.yml` / `tripstacc-idfc-galaxys21-uat.yml` | TripStacc, fixed client, Galaxy S21 viewport | environment, feature tag |
| `shopstacc.yml` / `shopstacc_customise.yml` | ShopStacc (BOBCard), desktop or mobile viewport | environment, browser, viewport, feature tag |
| `shopstacc-bobcard-uat.yml` | ShopStacc, desktop | environment, browser, feature tag |
| `shopstacc-bobcard-iphone13-uat.yml` | ShopStacc, iPhone13 viewport | environment, feature tag |
| `shopstacc-bobcard-galaxys21-uat.yml` | ShopStacc, Galaxy S21 **real device** (LambdaTest grid) | environment, feature tag |
| `playwright.yml` | Generic sanity workflow, runs on every push/PR to `main`/`master` | none (runs `npx playwright test` as-is) |

**Feature tag** is optional — leave blank to run the full suite, or enter a tag without the `@` (e.g. `Loginpage`, `Smoke`, `Sanity`, `Regression`) to run only tests carrying that tag.

### Automatic runs

`tripstacc.yml`, `bob-uat.yml`, and `shopstacc.yml` also run automatically:
- On every **push to `main`** (UAT environment, full suite).
- On a **daily schedule** (~2:00–2:30 AM IST) as a nightly regression check.

---

## 2. Running tests locally

### One-time setup

```bash
npm install
npx playwright install
```

### Quick start with npm scripts

The most common combinations are already defined in `package.json`. Examples:

```bash
# TripStacc, BOB client, UAT, headed (visible browser)
npm run test:tripstacc:bob:uat:headed

# TripStacc, IDFC client, UAT, headless
npm run test:tripstacc:idfc:uat

# TripStacc, BOB, UAT, mobile iPhone13, headed
npm run test:tripstacc:bob:uat:mobile:iphone13:headed

# ShopStacc, BOBCard, UAT, headed
npm run test:shopstacc:bobcard:uat:headed

# ShopStacc, BOBCard, QA, mobile iPhone13
npm run test:shopstacc:bobcard:qa:mobile:iphone13
```

Run `npm run` with no arguments (or open `package.json`) to see the full list, including Firefox/WebKit variants and LambdaTest grid variants (`:grid`, `:grid:android:real`, `:grid:ios:real`).

### Running with custom options directly

Every script is a thin wrapper around:

```bash
cross-env PROJECT=<project-string> CLIENT=<client> [HEADED=true] npx playwright test <TestFolder>/tests [--grep "@tag"]
```

The `PROJECT` string controls product, browser, environment, viewport, and tag filtering. Format:

```
{product}-{browser}-{environment}[-mobile-{device}][-{tag}]
```

Examples:

| PROJECT | Meaning |
|---|---|
| `tripstacc-chrome-UAT` | TripStacc, Chrome, UAT, full suite, desktop |
| `tripstacc-chrome-UAT-Loginpage` | Same, only `@Loginpage` tests |
| `tripstacc-chrome-UAT-mobile-iphone13` | Mobile emulation, iPhone 13 |
| `shopstacc-chrome-QA-mobile-iphone13-Login` | ShopStacc, QA, mobile, `@Login` tag only |

See [README.md § PROJECT String Segment Reference](README.md#project-string-segment-reference) for the full breakdown and supported device list.

### Key environment variables

| Variable | Purpose | Default |
|---|---|---|
| `PROJECT` | **Required.** Encodes product/browser/env/viewport/tag | — |
| `CLIENT` | `BOB` / `IDFC` (TripStacc) or `BOBCARD` (ShopStacc) | `BOB` |
| `HEADED` | `true` to see the browser while tests run | headless |
| `CI` | Set in CI to use 4 workers instead of 2 | — |
| `IS_GRID` | `true` to run against the LambdaTest grid instead of local browsers | `false` |
| `LAMBDA_REAL_DEVICE` / `LAMBDA_PLATFORM_NAME` | Used for LambdaTest real-device runs | — |

### Filtering tests

```bash
# Only tests tagged @Loginpage
npm run test:tripstacc:bob:uat:headed -- --grep "@Loginpage"

# Re-run only what failed last time
npm run test:tripstacc:idfc:uat:headed -- --last-failed
```

### Viewing results locally

```bash
npm run report          # opens the last HTML report
```

Screenshots for failed tests are saved automatically under `test-results/`.

---

## 3. Writing a new test

1. **Add locators** — `locators/{product}/MyFeatureLocators.ts`.
2. **Add a Page Object** — `pages/{Product}/MyFeaturePage.ts`, using `ElementHelper`/`VerificationHelpers` for actions and assertions.
3. **Add the test** — `tests/{Product}/MyFeature.test.ts`, following the existing `beforeEach` login pattern.
4. **Add test data** if needed, in `testdata/*.json`.
5. **Tag the test** (e.g. `@Loginpage`, `@Smoke`) so it can be targeted by the `feature` input or `--grep`.

Full code templates and the shared helper API (`ElementHelper`, `VerificationHelpers`, `CommonHelper`, `BrowserHelper`) are documented in [README.md § Writing New Tests](README.md#writing-new-tests) and [§ Utilities Reference](README.md#utilities-reference).

---

## 4. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Workflow run shows no HTML report link | Check the `Deploy report to GitHub Pages` step succeeded; Pages must be enabled for the repo. |
| Email/Teams notification missing | Check the `secrets.MS_TEAMS_WEBHOOK` / SMTP credentials are configured in repo secrets. |
| Local run can't find `PROJECT` | `PROJECT` is required — use one of the npm scripts or set it explicitly (see § 2). |
| Real-device (LambdaTest) run fails to start | Confirm `LAMBDA_USER` / `LAMBDA_KEY` secrets are set and the grid workflow (`*-galaxys21-uat.yml`) is used. |
| Test times out on a locator | Verify the locator against the current environment (QA/UAT URLs differ — see `config/ts.config.ts`) before assuming a code bug. |

---

## 5. Reference

- [README.md](README.md) — architecture, full PROJECT reference, helper API, reporting details.
- [RULES.md](RULES.md) — coding/test-writing conventions for this repo.
- `config/ts.config.ts` — environment URLs per client (BOB, IDFC, BOBCard).
- `mobileDevices.js` — supported mobile device viewports.
