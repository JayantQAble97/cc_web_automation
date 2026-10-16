# Homepage requirements coverage

Run the six requested cases:

```powershell
npm run test:shopstacc:bobcard:uat -- --grep 'TC_HOME_(003|012|018|023|025|036)'
```

| Case | Assertions |
| --- | --- |
| TC_HOME_003 | Search input accepts `phone` through keyboard events; autocomplete shows a visible matching product suggestion and image. |
| TC_HOME_012 | Smartphones menu exposes Samsung; its link opens a listing whose displayed products match Samsung. |
| TC_HOME_018 | Visible Shop Now link agrees with the expected campaign URL; destination heading matches the promotion. |
| TC_HOME_023 | Product name, struck-through MRP, selling price, discount arithmetic, monthly EMI and approved EMI amount. |
| TC_HOME_025 | Product card destination URL, matching PDP name and visible product image. |
| TC_HOME_036 | Empty browser storage; homepage, category navigation and search work without login; account action displays a login prompt. |

Configure these environment variables with actual BOBCARD test data before running:

- `SHOPSTACC_GUEST_HOME_URL`: direct guest storefront URL; do not use an SSO URL or myemishop.com.
- `SHOPSTACC_GUEST_ACCOUNT_ACTION`: selector for an account-specific action on the guest homepage.
- `SHOPSTACC_GUEST_LOGIN_PROMPT`: selector for the login form or dialog shown after that action.
- `SHOPSTACC_BANNER_EXPECTED_URL`: expected href for the active Shop Now campaign.
- `SHOPSTACC_BANNER_EXPECTED_HEADING`: exact heading on that campaign's destination page.
- `SHOPSTACC_EMI_PRODUCT_NAME`: name of the product selected by the existing homepage product locator.
- `SHOPSTACC_EXPECTED_EMI`: approved monthly amount for that product's advertised financing terms, numeric without currency separators.

Missing campaign/EMI/guest data raises an explicit error rather than passing or silently skipping a test. Discount calculations allow one percentage point for display rounding. EMI correctness uses approved test data because price alone cannot determine tenure, interest or down-payment.

The mega-menu, Shop Now, struck-through price and EMI selectors are based on the supplied requirements and still need verification against the correct BOBCARD storefront. The existing configured login redirects to an IDFC storefront. These results do not establish a pass on BOBCARD.

Live DOM investigation found:

- The desktop `#txtsearch` has no Enter handler. Keyboard input produces jQuery UI autocomplete product suggestions, including `apple iphone 16 12` for `phone`. TC_HOME_003 now exercises that supported requirement branch.
- Navigation contains Products/Gift Cards/Shop Luxury rather than the requested Smartphones mega-menu.
- Hero banners are image links with promotion IDs 87 and 81, not accessible text links named Shop Now. Expected promotion data remains required to verify campaign correctness.
- The sixth product in `spcl656` is an Ambrane tyre inflator displaying selling price, earned points and points-plus-cash; its card has no struck-through MRP, discount or monthly EMI amount. The price selector failure is not evidence of incorrect application pricing.
- A fresh browser context visiting the observed storefront redirects to `/login.html?redirect=%2F` and displays Restricted Access. Guest access is unavailable on this observed UAT route.

Guest account-action and login-prompt selectors must be taken from the actual BOBCARD guest page.
