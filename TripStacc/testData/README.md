# TripStacc/testData

Holds `tripStacc.json` — the single test-data file for all TripStacc tests, shared across both clients.

## Structure

```json
{
  "common": { "...": "values used regardless of client" },
  "BOB":    { "...": "overrides/additions specific to BOB" },
  "IDFC":   { "...": "overrides/additions specific to IDFC" }
}
```

Top-level keys under `common` group data by feature:

| Key | Contents |
|---|---|
| `loginDataFill` | Default mobile number, OTP, and a couple of unused legacy fields (email/password) |
| `dateSelector` | Fixed from/to dates used to drive the date-picker tests |
| `hotelBookingDataFill` | Guest details (name, PAN, contact, email) used when filling the hotel booking form |
| `hotelPage` | Hotel search inputs — domestic/international city names, hotel names to search for, room/adult/children counts per scenario |
| `flightPage` | City names typed into the flight search autocomplete |
| `travellername` | Traveller-details form inputs, including intentionally invalid ones (`WrongfirstName`, `WronglastName`) for validation tests |
| `promocode` | Invalid promo code used to test the error path |
| `redeemPointSection` | Points value entered in redeem-points tests |

`BOB` and `IDFC` each override `loginDataFill` (different mobile number/OTP per client's test account) and provide `paymentDataFill` (client-specific test card number, expiry, CVV, OTP).

## How it's loaded

Tests don't `require()` this file directly — they import `Data` from `../../utils/dataProvider.ts`, which:

1. Picks the product (`tripstacc`) from the `PROJECT` env var and loads this JSON.
2. Picks the client (`BOB`/`IDFC`) from the `CLIENT` env var.
3. Deep-merges `common` with the client-specific block (client keys win on conflicts) into one flat `Data` object.

```typescript
import { Data } from '../../utils/dataProvider';

await LoginPage.enterMobileNumber(page, Data.loginDataFill.mobileNumber); // BOB or IDFC number, depending on CLIENT
await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);  // always "ahmedabad" — from common
```

`HotelPage.test.ts` also imports the raw JSON directly (`import idfcTestData from '../testData/tripStacc.json'`) for a couple of lookups — prefer `Data` from `dataProvider` for anything client-specific, since the raw import skips the BOB/IDFC merge.

## Example: how a test-data value gets used

`tripStacc.json` stores the raw values:

```json
{
  "common": {
    "loginDataFill": {
      "mobileNumber": "__CONFIGURE_BOBCARD_LOGINDATAFILL_MOBILENUMBER__",
      "otp": "__CONFIGURE_BOBCARD_LOGINDATAFILL_OTP__"
    }
  },
  "BOB":  { "loginDataFill": { "mobileNumber": "__CONFIGURE_COMMON_TRAVELLERNAME_PHONE__", "otp": "__CONFIGURE_BOBCARD_LOGINDATAFILL_OTP__" } },
  "IDFC": { "loginDataFill": { "mobileNumber": "__CONFIGURE_BOBCARD_LOGINDATAFILL_MOBILENUMBER__", "otp": "__CONFIGURE_BOBCARD_LOGINDATAFILL_OTP__" } }
}
```

`dataProvider.ts` merges `common` with whichever client block matches the `CLIENT` env var into the exported `Data` object — so `Data.loginDataFill.mobileNumber` resolves to the BOB or IDFC number automatically depending on how the run was launched:

```typescript
// utils/dataProvider.ts
export const Data = deepMerge(testData.common || {}, testData[CLIENT_KEY] || {});
```

`../pages/LoginPage.ts` then reads it directly — it never touches the JSON file itself:

```typescript
import { Data } from '../../utils/dataProvider';

await this.enterMobileNumber(page, Data.loginDataFill.mobileNumber);
```

See [`../pages/README.md`](../pages/README.md#example-how-a-page-object-gets-used) for that method in context, and [`../tests/README.md`](../tests/README.md#example-how-a-test-gets-used) for the test that triggers it.

## Adding test data

- Client-agnostic values go under `common`.
- Values that differ per client (credentials, payment test cards) go under `BOB`/`IDFC` with the same key name as any `common` field they override.
- Card numbers here are sandbox/test values for the respective payment gateway's UAT environment — never put real card data in this file.
