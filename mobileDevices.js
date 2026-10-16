const { devices } = require('@playwright/test');

module.exports = [
  {
    name: 'iPhone12',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  },
  {
    // width: 390, height: 844
    name: 'iPhone13',
    // SSV2 resolves this standard profile; root TripStacc keeps legacy sizing.
    playwrightDevice: 'iPhone 13',
    viewport: { width: 390, height: 700 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'iPhone13ProMax',
    viewport: { width: 428, height: 926 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'iPhoneSE',
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'GalaxyS20',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SM-G980F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  {
    name: 'GalaxyS21',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  {
    name: 'Pixel4a',
    viewport: { width: 412, height: 869 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; Pixel 4a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  {
    name: 'Pixel5',
    viewport: { width: 393, height: 851 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  {
    name: 'OnePlus8',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; OnePlus 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  {
    name: 'OnePlus9',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; OnePlus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
  },
  { ...devices['iPhone 16'], name: 'iPhone16', playwrightDevice: 'iPhone 16' },
  { ...devices['Galaxy S8'], name: 'GalaxyS8', playwrightDevice: 'Galaxy S8' },
];
 
