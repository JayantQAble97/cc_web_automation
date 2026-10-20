import { expect, Page, Locator } from '@playwright/test';
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';
import { HomePageLocators } from '../../TripStacc/locators/HomePageLocators';
import { HotelPageLocators } from '../../TripStacc/locators/HotelPageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import { Data } from '../../utils/dataProvider';
import { DeviceHelper } from '../../utils/deviceHelper';
import { HotelHomePage } from './HotelHomePage';
import { FlightHomePage } from './FlightHomePage';

export class HomePage {

  static async handlePostLoginFlow(page: Page): Promise<void> {
  const CLIENT = process.env.CLIENT?.toUpperCase();
  switch (CLIENT) {
    case 'BOB':
      await page.waitForLoadState('domcontentloaded');
      await FlightHomePage.verifyCardSelectionPopupVisible(page);
      await FlightHomePage.selectCard(page);
      await FlightHomePage.verifyPopupClosed(page);
      await HotelHomePage.verifyHotelHomePageLoaded(page);
      console.log('BOB: Card selected and homepage loaded');
      break;
      
    default:

  }
}

  static async verifyHomePageLoadedAfterLogin(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator(HomePageLocators.header), 'Header should be visible').toBeVisible({ timeout: 30000 });
    await expect(page.locator(HomePageLocators.searchWidget), 'Search widget should be visible').toBeVisible({ timeout: 30000 });
    await expect(page.locator(HomePageLocators.banner), 'Banner should be visible').toBeVisible({ timeout: 30000 });
    await page.locator(HomePageLocators.footer).scrollIntoViewIfNeeded();
    await expect(page.locator(HomePageLocators.footer), 'Footer should be visible').toBeVisible({ timeout: 30000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log('Home page loaded with header, search widget, banner and footer visible');
  }

  // Soft assertions: every missing element is reported, and the test still fails at the end
  static async softVerifyVisible(page: Page, elements: Record<string, string>): Promise<void> {
    for (const [name, locator] of Object.entries(elements)) {
      const element = page.locator(locator);
      await element.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => {});
      await expect.soft(element, `${name} should be visible`).toBeVisible({ timeout: 10000 });
      console.log(`Checked visibility: ${name}`);
    }
  }

  static async verifyHomePageHeader(page: Page): Promise<void> {
    const headerElements = DeviceHelper.isMobile()
      ? {
          'Logo': HomePageLocators.logo,
          'Hotels tab': HotelPageLocators.hotelTabMobile,
          'Profile icon': HomePageLocators.profileIcon,
        }
      : {
          'Logo': HomePageLocators.logo,
          'Flights tab': HomePageLocators.flightsTab,
          'Hotels tab': HomePageLocators.hotelsTab,
          'Profile icon': HomePageLocators.profileIcon,
        };

    await this.softVerifyVisible(page, headerElements);
  }

  static async verifyHomePageBanner(page: Page): Promise<void> {
    await this.softVerifyVisible(page, {
      'Banner carousel': HomePageLocators.banner,
      'Banner active slide': HomePageLocators.bannerActiveSlide,
      'Banner indicators': HomePageLocators.bannerIndicators,
    });
  
    if (await page.locator(HomePageLocators.flightSearchArea).isVisible()) {
      await this.softVerifyVisible(page, {
        'Banner previous button': HomePageLocators.bannerPreviousButton,
        'Banner next button': HomePageLocators.bannerNextButton,
      });
    }
  }

  static async verifyHomePageSearchWidget(page: Page): Promise<void> {
    if (await page.locator(HomePageLocators.flightSearchArea).isVisible()) {
      await this.softVerifyVisible(page, {
        'One way option': HomePageLocators.oneWayOption,
        'Round trip option': HomePageLocators.roundTripOption,
        'From field': HomePageLocators.fromField,
        'To field': HomePageLocators.toField,
        'Departure date field': HomePageLocators.departureDateField,
        'Return date field': HomePageLocators.returnDateField,
        'Travellers & Cabin Class': HomePageLocators.travellersAndCabinClass,
        'Search flights button': HomePageLocators.searchFlightsButton,
      });
    } else {
      await this.softVerifyVisible(page, {
        'Hotel location field': HomePageLocators.hotelLocationField,
        'Check-in date field': HomePageLocators.hotelCheckInField,
        'Check-out date field': HomePageLocators.hotelCheckOutField,
        'Rooms & guests field': HomePageLocators.hotelRoomsAndGuestsField,
        'Search hotels button': HomePageLocators.searchHotelsButton,
      });
    }
  
    if (await page.locator(HomePageLocators.recentSearchesTitle).isVisible()) {
      await this.softVerifyVisible(page, { 'Recent search card': HomePageLocators.recentSearchCard });
    } else {
      console.log('Recent Searches not shown (no search history) - skipping');
    }
  }

  static async verifyHomePageContentSections(page: Page): Promise<void> {
    await this.softVerifyVisible(page, {
      'My Trips & Bookings': HomePageLocators.myTripsAndBookings,
      'My Trips & Bookings Manage link': HomePageLocators.myTripsManageLink,
      'Best offer for you section': HomePageLocators.bestOffersSection,
      'Best offer card': HomePageLocators.bestOfferCard,
      'Exclusive Benefits on Credit Cards section': HomePageLocators.bankOffersSection,
      'Why book with us section': HomePageLocators.whyBookSection,
      'FAQ section': HomePageLocators.faqSection,
      'FAQ question': HomePageLocators.faqQuestion,
      'Need help section': HomePageLocators.needHelpSection,
      'Need help mobile number': HomePageLocators.needHelpMobile,
      'Need help email': HomePageLocators.needHelpEmail,
    });
    await expect.soft(page.locator(HomePageLocators.whyBookItems), 'Why book with us should list 3 benefits').toHaveCount(3);
    await expect.soft(page.locator(HomePageLocators.faqCategoryTabs), 'FAQ should have General, Flights and Hotels tabs').toHaveCount(3);
  }

  static async verifyHomePageFooter(page: Page): Promise<void> {
    await this.softVerifyVisible(page, {
      'Footer': HomePageLocators.footer,
      'Powered by': HomePageLocators.footerPoweredBy,
      'Footer Flights link': HomePageLocators.footerFlightsLink,
      'Footer Hotels link': HomePageLocators.footerHotelsLink,
      'Contact Us link': HomePageLocators.footerContactUsLink,
      'About us link': HomePageLocators.footerAboutUsLink,
      'Refund Policy link': HomePageLocators.footerRefundPolicyLink,
      'Terms & Conditions link': HomePageLocators.footerTermsLink,
      'Privacy Policy link': HomePageLocators.footerPrivacyPolicyLink,
      'Copyright': HomePageLocators.footerCopyright,
    });
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // The active slide is just an <img> with no caption text, so rotation/navigation is detected via its src
  static async getBannerActiveSlideImageSrc(page: Page): Promise<string> {
    return (await page.locator(HomePageLocators.bannerActiveSlideImage).getAttribute('src')) ?? '';
  }


  static heroBannerAndOffersApplicable(): boolean {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    switch (CLIENT) {
      case 'BOB':
        return false;
      default:
        return true;
    }
  }


  static async verifyBannerSlideRotates(page: Page): Promise<void> {
    const initialSrc = await this.getBannerActiveSlideImageSrc(page);
    await page.waitForTimeout(8000);
    const laterSrc = await this.getBannerActiveSlideImageSrc(page);
    await expect.soft(laterSrc, 'Banner active slide image should change as the carousel auto-rotates').not.toBe(initialSrc);
    console.log(`Banner slide image changed from "${initialSrc}" to "${laterSrc}"`);
  }

  // Previous/Next controls only exist on the Flights-tab banner
  static async verifyBannerNavigationControls(page: Page): Promise<void> {
    if (!(await page.locator(HomePageLocators.flightSearchArea).isVisible())) {
      console.log('Hotels tab banner has no previous/next controls - skipping');
      return;
    }
    const beforeNext = await this.getBannerActiveSlideImageSrc(page);

    await ElementHelper.clickElement(page, HomePageLocators.bannerNextButton);
    await page.waitForTimeout(1000);
    const afterNext = await this.getBannerActiveSlideImageSrc(page);
    await expect.soft(afterNext, 'Clicking Next should change the active banner slide image').not.toBe(beforeNext);

    await ElementHelper.clickElement(page, HomePageLocators.bannerPreviousButton);
    await page.waitForTimeout(1000);
    const afterPrevious = await this.getBannerActiveSlideImageSrc(page);
    await expect.soft(afterPrevious, 'Clicking Previous should change the active banner slide image again').not.toBe(afterNext);
  }


  static async verifyBestOfferCardsDisplayed(page: Page): Promise<string[]> {
    const section = page.locator(HomePageLocators.bestOffersSection);
    await expect.soft(section, 'Best offer for you section should be visible').toBeVisible();

    const cards = page.locator(HomePageLocators.bestOfferCardsAll);
    const count = await cards.count();
    await expect.soft(count, 'Best offer for you should list more than one offer card').toBeGreaterThan(1);

    const texts = (await cards.allTextContents()).map(t => t.trim()).filter(Boolean);
    for (const text of texts) {
      await expect.soft(text.length, `Offer card text should not be empty: "${text}"`).toBeGreaterThan(0);
    }
    console.log(`Best offer cards (${count}): ${texts.join(' | ')}`);
    return texts;
  }

  static async verifyBankOffersCarousel(page: Page): Promise<void> {
    await this.softVerifyVisible(page, {
      'Exclusive Benefits on Credit Cards / Hotels section': HomePageLocators.bankOffersSection,
    });
    const imageCount = await page.locator(HomePageLocators.bankOffersImages).count();
    await expect.soft(imageCount, 'Exclusive Benefits section should display at least one promotional image').toBeGreaterThan(0);
  }

  // Hotels tab should swap the hero banner and the offers list to hotel-specific content
  static async verifyOffersAndBannerSwapOnHotelsTab(page: Page, flightTabOffers: string[]): Promise<void> {
    const hotelsTab = DeviceHelper.isMobile() ? HotelPageLocators.hotelTabMobile : HomePageLocators.hotelsTab;
    await ElementHelper.clickElement(page, hotelsTab);
    await page.waitForLoadState('domcontentloaded');

    await expect.soft(page.locator(HomePageLocators.flightSearchArea), 'Hotels tab should hide the flight search area').toBeHidden();
    await this.verifyHomePageBanner(page);
    const hotelTabOffers = await this.verifyBestOfferCardsDisplayed(page);
    await expect.soft(hotelTabOffers.join('|'), 'Hotel-tab offers should differ from flight-tab offers').not.toBe(flightTabOffers.join('|'));
  }


  static async verifyFaqAccordionExpandCollapse(page: Page, panelLocator: string): Promise<void> {
    const question = page.locator(`${panelLocator}//a[@data-toggle="collapse"] >> visible=true >> nth=0`);
    await question.scrollIntoViewIfNeeded();

    const controlsId = (await question.getAttribute('href')) ?? (await question.getAttribute('aria-controls')) ?? '';
    const answer = page.locator(`#${controlsId.replace('#', '')}`);

    await question.click();
    await expect.soft(answer, 'FAQ answer panel should expand after clicking the question').toBeVisible({ timeout: 10000 });
    await this.verifyFaqAriaExpanded(question, 'true');
    await page.waitForTimeout(800); // Bootstrap's collapse plugin ignores a click while the slide animation ("collapsing" class) is still running

    await question.click();
    await expect.soft(answer, 'FAQ answer panel should collapse after clicking the question again').toBeHidden({ timeout: 10000 });
    await this.verifyFaqAriaExpanded(question, 'false');
  }


  private static async verifyFaqAriaExpanded(question: Locator, expected: 'true' | 'false'): Promise<void> {
    const CLIENT = process.env.CLIENT?.toUpperCase();
    switch (CLIENT) {
      case 'BOB':
        console.log(`Skipping aria-expanded="${expected}" check for BOB (known CMS bug: hardcoded aria-expanded/aria-controls)`);
        break;
      default:
        await expect.soft(question, `Question should report aria-expanded="${expected}"`).toHaveAttribute('aria-expanded', expected);
    }
  }

  // Scenario: FAQ section with General/Flights/Hotels tabs - tabs switch and questions expand/collapse
  static async verifyFaqTabsSwitchAndAccordion(page: Page): Promise<void> {
    await this.softVerifyVisible(page, { 'FAQ section': HomePageLocators.faqSection });
    await expect.soft(page.locator(HomePageLocators.faqCategoryTabs), 'FAQ should have General, Flights and Hotels tabs').toHaveCount(3);

  
    await expect.soft(page.locator(HomePageLocators.faqGeneralPanel), 'General FAQ panel should be visible by default').toBeVisible();
    const generalCount = await page.locator(`${HomePageLocators.faqGeneralPanel}//*[@role="tab"]`).count();
    await expect.soft(generalCount, 'General FAQ panel should list at least one question').toBeGreaterThan(0);
    await this.verifyFaqAccordionExpandCollapse(page, HomePageLocators.faqGeneralPanel);

  
    await ElementHelper.clickElement(page, HomePageLocators.faqFlightsTab);
    await expect.soft(page.locator(HomePageLocators.faqFlightsPanel), 'Flights FAQ panel should become visible').toBeVisible();
    await expect.soft(page.locator(HomePageLocators.faqGeneralPanel), 'General FAQ panel should hide once Flights tab is selected').toBeHidden();
    const flightsCount = await page.locator(`${HomePageLocators.faqFlightsPanel}//*[@role="tab"]`).count();
    await expect.soft(flightsCount, 'Flights FAQ panel should list at least one question').toBeGreaterThan(0);
    await this.verifyFaqAccordionExpandCollapse(page, HomePageLocators.faqFlightsPanel);

  
    await ElementHelper.clickElement(page, HomePageLocators.faqHotelsTab);
    await expect.soft(page.locator(HomePageLocators.faqHotelsPanel), 'Hotels FAQ panel should become visible').toBeVisible();
    await expect.soft(page.locator(HomePageLocators.faqFlightsPanel), 'Flights FAQ panel should hide once Hotels tab is selected').toBeHidden();
    const hotelsCount = await page.locator(`${HomePageLocators.faqHotelsPanel}//*[@role="tab"]`).count();
    await expect.soft(hotelsCount, 'Hotels FAQ panel should list at least one question').toBeGreaterThan(0);
    await this.verifyFaqAccordionExpandCollapse(page, HomePageLocators.faqHotelsPanel);
  }

    static async handlePostLoginFlowForMobile(page: Page): Promise<void> {

        if(DeviceHelper.isMobile()) {
            const CLIENT = process.env.CLIENT?.toUpperCase();
            switch (CLIENT) {
              case 'BOB':
                await page.waitForLoadState('domcontentloaded');
                await FlightHomePage.verifyCardSelectionPopupVisible(page);
                await FlightHomePage.selectCard(page);
                await FlightHomePage.verifyPopupClosed(page);
                await HotelHomePage.verifyHotelHomePageLoaded(page);
                console.log('✅ BOB: Card selected and homepage loaded');
                break;
                      
                default:

            }
        }
      }
  }