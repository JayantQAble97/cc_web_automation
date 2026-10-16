import { ElementHandle, expect, Page } from '@playwright/test';
import { CommonHelper } from './commonHelper';

export class ElementHelper {


  static async hoverOverMenu(page: Page, menuLocatorSelector: string, retries: number = 3): Promise<void> {
    const menuItem = page.locator(menuLocatorSelector);
    let attempt = 0;
    while (attempt < retries) {
      try {
        console.log(`Hovering over menu item with selector: ${menuLocatorSelector}`);
        await menuItem.hover();
        return;
      } catch {
        attempt++;
      }
    }
    console.error(`Failed to hover after ${retries} attempts: ${menuLocatorSelector}`);
  }

 
  static async clickElement(page: any, selector: any, timeout = 30000) {
    await page.waitForLoadState('domcontentloaded');
    await this.scrollElementToCentre(page, selector);
    await page.waitForSelector(selector, { state: 'visible', timeout });
    await page.waitForTimeout(500); 
    await page.click(selector, { force: true });
    console.log(`Clicked on element: ${selector}`);
  }

  static async clearTextField(page: Page, locatorValue: string): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    await this.scrollElementToCentre(page, locatorValue);
    console.log(`Clear value from "${locatorValue}" text field`);
    const element = await page.waitForSelector(locatorValue);
    await element.fill('');
  }

  static async clearAndEnterInTextField(page: Page, locatorValue: string, textToEnter: string): Promise<void> {
    console.log(`Clear value from "${locatorValue}" text field and enter text "${textToEnter}"`);
    await page.waitForLoadState('domcontentloaded');
    const element = await page.waitForSelector(locatorValue);
    await this.scrollElementToCentre(page, locatorValue);
    await element.fill(''); // Clears the text field.
    await element.fill(textToEnter); // Enters the specified text.
  }

    static async clearAndTypeInTextField(page: Page, locatorValue: string, textToEnter: string): Promise<void> {
    console.log(`Clear value from "${locatorValue}" text field and enter text "${textToEnter}"`);
    await page.waitForLoadState('domcontentloaded');
    const element = await page.waitForSelector(locatorValue);
    await element.fill(''); // Clears the text field.
    await element.type(textToEnter); // Enters the specified text.
  }

  static async clickElementWithRetry(page: Page, selector: string, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await page.locator(selector).click();
        return;
      } catch (error) {
        if (i === retries - 1) {
          throw error; // Re-throw error after max retries
        }
      }
    }
  }

  static async getAttributeValue(page: Page, locatorValue: string, attributeName: string): Promise<string | null> {
    const element = await page.locator(locatorValue);
    const attributeValue = await element.getAttribute(attributeName);
    console.log(`Attribute "${attributeName}" value is: ${attributeValue}`);
    return attributeValue;
  }

  static async selectOptionByValue(page: Page, locatorValue: string, value: string): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ value });
    console.log(`INFO: Selected "${value}" from dropdown.`);
  }

  static async selectOptionByIndex(page: Page, locatorValue: string, index: number): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ index });
    console.log(`INFO: Selected option at index "${index}" from dropdown.`);
  }

  static async selectOptionByVisibleText(page: Page, locatorValue: string, visibleText: string): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ label: visibleText });
    console.log(`INFO: Selected "${visibleText}" from dropdown.`);
  }

  static async scrollToElement(page: Page, locatorValue: string): Promise<void> {
    const element = await page.locator(locatorValue);
    await element.scrollIntoViewIfNeeded();
    console.log(`Scrolled to element with locator: "${locatorValue}"`);
  }

  static async scrollElementToCentre(page: Page, locatorValue: string): Promise<void> {
  const element = page.locator(locatorValue);

  await element.waitFor({ state: 'visible' });

  await element.evaluate((el) => {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  });

  console.log(`Scrolled element to center with locator: "${locatorValue}"`);
  await page.waitForTimeout(500); // Optional: wait for scroll animation to complete
  }

  static async scrollByAmount(page: Page, x: number, y: number): Promise<void> {
    await page.evaluate(([scrollX, scrollY]) => {
      window.scrollBy(scrollX, scrollY);
    }, [x, y]);
    console.log(`Scrolled by amount x: ${x}, y: ${y}`);
  }

  static async getTextFromElement(page: Page, locator: string): Promise<string | null> {
    const element = await page.locator(locator);
    return await element.textContent();
  }

  static async isElementDisplayed(page: Page, locator: string): Promise<boolean> {
    await page.waitForLoadState('domcontentloaded');
    const element = await page.locator(locator);
    return await element.isVisible();
  }

  static async isElementEnabled(page: Page, locator: string): Promise<boolean> {
    await page.waitForLoadState('domcontentloaded');
    const element = await page.locator(locator);
    return await element.isEnabled();
  }

  static async getElementAttribute(page: Page, locator: string, attribute: string): Promise<string | null> {
    const element = await page.locator(locator);
    return await element.getAttribute(attribute);
  }

  static async waitForElementVisible(page: Page, locator: string, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    const element = page.locator(locator);

    console.log(`Attempt 1: Waiting for element '${locator}' to be visible...`);
    try {
      await element.waitFor({ state: 'visible', timeout });
      console.log(`Element '${locator}' is visible on first attempt`);
    } catch (firstError) {
      console.warn(`Element '${locator}' not visible on first attempt. Refreshing the page...`);

      // await page.reload();
      await page.waitForTimeout(100000);

      console.log(`Attempt 2: Waiting for element '${locator}' after refresh...`);
      try {
        await element.waitFor({ state: 'visible', timeout });
        console.log(`Element '${locator}' is visible after page refresh`);
      } catch (secondError) {
        console.error(`Element '${locator}' still not visible`);
        throw new Error(`Element '${locator}' not found after 2 attempts`);
      }
    }
  }
 static async selectDropdown(
  page: Page,
  locator: string,
  option: string | number
): Promise<void> {
  await this.waitForElementClickable(page, locator);

  if (typeof option === 'number') {
    await page.locator(locator).selectOption({ index: option });
  } else {
    await page.locator(locator).selectOption(option);
  }
}

  static async waitForElementVisibleWithoutReload(page: Page, locator: string): Promise<void> {
    const element = page.locator(locator);
  
    console.log(`⏳ Waiting indefinitely for element '${locator}' to become visible...`);
  
    while (!(await element.isVisible())) {
      await page.waitForTimeout(1000);
    }
  
    console.log(`✅ Element '${locator}' is now visible`);
  }

  static async waitForElementClickable(page: Page, locator: string): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    const element = page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await expect(element).toBeEnabled({ timeout: 30000 });
    await expect(element).toBeVisible({ timeout: 15000 });
  }

  static async doubleClickElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.dblclick();
  }

  static async rightClickElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.click({ button: 'right' });
  }

  static async getElementTagName(page: Page, locator: string): Promise<string> {
    const element = await page.locator(locator);
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    return tagName;
  }

  static async getElementPosition(page: Page, locator: string): Promise<{ x: number, y: number }> {
    const element = await page.locator(locator);
    const box = await element.boundingBox();
    return { x: box?.x || 0, y: box?.y || 0 };
  }

  static async isElementPresent(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.count() > 0;
  }

  static async isElementInvisible(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return !(await element.isVisible());
  }

  static async waitForElementToDisappear(page: Page, locator: string, timeout: number = 30000): Promise<void> {
    const element = page.locator(locator);
    try {
      await page.waitForLoadState('domcontentloaded');
      await element.waitFor({ state: 'hidden', timeout });
      console.log(`Element '${locator}' has disappeared (hidden or detached).`);
    } catch (error) {
      console.error(`Element '${locator}' did not disappear within ${timeout}ms.`, error);
      throw error;
    }
  }

  static async getElementTextLength(page: Page, locator: string): Promise<number> {
    const element = await page.locator(locator);
    const text = await element.textContent();
    return text ? text.length : 0;
  }

  static async setElementFocus(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.focus();
  }

  static async isElementFocused(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.evaluate(el => el === document.activeElement);
  }

  static async getElementValue(page: Page, locator: string): Promise<string> {
    const element = await page.locator(locator);
    return await element.inputValue();
  }

  static async dragAndDropElement(page: Page, sourceLocator: string, targetLocator: string): Promise<void> {
    const source = await page.locator(sourceLocator);
    const target = await page.locator(targetLocator);
    await source.dragTo(target);
  }

  static async highlightElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.evaluate(el => {
      el.style.border = '2px solid red';
    });
  }

  static async acceptAlert(page: Page): Promise<void> {
    const alert = await page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        await dialog.accept();
        console.log('Alert accepted');
      }
    });
  }

  static async dismissAlert(page: Page): Promise<void> {
    const alert = await page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        await dialog.dismiss();
        console.log('Alert dismissed');
      }
    });

  }
  static async getElementText(page: any, locator: any): Promise<string> {
    const element = await page.locator(locator); // Locate the element
    const text = await element.textContent(); // Retrieve the text content
    return text?.trim() || ''; // Return the text, trim any whitespace
  }
  static async isElementDraggable(page: Page, selector: string): Promise<boolean> {
    const element = await page.locator(selector);
    return await element.isVisible(); // Assumes visibility means it's draggable.
  }
  static async isContextMenuVisible(page: Page, selector: string): Promise<boolean> {
    await page.locator(selector).click({ button: 'right' });
    return await page.locator('css=div.context-menu').isVisible(); // Replace with your context menu locator
  }

  // Context Menu Item Count
  static async getContextMenuItemCount(page: Page): Promise<number> {
    return await page.locator('css=div.context-menu-item').count(); // Replace with your context menu item locator
  }
  static async findElements(page: Page, locatorValue: string): Promise<ElementHandle[]> {
    const elements = await page.locator(locatorValue).elementHandles();
    console.log(`INFO: Found ${elements.length} elements with locator: "${locatorValue}"`);
    return elements;
  }

  static async isElementDisabled(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    return !(await element.isEnabled());
  }

  static async waitForElementToDisappearSynthetic(page: Page, locator: string, timeout: number = 30000): Promise<void> {
    const element = page.locator(locator);

    try {
      await element.waitFor({ state: 'hidden', timeout });  // More resilient than 'detached'
      console.log(`Element '${locator}' has disappeared (hidden or detached).`);
    } catch (error) {
      console.error(`Element '${locator}' did not disappear within ${timeout}ms.`, error);
      throw error;
    }
  }

  static async waitForElementClickableSynthetic(page: Page, locator: string): Promise<void> {
    const element = page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await expect(element).toBeEnabled({ timeout: 10000 });
    await expect(element).toBeVisible({ timeout: 15000 });
  }

  static async waitForElementVisibleSynthetic(page: Page, locator: string, timeout: number = 30000): Promise<void> {
    const element = page.locator(locator);

    console.log(`Attempt 1: Waiting for element '${locator}' to be visible...`);
    try {
      await element.waitFor({ state: 'visible', timeout });
      console.log(`Element '${locator}' is visible on first attempt`);
    } catch (firstError) {
      console.warn(`Element '${locator}' not visible on first attempt. Refreshing the page...`);

      await page.reload();
      await page.waitForTimeout(3000); // Optional buffer

      console.log(`Attempt 2: Waiting for element '${locator}' after refresh...`);
      try {
        await element.waitFor({ state: 'visible', timeout });
        console.log(`Element '${locator}' is visible after page refresh`);
      } catch (secondError) {
        console.error(`Element '${locator}' still not visible after page refresh.`);
        throw new Error(`Element '${locator}' not found after 2 attempts`);
      }
    }
  }

  static async hoverOverMenuSynthetic(page: Page, menuLocatorSelector: string, retries: number = 3, timeout: number = 30000): Promise<void> {
    const menuItem = page.locator(menuLocatorSelector);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Waiting for and hovering over menu item: ${menuLocatorSelector}`);

        // Wait for element to be attached in DOM
        await menuItem.waitFor({ state: 'attached', timeout });

        //  Wait for it to be visible
        await menuItem.waitFor({ state: 'visible', timeout });

        // Perform hover
        await menuItem.hover();
        console.log(`Hover successful on attempt ${attempt}`);
        return;
      } catch (error) {
       // console.warn(`Attempt ${attempt} failed: ${error.message}`);

        if (attempt < retries) {
          console.log('Refreshing page and retrying...');
          await page.reload(); // Refresh the page
          await page.waitForTimeout(30000); // Optional: brief pause after reload
        }
      }
    }

    throw new Error(`❌ Failed to hover over menu item after ${retries} attempts: ${menuLocatorSelector}`);
  }

  static expectedText: string = '';
  static actualText: string = '';
  
  static async getExpectedTextFromLocator(
    page: any,
    selector: any,
    timeout = 30000
  ) {
    const element =
      typeof selector === 'string'
        ? page.locator(selector).first()
        : selector.first();
  
    // await element.waitFor({ state: 'visible', timeout });
  
    const text =
      (await element.inputValue().catch(() => null)) ??
      (await element.textContent()) ??
      '';
  
    this.expectedText = text.trim();
  
    console.log(`Expected Text: "${this.expectedText}"`);
  }
  
  static async getActualTextFromLocator(
    page: any,
    selector: any,
    timeout = 30000
  ) {
    const element =
      typeof selector === 'string'
        ? page.locator(selector).first()
        : selector.first();
  
    // await element.waitFor({ state: 'visible', timeout });
  
    const text =
      (await element.inputValue().catch(() => null)) ??
      (await element.textContent()) ??
      '';
  
    this.actualText = text.trim();
  
    console.log(`Actual Text: "${this.actualText}"`);
  }
  
  static async compareBothResultAndAddedInConsole() {
    if (this.expectedText === this.actualText) {
      console.log(
        `✅ Text matched. Expected: "${this.expectedText}", Actual: "${this.actualText}"`
      );
    } else {
      console.log(
        `❌ Text NOT matched. Expected: "${this.expectedText}", Actual: "${this.actualText}"`
      );
    }
  }



}