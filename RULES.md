# Playwright Framework — Coding Rules & Standards

This document is the authoritative guide for writing and organising code in this repository.
Any AI assistant or developer must follow these rules when creating or editing files.

---

## Project Structure

```
cusotmer-capital-poc/
├── TripStacc/                    ← Travel product (BOB + IDFC clients)
│   ├── locators/
│   │   ├── FlightPageLocators.ts
│   │   ├── HomePageLocators.ts
│   │   ├── HotelPageLocators.ts
│   │   ├── LoginPageLocators.ts
│   │   ├── MyAccountPageLocators.ts
│   │   └── PaymentPageLocators.ts
│   ├── pages/
│   │   ├── CommonMethods.ts      ← TripStacc-specific shared helpers
│   │   ├── FlightBookingPage.ts
│   │   ├── FlightHomePage.ts
│   │   ├── Homepage.ts
│   │   ├── HotelBookingPage.ts
│   │   ├── HotelHomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── MyAccountPage.ts
│   │   └── PaymentPage.ts
│   ├── tests/
│   │   ├── BookingConfirmation.test.ts
│   │   ├── CheckoutPage.test.ts
│   │   ├── FlightPage.test.ts
│   │   ├── HotelPage.test.ts
│   │   ├── LoginPage.test.ts
│   │   └── MyAccountPage.test.ts
│   └── testData/
│       └── tripStacc.json        ← BOB + IDFC + common test data
│
├── ShopStacc/                    ← E-commerce product (BOBCARD client)
│   ├── locators/
│   │   ├── CheckoutPageLocators.ts
│   │   ├── HomePageLocators.ts
│   │   ├── LoginPageLocators.ts
│   │   └── PLPPageLocators.ts
│   ├── pages/
│   │   ├── Checkoutpage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   └── PlpPage.ts
│   ├── tests/
│   │   ├── Checkoutpage.test.ts
│   │   ├── HomePage.test.ts
│   │   ├── LoginPage.test.ts
│   │   └── PLPPage.test.ts
│   └── testData/
│       └── shopStacc.json        ← BOBCARD test data
│
├── utils/                        ← Shared across all products and clients
│   ├── elementHelper.ts
│   ├── verificationHelper.ts
│   ├── commonHelper.ts
│   ├── browserHelper.ts
│   ├── deviceHelper.ts
│   ├── dataProvider.ts           ← Dynamic test data loader
│   └── send-report-email.js
│
├── config/
│   └── ts.config.ts
├── playwright.config.ts
├── package.json
└── .github/
    └── workflows/                ← CI/CD pipelines (see Section 8)
```

**Key rule:** Every product (`TripStacc`, `ShopStacc`) is a self-contained folder with its own `locators/`, `pages/`, `tests/`, and `testData/`. There is no shared root-level `locators/`, `pages/`, or `testdata/` folder.

---

## 1. Locators

### File naming
- Pattern: `{PageName}Locators.ts`
- Examples: `LoginPageLocators.ts`, `HotelPageLocators.ts`, `PLPPageLocators.ts`
- Location: `TripStacc/locators/` or `ShopStacc/locators/` depending on the product

### File structure
```typescript
export const {PageName}Locators = {
  keyName: `xpath_or_selector`,
};
```

### Key naming
- **camelCase** only
- Names describe what the element IS, not what it does
- Good: `mobileNumberField`, `getOtpButton`, `skipButtonInsideDialogBox`
- Bad: `clickOtp`, `btn1`, `elem`

### Selector rules
- **Prefer XPath** over CSS selectors
- Use template literals (backticks) for all selectors
- Use double-quoted strings `"..."` only for XPath containing single quotes inside
- For indexed elements use `(//xpath)[n]` — e.g. `(//span[@class='price'])[1]`
- Never hardcode dynamic values (prices, counts, user data) into locators

```typescript
export const LoginPageLocators = {
  mobileNumberField: `//input[@id='txtMobileNo']`,
  getOtpButton:      `//button[@id='btnLogin']`,
  otpInputField:     `//div[@class='otp-warpper']//input`,
  skipButtonInsideDialogBox: `//dialog[@aria-describedby="tour_step_0-description"]//button[text()='Skip']`,
};
```

### One file per page
Each page gets exactly one locator file. Both BOB and IDFC locators for the same page go in the same file — use client branching in the page class, not in the locator file.

---

## 2. Pages

### File naming
- Pattern: `{PageName}.ts`
- Location: `TripStacc/pages/` or `ShopStacc/pages/`

### Class structure
```typescript
import { expect, Page } from '@playwright/test';
import { {PageName}Locators } from '../../TripStacc/locators/{PageName}Locators';
import { ElementHelper } from '../../utils/elementHelper';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { Data } from '../../utils/dataProvider';           // for TripStacc (multi-client)
// OR
import bobTestData from '../testData/shopStacc.json';     // for ShopStacc (single client)

export class {PageName} {
  static async methodName(page: Page): Promise<void> {
    // implementation
  }
}
```

### Method rules

**All methods must be:**
- `static async`
- First parameter is always `page: Page`
- Return type is `Promise<void>` unless returning a value

**Method naming:**
| Prefix | Use for |
|--------|---------|
| `verify…` | Assert something is visible / correct |
| `click…` | Click an element |
| `enter…` | Type into a field |
| `navigate…` | Go to a URL or page |
| `scroll…` | Scroll to an element or position |
| `get…` | Return a value from the page |
| `wait…` | Wait for a condition |
| `select…` | Choose a dropdown option |
| `fill…` | Fill a form field (used in booking forms) |

**Locator assignment:**
Always assign the locator to a named `const` before passing to a helper — do not inline the locator call.

```typescript
// Correct
static async clickGetOtpButton(page: Page): Promise<void> {
  const otpButton = LoginPageLocators.getOtpButton;
  await ElementHelper.clickElement(page, otpButton);
  console.log('Get OTP button clicked');
}

// Wrong — do not inline
static async clickGetOtpButton(page: Page): Promise<void> {
  await ElementHelper.clickElement(page, LoginPageLocators.getOtpButton);
}
```

**Logging:**
Every method must end with a `console.log()` describing what happened.

**Mobile vs desktop branching:**
Use `DeviceHelper.isMobile()` when behaviour differs between viewports.

```typescript
import { DeviceHelper } from '../../utils/deviceHelper';

if (DeviceHelper.isMobile()) {
  await ElementHelper.clickElement(page, HomePageLocators.bugerMenuMobile);
} else {
  await ElementHelper.clickElement(page, HomePageLocators.giftcardoption);
}
```

**Client branching (TripStacc):**
Use `process.env.CLIENT?.toUpperCase()` with a `switch` when behaviour differs between BOB and IDFC.

```typescript
const CLIENT = process.env.CLIENT?.toUpperCase();
switch (CLIENT) {
  case 'BOB':
    await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);
    break;
  case 'IDFC':
    await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBoxMobile);
    break;
}
```

**Use helpers, not raw Playwright:**
Always go through `ElementHelper` or `VerificationHelpers`. Use raw `page.locator()` only when helpers don't cover it (e.g. `nth()`, `count()`, iterating lists).

**Composite methods (BeforeEach helpers):**
Group related login/setup steps into a single composite method called from `beforeEach`.

```typescript
static async loginWithOtp(page: Page): Promise<void> {
  await LoginPage.verifyMobileNumberFieldAcceptsInput(page);
  await LoginPage.clickGetOtpButton(page);
  await LoginPage.verifyOtpFieldAcceptsInput(page);
  await LoginPage.verifyLoginButtonWorks(page);
}
```

---

## 3. Tests

### File naming
- Pattern: `{PageName}.test.ts`
- Location: `TripStacc/tests/` or `ShopStacc/tests/`

### File structure
```typescript
import { test, Page, BrowserContext } from '@playwright/test';
import { CommonHelper } from '../../utils/commonHelper';
import { {PageName} } from '../pages/{PageName}';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
  // add login steps here if the test requires authentication
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});
```

### Test naming
Pattern: `'SC_NNN: Short description of what is being verified'`

```typescript
test('SC_001: Verify user can Login with mobile number and OTP', ...)
test('SC_015: Hotel Search', ...)
test('SC_004, Gift Card PLP — product card details and layout', ...)
```

### Tags
Every test **must** include a `tag` array.

```typescript
test('SC_001: Verify user can Login with mobile number and OTP', {
  tag: ['@IDFC', '@BOB', '@Common', '@Loginpage', '@Smoke', '@Sanity']
}, async () => { ... });
```

**Client tags:**

| Tag | Product | Meaning |
|-----|---------|---------|
| `@BOB` | TripStacc | Test runs for BOB client |
| `@IDFC` | TripStacc | Test runs for IDFC client |
| `@Common` | TripStacc | Test applies to both BOB and IDFC |
| `@BOBCard` | ShopStacc | Test runs for BOBCard client |

**Feature tags (TripStacc):**

| Tag | Area |
|-----|------|
| `@Loginpage` | Login / OTP flow |
| `@Homepageflight` | Flight search home page |
| `@Homepagehotel` | Hotel search home page |
| `@Flight` | Flight booking flow |
| `@Hotel` | Hotel booking flow |
| `@Checkout` | Checkout / redeem points / promo |
| `@Payment` | Payment page |
| `@Bookingconfirmation` | Booking confirmation page |
| `@Myaccount` | My account section |
| `@Passport` | Passport details (international flights) |
| `@Addon` | Add-ons (seat, baggage, meal) |

**Feature tags (ShopStacc):**

| Tag | Area |
|-----|------|
| `@Login` | Login flow |
| `@Homepage` | Home page |
| `@Giftcard` | Gift card section |
| `@PLP` | Product listing page |
| `@Checkout` | Checkout flow |

**Suite tags (optional, add as appropriate):**

| Tag | Meaning |
|-----|---------|
| `@Smoke` | Fast, high-value check |
| `@Sanity` | Quick regression gate |
| `@Regression` | Full regression suite |

### Steps
Every test must use `test.step()` with plain-English descriptions from the user's perspective.

```typescript
test('SC_015: Hotel Search', {
  tag: ['@IDFC', '@BOB', '@Common', '@Homepagehotel', '@Smoke', '@Sanity']
}, async () => {

  await test.step('Step 1: Verify Hotel tab is displayed', async () => {
    await HotelHomePage.verifyHotelTabBtnDisplayed(page);
  });

  await test.step('Step 2: Enter destination city', async () => {
    await HotelHomePage.searchValueInTestBox(page, 'Mumbai');
    await HotelHomePage.selectFirstOptionFromDropdown(page);
  });

  await test.step('Step 3: Select dates and search', async () => {
    await HotelHomePage.clickDateButton(page);
  });
});
```

### What tests must NOT do
- Do not put XPath selectors or locator strings directly in test files
- Do not call `page.click()`, `page.fill()`, `page.locator()` directly — always go through a Page class method
- Do not import `ElementHelper` or `VerificationHelpers` directly in tests
- Do not add `console.log()` in test files — logs belong in Page methods

---

## 4. Utils

All utility classes are in `utils/`. They are **shared across all products and clients** — do not add product-specific or client-specific logic to utils.

### `ElementHelper` — `utils/elementHelper.ts`
DOM interactions. Use for all element actions.

| Method | Use when |
|--------|----------|
| `clickElement(page, locator)` | Click any element |
| `clearAndEnterInTextField(page, locator, text)` | Type into an input field |
| `clearAndTypeInTextField(page, locator, text)` | Clear and type (slower, character-by-character) |
| `clearTextField(page, locator)` | Clear a field only |
| `waitForElementVisible(page, locator)` | Wait until element appears (retries once after 50s) |
| `waitForElementVisibleWithoutReload(page, locator)` | Poll until element appears — no page reload |
| `waitForElementClickable(page, locator)` | Wait until element is visible AND enabled |
| `waitForElementToDisappear(page, locator)` | Wait until element hides |
| `scrollToElement(page, locator)` | Scroll element into view |
| `scrollElementToCentre(page, locator)` | Scroll element to centre of viewport |
| `scrollByAmount(page, x, y)` | Scroll by pixel amount |
| `isElementDisplayed(page, locator)` | Returns `boolean` — element visible? |
| `isElementEnabled(page, locator)` | Returns `boolean` — element enabled? |
| `isElementPresent(page, locator)` | Returns `boolean` — element in DOM? |
| `getTextFromElement(page, locator)` | Get text content |
| `getElementValue(page, locator)` | Get input value |
| `getAttributeValue(page, locator, attr)` | Get attribute value |
| `selectOptionByValue/Index/VisibleText` | Dropdown selection |
| `dragAndDropElement(page, source, target)` | Drag and drop |
| `hoverOverMenu(page, locator)` | Hover with retry |
| `clickElementWithRetry(page, locator)` | Click with retry |
| `doubleClickElement(page, locator)` | Double-click |

### `VerificationHelpers` — `utils/verificationHelper.ts`
Assertions only. Every method has a **hard assert** version and a `SoftAssert` version.

| Method | Assert |
|--------|--------|
| `elementIsVisible(page, locator)` | Element is visible (retries with reload) |
| `elementIsHidden(page, locator)` | Element is hidden |
| `elementIsEnabled / Disabled` | Enabled/disabled state |
| `elementIsChecked(page, locator)` | Checkbox is checked |
| `elementIsEditable(page, locator)` | Field is editable |
| `elementContainsText(page, locator, text)` | Element text contains string |
| `elementHasText(page, locator, text)` | Exact text match |
| `elementHasAttribute(page, locator, attr, value)` | Attribute equals value |
| `elementHasClass(page, locator, className)` | Has CSS class |
| `elementHasCount(page, locator, count)` | Element count |
| `elementHasValue(page, locator, value)` | Input value equals |
| `checkUrlContainsKeyword(page, keyword)` | URL contains string |
| `validatePlaceholder(page, locator, text)` | Placeholder text |

**Hard assert** — fails the test immediately on mismatch.
**SoftAssert** (`…SoftAssert`) — logs the failure and continues. Use for collecting all failures before the test ends.

### `CommonHelper` — `utils/commonHelper.ts`
Navigation and general utilities.

| Method | Use |
|--------|-----|
| `navigateToHomePage(page)` | Navigate to `baseURL` (from Playwright project config) |
| `navigateToPage(page, url)` | Navigate to a specific path |
| `verifyUrl(page, expectedUrl)` | Assert current URL |
| `scrollAndClickElement(page, selector)` | Scroll to then click |
| `performKeyboardAction(page, key)` | Press a keyboard key |
| `pressEnterKey(page, selector)` | Focus element then press Enter |
| `generateRandomPassword / String / Number` | Random data generators |
| `generateTimestamp()` | ISO timestamp string |

### `BrowserHelper` — `utils/browserHelper.ts`
Browser-level operations.

| Method | Use |
|--------|-----|
| `switchToWindow(page, targetUrl)` | Switch to a tab by URL |
| `switchToTab(page)` | Switch to the newly opened tab |
| `switchToIframe(page, iframeSelector)` | Return iframe context |
| `clickButtonInsideIframe(iframe, selector)` | Click inside an iframe |
| `setGeolocation(page, lat, lng)` | Set browser geolocation |
| `takeScreenshot` | Capture screenshot |
| `getCookies / setCookie / clearCookies` | Cookie management |
| `refreshPage` | Reload page |

### `DeviceHelper` — `utils/deviceHelper.ts`

| Method | Returns |
|--------|---------|
| `DeviceHelper.isMobile()` | `boolean` — `true` if running on a mobile viewport |

### `dataProvider.ts` — `utils/dataProvider.ts`
Dynamically loads test data for TripStacc based on the `PROJECT` env var. It reads the product from `PROJECT` (e.g. `tripstacc-chrome-UAT` → product = `tripstacc`), loads the corresponding JSON, then merges `common` with the active client section (`BOB` or `IDFC`).

```typescript
import { Data } from '../../utils/dataProvider';

// Access merged common + client data:
Data.loginDataFill.mobileNumber
Data.hotelPage.domestic
Data.paymentDataFill.cardNumber
```

Use `Data` from `dataProvider` in TripStacc page files that need multi-client data. For ShopStacc, import `shopStacc.json` directly.

---

## 5. Test Data

### Files

| File | Product | Client(s) | Location |
|------|---------|-----------|----------|
| `tripStacc.json` | TripStacc | BOB, IDFC, common | `TripStacc/testData/tripStacc.json` |
| `shopStacc.json` | ShopStacc | BOBCARD | `ShopStacc/testData/shopStacc.json` |

### `tripStacc.json` — structure

```json
{
  "common": {
    "loginDataFill":       { "mobileNumber", "otp", "city", "checkInDate", "checkOutDate", ... },
    "dateSelector":        { "fromDate", "fromMonth", "toDate", "toMonth" },
    "hotelBookingDataFill": { "firstName", "lastName", "panNumber", "contactNumber", "email" },
    "hotelPage":           { "domestic", "domesticlocation", "international", "rooms", "adults", "children" },
    "flightPage":          { "enterCityFrom", "enterCityTo", "enterInternationalCityTo" },
    "travellername":       { "firstName", "lastName", "email", "phone", "gst", "passport", "country" },
    "redeemPointSection":  { "enterRedeemPoint" },
    "paymentDataFill":     { "cardNumber", "cardExpiry", "cardCvv", "cardName", "otp" }
  },
  "BOB": {
    // BOB-specific overrides of any common section
  },
  "IDFC": {
    // IDFC-specific overrides of any common section
  }
}
```

`dataProvider.ts` deep-merges `common` with the active client section. Client-specific values override common values for the same key.

### `shopStacc.json` — structure

```json
{
  "BOBCARD": {
    "loginDataFill": {
      "mobileNumber": "__CONFIGURE_REVIEW_VALUE__",
      "otp": "__CONFIGURE_REVIEW_VALUE__",
      "userId": "...",
      "userPassword": "__CONFIGURE_REVIEW_VALUE__"
    }
  }
}
```

### Import rules

**TripStacc pages and tests** — use `dataProvider` for dynamic multi-client data:
```typescript
import { Data } from '../../utils/dataProvider';
// Access: Data.loginDataFill.mobileNumber
```

**ShopStacc pages and tests** — import JSON directly:
```typescript
import bobTestData from '../testData/shopStacc.json';
// Access: bobTestData.BOBCARD.loginDataFill.mobileNumber
```

### Rules

- **Never hardcode** credentials, OTPs, mobile numbers, card numbers, names, or city names in page or test files — always read from testData JSON
- **BOB/IDFC overrides** go in the `"BOB"` or `"IDFC"` section of `tripStacc.json`; data shared between both goes in `"common"`
- **ShopStacc data** goes in the `"BOBCARD"` section of `shopStacc.json`
- When adding a new page, add its test data as a new named section in the JSON — do not create separate JSON files

---

## 6. Import Paths

| Writing from… | To utils | To locators | To testData | To pages |
|---------------|----------|-------------|-------------|----------|
| `TripStacc/pages/` | `../../utils/` | `../../TripStacc/locators/` | `../testData/` | `./` |
| `TripStacc/tests/` | `../../utils/` | — | `../testData/` | `../pages/` |
| `ShopStacc/pages/` | `../../utils/` | `../../ShopStacc/locators/` | `../testData/` | `./` |
| `ShopStacc/tests/` | `../../utils/` | — | `../testData/` | `../pages/` |
| `utils/` | — | — | `../TripStacc/testData/` or `../ShopStacc/testData/` | — |

Tests import from **pages only** — not from locators or utils directly.

---

## 7. Running Tests Locally

```bash
# TripStacc — IDFC UAT (headed)
npm run test:tripstacc:idfc:uat:headed

# TripStacc — BOB UAT (headed)
npm run test:tripstacc:bob:uat:headed

# ShopStacc — BOBCard UAT (headed)
npm run test:shopstacc:bobcard:uat:headed

# Run with a specific feature tag
npm run test:tripstacc:idfc:uat:headed -- --grep @Loginpage
npm run test:tripstacc:bob:uat:headed -- --grep @Homepageflight

# Only last-failed tests
npm run test:tripstacc:idfc:uat:headed -- --last-failed
```

The `PROJECT` and `CLIENT` env vars drive which config and which client data section is loaded. They are set by each `npm run` script via `cross-env`.

---

## 8. CI / CD Workflows

All workflows are in `.github/workflows/`. They all:
- Install dependencies (`npm ci`)
- Install Playwright browsers
- Run tests
- Generate a GitHub Pages HTML report (deployed to a unique subdirectory per workflow)
- Send an email report with **📊 View Playwright Report** and **🔗 View Run** links
- Post an MS Teams notification

| Workflow | Trigger | What it runs |
|----------|---------|--------------|
| `bob-uat.yml` | Push to `main`, daily 2:00 AM IST, manual | BOB or IDFC UAT (Chrome) |
| `tripstacc-bob-uat.yml` | Manual | TripStacc BOB — any browser |
| `tripstacc-idfc-uat.yml` | Manual | TripStacc IDFC — any browser |
| `tripstacc-bob-iphone13-uat.yml` | Manual | TripStacc BOB — iPhone13 viewport |
| `tripstacc-bob-galaxys21-uat.yml` | Manual | TripStacc BOB — GalaxyS21 viewport |
| `tripstacc-idfc-iphone13-uat.yml` | Manual | TripStacc IDFC — iPhone13 viewport |
| `tripstacc-idfc-galaxys21-uat.yml` | Manual | TripStacc IDFC — GalaxyS21 viewport |
| `tripstacc_customise.yml` | Push to `main`, daily, manual | TripStacc — any client/env/browser/viewport/tag |
| `shopstacc-bobcard-uat.yml` | Manual | ShopStacc BOBCARD — any browser |
| `shopstacc-bobcard-iphone13-uat.yml` | Manual | ShopStacc BOBCARD — iPhone13 viewport |
| `shopstacc-bobcard-galaxys21-uat.yml` | Manual | ShopStacc BOBCARD — GalaxyS21 viewport |
| `shopstacc_customise.yml` | Push to `main`, daily, manual | ShopStacc — any env/browser/viewport/tag |

**Email subject format:**
```
[PASSED] TripStacc IDFC UAT [Chrome/Web] — Playwright Report
[FAILED] ShopStacc BOBCARD UAT [Firefox/iPhone13] @Loginpage — Playwright Report
```

**GitHub Pages report URL format:**
```
https://{org}.github.io/{repo}/tripstacc/IDFC-UAT/
https://{org}.github.io/{repo}/tripstacc/BOB-UAT/
https://{org}.github.io/{repo}/shopstacc/BOBCARD-UAT/
```
GitHub Pages must be enabled in the repo: **Settings → Pages → Source: Deploy from branch → `gh-pages` → `/(root)`**

---

## 9. Quick Checklist for AI

When creating or editing any file, verify:

**Locator file**
- [ ] Named `{PageName}Locators.ts`
- [ ] In `TripStacc/locators/` or `ShopStacc/locators/`
- [ ] Exported as `export const {Name}Locators = { ... }`
- [ ] All keys camelCase, all values XPath/CSS strings in backticks

**Page file**
- [ ] Named `{PageName}.ts` in `TripStacc/pages/` or `ShopStacc/pages/`
- [ ] Class name matches filename exactly
- [ ] All methods are `static async`
- [ ] Locator assigned to `const` before use — never inlined
- [ ] Every method has a `console.log()` describing what happened
- [ ] Uses `ElementHelper` / `VerificationHelpers` — no raw `page.click()`
- [ ] Client branching via `process.env.CLIENT?.toUpperCase()` + `switch`
- [ ] Viewport branching via `DeviceHelper.isMobile()`

**Test file**
- [ ] Named `{PageName}.test.ts` in `TripStacc/tests/` or `ShopStacc/tests/`
- [ ] Module-level `let context: BrowserContext; let page: Page;`
- [ ] `beforeEach` creates context, opens page, navigates (+ login if needed)
- [ ] `afterEach` closes page and context
- [ ] Test name starts with `SC_NNN:`
- [ ] Tags include correct client tag(s) + feature tag + at least one suite tag
- [ ] Every test uses `test.step()`
- [ ] No locators, `ElementHelper`, or `VerificationHelpers` calls directly in test file

**Test data**
- [ ] No hardcoded credentials, OTPs, or personal data in page/test files
- [ ] New data added to the correct section and file (`tripStacc.json` or `shopStacc.json`)
- [ ] TripStacc shared data in `"common"`, client-specific overrides in `"BOB"` or `"IDFC"`

**Utils**
- [ ] No product-specific or client-specific logic inside utils
- [ ] New helper methods in the correct class
- [ ] Every new verification method has both a hard and a `SoftAssert` variant
