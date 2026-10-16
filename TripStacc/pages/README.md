# TripStacc/pages

Page Object classes — static methods that turn locators into actions and verifications. Tests call these; they never touch `page.click()`/selectors directly.

| File | Class | Covers |
|---|---|---|
| `CommonMethods.ts` | `BaseHelper` | Login + initial navigation shared by most flows (`launchAndLogin`), clicking the hotel tab / search button |
| `Homepage.ts` | `HomePage` | Post-login redirect handling that differs between BOB and IDFC (`handlePostLoginFlow`, `...ForMobile`) |
| `LoginPage.ts` | `LoginPage` | Mobile number + OTP entry, login button, full login flow (`loginWithValidCredentials`) |
| `FlightHomePage.ts` | `FlightHomePage` | Flight search form: city/date pickers, traveller & cabin class selection, filters/sorting, search results (largest file — ~1450 lines) |
| `FlightBookingPage.ts` | `FlightBookingPage` | Post-booking confirmation/pending checks, fare summary, hotel upsell section on the flight confirmation page |
| `HotelHomePage.ts` | `HotelHomePage` | Hotel search form: location, date range, rooms/guests, filters/sorting, result comparisons |
| `HotelBookingPage.ts` | `HotelBookingPage` | Guest details form (add/edit/saved guests, BOB vs IDFC variants), PAN validation, redeem points |
| `PaymentPage.ts` | `PaymentPage` | Card entry, OTP, promo codes, save-card consent, BOB-specific payment steps, booking outcome checks |
| `MyAccountPage.ts` | `MyAccountPage` | Booking history: flight/hotel tabs, status-based actions (view/cancel/modify/invoice) |

## Conventions

- Every method is `static async methodName(page: Page, ...args)` — page objects are stateless; `page` (and any input data) is passed in per call, nothing is stored on the class.
- Method names describe intent, not implementation: `verifyXVisible`, `clickX`, `enterX`, `selectX`, `printX` (debug logging), `getX` (returns a value read from the DOM).
- Assertions live in the page object via `VerificationHelpers` (see `../../utils/`), not in the test file — tests call `verify...` methods and read pass/fail from the assertion, they don't assert inline.
- BOB/IDFC divergence is handled with parallel methods (`clickAddGuestButton` vs `clickAddGuestButtonForIDFC`, `removePopup` vs `removePopupForIDFC`) rather than branching inside one method — callers decide which to use based on `CLIENT`.
- Locators are imported from the matching file in [`../locators/`](../locators/) — page objects don't inline XPaths.

## Example: how a page object gets used

`LoginPage.ts` wraps the locators from [`../locators/LoginPageLocators.ts`](../locators/README.md#example-how-a-locator-gets-used) into named actions, using `Data` for the values to type in:

```typescript
// pages/LoginPage.ts
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import { Data } from '../../utils/dataProvider';

export class LoginPage {
  static async enterMobileNumber(page: Page, mobileNumber: string): Promise<void> {
    await page.locator(LoginPageLocators.mobileNumberField).fill(mobileNumber);
  }

  static async clickGetOtpButton(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, LoginPageLocators.getOtpButton);
  }

  // A composed flow: chains several of this class's own methods together,
  // pulling values from Data (see ../testData/README.md) instead of hardcoding them
  static async loginWithValidCredentials(page: Page): Promise<void> {
    await this.enterMobileNumber(page, Data.loginDataFill.mobileNumber);
    await this.clickGetOtpButton(page);
    await this.verifyOtpPageVisible(page);
    await this.enterOtp(page, Data.loginDataFill.otp);
    await this.clickLoginButton(page);
  }
}
```

A test then calls only `LoginPage.loginWithValidCredentials(page)` — it never sees a locator or a raw XPath. See [`../tests/README.md`](../tests/README.md#example-how-a-test-gets-used) for the full spec.

## Adding a new page object

1. Add locators first in `../locators/`.
2. Create `pages/MyFeaturePage.ts` exporting `export class MyFeaturePage { static async ... }`.
3. Keep one action/verification per method — compose multi-step flows in the *test*, not by chaining unrelated actions inside one page-object method.
4. If BOB and IDFC need different steps, add a second `...ForIDFC` (or `...ForBOB`) method rather than an `if (CLIENT === ...)` branch inside one method — matches the existing pattern in `HotelBookingPage.ts`.
