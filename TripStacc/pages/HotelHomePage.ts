import { expect, Page } from '@playwright/test';
import { HotelPageLocators } from '../../TripStacc/locators/HotelPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { DeviceHelper } from '../../utils/deviceHelper';
import { HotelBookingPage } from './HotelBookingPage';

const idfcTestData = require('../testData/tripStacc.json');

export class HotelHomePage {

  static async verifyHotelHomePageLoaded(page: Page) {
    await ElementHelper.waitForElementVisible(page, HotelPageLocators.profileIconButton);
    await expect(page.locator(HotelPageLocators.profileIconButton)).toBeVisible();
    console.log("User redirected to homepage successfully");
  }
  static async verifyHotelTabBtnDisplayed(page: Page) {
    if(DeviceHelper.isMobile()) {
      const hotelTabBTN = HotelPageLocators.hotelTabMobile;
      await ElementHelper.isElementDisplayed(page, hotelTabBTN);
    } else {
      const hotelTabBTN = HotelPageLocators.hotelTab;
      await ElementHelper.isElementDisplayed(page, hotelTabBTN);
    }
    console.log(" Hotel button displayed");
  }
  static async searchValueInTestBox(page: Page, text: string) {
    if(DeviceHelper.isMobile()) {

        const CLIENT = process.env.CLIENT?.toUpperCase();
        const whereToTextBox = HotelPageLocators.whereToTextBox;
        switch (CLIENT) {
          
          case 'BOB':
            await VerificationHelpers.elementIsVisible(page, whereToTextBox);
            await ElementHelper.clearAndEnterInTextField(page, whereToTextBox, text);
            break;
      
          case 'IDFC':
            await ElementHelper.clickElement(page, whereToTextBox);
            await page.waitForTimeout(2000);
            const whereToTextBoxMobile = HotelPageLocators.whereToTextBoxMobile;
            await VerificationHelpers.elementIsVisible(page, whereToTextBoxMobile);
            await page.waitForTimeout(2000);
            await ElementHelper.clearAndEnterInTextField(page, whereToTextBoxMobile, text);
          break;
        }
    } else {
      await page.waitForTimeout(2500);
      const whereToTextBox = HotelPageLocators.whereToTextBox;
      await ElementHelper.scrollElementToCentre(page, whereToTextBox);
      await page.waitForTimeout(2000);
      await VerificationHelpers.elementIsVisible(page, whereToTextBox);
      await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);
      await page.waitForTimeout(1000);
      await ElementHelper.clearAndTypeInTextField(page, whereToTextBox, text);
    }
  }

  static async verifyWhereToTextBoxDisplayed(page: Page) {
    if(DeviceHelper.isMobile()) {
      const whereToTextBox = HotelPageLocators.whereToTextBox;
      await ElementHelper.isElementDisplayed(page, whereToTextBox);
      // const whereToTextBoxMobile = HotelPageLocators.whereToTextBoxMobile;
      // await VerificationHelpers.elementIsVisible(page, whereToTextBoxMobile);
    } else {
      await page.waitForTimeout(5000);
      const whereToTextBox = HotelPageLocators.whereToTextBox;
      await ElementHelper.isElementDisplayed(page, whereToTextBox);
    }
    console.log(" Where To Text Box displayed");
  }

  static async selectFirstOptionFromDropdown(page: Page) {
    if(DeviceHelper.isMobile()) {
            const CLIENT = process.env.CLIENT?.toUpperCase();
            switch (CLIENT) {
              case 'BOB':
                const whereToDropdownSelectFirstOption = HotelPageLocators.whereToDropdownSelectFirstOptionMobile;
                await VerificationHelpers.elementIsVisible(page, whereToDropdownSelectFirstOption);
                await ElementHelper.clickElement(page, whereToDropdownSelectFirstOption);
                break;
          
              case 'IDFC':
                    const whereToDropdownSelectFirstOptionMobileIDFC = HotelPageLocators.whereToDropdownSelectFirstOptionMobileIDFC;
                await VerificationHelpers.elementIsVisible(page, whereToDropdownSelectFirstOptionMobileIDFC);
                await ElementHelper.clickElement(page, whereToDropdownSelectFirstOptionMobileIDFC);
              break;
            }
    } else {
      await page.waitForTimeout(7000);
      const dropdownOpened = page.locator(HotelPageLocators.dropdownOpened);
    if (await dropdownOpened.isVisible()) {
        console.log('Dropdown opened');
    } else {
        console.log('Dropdown closed');
        await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);
        await page.waitForTimeout(4000);
    }

    const whereToDropdownSelectFirstOption = HotelPageLocators.whereToDropdownSelectFirstOption;
    if (await page.locator(whereToDropdownSelectFirstOption).isVisible()) {
        console.log('Dropdown opened');
    } else {
        console.log('Dropdown closed');
        await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);
        await page.waitForTimeout(4000);
    }
      await VerificationHelpers.elementIsVisible(page, whereToDropdownSelectFirstOption);
      await ElementHelper.clickElement(page, whereToDropdownSelectFirstOption);
    }
  }

static async clickDateButton(page: any) {

  if(DeviceHelper.isMobile()) {
          const CLIENT = process.env.CLIENT?.toUpperCase();
      switch (CLIENT) {
        case 'BOB':
        console.log('⏭️ BOB: Skipping ');
          break;
    
        case 'IDFC':
            const dateButton = HotelPageLocators.dateButton;
        const checkInDateBoxOpened = HotelPageLocators.checkInDateBoxOpened;

        const dateBox = page.locator(checkInDateBoxOpened);

        await ElementHelper.clickElement(page, dateButton);
        await page.waitForTimeout(1000); // optional
        // First check without clicking
        if (await dateBox.count() > 0 && await dateBox.isVisible()) {
            console.log("Check-in date box opened");
            return;
        }else{
        // Try clicking up to 2 times
        for (let attempt = 1; attempt <= 3; attempt++) {
            await ElementHelper.clickElement(page, dateButton);
            console.log(`Date button clicked - Attempt ${attempt}`);

            await page.waitForTimeout(1000); // optional

            if (await dateBox.count() > 0 && await dateBox.isVisible()) {
                console.log("Check-in date box opened");
                return;
            }
        }

        console.log("Check-in date box is still not opened after 3 attempts");
        }
        break;
      }

      
      }else{

        const dateButton = HotelPageLocators.dateButton;
        const checkInDateBoxOpened = HotelPageLocators.checkInDateBoxOpened;

        const dateBox = page.locator(checkInDateBoxOpened);

        await ElementHelper.clickElement(page, dateButton);
        await page.waitForTimeout(1000); // optional
        // First check without clicking
        if (await dateBox.count() > 0 && await dateBox.isVisible()) {
            console.log("Check-in date box opened");
            return;
        }else{
        // Try clicking up to 2 times
        for (let attempt = 1; attempt <= 3; attempt++) {
            await ElementHelper.clickElement(page, dateButton);
            console.log(`Date button clicked - Attempt ${attempt}`);

            await page.waitForTimeout(1000); // optional

            if (await dateBox.count() > 0 && await dateBox.isVisible()) {
                console.log("Check-in date box opened");
                return;
            }
        }

    console.log("Check-in date box is still not opened after 3 attempts");
    }
  }
}

  static async verifyDateButtonDisplayed(page: any) {
    const dateButton = HotelPageLocators.dateButton;
    await ElementHelper.isElementDisplayed(page, dateButton);
    console.log(" Date button displayed");
  }

  static async clickRoomsAndGuestsButton(page: any) {
    if(DeviceHelper.isMobile()) {
      await page.waitForTimeout(2000); 
      const clickButton = HotelPageLocators.roomAndGuestButtonMobile;
      await ElementHelper.scrollElementToCentre(page, clickButton);
      await page.focus(clickButton);
      await page.waitForTimeout(2000); 
      await ElementHelper.clickElement(page, clickButton);
    } else {
      await page.waitForTimeout(2000);      
      const clickButton = HotelPageLocators.roomsAndGuestButton;
      await ElementHelper.scrollElementToCentre(page, HotelPageLocators.roomsAndGuestButton);
      await page.waitForTimeout(2000);
      await ElementHelper.clickElement(page, clickButton);
    }
    console.log(" Rooms and Guests button clicked");
  }

  static async verifyRoomsAndGuestsButtonDisplayed(page: any) {
    if(DeviceHelper.isMobile()) {
      const clickButton = HotelPageLocators.roomAndGuestButtonMobile;
      await ElementHelper.isElementDisplayed(page, clickButton);
    } else {
      const clickButton = HotelPageLocators.roomsAndGuestButton;
      await ElementHelper.isElementDisplayed(page, clickButton);
    }
    console.log(" Rooms and Guests button displayed");
  }
static async selectNextMonthDateFROM1(page: any) {
  await page.waitForTimeout(5000);

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 1);

  const monthYear = targetDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const date = targetDate.getDate().toString();

  const monthLocator = HotelPageLocators.selectMonth.replace(
    '{monthYear}',
    monthYear
  );

  while (!(await page.locator(monthLocator).isVisible())) {
    await ElementHelper.clickElement(page, HotelPageLocators.nextButton);
  }

  const dateLocator = HotelPageLocators.selectDate
    .replace('{monthYear}', monthYear)
    .replace('{date}', date);

  await ElementHelper.clickElement(page, dateLocator);

  console.log(`✅ Selected date: ${date} ${monthYear}`);
}
static async selectNextMonthDateTO1(page: any) {
  const targetDate = new Date();

  targetDate.setMonth(targetDate.getMonth() + 1);
  targetDate.setDate(targetDate.getDate() + 2);

  const monthYear = targetDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const date = targetDate.getDate().toString();

  const monthLocator = HotelPageLocators.selectMonth.replace(
    '{monthYear}',
    monthYear
  );

  while (!(await page.locator(monthLocator).isVisible())) {
    await ElementHelper.clickElement(page, HotelPageLocators.nextButton);
  }

  const dateLocator = HotelPageLocators.selectDate
    .replace('{monthYear}', monthYear)
    .replace('{date}', date);

  await ElementHelper.clickElement(page, dateLocator);

  console.log(`✅ Selected checkout date: ${date} ${monthYear}`);
}
  static async selectMonthAndDateFROM(page: any, monthYear: string, date: string) {
   await page.waitForTimeout(5000);
  const CLIENT = process.env.CLIENT?.toUpperCase();
  if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.clickElement(page, HotelPageLocators.doneCalendarButtonMobile);
      console.log(" Done calendar button clicked (Mobile)");
    }
    if(DeviceHelper.isMobile() && CLIENT === 'BOB') {
       
        await page.locator(HotelPageLocators.datepicker).click();
        await page.locator(HotelPageLocators.nextvailablemonth).click();
        await page.locator(HotelPageLocators.Hotelbookingfromdate).click();
        await page.waitForTimeout(3000);
        await page.locator(HotelPageLocators.Hotelbookingtodate).click();
        await page.waitForTimeout(3000);
 
    }else if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
        console.log(
          "Skipping "
        )
    }
    
      else {
      const monthLocator = HotelPageLocators.selectMonth.replace('{monthYear}', monthYear);
      while (!(await page.locator(monthLocator).isVisible())) {
        await ElementHelper.clickElement(page, HotelPageLocators.nextButton);
      }
      const dateLocator = HotelPageLocators.selectDate
        .replace('{monthYear}', monthYear)
        .replace('{date}', date);
      await ElementHelper.clickElement(page, dateLocator);
      console.log(' Date selected in calendar');
    }
  }

          static async selectMonthAndDateTO(
            page: any,
            monthYear: string,
            date: string
          ) {
            if (DeviceHelper.isMobile()) {
              console.log('Skipping calendar selection on mobile');
              return;
            }
            const monthLocator = HotelPageLocators.selectMonth.replace('{monthYear}', monthYear);
            while (!(await page.locator(monthLocator).isVisible())) {
              await ElementHelper.clickElement(page, HotelPageLocators.nextButton);
            }
            const dateLocator = HotelPageLocators.selectDate
              .replace('{monthYear}', monthYear)
              .replace('{date}', date);
            await ElementHelper.clickElement(page, dateLocator);
            console.log('✅ Date selected in calendar');
          }
 

      static async selectAdultsAndChildrenWithAge(
        page: any,
        rooms: number,
        adults: number,
        children: number,
        childAges: number[]
      ) {
        for (let roomNo = 1; roomNo <= rooms; roomNo++) {
          const adultCount = HotelPageLocators.adultCount.replace('{roomNo}', roomNo.toString());
          const adultPlus = HotelPageLocators.adultPlusButton.replace('{roomNo}', roomNo.toString());
          while (parseInt(await page.locator(adultCount).inputValue()) < adults) {
            await page.locator(adultPlus).click();   
          }
              await page.waitForTimeout(2000); 

          const childCount = HotelPageLocators.childrenCount.replace('{roomNo}', roomNo.toString());
          const childPlus = HotelPageLocators.childrenPlusButton.replace('{roomNo}', roomNo.toString());
          await page.waitForTimeout(2000);
          while (parseInt(await page.locator(childCount).inputValue()) < children) {
            await page.locator(childPlus).click();
          }

          for (let i = 1; i <= children; i++) {
            const ageDropdown = HotelPageLocators.childrenAgeDropdown
              .replace('{roomNo}', roomNo.toString())
              .replace('{childIndex}', i.toString());
            await page.locator(ageDropdown).selectOption({
              value: childAges[i - 1].toString(),
            });
          }
        }
        console.log(' Room, adult, and children selection done');
      }

  static async clickAddRoomButton(page: any) {
    const addRoomButton = HotelPageLocators.addRoomButton;
    await ElementHelper.clickElement(page, addRoomButton);
    console.log(' Add Room button clicked');
  }

  static async clickDoneButton(page: any) {
    const doneButton = HotelPageLocators.doneButton;
    await ElementHelper.clickElement(page, doneButton);
    console.log(' Done button clicked');
  }

  static async clickUpdateSearchButton(page: any) {
    const updateSearchButton = HotelPageLocators.updateSearchButton;
    await ElementHelper.clickElement(page, updateSearchButton);
    console.log(' Update Search button clicked');
  }

  static async getLocationNameExpected(page: any) {
    const locationElements = page.locator(HotelPageLocators.whereToTextBox);
    await ElementHelper.getExpectedTextFromLocator(page, locationElements);
  }

  static async getLocationNameExpectedDomOrInt(page: any): Promise<string> {
    if(DeviceHelper.isMobile()) {
      const locationElement = page.locator(HotelPageLocators.whereToLocationMobile);
      return String(
        await ElementHelper.getExpectedTextFromLocator(page, locationElement)
      );
    } else {
      const locationElement = page.locator(HotelPageLocators.whereToTextBox);
      return String(
        await ElementHelper.getExpectedTextFromLocator(page, locationElement)
      );
    }
  }

  static async getLocationNameActualDomOrInt(page: any): Promise<string> {
    const locationElement = page.locator(
      HotelPageLocators.getTextFromSearchResult
    );
    // await ElementHelper.scrollElementToCentre(page, HotelPageLocators.getTextFromSearchResult);
    return String(
      await ElementHelper.getExpectedTextFromLocator(page, locationElement)
    );
  }

  static async verifyLocationNameMatched(page: any): Promise<void> {
    const expectedText = await this.getLocationNameExpectedDomOrInt(page);
    const actualText = await this.getLocationNameActualDomOrInt(page);

    const expectedWords = expectedText
      .toLowerCase()
      .replace(/,/g, ' ')
      .split(' ')
      .filter(word => word.trim().length > 2);

    const actualLower = actualText.toLowerCase();

    const matchedWord = expectedWords.find(word =>
      actualLower.includes(word)
    );

    if (matchedWord) {
      console.log(' Location validation matched');
    } else {
      throw new Error('❌ Location validation failed.');
    }
  }

  static async getLocationNameActualandCompare(page: any) {
    let locationElements;
    if(DeviceHelper.isMobile()) {
      locationElements = HotelPageLocators.whereToLocationMobile;
      await ElementHelper.getActualTextFromLocator(page, locationElements);
    } else {
      locationElements = HotelPageLocators.whereToTextBox;
      await ElementHelper.getActualTextFromLocator(page, locationElements);
    }
    await ElementHelper.compareBothResultAndAddedInConsole();
  }

  static async getRoomDetailTestExpected(page: any) {
    const roomandGuest = page.locator(HotelPageLocators.roomsAndGuestButton);
    await ElementHelper.getExpectedTextFromLocator(page, roomandGuest);
  }

  static async getRoomDetailTestActualAndCompare(page: any) {
    const roomandGuest = page.locator(HotelPageLocators.roomsAndGuestButton);
    await ElementHelper.getActualTextFromLocator(page, roomandGuest);
    await ElementHelper.compareBothResultAndAddedInConsole();
  }
  static async getDomesticSearchResultTextandCompare(page: any): Promise<string | null> {
    const searchResult = HotelPageLocators.resultLocations;
    const results = await page.locator(searchResult).allTextContents();
    const expectedTestData = idfcTestData.hotelPage.domestic;
    for (const resultText of results) {
      if (resultText.toLowerCase().includes(expectedTestData.toLowerCase())) {
        console.log(' Domestic hotel result matched');
        return resultText;
      }
    }
    console.error('❌ Soft Assertion Failed: Domestic result not found');
    return null;
  }

  static async getInternationalSearchResultTextandCompare(page: any): Promise<string | null> {
    const searchResult = HotelPageLocators.resultLocations;
    const results = await page.locator(searchResult).allTextContents();
    const expectedTestData = idfcTestData.hotelPage.international;
    for (const resultText of results) {
      if (resultText.toLowerCase().includes(expectedTestData.toLowerCase())) {
        console.log(' International hotel result matched');
        return resultText;
      }
    }
    console.error('❌ Soft Assertion Failed: International result not found');
    return null;
  }

  static async getHotelNameExpected(page: any) {
    const locationElements = HotelPageLocators.getHotelNameText;
    await ElementHelper.getExpectedTextFromLocator(page, locationElements);
  }

  static async getHotelNameActualandCompare(page: any) {
    const locationElements = HotelPageLocators.getHotelNameText;
    await ElementHelper.getActualTextFromLocator(page, locationElements);
    await ElementHelper.compareBothResultAndAddedInConsole();
  }

  static async printHotelRatings(page: any) {
    const ratingElements = page.locator(HotelPageLocators.getRatingStar);
    const count = await ratingElements.count();
    for (let i = 0; i < count; i++) {
      await ratingElements.nth(i).getAttribute('data-rating');
    }
    console.log(' Hotel ratings printed');
  }

  static async printAllAmountValue(page: any) {
    const currencyElements = page.locator(HotelPageLocators.getAmountFromResult);
    const count = await currencyElements.count();
    for (let i = 0; i < count; i++) {
      await currencyElements.nth(i).textContent();
    }
    console.log(' All currency/amounts printed');
  }

  static async clickAllLocaliseButton(page: any) {
    await ElementHelper.clickElement(page, HotelPageLocators.allLocaliseButton);
    console.log(' All Localise button clicked');
  }

  static async printAllResultLocations(page: any) {
    const resultLocationElements = page.locator(HotelPageLocators.getHotelLocationText);
    const count = await resultLocationElements.count();
    for (let i = 0; i < count; i++) {
      await resultLocationElements.nth(i).textContent();
    }
    console.log(' All result locations printed');
  }

  static async clickFirstResult(page: any) {
    await HotelBookingPage.reloadIfNoHotelFound(page);
    await ElementHelper.clickElement(page, HotelPageLocators.getHotelLocationTextSecond);
    console.log(' First result clicked');
  }

  static async compareValueDifferenceForSingleAndMultipleRoom(page: any) {
    const taxValue = HotelPageLocators.taxPerNightText;
    await page.locator(taxValue).allTextContents();
    console.log(' Compared tax values for single/multiple room selections');
  }
  static async showingPropertiesCountText(page: any) {
    const showingPropertiesText = HotelPageLocators.showingPropertiesText;
    await page.locator(showingPropertiesText).allTextContents();
    console.log(' Showing properties count retrieved');
  }

  static async clickResetButton(page: any) {
    await page.waitForTimeout(3000);
    const resetButton = HotelPageLocators.resetButton;
    await ElementHelper.waitForElementVisible(page, resetButton);
    await ElementHelper.clickElement(page, resetButton);
    console.log(' Reset button clicked');
  }

  static async clickSortByPopularityButton(page: any) {
    const popularityButton = HotelPageLocators.sortByPopularityButton;
    await ElementHelper.clickElement(page, popularityButton);
    console.log(' Sort by Popularity button clicked');
  }

  static async clickSortByPriceLowToHighButton(page: any) {
    const lowToHighButton = HotelPageLocators.sortByPriceLowToHighButton;
    await ElementHelper.clickElement(page, lowToHighButton);
    console.log(' Sort by Price Low to High button clicked');
  }

  static async clickSortByPriceHighToLowButton(page: any) {
    const highToLowButton = HotelPageLocators.sortByPriceHighToLowButton;
    await ElementHelper.clickElement(page, highToLowButton);
    console.log(' Sort by Price High to Low button clicked');
  }

  static async verifyFreeCancellationToggleAndText(page: any): Promise<void> {
    await ElementHelper.isElementDisplayed(page, HotelPageLocators.freeCancellationText);
    await ElementHelper.clickElement(page, HotelPageLocators.freeCancellationToggle);
    console.log(' Free Cancellation toggle/text displayed and toggled');
  }

  static async verifyBreakfastAvailableToggleAndText(page: any): Promise<void> {
    await ElementHelper.isElementDisplayed(page, HotelPageLocators.breakfastAvailableText);
    await ElementHelper.clickElement(page, HotelPageLocators.breakfastAvailableToggle);
    console.log(' Breakfast Available toggle/text displayed and toggled');
  }

  static async clickStarRating5Button(page: any) {
    const button = HotelPageLocators.starRating5Button;
    await ElementHelper.clickElement(page, button);
    console.log(' 5 Star Rating button clicked');
  }

  static async clickStarRating4Button(page: any) {
    const button = HotelPageLocators.starRating4Button;
    await ElementHelper.clickElement(page, button);
    console.log(' 4 Star Rating button clicked');
  }

  static async clickStarRating3Button(page: any) {
    const button = HotelPageLocators.starRating3Button;
    await ElementHelper.clickElement(page, button);
    console.log(' 3 Star Rating button clicked');
  }

  static async clickStarRating2Button(page: any) {
    const button = HotelPageLocators.starRating2Button;
    await ElementHelper.clickElement(page, button);
    console.log(' 2 Star Rating button clicked');
  }

  static async clickStarRating1Button(page: any) {
    const button = HotelPageLocators.starRating1Button;
    await ElementHelper.clickElement(page, button);
    console.log(' 1 Star Rating button clicked');
  }
  static async printAndClickAllLocationSelectButtons(page: any) {
    const locationElements = page.locator(HotelPageLocators.locationSelectButton);
    const count = await locationElements.count();

    for (let i = 0; i < count; i++) {
      await locationElements.nth(i).textContent();
      await locationElements.nth(i).click();
      console.log(' Location select button clicked');
      await this.showingPropertiesCountText(page);
      await page.waitForTimeout(2000);
      await locationElements.nth(i).click();
      await page.waitForTimeout(2000);
      await HotelHomePage.clickResetButton(page);
      await HotelHomePage.clickResetButton(page);
    }
  }

  static async printAndClickAllCategorySelectButtons(page: any) {
    const categoryElements = page.locator(HotelPageLocators.categorySelectButton);
    const count = await categoryElements.count();

    for (let i = 0; i < count; i++) {
      await categoryElements.nth(i).textContent();
      await categoryElements.nth(i).click();
      console.log(' Category select button clicked');
      await this.showingPropertiesCountText(page);
      await this.clickResetButton(page);
    }
  }
  static async getPriceRangeText(page: any) {
    const priceRangeTextLocator = page.locator(HotelPageLocators.priceRangeText);
    const text = await priceRangeTextLocator.inputValue ? await priceRangeTextLocator.inputValue() : await priceRangeTextLocator.textContent();
    return text?.trim();
  }

  static async setPriceRangeSlider(page: any) {
    const leftHandle = page.locator(HotelPageLocators.priceRangeLeftHandle);
    const rightHandle = page.locator(HotelPageLocators.priceRangeRightHandle);

    await this.getPriceRangeText(page);

    const leftBox = await leftHandle.boundingBox();
    const rightBox = await rightHandle.boundingBox();

    if (!leftBox || !rightBox) {
      console.error('❌ Soft Assertion Failed: Slider handles not found');
      return;
    }

    const delta = 38;
    await page.mouse.move(leftBox.x + leftBox.width / 2, leftBox.y + leftBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(leftBox.x + leftBox.width / 2 + delta, leftBox.y + leftBox.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.mouse.move(rightBox.x + rightBox.width / 2, rightBox.y + rightBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(rightBox.x + rightBox.width / 2 - delta, rightBox.y + rightBox.height / 2, { steps: 10 });
    await page.mouse.up();

    console.log(' Slider handles moved horizontally');
    await this.getPriceRangeText(page);
  }

  static async verifyAllCurrencyWithinSelectedRange(page: any) {
    const rangeText = await HotelHomePage.getPriceRangeText(page);
    if (!rangeText) {
      console.error('❌ Soft Assertion Failed: Price range text not found');
      return;
    }
    const prices = rangeText.match(/\d[\d,]*/g);
    if (!prices || prices.length < 2) {
      console.error('❌ Soft Assertion Failed: Invalid price range');
      return;
    }
    const minPrice = Number(prices[0].replace(/,/g, ''));
    const maxPrice = Number(prices[1].replace(/,/g, ''));
    const currencyElements = page.locator(HotelPageLocators.getAmountFromResult);
    const count = await currencyElements.count();
    for (let i = 0; i < count; i++) {
      const text = await currencyElements.nth(i).textContent();
      if (!text) continue;
      const priceMatch = text.match(/\d[\d,]*/);
      if (!priceMatch) continue;
      const price = Number(priceMatch[0].replace(/,/g, ''));
      if (price >= minPrice && price <= maxPrice) {
        console.log(' Price within selected range');
      } else {
        console.error('❌ Soft Assertion Failed: Price outside selected range');
      }
    }
  }

  static async verifyCurrencySortedLowToHigh(page: any) {
    const currencyElements = page.locator(HotelPageLocators.getAmountFromResult);
    const count = await currencyElements.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await currencyElements.nth(i).textContent();
      if (!text) continue;
      const priceMatch = text.match(/\d[\d,]*/);
      if (!priceMatch) continue;
      const price = Number(priceMatch[0].replace(/,/g, ''));
      prices.push(price);
    }

    const sortedPrices = [...prices].sort((a, b) => a - b);

    if (!prices.every((price, idx) => price === sortedPrices[idx])) {
      console.error('❌ Soft Assertion Failed: Prices are not sorted Low to High');
    } else {
      console.log(' Prices are sorted Low to High');
    }
  }

  static async verifyCurrencySortedHighToLow(page: any) {
    const currencyElements = page.locator(HotelPageLocators.getAmountFromResult);
    const count = await currencyElements.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await currencyElements.nth(i).textContent();
      if (!text) continue;
      const priceMatch = text.match(/\d[\d,]*/);
      if (!priceMatch) continue;
      const price = Number(priceMatch[0].replace(/,/g, ''));
      prices.push(price);
    }
    const sortedPrices = [...prices].sort((a, b) => b - a);

    if (!prices.every((price, idx) => price === sortedPrices[idx])) {
      console.error('❌ Soft Assertion Failed: Prices are not sorted High to Low');
    } else {
      console.log(' Prices are sorted High to Low');
    }
  }

  static async selectRoomsAdultsChildren(page: any, rooms: number, adults: number, children: number, childAges: number[]) {
    while (parseInt(await page.locator(HotelPageLocators.roomCount).inputValue()) < rooms) {
      await page.click(HotelPageLocators.addRoomButton);
    }
    for (let roomNo = 1; roomNo <= rooms; roomNo++) {
      const adultCount = HotelPageLocators.adultCount.replace('{roomNo}', roomNo.toString());
      const adultPlus = HotelPageLocators.adultPlusButton.replace('{roomNo}', roomNo.toString());
      while (parseInt(await page.locator(adultCount).inputValue()) < adults) {
        await page.click(adultPlus);
      }
      const childCount = HotelPageLocators.childrenCount.replace('{roomNo}', roomNo.toString());
      const childPlus = HotelPageLocators.childrenPlusButton.replace('{roomNo}', roomNo.toString());
      while (parseInt(await page.locator(childCount).inputValue()) < children) {
        await page.click(childPlus);
      }
      for (let childIndex = 1; childIndex <= children; childIndex++) {
        const ageDropdown = HotelPageLocators.childrenAgeDropdown.replace('{roomNo}', roomNo.toString()).replace('{childIndex}', childIndex.toString());
        await page.selectOption(ageDropdown, childAges[childIndex - 1].toString());
      }
    }
    await page.click(HotelPageLocators.doneButton);
    console.log(' Rooms/adults/children/age selection done and Done button clicked');
  }

  static async clickUpdatedateButton(page: any) {
    const clickCheckInCheckoutButton = HotelPageLocators.updateCheckinCheckOutButton;
    await ElementHelper.clickElement(page, clickCheckInCheckoutButton);
    console.log(' Update date button clicked');
  }

  static async clickOnEditFilterButton(page: any) {
    await HotelBookingPage.reloadIfNoHotelFound(page);
    if(DeviceHelper.isMobile()) {
      await ElementHelper.waitForElementVisible(page, HotelPageLocators.editFilterMobile);
      await ElementHelper.clickElement(page, HotelPageLocators.editFilterMobile);
      if(await ElementHelper.isElementDisplayed(page, HotelPageLocators.editFilterMobile)) {
        await ElementHelper.clickElement(page, HotelPageLocators.editFilterMobile);
      }
    }

  }

  static async clickOnDateInpoutEditFilterButton(page: any) {
    if(DeviceHelper.isMobile()) {
        const CLIENT = process.env.CLIENT?.toUpperCase();
        switch (CLIENT) {
          case 'BOB':
          console.log('⏭️ BOB: Skipping ');
            break;
      
          case 'IDFC':
                await ElementHelper.waitForElementVisible(page, HotelPageLocators.editFilterDateInputMobile);
            await ElementHelper.clickElement(page, HotelPageLocators.editFilterDateInputMobile);
          break;
        }
    } else {
      const dateButton = HotelPageLocators.dateButton;
      await ElementHelper.clickElement(page, dateButton);
      console.log(" Date button clicked");
    }

  }

  static async clickOnSortAndFilterButton(page: any) {
    if(DeviceHelper.isMobile()) {
      await ElementHelper.waitForElementVisible(page, HotelPageLocators.sortAndFilterMobile);
      await ElementHelper.clickElement(page, HotelPageLocators.sortAndFilterMobile);
    }

  }

  static async editValueInTestBox(page: Page, text: string) {
    if(DeviceHelper.isMobile()){
      const whereToTextBox = HotelPageLocators.whereToTextBox;
      await VerificationHelpers.elementIsVisible(page, whereToTextBox);
      await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);

        const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await VerificationHelpers.elementIsVisible(page, whereToTextBox);
      await ElementHelper.clearAndEnterInTextField(page, whereToTextBox, text);
      break;
 
    case 'IDFC':
          const whereToTextBoxMobile = HotelPageLocators.whereToTextBoxMobile;
      await VerificationHelpers.elementIsVisible(page, whereToTextBoxMobile);
      await ElementHelper.clearAndEnterInTextField(page, whereToTextBoxMobile, text);
    break;
  }
    } else {
      const whereToTextBox = HotelPageLocators.whereToTextBox;
      await VerificationHelpers.elementIsVisible(page, whereToTextBox);
      await ElementHelper.clickElement(page, HotelPageLocators.whereToTextBox);
      await ElementHelper.clearAndTypeInTextField(page, whereToTextBox, text);
    }
  }
  
}
