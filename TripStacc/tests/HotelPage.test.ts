import { test, Page, BrowserContext } from '../../utils/testBase';
import { HotelHomePage } from '../pages/HotelHomePage';
import { HotelBookingPage } from '../pages/HotelBookingPage';
import idfcTestData from '../testData/tripStacc.json';
import { Data } from '../../utils/dataProvider';
import { BaseHelper } from '../pages/CommonMethods';
import { HomePage } from '../pages/Homepage';
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

test('SC_015: Hotel Search', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@smoke', '@sanity'] }, async () => {
  await test.step('Step 1: Open Hotels Section', async () => {
    await HotelHomePage.verifyHotelTabBtnDisplayed(page);
    await page.waitForTimeout(500);
    await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Search domestic hotel and pick first suggestion', async () => {
    await HotelHomePage.verifyWhereToTextBoxDisplayed(page);
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);

    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Set Check-in and Check-out Dates', async () => {
    await HotelHomePage.verifyDateButtonDisplayed(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(7000);
  });

  await test.step('Step 4: Select guests and complete guest selection', async () => { 
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(2000); 
    await HotelHomePage.selectAdultsAndChildrenWithAge(
      page,
      Data.hotelPage.hotelRoom1,
      Data.hotelPage.hotelAdult1,
      Data.hotelPage.hotelChildren1,
      Data.hotelPage.hotelChildrenAge1
    );
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Verify selection summary after choosing rooms & guests', async () => {
    await HotelHomePage.getLocationNameExpected(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Click Search Hotels', async () => {
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 7: Verify search results text', async () => {
    await HotelHomePage.getLocationNameActualandCompare(page);
    await page.waitForTimeout(500);
  });
});

test('SC_015.01: Hotel Search - Domestic vs International Options', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@regression'] }, async () => {
  await test.step('Step 1: Open Hotels Section', async () => {
    await HotelHomePage.verifyHotelTabBtnDisplayed(page);
    await page.waitForTimeout(500);
    await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Search for Domestic location', async () => {
    await HotelHomePage.verifyWhereToTextBoxDisplayed(page);
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Select first hotel suggestion for Domestic', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 4: Search with Selected Domestic Hotel', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Validate Domestic search results', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.getLocationNameExpectedDomOrInt(page);
    await HotelHomePage.getLocationNameActualDomOrInt(page);
    await HotelHomePage.verifyLocationNameMatched(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Go back to hotels page', async () => {
    await page.waitForTimeout(500);
    await page.goBack();
    await page.waitForTimeout(500);
  });

    await test.step('Step 7: Open Hotels Section', async () => {
    await page.waitForTimeout(500);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
    await page.waitForLoadState('domcontentloaded')
  });

  await test.step('Step 8: Search for International location', async () => {
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.international);
    await page.waitForTimeout(500);
  });

  await test.step('Step 9: Select first hotel suggestion for International', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 10: Search with Selected International Hotel', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 11: Validate International search results', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.getLocationNameExpectedDomOrInt(page);
    await HotelHomePage.getLocationNameActualDomOrInt(page);
    await HotelHomePage.verifyLocationNameMatched(page);
    await page.waitForTimeout(500);
  });
});

test('SC_015.02: Verify Room Pricing - Single vs Multiple Rooms', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@regression'] }, async () => {
  await page.waitForTimeout(500);
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(500);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Enter Domestic Hotel Location', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Choose First Domestic Hotel Option', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 4: Search for Hotels after selecting valid date range (Single Room Default)', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(5000);
    await HotelHomePage.clickOnEditFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickOnDateInpoutEditFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Note pricing summary for single room', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.compareValueDifferenceForSingleAndMultipleRoom(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Open Room & Guest Selector', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 7: Add a second Room', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickAddRoomButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 8: Complete guest selection for two rooms', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 9: Search again with updated rooms', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickUpdateSearchButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 10: Note pricing summary for multiple rooms', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.compareValueDifferenceForSingleAndMultipleRoom(page);
    await page.waitForTimeout(500);
  });
});

test('SC_015.03: Search with custom Adult & Child combinations', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@regression'] }, async () => {
  await page.waitForTimeout(500);
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(500);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Enter Domestic Location in Search', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Choose First Hotel Option', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 4: Open Room & Guest Selector', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Set Guests for First Room (Adults & Children)', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.selectAdultsAndChildrenWithAge(
      page,
      Data.hotelPage.hotelRoom1,
      Data.hotelPage.hotelAdult1,
      Data.hotelPage.hotelChildren1,
      Data.hotelPage.hotelChildrenAge1
    );
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Complete guest selection after editing first room', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 7: Search for Hotels with selected guest configuration', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 8: Get expected room detail text', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickOnEditFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.getRoomDetailTestExpected(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 9: Open Room & Guest Selector for second room edit', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 10: Update guest details for the Second Room', async () => {
    await page.waitForTimeout(500);

    await HotelHomePage.selectAdultsAndChildrenWithAge(
      page,
      Data.hotelPage.hotelRoom2,
      Data.hotelPage.hotelAdult2,
      Data.hotelPage.hotelChildren2,
      Data.hotelPage.hotelChildrenAge2
    );
    await page.waitForTimeout(500);
  });

  await test.step('Step 11: Complete guest selection after editing second room', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.getRoomDetailTestExpected(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 12: Update search results after changing guests', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickUpdateSearchButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 13: Compare actual room detail text with expected', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.clickOnEditFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.getRoomDetailTestActualAndCompare(page);
    await page.waitForTimeout(500);
  });
});

test('SC_016: Filter/Sorting and Room Selection', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@regression'] }, async () => {
  await page.waitForTimeout(500);
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(500);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Search domestic hotel and pick first suggestion', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Set Check-in and Check-out Dates', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(500);
  });

  await test.step('Step 4: Select guests and complete guest selection', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectAdultsAndChildrenWithAge(
      page,
      Data.hotelPage.hotelRoom1,
      Data.hotelPage.hotelAdult1,
      Data.hotelPage.hotelChildren1,
      Data.hotelPage.hotelChildrenAge1
    );
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Click Search Hotels', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Verify Sort By Filters', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.clickOnSortAndFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickSortByPopularityButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printAllAmountValue(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickSortByPriceLowToHighButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.verifyCurrencySortedLowToHigh(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickSortByPriceHighToLowButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.verifyCurrencySortedHighToLow(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 7: Verify Price Range Slider', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.setPriceRangeSlider(page);
    await page.waitForTimeout(500);
    await HotelHomePage.verifyAllCurrencyWithinSelectedRange(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 8: Verify Toggle Filters', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.verifyFreeCancellationToggleAndText(page);
    await page.waitForTimeout(500);
    await HotelHomePage.showingPropertiesCountText(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.verifyBreakfastAvailableToggleAndText(page);
    await page.waitForTimeout(500);
    await HotelHomePage.showingPropertiesCountText(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 9: Verify Star Rating Filters', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickStarRating5Button(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printHotelRatings(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickStarRating4Button(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printHotelRatings(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickStarRating3Button(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printHotelRatings(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickStarRating2Button(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printHotelRatings(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickStarRating1Button(page);
    await page.waitForTimeout(500);
    await HotelHomePage.printHotelRatings(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickResetButton(page);
    await page.waitForTimeout(500);
  });

});

test('SC_016.01: Update Search', { tag: ['@idfc', '@bob', '@common', '@homepagehotel', '@regression'] }, async () => {
  await page.waitForTimeout(500);
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 2: Search international hotel and pick first suggestion', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.international);
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 3: Set Check-in and Check-out Dates', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(500);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(500);
  });

  await test.step('Step 4: Select guests and complete guest selection', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickRoomsAndGuestsButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.selectAdultsAndChildrenWithAge(
      page,
      Data.hotelPage.hotelRoom1,
      Data.hotelPage.hotelAdult1,
      Data.hotelPage.hotelChildren1,
      Data.hotelPage.hotelChildrenAge1
    );
    await page.waitForTimeout(500);
    await HotelHomePage.clickDoneButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 5: Click Search Hotels', async () => {
    await page.waitForTimeout(500);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 6: Get hotel name after first search', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.clickOnEditFilterButton(page);
    await page.waitForTimeout(500);
    await HotelHomePage.getLocationNameExpected(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 7: Change location to domestic option', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.editValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(500);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(500);
    await HotelHomePage.clickUpdateSearchButton(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 8: Get hotel name after location change', async () => {
    await page.waitForTimeout(500);
    await HotelHomePage.getLocationNameActualandCompare(page);
    await page.waitForTimeout(500);
  });
});

test('SC_017: Add Guest Details and Update Guest Details', { tag: ['@idfc', '@bob', '@common', '@flaky', '@homepagehotel', '@regression'] }, async () => {

  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(5000);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 2: Enter Domestic Hotel Location', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 3: Choose First Domestic Hotel Option', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 4: Set Check-in and Check-out Dates', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(1000);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(1000);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 5: Search for Hotels (Single Room Default)', async () => {
    await page.waitForTimeout(5000);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 6: Search Hotel Name in Search Box', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.searchHotelNameInTestBox(page, Data.hotelPage.searcHotelName);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 7: Click the first hotel result', async () => {
    await page.waitForTimeout(3000);
    await HotelHomePage.clickFirstResult(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 8: Click the First Room Selection Button', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.clickFirstRoomSelectionButton(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 9: Click Next button on first tab', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.firstTabNextButton(page);
    await page.waitForTimeout(10000);
  });

  await test.step('Step 10: Remove Popup', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.removePopupForIDFC(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 11: Click Add Guest button on Primary Guest Details section', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.clickonaddguestbutton(page);
    await page.waitForTimeout(9000);
    await page.waitForLoadState('domcontentloaded');
  });
  await test.step('Step 13: Click Add New Guest Button', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.clickAddNewGuestButtonForIdfc(page);
    await page.waitForTimeout(1000);
  });
  await test.step('Step 14: Fill in Guest Details', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.fillGuestDetailsInside(page);
    await page.waitForTimeout(3000);
  });
  await test.step('Step 16: Verify Guest Details Form Visible', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.verifyGuestDetailsFormVisible(page);
    await page.waitForTimeout(3000);
  });
  await test.step('Step 17: Click Add Guest Button', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.clickEditGuestButton(page);
    await page.waitForTimeout(3000);
  });
  await test.step('Step 18: Verify Saved Guest Text Visible', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.verifySavedGuestTextVisible(page);
    await page.waitForTimeout(3000);
  });
  await test.step('Step 19: Print Saved Guest List', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.printSavedGuestList(page);
    await page.waitForTimeout(500);
  });
  await test.step('Step 20: Get Saved Guest Name', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.getSavedGuestName(page);
    await page.waitForTimeout(500);
  });
  await test.step('Step 21: Click Edit Traveler', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.clickEditTraveler(page);
    await page.waitForTimeout(500);
  });
  await test.step('Step 22: Update First Name', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.updateFirstName(page, 'NameUpdated');
    await page.waitForTimeout(500);
  });
});

test('SC_018: Domestic booking without PAN and international booking with PAN', { tag: ['@idfc', '@bob', '@common', '@flaky','@homepagehotel','@regression'] }, async () => {
  await page.waitForTimeout(5000);
  await test.step('Step 1: Open Hotels Section', async () => {
    await page.waitForTimeout(5000);
    await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 2: Enter Domestic Hotel Location', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.domestic);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 3: Choose First Domestic Hotel Option', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 4: Set Check-in and Check-out Dates', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(1000);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(1000);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 5: Search for Hotels (Single Room Default)', async () => {
    await page.waitForTimeout(5000);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 6: Search Hotel Name in Search Box', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.searchHotelNameInTestBox(page, Data.hotelPage.searcHotelName);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 7: Click the first hotel result', async () => {
    await page.waitForTimeout(6000);
    await HotelHomePage.clickFirstResult(page);
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('Step 8: Click the First Room Selection Button', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.clickFirstRoomSelectionButton(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 9: Click Next button on first tab', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.firstTabNextButton(page);
    await page.waitForTimeout(3000);
    await page.waitForLoadState('domcontentloaded')
  });

  await test.step('Step 10: Remove Popup', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.removePopupForIDFC(page);
    await page.waitForTimeout(3000);
  });

  await test.step('Step 11: Click Add Guest button on Primary Guest Details section', async () => {
    await HotelBookingPage.clickAddGuestButtonForIDFC(page);
    await page.waitForTimeout(6000);
  });

  await test.step('Step 12: Click Add New Guest Button', async () => {
    await page.waitForTimeout(9000);
    await page.waitForLoadState('domcontentloaded')
    await HotelBookingPage.clickAddNewGuestButtonForIdfc(page);
  });

  await test.step('Step 13: Verify PAN card field does NOT appear', async () => {
    await page.waitForTimeout(7000);
    await page.waitForLoadState('domcontentloaded')
    await HotelBookingPage.verifyPanCardNotVisible(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 14: Go back until location search box is visible For Internation search', async () => {
    await HotelBookingPage.goBackUntilLocationSearchBoxVisible(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 15: Open Hotels Section', async () => {
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000);
   await BaseHelper.clickHotelTabBTN(page);
    await page.waitForTimeout(500);
  });

  await test.step('Step 16: Enter International Hotel Location', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.searchValueInTestBox(page, Data.hotelPage.international);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 17: Choose First International Hotel Option', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.selectFirstOptionFromDropdown(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 18: Search for Hotels (Single Room Default) - International', async () => {
    await page.waitForTimeout(5000);
    await HotelHomePage.clickDateButton(page);
    await page.waitForTimeout(2000);
    await HotelHomePage.selectMonthAndDateFROM(page, Data.dateSelector.fromMonth, Data.dateSelector.fromDate);
    await page.waitForTimeout(1000);
    await HotelHomePage.selectMonthAndDateTO(page, Data.dateSelector.toMonth, Data.dateSelector.toDate);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 19: Search for Hotels (Single Room Default)', async () => {
    await page.waitForTimeout(5000);
    await BaseHelper.clickSearchHotelButton(page);
    await page.waitForTimeout(5000);
    await HotelBookingPage.searchHotelNameInTestBox(page, Data.hotelPage.searcHotelNameInternational);
    await page.waitForTimeout(3000);
    await HotelHomePage.clickFirstResult(page);
  });

  await test.step('Step 20: Click Search Room Button (International)', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.clickFirstRoomSelectionButton(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 21: Click Next button (International)', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.confirmRoomSelection(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 22: Verify primary guest details header is visible and click New Guest Button (International)', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.verifyPrimaryGuestDetailsHeaderVisible(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 23: Click Add Guest button on Primary Guest Details section', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.clickAddGuestButtonForIDFC(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 24: Click Add New Guest Button', async () => {
    await page.waitForTimeout(5000);
    await HotelBookingPage.clickAddNewGuestButtonForIdfc(page);
    await page.waitForTimeout(1000);
  });

  await test.step('Step 25: Verify PAN card field DOES appear', async () => {
    await page.waitForTimeout(3000);
    await HotelBookingPage.verifyPanCardVisibleAndRequired(page);
    await page.waitForTimeout(1000);
  });

});
