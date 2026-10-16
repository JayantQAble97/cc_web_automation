import { expect, Page } from '@playwright/test';
import { LoginPageLocators } from '../locators/LoginPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import bobTestData from '../testData/shopStacc.json';
import { Data } from '../../utils/dataProvider';

export class LoginPage {

  static async verifyMobileNumberFieldDisplayed(page: Page) {
    const verifyMobNo = LoginPageLocators.mobileNumberField;
    await ElementHelper.isElementDisplayed(page, verifyMobNo);
  }
  static async enterMobileNumber(page: Page, mobileNumber: string) {
    const enterMobNo = LoginPageLocators.mobileNumberField;
    await ElementHelper.clearAndEnterInTextField(page, enterMobNo, mobileNumber);
  }
  static async clickGetOtpButton(page: Page) {
    await ElementHelper.clickElement(page, LoginPageLocators.getOtpButton);
  }
  static async verifyOtpPageVisible(page: Page) {
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.otpText);
  }
  static async enterOtp(page: Page, otp: string) {
    const otpInputs = page.locator(
      LoginPageLocators.otpInputField
    );
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
  }
  static async verifyLoginButtonDisplayed(page: Page) {
    const loginButton = LoginPageLocators.validateAndLoginButton;
    await ElementHelper.isElementDisplayed(page, loginButton);
  }
  static async clickLoginButton(page: Page) {
    const clickLoginButton = LoginPageLocators.validateAndLoginButton;
    await ElementHelper.clickElement(page, clickLoginButton);
  }
  static async waitUntilDialogBoxDisplayed(page: Page) {
    const dashboardLocator = LoginPageLocators.DialogBox;
    await ElementHelper.waitForElementVisibleWithoutReload(page, dashboardLocator);
    console.log('Dilog Box page is displayed');
  }
  static async clickSkipButtonInsideDialogBox(page: Page) {
    const skipButton = LoginPageLocators.skipButtonInsideDialogBox;
    await ElementHelper.clickElement(page, skipButton);
    console.log('Skip button inside dialog box clicked');
  }
  static async verifyUserIdDisplayed(page: Page) {
    const userID = LoginPageLocators.enterUserID;
    await ElementHelper.isElementDisplayed(page, userID);
    console.log('User ID field displayed');
  }
  static async enterUserID(page: Page) {
    const UserIDEnter = LoginPageLocators.enterUserID;
    await ElementHelper.clearAndEnterInTextField(page, UserIDEnter, Data.loginDataFill.userId);
    console.log('User ID entered');
  }
  static async verifyUserPasswordDisplayed(page: Page) {
    const userPassword = LoginPageLocators.enterUserPass;
    await ElementHelper.isElementDisplayed(page, userPassword);
    console.log('User Password field displayed');
  }
  static async enterUserPassword(page: Page) {
    const userPasswordField = LoginPageLocators.enterUserPass;
    await ElementHelper.clearAndEnterInTextField(page, userPasswordField, Data.loginDataFill.userPassword);
    console.log('User Password entered');
  }
  static async verifyEnterLoginButtonDisplayed(page: Page) {
    const enterLoginButton = LoginPageLocators.enterLoginBTN;
    await ElementHelper.isElementDisplayed(page, enterLoginButton);
    console.log('Enter Login button displayed');
  }
  static async clickEnterLoginButton(page: Page) {
    const enterLoginButton = LoginPageLocators.enterLoginBTN;
    await ElementHelper.clickElement(page, enterLoginButton);
    console.log('Enter Login button clicked');
  }
  static async LoginCredEnterBeforeEach(page: Page) {
    await LoginPage.enterMobileNumber(page, Data.loginDataFill.mobileNumber);
    await LoginPage.clickGetOtpButton(page);
    await LoginPage.verifyOtpPageVisible(page);
    await LoginPage.enterOtp(page, Data.loginDataFill.otp);
    await LoginPage.clickLoginButton(page);
  }
  static async RestrictionPageBeforeEach(page: Page) {
  const agreeCheckbox = page.locator(LoginPageLocators.Agree_checkbox);
  const proceedButton = page.locator(LoginPageLocators.proceedButton);
  if (
    await agreeCheckbox.isVisible().catch(() => false) &&
    await proceedButton.isVisible().catch(() => false)
  ) {
    console.log('Popup opened');

    await agreeCheckbox.check();
    console.log('Clicked Agree checkbox');
    await page.waitForTimeout(1000); // Wait for 1 second before clicking the proceed button
    await proceedButton.click();
    console.log('Clicked Proceed button');
  } else {
    console.log('ℹ️ Popup not displayed. Skipping...');
  }

  await LoginPage.enterUserID(page);
  await LoginPage.enterUserPassword(page);
  await LoginPage.clickEnterLoginButton(page);
  await LoginPage.waitUntilDialogBoxDisplayed(page);
  await LoginPage.clickSkipButtonInsideDialogBox(page);
  }
  static async verifyLoginSuccess(page: Page) {
    await expect(page).toHaveURL(/shopstacc\.com/);
    console.log('Login successful and navigated to homepage');
  }

  static async verifyGetOtpButtonDisplayed(page: Page) {
    await ElementHelper.isElementDisplayed(page, LoginPageLocators.getOtpButton);
    console.log('Get OTP button displayed');
  }

  static async verifyOtpInputFieldsDisplayed(page: Page) {
    await ElementHelper.isElementDisplayed(page, LoginPageLocators.otpInputField);
    console.log('OTP input fields displayed');
  }





}

