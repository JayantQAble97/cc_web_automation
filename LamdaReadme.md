# LambdaTest Grid — Setup & Run Guide

This project can run Playwright tests locally (default) or remotely on
LambdaTest's cloud grid. Grid wiring lives in [playwright.config.ts](playwright.config.ts) —
look for the `GRID` object and the `connectOptions` block in each project.

## How it works

When `IS_GRID=true`, each Playwright project sets `use.connectOptions.wsEndpoint`
to a LambdaTest CDP URL instead of launching a local browser:

```
wss://cdp.lambdatest.com/playwright?capabilities=<url-encoded LT:Options JSON>
```

`getLambdaTestWsEndpoint(browserName, name)` in `playwright.config.ts` builds
that URL from your env vars + the `GRID.lambdatest.capabilities` object. When
`IS_GRID` is unset/`false`, none of this applies and tests run locally exactly
as before.

## Environment variables

Set these in a local `.env` file (gitignored — copy `.env.example` to start)
or export them in your shell. In CI, set them as repo secrets instead.

| Variable          | Required | Default        | Purpose                                                                 |
|-------------------|----------|----------------|--------------------------------------------------------------------------|
| `IS_GRID`         | no       | `false`        | `true` routes the run to LambdaTest; `false`/unset runs locally         |
| `LAMBDA_USER`     | if grid  | —              | LambdaTest username                                                     |
| `LAMBDA_KEY`      | if grid  | —              | LambdaTest access key                                                   |
| `LAMBDA_PLATFORM` | no       | `Windows 10`   | OS the remote browser runs on, e.g. `Windows 10`, `Monterey`, `Ventura` |
| `PROJECT`         | yes      | —              | Existing convention: `<product>-<browser>-<env>[-<device>-<tag>]`      |
| `CLIENT`          | no       | `BOB`          | Existing convention (`BOB` / `IDFC` / `BOBCARD`)                        |
| `HEADED`          | no       | `false`        | Only affects local runs (has no visible effect when `IS_GRID=true`)     |

Find your username/access key on LambdaTest under **Profile → Password &
Security**. Treat the access key like a password — never commit it or paste
it in chat/tickets; rotate it if it's ever exposed.

> **Never commit credentials.** `.env` is gitignored on purpose — always use
> `.env.example` as the template for new machines/teammates.

## Browser & platform mapping

`playwright.config.ts` derives the LambdaTest `browserName` from your
`PROJECT` string's browser segment:

| `PROJECT` browser segment | LambdaTest `browserName` |
|---------------------------|---------------------------|
| `chrome` (default)        | `Chrome`                  |
| `firefox`                 | `pw-firefox`              |
| `webkit` / `safari`       | `pw-webkit`               |

`LAMBDA_PLATFORM` selects the OS the remote browser runs on. LambdaTest
platform names for reference: `Windows 10`, `Windows 11`, `Monterey` (macOS
12), `Ventura` (macOS 13), `Sonoma` (macOS 14). Full list is on LambdaTest's
[capabilities docs](https://www.lambdatest.com/support/docs/capabilities-for-playwright/).

## Run examples

All examples use `npx cross-env` (this repo's existing convention — see
`package.json` scripts). Add `HEADED=true` for local-only runs; it's ignored
on the grid.

### Desktop — Windows

```bash
# Windows 10 + Chrome
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Windows 10" PROJECT=tripstacc-chrome-UAT CLIENT=BOB npx playwright test TripStacc/tests

# Windows 10 + Firefox
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Windows 10" PROJECT=tripstacc-firefox-UAT CLIENT=BOB npx playwright test TripStacc/tests
```

### Desktop — macOS

```bash
# macOS (Ventura) + Chrome
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Ventura" PROJECT=tripstacc-chrome-UAT CLIENT=BOB npx playwright test TripStacc/tests

# macOS (Ventura) + Firefox
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Ventura" PROJECT=tripstacc-firefox-UAT CLIENT=BOB npx playwright test TripStacc/tests

# macOS (Ventura) + Safari
# Playwright has no real Safari engine — `webkit` is Apple's WebKit engine,
# the closest available match, and is what LambdaTest runs for "Safari" here.
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Ventura" PROJECT=tripstacc-webkit-UAT CLIENT=BOB npx playwright test TripStacc/tests
```

### Mobile — viewport/UA emulation on the grid

This repo's existing `-mobile-<device>` PROJECT convention (see
`mobileDevices.js`) also works with `IS_GRID=true`: Playwright applies the
device's viewport, touch, and user-agent on top of a remote desktop browser
(Chrome/Firefox/WebKit) running on LambdaTest. This is **emulation**, not
real hardware — good for responsive-layout checks, not a substitute for a
real-device pass.

```bash
# "Android" Chrome (Galaxy S21 viewport/UA, Chrome engine)
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Windows 10" PROJECT=tripstacc-chrome-UAT-mobile-GalaxyS21 CLIENT=BOB npx playwright test TripStacc/tests

# "Android" Firefox (Galaxy S21 viewport/UA, Firefox engine)
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Windows 10" PROJECT=tripstacc-firefox-UAT-mobile-GalaxyS21 CLIENT=BOB npx playwright test TripStacc/tests

# "iPhone" — webkit engine (iPhone13 viewport/UA)
npx cross-env IS_GRID=true LAMBDA_PLATFORM="Windows 10" PROJECT=tripstacc-webkit-UAT-mobile-iPhone13 CLIENT=BOB npx playwright test TripStacc/tests
```

> **Why there's no "iPhone Chrome" / "iPhone Firefox" row:** on real iOS,
> Apple requires every browser (Chrome, Firefox, etc.) to use Apple's WebKit
> rendering engine under the hood — there is no separate iOS Chrome/Firefox
> engine to test against. `webkit` is the only meaningful choice for iPhone,
> whether emulated (above) or on real hardware (below).

## Real mobile hardware (not wired into this repo yet)

LambdaTest also offers actual physical Android/iOS devices, but that's a
different Playwright connection flow than the desktop grid above — different
capability shape, and Node's `_android.connect()` API on the Android side —
so it isn't part of `playwright.config.ts` today. For reference:

- **Android real devices**: Chrome only (no Firefox — Firefox for Android
  isn't Chromium-based, so it isn't exposed over LambdaTest's CDP endpoint).
  Capability shape: `{ "LT:Options": { platformName: "android", deviceName: "Pixel 5", platformVersion: "13", isRealMobile: true, ... } }`.
- **iOS real devices**: Safari only, for the same WebKit-only reason above.
  Capability shape: `{ "LT:Options": { platformName: "ios", deviceName: "iPhone 16", platformVersion: "18", isRealMobile: true, ... } }`.

Docs: [Playwright Android real devices](https://www.lambdatest.com/support/docs/playwright-android/),
[Playwright iOS real devices](https://www.lambdatest.com/support/docs/playwright-ios-device/).
If you need this, it'd be a follow-up (separate project block/connect logic,
since it isn't a `chromium.connect({ wsEndpoint })` swap like desktop/emulated
mobile is).

## Troubleshooting

- **`sh: .../node_modules/.bin/playwright: Permission denied`** — the binary
  lost its executable bit (can happen if `node_modules` is committed to git).
  Fix locally: `chmod +x node_modules/.bin/playwright`.
- **`command not found: cross-env`** — it's a local devDependency, not a
  global command. Run it via `npx cross-env ...`, not bare `cross-env ...`.
- **Grid run doesn't show up on the LambdaTest dashboard** — double check
  `LAMBDA_USER`/`LAMBDA_KEY` are actually set (`echo $LAMBDA_USER` or check
  your `.env`) and that `IS_GRID=true` is actually being passed through.
