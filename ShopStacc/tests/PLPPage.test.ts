import { test, Page, BrowserContext } from '../../utils/testBase';
import { HomePage } from '../pages/HomePage';
import { PLPPage } from '../pages/PlpPage';
import { BaseHelper } from '../../TripStacc/pages/CommonMethods';
import { CommonHelper } from '../../utils/commonHelper';
import { LoginPage } from '../pages/LoginPage';
let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
  await LoginPage.LoginCredEnterBeforeEach(page);
  await LoginPage.RestrictionPageBeforeEach(page);
  await page.waitForLoadState('domcontentloaded');
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});


test("SC_005,Gift Card PDP - Verify details and actions", { tag: ['@bobcard', '@plp', '@regression', '@sanity'] }, async ({ }) => {

  await test.step("Click Gift Card option", async () => {
    await page.waitForLoadState('domcontentloaded');
    await HomePage.waitForHeader(page);
    await HomePage.clickGiftCardOption(page);
  });

  await test.step("Click Gift Card", async () => {
    await HomePage.clickGiftCard(page);
  });

  await test.step("Verify Gift Card Details", async () => {
    await page.waitForLoadState('domcontentloaded')
    await PLPPage.verifyGiftCardDetailsVisible(page);
  });

  await test.step("Click Quantity Increase", async () => {
    await PLPPage.clickQuantityIncreaseButton(page);
  });

  await test.step("Click Buy Now", async () => {
    await PLPPage.clickBuyNowButton(page);
  });
});