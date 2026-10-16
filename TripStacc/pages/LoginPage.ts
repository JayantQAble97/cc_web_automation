import { expect, Page } from '@playwright/test';
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import idfcTestData from '../testData/tripStacc.json';
import { Data } from '../../utils/dataProvider';


export class LoginPage {

  static async enterMobileNumber(page: Page, mobileNumber: string): Promise<void> {
    await page.locator(LoginPageLocators.mobileNumberField).fill(mobileNumber);
  }

  static async clickGetOtpButton(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, LoginPageLocators.getOtpButton);
  }

  static async verifyMobileNumberFieldAcceptsInput(page: Page): Promise<void> {
     const mobileNumber = Data.loginDataFill.mobileNumber;
    
const mobileField = page.locator(LoginPageLocators.mobileNumberField);

  await mobileField.fill(mobileNumber);
  await expect(mobileField).toHaveValue(mobileNumber);

  console.log(`Mobile: ${mobileNumber}`);

  }
  static async verifyOtpPageVisible(page: Page): Promise<void> {
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.otpText);
  }

  static async enterOtp(page: Page, otp: string): Promise<void> {
    const otpInputs = page.locator(
      LoginPageLocators.otpInputField
    );
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
  }
static async verifyOtpFieldAcceptsInput(page: Page): Promise<void> {
  
  const otp = Data.loginDataFill.otp;

  const otpInputs = page.locator(LoginPageLocators.otpInputField);

  for (let i = 0; i < otp.length; i++) {
    await otpInputs.nth(i).fill(otp[i]);
    await expect(otpInputs.nth(i)).toHaveValue(otp[i]);
  }

  console.log(`OTP fields accepted input: ${otp}`);
}

  static async clickLoginButton(page: Page): Promise<void> {
    await page.locator(LoginPageLocators.validateAndLoginButton).click();
  }

  static async verifyLoginButtonWorks(page: Page): Promise<void> {
    const loginButton = page.locator(LoginPageLocators.validateAndLoginButton);

  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();

    await loginButton.click();
    console.log(" Login button clicked and credentials submitted");
  }

  static async loginWithValidCredentials(page: Page): Promise<void> {
    await this.enterMobileNumber(page, Data.loginDataFill.mobileNumber);
    await this.clickGetOtpButton(page);
    await this.verifyOtpPageVisible(page);
    await this.enterOtp(page, Data.loginDataFill.otp);
    await this.clickLoginButton(page);
  }

  static async verifyAllLoginPageElements(page: Page): Promise<void> {
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.welcomeText);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.emailInputField);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.mobileNumberField);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.getOtpButton);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.signInEmailIdText);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.registerMobileIdText);
    await ElementHelper.waitForElementVisible(page, LoginPageLocators.privacyTermsAndConditions);
  }
   static async enterUserID(page: Page) {
    const UserIDEnter = LoginPageLocators.usernameField;
    await ElementHelper.clearAndEnterInTextField(page, UserIDEnter, Data.loginDataFill.userId);
    console.log('User ID entered');
  }

 static async enterUserPassword(page: Page) {
    const userPasswordField = LoginPageLocators.passwordField;
    await ElementHelper.clearAndEnterInTextField(page, userPasswordField, Data.loginDataFill.userPassword);
    console.log('User Password entered');
  }

 static async clickEnterLoginButton(page: Page) {
    const enterLoginButton = LoginPageLocators.verifyButton;
    await ElementHelper.clickElement(page, enterLoginButton);
    console.log('Enter Login button clicked');
  }
static async RestrictionPageBeforeEach(page: Page) {
  if (await page.locator(LoginPageLocators.restrictionpagetitle).isVisible()) {
    console.log('Restriction page visible - performing login action');

    await this.enterUserID(page);
    await this.enterUserPassword(page);
    await this.clickEnterLoginButton(page);
  } else {
    console.log('Restriction page not visible - skipping login action');
  }
}
}
