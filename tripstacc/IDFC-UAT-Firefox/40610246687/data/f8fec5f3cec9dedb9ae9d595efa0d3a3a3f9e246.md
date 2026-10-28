# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TripStacc/tests/FlightPage.test.ts >> TC-37983 Verify mandatory field validation for passenger details
- Location: TripStacc/tests/FlightPage.test.ts:1699:5

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { ElementHandle, expect, Page } from '@playwright/test';
  2   | import { CommonHelper } from './commonHelper';
  3   | 
  4   | export class ElementHelper {
  5   | 
  6   | 
  7   |   static async hoverOverMenu(page: Page, menuLocatorSelector: string, retries: number = 3): Promise<void> {
  8   |     const menuItem = page.locator(menuLocatorSelector);
  9   |     let attempt = 0;
  10  |     while (attempt < retries) {
  11  |       try {
  12  |         console.log(`Hovering over menu item with selector: ${menuLocatorSelector}`);
  13  |         await menuItem.hover();
  14  |         return;
  15  |       } catch {
  16  |         attempt++;
  17  |       }
  18  |     }
  19  |     console.error(`Failed to hover after ${retries} attempts: ${menuLocatorSelector}`);
  20  |   }
  21  | 
  22  |  
  23  |   static async clickElement(page: any, selector: any, timeout = 30000) {
  24  |     await page.waitForLoadState('domcontentloaded');
  25  |     await this.scrollElementToCentre(page, selector);
  26  |     await page.waitForSelector(selector, { state: 'visible', timeout });
> 27  |     await page.waitForTimeout(500); 
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  28  |     await page.click(selector, { force: true });
  29  |     console.log(`Clicked on element: ${selector}`);
  30  |   }
  31  | 
  32  |   static async clearTextField(page: Page, locatorValue: string): Promise<void> {
  33  |     await page.waitForLoadState('domcontentloaded');
  34  |     await this.scrollElementToCentre(page, locatorValue);
  35  |     console.log(`Clear value from "${locatorValue}" text field`);
  36  |     const element = await page.waitForSelector(locatorValue);
  37  |     await element.fill('');
  38  |   }
  39  | 
  40  |   static async clearAndEnterInTextField(page: Page, locatorValue: string, textToEnter: string): Promise<void> {
  41  |     console.log(`Clear value from "${locatorValue}" text field and enter text "${textToEnter}"`);
  42  |     await page.waitForLoadState('domcontentloaded');
  43  |     const element = await page.waitForSelector(locatorValue);
  44  |     await this.scrollElementToCentre(page, locatorValue);
  45  |     await element.fill(''); // Clears the text field.
  46  |     await element.fill(textToEnter); // Enters the specified text.
  47  |   }
  48  | 
  49  |     static async clearAndTypeInTextField(page: Page, locatorValue: string, textToEnter: string): Promise<void> {
  50  |     console.log(`Clear value from "${locatorValue}" text field and enter text "${textToEnter}"`);
  51  |     await page.waitForLoadState('domcontentloaded');
  52  |     const element = await page.waitForSelector(locatorValue);
  53  |     await element.fill(''); // Clears the text field.
  54  |     await element.type(textToEnter); // Enters the specified text.
  55  |   }
  56  | 
  57  |   static async clickElementWithRetry(page: Page, selector: string, retries: number = 3): Promise<void> {
  58  |     for (let i = 0; i < retries; i++) {
  59  |       try {
  60  |         await page.locator(selector).click();
  61  |         return;
  62  |       } catch (error) {
  63  |         if (i === retries - 1) {
  64  |           throw error; // Re-throw error after max retries
  65  |         }
  66  |       }
  67  |     }
  68  |   }
  69  | 
  70  |   static async getAttributeValue(page: Page, locatorValue: string, attributeName: string): Promise<string | null> {
  71  |     const element = await page.locator(locatorValue);
  72  |     const attributeValue = await element.getAttribute(attributeName);
  73  |     console.log(`Attribute "${attributeName}" value is: ${attributeValue}`);
  74  |     return attributeValue;
  75  |   }
  76  | 
  77  |   static async selectOptionByValue(page: Page, locatorValue: string, value: string): Promise<void> {
  78  |     const dropdown = await page.locator(locatorValue);
  79  |     await dropdown.selectOption({ value });
  80  |     console.log(`INFO: Selected "${value}" from dropdown.`);
  81  |   }
  82  | 
  83  |   static async selectOptionByIndex(page: Page, locatorValue: string, index: number): Promise<void> {
  84  |     const dropdown = await page.locator(locatorValue);
  85  |     await dropdown.selectOption({ index });
  86  |     console.log(`INFO: Selected option at index "${index}" from dropdown.`);
  87  |   }
  88  | 
  89  |   static async selectOptionByVisibleText(page: Page, locatorValue: string, visibleText: string): Promise<void> {
  90  |     const dropdown = await page.locator(locatorValue);
  91  |     await dropdown.selectOption({ label: visibleText });
  92  |     console.log(`INFO: Selected "${visibleText}" from dropdown.`);
  93  |   }
  94  | 
  95  |   static async scrollToElement(page: Page, locatorValue: string): Promise<void> {
  96  |     const element = await page.locator(locatorValue);
  97  |     await element.scrollIntoViewIfNeeded();
  98  |     console.log(`Scrolled to element with locator: "${locatorValue}"`);
  99  |   }
  100 | 
  101 |   static async scrollElementToCentre(page: Page, locatorValue: string): Promise<void> {
  102 |   const element = page.locator(locatorValue);
  103 | 
  104 |   await element.waitFor({ state: 'visible' });
  105 | 
  106 |   await element.evaluate((el) => {
  107 |     el.scrollIntoView({
  108 |       behavior: 'smooth',
  109 |       block: 'center',
  110 |       inline: 'center'
  111 |     });
  112 |   });
  113 | 
  114 |   console.log(`Scrolled element to center with locator: "${locatorValue}"`);
  115 |   await page.waitForTimeout(500); // Optional: wait for scroll animation to complete
  116 |   }
  117 | 
  118 |   static async scrollByAmount(page: Page, x: number, y: number): Promise<void> {
  119 |     await page.evaluate(([scrollX, scrollY]) => {
  120 |       window.scrollBy(scrollX, scrollY);
  121 |     }, [x, y]);
  122 |     console.log(`Scrolled by amount x: ${x}, y: ${y}`);
  123 |   }
  124 | 
  125 |   static async getTextFromElement(page: Page, locator: string): Promise<string | null> {
  126 |     const element = await page.locator(locator);
  127 |     return await element.textContent();
```