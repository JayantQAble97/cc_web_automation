// Shared LambdaTest grid config/helpers — used by both playwright.config.ts
// (desktop + mobile-emulation grid runs) and utils/testBase.ts (real device
// runs, which need to build the same capabilities but connect via a
// different Playwright API — see testBase.ts for why).

import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

type GridProfile = {
  isGrid?: boolean;
  realDevice?: boolean;
  platform?: string;
  resolution?: string;
  projectName?: string;
  buildName?: string;
  realDeviceOptions?: {
    platformName?: string;
    deviceName?: string;
    platformVersion?: string;
  };
};

// Profiles live under the "grid" key in cc.config.yaml (project root) so
// platform/device targets can be edited without touching package.json.
// GRID_PROFILE picks one; grid.defaultProfile in the YAML is used otherwise.
// Any LAMBDA_*/IS_GRID env var set via cross-env still overrides the profile
// value below, so existing npm scripts keep behaving exactly as before.
function loadProfile(): GridProfile {
  const configPath = path.resolve(__dirname, '../cc.config.yaml');
  if (!fs.existsSync(configPath)) return {};

  const parsed = YAML.parse(fs.readFileSync(configPath, 'utf8')) || {};
  const grid = parsed.grid || {};
  const profiles = grid.profiles || {};
  const profileName = process.env.GRID_PROFILE || grid.defaultProfile;
  return profiles[profileName] || {};
}

function bool(envVal: string | undefined, profileVal: boolean | undefined, fallback: boolean): boolean {
  if (envVal !== undefined) return envVal === 'true';
  if (profileVal !== undefined) return profileVal;
  return fallback;
}

function str(envVal: string | undefined, profileVal: string | undefined, fallback: string): string {
  return envVal || profileVal || fallback;
}

const profile = loadProfile();

export const GRID = {
  isGrid: bool(process.env.IS_GRID, profile.isGrid, false),
  // Real physical Android/iOS hardware instead of desktop-browser emulation.
  realDevice: bool(process.env.LAMBDA_REAL_DEVICE, profile.realDevice, false),
  provider: 'lambdatest',

  lambdatest: {
    user: process.env.LAMBDA_USER,
    key: process.env.LAMBDA_KEY,
    capabilities: {
      platform: str(process.env.LAMBDA_PLATFORM, profile.platform, 'Windows 10'),
      resolution: str(undefined, profile.resolution, '1920x1080'),
      // Groups dashboard sessions — defaults to the PROJECT env var so runs
      // are identifiable (was hardcoded to 'Login Test' before, which made
      // every run land under the same generic, hard-to-find build).
      build: process.env.LAMBDA_BUILD_NAME || process.env.PROJECT || profile.buildName || 'Playwright Grid Run',
      projectName: str(undefined, profile.projectName, 'Web Framework'),
      console: true,
      network: true,
      visual: true,
      video: true,
    },
    // '.*' lets LambdaTest pick any available match for device/version.
    realDeviceOptions: {
      platformName: str(process.env.LAMBDA_PLATFORM_NAME, profile.realDeviceOptions?.platformName, 'android'), // 'android' | 'ios'
      deviceName: str(process.env.LAMBDA_DEVICE_NAME, profile.realDeviceOptions?.deviceName, '.*'),
      platformVersion: str(process.env.LAMBDA_PLATFORM_VERSION, profile.realDeviceOptions?.platformVersion, '.*'),
    },
  },
};

// Builds the LambdaTest CDP endpoint Playwright connects to instead of
// launching a local browser. `browserName`/`name` are set per-project so
// runs are identifiable in the LambdaTest dashboard. Desktop + emulated
// mobile only — real devices use getLambdaTestRealDeviceWsEndpoint below.
export function getLambdaTestWsEndpoint(browserName: string, name: string): string {
  const ltOptions = {
    ...GRID.lambdatest.capabilities,
    browserName,
    name,
    user: GRID.lambdatest.user,
    accessKey: GRID.lambdatest.key,
  };
  const capabilities = { 'LT:Options': ltOptions };
  return `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
    JSON.stringify(capabilities)
  )}`;
}

// Real Android/iOS hardware capability shape (platformName + deviceName +
// isRealMobile) — used with Playwright's native `_android.connect()` API,
// NOT `browserType.connect()`. Real devices only expose a single browser
// context (the one already open on the device); the generic CDP
// `Target.createBrowserContext` command LambdaTest's proxy speaks for
// desktop/emulated `pw-chromium`/`pw-firefox`/`pw-webkit` isn't supported
// on real hardware, which is why this needs its own connection path (see
// utils/testBase.ts) instead of `connectOptions` in playwright.config.ts.
export function getLambdaTestRealDeviceWsEndpoint(name: string): string {
  const { platformName, deviceName, platformVersion } = GRID.lambdatest.realDeviceOptions;
  const playwrightClientVersion =
    process.env.LAMBDA_PLAYWRIGHT_VERSION || require('@playwright/test/package.json').version;
  const ltOptions = {
    platformName,
    deviceName,
    platformVersion,
    isRealMobile: true,
    build: GRID.lambdatest.capabilities.build,
    name,
    user: GRID.lambdatest.user,
    accessKey: GRID.lambdatest.key,
    network: true,
    video: true,
    console: true,
    playwrightClientVersion,
  };
  const capabilities = { 'LT:Options': ltOptions };
  return `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
    JSON.stringify(capabilities)
  )}`;
}
