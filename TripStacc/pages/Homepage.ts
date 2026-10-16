import { expect, Page } from '@playwright/test';
import { LoginPageLocators } from '../../TripStacc/locators/LoginPageLocators';
import { HomePageLocators } from '../../TripStacc/locators/HomePageLocators';
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
    await this.softVerifyVisible(page, {
      'Logo': HomePageLocators.logo,
      'Flights tab': HomePageLocators.flightsTab,
      'Hotels tab': HomePageLocators.hotelsTab,
      'Profile icon': HomePageLocators.profileIcon,
    });
  }

  static async verifyHomePageBanner(page: Page): Promise<void> {
    await this.softVerifyVisible(page, {
      'Banner carousel': HomePageLocators.banner,
      'Banner active slide': HomePageLocators.bannerActiveSlide,
      'Banner indicators': HomePageLocators.bannerIndicators,
    });
    // Only the Flights tab banner has previous/next arrows
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
    // Recent Searches only appears once the user has search history
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