

## Project Structure

```
POC/
├── config/                  # Environment URLs per product
│   ├── BOB.config.ts
│   └── IDFC.config.ts
├── locators/                # Element selectors (XPath/CSS)
│   └── idfc/
│       ├── FlightPageLocators.ts
│       ├── HotelPageLocators.ts
│       ├── LoginPageLocators.ts
│       ├── MyAccountPageLocators.ts
│       └── PaymentPageLocators.ts
├── pages/                   # Page Object classes (actions & verifications)
│   └── IDFC/
│       ├── FlightHomePage.ts
│       ├── FlightBookingPage.ts
│       ├── HotelHomePage.ts
│       ├── HotelBookingPage.ts
│       ├── LoginPage.ts
│       └── PaymentPage.ts
├── tests/                   # Test specifications
│   ├── BOB/
│   │   └── homepage.test.ts
│   └── IDFC/
│       ├── FlightPage.test.ts
│       ├── HotelPage.test.ts
│       ├── LoginPage.test.ts
│       └── CheckoutAndMyAccount.test.ts
├── testdata/                # JSON test data files
│   └── idfctestdata.json
├── utils/                   # Reusable helper classes
│   ├── browserHelper.ts
│   ├── commonHelper.ts
│   ├── elementHelper.ts
│   └── verificationHelper.ts
├── reports/                 # JSON test result output
├── playwright-report/       # HTML report output
├── mobileDevices.js         # Supported mobile device list
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json
└── package.json
```

---

## Architecture Overview

The framework follows a layered **Page Object Model**:
.

### Data Flow Example


```
test("SC_03 - Search @HOMEPAGE @FLIGHT")
  └── FlightHomePage.EnterCityFromAirport(page, "ahmeda")
        └── ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.fromCity, data)
              └── page.waitForSelector(FlightPageLocators.fromCity)
```

---

## Prerequisites & Setup

1. **Install Node.js** (LTS recommended).

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

4. **Verify setup** by running a sample test (see [Running Tests](#running-tests)).

---

## Configuration

### Environment URLs

Product-specific base URLs are defined in `config/`:

| Product | Config File | Environments |
|---------|-------------|--------------|
| IDFC | `config/IDFC.config.ts` | QA, UAT, PROD |
| BOB | `config/BOB.config.ts` | QA, UAT, PROD |

### Playwright Config (`playwright.config.ts`)

The framework uses a dynamic project setup driven by the `PROJECT` environment variable.

**Format:** `{product}-{browser}-{environment}[-mobile-{device}][-{tag}]`

#### PROJECT String Segment Reference

```
tripstacc - chrome - UAT - mobile - iphone13 - Loginpage
   [0]       [1]    [2]     [3]       [4]        [5]
```

| Index | Segment | Values | Description |
|-------|---------|--------|-------------|
| `[0]` | Product | `tripstacc`, `shopstacc` | Which product to test |
| `[1]` | Browser | `chrome`, `firefox`, `webkit` | Browser engine |
| `[2]` | Environment | `QA`, `UAT`, `PROD` | Target environment |
| `[3]` | Mobile keyword | `mobile` | Required prefix for mobile device runs |
| `[4]` | Device (optional) | `iphone13`, `iphone13promax`, `galaxys21`, etc. | Mobile device from `mobileDevices.js` |
| `[5]` | Tag (optional) | Any `@tag` defined in tests | Filters tests by tag (case-insensitive) |

> **Note:** For desktop runs, `[3]` can be a tag directly (e.g. `tripstacc-chrome-UAT-Loginpage`).

#### Examples

| PROJECT Value | Description |
|---------------|-------------|
| `tripstacc-chrome-UAT` | TripStacc, Chrome, UAT, all tests, desktop |
| `tripstacc-chrome-UAT-Loginpage` | Desktop, only `@Loginpage` tagged tests |
| `tripstacc-chrome-UAT-mobile-iphone13` | Mobile (iPhone 13), all tests |
| `tripstacc-chrome-UAT-mobile-iphone13-Loginpage` | Mobile (iPhone 13), only `@Loginpage` tests |
| `shopstacc-chrome-UAT` | ShopStacc (BOBCard), Chrome, UAT, all tests |
| `shopstacc-chrome-QA-mobile-iphone13-Login` | ShopStacc, QA, mobile, only `@Login` tests |

#### Supported Mobile Devices

| Device Name | Viewport |
|-------------|----------|
| `iphone12` | 390 × 844 |
| `iphone13` | 390 × 700 |
| `iphone13promax` | 428 × 926 |
| `iphonese` | 375 × 667 |
| `galaxys20` | 412 × 915 |
| `galaxys21` | 412 × 915 |
| `pixel4a` | 412 × 869 |
| `pixel5` | 393 × 851 |
| `oneplus8` | 412 × 915 |
| `oneplus9` | 412 × 915 |

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PROJECT` | **Required.** Full project string (see format above) | — |
| `CLIENT` | Client name — `BOB`, `IDFC` for TripStacc; `BOBCARD` for ShopStacc | `BOB` |
| `HEADED` | Set to `true` to run in headed (visible) browser mode | headless |
| `CI` | When set, uses 4 parallel workers instead of 2 | — |


### View HTML report

After a test run:

```bash
npx playwright show-report
```

---

## Writing New Tests

### 1. Add locators

Create or update a locator file under `locators/{product}/`:

```typescript
// locators/idfc/MyFeatureLocator.ts
export const MyFeatureLocator = {
  submitButton: `//button[@id="submit"]`,
  inputField: `//input[@name="search"]`,
};
```

### 2. Create a Page Object

Add actions and verifications in `pages/{product}/`:

```typescript
// pages/IDFC/MyFeaturePage.ts
import  from '@playwright/test';
import { MyFeaturePageLocators } from '../../locators/idfc/MyFeaturePageLocators';
import { ElementHelper } from '../../utils/elementHelper';

export class MyFeaturePage {
  static async clickSubmit(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyFeatureLocator.submitButton);
  }

  static async enterSearchText(page: Page, text: string): Promise<void> {
    await ElementHelper.clearAndEnterInTextField(page, MyFeatureLocator.inputField, text);
  }
}
```

### 3. Write the test

Add a test file under `tests/{product}/`:

```typescript
import { test, Page, BrowserContext } from '@playwright/test';
import { CommonHelper } from '../../utils/commonHelper';
import { LoginPage } from '../../pages/IDFC/LoginPage';
import { MyFeaturePage } from '../../pages/IDFC/MyFeaturePage';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
  await LoginPage.loginWithValidCredentials(page);
});

test('SC_XX - My feature test @MYFEATURE', async () => {
  await test.step('Step 1: Perform action', async () => {
    await MyFeaturePage.enterSearchText(page, 'test');
  });

  await test.step('Step 2: Submit', async () => {
    await MyFeaturePage.clickSubmit(page);
  });
});
```

### 4. Add test data (optional)

Extend `testdata/idfctestdata.json` for shared credentials and inputs:

```json
{
  "mobileNumber": "__CONFIGURE_BOBCARD_LOGINDATAFILL_MOBILENUMBER__",
  "otp": "__CONFIGURE_BOBCARD_LOGINDATAFILL_OTP__"
}
```

Load in tests or page objects:

```typescript
const idfcTestData = require('../../testdata/idfctestdata.json');
```

---

## Utilities Reference

### `ElementHelper` — UI Interactions

| Method | Description |
|--------|-------------|
| `clickElement()` | Wait for element, then click |
| `clearAndEnterInTextField()` | Clear and type into an input |
| `waitForElementVisible()` | Wait until element is visible |
| `waitForElementClickable()` | Wait until element is clickable |
| `scrollToElement()` | Scroll element into view |
| `selectOptionByValue/Index/VisibleText()` | Dropdown selection |
| `dragAndDropElement()` | Drag and drop between elements |
| `clickElementWithRetry()` | Click with retry logic |

### `VerificationHelpers` — Assertions

Provides hard and soft assert variants (suffix `SoftAssert`) for most methods.

| Method | Description |
|--------|-------------|
| `elementIsVisible()` | Assert element is visible |
| `elementIsHidden()` | Assert element is hidden |
| `elementIsEnabled/Disabled()` | Assert enabled/disabled state |
| `elementIsChecked()` | Assert checkbox state |
| `elementContainsText()` | Assert element contains text |
| `elementHasAttribute()` | Assert attribute value |
| `elementHasClass()` | Assert CSS class |
| `elementHasCount()` | Assert element count |
| `checkUrlContainsKeyword()` | Assert URL contains text |

### `CommonHelper` — Navigation & General

| Method | Description |
|--------|-------------|
| `navigateToHomePage()` | Navigate to base URL from config |
| `verifyUrl()` | Assert current URL matches expected |
| `scrollAndClickElement()` | Scroll into view and click |
| `generateRandomPassword()` | Generate random password string |
| `performKeyboardAction()` | Press keyboard keys |

### `BrowserHelper` — Browser & Window Management

| Method | Description |
|--------|-------------|
| `switchToWindow()` / `switchToTab()` | Switch between tabs/windows |
| `switchToIframe()` | Switch into an iframe |
| `setGeolocation()` | Set browser geolocation |
| `takeScreenshot()` | Capture screenshot |
| `getCookies()` / `setCookie()` / `clearCookies()` | Cookie management |
| `refreshPage()` | Reload current page |

---

## Test Data

Test data is stored in JSON files under `testdata/`:

| File | Used By | Contents |
|------|---------|----------|
| `idfctestdata.json` | IDFC tests | Login credentials, cities, dates, traveller details, PAN, contact info |

Example usage in a Page Object:

```typescript
const idfcTestData = require('../../testdata/idfctestdata.json');

static async loginWithValidCredentials(page: Page): Promise<void> {
  await this.enterMobileNumber(page, idfcTestData.mobileNumber);
  await this.enterOtp(page, idfcTestData.otp);
}
```

---

## Reporting

The framework generates three report types after each run:

| Reporter | Output | Purpose |
|----------|--------|---------|
| List | Console | Real-time progress in terminal |
| JSON | `reports/test-results.json` | CI/CD integration, custom parsing |
| HTML | `playwright-report/` | Interactive visual report |

Open the HTML report:

```bash
npx playwright show-report
```

On failure, screenshots are saved automatically under `test-results/`.


