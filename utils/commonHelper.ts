import { Page, test } from '@playwright/test';


export class CommonHelper {
  static async navigateToHomePage(page: Page): Promise<void> {
    try {
      const projectName = test.info().project.name;
      console.log(
        `Navigating to Home Page of :${projectName}`
      );

      await page.goto('', { waitUntil: 'domcontentloaded' });
    } catch (error) {
      const projectName = test.info().project.name;
      const testTitle = test.info().title;

      console.error(
        ` ${projectName}› Error navigating to home page: ${(error as Error).message}`
      );
    }
    
  }

  static async navigateToPage(page: any, url: string): Promise<void> {

    await page.goto(('/'), { waitUntil: 'domcontentloaded' });
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

  }
  static generateRandomPassword(length: number = 20): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }
  
  static generateRandomName(
        length: number = 6,
        characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      ): string {
        let result = '';

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
      }
        return result;
    }

  static async waitForNavigation(page: any, timeout: number = 30000) {
    await page.waitForNavigation({ timeout });
    console.log('Navigation completed.');
  }
  static async checkSubmenuVisibility(page: any, submenuLocator: string): Promise<boolean> {
    const element = await page.locator(submenuLocator);  // Use the locator passed as an argument
    const isVisible = await element.isVisible();
    await element.waitFor({ state: 'visible', timeout: 30000 });
    console.log(`Submenu visibility for ${submenuLocator}: ${isVisible ? 'Visible' : 'Not visible'}`);
    return isVisible;
  }

  static async verifyUrl(page: any, expectedUrl: string, timeout: number = 30000): Promise<void> {
    await page.waitForNavigation({ timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const redirectedUrl = page.url();
    if (redirectedUrl !== expectedUrl) {
      throw new Error(`Expected URL ${expectedUrl}, but got ${redirectedUrl}`);
    }
    console.log(`Test Passed: Redirected URL matches the expected URL: ${expectedUrl}`);
  }
  static async scrollAndClickElement(page: any, selector: string, timeout: number = 30000): Promise<void> {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout });
      await page.evaluate((selector: string): void => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, selector);
      await page.click(selector);
      console.log(`Scrolled to and clicked on element: ${selector}`);
    } catch (error) {
      console.error(`Error scrolling to and clicking on element: ${selector}`, error);
      throw new Error(`Unable to scroll to and click on element: ${selector}`);
    }
  }

  static async getButtonText(page: any, locator: string) {
    const text = await page.locator(locator);
    return await text.innerText();
  }

  //window and browser related methods are available in browserHelper.ts use from there  
  static async getCurrentWindowHandle(page: any): Promise<string> {
    const context = page.context();
    return context.pages()[0].url();
  }
  //window and browser related methods are available in browserHelper.ts use from there  
  static async createNewWindow(page: any): Promise<void> {
    await page.context().newPage();
  }
  //window and browser related methods are available in browserHelper.ts use from there
  static async switchToWindow(page: any, windowHandle: string): Promise<void> {
    const context = page.context();
    const allPages = context.pages();
    const newPage = allPages.find((p: any) => p.url() !== page.url()); // Specify type for 'p'
    if (newPage) {
      await newPage.bringToFront();
    }
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async closeWindow(page: any): Promise<void> {
    await page.close();
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async closeTab(page: any): Promise<void> {
    await page.close();
    console.log('Tab closed');
  }

  static async clickOutside(page: any, timeout: number = 30000): Promise<void> {
    await page.click('body');
    console.log('Clicked outside the element');
  }

  static async switchToFrame(page: any, frameName: string): Promise<void> {
    const frame = page.frame({ name: frameName });
    if (frame) {
      await frame.bringToFront();
    } else {
      throw new Error(`Frame ${frameName} not found.`);
    }
  }

  static async switchToDefault(page: any): Promise<void> {
    await page.frame({ name: null }).bringToFront();
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async getWindowWidth(page: any): Promise<number> {
    const viewportSize = page.viewportSize();
    return viewportSize ? viewportSize.width : 0;
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async getWindowHeight(page: any): Promise<number> {
    const viewportSize = page.viewportSize();
    return viewportSize ? viewportSize.height : 0;
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async setWindowSize(page: any, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async maximizeWindow(page: any): Promise<void> {
    await page.setViewportSize({ width: 1920, height: 1080 });
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async minimizeWindow(page: any): Promise<void> {
    await page.setViewportSize({ width: 800, height: 600 });
  }
  // Window and browser-related methods are available in browserHelper.ts. 
  // Please use those methods from there instead of using them from commonHelper. 
  // Note: The methods in commonHelper will be removed after January 1st.
  static async fullScreenWindow(page: any): Promise<void> {
    await page.setViewportSize({ width: 1920, height: 1080 });
  }
  static generateRandomString(length: number = 8): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }

  // Generates a random number within a given range
  static generateRandomNumber(min: number = 1000, max: number = 9999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generates a unique timestamp
  static generateTimestamp(): string {
    return new Date().toISOString(); // Example: '2024-11-28T08:00:00.000Z'
  }

  // Combines random string, number, and timestamp to create a unique identifier
  static generateUniqueIdentifier(): string {
    const randomString = this.generateRandomString();
    const randomNumber = this.generateRandomNumber();
    const timestamp = this.generateTimestamp();
    return `${randomString}_${randomNumber}_${timestamp}`;
  }
  // Perform a keyboard action (e.g., press a specific key)
  static async performKeyboardAction(page: any, key: string): Promise<void> {
    await page.keyboard.press(key);
    console.log(`Successfully pressed the "${key}" key.`);
  }
  static async dragAndDropElement(page: any, sourceSelector: string, targetSelector: string): Promise<void> {
    const source = await page.locator(sourceSelector);
    const target = await page.locator(targetSelector);
    await source.dragTo(target);
  }
  static async pressEnterKey(page: any, selector: string): Promise<void> {
    const element = await page.locator(selector);
    await element.focus();
    await page.keyboard.press('Enter');
  }
}
