import 'dotenv/config';
import { defineConfig } from '@playwright/test';
import { getProjectConfig, getBaseUrl } from './utils/projectsConfig';
import { GRID, getLambdaTestWsEndpoint } from './utils/lambdaGrid';
const mobileDevices = require('./mobileDevices');

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const TIMEOUT = 300000;
//const RETRIES = 1;             // retries on failure
const WORKERS = { ci: 1, local: 2 };
const HEADED  = process.env.HEADED === 'true';
// ─────────────────────────────────────────────────────────────────────────────

type BrowserName = 'chromium' | 'firefox' | 'webkit';

// ✅ ENV + CLIENT
const projectEnv = process.env.PROJECT || '';
const CLIENT = process.env.CLIENT?.toUpperCase() || 'BOB';

const parts = projectEnv.split('-');

const product = parts[0]?.toLowerCase();
const browserEnv = parts[1]?.toLowerCase();
const environment = parts[2]?.toUpperCase();

// ✅ Device & Tag parsing
let deviceName: string | undefined;
let tag: string | undefined;

if (parts[3]?.toLowerCase() === 'mobile') {
  deviceName = parts[4];
  tag = parts[5];
} else {
  const deviceOrTag = parts[3];

  const knownDevice = mobileDevices.find(
    (d: { name: string }) =>
      d.name.toLowerCase() === deviceOrTag?.toLowerCase()
  );

  if (knownDevice) {
    deviceName = knownDevice.name;
    tag = parts[4];
  } else {
    tag = deviceOrTag;
  }
}

// ✅ Browser mapping
const mappedBrowser: BrowserName =
  browserEnv === 'firefox'
    ? 'firefox'
    : browserEnv === 'webkit' || browserEnv === 'safari'
    ? 'webkit'
    : 'chromium';

// ✅ LambdaTest browserName mapping (LT expects its own browser identifiers)
const lambdaBrowserName =
  mappedBrowser === 'firefox'
    ? 'pw-firefox'
    : mappedBrowser === 'webkit'
    ? 'pw-webkit'
    : 'Chrome';

// ✅ Test directory + base URL — both sourced from cc.config.yaml so new
// clients/environments/products only require a yaml edit, no code changes.
const testDir = getProjectConfig(product).testDir;

const baseURL = getBaseUrl(product, CLIENT, environment);


// ✅ Projects
const projects: any[] = [];

if (deviceName) {
  const selectedDevice = mobileDevices.find(
    (d: any) =>
      d.name.toLowerCase() === deviceName!.toLowerCase()
  );

  if (selectedDevice) {
    const projectName = `${product}-${browserEnv}-${environment}-${CLIENT}-mobile-${selectedDevice.name.toLowerCase()}`;
    const useRealDevice = GRID.isGrid && GRID.realDevice;

    projects.push({
      name: projectName,
      testDir,
      // Real hardware dictates its own browser/viewport/UA, and connects via
      // Playwright's native `_android` API rather than `browserType.connect()`
      // (see utils/testBase.ts for why) — so `connectOptions` doesn't apply
      // here. `context`/`page` fixtures are fully overridden in testBase.ts
      // for real-device runs; this `use` block only needs to supply baseURL.
      use: useRealDevice
        ? {
            baseURL,
          }
        : {
            baseURL,
            browserName: mappedBrowser,
            channel:
              browserEnv === 'chrome'
                ? 'chrome'
                : browserEnv === 'edge'
                ? 'msedge'
                : undefined,
            headless: !HEADED,

            viewport: selectedDevice.viewport,
            isMobile: selectedDevice.isMobile,
            hasTouch: selectedDevice.hasTouch,
            userAgent: selectedDevice.userAgent,
            // Temporary workaround for UAT WebKit SSL issues
            ignoreHTTPSErrors:
             environment === 'UAT' && mappedBrowser === 'webkit',

            screenshot: 'on',
            video: 'on',
          

            connectOptions: GRID.isGrid
              ? {
                  wsEndpoint: getLambdaTestWsEndpoint(lambdaBrowserName, projectName),
                }
              : undefined,
          },
    });
  }
} else {
  projects.push({
    name: `${product}-${browserEnv}-${environment}-${CLIENT}`,
    testDir,
    use: {
      baseURL,
      browserName: mappedBrowser,

      channel:
        browserEnv === 'chrome'
          ? 'chrome'
          : browserEnv === 'edge'
          ? 'msedge'
          : undefined,

      headless: !HEADED,
      viewport: HEADED
    ? null
    : {
       width: 1920,
       height: 1080,
},

      screenshot: 'on',
      video: 'on',
      trace: "on",

      launchOptions:
        mappedBrowser === 'chromium'
          ? { args: ['--start-maximized'] }
          : undefined,

      connectOptions: GRID.isGrid
        ? {
            wsEndpoint: getLambdaTestWsEndpoint(
              lambdaBrowserName,
              `${product}-${browserEnv}-${environment}-${CLIENT}`
            ),
          }
        : undefined,
    },
  });
}

// ✅ Final config export
export default defineConfig({
  projects,

  timeout: TIMEOUT,
  fullyParallel: true,
  workers: process.env.CI ? WORKERS.ci : WORKERS.local,
  //retries: RETRIES,

  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['html', { outputFolder: './playwright-report', open: 'never' }],
  ],

  grep: tag ? new RegExp(`@${tag}`, 'i') : undefined,
});
