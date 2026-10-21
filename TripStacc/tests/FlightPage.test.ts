import { test, Page, BrowserContext } from '../../utils/testBase';
import { FlightHomePage } from '../pages/FlightHomePage';
const idfcTestData = require('../testData/tripStacc.json');
import { BaseHelper } from '../pages/CommonMethods';
import { Data } from '../../utils/dataProvider';
import { DeviceHelper } from '../../utils/deviceHelper';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { FlightPageLocators } from '../locators/FlightPageLocators';
let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await BaseHelper.launchAndLogin(page);
  await page.waitForLoadState('domcontentloaded');
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});

test('SC_003: Search ', { tag: ['@idfc', '@bob','@common','@issue', '@homepageflight', '@smoke', '@sanity', '@regression'] }, async () => {
  await test.step("Step 1: Enter City From Airport", async () => {
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  })

  await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
  })

  await test.step("Step 3: Verify Origin suggestions appear and selected origin is populated in 'From' field", async () => {
    await FlightHomePage.verifyFromCitySuggestionsMatch(page, Data.flightPage.enterCityFrom);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
    await FlightHomePage.verifyFromFieldPopulatedWithSelectedCity(page);
  })

  await test.step("Step 4: Enter City To Airport", async () => {
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  })

  await test.step("Step 5: Verify To Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
  })

  await test.step("Step 6: Verify Destination suggestions appear and selected destination is populated in 'To' field", async () => {
    await FlightHomePage.verifyToCitySuggestionsMatch(page, Data.flightPage.enterCityTo);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
    await FlightHomePage.verifyToFieldPopulatedWithSelectedCity(page);
  })

  await test.step("Step 7: Enter date of departure", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  })

  await test.step("Step 8: Enter date of return", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step("Step 9: Click and verify travellers and cabin class dropdown", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  let searchFormUrl: string;
  await test.step("Step 10: Click search flights button", async () => {
    searchFormUrl = page.url();
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step("Step 11: Verify user is navigated to Flight Search Results page matching the entered criteria", async () => {
    await FlightHomePage.verifyNavigatedToFlightSearchResults(page, searchFormUrl);
  });

  await test.step("Step 12: Verify first flight card visible", async () => {
    await page.waitForLoadState('domcontentloaded');
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step("Step 13: Verify a list of available flights is displayed with one card per flight/fare", async () => {
    await FlightHomePage.verifyFlightResultCardsList(page);
  });
});

test('SC_003.01: Search (1 Passenger and Multiple Passengers) ', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@regression', '@Sanity'] }, async () => {
  let expectedTravellerCount: string;
  await test.step("Step 1: Enter City From Airport", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  })

  await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
    await page.waitForTimeout(5000);
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
    await FlightHomePage.clickOntravellersAndCabinClasses(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.resetTravellersToOneAdult(page);
  });

  await test.step("Step 7: Click plus button for children", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnChildPlusButton(page);
  });

  await test.step("Step 8: Click plus button for infants", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnInfantPlusButton(page);
  });

  await test.step("Step 9: Click plus button for adults", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.verifyMaxPassengerLimit(page);
  });

  await test.step("Step 10: Reset travellers to 1 Adult before search", async () => {
    await FlightHomePage.resetTravellersToOneAdult(page);
  });

  await test.step("Step 11: Click on apply Button", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnApplyButton(page);
  });
  await test.step("Step 12: get Traveller Count", async () => {
    expectedTravellerCount = await FlightHomePage.getTravellerCount(page);
  });

  await test.step("Step 13: Click search flights button", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step("Step 14: Verify expected Traveller Count visible", async () => {
    await FlightHomePage.verifyTravellerCount(page, expectedTravellerCount);
  });
});

test('SC_003.02: Search (One Way and Round Trip) ', { tag: ['@idfc', '@bob', '@common', '@flaky','@homepageflight', '@regression', '@Sanity'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnOneway(page);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 7: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });
  await test.step('Step 8: Verify first flight card visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 9: Verify One Way Round Trip Calendar Visible', async () => {
    await FlightHomePage.VerifyOneWayRoundTripCalendarVisible(page);
    await page.goBack();
    await page.waitForTimeout(6000);
  });

  await test.step('Step 10: Click Round Trip Option', async () => {
    await FlightHomePage.clickOnRoundTripOption(page);
  });

  await test.step('Step 11: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 12: Verify From Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 13: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 14: Verify To Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 15: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 16: Enter date of return', async () => {
    await page.waitForTimeout(8000);
    await FlightHomePage.clickOnReturnDate(page);
    await FlightHomePage.select2dayDateForReturn(page);
  });
  await test.step('Step 18: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.captureSelectedCitiesFromSearchForm(page);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });
  await test.step('Step 19: Verify first flight card visible', async () => {
      await page.waitForTimeout(12000);
      await page.reload();
      await page.waitForTimeout(6000)
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 20: Verify each flight card shows airline, flight number, timings, duration, stops and price', async () => {
    await FlightHomePage.verifyFlightCardsShowKeyDetails(page);
  });

  await test.step('Step 21: Verify fare type tag Refundable is displayed on each flight card', async () => {
    await FlightHomePage.verifyFlightCardsShowFareType(page);
  });

  await test.step('Step 22: Select a return flight and verify it is highlighted and reflected in the fare summary', async () => {
    await FlightHomePage.selectReturnFlightAndVerifyFareSummary(page);
  });

  await test.step('Step 23: Flight Round Trip Details Box visible', async () => {
    await FlightHomePage.printFlightRoutes(page);
  });
});

test('SC_003.03: Search (with multiple classes) - Economy, Premium Economy, Business, First ', { tag: ['@idfc', '@common', '@bob', '@homepageflight', '@regression', '@Sanity'] }, async () => {

  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClasses(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
  });

  await test.step('Step 7: Click plus button for adults', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnAdultPlusButton(page);
  });

  await test.step('Step 8: Click plus button for children', async () => {
    await page.waitForTimeout(2000);
    await FlightHomePage.clickOnChildPlusButton(page);
  });

  await test.step('Step 9: Click plus button for infants', async () => {
    await page.waitForTimeout(2000);
    await FlightHomePage.clickOnInfantPlusButton(page);
  });

  await test.step('Step 10: Click on apply Button', async () => {
    await FlightHomePage.clickOnApplyButton(page);
  });

  await test.step('Step 11: Scroll to Travel Advisory', async () => {
    await page.waitForTimeout(2000);
    await FlightHomePage.scrolltoViewTravelAdvisory(page);
  });

  await test.step('Step 12: get Traveller Class', async () => {
    await FlightHomePage.getTravelClass(page);
  });
  await test.step('Step 13: Click search flights button', async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });
  await test.step('Step 14: Verify expected Traveller Class visible', async () => {
    await FlightHomePage.verifyTravelClass(page);
    await page.goBack();
  });

  await test.step('Step 15: Scroll to Travel Advisory', async () => {
    await FlightHomePage.scrolltoViewTravelAdvisory(page);
  });

  await test.step('Step 16: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, 'Del');
  });

  await test.step('Step 17: Verify From Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 18: Enter City To Airport', async () => {
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, 'Mum');
  });

  await test.step('Step 19: Verify To Airport Dropdown Visible', async () => {
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 20: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
    await page.waitForTimeout(2000);
  });

  await test.step('Step 21: Click and verify travellers and cabin class dropdown', async () => {
    await FlightHomePage.clickOntravellersAndCabinClasses(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
  });

  await test.step('Step 22: Click plus button for adults', async () => {
    await FlightHomePage.clickOnAdultPlusButton(page);
  });

  await test.step('Step 23: Click plus button for children', async () => {
    await FlightHomePage.clickOnChildPlusButton(page);
  });

  await test.step('Step 24: Click plus button for infants', async () => {
    await FlightHomePage.clickOnInfantPlusButton(page);
  });

  await test.step('Step 25: Click on premium Button', async () => {
    await FlightHomePage.clickOnPremiumClassButton(page);
  });

  await test.step('Step 26: Click on apply Button', async () => {
    await FlightHomePage.clickOnApplyButton(page);
  });

  await test.step('Step 27: Scroll to Travel Advisory', async () => {
    await FlightHomePage.scrolltoViewTravelAdvisory(page);
  });

  await test.step('Step 28: get Traveller Class', async () => {
    await FlightHomePage.getTravelClass(page);
  });

  await test.step('Step 29: Click search flights button', async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 30: Verify expected Traveller Class visible', async () => {
    await FlightHomePage.verifyTravelClass(page);
    await page.goBack();
  });
});

test('SC_003.04: Search (With International and Domestic) ', { tag: ['@idfc', '@bob', '@common', `@flaky`, '@homepageflight', '@regression', '@Sanity'] }, async () => {
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
    await page.waitForTimeout(8000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
     await page.waitForTimeout(8000);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
     await page.waitForTimeout(8000);
    await FlightHomePage.clickOnApplyButton(page);
     await page.waitForTimeout(8000);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step("Step 7: Click search flights button", async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step("Step 8: Verify first flight card visible", async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step("Step 8: Verify Shot Form Of flight Name visible", async () => {
    await FlightHomePage.verifyFlightFromAndToShotFormVisible(page);
  });
  await page.goBack()
  await page.waitForTimeout(10000)
  await test.step("Step 9: Enter City From Airport", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  })

  await test.step("Step 10: Verify From Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  })

  await test.step("Step 11: Enter City To Airport", async () => {
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterInternationalCityTo);
  })

  await test.step("Step 12: Verify To Airport Dropdown Visible", async () => {
    await page.waitForTimeout(10000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await page.waitForTimeout(8000);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  })

  await test.step("Step 13: Enter date of departure", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);

  })

  await test.step("Step 15: Click search flights button", async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
    await page.waitForLoadState('domcontentloaded')
  });

  await test.step("Step 16: Verify first flight card visible", async () => {
    await page.waitForTimeout(15000);
    await page.waitForLoadState('domcontentloaded')
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

});

test('SC_004: Filter/Sorting and Flight Selection with Fare Type ', { tag: ['@idfc', '@bob', '@common', '@flaky', '@homepageflight', '@regression', '@Sanity'] }, async () => {
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
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterInternationalCityTo);
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

  await test.step("Step 6: Enter date of return", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step("Step 7: Click and verify travellers and cabin class dropdown", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step("Step 8: Click search flights button", async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step("Step 9: Verify first flight card visible", async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step("Step 10: Click on Filter Button", async () => {
    await FlightHomePage.clickOnFilterListButton(page);
  });
  await test.step("Step 11: Verify Stops Filter Tab Visible", async () => {
    await FlightHomePage.VerifyStopsTabVisible(page);
  });
  await test.step("Step 12: get Non-Stop filter text", async () => {
    await FlightHomePage.selectNonStopFilter(page);
  });

  await test.step("Step 13: Click on Filter Apply Button", async () => {
    await FlightHomePage.clickOnFilterApplyButton(page);
  });

  await test.step("Step 14: Verify filtered stops details", async () => {
    await FlightHomePage.verifyFilteredStopsDetails(page);
  });

  await test.step("Step 15: Click on Filter Button", async () => {
    await FlightHomePage.clickOnFilterListButton(page);
  });
  await test.step("Step 16: uncheck Non-Stop filter ", async () => {
    await FlightHomePage.clickOnFilterNonStoputton(page);
  });

  await test.step("Step 17: get 1-Stop filter text", async () => {
    await FlightHomePage.select1StopFilter(page);
  });

  await test.step("Step 18: Click on Filter Apply Button", async () => {
    await FlightHomePage.clickOnFilterApplyButton(page);
  });


  await test.step("Step 19: Verify filtered 1-stop details", async () => {
    await FlightHomePage.verifyFiltered1StopsDetails(page);
  });

  await test.step("Step 20: Click on Filter Button", async () => {
    await FlightHomePage.clickOnFilterListButton(page);
  });

  await test.step("Step 21: Click on Departure Time Tab", async () => {
    await FlightHomePage.clickOnDepartureTabButton(page);
  });

  await test.step("Step 22: Verify Filter Departure Time Early Morning details", async () => {
    await FlightHomePage.VerifyfilterDepartureTimeEarlyMorningVisible(page);
  });

  await test.step("Step 23: Verify Filter Departure Time Morning details", async () => {
    await FlightHomePage.VerifyfilterDepartureTimeMorningVisible(page);
  });

  await test.step("Step 24: Verify Filter Departure Time Afternoon details", async () => {
    await FlightHomePage.VerifyfilterDepartureTimeAfternoonVisible(page);
  });

  await test.step("Step 25: Verify Filter Departure Time Evening details", async () => {
    await FlightHomePage.VerifyfilterDepartureTimeEveningVisible(page);
  });

  await test.step("Step 26: Verify Filter Departure Time Early Morning Return details", async () => {
    await FlightHomePage.VerifyFilterDepartureTimeEarlyMorningReturnVisible(page);
  });

  await test.step("Step 27: Verify Filter Departure Time Morning Return details", async () => {
    await FlightHomePage.VerifyFilterDepartureTimeMorningReturnVisible(page);
  });

  await test.step("Step 28: Verify Filter Departure Time Afternoon Return details", async () => {
    await FlightHomePage.VerifyFilterDepartureTimeAfternoonReturnVisible(page);
  });

  await test.step("Step 29: Verify Filter Departure Time Evening Return details", async () => {
    await FlightHomePage.VerifyFilterDepartureTimeEveningReturnVisible(page);
  });

  await test.step("Step 30: Click on Arrival Time Tab", async () => {
    await FlightHomePage.clickOnArrivalTabButton(page);
  });

  await test.step("Step 31: Verify Filter Arrival Time Early Morning details", async () => {
    await FlightHomePage.VerifyfilterArrivalTimeEarlyMorningVisible(page);
  });

  await test.step("Step 32: Verify Filter Arrival Time Morning details", async () => {
    await FlightHomePage.VerifyfilterArrivalTimeMorningVisible(page);
  });

  await test.step("Step 33: Verify Filter Arrival Time Afternoon details", async () => {
    await FlightHomePage.VerifyfilterArrivalTimeAfternoonVisible(page);
  });

  await test.step("Step 34: Verify Filter Arrival Time Evening details", async () => {
    await FlightHomePage.VerifyfilterArrivalTimeEveningVisible(page);
  });

  await test.step("Step 35: Verify Filter Arrival Time Early Morning Return details", async () => {
    await FlightHomePage.VerifyFilterArrivalTimeEarlyMorningReturnVisible(page);
  });

  await test.step("Step 36: Verify Filter Arrival Time Morning Return details", async () => {
    await FlightHomePage.VerifyFilterArrivalTimeMorningReturnVisible(page);
  });

  await test.step("Step 37: Verify Filter Arrival Time Afternoon Return details", async () => {
    await FlightHomePage.VerifyFilterArrivalTimeAfternoonReturnVisible(page);
  });

  await test.step("Step 38: Verify Filter Arrival Time Evening Return details", async () => {
    await FlightHomePage.VerifyFilterArrivalTimeEveningReturnVisible(page);
  });
  await test.step("Step 39: Click on Fare Filter TabButton", async () => {
    await FlightHomePage.clickOnfilterTabFareTypeTabButton(page);
  });

  await test.step("Step 40: get Refundable filter text", async () => {
    await FlightHomePage.selectRefundableFilter(page);
  });

  await test.step("Step 41: Click on Filter Apply Button", async () => {
    await FlightHomePage.clickOnFilterApplyButton(page);
  });

  await test.step("Step 42: Verify Refundable details", async () => {
    await FlightHomePage.verifyRefundableDetails(page);
  });

  await test.step("Step 43: Click on Filter Button", async () => {
    await FlightHomePage.clickOnFilterListButton(page);
  });

  await test.step("Step 44: Click on Fare Filter TabButton", async () => {
    await FlightHomePage.clickOnfilterTabFareTypeTabButton(page);
  });

  await test.step("Step 45: Click on filter Tab Fare Type Refundable Button", async () => {
    await FlightHomePage.clickOnfilterTabFareTypeRefundableButton(page);
  });

  await test.step("Step 46: get non-Refundable filter text", async () => {
    await FlightHomePage.selectNonRefundableFilter(page);
  });
  await test.step("Step 50: Click filter Airline Tab Button", async () => {
    await page.waitForTimeout(7000);
    await FlightHomePage.clickOnfilterAirlineTabButton(page);
  });
  await test.step("Step 51: get First Airline text", async () => {
    await page.waitForTimeout(7000);
    await FlightHomePage.selectFirstAirlineFilter(page);
  });
  await test.step("Step 52: Click on Filter Apply Button", async () => {
    await FlightHomePage.clickOnFilterApplyButton(page);
  });
  await test.step("Step 53: Verify Filtered Airlines", async () => {
     await FlightHomePage.verifyFilteredAirlines(page);
  });

});

test('SC_004.01: Update Search ', { tag: ['@idfc', '@bob', '@common','@homepageflight', '@regression', '@Sanity'] }, async () => {
  await test.step("Step 1: Enter City From Airport", async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, "del");
  })

  await test.step("Step 2: Verify From Airport Dropdown Visible", async () => {
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  })

  await test.step("Step 3: Enter City To Airport", async () => {
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, "Mum");
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

  await test.step("Step 7: Click search flights button", async () => {
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });


  await test.step('Go back and reload page', async () => {
    await page.goBack();
    await page.reload();
    await page.waitForTimeout(3000);
  });

  await test.step('Click on City From Airport field', async () => {
    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, "del");
  });
})

test('SC_005: Add Traveller Details and Update Traveller Details ', { tag: ['@idfc', '@bob', '@common', '@flaky', '@homepageflight', '@regression', '@Sanity'] }, async () => {
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
    await FlightHomePage.clickOnApplyButton(page);
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

  await test.step("Step 12: Click on Add New Traveller Button On Traveller Details Page", async () => {
    await FlightHomePage.clickOnAddNewTravellerButton(page);
  });

  await test.step("Step 13: Click on Mr. Gender Button On Traveller Details Page", async () => {
    await FlightHomePage.clickOnMrGenderButton(page);
  });

  await test.step("Step 16: Enter Wrong First Name of Traveller", async () => {
    await FlightHomePage.EnterWrongFirstName(page, Data.travellername.WrongfirstName);
  });
  await test.step("Step 14: Verify First Name Error Visible", async () => {
    await FlightHomePage.VerifyFirstNameErrorMessageVisible(page);
  });
  await test.step("Step 17: Enter Wrong Last Name of Traveller", async () => {
    await FlightHomePage.EnterWrongLastName(page, Data.travellername.WronglastName);
  });
  await test.step("Step 15: Verify Last Name Error Visible", async () => {
    await FlightHomePage.VerifyLastNameErrorMessageVisible(page);
  });

  await test.step("Step 16: Enter First Name of Traveller", async () => {
    await FlightHomePage.EnterFirstName(page, Data.travellername.firstName);
  });

  await test.step("Step 17: Enter Last Name of Traveller", async () => {
    await FlightHomePage.EnterLastName(page, Data.travellername.lastName);
  });

  await test.step("Step 18: Click on Add Traveller Button On Traveller Details Page", async () => {
    await FlightHomePage.selectPassportDetailstravellerpage(page)
    await FlightHomePage.clickOnAddTravellerButton(page);
  });

  await test.step("Step 19: Verify First Traveller Name Visible on the traveller details page", async () => {
    await FlightHomePage.verifyFirstTravellerNameOnTravellerDetailPage(page);
  });

  await test.step("Step 20: Verify Last Traveller Name Visible on the traveller details page", async () => {
    await FlightHomePage.verifyLastTravellerNameOnTravellerDetailPage(page);
  });

  await test.step("Step 21: Click on First Traveller Edit Button On Traveller Details Page", async () => {
    await FlightHomePage.clickOnFirstNameEditButton(page);
  });

  await test.step("Step 22: Enter Edit First Name of Traveller", async () => {
    await FlightHomePage.EnterEditFirstName(page, Data.travellername.editedFirstName);
  });

  await test.step("Step 23: Enter Edit Last Name of Traveller", async () => {
    await FlightHomePage.EnterEditLastName(page, Data.travellername.editedLastName);
  });

  await test.step("Step 24: Click on Confirm Button On Traveller Details Page", async () => {
    await FlightHomePage.clickOnEditConfirmButtonPage(page);
  });

  await test.step("Step 25: Verify First Traveller Name Visible on the traveller details page", async () => {
    await page.waitForTimeout(2000);
    await FlightHomePage.verifyFirstTravellerNameOnTravellerDetailPage(page);
  });

  await test.step("Step 26: Verify Last Traveller Name Visible on the traveller details page", async () => {
    await page.waitForTimeout(2000);
    await FlightHomePage.verifyLastTravellerNameOnTravellerDetailPage(page);
  });

});

test('SC_006: Check and update user information (Mobile number/Email Address) and GST information ', { tag: ['@idfc', '@bob', '@common','@homepageflight', '@sanity'] }, async () => {
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
    await FlightHomePage.clickOnApplyButton(page);
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

  await test.step("Step 12: Verify Traveller Email Header Visible", async () => {
    await FlightHomePage.VerifyEmailHeaderVisible(page);
  });

  await test.step("Step 14: Verify first Phone Header Visible", async () => {
    await FlightHomePage.VerifyPhoneHeaderVisible(page);
  });
  await test.step("Step 15: Verify Traveller Default Email is Visible", async () => {
    await FlightHomePage.VerifyDefaultTravellerEmail(page);
  });

  await test.step("Step 16: Verify Traveller Default Phone is Visible", async () => {
    await FlightHomePage.VerifyDefaultTravellerPhone(page);
  });

  await test.step("Step 17: Verify Empty Email Error Message is Visible", async () => {
    await FlightHomePage.ClearEmailAndVerifyEmailError(page);
  });

  await test.step("Step 18: Verify Empty Phone Error Message is Visible", async () => {
    await FlightHomePage.ClearMobileAndVerifyMobileError(page);
  });

  await test.step("Step 19: Verify New Email enter and Error Message is not be Visible", async () => {
    await FlightHomePage.EnterNewTravellerEmail(page, Data.travellername.email);
  });

  await test.step("Step 20: Verify New Phone enter and Error Message is not be Visible", async () => {
    await FlightHomePage.EnterNewTravellerPhone(page, Data.travellername.phone);
  });

  await test.step("Step 21: Verify first GST Header Visible", async () => {
    await FlightHomePage.VerifyGSTHeaderVisible(page);
  });

  await test.step("Step 22: Verify Empty GST Error Message is Visible", async () => {
    await FlightHomePage.ClearGSTAndVerifyError(page);
  });

  await test.step("Step 23: Verify New GST enter and Error Message is not be Visible", async () => {
    await FlightHomePage.EnterNewTravellerGST(page, Data.travellername.gst);
  });
});

test('TC:-37970 Verify sorting results by Price', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnOneway(page);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 7: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });
  await test.step('Step 8: Verify first flight card visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 9: Sort by Price High to Low and verify order', async () => {
    await FlightHomePage.clickOnFilterListButton(page);
    await FlightHomePage.clickOnSortTab(page);
    await FlightHomePage.selectSortPriceHighToLow(page);
    await FlightHomePage.clickOnFilterApplyButton(page);
    await page.waitForTimeout(3000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
    await FlightHomePage.verifyFlightCardsSortedByPrice(page, 'desc');
  });

  await test.step('Step 10: Sort by Price Low to High and verify order', async () => {
    await FlightHomePage.clickOnFilterListButton(page);
    await FlightHomePage.clickOnSortTab(page);
    await FlightHomePage.selectSortPriceLowToHigh(page);
    await FlightHomePage.clickOnFilterApplyButton(page);
    await page.waitForTimeout(3000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
    await FlightHomePage.verifyFlightCardsSortedByPrice(page, 'asc');
  });
});

test('TC:-37971 Verify fare/service options select servic eare displayed', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnOneway(page);
    await FlightHomePage.clickOnDepartureDate(page);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 7: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 8: Verify first flight card visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 9: Open the flight/fare details', async () => {
    await FlightHomePage.clickOnNextButtonOnFlightDetailsPage(page);
    await page.waitForTimeout(2000);
  });

  await test.step('Step 10: Verify fare/service options with inclusions (Cabin, Check-in, Meal) and prices are displayed', async () => {
    await FlightHomePage.verifyFareOptionsDisplayed(page);
  });

  await test.step('Step 11: Verify a fare option is selectable', async () => {
    await FlightHomePage.selectFareOptionAndVerifySelected(page, 1);
  });
});

test('TC-37975 Verify fare/service options are available and selectable per leg (onward and return)', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Enter date of return', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step('Step 7: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 8: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 9: Verify onward leg flight card visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 10: Click Next to pick the return leg, then Continue into fare details', async () => {
    await FlightHomePage.clickOnNextButtonOnFlightDetailsPage(page);
    await page.waitForTimeout(3000);
    await FlightHomePage.openFareDetailsForOnwardLeg(page);
  });

  await test.step('Step 11: Verify onward leg fare options with inclusions/prices are displayed and selectable', async () => {
    await FlightHomePage.verifyFareOptionsDisplayed(page);
    await FlightHomePage.selectFareOptionAndVerifySelected(page, 1);
  });

  await test.step('Step 12: Continue to the return leg fare details', async () => {
    await FlightHomePage.clickOnFareModalContinueButton(page);
  });

  await test.step('Step 13: Verify return leg fare options with inclusions/prices are displayed and selectable', async () => {
    await FlightHomePage.verifyFareOptionsDisplayed(page);
    await FlightHomePage.selectFareOptionAndVerifySelected(page, 1);
  });
});

test('TC-37973 Verify selecting a Return flight for round trip', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Enter date of return', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step('Step 7: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 8: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 9: Verify onward leg flight card visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 10: Click Next, then open fare details', async () => {
    await FlightHomePage.clickOnNextButtonOnFlightDetailsPage(page);
    await page.waitForTimeout(3000);
    await FlightHomePage.openFareDetailsForOnwardLeg(page);
    await page.evaluate(() => {document.body.style.zoom = '50%';});
  });

  await test.step("Step 11: Switch to the 'Return' section", async () => {
    await FlightHomePage.clickOnFareModalReturnTab(page);
  });

  await test.step('Step 12: Select a return flight fare and verify it is highlighted', async () => {
    await FlightHomePage.verifyFareOptionsDisplayed(page);
    await FlightHomePage.selectFareOptionAndVerifySelected(page, 1);
  });

  await test.step('Step 13: Verify the selection is reflected in the fare summary', async () => {
    await FlightHomePage.verifyFareSummaryReflectsSelectedFare(page);
  });

});

test('TC-37966 Verify each flight card shows key details', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Enter date of return', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step('Step 7: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 8: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 9: Verify first flight card visible', async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 10: Verify each flight card shows airline, flight number, timings, duration, stops and price', async () => {
    await FlightHomePage.verifyFlightCardsShowKeyDetails(page);
  });
});
test('TC-37968 Verify Filter panel is available', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Enter date of return', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step('Step 7: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 8: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 9: Verify first flight card visible', async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 10: Open the Filter panel', async () => {
    await FlightHomePage.clickOnFilterListButton(page);
  });

  await test.step('Step 11: Verify Stops tab and its options (Non-stop, 1 Stop) are displayed', async () => {
    await FlightHomePage.VerifyStopsTabVisible(page);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterNonStop);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filter1Stop);
  });

  await test.step('Step 12: Verify Departure, Arrival, Fare type and Airline tabs are displayed', async () => {
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabDepartureTime);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabArrivalTime);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabFareType);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabAirlines);
  });

  await test.step('Step 13: Verify the Sort tab is displayed', async () => {
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.sortTabButton);
  });
});

test('TC-37965 Verify flight result cards are displayed', { tag: ['@idfc', '@bob', '@common', '@homepageflight', '@sanity', '@regression'] }, async () => {
  await test.step('Step 1: Enter City From Airport', async () => {
    await page.waitForTimeout(5000);

    await FlightHomePage.clickOnCityFromAirport(page);
    await FlightHomePage.EnterCityFromAirport(page, Data.flightPage.enterCityFrom);
  });

  await test.step('Step 2: Verify From Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyFromAirpotDropdownVisible(page);
    await FlightHomePage.clickOnFirstSearchResultfromCityDropdown(page);
  });

  await test.step('Step 3: Enter City To Airport', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnToAirport(page);
    await FlightHomePage.EnterCityToAirport(page, Data.flightPage.enterCityTo);
  });

  await test.step('Step 4: Verify To Airport Dropdown Visible', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.VerifyToAirpotDropdownVisible(page);
    await FlightHomePage.clickOnfirstSearchResultToCityDropdown(page);
  });

  await test.step('Step 5: Enter date of departure', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnDepartureDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.selectTomorrowDateForDeparture(page);
  });

  await test.step('Step 6: Enter date of return', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnReturnDate(page);
    await page.waitForTimeout(5000);
    await FlightHomePage.select2dayDateForReturn(page);
  });

  await test.step('Step 7: Click and verify travellers and cabin class dropdown', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOntravellersAndCabinClass(page);
    await FlightHomePage.VerifytravellersAndCabinClassDropdownVisible(page);
    await FlightHomePage.clickOnApplyButton(page);
    await FlightHomePage.clickOnCloseTravellersAndCabinClassDropdown(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 8: Click search flights button', async () => {
    await page.waitForTimeout(5000);
    await FlightHomePage.clickOnSearchFlightsButton(page);
  });

  await test.step('Step 9: Verify first flight card visible', async () => {
    await FlightHomePage.VerifyFirstFlightCardVisible(page);
  });

  await test.step('Step 10: Verify a list of flight result cards is displayed, one card per flight/fare', async () => {
    await FlightHomePage.verifyFlightResultCardsList(page);
  });
});





