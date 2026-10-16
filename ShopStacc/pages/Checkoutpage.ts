import { expect, Page } from '@playwright/test';
import { HomePageLocators } from '../../ShopStacc/locators/HomePageLocators';
import { ElementHelper } from '../../utils/elementHelper';
import { CheckoutpageLocators } from '../../ShopStacc/locators/CheckoutPageLocators';

export class Checkoutpage {
    static async verifyCartProductDetailsVisible(page: Page) {
        const checkoutpagetitle = CheckoutpageLocators.checkoutpagetitle;
        const productName = CheckoutpageLocators.productName;
        const productPrice = CheckoutpageLocators.productPrice;
        const productQtyText = CheckoutpageLocators.productQuantityText;
        const productQtyInput = CheckoutpageLocators.productQuantityInput;
        const productImage = CheckoutpageLocators.productImage;
        await ElementHelper.waitForElementVisible(page, checkoutpagetitle);
        console.log("User is on checkout page");

        await ElementHelper.waitForElementVisible(page, productName);
        console.log("Product name is visible.");

        const nameText = await page.locator(productName).innerText();
        console.log(`Product Name: ${nameText}`);

        await ElementHelper.waitForElementVisible(page, productPrice);
        console.log("Product price is visible.");

        const priceText = await page.locator(productPrice).innerText();
        console.log(`Price: ${priceText}`);

        await ElementHelper.waitForElementVisible(page, productQtyText);
        console.log("Product quantity text is visible.");

        await ElementHelper.waitForElementVisible(page, productQtyInput);
        console.log("Quantity input field is visible.");

        await ElementHelper.waitForElementVisible(page, productImage);
        console.log("Product image is visible.");

        console.log("All cart product details are visible.");
    }
}