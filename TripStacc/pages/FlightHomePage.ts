import { expect, Locator, Page } from '@playwright/test';
import { FlightPageLocators } from '../../TripStacc/locators/FlightPageLocators';
import { VerificationHelpers } from '../../utils/verificationHelper';
import { ElementHelper } from '../../utils/elementHelper';
import { CommonHelper } from '../../utils/commonHelper';
import { DeviceHelper } from '../../utils/deviceHelper';
import { HomePageLocators } from '../locators/HomePageLocators';

export class FlightHomePage {
  static selectedMobileNo: any;
  static selectedFromCity: string;
  static selectedToCity: string;

  
  static async verifyFromCitySuggestionsMatch(page: Page, enteredText: string) {
    this.selectedFromCity = await this.verifyCitySuggestionsMatch(page, FlightPageLocators.fromCitySuggestions, enteredText, 'Origin');
  }

  static async verifyToCitySuggestionsMatch(page: Page, enteredText: string) {
    this.selectedToCity = await this.verifyCitySuggestionsMatch(page, FlightPageLocators.toCitySuggestions, enteredText, 'Destination');
  }

  static async verifyFromFieldPopulatedWithSelectedCity(page: Page) {
    await this.verifyCityFieldPopulated(page, FlightPageLocators.fromCity, FlightPageLocators.fromCityDropdown, this.selectedFromCity, 'From');
  }

  static async verifyToFieldPopulatedWithSelectedCity(page: Page) {
    await this.verifyCityFieldPopulated(page, FlightPageLocators.toCity, FlightPageLocators.toCityDropdown, this.selectedToCity, 'To');
  }

  static async verifyCitySuggestionsMatch(page: Page, suggestionsLocator: string, enteredText: string, label: string): Promise<string> {
    if (DeviceHelper.isMobile()) {
      console.log(`Mobile: skipping ${label} suggestion text check (desktop autocomplete only)`);
      return '';
    }
    const suggestions = page.locator(suggestionsLocator);
    await expect(suggestions.first(), `${label} suggestions should appear`).toBeVisible({ timeout: 30000 });
    expect(await suggestions.count(), `${label} should have at least one suggestion`).toBeGreaterThan(0);
    const firstSuggestion = (await suggestions.first().innerText()).trim();
    expect(firstSuggestion.toLowerCase(), `First ${label} suggestion should contain "${enteredText}"`).toContain(enteredText.toLowerCase());
    console.log(`${label} suggestions (${await suggestions.count()}), first: ${firstSuggestion}`);
    return firstSuggestion;
  }

  static async verifyCityFieldPopulated(page: Page, fieldLocator: string, dropdownLocator: string, expectedCity: string, label: string) {
    if (DeviceHelper.isMobile()) {
      console.log(`Mobile: skipping ${label} field value check (desktop autocomplete only)`);
      return;
    }
    await expect(page.locator(fieldLocator), `${label} field should contain the selected city`).toHaveValue(expectedCity, { timeout: 10000 });
    await expect(page.locator(dropdownLocator), `${label} suggestions should close after selection`).toBeHidden({ timeout: 10000 });
    console.log(`${label} field populated with: ${expectedCity}`);
  }
  static async clickOnRoundTripOption(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.roundtripbox);
  }
 static async clickOnCityFromAirport(page: any) {
    await page.waitForTimeout(10000);
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
      await page.waitForTimeout(5000);
      await ElementHelper.clickElement(page, FlightPageLocators.fromCityMobile);
      await ElementHelper.clickElement(page, FlightPageLocators.fromCitySearchMobile);
    } else {
      await page.waitForTimeout(5000);
      await ElementHelper.clickElement(page, FlightPageLocators.fromCity);
    }
  }
 

  static async clickOnToAirport(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
      await ElementHelper.clickElement(page, FlightPageLocators.toCitySearchMobile);
    } else {
      await ElementHelper.clickElement(page, FlightPageLocators.toCity);
    }
  }

  static async verifyCardSelectionPopupVisible(page: Page): Promise<void> {

  const popup = page.locator(HomePageLocators.cardPopup);

  await expect(popup).toBeVisible();

  console.log('Card selection popup is visible');
}
static async selectCard(page: Page): Promise<void> {

  const firstCard = page.locator(HomePageLocators.cardOption).first();
  const continueButton = page.locator(HomePageLocators.continueButton);

  await expect(firstCard).toBeVisible();

  await firstCard.click();

  await ElementHelper.waitForElementVisible(page, HomePageLocators.continueButton);
  await expect(continueButton).toBeEnabled({ timeout: 10000 });
  await continueButton.focus();
  await page.waitForTimeout(200); // Wait for 2 seconds before clicking
  await continueButton.click();
  await page.waitForTimeout(200);
  await ElementHelper.waitForElementToDisappear(page, HomePageLocators.cardPopup);
  console.log('✅ Card selected and continue clicked');
}

static async verifyPopupClosed(page: Page): Promise<void> {
  await ElementHelper.waitForElementToDisappear(page, HomePageLocators.cardPopup);
  console.log('Card selection popup closed successfully');
}
  static async EnterCityFromAirport(page: any, data: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.fromCitySearchMobile, data);
    } else {
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.fromCity, data);
    }
  }

    static async EnterCityToAirport(page: any, data: any) {
      const CLIENT = process.env.CLIENT?.toUpperCase();
      if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.toCitySearchMobile, data);
    } else {
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.toCity, data);
    }
  }
     static async clickOnOneway(page:Page) {
     await ElementHelper.clickElement(page, FlightPageLocators.onewaybox)
  }

 
    static async VerifyFromAirpotDropdownVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC'){
      await page.waitForTimeout(1000);
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.cityDropDownMobile);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.cityDropDownMobile);
    } else {
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.fromCityDropdown);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.fromCityDropdown);
    }
  }

static async VerifyToAirpotDropdownVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.firstSearchResultCityDropDownMobile);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.firstSearchResultCityDropDownMobile);
    } else {
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.toCityDropdown);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.toCityDropdown);
    }
  }

static async clickOnFirstSearchResultfromCityDropdown(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.clickElement(page, FlightPageLocators.firstSearchResultCityDropDownMobile);
    } else {
      await ElementHelper.clickElement(page, FlightPageLocators.firstSearchResultfromCityDropdown);
    }
  }


    static async clickOnfirstSearchResultToCityDropdown(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.clickElement(page, FlightPageLocators.firstSearchResultCityDropDownMobile);
    } else {
      await ElementHelper.clickElement(page, FlightPageLocators.firstSearchResulttoCityDropdown);
    }
  }

  // Airports the results page treats as the same city ("Hide nearby airports" filter), e.g. a BOM search can return NMI flights
  static readonly NEARBY_AIRPORTS: string[][] = [
    ['BOM', 'NMI'], // Mumbai, Navi Mumbai
  ];

  static getSameCityAirports(code: string): string[] {
    return this.NEARBY_AIRPORTS.find(group => group.includes(code)) || [code];
  }

static async verifyRoute(page: Page, from: string, to: string) {
  const card = page.locator(FlightPageLocators.firstFlightCard);
  for (const [label, code] of [['From', from], ['To', to]]) {
    const airports = this.getSameCityAirports(code);
    await expect(card, `First flight card should show ${label} airport ${airports.join(' or ')}`)
      .toContainText(new RegExp(`\\b(${airports.join('|')})\\b`), { timeout: 10000 });
  }
}

  static async verifyFlightResultCardsList(page: Page, cardsToCheck: number = 5) {
    // Visible only: the inactive trip tab (e.g. return leg) keeps its cards in the DOM
    const cards = page.locator(FlightPageLocators.flightResultCards).filter({ visible: true });
    await expect(cards.first(), 'At least one flight result card should be displayed').toBeVisible({ timeout: 60000 });
    const count = await cards.count();
    console.log(`Flight result cards displayed: ${count}`);

    const fromCode = this.getAirportCode(this.selectedFromCity);
    const toCode = this.getAirportCode(this.selectedToCity);

    for (let i = 0; i < Math.min(count, cardsToCheck); i++) {
      const card = cards.nth(i);
      const label = `Flight card ${i + 1}`;
      // Flight number, e.g. "IX-1347" / "6E 123" (airline code has at least one letter, so prices don't match)
      await expect(card, `${label} should show a flight number`).toContainText(/\b(?:[A-Z]{2}|[A-Z]\d|\d[A-Z])[- ]?\d{1,5}\b/);
      await expect(card, `${label} should show a price`).toContainText(/₹\s*\d[\d,]*/);
      const times = (await card.innerText()).match(/\b\d{1,2}:\d{2}\b/g) || [];
      expect(times.length, `${label} should show departure and arrival times`).toBeGreaterThanOrEqual(2);
      if (fromCode && toCode) {
        for (const [side, code] of [['From', fromCode], ['To', toCode]]) {
          const airports = this.getSameCityAirports(code);
          await expect(card, `${label} should show ${side} airport ${airports.join(' or ')}`).toContainText(new RegExp(`\\b(${airports.join('|')})\\b`));
        }
      }
      console.log(`${label} OK: ${times[0]} -> ${times[1]}`);
    }

    // One card per flight/fare: data-key identifies the flight/fare a card represents
    const keys = await cards.evaluateAll(els => els.map(el => el.getAttribute('data-key') || ''));
    if (keys.some(key => !key)) {
      console.log('Skipping duplicate check: flight cards have no data-key attribute');
      return;
    }
    const duplicates = [...new Set(keys.filter((key, i) => keys.indexOf(key) !== i))];
    expect(duplicates, 'Each flight/fare should be displayed in exactly one card (duplicate data-key)').toEqual([]);
    console.log(`All ${keys.length} flight cards are unique`);
  }

  // Reads the From/To values right before a search, so later checks don't rely on cities captured by an earlier test
  static async captureSelectedCitiesFromSearchForm(page: Page) {
    if (DeviceHelper.isMobile()) {
      this.selectedFromCity = '';
      this.selectedToCity = '';
      console.log('Mobile: skipping capture of selected cities (desktop search form only)');
      return;
    }
    this.selectedFromCity = (await page.locator(FlightPageLocators.fromCity).inputValue()).trim();
    this.selectedToCity = (await page.locator(FlightPageLocators.toCity).inputValue()).trim();
    console.log(`Searching From: "${this.selectedFromCity}" To: "${this.selectedToCity}"`);
  }

 
  static parseFlightCard(text: string) {
    const flightNo = text.match(/\b(?:[A-Z]{2}|[A-Z]\d|\d[A-Z])[- ]?\d{1,5}\b/);
    const airline = flightNo
      ? text.slice(0, flightNo.index).replace(/^\s*Select\b/i, '').split('\n').map(s => s.trim()).filter(Boolean).pop()
      : undefined;
    const times = text.match(/\b\d{1,2}:\d{2}\b/g) || [];
    const hm = text.match(/\b(\d{1,2})\s*h(?:rs?)?(?:\s*(\d{1,2})\s*m(?:in)?)?\b/i);
    const mOnly = hm ? null : text.match(/\b(\d{1,2})\s*m(?:in)?\b/i);
    const durationMinutes = hm ? Number(hm[1]) * 60 + Number(hm[2] || 0) : mOnly ? Number(mOnly[1]) : undefined;
    const stopsMatch = text.match(/\bnon[- ]?stop\b|\b(\d+)\s*stops?\b/i);
    const stops = stopsMatch ? (stopsMatch[1] ? Number(stopsMatch[1]) : 0) : undefined;
    const price = text.match(/₹\s*(\d[\d,]*)/);
    return {
      airline,
      flightNumber: flightNo?.[0],
      departureTime: times[0],
      arrivalTime: times[1],
      durationMinutes,
      durationText: (hm || mOnly)?.[0],
      stops,
      stopsText: stopsMatch?.[0],
      price: price ? Number(price[1].replace(/,/g, '')) : undefined,
    };
  }

  static async verifyFlightCardsShowKeyDetails(page: Page, cardsToCheck: number = 5) {
    const cards = page.locator(FlightPageLocators.flightResultCards).filter({ visible: true });
    await expect(cards.first(), 'At least one flight result card should be displayed').toBeVisible({ timeout: 60000 });
    const count = Math.min(await cards.count(), cardsToCheck);

    const fromCode = this.getAirportCode(this.selectedFromCity);
    const toCode = this.getAirportCode(this.selectedToCity);
    const toMinutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };

    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).innerText();
      const card = this.parseFlightCard(text);
      const label = `Flight card ${i + 1}`;
      const detail = `${label} text: ${text.replace(/\s+/g, ' ').trim()}`;

     
      expect(card.airline, `${label} should show airline name. ${detail}`).toMatch(/[A-Za-z]{2,}/);
      expect(card.flightNumber, `${label} should show flight number. ${detail}`).toBeTruthy();

      expect(card.departureTime, `${label} should show departure time. ${detail}`).toBeTruthy();
      expect(card.arrivalTime, `${label} should show arrival time. ${detail}`).toBeTruthy();
      if (fromCode && toCode) {
        const originAt = text.search(new RegExp(`\\b(${this.getSameCityAirports(fromCode).join('|')})\\b`));
        const destinationAt = text.search(new RegExp(`\\b(${this.getSameCityAirports(toCode).join('|')})\\b`));
        expect(originAt, `${label} should show origin ${this.getSameCityAirports(fromCode).join(' or ')}. ${detail}`).toBeGreaterThanOrEqual(0);
        expect(destinationAt, `${label} should show destination ${this.getSameCityAirports(toCode).join(' or ')}. ${detail}`).toBeGreaterThanOrEqual(0);
        expect(originAt, `${label} should show origin before destination. ${detail}`).toBeLessThan(destinationAt);
      }

     
      expect(card.durationMinutes, `${label} should show total duration. ${detail}`).toBeGreaterThan(0);
      expect(card.stops, `${label} should show stop information (Non-Stop / n Stop). ${detail}`).toBeDefined();
      const elapsed = (toMinutes(card.arrivalTime!) - toMinutes(card.departureTime!) + 1440) % 1440;
      expect(elapsed, `${label} duration ${card.durationText} should match ${card.departureTime} -> ${card.arrivalTime}. ${detail}`).toBe(card.durationMinutes! % 1440);

  
      expect(card.price, `${label} should show a price greater than 0. ${detail}`).toBeGreaterThan(0);

      console.log(`${label} OK: ${card.airline} ${card.flightNumber} | ${card.departureTime} -> ${card.arrivalTime} | ${card.durationText} | ${card.stopsText} | ₹${card.price}`);
    }
  }

  // Fare type tag on a flight card, e.g. "REFUNDABLE" badge -> "Refundable"
  static getFareTypeTag(text: string): string | undefined {
    const tag = text.match(/\b(?:non[- ]?refundable|partially[- ]refundable|refundable)\b/i)?.[0];
    if (!tag) return undefined;
    if (/^non/i.test(tag)) return 'Non-Refundable';
    if (/^partially/i.test(tag)) return 'Partially Refundable';
    return 'Refundable';
  }

  static async verifyFlightCardsShowFareType(page: Page, cardsToCheck: number = 5) {
    // Visible only: on round trip the inactive leg's cards stay in the DOM
    const cards = page.locator(FlightPageLocators.flightResultCards).filter({ visible: true });
    await expect(cards.first(), 'At least one flight result card should be displayed').toBeVisible({ timeout: 60000 });
    const count = Math.min(await cards.count(), cardsToCheck);

    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).innerText();
      const fareType = this.getFareTypeTag(text);
      expect(fareType, `Flight card ${i + 1} should display a fare type tag (Refundable / Non-Refundable). Card text: ${text.replace(/\s+/g, ' ').trim()}`).toBeTruthy();
      console.log(`Flight card ${i + 1} fare type: ${fareType}`);
    }
  }

  // Flight number and price of a round trip result row, from its hidden .filter_data element
  static async getRoundTripRowDetails(row: Locator) {
    const data = row.locator('.filter_data').first();
    return {
      flightNumber: (await data.getAttribute('data-flightnumber'))?.trim() || '',
      price: Number(await data.getAttribute('data-price')),
    };
  }

  static async selectReturnFlightAndVerifyFareSummary(page: Page) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if (CLIENT !== 'IDFC') {
      console.log(`${CLIENT}: Skipping return flight selection verification (IDFC round trip layout only).`);
      return;
    }

    const onwardSelected = page.locator(FlightPageLocators.roundTripSelectedRow(1));
    await expect(onwardSelected, 'Exactly one onward flight should be selected').toHaveCount(1, { timeout: 30000 });
    const onward = await this.getRoundTripRowDetails(onwardSelected);

    // Narrow layouts show one leg at a time behind tabs; wide layouts show both columns
    const returnTab = page.locator(FlightPageLocators.roundTripTab('return'));
    if (await returnTab.isVisible()) {
      await returnTab.click();
      await expect(returnTab, 'Return tab should be active after clicking it').toHaveClass(/\bactive\b/);
    }
    const returnColumn = page.locator(FlightPageLocators.roundTripResultColumn(2));
    await expect(returnColumn, 'Return flights should be displayed').toBeVisible({ timeout: 30000 });

    // Pick a return flight that is not already selected, preferring a different price so the total visibly changes
    const previousReturn = await this.getRoundTripRowDetails(page.locator(FlightPageLocators.roundTripSelectedRow(2)).first());
    const returnRows = page.locator(FlightPageLocators.roundTripResultRows(2)).filter({ visible: true });
    const rowCount = await returnRows.count();
    let target: Locator | undefined;
    for (let i = 0; i < rowCount; i++) {
      const row = returnRows.nth(i);
      if (/\buser_clicked\b/.test((await row.getAttribute('class')) || '')) continue;
      target = target || row;
      if ((await this.getRoundTripRowDetails(row)).price !== previousReturn.price) { target = row; break; }
    }
    expect(target, `Need a second return flight to select (found ${rowCount} return flights)`).toBeDefined();
    const selected = await this.getRoundTripRowDetails(target!);
    await target!.locator('.flightcardinner').first().click();

    // Highlighted: the clicked row is the one and only selected return flight
    await expect(target!, `Selected return flight ${selected.flightNumber} should be highlighted`).toHaveClass(/\buser_clicked\b.*\bactive\b|\bactive\b.*\buser_clicked\b/, { timeout: 10000 });
    await expect(page.locator(FlightPageLocators.roundTripSelectedRow(2)), 'Exactly one return flight should be selected').toHaveCount(1);
    await expect(onwardSelected, 'Onward selection should stay unchanged').toHaveCount(1);
    expect((await this.getRoundTripRowDetails(onwardSelected)).flightNumber, 'Onward selection should stay unchanged').toBe(onward.flightNumber);

    // Fare summary: footer total = onward fare + selected return fare
    const expectedTotal = onward.price + selected.price;
    const footerTotal = page.locator(FlightPageLocators.roundTripFooterTotal);
    await expect(footerTotal, `Fare summary total should be onward ₹${onward.price} + return ₹${selected.price}`).toHaveAttribute('data-total_price', String(expectedTotal), { timeout: 10000 });
    await expect(footerTotal, 'Fare summary should display the updated total').toContainText(expectedTotal.toLocaleString('en-IN'));

    console.log(`Selected return ${selected.flightNumber} (₹${selected.price}) with onward ${onward.flightNumber} (₹${onward.price}); fare summary total ₹${expectedTotal}`);
  }

  static getAirportCode(cityText: string | undefined): string | undefined {
    return cityText?.match(/\(([A-Z]{3})\)/)?.[1];
  }

  static async verifyNavigatedToFlightSearchResults(page: Page, searchFormUrl: string) {
    await expect(page, 'Search should navigate away from the flight search form').not.toHaveURL(searchFormUrl, { timeout: 60000 });
    await expect(page.locator(FlightPageLocators.firstFlightCard), 'Flight search results should load').toBeVisible({ timeout: 60000 });

   
    const fromCode = this.getAirportCode(this.selectedFromCity);
    const toCode = this.getAirportCode(this.selectedToCity);
    if (!fromCode || !toCode) {
      console.log(`Skipping route check: entered airports not captured (From: "${this.selectedFromCity}", To: "${this.selectedToCity}")`);
      return;
    }
    await this.verifyRoute(page, fromCode, toCode);
    console.log(`Navigated to Flight Search Results (${page.url()}) for route ${fromCode} -> ${toCode}`);
  }
 
 static async clickOnDepartureDate(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.departureDateMobile);
      await ElementHelper.clickElement(page, FlightPageLocators.departureDateMobile);
    } else {
      await ElementHelper.clickElement(page, FlightPageLocators.departureDate);
    }
  }

static async clickOnReturnDate(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      await ElementHelper.clickElement(page, FlightPageLocators.returnDateMobile);
    } else {
      await ElementHelper.clickElement(page, FlightPageLocators.returnDate);
    }
  }

  static async selectTomorrowDateForDeparture(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      const depDate = new Date();
      depDate.setDate(depDate.getDate() + 2);
      const depFormatted = depDate.toISOString().split('T')[0];
 
      await ElementHelper.clickElement(page, FlightPageLocators.dateCellMobile(depFormatted));
      await page.waitForTimeout(10000);
 
      const retDate = new Date();
      retDate.setDate(retDate.getDate() + 5);
      const retFormatted = retDate.toISOString().split('T')[0];
 
      await ElementHelper.clickElement(page, FlightPageLocators.dateCellMobile(retFormatted));
      await page.waitForTimeout(2000);
     
      await ElementHelper.clickElement(page, FlightPageLocators.doneCalendarButtonMobile);
 
    } else {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 2);
      const formattedDate = targetDate.toISOString().split('T')[0];
 
      const targetDay = targetDate.getDate().toString();
      const targetMonth = targetDate.toLocaleString('en-US', { month: 'long' });
      const targetYear = targetDate.getFullYear().toString();
 
      const currentMonth = await page.locator(FlightPageLocators.currentMonth).textContent();
      const currentYear = await page.locator(FlightPageLocators.currentYear).textContent();
 
      if (
        currentMonth?.trim() !== targetMonth || currentYear?.trim() !== targetYear
      ) {
        await page.locator(FlightPageLocators.nextMonthButton).click();
      }
 
      await page.locator(FlightPageLocators.dateCell(targetDay)).click();
    }
  }

  static async select2dayDateForReturn(page: any) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 20);
    const formattedDate = targetDate.toISOString().split('T')[0];
    const CLIENT = process.env.CLIENT?.toUpperCase();
    if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
      const mobileLocator = FlightPageLocators.dateCellMobile(formattedDate);
      await page.waitForTimeout(5000);
      await ElementHelper.clickElement(page, mobileLocator);
      await page.waitForTimeout(2000);
 
      await ElementHelper.clickElement(page, FlightPageLocators.doneCalendarButtonMobile);
 
    } else {
      const targetDay = targetDate.getDate().toString();
      const targetMonth = targetDate.toLocaleString('en-US', { month: 'long' });
      const targetYear = targetDate.getFullYear().toString();
 
      const currentMonth = await page.locator(FlightPageLocators.currentMonth).textContent();
      const currentYear = await page.locator(FlightPageLocators.currentYear).textContent();
 
      if (
        currentMonth?.trim() !== targetMonth || currentYear?.trim() !== targetYear
      ) {
        await page.locator(FlightPageLocators.nextMonthButton).click();
      }
 
      await page.locator(FlightPageLocators.dateCell(targetDay)).click();
    }
  }

 static async clickOntravellersAndCabinClass(page: any) {
   if (DeviceHelper.isMobile()) 
    {
      return
   }
    await ElementHelper.clickElement(page, FlightPageLocators.travellersAndCabinClass);
 
  }
   static async clickOntravellersAndCabinClasses(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.travellersAndCabinClass);
 
  }

  static async VerifytravellersAndCabinClassDropdownVisible(page: any) {
    if (DeviceHelper.isMobile())
    {
      return
   }
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.roomCountDropdown);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.roomCountDropdown);
    // The traveller count is tied to the account on the server, not local browser state, so an earlier
    // test's unreset passenger count (e.g. SC_003.03) otherwise carries over into whichever test runs next
    // and compounds across a full suite run until it exceeds the product's 9-passenger search limit.
    await this.resetTravellersToOneAdult(page);
  }

 static async clickOnCloseTravellersAndCabinClassDropdown(page: any) {
    // const CLIENT = process.env.CLIENT?.toUpperCase();
    // if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
    //   await page.waitForTimeout(5000);
    //   await ElementHelper.clickElement(page, FlightPageLocators.closeTravellerAndCabinButtonMobile);
    // }
    // if(DeviceHelper.isMobile() && CLIENT === 'BOB') {
    //   await page.waitForTimeout(5000);
    //   await ElementHelper.clickElement(page, FlightPageLocators.doneTravellerAndCabinButtonMobile);
    // }
    if (DeviceHelper.isMobile())
    {
      return
   }
    // Apply may or may not close the panel itself; close it via the toggle if it's still open
    if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.roomCountDropdown)) {
      await ElementHelper.clickElement(page, FlightPageLocators.travellersAndCabinClass);
    }
  }
 
static async verifyFlightSearchFields(page: any) {
  await expect(page.locator(FlightPageLocators.fromCity)).toBeVisible();
  await expect(page.locator(FlightPageLocators.toCity)).toBeVisible();
  await expect(page.locator(FlightPageLocators.departureDate)).toBeVisible();
  await expect(page.locator(FlightPageLocators.returnDate)).toBeVisible();
  await expect(page.locator(FlightPageLocators.travellersAndCabinClass)).toBeVisible();

  console.log('All search fields visible');
}


static async verifyCityEntered(page: Page, locator: string, value: string) {
  await expect(page.locator(locator)).toHaveValue(value);
}

static async verifyDateSelected(page: Page) {
  const value = await page.locator(FlightPageLocators.departureDate).inputValue();
  expect(value).not.toBe('');
}
static async verifyTravellerOptions(page: Page) {
  await expect(page.locator(FlightPageLocators.roomCountDropdown)).toBeVisible();
}


  static async clickOnAdultPlusButton(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.travellersAdultPlusButton);
  }

  static async clickOnChildPlusButton(page: any) {
    await ElementHelper.doubleClickElement(page, FlightPageLocators.travellersChildrenPlusButton);
  }

  static async clickOnInfantPlusButton(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.travellersInfantPlusButton);
  }

  static async clickOnApplyButton(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.travellersApplyButton);
  }

  static selectedTravelClass: string;

  static async getTravelClass(page: Page): Promise<void> {
    const travelClass = await page.locator(FlightPageLocators.travelClassText).textContent();
    FlightHomePage.selectedTravelClass = travelClass?.trim() || '';
    console.log(`Selected Class: ${FlightHomePage.selectedTravelClass}`);
  }

  static async clickOnPremiumClassButton(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.travelClassPremiumEconomyOption);
  }

  static async getTravellerCount(page: Page): Promise<string> {
    const count = await page.locator(FlightPageLocators.travellerCount).textContent();
    return count?.trim() || '';
  }

  static async scrolltoViewTravelAdvisory(page: any) {
    if(await ElementHelper.isElementDisplayed(page, FlightPageLocators.travelDetailsField)) {
    await ElementHelper.scrollToElement(page, FlightPageLocators.travelDetailsField);
    }
  }
  static async clickOnSearchFlightsButton(page: any) {
    await ElementHelper.scrollToElement(page, FlightPageLocators.searchFlightsButton);
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.searchFlightsButton);
     await page.waitForTimeout(2000);
    await ElementHelper.clickElement(page, FlightPageLocators.searchFlightsButton);
  }
static async VerifyFirstFlightCardVisible(page: any) {
    // await page.waitForTimeout(40000);
    await page.waitForLoadState('domcontentloaded');
    // await FlightHomePage.reloadIfNoRecordFound(page);
    await page.waitForLoadState('domcontentloaded');
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.firstFlightCard);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.firstFlightCard);
}

  // Some routes (e.g. international) don't auto-select a fare, so Next/Book does nothing until a card is explicitly selected
  static async clickOnFirstFlightCard(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.firstFlightCard);
  }
  static async printFlightRoutes(page: Page) {
    const cards = page.locator(FlightPageLocators.FlightRoundTripDetailsBox);
    const count = await cards.count();

    console.log(`Total Flight Route Boxes: ${count}`);

    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).textContent();
      console.log(`Box ${i + 1}: ${text?.trim()}`);
    }
  }

  static async clickOnClearAllButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Apply Button verification.');
      break;
    case 'IDFC':
    await page.waitForTimeout(3000);
    await ElementHelper.clickElement(page, FlightPageLocators.filterClearButton);
    break;
  }
  }


  static async clickOnSortTab(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.sortTabButton);
  }

  static async selectSortPriceLowToHigh(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.sortPriceLowToHigh);
  }

  static async selectSortPriceHighToLow(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.sortPriceHighToLow);
  }

  // Verifies all 8 Sort tab options (Price/Duration/Departure/Arrival x Low-High/High-Low) are displayed
  static async verifyAllSortOptionsDisplayed(page: Page) {
    const sortOptions: Array<[string, string]> = [
      ['Price: Low to High', FlightPageLocators.sortPriceLowToHigh],
      ['Price: High to Low', FlightPageLocators.sortPriceHighToLow],
      ['Duration: Shortest', FlightPageLocators.sortDurationShortest],
      ['Duration: Longest', FlightPageLocators.sortDurationLongest],
      ['Departure: Earliest', FlightPageLocators.sortDepartureEarliest],
      ['Departure: Latest', FlightPageLocators.sortDepartureLatest],
      ['Arrival: Earliest', FlightPageLocators.sortArrivalEarliest],
      ['Arrival: Latest', FlightPageLocators.sortArrivalLatest],
    ];
    for (const [label, locator] of sortOptions) {
      await expect(page.locator(locator), `Sort option "${label}" should be displayed`).toBeVisible({ timeout: 15000 });
      console.log(`Sort option displayed: ${label}`);
    }
  }

  static async verifyFlightCardsSortedByPrice(page: Page, order: 'asc' | 'desc', cardsToCheck: number = 10) {
    const cards = page.locator(FlightPageLocators.flightResultCards).filter({ visible: true });
    await expect(cards.first(), 'At least one flight result card should be displayed').toBeVisible({ timeout: 30000 });
    const count = Math.min(await cards.count(), cardsToCheck);

    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).innerText();
      const price = this.parseFlightCard(text).price;
      expect(price, `Flight card ${i + 1} should show a price. Card text: ${text.replace(/\s+/g, ' ').trim()}`).toBeTruthy();
      prices.push(price!);
    }

    const sortedPrices = [...prices].sort((a, b) => order === 'asc' ? a - b : b - a);
    expect(prices, `Flight cards should be sorted by price ${order === 'asc' ? 'ascending (Low to High)' : 'descending (High to Low)'}. Got: ${prices.join(', ')}`).toEqual(sortedPrices);
    console.log(`Verified ${prices.length} flight cards sorted by price (${order}): ${prices.join(', ')}`);
  }

  static async VerifyStopsTabVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterTabStops);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabStops);
  }

  static selectedNonStop: string;

  static async selectNonStopFilter(page: Page): Promise<void> {
    const airlineText = await page.locator(FlightPageLocators.filterNonStop).textContent();
    FlightHomePage.selectedNonStop = airlineText?.split('(')[0].trim() || '';
    console.log(`Selected Non-Stop Filter: ${FlightHomePage.selectedNonStop}`);
  }

  static async clickOnFilterNonStoputton(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Apply Button verification.');
      break;
    case 'IDFC': 
    await page.waitForTimeout(3000);
    await ElementHelper.clickElement(page, FlightPageLocators.filterNonStop);
    break;
  }
  }

  static async verifyFilteredStopsDetails(page: Page): Promise<void> {
  const flightCards = page.locator(FlightPageLocators.FligthStopDetails);
  const count = await flightCards.count();
  console.log(`Total Flights Found: ${count}`);

  for (let i = 0; i < count; i++) {
    const airlineName = await flightCards.nth(i).textContent();

    const actual = airlineName?.trim().toLowerCase().replace(/[-\s]+/g, " ");
    const expected = FlightHomePage.selectedNonStop.toLowerCase().replace(/[-\s]+/g, " ");

    console.log(`Flight ${i + 1}: ${actual}`);
  }
}

static async select1StopFilter(page: Page): Promise<void> {
    if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.filter1Stop)) {
    await page.waitForTimeout(15000)
    await ElementHelper.clickElement(page, FlightPageLocators.filter1Stop);
    await page.waitForTimeout(5000)
    const airlineText = await page.locator(FlightPageLocators.filter1Stop).textContent();
    FlightHomePage.selectedNonStop = airlineText?.split('(')[0].trim() || '';
    console.log(`Selected 1-Stop Filter: ${FlightHomePage.selectedNonStop}`);
    await page.waitForTimeout(5000)
    }
  }

 static async verifyFiltered1StopsDetails(page: Page): Promise<void> {
  const CLIENT = process.env.CLIENT?.trim().toUpperCase();
  console.log("CLIENT:", CLIENT);
 
  switch (CLIENT) {
    case 'BOB': {
      if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.FligthStopDetails)) {
      const flightCards = page.locator(FlightPageLocators.FligthStopDetails);
      const count = await flightCards.count();
 
      console.log(`Total Flights Found: ${count}`);
 
      for (let i = 0; i < count; i++) {
        const text = await flightCards.nth(i).textContent();
        const actual = text?.trim().toLowerCase();
 
        console.log(`Flight ${i + 1}: ${actual}`);

      }
   
      break; // important
    }
    }
 
    case 'IDFC': {
      if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.FligthStopDetails)) {
      const flightCards = page.locator(FlightPageLocators.FligthStopDetails);
      const count = await flightCards.count();
 
      console.log(`Total Flights Found: ${count}`);
 
      for (let i = 0; i < count; i++) {
        const airlineName = await flightCards.nth(i).textContent();
 
        console.log(`Flight ${i + 1}: ${airlineName?.trim()}`);
 
      //  expect(airlineName?.trim().toLowerCase())
       //   .toContain(FlightHomePage.selectedNonStop.toLowerCase());
      }
      break; // important
    }
  }
 
    default:
      throw new Error(`Unsupported CLIENT: ${CLIENT}`);
  }
}
  static async clickOnDepartureTabButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Apply Button verification.');
      break;
    case 'IDFC':
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterTabDepartureTime);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabDepartureTime);
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabDepartureTime);
    break;
    }
  }

  static async VerifyfilterDepartureTimeEarlyMorningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterDepartureTimeEarlyMorning);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterDepartureTimeEarlyMorning);
  }

  static async VerifyfilterDepartureTimeMorningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterDepartureTimeMorning);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterDepartureTimeMorning);
  }

  static async VerifyfilterDepartureTimeAfternoonVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterDepartureTimeAfternoon);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterDepartureTimeAfternoon);
  }

  static async VerifyfilterDepartureTimeEveningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterDepartureTimeEvening);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterDepartureTimeEvening);
  }

  static async VerifyFilterDepartureTimeEarlyMorningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Departure Time Early Morning Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterDepartureTimeEarlyMorningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterDepartureTimeEarlyMorningReturn);
    break;
  }
  }

  static async VerifyFilterDepartureTimeMorningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Departure Time Morning Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterDepartureTimeMorningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterDepartureTimeMorningReturn);
    break;
  }
  }

  static async VerifyFilterDepartureTimeAfternoonReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Departure Time Afternoon Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterDepartureTimeAfternoonReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterDepartureTimeAfternoonReturn);
    break;
  }
}

  static async VerifyFilterDepartureTimeEveningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Departure Time Evening Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterDepartureTimeEveningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterDepartureTimeEveningReturn);
    break;
  }
  }

  static async clickOnArrivalTabButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On Arrival Tab Button.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterTabArrivalTime);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabArrivalTime);
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabArrivalTime);
    break;
  }
  }

  static async VerifyfilterArrivalTimeEarlyMorningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterArrivalTimeEarlyMorning);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterArrivalTimeEarlyMorning);
  }

  static async VerifyfilterArrivalTimeMorningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterArrivalTimeMorning);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterArrivalTimeMorning);
  }

  static async VerifyfilterArrivalTimeAfternoonVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterArrivalTimeAfternoon);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterArrivalTimeAfternoon);
  }

  static async VerifyfilterArrivalTimeEveningVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterArrivalTimeEvening);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterArrivalTimeEvening);
  }

  static async VerifyFilterArrivalTimeEarlyMorningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Arrival Time Early Morning Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterArrivalTimeEarlyMorningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterArrivalTimeEarlyMorningReturn);
    break;
  }
  }

  static async VerifyFilterArrivalTimeMorningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Arrival TimeMorning Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterArrivalTimeMorningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterArrivalTimeMorningReturn);
    break;
  }
  }

  static async VerifyFilterArrivalTimeAfternoonReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Arrival Time Afternoon Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterArrivalTimeAfternoonReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterArrivalTimeAfternoonReturn);
    break;
  }
  }

  static async VerifyFilterArrivalTimeEveningReturnVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Arrival Time Evening Return verification.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FilterArrivalTimeEveningReturn);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FilterArrivalTimeEveningReturn);
    break;
  }
  }

  static async clickOnfilterTabFareTypeTabButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On filter Tab Fare Type Tab Button.');
      break;
    case 'IDFC': 
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterTabFareType);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabFareType);
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabFareType);
    break;
  }
  }

  static async clickOnfilterTabFareTypeRefundableButton(page: any) {
    await page.waitForTimeout(3000);
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabFareTypeRefundable);
  }

  static async selectRefundableFilter(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabFareTypeRefundable);
    const airlineText = await page.locator(FlightPageLocators.filterTabFareTypeRefundable).textContent();
    FlightHomePage.selectedNonStop = airlineText?.split('(')[0].trim() || '';
    console.log(`Selected Refundable Filter: ${FlightHomePage.selectedNonStop}`);
  }

  static async verifyRefundableDetails(page: Page): Promise<void> {
    const flightCards = page.locator(FlightPageLocators.FlightRefundableText);
    const count = await flightCards.count();
    console.log(`Total Flights Found: ${count}`);
    for (let i = 0; i < count; i++) {
      const airlineName = await flightCards.nth(i).textContent();
      console.log(`Flight ${i + 1}: ${airlineName?.trim()}`);
      expect(airlineName?.trim().toLowerCase()).toContain(FlightHomePage.selectedNonStop.toLowerCase());
    }
  }

  static async selectNonRefundableFilter(page: Page): Promise<void> {
    if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.filterTabFareTypeNonRefundable)) {
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabFareTypeNonRefundable);
    const airlineText = await page.locator(FlightPageLocators.filterTabFareTypeNonRefundable).textContent();
    FlightHomePage.selectedNonStop = airlineText?.split('(')[0].trim() || '';
    console.log(`Selected Non-Refundable Filter: ${FlightHomePage.selectedNonStop}`);
    }
  }

  static async verifyNonRefundableDetails(page: Page): Promise<void> {
    if (await page.locator(FlightPageLocators.FlightNonRefundableText).isVisible()) {
      if (await page.locator(FlightPageLocators.filterErrorMessage).isVisible()) {
        console.log('Filter Error Message Displayed:');
      } else {
        const flightCards = page.locator(FlightPageLocators.FlightNonRefundableText);
        const count = await flightCards.count();
        console.log(`Total Flights Found: ${count}`);
        for (let i = 0; i < count; i++) {
          const airlineName = await flightCards.nth(i).textContent();
          console.log(`Flight ${i + 1}: ${airlineName?.trim()}`);
          expect(airlineName?.trim().toLowerCase()).toContain(FlightHomePage.selectedNonStop.toLowerCase());
        }
        await FlightHomePage.clickOnFilterListButton(page);
      }
    }
  }
  static async clickOnfilterAirlineTabButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Apply Button verification.');
      break;
    case 'IDFC':
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.filterTabAirlines);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.filterTabAirlines);
    await ElementHelper.clickElement(page, FlightPageLocators.filterTabAirlines);
    break;
  }
  }

  static async selectFirstAirlineFilter(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, FlightPageLocators.filterFirstAirlineInList);
    const airlineText = await page.locator(FlightPageLocators.filterFirstAirlineInList).textContent();
    FlightHomePage.selectedNonStop = airlineText?.split('(')[0].trim() || '';
    console.log(`Selected Airline Filter: ${FlightHomePage.selectedNonStop}`);
  }

  static async verifyFilteredAirlines(page: Page): Promise<void> {
    const flightCards = page.locator(FlightPageLocators.FlightAirlineName);
    const count = await flightCards.count();
    console.log(`Total Flights Found: ${count}`);
    for (let i = 0; i < count; i++) {
      const airlineName = await flightCards.nth(i).textContent();
    }
  }
  static async clickOnNextButtonOnFlightDetailsPage(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clickElement(page, FlightPageLocators.bookNowButtonOnFlightDetailsPage);
      break;

    case 'IDFC':
    await ElementHelper.clickElement(page, FlightPageLocators.nextButtonOnFlightDetailsPage);
    await page.waitForTimeout(3000);
    break;
  }
  }

  static async clickOnBookButtonOnFlightDetailsPage(page: any) {
    await page.waitForTimeout(3000);
  
    const footerBook = page.locator(FlightPageLocators.bookButtonOnFairDetailsPage);
    const modalContinue = page.locator(FlightPageLocators.fareModalContinueButton);
    const nearbyConfirm = page.locator(FlightPageLocators.nearbyAirportConfirmButton);
   
    await footerBook.or(modalContinue).or(nearbyConfirm).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 60000 });
    if (await this.confirmNearbyAirportPopupIfShown(page, 1000)) {
      await footerBook.or(modalContinue).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 60000 });
    }
    if (!(await modalContinue.isVisible())) {
      await ElementHelper.clickElement(page, FlightPageLocators.bookButtonOnFairDetailsPage);
      await page.waitForTimeout(8000);
      
      await this.confirmNearbyAirportPopupIfShown(page);
    }
    await this.continueThroughFareModal(page);
  }

  // Same first half as clickOnBookButtonOnFlightDetailsPage (clicks the same footer_return_btn button and
  // handles the Nearby Airport popup), but stops once the onward-leg fare modal opens instead of
  // auto-continuing through it — lets a round trip test verify/select fares per leg (see TC-37975)
  static async openFareDetailsForOnwardLeg(page: any) {
    await page.waitForTimeout(3000);

    const footerBook = page.locator(FlightPageLocators.bookButtonOnFairDetailsPage);
    const modalContinue = page.locator(FlightPageLocators.fareModalContinueButton);
    const nearbyConfirm = page.locator(FlightPageLocators.nearbyAirportConfirmButton);

    await footerBook.or(modalContinue).or(nearbyConfirm).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 60000 });
    if (await this.confirmNearbyAirportPopupIfShown(page, 1000)) {
      await footerBook.or(modalContinue).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 60000 });
    }
    if (!(await modalContinue.isVisible())) {
      await ElementHelper.clickElement(page, FlightPageLocators.bookButtonOnFairDetailsPage);
      await page.waitForTimeout(8000);
      await this.confirmNearbyAirportPopupIfShown(page);
    }
  }

  static async confirmNearbyAirportPopupIfShown(page: Page, timeout: number = 5000): Promise<boolean> {
    const confirmButton = page.locator(FlightPageLocators.nearbyAirportConfirmButton);
    const shown = await confirmButton.waitFor({ state: 'visible', timeout }).then(() => true, () => false);
    if (!shown) return false;
    console.log('Nearby Airport popup shown, clicking Confirm');
    // Modal fade-in can still be animating; fall back to a forced click if the button is covered
    await confirmButton.click({ timeout: 10000 }).catch(() => confirmButton.click({ force: true }));
    await expect(page.locator(FlightPageLocators.nearbyAirportPopup), 'Nearby Airport popup should close after Confirm').toBeHidden({ timeout: 30000 });
  
    await page.locator(FlightPageLocators.fareModalContinueButton)
      .or(page.locator(FlightPageLocators.continueButtonOnFlightDetailsPage))
      .or(page.locator(FlightPageLocators.bookButtonOnFairDetailsPage))
      .filter({ visible: true }).first()
      .waitFor({ state: 'visible', timeout: 60000 }).catch(() => console.log('No fare modal or Continue/Book button after Nearby Airport Confirm'));
    return true;
  }
  static async confirmPriceChangePopupIfShown(page: Page, timeout: number = 5000): Promise<boolean> {
    const heading = page.locator(FlightPageLocators.priceChangePopupHeading);
    const shown = await heading.waitFor({ state: 'visible', timeout }).then(() => true, () => false);
    if (!shown) return false;
    console.log('Price change popup shown, clicking Confirm');
    const confirmButton = page.locator(FlightPageLocators.priceChangeConfirmButton);
    await confirmButton.click({ timeout: 10000 }).catch(() => confirmButton.click({ force: true }));
    await expect(heading, 'Price change popup should close after Confirm').toBeHidden({ timeout: 30000 });
    return true;
  }

  // Verifies each fare/service option card (e.g. "Regular Fare", "NDC_Value") shows its inclusions (Cabin/Check-in/Meal) and a price
  static async verifyFareOptionsDisplayed(page: Page) {
    // Visible only: the other leg's fare cards can already be in the DOM, just hidden, before Continue is clicked
    const cards = page.locator(FlightPageLocators.fareOptionCards).filter({ visible: true });
    await expect(cards.first(), 'At least one fare option should be displayed').toBeVisible({ timeout: 30000 });
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const fareName = (await card.locator('h4').innerText()).trim();
      const cabin = (await card.locator('.entbox', { hasText: 'Cabin' }).innerText()).replace(/Cabin:/i, '').trim();
      const checkIn = (await card.locator('.entbox', { hasText: 'Check-in' }).innerText()).replace(/Check-in:/i, '').trim();
      const meal = (await card.locator('.entbox', { hasText: 'Meal' }).innerText()).replace(/Meal:/i, '').trim();
      const price = Number(await card.locator('.flightRate').getAttribute('data-price'));

      expect(fareName, `Fare option ${i + 1} should show a fare name`).toBeTruthy();
      expect(cabin, `${fareName} should show the Cabin baggage inclusion`).toBeTruthy();
      expect(checkIn, `${fareName} should show the Check-in baggage inclusion`).toBeTruthy();
      expect(meal, `${fareName} should show the Meal inclusion`).toBeTruthy();
      expect(price, `${fareName} should show a price greater than 0`).toBeGreaterThan(0);

      console.log(`Fare option "${fareName}": Cabin=${cabin}, Check-in=${checkIn}, Meal=${meal}, Price=₹${price}`);
    }
  }

  static async selectFareOptionAndVerifySelected(page: Page, index: number = 1) {
    const cards = page.locator(FlightPageLocators.fareOptionCards).filter({ visible: true });
    const target = cards.nth(index);
    const fareName = (await target.locator('h4').innerText()).trim();
    await target.click();
    await expect(target, `Fare option "${fareName}" should become selected after clicking it`).toHaveClass(/\bactive\b/, { timeout: 10000 });
    console.log(`Selected fare option "${fareName}"`);
  }

  // Round trip fare modal: switches to the return leg's fare carousel via its tab (no Continue click needed)
  static async clickOnFareModalReturnTab(page: any) {
    await ElementHelper.clickElement(page, FlightPageLocators.fareModalReturnTab);
  }

  // Confirms the modal's fare summary total matches whichever fare option is currently selected
  static async verifyFareSummaryReflectsSelectedFare(page: Page) {
    // Round trip: the footer total is onward's selected fare + return's selected fare combined, not just
    // whichever leg's carousel is currently visible — so sum every selected card (one active card per leg)
    const selectedCards = page.locator(FlightPageLocators.fareOptionCardSelected);
    const count = await selectedCards.count();
    expect(count, 'At least one fare option should be selected').toBeGreaterThan(0);

    let expectedTotal = 0;
    for (let i = 0; i < count; i++) {
      expectedTotal += Number(await selectedCards.nth(i).locator('.flightRate').getAttribute('data-price'));
    }

    const footerText = await page.locator(FlightPageLocators.fareModalFooterTotalPrice).innerText();
    const footerPrice = Number(footerText.replace(/[^\d]/g, ''));

    expect(footerPrice, `Fare summary total (₹${footerPrice}) should equal the sum of selected fares (₹${expectedTotal})`).toBe(expectedTotal);
    console.log(`Fare summary ₹${footerPrice} matches sum of selected fares ₹${expectedTotal}`);
  }

  static async continueThroughFareModal(page: any) {
    for (let i = 0; i < 3; i++) {
      const continueLocator = page.locator(FlightPageLocators.fareModalContinueButton);
      if (!(await continueLocator.isVisible())) {
        const popupConfirmed = await this.confirmNearbyAirportPopupIfShown(page, 2000);
        if (!popupConfirmed || !(await continueLocator.isVisible())) break;
      }
      const continueButton = await continueLocator.elementHandle();
      await ElementHelper.clickElement(page, FlightPageLocators.fareModalContinueButton);
      await continueButton.waitForElementState('hidden', { timeout: 90000 }).catch(error => {
        if (!/not attached/i.test(error.message)) throw error;
      });
    }
  }

  // Single Continue click on the fare modal (vs. continueThroughFareModal's up-to-3-clicks loop) — for a round
  // trip, clicking this once on the onward-leg fare modal reveals the return-leg fare modal in its place
  static async clickOnFareModalContinueButton(page: any) {
    const continueLocator = page.locator(FlightPageLocators.fareModalContinueButton);
    const continueButton = await continueLocator.elementHandle();
    await ElementHelper.clickElement(page, FlightPageLocators.fareModalContinueButton);
    await continueButton.waitForElementState('hidden', { timeout: 90000 }).catch((error: any) => {
      if (!/not attached/i.test(error.message)) throw error;
    });
  }

  static async clickOnContinueButtonOnFlightDetailsPage(page: any) {
    await this.confirmNearbyAirportPopupIfShown(page, 2000);
    // A resurfaced popup can leave an unconfirmed fare modal in front of the traveller-details Continue button
    if (await page.locator(FlightPageLocators.fareModalContinueButton).isVisible()) {
      await this.continueThroughFareModal(page);
    }
    const continueLocator = page.locator(FlightPageLocators.continueButtonOnFlightDetailsPage);
    await continueLocator.waitFor({ state: 'visible', timeout: 30000 });
    const continueButton = await continueLocator.elementHandle();
    await ElementHelper.clickElement(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
    await this.confirmPriceChangePopupIfShown(page, 5000);
    await continueButton.waitForElementState('hidden', { timeout: 90000 }).catch((error: any) => {
      if (!/not attached/i.test(error.message)) throw error;
    });
  }

  static selectedFirstName: string;
  static selectedLastName: string;
  static selectedEmail: string;
  static selectedPhone: string;

  static async clickOnAddNewTravellerButton(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On Add New Traveller Button.');
      break;

    case 'IDFC':
    await ElementHelper.clickElement(page, FlightPageLocators.addnewTravellerButton);
    await page.waitForTimeout(3000);
    break;
  }
  }

  static async clickOnMrGenderButton(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On MrGender Button.');
      break;

    case 'IDFC':
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.travellerGenderMR);
    await ElementHelper.clickElement(page, FlightPageLocators.travellerGenderMR);
    await page.waitForTimeout(3000);
    break;
  }
  }

  static async VerifyFirstNameErrorMessageVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FirstNameErrorMessage);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FirstNameErrorMessage);
  }

  static async VerifyLastNameErrorMessageVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.LastNameErrorMessage);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.LastNameErrorMessage);
  }

  static async EnterWrongFirstName(page: any, data: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.firstNameInput, data);
    const firstNameText = await page.locator(FlightPageLocators.firstNameInput).inputValue();
    FlightHomePage.selectedFirstName = firstNameText?.split('(')[0].trim() || '';
    console.log(`Entered First Name: ${FlightHomePage.selectedFirstName}`);
    break;
  }
  }

  static async EnterFirstName(page: any, data: any) {
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.firstNameInput, data);
    const firstNameText = await page.locator(FlightPageLocators.firstNameInput).inputValue();
    FlightHomePage.selectedFirstName = firstNameText?.split('(')[0].trim() || '';
    console.log(`Entered First Name: ${FlightHomePage.selectedFirstName}`);
  }

 static async EnterRandomFirstName(page: any) {
const firstNames = ["David", "James", "Michael", "Robert", "William"];
const randomFirstName =
firstNames[Math.floor(Math.random() * firstNames.length)];
await ElementHelper.clearAndEnterInTextField(
page,FlightPageLocators.firstNameInput, randomFirstName
);
}
  static async EnterWrongLastName(page: any, data: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.lastNameInput, data);
    const lastNameText = await page.locator(FlightPageLocators.lastNameInput).inputValue();
    FlightHomePage.selectedLastName = lastNameText?.split('(')[0].trim() || '';
    console.log(`Entered Last Name: ${FlightHomePage.selectedLastName}`);
    break;
  }
  }

  static async EnterEditFirstName(page: any, data: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.lastNameInput, data);
    const lastNameText = await page.locator(FlightPageLocators.lastNameInput).inputValue();
    FlightHomePage.selectedLastName = lastNameText?.split('(')[0].trim() || '';
    console.log(`Entered Last Name: ${FlightHomePage.selectedLastName}`);
    break;
  }
  }

  static async EnterEditLastName(page: any, data: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.lastNameInput, data);
    const lastNameText = await page.locator(FlightPageLocators.lastNameInput).inputValue();
    FlightHomePage.selectedLastName = lastNameText?.split('(')[0].trim() || '';
    console.log(`Entered Last Name: ${FlightHomePage.selectedLastName}`);
    break;
  }
  }

  static async EnterLastName(page: any, data: any) {
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.lastNameInput, data);
    const lastNameText = await page.locator(FlightPageLocators.lastNameInput).inputValue();
    FlightHomePage.selectedLastName = lastNameText?.split('(')[0].trim() || '';
    console.log(`Entered Last Name: ${FlightHomePage.selectedLastName}`);
  }
 
static async enterMobileNo(page: any, data: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clearAndEnterInTextField(
        page,
        FlightPageLocators.passnagermobile,
        data
      );

      const value = await page
        .locator(FlightPageLocators.passnagermobile)
        .inputValue();

      FlightHomePage.selectedMobileNo = value.split('(')[0].trim();

      console.log(`Entered Mobile No: ${FlightHomePage.selectedMobileNo}`);
      break;

    case 'IDFC':
      console.log('IDFC: Skipping mobile number entry');
      break;

    default:
      console.warn(`⚠️ Unknown CLIENT: ${CLIENT}`);
  }
}

  static async verifyFirstTravellerNameOnTravellerDetailPage(page: Page): Promise<void> {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    const summaryText = await page.locator(FlightPageLocators.FirstTravellerNameOnSummary).textContent();
    console.log(`Result Page Text: ${summaryText}`);
    console.log(`Verified First Traveller Name: ${FlightHomePage.selectedFirstName}`);
    break;
    }
    }

  static async verifyLastTravellerNameOnTravellerDetailPage(page: Page): Promise<void> {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Enter First Name.');
      break;

    case 'IDFC':
    const summaryText = await page.locator(FlightPageLocators.FirstTravellerNameOnSummary).textContent();
    console.log(`Result Page Text: ${summaryText}`);
    console.log(`Verified Last Traveller Name: ${FlightHomePage.selectedLastName}`);
    break;
  }
  }

  static async clickOnAddTravellerButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clickElement(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
    await page.waitForTimeout(3000);
      break;

  case 'IDFC':
  const btn = page.locator(FlightPageLocators.addTravellerButton);

  if (!(await btn.isVisible()) || !(await btn.isEnabled())) {
    throw new Error('Add Traveller button is not clickable.');
  }

  await btn.click();
  break;
  }
}

  static async clickOnFirstNameEditButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On Edit Button Page.');
      break;

    case 'IDFC': {
      // VerificationHelpers.elementIsVisible reloads the page on its very first failed attempt, before any
      // caller gets a chance to react — and that reload re-triggers a "Price change" dialog (stale fare lock
      // revalidated on reload), with the price climbing further each time, which then blocks the edit button
      // on the next attempt too. Poll without ever reloading instead, dismissing the dialog inline if it shows.
      const editButton = page.locator(FlightPageLocators.FirstTravellerNameEditButton);
      const deadline = Date.now() + 60000;
      while (!(await editButton.isVisible()) && Date.now() < deadline) {
        await this.confirmPriceChangePopupIfShown(page, 1000);
        await page.waitForTimeout(1000);
      }
      await expect(editButton, 'First traveller edit button should become visible without a page reload').toBeVisible({ timeout: 5000 });
      await ElementHelper.clickElement(page, FlightPageLocators.FirstTravellerNameEditButton);
      break;
    }
  }
  }

  // For flows that never add a second traveller (e.g. SC_007, SC_008 search with only 1 traveller):
  // FirstTravellerNameEditButton's index [2] never exists, so this edits the self/only traveller at index [1].
  static async clickOnSelfTravellerEditButton(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On Edit Button Page.');
      break;

    case 'IDFC': {
      const editButton = page.locator(FlightPageLocators.SelfTravellerEditButton);
      const deadline = Date.now() + 60000;
      while (!(await editButton.isVisible()) && Date.now() < deadline) {
        await this.confirmPriceChangePopupIfShown(page, 1000);
        await page.waitForTimeout(1000);
      }
      await expect(editButton, 'Self traveller edit button should become visible without a page reload').toBeVisible({ timeout: 5000 });
      await ElementHelper.clickElement(page, FlightPageLocators.SelfTravellerEditButton);
      break;
    }
  }
  }


  static async clickOnFirstOptionCheckbox(page: any) {
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FirstOptionCheckbox);
    await ElementHelper.clickElement(page, FlightPageLocators.FirstOptionCheckbox);
  }
static async selectPassportDetails(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'BOB':
      const passportNumberField = page.locator(FlightPageLocators.passportNumberInput);     
      if (await passportNumberField.isVisible().catch(() => false)) {
      await ElementHelper.clearAndEnterInTextField(
        page,
        FlightPageLocators.passportNumberInput,
        'A12345678'
      );

      await page
        .locator(FlightPageLocators.dateofbirth)
        .evaluate((el: any) => el.removeAttribute('readonly'));

      await page
        .locator(FlightPageLocators.dateofbirth)
        .fill('11/01/2003');

      await ElementHelper.selectDropdown(
        page,
        FlightPageLocators.passportIssuingCountryDropdown,
        5
      );

      await ElementHelper.selectDropdown(
        page,
        FlightPageLocators.passportExpiryDayDropdown,
        6
      );

      await ElementHelper.selectDropdown(
        page,
        FlightPageLocators.passportExpiryMonthDropdown,
        7
      );

      await ElementHelper.selectDropdown(
        page,
        FlightPageLocators.passportExpiryYearDropdown,
        6
      );
      break;
    }
    case 'IDFC':
      // No passport handling required
      break;

    default:
      console.log(`No passport handling configured for CLIENT: ${CLIENT}`);
      break;
  }
}

static async selectPassportDetailstravellerpage(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();

  switch (CLIENT) {
    case 'IDFC': {
      const passportField = page.locator(
        FlightPageLocators.passportnumbertravellerpage
      );

      // Handle passport details only if passport field is visible
      if (await passportField.isVisible()) {
        await ElementHelper.clearAndEnterInTextField(
          page,
          FlightPageLocators.passportnumbertravellerpage,
          'A12345678'
        );

        await page
          .locator(FlightPageLocators.dateofbirthtravellerpage)
          .click();
        await page.locator("(//a[@class='ui-state-default'])[3]").click();

        await ElementHelper.selectDropdown(
          page,
          FlightPageLocators.passportcountrytravllerpage,
          5
        );

        await page
          .locator(FlightPageLocators.passportexpirytravellerpage)
          .click();

        await page
          .locator("//select[@class='ui-datepicker-year']")
          .selectOption({ index: 4 });

        await page.locator("(//a[@class='ui-state-default'])[4]").click();
      }

      break;
    }

    case 'BOB':{
      break;
    }
  }
}
 static async clickOnEditConfirmButtonPage(page: any) {
      const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping click On Edit Confirm Button Page.');
      break;

    case 'IDFC':
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.firstTravellerNameEditConfirmButton);
    await ElementHelper.clickElement(page, FlightPageLocators.firstTravellerNameEditConfirmButton);
    await page.waitForTimeout(3000);
    // Saving a traveller may open a "Review traveller details" popup that blocks the Continue button
    const reviewConfirm = page.locator(FlightPageLocators.reviewtravllerbutton);
    if (await reviewConfirm.waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false)) {
      await ElementHelper.clickElement(page, FlightPageLocators.reviewtravllerbutton);
      await reviewConfirm.waitFor({ state: 'hidden', timeout: 10000 });
    }

    break;
  }
  }
  
  static async VerifyEmailHeaderVisible(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping traveller count verification.');
      break;

    case 'IDFC':  
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.travellerEmail);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.travellerEmail);
    break;
  }
  }

  static async VerifyPhoneHeaderVisible(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping traveller count verification.');
      break;

    case 'IDFC':
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.travellerPhoneNumber);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.travellerPhoneNumber);
    break;
  }
  }

  static async VerifyDefaultTravellerEmail(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.defaultTavellerEmail);
    const travellerEmail = await page.locator(FlightPageLocators.defaultTavellerEmail).inputValue();
    FlightHomePage.selectedEmail = travellerEmail?.split('(')[0].trim() || '';
    console.log(`Default Traveller Email: ${FlightHomePage.selectedEmail}`);
  }

  static async VerifyDefaultTravellerPhone(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.defaultTravellerPhone);
    const travellerPhone = await page.locator(FlightPageLocators.defaultTravellerPhone).inputValue();
    FlightHomePage.selectedPhone = travellerPhone?.split('(')[0].trim() || '';
    console.log(`Default Traveller Phone: ${FlightHomePage.selectedPhone}`);
  }

  static async ClearEmailAndVerifyEmailError(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTavellerEmail, '');
      await ElementHelper.clickElement(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.emailErrorMessage);
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTavellerEmail, '');
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.emailErrorMessage);
    break;
  }
  }

  static async ClearMobileAndVerifyMobileError(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTravellerPhone, '');
      await ElementHelper.clickElement(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.phoneErrorMessage);
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTravellerPhone, '');
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.phoneErrorMessage);
    break;
  }
  }

  static async EnterNewTravellerEmail(page: any, data: any) {
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTavellerEmail, data);
    await VerificationHelpers.elementIsHidden(page, FlightPageLocators.emailErrorMessage);
  }

  static async EnterNewTravellerPhone(page: any, data: any) {
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultTravellerPhone, data);
    await VerificationHelpers.elementIsHidden(page, FlightPageLocators.phoneErrorMessage);
  }

  static async VerifyGSTHeaderVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.GSTHeader);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.GSTHeader);
  }

  static async ClearGSTAndVerifyError(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultGSTNumber, `__CONFIGURE_TEST_IDENTIFIER__`);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.gstErrorMessage);
    break;
  }
  }

  static async EnterNewTravellerGST(page: any, data: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping ');
      break;

    case 'IDFC':
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultGSTNumber, data);
    await VerificationHelpers.elementIsHidden(page, FlightPageLocators.gstErrorMessage);
    break;
  }
  }

  static async VerifyPassportHeaderVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.passportDetailHeading);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.passportDetailHeading);
  }

  static async VerifyPassportErrorMessageVisible(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await ElementHelper.waitForElementVisible(page, FlightPageLocators.passportErrorMessage);
      await VerificationHelpers.elementIsVisible(page, FlightPageLocators.passportErrorMessage);
      break;

    case 'IDFC':
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async VerifyPassportCountryErrorMessageVisible(page: any) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.passportCountryErrorMessage);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.passportCountryErrorMessage);
      break;

    case 'IDFC':
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async VerifyPassportDateErrorMessageVisible(page: any) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.passportExpiryErrorMessage);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.passportExpiryErrorMessage);
    break;

    case 'IDFC':
    console.log('IDFC: Skipping ');
    break;
  }
  }

  static async EnterNewTravellerPassportNumber(page: any, data: any) {
    await ElementHelper.clearAndEnterInTextField(page, FlightPageLocators.defaultPassportNumber, data);
    await VerificationHelpers.elementIsHidden(page, FlightPageLocators.passportErrorMessage);
  }

  static async EnterNewTravellerPassportCounty(page: any, _data: any) {
    await ElementHelper.selectOptionByVisibleText(page, FlightPageLocators.defualtpassportCountry, 'India');
    await CommonHelper.performKeyboardAction(page, 'Enter');
    await VerificationHelpers.elementIsHidden(page, FlightPageLocators.passportErrorMessage);
  }

  static async selectExpireDateForPassport(page: any) {
    const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    await ElementHelper.selectOptionByValue(page, FlightPageLocators.passportDay, "10")
    await ElementHelper.selectOptionByValue(page, FlightPageLocators.passportMonth, "10")
    await ElementHelper.selectOptionByValue(page, FlightPageLocators.passportYear, "2027")
    break;
 
    case 'IDFC':
    await ElementHelper.scrollToElement(page, FlightPageLocators.expireDate);
    await ElementHelper.clickElement(page, FlightPageLocators.expireDate);
    await ElementHelper.selectOptionByValue(page, FlightPageLocators.exprieYear, "2030")
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const targetDay = tomorrow.getDate().toString();
    await page.locator(FlightPageLocators.dateCell(targetDay)).click();
    break;
  }  
  }
 
  static async ScrolltosaveTravellInfo(page: any) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    console.log('BOB: Skipping ');
    break;
    case 'IDFC':
      await ElementHelper.scrollToElement(page, FlightPageLocators.saveTravellInfo);
    break;
  }  
  }

  static async verifyFlightFromAndToShotFormVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FlightFromNameShotform);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FlightFromNameShotform);
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FlightToNameShotForm);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FlightToNameShotForm);
}

  static async verifyInternationalFlightFromAndToShotFormVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FlightFromNameShotform);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FlightFromNameShotform);
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.FlightTOInternationalName);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.FlightTOInternationalName);
  }

  static async clickOnFirstTravellerName(page: any) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    console.log('BOB: Skipping ');
    break;
    case 'IDFC':
   console.log('BOB: Skipping ');
    break;
  }
}
static async clickOnFirstTraveller(page: any) {
     const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    console.log('BOB: Skipping ');
    break;
    case 'IDFC':
  await ElementHelper.clickElement(page, `(//div[contains(@class,'inputcheckbox')]//label)[2]`)
    break;
  }
}

static async clickOncontinueButtonOnTravellerPage(page: any) {
   const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    console.log('BOB: Skipping ');
    break;
    case 'IDFC':
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
    await ElementHelper.clickElement(page, FlightPageLocators.continueButtonOnFlightDetailsPage);
    await page.waitForTimeout(3000);
    break;
  }
}

// Traveller Details page's own Continue button. Uses the existing travellerDetailsPageContinuebutton
// locator directly (it was defined but never wired to a method) — clickOncontinueButtonOnTravellerPage
// above uses continueButtonOnFlightDetailsPage instead, which is the wrong button here and resets the
// page back to an empty traveller selection, so this is a separate method rather than a fix to that
// shared one (which other tests already depend on).
static async clickOnTravellerDetailsContinueButton(page: any) {
  await VerificationHelpers.elementIsVisible(page, FlightPageLocators.travellerDetailsPageContinuebutton);
  await ElementHelper.clickElement(page, FlightPageLocators.travellerDetailsPageContinuebutton);
  await page.waitForTimeout(3000);
}

static async travellersAndAddonsContinueButton(page: any) {
    if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.travellersAndAddonsContinueButton)) {
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.travellersAndAddonsContinueButton);
      await ElementHelper.clickElement(page, FlightPageLocators.travellersAndAddonsContinueButton);
  }
    await page.waitForTimeout(3000); // Wait for navigation to complete
}


static async verifySeatSelectionOptionVisible(page: any) {
  if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.seatSelectionOption)) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.seatSelectionOption);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.seatSelectionOption);
  }
}

static async verifyBaggageSelectionOptionVisible(page: any) {
  if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.baggageSelectionOption)) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.baggageSelectionOption);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.baggageSelectionOption);
  }
}

static async verifySeatMapVisible(page: any) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.seatMapContainer);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.seatMapContainer);
}

static async verifyPriceIncreasesAfterSeatSelection(page: any) {
  if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.seatPrice)) {
    const beforePriceText = await page.locator(FlightPageLocators.seatPrice).textContent();
    const beforePrice = Number(beforePriceText?.replace(/[₹,\s]/g, ''));
    console.log(`Price Before Seat Selection: ${beforePrice}`);
    await ElementHelper.clickElement(page, FlightPageLocators.availableSeat);
    await page.waitForTimeout(2000);
    const afterPriceText = await page.locator(FlightPageLocators.seatPrice).textContent();

    const afterPrice = Number(afterPriceText?.replace(/[₹,\s]/g, ''));
    console.log(`Price After Seat Selection: ${afterPrice}`);
    expect(afterPrice).toBeGreaterThan(beforePrice);
    console.log(`Price Increased By ₹${afterPrice - beforePrice}`);
  }
}

// Selects the first available Column A seat (a free "freebox" seat — availableSeat/
// verifyPriceIncreasesAfterSeatSelection above only target paid "extrapayhigh" seats)
static async clickOnAvailableSeatColumnA(page: any) {
  await VerificationHelpers.elementIsVisible(page, FlightPageLocators.availableSeatColumnA);
  await ElementHelper.clickElement(page, FlightPageLocators.availableSeatColumnA);
}

static async clickOnbaggageOption(page: any) {
  if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.baggageSelectionOption)) {
    await ElementHelper.clickElement(page, FlightPageLocators.baggageSelectionOption);
    await page.waitForTimeout(3000); 
  }
}

  static async verifyPriceIncreasesAfterWeeightIncrease(page: any) {
  const desktopBtn = page.locator(
    FlightPageLocators.weightIncreasePlusButton
  );

  const mobileBtn = page.locator(
    FlightPageLocators.weightincreaseplusbuttonmob
  );

  try {
    const isDesktopVisible = await desktopBtn.isVisible();
const isMobileVisible = await mobileBtn.isVisible();

if (!isDesktopVisible && !isMobileVisible) {
  console.log('Weight increase button not visible');
  return;
}

const weightBtn = isDesktopVisible
  ? desktopBtn
  : mobileBtn;

    const beforePrice = Number(
      (await page.locator(FlightPageLocators.seatPrice).textContent())
        ?.replace(/[₹,\s]/g, '')
    );

    await weightBtn.click();
    await page.waitForTimeout(5000);

    const afterPrice = Number(
      (await page.locator(FlightPageLocators.seatPrice).textContent())
        ?.replace(/[₹,\s]/g, '')
    );

    expect(afterPrice).toBeGreaterThan(beforePrice);
  } catch {
    console.log('Weight increase button not visible');
  }
}

static async clickOnSkipButton(page: any) {
    if(await ElementHelper.isElementDisplayed(page, FlightPageLocators.skipAndPayButton)) {
      await ElementHelper.clickElement(page, FlightPageLocators.skipAndPayButton);
    }
    await page.waitForTimeout(3000); // Wait for navigation to complete
}

static async verifyTravellerAndAddOneHeadingVisible(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
    console.log('BOB: Skipping ');
    break;
    case 'IDFC':
  if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.travellerAndAddoneHeading)) {
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.travellerAndAddoneHeading);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators .travellerAndAddoneHeading);
  }
  break;
}
}

static async reloadIfNoRecordFound(page: any) {
    const noFlightsTextLocator = FlightPageLocators.noFlightsText;
    while (await page.locator(noFlightsTextLocator).isVisible()) {
        await page.reload();
        await page.waitForTimeout(15000);
        if (await ElementHelper.isElementDisplayed(page, FlightPageLocators.firstFlightCard)) {
          break;
        }
    }
}

static async verifyTravellerCount(page: Page,expectedTravellerCount: string): Promise<void> {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping traveller count verification.');
      break;

    case 'IDFC':
      const summaryText = await page.locator(FlightPageLocators.travelsummaryCount).textContent();
      const actualTravellerCount = summaryText?.match(/\d+(?=\s*Traveller)/i)?.[0];

      console.log(`Expected Count: ${expectedTravellerCount}`);
      console.log(`Actual Count: ${actualTravellerCount}`);

      expect(actualTravellerCount).toBe(expectedTravellerCount);
      break;

    default:
      console.log(`No traveller count logic configured for client: ${CLIENT}`);
      break;
  }
}

static async VerifyOneWayRoundTripCalendarVisible(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Verify One Way Round Trip Calendar verification.');
      break;
    case 'IDFC':  
    await ElementHelper.waitForElementVisible(page, FlightPageLocators.VerifyOneWayRoundTripCalendar);
    await VerificationHelpers.elementIsVisible(page, FlightPageLocators.VerifyOneWayRoundTripCalendar);
    break;
  }
}

static async verifyTravelClass(page: Page): Promise<void> {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Verify Travel Class verification.');
      break;
    case 'IDFC':  
    const summaryText = await page.locator(FlightPageLocators.travelsummaryCount).textContent();
    console.log(`Result Page Text: ${summaryText}`);
    expect(summaryText).toContain(FlightHomePage.selectedTravelClass);
    console.log(`Verified Class: ${FlightHomePage.selectedTravelClass}`);
    break;
  }
}
static async clickOnFilterListButton(page: any) {
  await page.waitForTimeout(5000);
  const CLIENT = process.env.CLIENT?.toUpperCase();
  if(DeviceHelper.isMobile() && CLIENT === 'IDFC') {
    await ElementHelper.clickElement(page, FlightPageLocators.filterIconMobile);
  } else if(DeviceHelper.isMobile() && CLIENT === 'BOB') {
    await ElementHelper.clickElement(page, FlightPageLocators.filterButtonMobileForBOB);
  } else if(CLIENT === 'BOB'){
    console.log('BOB: Skipping');
  }
  else{
    await ElementHelper.clickElement(page, FlightPageLocators.flightListFilterButton);
  }
  }

  static async clickOnFilterApplyButton(page: any) {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      console.log('BOB: Skipping Filter Apply Button verification.');
      break;
    case 'IDFC': 
    await ElementHelper.clickElement(page, FlightPageLocators.filterApplyButton);
    break;
  }
  }

static async resetTravellersToOneAdult(page: Page): Promise<void> {
  const counters: [string, string, number][] = [
    [FlightPageLocators.travellersInfantCount, FlightPageLocators.travellersInfantMinusButton, 0],
    [FlightPageLocators.travellersChildrenCount, FlightPageLocators.travellersChildrenMinusButton, 0],
    [FlightPageLocators.travellersAdultCount, FlightPageLocators.travellersAdultMinusButton, 1],
  ];
  for (const [countLocator, minusLocator, minimum] of counters) {
    const count = page.locator(countLocator);
    for (let i = 0; i < 9 && Number(await count.inputValue()) > minimum; i++) {
      await page.locator(minusLocator).click();
    }
    await expect(count).toHaveValue(String(minimum));
  }
  console.log('Travellers reset to 1 Adult, 0 Children, 0 Infants');
}

static async verifyMaxPassengerLimit(page: Page): Promise<void> {
  const adultPlusButton = page.locator(FlightPageLocators.travellersAdultPlusButton);
  const adultMinusButton = page.locator(FlightPageLocators.travellersAdultMinusButton);
  const maxPassengerError = page.locator(FlightPageLocators.passengerAlert);

  
  if (await adultPlusButton.isDisabled() && !(await maxPassengerError.isVisible())) {
    await adultMinusButton.click();
    await expect(adultPlusButton).toBeEnabled();
  }


  for (let i = 0; i < 9 && !(await maxPassengerError.isVisible()); i++) {
    await adultPlusButton.click();
    await maxPassengerError.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
  }

  
  await expect(maxPassengerError).toBeVisible();
  await expect(maxPassengerError).toHaveText(
    /Max 9 passengers? ?\(Adult\+Child\) allowed/i
  );

  console.log("Max passenger error message is displayed.");

  
  await adultMinusButton.click();

 
  await expect(maxPassengerError).toBeHidden();

  console.log("Max passenger error message is no longer visible.");
}


}
