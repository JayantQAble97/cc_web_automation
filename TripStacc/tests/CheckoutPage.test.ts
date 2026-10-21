import { test, Page, BrowserContext } from '../../utils/testBase';
import { HotelHomePage } from '../pages/HotelHomePage';
import { HotelBookingPage } from '../pages/HotelBookingPage';
import { PaymentPage } from '../pages/PaymentPage';
const idfcTestData = require('../testData/tripStacc.json');
import { BaseHelper } from '../pages/CommonMethods';
import { Data } from '../../utils/dataProvider';
import { FlightHomePage } from '../pages/FlightHomePage';
import { FlightBookingPage } from '../pages/FlightBookingPage';
import { DeviceHelper } from '../../utils/deviceHelper';
import { ElementHelper } from '../../utils/elementHelper';
import { HotelPageLocators } from '../locators/HotelPageLocators';
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

test('SC_010: Flight - Checkout with and without Promo Codes', { tag: ['@idfc', '@bob', '@baggage', '@common', '@flaky', '@checkout', '@regression', '@Sanity'] }, async () => {
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
  });

  await test.step("Step 14: Enter Last Name of Traveller", async () => {
    await FlightHomePage.EnterLastName(page, Data.travellername.lastName);
    await FlightHomePage.enterMobileNo(page, Data.travellername.mobileNo);
    await FlightHomePage.selectPassportDetails(page);
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
  await test.step("Step 20: verify Selecting available seat increase price", async () => {
    await FlightHomePage.verifyPriceIncreasesAfterSeatSelection(page);
  });
  await test.step("Step 21: Click on baggage Option", async () => {
    await FlightHomePage.clickOnbaggageOption(page);
  });
  await test.step("Step 22: verify increase the weight increase the price", async () => {
    await FlightHomePage.verifyPriceIncreasesAfterWeeightIncrease(page);
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
  await test.step("Step 26: click On Promo Code And Enter Code", async () => {
    await PaymentPage.clickOnPromoCodeAndEnterCode(page, Data.promocode.invalidPromoCode);
  });
  await test.step("Step 27: Click On Apply PromoCode", async () => {
    await PaymentPage.clickOnApplyPromoCode(page);
  });
  await test.step("Step 28: verify Error Message Visible", async () => {
    await PaymentPage.verifyErrorMessageVisible(page);
  });
});






