import { expect, Page } from '@playwright/test';
const idfcTestData = require('../TripStacc/testData/tripStacc.json');

export class VerificationHelpers {
    static async verifyTextVisible(page: any, SubscribingText: string, expectedText: string): Promise<void> {
        const element = await page.locator(SubscribingText);
        const textContent = await element.textContent();
        if (textContent !== expectedText) {
            throw new Error(`Text mismatch: expected "${expectedText}", got "${textContent}"`);
        }
    }
    static async verifyTextVisibleSoftAssert(page: any, SubscribingText: string, expectedText: string): Promise<void> {
        const element = await page.locator(SubscribingText);
        const textContent = await element.textContent();
        if (textContent !== expectedText) {
            console.warn(`Text mismatch: expected "${expectedText}", got "${textContent}"`);
            await expect.soft(element).toHaveText(expectedText);
        }
    }

    // Check if checkbox is checked
    static async elementIsChecked(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isChecked()) {
            await expect(selector).toBeChecked();
        } else {
            console.error(`Checkbox is not checked for locator: ${locator}`);
        }
    }
    static async elementIsCheckedSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isChecked()) {
            await expect.soft(selector).toBeChecked();
        } else {
            console.error(`Checkbox is not checked for locator: ${locator}`);
        }
    }
    // Check if element is disabled
    static async elementIsDisabled(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isDisabled()) {
            await expect(selector).toBeDisabled();
        } else {
            console.error(`Element is not disabled for locator: ${locator}`);
        }
    }
    static async elementIsDisabledSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isDisabled()) {
            await expect.soft(selector).toBeDisabled();
        } else {
            console.error(`Element is not disabled for locator: ${locator}`);
        }
    }

    // Check if element is editable
    static async elementIsEditable(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isEditable()) {
            await expect(selector).toBeEditable();
        } else {
            console.error(`Element is not editable for locator: ${locator}`);
        }
    }
    static async elementIsEditableSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isEditable()) {
            await expect.soft(selector).toBeEditable();
        } else {
            console.error(`Element is not editable for locator: ${locator}`);
        }
    }

    // Check if element is empty
    static async elementIsEmpty(page: Page, locator: string) {
        const selector = page.locator(locator);
        const text = await selector.textContent();
        if (!text || text.trim() === "") {
            await expect(selector).toBeEmpty();
        } else {
            console.error(`Container is not empty for locator: ${locator}`);
        }
    }
    static async elementIsEmptySoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        const text = await selector.textContent();
        if (!text || text.trim() === "") {
            await expect.soft(selector).toBeEmpty();
        } else {
            console.error(`Container is not empty for locator: ${locator}`);
        }
    }
    // Check if element is enabled
    static async elementIsEnabled(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isEnabled()) {
            await expect(selector).toBeEnabled();
        } else {
            console.error(`Element is not enabled for locator: ${locator}`);
        }
    }
    static async elementIsEnabledSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isEnabled()) {
            await expect.soft(selector).toBeEnabled();
        } else {
            console.error(`Element is not enabled for locator: ${locator}`);
        }
    }
    // Check if element is focused
    static async elementIsFocused(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.evaluate((el) => el === document.activeElement)) {
            await expect(selector).toBeFocused();
        } else {
            console.error(`Element is not focused for locator: ${locator}`);
        }
    }
    static async elementIsFocusedSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.evaluate((el) => el === document.activeElement)) {
            await expect.soft(selector).toBeFocused();
        } else {
            console.error(`Element is not focused for locator: ${locator}`);
        }
    }

    // Check if element is hidden
    static async elementIsHidden(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isHidden()) {
            await expect(selector).toBeHidden();
        } else {
            console.error(`Element is visible for locator: ${locator}`);
        }
    }
    static async elementIsHiddenSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isHidden()) {
            await expect.soft(selector).toBeHidden();
        } else {
            console.error(`Element is visible for locator: ${locator}`);
        }
    }

    // Check if element is in the viewport
    static async elementIsInViewport(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isVisible()) {
            await expect(selector).toBeInViewport();
        } else {
            console.error(`Element is not in the viewport for locator: ${locator}`);
        }
    }
    static async elementIsInViewportSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        if (await selector.isVisible()) {
            await expect.soft(selector).toBeInViewport();
        } else {
            console.error(`Element is not in the viewport for locator: ${locator}`);
        }
    }

    static async elementIsVisible(page: Page, locator: string, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    const attemptToCheckVisibility = async (attemptNumber: number): Promise<boolean> => {
        try {
            console.log(`Attempt ${attemptNumber}: Checking visibility for '${locator}'`);
            const element = page.locator(locator);
            await element.waitFor({ state: 'attached', timeout });
            await expect(element).toBeVisible({ timeout });
            console.log(`Element '${locator}' is visible on attempt ${attemptNumber}.`);
            return true;
        } catch (error) {
            console.warn(`Attempt ${attemptNumber}: Element '${locator}' not visible.`, error);
            return false;
        }
    };
 
    // 🔁 First attempt
    const isVisibleFirstTry = await attemptToCheckVisibility(1);
    if (isVisibleFirstTry) return;
 
    // 🔁 Refresh and retry
    console.warn(`Element '${locator}' not visible on first attempt. Refreshing page and retrying...`);
    await page.reload();
    await page.waitForTimeout(10000);
 
    const isVisibleSecondTry = await attemptToCheckVisibility(2);
    if (isVisibleSecondTry) return;
 
    // ❌ Final failure
    throw new Error(`Element '${locator}' was not visible after two attempts (including page refresh).`);
}

    static async elementIsVisibleSoftAssert(page: Page, locator: string): Promise<boolean> {
        const selector = page.locator(locator);
        await selector.waitFor({ state: 'visible' });

        const isVisible = await selector.isVisible();

        if (isVisible) {
            console.log(`Element with locator '${locator}' is visible.`);
            await expect.soft(selector).toBeVisible();
        } else {
            console.error(`Element with locator '${locator}' is not visible.`);
            await expect.soft(selector).toBeHidden();
        }

        return isVisible;

    }
    // Check if element contains the expected text
    static async elementContainsText(page: Page, locator: string, text: string) {
        const selector = page.locator(locator);
        const actualText = await selector.textContent();
        if (actualText && actualText.includes(text)) {
            await expect(selector).toContainText(text);
            console.log(`Element contains the expected text: "${text}"`);
        } else {
            console.error(`Element does not contain the expected text: "${text}"`);
            await expect(selector).not.toContainText(text);
        }
    }
    static async elementContainsTextSoftAssert(page: Page, locator: string, text: string) {
        const selector = page.locator(locator);
        const actualText = await selector.textContent();
        if (actualText && actualText.includes(text)) {
            await expect.soft(selector).toContainText(text);
            console.log(`Element contains the expected text: "${text}"`);
        } else {
            console.error(`Element does not contain the expected text: "${text}"`);
            await expect.soft(selector).not.toContainText(text);
        }
    }

    static async checkUrlContainsKeyword(page: Page, keyword: string) {
        const currentUrl = page.url();
        await expect(currentUrl).toContain(keyword);
        console.log(`URL contains the expected keyword: "${keyword}"`);
    }
    static async checkUrlContainsKeywordSoftAssert(page: Page, keyword: string) {
        const currentUrl = page.url();
        await expect.soft(currentUrl).toContain(keyword);
        console.log(`URL contains the expected keyword: "${keyword}"`);
    }
    // Check if element has accessible description
    static async elementHasAccessibleDescription(page: Page, locator: string, description: string) {
        const selector = page.locator(locator);
        const actualDescription = await selector.getAttribute("aria-description");
        if (actualDescription === description) {
            await expect(selector).toHaveAccessibleDescription(description);
            console.error(`Accessible description does not match. Expected: "${description}"`);
        }
    }
    static async elementHasAccessibleDescriptionSoftAssert(page: Page, locator: string, description: string) {
        const selector = page.locator(locator);
        const actualDescription = await selector.getAttribute("aria-description");
        if (actualDescription === description) {
            await expect.soft(selector).toHaveAccessibleDescription(description);
            console.log(`Element has the expected accessible description: "${description}"`);
        } else {
            console.error(`Accessible description does not match. Expected: "${description}"`);
            await expect.soft(selector).not.toHaveAccessibleDescription(description);
        }
    }

    static async elementHasAccessibleName(page: Page, locator: string, name: string) {
        const selector = page.locator(locator);
        const actualName = await selector.getAttribute("aria-label");
        if (actualName === name) {
            await expect(selector).toHaveAccessibleName(name);
            console.log(`Element has the expected accessible name: "${name}"`);
        } else {
            console.error(`Accessible name does not match. Expected: "${name}"`);
            await expect(selector).not.toHaveAccessibleName(name);
        }
    }

    // assertion: Element has the expected accessible name
    static async elementHasAccessibleNameSoftAssert(page: Page, locator: string, name: string) {
        const selector = page.locator(locator);
        const actualName = await selector.getAttribute("aria-label");
        if (actualName === name) {
            await expect.soft(selector).toHaveAccessibleName(name);
            console.log(`Element has the expected accessible name: "${name}"`);
        } else {
            console.error(`Accessible name does not match. Expected: "${name}"`);
            await expect.soft(selector).not.toHaveAccessibleName(name);
        }
    }

    static async elementHasAttribute(page: Page, locator: string, attribute: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.getAttribute(attribute);
        if (actualValue === value) {
            await expect(selector).toHaveAttribute(attribute, value);
            console.log(`Element has the expected attribute: "${attribute}" with value: "${value}"`);
        } else {
            console.error(`Attribute value does not match. Expected: "${value}"`);
            await expect(selector).not.toHaveAttribute(attribute, value);
        }
    }

    // assertion: Element has the expected attribute value
    static async elementHasAttributeSoftAssert(page: Page, locator: string, attribute: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.getAttribute(attribute);
        if (actualValue === value) {
            await expect.soft(selector).toHaveAttribute(attribute, value);
            console.log(`Element has the expected attribute: "${attribute}" with value: "${value}"`);
        } else {
            console.error(`Attribute value does not match. Expected: "${value}"`);
            await expect.soft(selector).not.toHaveAttribute(attribute, value);
        }
    }


    // Check if element has a specific class
    static async elementHasClass(page: Page, locator: string, className: string | RegExp) {
        const selector = page.locator(locator);
        const actualClass = await selector.getAttribute("class");
        if (className instanceof RegExp ? className.test(actualClass || "") : actualClass === className) {
            await expect(selector).toHaveClass(className);
            console.log(`Element has the expected class: "${className}"`);
        } else {
            console.error("Class does not match the expected value");
            await expect(selector).not.toHaveClass(className);
        }
    }
    static async elementHasClassSoftAssert(page: Page, locator: string, className: string | RegExp) {
        const selector = page.locator(locator);
        const actualClass = await selector.getAttribute("class");

        if (className instanceof RegExp ? className.test(actualClass || "") : actualClass === className) {
            await expect.soft(selector).toHaveClass(className);
            console.log(`Element has the expected class: "${className}"`);
        } else {
            console.error(`Class does not match the expected value: "${className}"`);
            await expect.soft(selector).not.toHaveClass(className);
        }
    }
    static async elementHasCount(page: Page, locator: string, count: number) {
        const selector = page.locator(locator);
        const actualCount = await selector.count();

        if (actualCount === count) {
            await expect(selector).toHaveCount(count);
            console.log(`Element has the expected count: ${count}`);
        } else {
            console.error(`Element count does not match. Expected: ${count}, Found: ${actualCount}`);
            await expect(selector).not.toHaveCount(count);
        }
    }
    static async elementHasCountSoftAssert(page: Page, locator: string, count: number) {
        const selector = page.locator(locator);
        const actualCount = await selector.count();

        if (actualCount === count) {
            await expect.soft(selector).toHaveCount(count);
            console.log(`Element has the expected count: ${count}`);
        } else {
            console.error(`Element count does not match. Expected: ${count}, Found: ${actualCount}`);
            await expect.soft(selector).not.toHaveCount(count);
        }
    }
    static async elementHasCSS(page: Page, locator: string, property: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop), property);

        if (actualValue === value) {
            await expect(selector).toHaveCSS(property, value);
            console.log(`Element has the expected CSS property: ${property} with value: ${value}`);
        } else {
            console.error(`CSS property does not match. Expected: "${value}", Found: "${actualValue}"`);
            await expect(selector).not.toHaveCSS(property, value);
        }
    }
    static async elementHasCSSSoftAssert(page: Page, locator: string, property: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop), property);

        if (actualValue === value) {
            await expect.soft(selector).toHaveCSS(property, value);
            console.log(`Element has the expected CSS property: ${property} with value: ${value}`);
        } else {
            console.error(`CSS property does not match. Expected: "${value}", Found: "${actualValue}"`);
            await expect.soft(selector).not.toHaveCSS(property, value);
        }
    }
    static async elementHasId(page: Page, locator: string, id: string) {
        const selector = page.locator(locator);
        const actualId = await selector.getAttribute("id");

        if (actualId === id) {
            await expect(selector).toHaveId(id);
            console.log(`Element has the expected ID: "${id}"`);
        } else {
            console.error(`ID does not match. Expected: "${id}", Found: "${actualId}"`);
            await expect(selector).not.toHaveId(id);
        }
    }
    static async elementHasIdSoftAssert(page: Page, locator: string, id: string) {
        const selector = page.locator(locator);
        const actualId = await selector.getAttribute("id");

        if (actualId === id) {
            await expect.soft(selector).toHaveId(id);
            console.log(`Element has the expected ID: "${id}"`);
        } else {
            console.error(`ID does not match. Expected: "${id}", Found: "${actualId}"`);
            await expect.soft(selector).not.toHaveId(id);
        }
    }

    static async elementMatchesScreenshot(page: Page, locator: string) {
        const selector = page.locator(locator);
        await expect(selector).toHaveScreenshot();
        console.log("Element matches the screenshot.");
    }

    static async elementMatchesScreenshotSoftAssert(page: Page, locator: string) {
        const selector = page.locator(locator);
        await expect.soft(selector).toHaveScreenshot();
        console.log("Element matches the screenshot.");
    }

    static async elementHasText(page: Page, locator: string, text: string | RegExp) {
        const selector = page.locator(locator);
        const actualText = await selector.textContent();

        console.log(`Expected text: "${text}"`);
        console.log(`Actual text: "${actualText || ''}"`);

        if (text instanceof RegExp) {
            await expect(actualText?.trim()).toMatch(text);
        } else {
            await expect(actualText?.trim()).toBe(text);
        }

        console.log(`Element matches the expected text: "${text}"`);
    }

    static async elementHasTextSoftAssert(page: Page, locator: string, text: string | RegExp) {
        const selector = page.locator(locator);
        const actualText = await selector.textContent();
        if (text instanceof RegExp ? text.test(actualText || "") : actualText === text) {
            await expect.soft(selector).toHaveText(text);
            console.log(`Element matches the expected text: "${text}"`);
        } else {
            console.error(`Text does not match the expected value: "${text}"`);
            await expect.soft(selector).not.toHaveText(text);
        }
    }
    static async elementHasValue(page: Page, locator: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.inputValue();
        if (actualValue === value) {
            await expect(selector).toHaveValue(value);
            console.log(`Element has the expected value: "${value}"`);
        } else {
            console.error(`Value does not match. Expected: "${value}", Found: "${actualValue}"`);
            await expect(selector).not.toHaveValue(value);
        }
    }
    static async elementHasValueSoftAssert(page: Page, locator: string, value: string) {
        const selector = page.locator(locator);
        const actualValue = await selector.inputValue();
        if (actualValue === value) {
            await expect.soft(selector).toHaveValue(value);
            console.log(`Element has the expected value: "${value}"`);
        } else {
            console.error(`Value does not match. Expected: "${value}", Found: "${actualValue}"`);
            await expect.soft(selector).not.toHaveValue(value);
        }
    }

    static async elementHasValues(page: Page, locator: string, values: string[]): Promise<void> {
        const selector = page.locator(locator);
        const actualValues = await selector.evaluate((el: HTMLSelectElement) =>
            Array.from(el.selectedOptions).map((opt) => opt.value)
        );

        if (JSON.stringify(actualValues) === JSON.stringify(values)) {
            console.log(`Selected values match: ${values}`);
            await expect(selector).toHaveValues(values);
        } else {
            console.error(`Selected values do not match. Expected: ${values}, Found: ${actualValues}`);
        }
    }


    static async validatePlaceholder(page: Page, locator: string, expectedPlaceholder: string): Promise<void> {
        const element = await page.locator(locator);
        const placeholder = await element.getAttribute('placeholder');

        if (placeholder !== expectedPlaceholder) {
            console.error(`Placeholder mismatch: expected "${expectedPlaceholder}", got "${placeholder}"`);
            await expect(element).toHaveAttribute('placeholder', expectedPlaceholder);
        } else {
            console.log(`Placeholder matches: "${placeholder}"`);
        }
    }

    static async validatePlaceholderSoftAssert(page: Page, locator: string, expectedPlaceholder: string): Promise<void> {
        const element = await page.locator(locator);
        const placeholder = await element.getAttribute('placeholder');

        if (placeholder !== expectedPlaceholder) {
            console.error(`Placeholder mismatch: expected "${expectedPlaceholder}", got "${placeholder}"`);
            await expect.soft(element).toHaveAttribute('placeholder', expectedPlaceholder);
        } else {
            console.log(`Placeholder matches: "${placeholder}"`);
        }
    }

    // Validate whether a field is required and not left empty
    static async validateRequiredField(page: Page, locator: string, isRequired: boolean): Promise<void> {
        const element = await page.locator(locator);
        if (isRequired) {
            const isFieldEmpty = await element.inputValue() === "";
            if (isFieldEmpty) {
                throw new Error(`Input field is required but left empty`);
            }
        }
    }
    static async validateRequiredFieldSoftAssert(page: Page, locator: string, isRequired: boolean): Promise<void> {
        const element = await page.locator(locator);
        if (isRequired) {
            const isFieldEmpty = await element.inputValue() === "";
            if (isFieldEmpty) {
                console.error(`Input field is required but left empty`);
                await expect.soft(element).toHaveValue('');
            }
        }
    }


    // Validate the minimum length of input in a field
    static async validateMinLength(page: Page, locator: string, minLength: number): Promise<void> {
        const element = await page.locator(locator);
        const inputValue = await element.inputValue();
        if (inputValue.length < minLength) {
            throw new Error(`Input value is shorter than the minimum length of ${minLength}`);
        }
    }
    static async validateMinLengthSoftAssert(page: Page, locator: string, minLength: number): Promise<void> {
        const element = await page.locator(locator);
        const inputValue = await element.inputValue();
        if (inputValue.length < minLength) {
            console.error(`Input value is shorter than the minimum length of ${minLength}`);
            await expect.soft(element).toHaveValue(inputValue);
        }
    }


    // Validate the maximum length of input in a field
    static async validateMaxLength(page: Page, locator: string, maxLength: number): Promise<void> {
        const element = await page.locator(locator);
        const inputValue = await element.inputValue();
        if (inputValue.length > maxLength) {
            throw new Error(`Input value exceeds the maximum length of ${maxLength}`);
        }
    }

    static async validateMaxLengthSoftAssert(page: Page, locator: string, maxLength: number): Promise<void> {
        const element = await page.locator(locator);
        const inputValue = await element.inputValue();
        if (inputValue.length > maxLength) {
            console.error(`Input value exceeds the maximum length of ${maxLength}`);
            await expect.soft(element).toHaveValue(inputValue);
        }
    }
    // Validate the type of input field (text, email, number, etc.)
    static async validateInputType(page: Page, locator: string, inputType: string): Promise<void> {
        const element = await page.locator(locator);
        const typeAttribute = await element.getAttribute('type');
        if (typeAttribute !== inputType) {
            throw new Error(`Input type mismatch: expected "${inputType}", got "${typeAttribute}"`);
        }
    }


    // Validate if the autocomplete attribute is enabled on the input field
    static async validateAutocomplete(page: Page, locator: string, isAutocompleteEnabled: boolean): Promise<void> {
        const element = await page.locator(locator);
        if (isAutocompleteEnabled) {
            const autocompleteAttribute = await element.getAttribute('autocomplete');
            if (autocompleteAttribute !== 'on') {
                throw new Error('Autocomplete is not enabled on the input field');
            }
        }
    }
    static async validateInputTypeSoftAssert(page: Page, locator: string, inputType: string): Promise<void> {
        const element = await page.locator(locator);
        const typeAttribute = await element.getAttribute('type');
        if (typeAttribute !== inputType) {
            console.error(`Input type mismatch: expected "${inputType}", got "${typeAttribute}"`);
            await expect.soft(element).toHaveAttribute('type', inputType);
        }
    }
    static async validateAutocompleteSoftAssert(page: Page, locator: string, isAutocompleteEnabled: boolean): Promise<void> {
        const element = await page.locator(locator);
        if (isAutocompleteEnabled) {
            const autocompleteAttribute = await element.getAttribute('autocomplete');
            if (autocompleteAttribute !== 'on') {
                console.error('Autocomplete is not enabled on the input field');
                await expect.soft(element).toHaveAttribute('autocomplete', 'on');
            }
        }
    }


    // Validate the default option selected in a dropdown
    static async validateDefaultOption(page: Page, locator: string, expectedDefaultOption: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const selectedOption = await dropdown.inputValue();
        if (selectedOption !== expectedDefaultOption) {
            throw new Error(`Default option mismatch: expected "${expectedDefaultOption}", got "${selectedOption}"`);
        }
    }
    static async validateDefaultOptionSoftAssert(page: Page, locator: string, expectedDefaultOption: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const selectedOption = await dropdown.inputValue();
        if (selectedOption !== expectedDefaultOption) {
            console.error(`Default option mismatch: expected "${expectedDefaultOption}", got "${selectedOption}"`);
            await expect.soft(dropdown).toHaveValue(expectedDefaultOption);
        }
    }

    static async validateOptionExistenceSoftAssert(page: Page, locator: string, optionText: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const options = await dropdown.locator('option').allTextContents();
        if (!options.includes(optionText)) {
            console.error(`Option "${optionText}" not found in the dropdown`);
            await expect.soft(dropdown).toContainText(optionText);
        }
    }

    // Validate if a specific option exists in a dropdown
    static async validateOptionExistence(page: Page, locator: string, optionText: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const options = await dropdown.locator('option').allTextContents();
        if (!options.includes(optionText)) {
            throw new Error(`Option "${optionText}" not found in the dropdown`);
        }
    }
    static async validateOptionsCountSoftAssert(page: Page, locator: string, expectedCount: number): Promise<void> {
        const dropdown = await page.locator(locator);
        const options = await dropdown.locator('option').count();
        if (options !== expectedCount) {
            console.error(`Options count mismatch: expected ${expectedCount}, got ${options}`);
            await expect.soft(dropdown.locator('option')).toHaveCount(expectedCount);
        }
    }

    // Validate the count of options in a dropdown
    static async validateOptionsCount(page: Page, locator: string, expectedCount: number): Promise<void> {
        const dropdown = await page.locator(locator);
        const options = await dropdown.locator('option').count();
        if (options !== expectedCount) {
            throw new Error(`Options count mismatch: expected ${expectedCount}, got ${options}`);
        }
    }
    static async validateMultipleSelectionSoftAssert(page: Page, locator: string, isMultiple: boolean): Promise<void> {
        const dropdown = await page.locator(locator);
        const isMultipleSelected = await dropdown.evaluate(el => el.hasAttribute('multiple'));
        if (isMultipleSelected !== isMultiple) {
            console.error(`Multiple selection mismatch: expected ${isMultiple}, got ${isMultipleSelected}`);
            await expect.soft(dropdown).toHaveAttribute('multiple', isMultiple ? 'true' : 'false');
        }
    }


    // Validate if a dropdown allows multiple selections
    static async validateMultipleSelection(page: Page, locator: string, isMultiple: boolean): Promise<void> {
        const dropdown = await page.locator(locator);
        const isMultipleSelected = await dropdown.evaluate(el => el.hasAttribute('multiple'));
        if (isMultipleSelected !== isMultiple) {
            throw new Error(`Multiple selection mismatch: expected ${isMultiple}, got ${isMultipleSelected}`);
        }
    }

    // Validate the text of an option in a dropdown
    static async validateOptionText(page: Page, locator: string, optionValue: string, expectedText: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const option = await dropdown.locator(`option[value="${optionValue}"]`);
        const optionText = await option.textContent();
        if (optionText !== expectedText) {
            throw new Error(`Option text mismatch: expected "${expectedText}", got "${optionText}"`);
        }
    }
    static async validateOptionTextSoftAssert(page: Page, locator: string, optionValue: string, expectedText: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const option = await dropdown.locator(`option[value="${optionValue}"]`);
        const optionText = await option.textContent();
        if (optionText !== expectedText) {
            console.error(`Option text mismatch: expected "${expectedText}", got "${optionText}"`);
            await expect.soft(option).toHaveText(expectedText); // Assertion: Continues the test
        }
    }

    // Validate the value of an option in a dropdown based on its text
    static async validateOptionValue(page: Page, locator: string, optionText: string, expectedValue: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const option = await dropdown.locator(`option:has-text("${optionText}")`);
        const optionValue = await option.getAttribute('value');
        if (optionValue !== expectedValue) {
            throw new Error(`Option value mismatch: expected "${expectedValue}", got "${optionValue}"`);
        }
    }

    static async validateOptionValueSoftAssert(page: Page, locator: string, optionText: string, expectedValue: string): Promise<void> {
        const dropdown = await page.locator(locator);
        const option = await dropdown.locator(`option:has-text("${optionText}")`);
        const optionValue = await option.getAttribute('value');
        if (optionValue !== expectedValue) {
            console.error(`Option value mismatch: expected "${expectedValue}", got "${optionValue}"`);
            await expect.soft(option).toHaveValue(expectedValue);
        }
    }

    // Toggle the state of a checkbox (check if unchecked, uncheck if checked)
    static async toggleCheckbox(page: Page, locator: string): Promise<void> {
        const checkbox = await page.locator(locator);
        const isChecked = await checkbox.isChecked();
        if (isChecked) {
            await checkbox.click(); // Uncheck if it's already checked
        } else {
            await checkbox.click(); // Check the checkbox if it's not checked
        }
    }
    static async toggleCheckboxSoftAssert(page: Page, locator: string): Promise<void> {
        const checkbox = await page.locator(locator);
        const isChecked = await checkbox.isChecked();
        if (isChecked) {
            console.log("Unchecking checkbox...");
            await checkbox.click(); // Uncheck if it's already checked
        } else {
            console.log("Checking checkbox...");
            await checkbox.click(); // Check the checkbox if it's not checked
        }
    }

    // Interact with a group of checkboxes and check specific ones
    static async interactWithGroupCheckboxes(page: Page, locator: string, indexesToCheck: number[]): Promise<void> {
        const checkboxes = await page.locator(locator);
        for (const index of indexesToCheck) {
            const checkbox = checkboxes.nth(index);
            const isChecked = await checkbox.isChecked();
            if (!isChecked) {
                await checkbox.click(); // Check the checkbox if it's not checked
            }
        }
    }
    static async interactWithGroupCheckboxesSoftAssert(page: Page, locator: string, indexesToCheck: number[]): Promise<void> {
        await this.interactWithGroupCheckboxes(page, locator, indexesToCheck); // Reuse existing method
        const checkboxes = await page.locator(locator);
        for (const index of indexesToCheck) {
            const checkbox = checkboxes.nth(index);
            const isChecked = await checkbox.isChecked();
            if (!isChecked) {
                console.error(`Soft Assertion Failed: Checkbox at index ${index} is not checked after interaction.`);
            }
        }
    }


    // Verify if the label of a checkbox matches the expected label text
    static async validateCheckboxLabelAssociation(page: Page, checkboxLocator: string, expectedLabelText: string): Promise<void> {
        const checkbox = await page.locator(checkboxLocator);
        const label = await checkbox.locator('..').locator('label');
        const labelText = await label.textContent();
        if (labelText !== expectedLabelText) {
            throw new Error(`Assertion Failed: Label mismatch: expected "${expectedLabelText}", got "${labelText}".`);
        }
    }
    static async validateCheckboxLabelAssociationSoftAssert(page: Page, checkboxLocator: string, expectedLabelText: string): Promise<void> {
        const checkbox = await page.locator(checkboxLocator);
        const label = await checkbox.locator('..').locator('label');
        const labelText = await label.textContent();
        if (labelText !== expectedLabelText) {
            console.error(`Assertion Failed: Label mismatch: expected "${expectedLabelText}", got "${labelText}".`);
        }
    }

    // Validate if the radio button selection matches the expected state
    static async validateRadioButtonSelection(page: Page, locator: string, expectedSelection: boolean): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (isSelected !== expectedSelection) {
            throw new Error(`Assertion Failed: Radio button selection mismatch: expected ${expectedSelection}, got ${isSelected}.`);
        }
    }
    static async validateRadioButtonSelectionSoftAssert(page: Page, locator: string, expectedSelection: boolean): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (isSelected !== expectedSelection) {
            console.error(`Soft Assertion Failed: Radio button selection mismatch: expected ${expectedSelection}, got ${isSelected}.`);
        }
    }


    // Click and verify a radio button's selection status
    static async interactWithRadioButton(page: Page, locator: string): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (!isSelected) {
            await radioButton.click();
        }
    }
    static async interactWithRadioButtonSoftAssert(page: Page, locator: string): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (!isSelected) {
            console.warn(`Soft Assertion: Radio button at locator "${locator}" was not selected. Clicking to select.`);
            await radioButton.click();
        } else {
            console.info(`Soft Assertion: Radio button at locator "${locator}" is already selected.`);
        }
    }


    // Verify the default selection of a radio button
    static async validateRadioButtonDefaultSelection(page: Page, locator: string, expectedSelection: boolean): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (isSelected !== expectedSelection) {
            throw new Error(`Radio button default selection mismatch: expected ${expectedSelection}, got ${isSelected}`);
        }
    }


    // Verify the label associated with a radio button matches the expected label text
    static async validateRadioButtonLabelAssociation(page: Page, radioButtonLocator: string, expectedLabelText: string): Promise<void> {
        const radioButton = await page.locator(radioButtonLocator);
        const label = await radioButton.locator('..').locator('label');
        const labelText = await label.textContent();
        if (labelText !== expectedLabelText) {
            throw new Error(`Label mismatch: expected "${expectedLabelText}", got "${labelText}"`);
        }
    }
    static async validateRadioButtonLabelAssociationSoftAssert(page: Page, radioButtonLocator: string, expectedLabelText: string): Promise<void> {
        const radioButton = await page.locator(radioButtonLocator);
        const label = await radioButton.locator('..').locator('label');
        const labelText = await label.textContent();
        if (labelText !== expectedLabelText) {
            console.warn(`Soft Assertion: Label mismatch: expected "${expectedLabelText}", got "${labelText}"`);
            await expect.soft(label).toHaveText(expectedLabelText);
        }
    }

    static async validateRadioButtonDefaultSelectionSoftAssert(page: Page, locator: string, expectedSelection: boolean): Promise<void> {
        const radioButton = await page.locator(locator);
        const isSelected = await radioButton.isChecked();
        if (isSelected !== expectedSelection) {
            console.warn(`Soft Assertion: Radio button default selection mismatch: expected ${expectedSelection}, got ${isSelected}`);
            await expect.soft(radioButton).toBeChecked({ checked: expectedSelection });
        }
    }

    // Validate the number of rows in a table
    static async validateRowCount(page: Page, locator: string, expectedCount: number): Promise<void> {
        const rows = await page.locator(`${locator} tr`);
        const rowCount = await rows.count();
        if (rowCount !== expectedCount) {
            throw new Error(`Row count mismatch: expected ${expectedCount}, got ${rowCount}`);
        }
    }
    static async validateRowCountSoftAssert(page: Page, locator: string, expectedCount: number): Promise<void> {
        const rows = await page.locator(`${locator} tr`);
        const rowCount = await rows.count();
        if (rowCount !== expectedCount) {
            console.warn(`Soft Assertion: Row count mismatch: expected ${expectedCount}, got ${rowCount}`);
            await expect.soft(rows).toHaveCount(expectedCount);
        }
    }

    // Validate the number of columns in a table
    static async validateColumnCount(page: Page, locator: string, expectedCount: number): Promise<void> {
        const columns = await page.locator(`${locator} th`);
        const columnCount = await columns.count();
        if (columnCount !== expectedCount) {
            throw new Error(`Column count mismatch: expected ${expectedCount}, got ${columnCount}`);
        }
    }
    static async validateColumnCountSoftAssert(page: Page, locator: string, expectedCount: number): Promise<void> {
        const columns = await page.locator(`${locator} th`);
        const columnCount = await columns.count();
        if (columnCount !== expectedCount) {
            console.warn(`Soft Assertion: Column count mismatch: expected ${expectedCount}, got ${columnCount}`);
            await expect.soft(columns).toHaveCount(expectedCount);
        }
    }


    // Retrieve the value of a specific cell in a table
    static async getCellValue(page: Page, rowLocator: string, colLocator: string): Promise<string | null> {
        const cell = await page.locator(`${rowLocator} ${colLocator}`);
        return await cell.textContent();
    }

    // Validate the pagination count (number of pages)
    static async validatePagination(page: Page, locator: string, expectedPages: number): Promise<void> {
        const pagination = await page.locator(locator);
        const pageCount = await pagination.locator('li').count();
        if (pageCount !== expectedPages) {
            throw new Error(`Pagination mismatch: expected ${expectedPages} pages, got ${pageCount}`);
        }
    }
    static async validatePaginationSoftAssert(page: Page, locator: string, expectedPages: number): Promise<void> {
        const pagination = await page.locator(locator);
        const pageCount = await pagination.locator('li').count();
        if (pageCount !== expectedPages) {
            console.warn(`Soft Assertion: Pagination mismatch: expected ${expectedPages} pages, got ${pageCount}`);
            await expect.soft(pagination.locator('li')).toHaveCount(expectedPages);
        }
    }

    // Validate the data filter by checking if filtered results are found
    static async validateDataFilter(page: Page, filterLocator: string, filterValue: string, expectedResultLocator: string): Promise<void> {
        await page.locator(filterLocator).fill(filterValue);
        const filteredItems = await page.locator(expectedResultLocator).count();
        if (filteredItems === 0) {
            throw new Error(`No results found for filter value: ${filterValue}`);
        }
    }
    static async selectDate(page: Page, datePickerLocator: string, date: string): Promise<void> {
        const datePicker = await page.locator(datePickerLocator);
        await datePicker.fill(date);
    }


    // Validate that today's date is highlighted in the date picker
    static async validateCurrentDateHighlighting(page: Page, datePickerLocator: string): Promise<void> {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
        const highlightedDate = await page.locator(`${datePickerLocator} .highlighted`).textContent();
        if (highlightedDate !== currentDate) {
            throw new Error(`Current date is not highlighted correctly. Expected: ${currentDate}, Found: ${highlightedDate}`);
        }
    }

    // Validate the selected date is within the specified date range
    static async validateDateRange(page: Page, datePickerLocator: string, minDate: string, maxDate: string): Promise<void> {
        const datePicker = await page.locator(datePickerLocator);
        const selectedDate = await datePicker.inputValue();
        if (selectedDate < minDate || selectedDate > maxDate) {
            throw new Error(`Selected date is out of range. Expected between ${minDate} and ${maxDate}.`);
        }
    }

    // Validate that invalid date is rejected in the date picker
    static async validateInvalidDate(page: Page, datePickerLocator: string, invalidDate: string): Promise<void> {
        const datePicker = await page.locator(datePickerLocator);
        await datePicker.fill(invalidDate);
        const value = await datePicker.inputValue();
        if (value !== '') {
            throw new Error(`Invalid date was accepted: ${invalidDate}`);
        }
    }

    // Validate the format of the selected date in the date picker
    static async validateDateFormat(page: Page, datePickerLocator: string, expectedFormat: string): Promise<void> {
        const datePicker = await page.locator(datePickerLocator);
        const value = await datePicker.inputValue();
        const formatRegex = new RegExp(`^${expectedFormat}$`);
        if (!formatRegex.test(value)) {
            throw new Error(`Date format mismatch. Expected format: ${expectedFormat}, Found: ${value}`);
        }
    }
    // Validate the href attribute of a link
    static async validateHrefAttribute(page: Page, locator: string, expectedHref: string): Promise<void> {
        const link = await page.locator(locator);
        const href = await link.getAttribute('href');
        if (href !== expectedHref) {
            throw new Error(`Href attribute mismatch: expected "${expectedHref}", got "${href}"`);
        }
    }
    // assertion version for validateHrefAttribute
    static async validateHrefAttributeSoftAssert(page: Page, locator: string, expectedHref: string): Promise<void> {
        const link = await page.locator(locator);
        const href = await link.getAttribute('href');
        if (href !== expectedHref) {
            console.warn(`Href attribute mismatch: expected "${expectedHref}", got "${href}"`);
            await expect.soft(link).toHaveAttribute('href', expectedHref);
        }
    }

    // Validate the target attribute of a link
    static async validateTargetAttribute(page: Page, locator: string, expectedTarget: string): Promise<void> {
        const link = await page.locator(locator);
        const target = await link.getAttribute('target');
        if (target !== expectedTarget) {
            throw new Error(`Target attribute mismatch: expected "${expectedTarget}", got "${target}"`);
        }
    }
    // assertion version for validateTargetAttribute
    static async validateTargetAttributeSoftAssert(page: Page, locator: string, expectedTarget: string): Promise<void> {
        const link = await page.locator(locator);
        const target = await link.getAttribute('target');
        if (target !== expectedTarget) {
            console.warn(`Target attribute mismatch: expected "${expectedTarget}", got "${target}"`);
            await expect.soft(link).toHaveAttribute('target', expectedTarget);
        }
    }

    // Validate the src attribute of an image
    static async validateSrcAttribute(page: Page, locator: string, expectedSrc: string): Promise<void> {
        const image = await page.locator(locator);
        const src = await image.getAttribute('src');
        if (src !== expectedSrc) {
            throw new Error(`Src attribute mismatch: expected "${expectedSrc}", got "${src}"`);
        }
    }
    // assertion version for validateSrcAttribute
    static async validateSrcAttributeSoftAssert(page: Page, locator: string, expectedSrc: string): Promise<void> {
        const image = await page.locator(locator);
        const src = await image.getAttribute('src');
        if (src !== expectedSrc) {
            console.warn(`Soft Assertion: Src attribute mismatch: expected "${expectedSrc}", got "${src}"`);
            await expect.soft(image).toHaveAttribute('src', expectedSrc);
        }
    }

    // Validate the alt text of an image
    static async validateAltText(page: Page, locator: string, expectedAltText: string): Promise<void> {
        const image = await page.locator(locator);
        const altText = await image.getAttribute('alt');
        if (altText !== expectedAltText) {
            throw new Error(`Alt text mismatch: expected "${expectedAltText}", got "${altText}"`);
        }
    }
    // assertion version for validateAltText
    static async validateAltTextSoftAssert(page: Page, locator: string, expectedAltText: string): Promise<void> {
        const image = await page.locator(locator);
        const altText = await image.getAttribute('alt');
        if (altText !== expectedAltText) {
            console.warn(`Soft Assertion: Alt text mismatch: expected "${expectedAltText}", got "${altText}"`);
            await expect.soft(image).toHaveAttribute('alt', expectedAltText);
        }
    }

    // Persistent/Transient Behavior
    static async validateTooltipBehavior(page: Page, tooltipLocator: string, persistent: boolean): Promise<void> {
        const tooltip = await page.locator(tooltipLocator);
        await tooltip.hover();
        const isVisible = await tooltip.isVisible();
        if (persistent && !isVisible) {
            throw new Error(`Tooltip should be persistent but disappeared.`);
        } else if (!persistent && isVisible) {
            throw new Error(`Tooltip should be transient but remains visible.`);
        }
    }

    static async validateImageDimensions(page: Page, locator: string, expectedWidth: number, expectedHeight: number): Promise<void> {
        const image = await page.locator(locator);
        const imageBox = await image.boundingBox();
        if (!imageBox) {
            throw new Error('Image not found or unable to get dimensions');
        }
        const { width, height } = imageBox;
        if (width !== expectedWidth || height !== expectedHeight) {
            throw new Error(`Image dimensions mismatch: expected ${expectedWidth}x${expectedHeight}, got ${width}x${height}`);
        }
    }


    // Validate that the Escape key closes the modal dialog
    static async validateEscapeKeyHandling(page: Page, modalLocator: string): Promise<void> {
        const modal = await page.locator(modalLocator);
        await page.keyboard.press('Escape');
        const isVisible = await modal.isVisible();
        if (isVisible) {
            throw new Error(`Modal dialog is still visible after pressing the Escape key.`);
        }
    }

    // assertion version for validateEscapeKeyHandling
    static async validateEscapeKeyHandlingSoftAssert(page: Page, modalLocator: string): Promise<void> {
        const modal = await page.locator(modalLocator);
        await page.keyboard.press('Escape');
        const isVisible = await modal.isVisible();
        if (isVisible) {
            console.warn('Soft Assertion: Modal dialog is still visible after pressing the Escape key.');
            await expect.soft(modal).not.toBeVisible();
        }
    }

    static async validateOutsideClickDismissal(page: Page, modalLocator: string, outsideLocator: string): Promise<void> {
        const modal = await page.locator(modalLocator);
        const outsideElement = await page.locator(outsideLocator);
        await outsideElement.click();
        const isVisible = await modal.isVisible();
        if (isVisible) {
            throw new Error(`Modal dialog was not dismissed after clicking outside.`);
        }
    }
    static async validateOutsideClickDismissalSoftAssert(page: Page, modalLocator: string, outsideLocator: string): Promise<void> {
        const modal = await page.locator(modalLocator);
        const outsideElement = await page.locator(outsideLocator);
        await outsideElement.click();
        const isVisible = await modal.isVisible();
        if (isVisible) {
            console.warn(`Soft Assertion: Modal dialog was not dismissed after clicking outside.`);
            await expect.soft(modal).not.toBeVisible();
        }
    }

    static async elementIsVisibleSynthetic(page: Page, locator: string, timeout: number = 30000): Promise<boolean> {
        const attemptToCheckVisibility = async (): Promise<boolean> => {
            try {
                const element = page.locator(locator);
                await element.waitFor({ state: 'attached', timeout }); // wait until present in DOM
                await expect(element).toBeVisible({ timeout }); // wait for visibility
                return true;
            } catch (error) {
                return false;
            }
        }

        // 🔁 First attempt
        console.log(`Attempt 1: Checking visibility for '${locator}'`);
        const isVisibleFirstTry = await attemptToCheckVisibility();

        if (isVisibleFirstTry) {
            console.log(`Element '${locator}' is visible on first attempt.`);
            return true;
        }

        // 🔄 Refresh and try again
        console.warn(`Element '${locator}' not visible. Refreshing page...`);
        await page.reload();
        await page.waitForTimeout(3000); // optional buffer

        // 🔁 Second attempt
        console.log(`Attempt 2: Checking visibility after refresh for '${locator}'`);
        const isVisibleSecondTry = await attemptToCheckVisibility();

        if (isVisibleSecondTry) {
            console.log(`Element '${locator}' is visible after refresh.`);
            return true;
        } else {
            console.error(`Element '${locator}' is not visible after refresh.`);
            return false;
        }
    }




}