# utils/

Shared, product-agnostic helpers used by every page object in `TripStacc/pages/` and `ShopStacc/pages/`. Nothing here is client- or page-specific — that lives in `{Product}/locators` and `{Product}/pages` (see [`../TripStacc/locators/README.md`](../TripStacc/locators/README.md), [`../TripStacc/pages/README.md`](../TripStacc/pages/README.md)).

| File | Class / exports | Purpose |
|---|---|---|
| `elementHelper.ts` | `ElementHelper` | Low-level UI interactions: click, fill, scroll, hover, drag-and-drop, wait-for-visible/clickable/disappear, dropdown selection, attribute/text reads |
| `verificationHelper.ts` | `VerificationHelpers` | Assertions — visibility, text, attributes, class, count, form-field validation (required/min/max length, placeholder), checkbox/radio state. Every check has a hard variant (throws via `expect`) and a `...SoftAssert` variant (`expect.soft`, collects failures without stopping the test) |
| `commonHelper.ts` | `CommonHelper` | Navigation (`navigateToHomePage`, `verifyUrl`), random data generation (password/name/string/number/unique id), keyboard actions, legacy window/tab helpers (superseded by `browserHelper.ts` — see note below) |
| `browserHelper.ts` | `BrowserHelper` | Browser/window/tab management: switch window/tab/iframe, geolocation, cookies, screenshots, viewport size, network traffic capture, online/offline |
| `deviceHelper.ts` | `DeviceHelper` | Reads the `PROJECT` env var to tell whether the current run is mobile or desktop (`isMobile()`, `isWeb()`, `getDeviceType()`) |
| `dataProvider.ts` | `Data` | Loads the right product's `testData/*.json`, merges in the right client's block based on `CLIENT`, exports the merged object — see [`../TripStacc/testData/README.md`](../TripStacc/testData/README.md) |
| `testBase.ts` | `test`, `expect`, `Page`, `BrowserContext` | Re-exports Playwright's `test`/`expect`, but swaps the `browser` fixture for a LambdaTest real-device shim when `IS_GRID=true` and `LAMBDA_REAL_DEVICE=true`. Every test file imports `test`/`Page`/`BrowserContext` from here, never from `@playwright/test` directly |
| `lambdaGrid.ts` | `GRID`, `getLambdaTestWsEndpoint`, `getLambdaTestRealDeviceWsEndpoint` | Builds LambdaTest CDP/real-device connection strings from `LAMBDA_*` env vars; consumed by `playwright.config.ts` (desktop/emulated grid) and `testBase.ts` (real devices) |
| `send-report-email.js` | — | Standalone script (`npm run mail`) that reads `reports/test-results.json`, builds a pass/fail summary, and emails it via `nodemailer` |

## Conventions

- Every method takes `page` as its first argument — helpers hold no state and no `page` reference between calls (the two `expectedText`/`actualText` statics in `ElementHelper` are the one exception, used only by its own `getExpectedTextFromLocator`/`getActualTextFromLocator`/`compareBothResultAndAddedInConsole` trio).
- `ElementHelper` = *do something*. `VerificationHelpers` = *assert something*. A page object composes both; a test calls neither directly (see the example below).
- Every `VerificationHelpers` check has two forms: the plain name throws immediately on failure (use for a precondition the rest of the test depends on); the `...SoftAssert` name records the failure and lets the test keep running (use when you want to check several unrelated things and see all failures in one report, not just the first).
- `CommonHelper` still has window/tab/viewport methods duplicated in `BrowserHelper` — those are marked for removal in `CommonHelper`; use `BrowserHelper` for anything window/tab/viewport-related in new code.
- `DeviceHelper.isMobile()` parses the `PROJECT` string rather than reading a dedicated env var — keep that in mind if you rename or restructure the `PROJECT` format (see the root [USER_GUIDE.md](../USER_GUIDE.md#project-string-segment-reference)).

## Example: how a helper gets used

Continuing the `SC_001` login example from `TripStacc/locators` → `pages` → `testData` → `tests`: `LoginPage.ts` calls into `ElementHelper` for the action and `VerificationHelpers`-style assertions for the checks, instead of calling `page.locator(...)` directly:

```typescript
// TripStacc/pages/LoginPage.ts
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';
import { ElementHelper } from '../../utils/elementHelper';

static async clickGetOtpButton(page: Page): Promise<void> {
  await ElementHelper.clickElement(page, LoginPageLocators.getOtpButton);
  // ElementHelper.clickElement: scrolls the element into view, waits for it
  // to be visible, then clicks — one call instead of repeating that sequence
  // in every page object.
}

static async verifyOtpPageVisible(page: Page): Promise<void> {
  await ElementHelper.waitForElementVisible(page, LoginPageLocators.otpText);
}
```

A verification-heavy method uses `VerificationHelpers` the same way — pass the locator, get a pass/fail (or a thrown error) back:

```typescript
// Example pattern used throughout ShopStacc/TripStacc page objects
import { VerificationHelpers } from '../../utils/verificationHelper';

static async verifyLoginButtonEnabled(page: Page): Promise<void> {
  await VerificationHelpers.elementIsEnabled(page, LoginPageLocators.validateAndLoginButton);       // throws if not enabled
  await VerificationHelpers.elementIsEnabledSoftAssert(page, LoginPageLocators.validateAndLoginButton); // records failure, test continues
}
```

Every test file also imports its `test`/`Page`/`BrowserContext` types from `testBase.ts` rather than `@playwright/test`, so LambdaTest real-device runs work without changing test code:

```typescript
// TripStacc/tests/LoginPage.test.ts
import { test, Page, BrowserContext } from '../../utils/testBase';
```

**The chain:** `LoginPageLocators` (locators) → `ElementHelper`/`VerificationHelpers` calls inside `LoginPage` (pages, this repo's [pages/README.md](../TripStacc/pages/README.md)) → `Data` from `dataProvider.ts` (testData) → all invoked from the spec via `test` imported from `testBase.ts` (tests).

## Adding a new helper

1. Decide the right home: an action → `elementHelper.ts` or `browserHelper.ts`; an assertion → `verificationHelper.ts` (add both the hard and `...SoftAssert` variant); anything product/page-specific does **not** belong here — put it in the page object instead.
2. Keep the `static async methodName(page: Page, ...args)` signature so it drops into existing page objects without ceremony.
3. Don't add a new env-var convention without updating `deviceHelper.ts`/`lambdaGrid.ts` consistency — `PROJECT`/`CLIENT`/`LAMBDA_*` are read from several places (`playwright.config.ts`, `dataProvider.ts`, `deviceHelper.ts`, `lambdaGrid.ts`); keep new flags consistent with that set rather than inventing a parallel one.

## Note on secrets

`send-report-email.js` currently hardcodes an SMTP username/password. Treat this as a known issue to fix (move to `secrets`/env vars) rather than a pattern to copy for new code — the GitHub Actions workflows already do this correctly via `secrets.*`.
