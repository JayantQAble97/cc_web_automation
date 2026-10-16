import { test, Page, BrowserContext } from '../../utils/testBase';
import { CommonHelper } from '../../utils/commonHelper';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { LoginPage } from '../../ShopStacc/pages/LoginPage';
import bobTestData from '../testData/shopStacc.json';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await CommonHelper.navigateToHomePage(page);
  

});
test.afterEach(async () => {
  await page.close();
  await context.close();
});


test('SC_001, Login with valid mobile number and OTP', { tag: ['@bobcard', '@login', '@smoke', '@sanity'] }, async () => {

  await test.step('If login button is displayed, then uncomment this', async () => {
    await LoginPage.LoginCredEnterBeforeEach(page);
  });

  await test.step('Step 1: Verify and Enter User ID', async () => {
    await LoginPage.verifyUserIdDisplayed(page);
    await LoginPage.enterUserID(page);
  });

  await test.step('Step 2: Verify and Enter User Password', async () => {
    await LoginPage.verifyUserPasswordDisplayed(page);
    await LoginPage.enterUserPassword(page);
  });

  await test.step('Step 3: Verify and Click Enter Login Button', async () => {
    await LoginPage.verifyEnterLoginButtonDisplayed(page);
    await LoginPage.clickEnterLoginButton(page);
  });
  await test.step('Step 4: Wait until Dialog Box is Displayed', async () => {
    await LoginPage.waitUntilDialogBoxDisplayed(page);
  });
  await test.step('Step 5: Click Skip Button Inside Dialog Box', async () => {
    await LoginPage.clickSkipButtonInsideDialogBox(page);
    await page.waitForLoadState('domcontentloaded');
    await LoginPage.verifyLoginSuccess(page);
  });
}); 