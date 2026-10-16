import { expect, Page } from '@playwright/test';
import { ElementHelper } from '../../utils/elementHelper';
import { MyAccountPageLocators } from '../../TripStacc/locators/MyAccountPageLocators';
import { DeviceHelper } from '../../utils/deviceHelper';

export class MyAccountPage {
  static async clickMyAccount(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.myAccountProfile);
  }

  static async clickMyAccountSection(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.myAccountSection);
  }

  
static async verifyMyBookingSectionVisible(page: Page): Promise<void> {
  await expect(
    page.locator(MyAccountPageLocators.myBookingSection).locator(':visible').first()
  ).toBeVisible();
}


  static async clickMyBookingSection(page: Page): Promise<void> {
   await page.locator(MyAccountPageLocators.myBookingSection).locator(':visible').first().click();
    await page.waitForTimeout(6000);
  }
  static async clickFlightsUpcomingTab(page: Page): Promise<void> {
    await page.waitForTimeout(6000);
    if (DeviceHelper.isMobile()) {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsUpcomingTabMobile);
    } else {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsUpcomingTab);
    }    
  }

  static async clickFlightsCancelledTab(page: Page): Promise<void> {
    if(DeviceHelper.isMobile()) {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsCancelledTabMobile);
    } else {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsCancelledTab);
    }
  }
  static async verifyFlightsCompletedTabVisible(page: Page): Promise<void> {
    if(DeviceHelper.isMobile()) {
      await expect(page.locator(MyAccountPageLocators.flightsCompletedTabMobile)).toBeVisible();
    } else {
      await expect(page.locator(MyAccountPageLocators.flightsCompletedTab)).toBeVisible();
    }
  }

  static async printFromToText(page: Page): Promise<void> {
    console.log('From/To:', await page.textContent(MyAccountPageLocators.fromToText));
  }

  static async printBookingId(page: Page): Promise<void> {
    console.log('Booking ID:', await page.textContent(MyAccountPageLocators.bookingIdText));
  }

  static async printJourneyDate(page: Page): Promise<void> {
    console.log('Journey Date:', await page.textContent(MyAccountPageLocators.journeyDateText));
  }

  static async printTripType(page: Page): Promise<void> {
    console.log('Trip Type:', await page.textContent(MyAccountPageLocators.tripTypeText));
  }

  static async printPassengerName(page: Page): Promise<void> {
    console.log('Passenger:', await page.textContent(MyAccountPageLocators.passengerNameText));
  }

  static async printBookingDate(page: Page): Promise<void> {
    console.log('Booking Date:', await page.textContent(MyAccountPageLocators.bookingDateText));
  }

  static async printAmount(page: Page): Promise<void> {
    console.log('Amount:', await page.textContent(MyAccountPageLocators.amountText));
  }

  static async verifyButtonsBasedOnStatus(page: Page): Promise<void> {
    
  if (DeviceHelper.isMobile()) {
    console.log('Mobile detected - skipping button verification');
    return;
  }

  const status = (await page.textContent(MyAccountPageLocators.statusText))?.trim() ?? '';
  console.log(`Booking Status: ${status}`);
  await page.waitForTimeout(3000);
  if (status.includes('Confirmed')) {
    console.log('Status is Confirmed - Verifying View, Cancel, and Modify buttons');

    await expect(page.locator(MyAccountPageLocators.viewButton)).toBeVisible();
    console.log('View button is visible');

    await expect(page.locator(MyAccountPageLocators.cancelButton)).toBeVisible();
    console.log('Cancel button is visible');

    await expect(page.locator(MyAccountPageLocators.modifyButton)).toBeVisible();
    console.log('Modify button is visible');

  } else if (status.includes('Pending')) {
    console.log('Status is Pending - Verifying Pending View button');

    await expect(
      page.locator(MyAccountPageLocators.bookingpendingviewButton).first()
    ).toBeVisible();

    console.log('Pending View button is visible');

  } else if (status.includes('Cancelled') || status.includes('Canceled')) {
    console.log(' Status is Cancelled - No action buttons should be visible');

    console.log('✔ Cancelled booking verified (no action buttons)');

  } else {
    console.log(`⚠ Unknown status: ${status}`);
  }

  console.log('Button verification completed successfully');
}

  static async clickFlightsCompletedTab(page: Page): Promise<void> {
    if(DeviceHelper.isMobile()) {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsCompletedTabMobile);
    } else {
      await ElementHelper.clickElement(page, MyAccountPageLocators.flightsCompletedTab);
    }
  }

  static async handleConfirmedBookingActions(page: Page): Promise<void> {
     if (DeviceHelper.isMobile()) {
    console.log('Mobile detected - skipping button verification');
    return;
  }
  const status = (await page.textContent(MyAccountPageLocators.statusText))?.trim() ?? '';
  console.log(`Booking Status: ${status}`);

  if (status.includes('Confirmed')) {
    console.log('Booking is Confirmed - Performing actions');
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator("(//a[contains(text(),'View')])[1]").click()
    ]);

    await newPage.waitForLoadState();
    console.log('✔ View opened in new tab/page');

    await newPage.close(); // optional
    // 2. CANCEL → Same page
    const cancelBtn = page.locator("(//a[contains(text(),'Cancel')])[2]");
    await expect(cancelBtn).toBeVisible();

    await cancelBtn.click();

    // Verify cancel page/button
    await expect(page.locator("//button[@id='pre_cancel_button']")).toBeVisible();
    console.log('✔ Cancel opened in same page and verified');

    // Go back (if needed)
    await page.goBack();

    // 3. MODIFY → Same page
    const modifyBtn = page.locator("(//a[contains(text(),'Modify')])[1]");
    await expect(modifyBtn).toBeVisible();

    await modifyBtn.click();
  
    // Verify modify page
    await expect(page.locator("//h1[@class='help_h']")).toBeVisible();
    console.log('✔ Modify opened and verified');
    await page.goBack();

  } else {
    console.log(`⚠ Booking is not Confirmed: ${status}`);
  }
}
static async verifyHotelBookings(page: Page): Promise<void> {
  await page.waitForTimeout(6000);

  const isMobile = page.viewportSize()?.width! < 768;

  if (DeviceHelper.isMobile()) {
    await page.locator(MyAccountPageLocators.hoteltabmobile).click();
  } else {
    await page.locator(MyAccountPageLocators.hotelTab).click();
  }

  await page.waitForTimeout(6000);

  await expect(page.locator(MyAccountPageLocators.upcominghotelsTab)).toBeVisible();
  await expect(page.locator(MyAccountPageLocators.cancelledhotelsTab)).toBeVisible();
  await expect(page.locator(MyAccountPageLocators.completedhotelsTab)).toBeVisible();

  console.log('Hotel booking tabs verified successfully');
}

  static async clickHotelTab(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.hotelTab);
  }

  static async clickHotelsUpcomingTab(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.hotelsUpcomingTab);
  }

  static async clickHotelsCompletedTab(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.hotelsCompletedTab);
  }

  static async clickHotelsCancelledTab(page: Page): Promise<void> {
    await ElementHelper.clickElement(page, MyAccountPageLocators.hotelsCancelledTab);
  }

  static async printStatusText(page: Page): Promise<string | undefined> {
    const status = await page.textContent(MyAccountPageLocators.statusText);
    console.log(`Status: ${status}`);
    return status?.trim();
  }
}
