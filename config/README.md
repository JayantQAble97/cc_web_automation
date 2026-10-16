# config/

Holds environment base-URL maps used by [`playwright.config.ts`](../playwright.config.ts) to resolve the `baseURL` for a run.

## `ts.config.ts`

Exports one URL map per client, keyed by environment (`QA`, `UAT`, `PROD`):

| Export | Client | Product |
|---|---|---|
| `BOB_TS` | BOB | TripStacc |
| `IDFC_TS` | IDFC | TripStacc |
| `BOBCard_SS` | BOBCard | ShopStacc |

```typescript
export const BOB_TS = {
  QA: 'https://qa-travel-1-6-bobcard.travel-loyalty.com/',
  UAT: 'https://uat-travel-bobcard.travel-loyalty.com/',
  PROD: '',
};
```

`PROD` is currently blank for every client — production runs are not yet configured.

### How it's consumed

`playwright.config.ts` reads the `PROJECT` env var to determine `product`, `environment`, and the `CLIENT` env var to pick the client, then looks up the matching URL:

```typescript
if (product === 'tripstacc') {
  baseURL = CLIENT === 'BOB'
    ? BOB_TS[environment] || BOB_TS.QA
    : IDFC_TS[environment] || IDFC_TS.QA;
} else if (product === 'shopstacc') {
  baseURL = BOBCard_SS[environment] || BOBCard_SS.QA; // ShopStacc always uses BOBCard, CLIENT is ignored
}
```

If `environment` doesn't match a key (or is missing), it silently falls back to `QA`.

### Adding a new environment or client

1. Add the key (e.g. a new `PROD` URL, or a whole new `export const X_TS = {...}` block) to `ts.config.ts`.
2. If it's a new client, wire it into the `if/else` in `playwright.config.ts` and add it to the relevant GitHub Actions workflow's `client` input options (see the repo root [USER_GUIDE.md](../USER_GUIDE.md) for the workflow list).
3. Keep the three-key shape (`QA` / `UAT` / `PROD`) so the `|| X.QA` fallback keeps working.
