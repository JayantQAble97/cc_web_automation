import { test, Page, BrowserContext } from '../../utils/testBase';
import { FlightBookingPage } from '../pages/FlightBookingPage';
import { PaymentPage } from '../pages/PaymentPage';
import { FlightHomePage } from '../pages/FlightHomePage';
import { HotelBookingPage } from '../pages/HotelBookingPage';
const idfcTestData = require('../testData/tripStacc.json');
import { BaseHelper } from '../pages/CommonMethods';
import { Data } from '../../utils/dataProvider';
import { HotelHomePage } from '../pages/HotelHomePage';
import { FlightPageLocators } from '../locators/FlightPageLocators';
import { BookingConfirmationPage } from '../pages/BookingConfirmationPage';
let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await BaseHelper.launchAndLogin(page);
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});

test('SC_012: Booking Confirmation Page: Flight (Confirmed/Pending/Failed)', { tag: ['@idfc', '@bob', '@common', '@flight', '@testmode', '@bookingconfirmation', '@regression', "@earn"] }, async () => {
  await test.step("Step 1: Enter City From Airport", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  })

  await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  })

  await test.step("Step 3: Enter City To Airport", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  })

  await test.step("Step 4: Verify To Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  })

  await test.step("Step 5: Enter date of departure", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  })

  await test.step("Step 6: Click and verify travellers and cabin class dropdown", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step("Step 7: Click search flights button", async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step("Step 8: Verify first flight card visible", async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step("Step 9: Click on Next Button On Flight Details Page", async () => {
    await FlightHomePage.clickOnNextButtonOnFlightDetailsPage(page);
  });
  await test.step("Step 10: Click on Book Button On Flight Details Page", async () => {
    await FlightHomePage.clickOnBookButtonOnFlightDetailsPage(page);
  });

  await test.step("Step 11: Click on Continue Button On Flight Details Page", async () => {
    await FlightHomePage.clickOnContinueButtonOnFlightDetailsPage(page);
  });
  await test.step("Step 12: Click on First Traveller Edit Button On Traveller Details Page", async () => {
    await FlightHomePage.clickOnFirstNameEditButton(page);
  });
  await test.step("Step 13: Enter First Name of Traveller", async () => {
    await FlightHomePage.EnterRandomFirstName(page);
    await FlightHomePage.selectPassportDetails(page);
  });

  await test.step("Step 14: Enter Last Name of Traveller", async () => {
    await FlightHomePage.EnterLastName(page, Data.travellername.lastName);
    await FlightHomePage.enterMobileNo(page, Data.travellername.mobileNo);
  });

  await test.step("Step 15: Click on Add Traveller Button On Traveller Details Page", async () => {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if (CLIENT === 'BOB') {
      await FlightHomePage.clickOnAddTravellerButton(page);
    } else if (CLIENT === 'IDFC') {
      await FlightHomePage.clickOnEditConfirmButtonPage(page);
    }
  });

  await test.step("Step 16: Click on first Traveller Name On Traveller Details Page", async () => {
    await FlightHomePage.clickOnFirstTravellerName(page);
  });

  await test.step("Step 17: Click on continue button On Traveller Details Page", async () => {
    await FlightHomePage.clickOncontinueButtonOnTravellerPage(page);
  });

  await test.step("Step 18: verify Seat Selection Option Visible", async () => {
    await FlightHomePage.verifySeatSelectionOptionVisible(page);
  });

  await test.step("Step 19: verify Baggage Selection Option Visible", async () => {
    await FlightHomePage.verifyBaggageSelectionOptionVisible(page);
  });
  await test.step("Step 21: Click on baggage Option", async () => {
    await FlightHomePage.clickOnbaggageOption(page);
  });
  await test.step("Step 23: Click on Skip Option", async () => {
    await FlightHomePage.clickOnSkipButton(page);
  });
  await test.step("Step 24: verify traveller and add one ", async () => {
    await FlightHomePage.verifyTravellerAndAddOneHeadingVisible(page);
  });
  await test.step("Step 25: Click on Travellers and Addons Continue Button", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.travellersAndAddonsContinueButton(page);
    await page.waitForTimeout(1000);
  });
  await test.step("Step 29: Complete Card Payment Flow", async () => {
    await page.waitForTimeout(18000);
    await page.waitForLoadState('domcontentloaded');
    await PaymentPage.completeCardPaymentFlow(page);
    await page.waitForTimeout(18000);
    await BookingConfirmationPage.verifyBookingOutcomeFlight(page);
  });
});

test('SC_012.01: Booking Confirmation for Hotel', { tag: ['@idfc', '@bob', '@common', '@testmode', '@payment', '@hotel', '@regression'] }, async () => {
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(5000);
    await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 2: Enter Domestic Hotel Location', async () => {
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 3: Choose First Domestic Hotel Option', async () => {
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 4: Set Check-in and Check-out Dates', async () => {
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(5000);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(5000);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 5: Search for Hotels (Single Room Default)', async () => {
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 6: Search Hotel Name in Search Box', async () => {
    await HotelBookingPage.searchHotelNameInTestBox(page, Data.hotelPage.searcHotelName);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 7: Click the first hotel result', async () => {
    await HotelHomePage.clickFirstResult(page);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 8: Click the First Room Selection Button', async () => {
    await HotelBookingPage.clickFirstRoomSelectionButton(page);
    await page.waitForTimeout(5000);
  });

  await test.step('Step 9: Click Next button on first tab', async () => {
    await HotelBookingPage.firstTabNextButton(page);
    await page.waitForTimeout(5000);
  });
  await test.step('Step 12: Click Add New Guest Button', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.removePopupForIDFC(page);
    await page.waitForTimeout(5000);
    await HotelBookingPage.clickonaddguestbutton(page);
    await page.waitForTimeout(1000);
  });
  await test.step('Step 13: Fill in Guest Details', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.removePopupForIDFC(page);
    await page.waitForTimeout(5000);
    await HotelBookingPage.fillGuestDetailsInsideForm(page);
    await page.waitForTimeout(3000);
    await HotelBookingPage.fillGuestDetailsoutsideFormForBOB(page);
    await page.waitForTimeout(4000);
    await HotelBookingPage.nextButtonAfterAddingGuest(page);
  });
  await test.step("Step 29: Complete Card Payment Flow", async () => {
    await page.waitForTimeout(18000);
    await page.waitForLoadState('domcontentloaded');
    await PaymentPage.completeCardPaymentFlow(page);
    await page.waitForTimeout(18000);
    await BookingConfirmationPage.verifyBookingOutcomeHotel(page);
  });
});
