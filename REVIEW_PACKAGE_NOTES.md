# Customer Capital code-review package

Original working files, dependencies and all execution artifacts were left untouched. The ZIP excludes generated outputs, logs, images, traces, videos, node_modules, backup ZIPs, scratch scripts, .env files and local tool settings.

## Reviewer setup

Replace __CONFIGURE_*__ placeholders with approved UAT data obtained separately through a secure channel. HDFC requires a registered mobile number, valid four-digit OTP, invalid OTP test value and eligible six-digit credit-card BIN. Other clients require credentials, contact/traveller information, card/CVV/expiry/payment data and test identifiers where applicable. Unconfigured placeholders intentionally fail existing validators.

Hardcoded test phone/tax identifiers in two TripStacc review-copy page objects and credential examples in documentation are redacted too. These are literal-only review-copy changes; originals remain unchanged.

Files with review-copy redactions or JSON reformatting:
- README.md
- RULES.md
- ShopStacc/testData/shopStacc.json
- SSV2/testData/hdfcEmiEligibility.json
- SSV2/testData/hdfcLogin.json
- TripStacc/pages/FlightHomePage.ts
- TripStacc/pages/PaymentPage.ts
- TripStacc/testData/README.md
- TripStacc/testData/tripStacc.json

Install dependencies using npm.cmd ci. Configure environment secrets locally. Existing script names, configuration selection and assertions are retained. Historical reports referenced by README files are intentionally absent.
