import { test, Page } from "@playwright/test";
import { CommonHelper } from "../../utils/commonHelper";
import { HotelPageLocators } from "../locators/HotelPageLocators";
import { ElementHelper } from "../../utils/elementHelper";
import { DeviceHelper } from "../../utils/deviceHelper";
import { LoginPage } from "./LoginPage";
import { HomePage } from "./Homepage";
import { HotelHomePage } from "./HotelHomePage";

export class BaseHelper {
  static async launchAndLogin(page: Page): Promise<void> {
    try {
      const projectName = test.info().project.name.toLowerCase();
      console.log(`Running setup for: ${projectName}`);
      await CommonHelper.navigateToHomePage(page);
      await LoginPage.RestrictionPageBeforeEach(page);
      await LoginPage.verifyMobileNumberFieldAcceptsInput(page);
      await LoginPage.clickGetOtpButton(page);
      await LoginPage.verifyOtpPageVisible(page);
      await LoginPage.verifyOtpFieldAcceptsInput(page);
      if (projectName.includes("bob")) {
        await LoginPage.verifyLoginButtonWorks(page);
        await page.waitForLoadState("domcontentloaded");
        await HomePage.handlePostLoginFlow(page);
      } else if (projectName.includes("idfc")) {
        await LoginPage.verifyLoginButtonWorks(page);
        await HotelHomePage.verifyHotelHomePageLoaded(page);
      } else {
        console.warn("⚠️ Unknown client, running default flow");

        await LoginPage.verifyLoginButtonWorks(page);
      }
    } catch (error) {
      console.error(`❌ Setup failed: ${(error as Error).message}`);
      throw error;
    }
  }

  static async clickHotelTabBTN(page: Page): Promise<void> {
    await page.waitForTimeout(10000);

    const hotelTabBTN = DeviceHelper.isMobile()
      ? HotelPageLocators.hotelTabMobile
      : HotelPageLocators.hotelTab;

    if (DeviceHelper.isMobile()) {
      await ElementHelper.scrollElementToCentre(page, hotelTabBTN);
      await page.waitForTimeout(2000);
    }

    await ElementHelper.clickElement(page, hotelTabBTN);
  }
   static async clickSearchHotelButton(page: any) {
    const searchHotelButton = HotelPageLocators.searchHotelButton;
    await ElementHelper.scrollElementToCentre(page, searchHotelButton);
    await page.focus(searchHotelButton);
        await page.waitForTimeout(500); 
    await ElementHelper.clickElement(page, searchHotelButton);
    await page.waitForTimeout(5000); 
    console.log(" Search Hotel button clicked");
  }

}
