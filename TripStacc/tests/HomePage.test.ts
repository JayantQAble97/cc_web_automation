import { test, Page, BrowserContext } from '../../utils/testBase';
import { BaseHelper } from '../pages/CommonMethods';
import { HomePage } from '../pages/Homepage';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await BaseHelper.launchAndLogin(page);
  await page.waitForLoadState('domcontentloaded');
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});

test('TS_HP_001: Validate promotional offers / rewards banners are displayed', { tag: ['@idfc', '@bob', '@common', '@homepage', '@smoke', '@sanity'] }, async () => {
 
  const heroBannerApplicable = HomePage.heroBannerAndOffersApplicable();
  let flightTabOffers: string[] = [];

  await test.step('Step 1: Verify hero banner carousel is visible with indicators', async () => {
    if (!heroBannerApplicable) {
      console.log('Skipping hero banner checks for BOB - no hero carousel on this client');
      return;
    }
    await HomePage.verifyHomePageBanner(page);
  });

  await test.step('Step 2: Verify banner slide image auto-rotates over time', async () => {
    if (!heroBannerApplicable) return;
    await HomePage.verifyBannerSlideRotates(page);
  });

  await test.step('Step 3: Verify Previous/Next controls change the active banner slide', async () => {
    if (!heroBannerApplicable) return;
    await HomePage.verifyBannerNavigationControls(page);
  });

  await test.step('Step 4: Verify "Best offer for you" shows multiple non-empty offer cards', async () => {
    if (!heroBannerApplicable) {
      console.log('Skipping "Best offer for you" checks for BOB - section not present on this client');
      return;
    }
    flightTabOffers = await HomePage.verifyBestOfferCardsDisplayed(page);
  });

  await test.step('Step 5: Verify Exclusive Benefits (bank offers) carousel is displayed', async () => {
    await HomePage.verifyBankOffersCarousel(page);
  });

  await test.step('Step 6: Verify switching to Hotels tab swaps the banner and offers to hotel-specific content', async () => {
    if (!heroBannerApplicable) return;
    await HomePage.verifyOffersAndBannerSwapOnHotelsTab(page, flightTabOffers);
  });
});

test('TS_HP_002: Validate FAQ General/Flights/Hotels tabs switch and questions expand/collapse', { tag: ['@idfc', '@bob', '@common', '@homepage', '@smoke', '@sanity'] }, async () => {
  await test.step('Step 1: Verify FAQ section is visible with General, Flights and Hotels tabs', async () => {
    await HomePage.verifyFaqTabsSwitchAndAccordion(page);
  });
});
