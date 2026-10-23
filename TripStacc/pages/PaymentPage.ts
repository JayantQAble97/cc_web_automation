import { expect, Frame, Locator, Page } from '@playwright/test';
import { PaymentPageLocators } from '../../TripStacc/locators/PaymentPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
const idfcTestData = require('../testData/tripStacc.json');
import { DeviceHelper } from '../../utils/deviceHelper';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { Data } from '../../utils/dataProvider';
import { FlightHomePage } from './FlightHomePage';

export class PaymentPage {

  static async clickCheckoutPayButton(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.checkoutPayButton);
  }
 
  static async clickPayButton(page: Page) {
    await VerificationHelpers.elementIsVisible(page, PaymentPageLocators.payButton);
    await ElementHelper.clickElement(page, PaymentPageLocators. payButton);
  }
   static async clickPayButtonBOB(page: Page) {
    await VerificationHelpers.elementIsVisible(page, PaymentPageLocators.paybuttonbob);
    await ElementHelper.clickElement(page, PaymentPageLocators. payButton);
  }
  static async verifyCheckoutPayButton(page: Page) {
    await page.waitForSelector(PaymentPageLocators.checkoutPayButton, { state: 'visible' });
    const payableText = await page.textContent(PaymentPageLocators.checkoutPayButton);
    console.log(`This amount is payable: ${payableText}`);
  }

  // Confirms the checkout/booking page has loaded with the selected flight: route, trip details
  // (cabin class, as captured during search) and a non-zero total amount are all shown.
  static async verifyCheckoutPageLoadedWithSelectedFlight(page: Page) {
    await expect(page).toHaveURL(/\/flight\/booking\//, { timeout: 30000 });

    const body = page.locator('body');
    const fromCode = FlightHomePage.getAirportCode(FlightHomePage.selectedFromCity);
    const toCode = FlightHomePage.getAirportCode(FlightHomePage.selectedToCity);
    if (fromCode && toCode) {
      await expect(body, `Checkout page should show the origin airport ${fromCode}`).toContainText(fromCode, { timeout: 15000 });
      await expect(body, `Checkout page should show the destination airport ${toCode}`).toContainText(toCode, { timeout: 15000 });
      console.log(`Checkout page shows selected route: ${fromCode} -> ${toCode}`);
    } else {
      console.log(`Skipping route check: origin/destination not captured (From: "${FlightHomePage.selectedFromCity}", To: "${FlightHomePage.selectedToCity}")`);
    }

    if (FlightHomePage.selectedTravelClass) {
      await expect(body, `Checkout page should show the selected trip class "${FlightHomePage.selectedTravelClass}"`).toContainText(FlightHomePage.selectedTravelClass, { timeout: 15000 });
    }

    await ElementHelper.waitForElementVisible(page, PaymentPageLocators.checkoutPayButton);
    const amountText = await page.locator(PaymentPageLocators.checkoutPayButton).textContent();
    const amount = Number(amountText?.replace(/[^\d]/g, ''));
    expect(amount, `Checkout page should show a total payable amount greater than 0, got: "${amountText}"`).toBeGreaterThan(0);

    console.log(`Checkout page loaded with selected flight. Route: ${fromCode ?? '?'} -> ${toCode ?? '?'}, Class: ${FlightHomePage.selectedTravelClass}, Total: ₹${amount}`);
  }

  static async clickProceedButton(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.proceedButton);
  }

  static async proceedWithPayment(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.proceedButton);
    console.log('Proceeded with payment.');
  }

  static async clickBackIconButton(page: Page) {
    if(DeviceHelper.isMobile()) {
      await ElementHelper.clickElement(page, PaymentPageLocators.backIconButtonMobile);
    } else {
      await ElementHelper.clickElement(page, PaymentPageLocators.backIconButton);
    }
  }

  static async clickConfirmBackButton(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.confirmBackButton);
  }

  static async verifyCardOptions(page: Page) {
    await page.waitForSelector(PaymentPageLocators.cardOptionSelector, { state: 'visible' });
    const options = await page.$$eval(PaymentPageLocators.cardOptionSelector, els => els.map(el => el.textContent?.trim()));
    console.log('Available card options:', options);
  }

  
static async clickCardOptionSelector(page: Page) {
  const element = page.locator(PaymentPageLocators.cardOptionSelector);
  await element.waitFor({ state: 'visible' });
  await element.click({ force: true });
}

  static async clickDebitCreditCardOption(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.debitcreditcardOption);
  }

  static async enterCardNumber(page: Page, cardNumber: string) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardNumberField, cardNumber);
  }

  static async enterCardExpiry(page: Page, expiry: string) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardExpiryField, expiry);
  }

  static async enterCardCvv(page: Page, cvv: string) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardCvvField, cvv);
  }

  static async enterCardOwnerName(page: Page, name: string) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardownername, name);
  }

  static async fillCardNumber(page: Page) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardNumberField, Data.paymentDataFill.cardNumber);
  }

 
static async fillCardExpiry(page: Page) {
  const value = Data.paymentDataFill.cardExpiry; 
  const locator = page.locator(PaymentPageLocators.cardExpiryField);

  await locator.click();
  await locator.fill(''); // clear field
  await locator.pressSequentially(value, { delay: 100 });
}


  static async fillCardCvv(page: Page) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardCvvField, Data.paymentDataFill.cardCvv);
  }

  static async fillCardName(page: Page) {
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.cardownername, Data.paymentDataFill.cardName);
  }

  static async verifyCardDetailsPageVisible(page: Page) {
    await expect(page.locator(PaymentPageLocators.cardNumberField)).toBeVisible();
    console.log('Card details page is visible.');
  }

 static async verifyCardFieldsVisible(page: Page) {
  const cardNumber = page.locator(PaymentPageLocators.cardNumberField);
  const expiry = page.locator(PaymentPageLocators.cardExpiryField);
  const cvv = page.locator(PaymentPageLocators.cardCvvField);
  const name = page.locator(PaymentPageLocators.cardownername);

  // wait first
  await cardNumber.waitFor({ state: 'visible', timeout: 10000 });
  await expiry.waitFor({ state: 'visible', timeout: 10000 });
  await cvv.waitFor({ state: 'visible', timeout: 10000 });
  await name.waitFor({ state: 'visible', timeout: 10000 });

  // then assert
  await expect(cardNumber).toBeVisible();
  await expect(expiry).toBeVisible();
  await expect(cvv).toBeVisible();
  await expect(name).toBeVisible();

  console.log('Card fields are visible.');
}
  static async acceptSaveCardConsent(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.saveCardPopup);
  }

  static async verifySaveCardPopup(page: Page) {
    await page.waitForSelector(PaymentPageLocators.saveCardPopup, { state: 'visible' });
    console.log('Save card popup is visible.');
  }

  static async verifySaveCardPopupVisible(page: Page) {
    await expect(page.locator(PaymentPageLocators.saveCardPopup)).toBeVisible();
    console.log('Save card popup is visible.');
  }

  static async clickWithoutSavingCardOption(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.withoutSavingCardOption);
  }

  static async selectWithoutSavingCard(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.withoutSavingCardOption);
  }

  static async clickCloseWithoutSaveButton(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.closeWithoutSaveButton);
  }
  static async clickCancelPaymentSubmit(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.cancelButton);
  }

  static async clickCancelPaymentDismiss(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.nocancelbutton);
  }
  
  
  static async clickContinueButton(page: Page) {
    await page.waitForTimeout(5000);
    await VerificationHelpers.elementIsVisible(page, PaymentPageLocators.continuebtnbeforepayment);
    await ElementHelper.clickElement(page, PaymentPageLocators.continuebtnbeforepayment);
  }

  static async verifyOtpPageVisibleandFillValue(page: Page) {
    await expect(page.locator(PaymentPageLocators.otpInputField)).toBeVisible();
    console.log('OTP page is visible.');
    await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.otpInputField, Data.paymentDataFill.otp)
  }
  static async clickSubmitButton(page: Page) {
    await ElementHelper.clickElement(page, PaymentPageLocators.submitButton);
  }
  

  static async verifyOtpErrorMessage(page: Page) {
    await expect(page.locator(PaymentPageLocators.otpErrorMessage)).toBeVisible();
    console.log('OTP error message is visible for expired/invalid OTP.');
  }

static async verifyBookingConfirmationPageVisible(page: Page): Promise<boolean> {
  let isVisible: boolean;

  if (process.env.CLIENT?.toUpperCase() === 'BOB') {
    isVisible = await ElementHelper.isElementDisplayed(
      page,
      PaymentPageLocators.bookingconfirmationpagebob
    );

    if (!isVisible) {
      isVisible = await ElementHelper.isElementDisplayed(
        page,
        `//span[@class='label label-success sts_confirm vouchr_sts']`
      );
    }
  } else {
    isVisible = await ElementHelper.isElementDisplayed(
      page,
      PaymentPageLocators.bookingConfirmationPage
    );
  }

  if (isVisible) {
    console.log('Booking confirmation page is visible.');
  }

  return isVisible;
}

  static async verifyBookingNotCreated(page: Page) {
    const bookingExists = await page.isVisible(PaymentPageLocators.bookingConfirmationPage);
    expect(bookingExists).toBeFalsy();
    console.log('Booking not created after cancellation.');
  }

  static async clickOnPromoCodeAndEnterCode(page: any, data:any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clickElement(page, PaymentPageLocators.promoCodeInput);
      await ElementHelper.clearAndEnterInTextField(page, PaymentPageLocators.promoCodeInput, data)
      await page.waitForTimeout(3000); 
    break;
    case 'IDFC':  
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async clickOnApplyPromoCode(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clickElement(page, PaymentPageLocators.promoCodeApplyButton);
      await page.waitForTimeout(3000); 
    break;
    case 'IDFC':  
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async verifyErrorMessageVisible(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await VerificationHelpers.elementIsVisible(page, PaymentPageLocators.invalidMessage);
      await page.waitForTimeout(3000);
    break;
    case 'IDFC':  
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async clickBankVerifyContinue(page: Page) {
 
    if (process.env.CLIENT?.toUpperCase() !== 'BOB') return;
 
 
 
    const deadline = Date.now() + 30_000;
 
    while (Date.now() < deadline) {
 
      for (const frame of page.frames()) {
 
        const matches = await frame
 
          .locator(PaymentPageLocators.razorpayBankVerifyContinue)
 
          .all()
 
          .catch(() => []);
 
        for (const btn of matches) {
 
          const visible = await btn.isVisible().catch(() => false);
 
          if (!visible) continue;
 
          console.log(`Bank verification "Continue" found in frame: ${frame.url()}`);
 
          await btn.click();
 
          return;
 
        }
 
      }
 
      await page.waitForTimeout(500);
 
    }
 
    console.log('No bank verification "Continue" surfaced within 30s; continuing.');
 
  }

  static async completePaymentFlowBOB(page: Page) {
    await page.waitForTimeout(3000);

if (await page.locator(PaymentPageLocators.termsAndConditionsCheckbox).count()) {
  await page.locator(PaymentPageLocators.termsAndConditionsCheckbox).click();
} else {
  await page.locator(PaymentPageLocators.alternateTermsCheckbox).click();
}
console.log('Clicking Pay Now button...');
    await ElementHelper.clickElement(page, PaymentPageLocators.payNowButtonBob);
    await page.waitForTimeout(10000);

    if (await page.locator(PaymentPageLocators.makePaymentButton).count()) {
      await page.locator(PaymentPageLocators.makePaymentButton).click();
      console.log('Terms & Conditions checkbox found. Clicking...');
    } else {
      await page.locator(PaymentPageLocators.paymentContinueButton).click();
    }

    await page.waitForTimeout(10000);

    const confirmationContinueBtn = page.locator(PaymentPageLocators.confirmationContinueButton);

    if (await confirmationContinueBtn.isVisible()) {
      await page.waitForTimeout(5000)
      await confirmationContinueBtn.click();
    } else {
      console.log("Confirmation Continue button is not visible. Proceeding to Razorpay.");
    }
      console.log('Razorpay iframe loaded. Starting card payment flow...');

    const razorpayFrame = page.frameLocator(
      PaymentPageLocators.razorpayCheckoutFrame
    );
    await page.waitForTimeout(6000);
    await razorpayFrame.locator('[data-testid="contactNumber"]').fill('__CONFIGURE_TEST_IDENTIFIER__');
    await razorpayFrame.locator(PaymentPageLocators.continuebtnformobile).click();
    await razorpayFrame.locator(PaymentPageLocators.payviacard).click();
    await page.waitForTimeout(6000)
    await razorpayFrame.locator(PaymentPageLocators.cardNumberField).waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(6000)
    await razorpayFrame.locator(PaymentPageLocators.cardNumberField).fill(Data.paymentDataFill.cardNumber);
    await page.waitForTimeout(6000);
    await razorpayFrame.locator(PaymentPageLocators.cardExpiryField).fill(Data.paymentDataFill.cardExpiry);
    await page.waitForTimeout(6000);
    await razorpayFrame.locator(PaymentPageLocators.cardCvvField).fill(Data.paymentDataFill.cardCvv);
    await page.waitForTimeout(6000);
    await expect(razorpayFrame.locator(PaymentPageLocators.saveCardPopup)).toBeVisible();
    await page.waitForTimeout(6000);
    if (
      await razorpayFrame
        .locator(PaymentPageLocators.continuebtnformobilebob)
        .isVisible()
    ) {
      await razorpayFrame
        .locator(PaymentPageLocators.continuebtnformobilebob)
        .click();
    } else {
      await razorpayFrame
        .locator(PaymentPageLocators.continuebtnformobile)
        .click();
    }
     console.log('Completed payment flow necessary cards details updated');
    await page.waitForTimeout(6000);
    await page.waitForLoadState('domcontentloaded');
    await PaymentPage.clickMaybeLaterButton(page);
    await page.waitForTimeout(6000);
    if (DeviceHelper.isMobile()) {
      await PaymentPage.clickBankVerifyContinue(page);
      await page.waitForTimeout(6000);
    }
try {
  const razorpayFrame = page.frameLocator('iframe.razorpay-checkout-frame');

  const otpInput = razorpayFrame.locator('input[name="otp"]');

  if (await otpInput.isVisible()) {
    await otpInput.fill('1234');

    const continueButton = razorpayFrame.locator(
      '(//button[contains(text(),"Continue")])[2]'
    );

    if (await continueButton.isVisible()) {
      await continueButton.click({ force: true });
    }
  }
} catch {
  console.log('Razorpay OTP screen not found. Skipping.');
}
//await PaymentPage.clickSuccessButton(page);

    await page.waitForTimeout(7000);
    await PaymentPage.clickOKButton(page);
  }

  static async clickMaybeLaterButton(page: Page) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    switch (CLIENT) {
      case 'BOB':
        const frame = page.frameLocator('iframe[src*="api.razorpay.com/v1/checkout"]');
        await frame.locator(PaymentPageLocators.maybeLaterButton).click()
        break;
      case 'IDFC':
        await ElementHelper.clickElement(page, PaymentPageLocators.proceedButton);
        break;
    }
  }

static async clickSuccessButton(page: Page) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'BOB': {
      const context = page.context();
      const timeoutMs = 90_000;
      const pollMs = 500;
      const deadline = Date.now() + timeoutMs;

      const successNameRegex = /^\s*success\s*$/i;

      const scopeCandidates = (scope: Page | Frame): Locator[] => [
        scope.getByRole('button', { name: successNameRegex }).first(),
        scope.locator('input[type="submit"], input[type="button"]')
             .and(scope.locator('[value="Success" i], [value="SUCCESS"]')).first(),
        scope.locator('//button[normalize-space(.)="Success" or normalize-space(.)="SUCCESS"]').first(),
        scope.locator(PaymentPageLocators.successButton).first(),
      ];

      const findVisibleSuccessButton = async (): Promise<Locator> => {
        let seenFrames: string[] = [];
        while (Date.now() < deadline) {
          for (const p of context.pages().filter(pg => !pg.isClosed())) {
            const scopes: Array<Page | Frame> = [p, ...p.frames()];
            seenFrames = scopes.map(s => ('url' in s ? s.url() : ''));
            for (const scope of scopes) {
              for (const candidate of scopeCandidates(scope)) {
                const visible = await candidate.isVisible().catch(() => false);
                if (visible) return candidate;
              }
            }
          }
          await page.waitForTimeout(pollMs);
        }
        throw new Error(
          `Success button not visible on any page or frame within ${timeoutMs}ms. ` +
          `Frames inspected on last pass: ${JSON.stringify(seenFrames)}`,
        );
      };

      const successBtn = await findVisibleSuccessButton();
      await successBtn.click();
      break;
    }
  case 'IDFC':
    await ElementHelper.clickElement(page, PaymentPageLocators.proceedButton);
    break;
  }
  }

static async clickOKButton(page: Page) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'BOB':
  await page.waitForLoadState('domcontentloaded');

  try {
    const okButton = page.locator(PaymentPageLocators.okButton);

    if (await okButton.count() > 0) {
      await okButton.click();
    }
  } catch (error) {
    console.log('OK button not found. Continuing test...');
  }

  break;

    case 'IDFC':
      await ElementHelper.clickElement(page, PaymentPageLocators.proceedButton);
      break;
  }
}

 static async verifyBookingPendingPageVisible(page: Page) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  let isVisible = false;

  switch (CLIENT) {
    case 'BOB':
      isVisible = await ElementHelper.isElementDisplayed(
        page,
        PaymentPageLocators.bookingpendingPagebob
      );
      break;

    case 'IDFC':
      isVisible = await ElementHelper.isElementDisplayed(
        page,
        PaymentPageLocators.bookingPendingPage
      );
      break;
  }

  if (isVisible) {
    console.log('Booking pending page is visible.');
  }

  return isVisible;
}

 
  static async completeCardPaymentFlowIDFC(page: Page) {
    await page.waitForTimeout(2000);
    await this.clickPayButton(page);
    await page.waitForLoadState('domcontentloaded');
    await PaymentPage.clickCardOptionSelector(page);
    await page.waitForTimeout(2000);
    await PaymentPage.verifyCardFieldsVisible(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardNumber(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardExpiry(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardCvv(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardName(page);
    await page.waitForTimeout(2000);
    await PaymentPage.verifySaveCardPopupVisible(page);
    await page.waitForTimeout(2000);
    await PaymentPage.clickProceedButton(page);
    await page.waitForTimeout(7000);
    await PaymentPage.clickCloseWithoutSaveButton(page);
    await page.waitForTimeout(10000);
    await page.waitForLoadState('domcontentloaded')
    await PaymentPage.verifyOtpPageVisibleandFillValue(page);
    await page.waitForTimeout(6000);
    await PaymentPage.clickSubmitButton(page);
    await page.waitForTimeout(12000);
    await page.waitForLoadState('domcontentloaded');
  }
 static async completeCardPaymentFlowBOB(page: Page) {
    if (await page.locator(PaymentPageLocators.termsAndConditionsCheckbox).isVisible()) {
      await page.locator(PaymentPageLocators.termsAndConditionsCheckbox).click();
    } else {
      await page.locator(PaymentPageLocators.alternateTermsCheckbox).click();
    }
  await page.waitForTimeout(12000);
    await ElementHelper.clickElement(page, PaymentPageLocators.payNowButtonBob);

    await page.waitForTimeout(10000);
     if (await page.locator(PaymentPageLocators.makePaymentButton).count()) {
      await page.locator(PaymentPageLocators.makePaymentButton).click();
    } else {
      await page.locator(PaymentPageLocators.paymentContinueButton).click();
    }
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000);

    await PaymentPage.clickCardOptionSelector(page);
    await page.waitForTimeout(2000);
    await PaymentPage.verifyCardFieldsVisible(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardNumber(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardExpiry(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardCvv(page);
    await page.waitForTimeout(2000);
    await PaymentPage.fillCardName(page);
    await page.waitForTimeout(2000);
    await PaymentPage.verifySaveCardPopupVisible(page);
    await page.waitForTimeout(2000);
    await PaymentPage.clickProceedButton(page);
    await page.waitForTimeout(7000);
    await PaymentPage.clickCloseWithoutSaveButton(page);
    await page.waitForTimeout(10000);
    await page.waitForLoadState('domcontentloaded')
    await PaymentPage.verifyOtpPageVisibleandFillValue(page);
    await page.waitForTimeout(6000);
    await PaymentPage.clickSubmitButton(page);
    await page.waitForTimeout(12000);
    await page.waitForLoadState('domcontentloaded');
    await PaymentPage.clickOKButton(page);
  }
static async completeCardPaymentFlow(page: Page, bank?: string) {
  const CLIENT = bank?.toUpperCase() || process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'BOB':
      await this.completePaymentFlowBOB(page);
      break;

    case 'IDFC':
      await this.completeCardPaymentFlowIDFC(page);
      break;

    default:
      break;
  }
}
}
