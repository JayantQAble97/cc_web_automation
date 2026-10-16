# TripStacc/tests

Playwright spec files for TripStacc (BOB & IDFC). Each file targets one feature area and runs against whichever client/environment is set via the `CLIENT` / `PROJECT` env vars (see the root [USER_GUIDE.md](../../USER_GUIDE.md)).

| File | Covers | Key scenarios |
|---|---|---|
| `LoginPage.test.ts` | Mobile/OTP login | `SC_001` login flow, `SC_002` multi-card selection popup (BOB only) |
| `FlightPage.test.ts` | Flight search & booking setup | `SC_003.x` search variants (passengers, one-way/round-trip, cabin class, domestic/international), `SC_004` filter/sort, `SC_005` traveller details, `SC_006` contact/GST info, `SC_007` passport info, `SC_008` add-ons (seat/baggage/meal) |
| `HotelPage.test.ts` | Hotel search & booking setup | `SC_015.x` search variants (domestic/international, room pricing, adult/child combos), `SC_016.x` filter/sort/update search, `SC_017` guest details, `SC_018` PAN handling |
| `CheckoutPage.test.ts` | Checkout for both flight and hotel | `SC_009.x` redeem points, `SC_010` promo codes, `SC_011.x` proceed to payment |
| `BookingConfirmation.test.ts` | Post-payment outcome | `SC_012` flight booking outcome (confirmed/pending/failed), `SC_012.01` hotel booking confirmation |
| `MyAccountPage.test.ts` | Booking history | `SC:013` booking status and available actions in My Account |

## Conventions

- **Setup**: each file's `test.beforeEach` opens a fresh `browser.newContext()`/`page`, then either:
  - `CommonHelper.navigateToHomePage(page)` — just loads the home page (used only by `LoginPage.test.ts`, which tests login itself), or
  - `BaseHelper.launchAndLogin(page)` — navigates and logs in, used by every other file since they test post-login flows.
- **Teardown**: `test.afterEach` closes `page` and `context`.
- **Tagging**: every test declares a `tag` array as the second argument to `test(...)`, always including the applicable client(s) (`@BOB`, `@IDFC`, or `@Common` for both) plus a feature tag (`@Loginpage`, `@Homepageflight`, `@Checkout`, ...) and a suite tag (`@Smoke`, `@Sanity`, `@Regression`). These tags are what the `feature` input on the CI workflows and local `--grep` filtering key off — see the root [USER_GUIDE.md](../../USER_GUIDE.md).
- **Structure**: steps inside a test are wrapped in `test.step('Step N: ...', ...)` for readable trace/report output, and delegate all page interaction to the matching class in [`../pages/`](../pages/).
- **Test data**: pulled from `Data` in `../../utils/dataProvider.ts`, which resolves to the right client's block in [`../testData/tripStacc.json`](../testData/README.md).
- **IDs**: scenario IDs (`SC_00N`) are stable identifiers used for traceability back to test plans — keep the ID when editing a scenario, and give a new one a new ID rather than reusing/renumbering existing ones.

## Example: how a test gets used

`LoginPage.test.ts` ties everything together — locators (via the page object), the page object's methods, and `Data` (via the page object) — while the test itself only calls page-object methods and never touches a locator, an XPath, or the raw JSON:

```typescript
// tests/LoginPage.test.ts
import { test, Page, BrowserContext } from '../../utils/testBase';
import { CommonHelper } from '../../utils/commonHelper';
import { HotelHomePage } from '../pages/HotelHomePage';
import { LoginPage } from '../pages/LoginPage';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});

test('SC_001: Verify user can Login with mobile number and OTP',
  { tag: ['@IDFC', '@BOB', '@Common', '@Loginpage', '@Smoke', '@Sanity'] },
  async () => {
    await test.step('Step 1: Enter valid mobile number', async () => {
      await LoginPage.verifyMobileNumberFieldAcceptsInput(page); // uses LoginPageLocators + Data.loginDataFill.mobileNumber
    });

    await test.step('Step 2: Click Get OTP Button', async () => {
      await LoginPage.clickGetOtpButton(page);
      await LoginPage.verifyOtpPageVisible(page);
    });

    await test.step('Step 3: Enter valid OTP', async () => {
      await LoginPage.verifyOtpFieldAcceptsInput(page); // uses Data.loginDataFill.otp
    });

    await test.step('Step 4: Click Login button', async () => {
      await LoginPage.verifyLoginButtonWorks(page);
    });

    await test.step('Step 5: Verify Hotel Home Page is loaded', async () => {
      await HotelHomePage.verifyHotelHomePageLoaded(page);
    });
  });
```

**The chain for this one test:** `LoginPageLocators.mobileNumberField` (locators) → `LoginPage.verifyMobileNumberFieldAcceptsInput` (pages) → `Data.loginDataFill.mobileNumber` sourced from `tripStacc.json` (testData) → asserted and stepped through here (tests). Run it with:

```bash
cross-env PROJECT=tripstacc-chrome-UAT CLIENT=BOB npx playwright test TripStacc/tests/LoginPage.test.ts --grep "SC_001"
```

## Adding a new test

1. Build up the required page objects/locators first (see `../pages/README.md`, `../locators/README.md`).
2. Add the spec under `tests/`, following the `beforeEach`/`afterEach` pattern above.
3. Give it the next unused `SC_0NN` id and tag it with client(s), feature, and suite (`@Smoke`/`@Sanity`/`@Regression`) so it's reachable via the `feature` filter.
4. Add any new fixtures to `../testData/tripStacc.json` under `common` (or the client block if client-specific).
