import { test, Page, BrowserContext } from '../../utils/testBase';
import { CommonHelper } from '../../utils/commonHelper';
import { HotelHomePage } from '../pages/HotelHomePage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/Homepage';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
  await LoginPage.RestrictionPageBeforeEach(page);
});
test.afterEach(async () => {
  await page.close();
  await context.close();
});

test('SC_001: Verify user can Login with mobile number and OTP', { tag: ['@common', '@loginpage', '@smoke', '@sanity'] }, async () => {
  await test.step('Step 1: Enter valid mobile number', async () => {
    await LoginPage.verifyMobileNumberFieldAcceptsInput(page);
  });

  await test.step('Step 2: Click Get OTP Button', async () => {
    await LoginPage.clickGetOtpButton(page);
    await LoginPage.verifyOtpPageVisible(page);
  });

  await test.step('Step 3: Enter valid OTP and verify OTP field accepts input', async () => {
    await LoginPage.verifyOtpFieldAcceptsInput(page);
  });

  await test.step('Step 4: Click Login button and verify login action', async () => {
    await LoginPage.verifyLoginButtonWorks(page);
  });

  await test.step('Step 5: Verify Hotel Home Page is loaded', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.verifyHotelHomePageLoaded(page);
  });

  await test.step('Step 6: Verify Home Page loads with header, search widget, banners and footer', async () => {
    await HomePage.verifyHomePageLoadedAfterLogin(page);
  });

  await test.step('Step 7: Verify header - logo, Flights/Hotels tabs and profile icon', async () => {
    await HomePage.verifyHomePageHeader(page);
  });

  await test.step('Step 8: Verify banner carousel with previous/next controls', async () => {
    await HomePage.verifyHomePageBanner(page);
  });

  await test.step('Step 9: Verify search widget fields and search button', async () => {
    await HomePage.verifyHomePageSearchWidget(page);
  });

  await test.step('Step 10: Verify My Trips, offers, benefits, FAQ and Need help sections', async () => {
    await HomePage.verifyHomePageContentSections(page);
  });

  await test.step('Step 11: Verify footer links and copyright', async () => {
    await HomePage.verifyHomePageFooter(page);
  });
});

test('SC_002: Home page with multiple card and without multiple cards selection', { tag: ['@bob', '@loginpage','@smoke'] }, async ({ }) => {
const CLIENT = process.env.CLIENT?.toUpperCase();
test.skip(CLIENT === 'IDFC', 'Skipping this test for IDFC');

  await test.step('Step 1: Enter valid mobile number', async () => {
    await LoginPage.verifyMobileNumberFieldAcceptsInput(page);
  });

  await test.step('Step 2: Click Get OTP and verify OTP screen', async () => {
    await LoginPage.clickGetOtpButton(page);
    await LoginPage.verifyOtpPageVisible(page);
  });

  await test.step('Step 3: Enter valid OTP', async () => {
    await LoginPage.verifyOtpFieldAcceptsInput(page);
  });

  await test.step('Step 4: Click Login button', async () => {
    await LoginPage.verifyLoginButtonWorks(page);
  });

  await test.step('Step 5: Handle post-login flow (IDFC / BOB)', async () => {
    await page.waitForLoadState('domcontentloaded')
    await HomePage.handlePostLoginFlow(page);
  });
});