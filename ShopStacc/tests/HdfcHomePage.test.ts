import { test } from '../../utils/testBase';
import { HdfcHomePage } from '../pages/HdfcHomePage';

test.use({ storageState: { cookies: [], origins: [] } });
test.skip(process.env.CLIENT?.toUpperCase() !== 'HDFC', 'HDFC storefront suite requires CLIENT=HDFC');
test.beforeEach(async ({ page }, testInfo) => {
  await HdfcHomePage.open(page);
  const mobile = process.env.HDFC_MOBILE;
  const otp = process.env.HDFC_OTP;
  if (!testInfo.title.startsWith('TC_HOME_036') && (mobile || otp)) {
    if (!mobile || !otp) throw new Error('Provide both HDFC_MOBILE and HDFC_OTP for authenticated runs');
    await HdfcHomePage.login(page, mobile, otp);
  }
});

test('TC_HOME_003: Relevant search suggestions', { tag: ['@hdfc', '@homepage', '@smoke', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifySearch(page);
});
test('TC_HOME_012: Mega-menu brand filtered listing', { tag: ['@hdfc', '@homepage', '@navigation', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifyMegaMenu(page);
});
test('TC_HOME_018: Promotional banner opens matching collection', { tag: ['@hdfc', '@homepage', '@banner', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifyBanner(page);
});
test('TC_HOME_023: Product price discount and monthly EMI', { tag: ['@hdfc', '@homepage', '@regression', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifyPricing(page);
});
test('TC_HOME_025: Product card opens matching PDP', { tag: ['@hdfc', '@homepage', '@smoke', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifyProductNavigation(page);
});
test('TC_HOME_036: Guest browsing and account login prompt', { tag: ['@hdfc', '@homepage', '@guest', '@smoke', '@sanity'] }, async ({ page }) => {
  await HdfcHomePage.verifyGuest(page);
});
