# TripStacc/locators

Plain object maps of element selectors (mostly XPath, some CSS) for TripStacc pages. One file per page/feature area:

| File | Covers |
|---|---|
| `LoginPageLocators.ts` | Mobile number / OTP login screen |
| `HomePageLocators.ts` | Post-login multi-card selection popup |
| `FlightPageLocators.ts` | Flight search, filters, traveller details, add-ons, seat/baggage selection, booking confirmation, footer links (desktop + mobile variants) |
| `HotelPageLocators.ts` | Hotel search, date/room pickers, filters, guest details, redeem points (desktop + mobile variants) |
| `PaymentPageLocators.ts` | Card entry, OTP, promo codes, redeem points, BOB/IDFC-specific payment buttons |
| `MyAccountPageLocators.ts` | Booking history tabs (flights/hotels, upcoming/completed/cancelled), booking actions |

Locators have no logic — they're consumed by the matching class in [`../pages/`](../pages/) via `ElementHelper`/`VerificationHelpers` (see `../../utils/`).

## Conventions

- Export a single `const {PageName}Locators = { ... }` object per file.
- Keys are camelCase and describe the element's role, not its markup (`getOtpButton`, not `btnLogin`).
- Where BOB and IDFC render different markup for the same flow, both XPaths are combined with `|` in one locator (e.g. `bookingStatus`, `travellerDetailsPageContinuebutton`) rather than branching in the page object.
- Mobile-only locators are suffixed `Mobile` (e.g. `fromCityMobile`, `hotelTabMobile`) alongside their desktop counterpart, instead of a separate file.
- A few locators are functions instead of plain strings when the XPath needs a runtime value — e.g. `dateCell: (day: string) => ...` in `FlightPageLocators`, or the `{roomNo}` / `{monthYear}` / `{date}` placeholder tokens in `HotelPageLocators` that the page object replaces with `.replace()` before use.

## Example: how a locator gets used

`LoginPageLocators.ts` defines the field as a plain XPath string:

```typescript
// locators/LoginPageLocators.ts
export const LoginPageLocators = {
  mobileNumberField: `//input[@id='txtMobileNo']`,
  getOtpButton: `//button[@id='btnLogin']`,
  // ...
};
```

The locator itself does nothing — it's just a string. A page object in [`../pages/`](../pages/) is what turns it into an action:

```typescript
// pages/LoginPage.ts
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';

static async enterMobileNumber(page: Page, mobileNumber: string): Promise<void> {
  await page.locator(LoginPageLocators.mobileNumberField).fill(mobileNumber);
}
```

See [`../pages/README.md`](../pages/README.md#example-how-a-page-object-gets-used) for how that method is then called from a test.

## Adding a locator

1. Add the key to the relevant `*Locators.ts` file (or create a new file if it's a new page).
2. Keep it flat — no nested objects — so lookups stay `Locators.key`.
3. If both clients (BOB/IDFC) need it but render different markup, combine both XPaths with `|` rather than adding a client-specific key.
4. Prefer stable attributes (`id`, `data-testid`) over class names or text where the site provides them — classes here (e.g. `flduserbox`, `pagehding pageheadingnone`) are more brittle and the main source of selector breakage across releases.
