export const LoginPageLocators = {
  welcomeText: `//h2[@class='pagehding pageheadingnone ']`,
  emailInputField: `//input[@id='txtEmailId']`,
  mobileNumberField: `//input[@id='txtMobileNo']`,
  getOtpButton: `//button[@id='btnLogin']`,
  signInEmailIdText: `(//div[@class='bodytext  labelText'])[1]`,
  registerMobileIdText: `(//div[@class='bodytext  labelText'])[2]`,
  privacyTermsAndConditions: `//div[@class='my-1 ']`,
  otpText: `//div[@class='bodytext ']`,
  otpInputField: `//div[@class='otp-warpper']//input`,
  validateAndLoginButton: `//button[@class='login-button logindown userorlogin ']`,
  usernameField: "input[placeholder='Access Username']",
  passwordField: "input[placeholder='Access Password']",
  verifyButton: "button:has-text('Verify & Continue')",
  restrictionpagetitle: "//h2[text()='Restricted Access']"
};
