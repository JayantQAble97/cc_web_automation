import { expect, Page } from '@playwright/test';
import { ElementHelper } from '../../utils/elementHelper';
import { FlightPageLocators } from '../../TripStacc/locators/FlightPageLocators';
import { PaymentPage } from './PaymentPage';
const idfcTestData = require('../testData/tripStacc.json');


export class FlightBookingPage {

  static async verifyBookingConfirmationPageVisible(page: Page) {
    const bookingStatus = FlightPageLocators.bookingStatus;
  
    await ElementHelper.waitForElementVisible(page, bookingStatus);
    console.log("Booking confirmation page is visible.");
  }

  static async verifyBookingPendingPageVisible(page: Page) {
    const bookingStatus = FlightPageLocators.bookingStatus;
  
    await ElementHelper.waitForElementVisible(page, bookingStatus);
    console.log("Booking confirmation page is visible.");
  }
  
  static async verifyConfirmedVoucherVisible(page: Page) {
    const confirmedVoucher = FlightPageLocators.confirmedVoucher;
  
    await ElementHelper.waitForElementVisible(page, confirmedVoucher);
    console.log("Confirmed voucher is visible.");
  }
  
  static async verifyBookingIdVisible(page: Page) {
    const bookingId = FlightPageLocators.bookingId;
  
    await ElementHelper.waitForElementVisible(page, bookingId);
    console.log("Booking ID is visible.");
  }
  
  static async verifyBookingDateVisible(page: Page) {
    const bookingDate = FlightPageLocators.bookingDate;
  
    await ElementHelper.waitForElementVisible(page, bookingDate);
    console.log("Booking date is visible.");
  }
  
  static async verifyFlightDetailsVisible(page: Page) {
    const flightDropdown = FlightPageLocators.flightDropdown;
    const flightName = FlightPageLocators.flightName;
    const departureCity = FlightPageLocators.departureCity;
    const arrivalCity = FlightPageLocators.arrivalCity;
    const departureTime = FlightPageLocators.departureTime;
    const arrivalTime = FlightPageLocators.arrivalTime;
  
    await ElementHelper.clickElement(page, flightDropdown);
  
    await ElementHelper.waitForElementVisible(page, flightName);
    await ElementHelper.waitForElementVisible(page, departureCity);
    await ElementHelper.waitForElementVisible(page, arrivalCity);
    await ElementHelper.waitForElementVisible(page, departureTime);
    await ElementHelper.waitForElementVisible(page, arrivalTime);
  
    console.log("Flight details are visible.");
  }
  
  static async verifyHotelDetailsVisible(page: Page) {
    const hotelName = FlightPageLocators.hotelName;
    const hotelAddress = FlightPageLocators.hotelAddress;
  
    await ElementHelper.waitForElementVisible(page, hotelName);
    await ElementHelper.waitForElementVisible(page, hotelAddress);
  
    console.log("Hotel details are visible.");
  }
  
 static async verifyFareSummaryVisible(page: Page) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
  case 'BOB':
    const BOBfareSummarySection = FlightPageLocators.fareSummarySection;
    await ElementHelper.waitForElementVisible(page, BOBfareSummarySection);
    console.log("Fare summary section is visible.");
    break;
  case 'IDFC':
    const fareSummaryDropdown = FlightPageLocators.fareSummaryDropdown;
    const fareSummarySection = FlightPageLocators.fareSummarySection;
 
    await ElementHelper.clickElement(page, fareSummaryDropdown);
    await ElementHelper.waitForElementVisible(page, fareSummarySection);
 
    console.log("Fare summary section is visible.");
    break;
  }
  }
  
    static async verifyTopHotelsSectionVisible(page: Page) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
  case 'BOB':
    console.log("skip");
    break;
  case 'IDFC':
    const topHotelsSection = FlightPageLocators.topHotelsSection;
 
    await ElementHelper.waitForElementVisible(page, topHotelsSection);
    console.log("Top Hotels section is visible.");
    break;
  }
  }
  static async verifyTopHotelCardsVisible(page: Page) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
  case 'BOB':
    console.log("skip");
    break;
  case 'IDFC':
    const topHotelCards = FlightPageLocators.topHotelCards;
 
    await ElementHelper.waitForElementVisible(page, topHotelCards);
    console.log("Top Hotel cards are visible.");
    break;
  }
  }
static async verifyHotelRedirectLinkVisible(page: Page) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
  case 'BOB':
    console.log("skip");
    break;
  case 'IDFC':
    const hotelRedirectLink = FlightPageLocators.hotelRedirectLink;
 
    await ElementHelper.waitForElementVisible(page, hotelRedirectLink);
    console.log("Hotel redirection link is visible.");
    break;
  }
  }
  static async expandFlightDetails(page: Page) {
    const flightDropdown = FlightPageLocators.flightDropdown;
  
    await ElementHelper.clickElement(page, flightDropdown);
    console.log("Flight details dropdown expanded.");
  }
  
  static async expandFareSummary(page: Page) {
    const fareSummaryDropdown = FlightPageLocators.fareSummaryDropdown;
  
    await ElementHelper.clickElement(page, fareSummaryDropdown);
    console.log("Fare summary dropdown expanded.");
  
  }
}

