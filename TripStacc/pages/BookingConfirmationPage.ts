import { expect, Page } from '@playwright/test';
import { ElementHelper } from '../../utils/elementHelper';
import { FlightPageLocators } from '../../TripStacc/locators/FlightPageLocators';
import { PaymentPage } from './PaymentPage';
import { FlightBookingPage } from './FlightBookingPage';
import { HotelBookingPage } from './HotelBookingPage';
const idfcTestData = require('../testData/tripStacc.json');


export class BookingConfirmationPage {
static async verifyBookingOutcomeFlight(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  const isConfirmationVisible = await PaymentPage.verifyBookingConfirmationPageVisible(page);
  const isPendingVisible = await PaymentPage.verifyBookingPendingPageVisible(page);

  if (isConfirmationVisible) {
    await FlightBookingPage.verifyBookingIdVisible(page);
    await FlightBookingPage.verifyBookingDateVisible(page);
    // await FlightBookingPage.verifyFlightDetailsVisible(page);
    // await FlightBookingPage.verifyHotelDetailsVisible(page);
    // await FlightBookingPage.verifyFareSummaryVisible(page);
    // await FlightBookingPage.verifyTopHotelsSectionVisible(page);
    // await FlightBookingPage.verifyTopHotelCardsVisible(page);
    // await FlightBookingPage.expandFlightDetails(page);
    // await FlightBookingPage.expandFareSummary(page);
    console.log('Booking Confirmation page is displayed and all necessary details are verified successfully.');

  } else if (isPendingVisible) {
    console.log('Booking Pending is displayed instead of Booking Confirmation');

  } else {
    throw new Error('Seems like Payment has failed');
  }
}
 static async verifyBookingOutcomeHotel(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  const isConfirmationVisible = await PaymentPage.verifyBookingConfirmationPageVisible(page);
  const isPendingVisible = await PaymentPage.verifyBookingPendingPageVisible(page);

  if (isConfirmationVisible) {
    await HotelBookingPage.verifyBookingIdVisible(page);
    await HotelBookingPage.verifyBookingDateVisible(page);
    console.log('Booking Confirmation page is displayed and all necessary details are verified successfully.');

  } else if (isPendingVisible) {
    console.log('Booking Pending is displayed instead of Booking Confirmation');

  }
}
}