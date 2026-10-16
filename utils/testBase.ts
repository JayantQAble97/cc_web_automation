import { test as base, expect } from '@playwright/test';
import { _android } from 'playwright';
import { getLambdaTestRealDeviceWsEndpoint } from './lambdaGrid';

const isRealDeviceRun =
  process.env.IS_GRID === 'true' && process.env.LAMBDA_REAL_DEVICE === 'true';

// Real Android/iOS device sessions on LambdaTest only work through
// Playwright's native `_android.connect()` + `device.launchBrowser()` API —
// NOT `browserType.connect()` + `browser.newContext()`, which is what
// `connectOptions` in playwright.config.ts drives for desktop/emulated grid
// runs. We verified `browserType.connect()` fails outright on real hardware
// with "Protocol error (Target.createBrowserContext): Failed to create
// browser context." — LambdaTest's proxy for real devices doesn't speak
// that generic CDP command; `launchBrowser()` bypasses it entirely by using
// Android's native app-launch mechanism instead.
//
// Every test file in this repo requests the `browser` fixture directly and
// calls `browser.newContext()` itself in a shared `beforeEach` (they never
// touch Playwright's built-in `context`/`page` fixtures) — so the override
// has to happen at the `browser` fixture, as a shim whose `newContext()`
// runs the `_android` connect/launch flow instead of a real Browser's.
// `context.newPage()` afterwards is a real BrowserContext method from
// `launchBrowser()`, so it needs no override.
//
// Only real-device runs use this extended `test` — every other run (local,
// desktop grid, mobile-emulation grid) imports the untouched Playwright
// `test`, so their behavior is unaffected.
export const test = isRealDeviceRun
  ? base.extend({
      browser: async ({}, use, testInfo) => {
        const shim = {
          newContext: async () => {
            const wsEndpoint = getLambdaTestRealDeviceWsEndpoint(testInfo.project.name);
            const device = await _android.connect(wsEndpoint);
            const context = await device.launchBrowser({
              baseURL: testInfo.project.use.baseURL as string | undefined,
            });
            context.setDefaultTimeout(120000); // real devices are slower than desktop/emulated grid

            const closeContext = context.close.bind(context);
            context.close = async () => {
              await closeContext();
              await device.close();
            };

            return context;
          },
        };

        await use(shim as any);
      },
    })
  : base;

export { expect };
export type { Page, BrowserContext } from '@playwright/test';
