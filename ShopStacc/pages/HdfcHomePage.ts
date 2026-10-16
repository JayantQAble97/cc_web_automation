import { expect, Page } from '@playwright/test';
import { HdfcHomePageLocators as L } from '../locators/HomePageLocators';

export class HdfcHomePage {
  static async open(page: Page) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator(L.search)).toBeVisible();
    await expect(page.locator(L.productCards).first()).toBeVisible();
  }

  static async verifySearch(page: Page, keyword = 'phone') {
    const input = page.locator(L.search);
    await input.click();
    await input.fill(keyword);
    await expect(input).toHaveValue(keyword);
    const matching = page.locator(L.suggestion).locator('..').filter({
      hasText: new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    });
    await expect(matching.first(), 'Search must show a matching product suggestion').toBeVisible();
  }

  static async verifyMegaMenu(page: Page) {
    await page.getByRole('link', { name: 'Mobiles & Tablets', exact: true }).hover();
    const brand = page.getByRole('link', { name: 'Samsung', exact: true });
    await expect(brand).toBeVisible();
    const href = await brand.getAttribute('href');
    expect(href).toBeTruthy();
    const destination = new URL(href!, page.url()).href;
    await brand.click();
    await expect(page).toHaveURL(destination);
    await expect(page, 'Samsung mega-menu click must open a filtered listing, not the homepage')
      .not.toHaveURL(new URL('/', destination).href);
    const products = page.locator(L.productCards);
    await expect(products.first()).toBeVisible();
    for (const name of await products.locator(L.productName).allTextContents()) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  }

  static async verifyBanner(page: Page) {
    // Current camera-phone creative maps to the Samsung collection. A literal
    // Shop Now CTA is also required by TC_HOME_018; do not substitute a plain image.
    const banner = page.locator(L.brandBanner);
    await banner.scrollIntoViewIfNeeded();
    await expect(banner).toBeVisible();
    await expect(banner.getByText('Shop Now', { exact: true }),
      'TC_HOME_018 requires a Shop Now CTA on the promotional banner').toBeVisible();
    await expect(banner).toHaveAttribute('href', '/products?brand=samsung-brand');
    await banner.click();
    await expect(page).toHaveURL(/\/products\?brand=samsung-brand/);
    const products = page.locator(L.productCards);
    await expect(products.first(), 'Samsung offer must display matching products').toBeVisible();
    for (const name of await products.locator(L.productName).allTextContents()) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  }

  private static money(text: string) {
    const value = text.match(/₹\s*([\d,]+(?:\.\d+)?)/);
    if (!value) throw new Error(`Currency amount missing: ${text}`);
    return Number(value[1].replace(/,/g, ''));
  }

  static async verifyPricing(page: Page) {
    const card = page.locator(L.productCards).filter({ has: page.locator(L.originalPrice) }).first();
    await expect(card.locator(L.productName)).toBeVisible();
    const original = card.locator(L.originalPrice);
    const price = card.locator(L.sellingPrice);
    const discount = card.locator(L.discount);
    const emi = card.locator(L.emi);
    for (const field of [original, price, discount, emi]) await expect(field).toBeVisible();
    expect(await original.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('line-through');
    const mrp = this.money(await original.innerText());
    const selling = this.money(await price.innerText());
    const monthly = this.money(await emi.innerText());
    const percent = Number((await discount.innerText()).match(/([\d.]+)%/)?.[1]);
    expect(Number.isFinite(percent), 'Discount must contain a numeric percentage').toBe(true);
    expect(selling).toBeGreaterThan(0);
    expect(mrp).toBeGreaterThan(selling);
    expect(Math.abs(percent - (mrp - selling) / mrp * 100)).toBeLessThanOrEqual(1);
    await expect(emi).toContainText('/m');
    expect(monthly).toBeGreaterThan(0);
    expect(monthly).toBeLessThan(selling);
    // The card does not state tenure/APR. The PDP selects a financing plan,
    // so its monthly amount is not a valid oracle for this homepage-only test.
    // Exact EMI calculation needs a fixture with matching financing terms.
  }

  static async verifyProductNavigation(page: Page) {
    const card = page.locator(L.productCards).first();
    const title = (await card.locator(L.productName).innerText()).replace(/\s+/g, ' ').trim();
    const href = await card.getAttribute('href');
    await card.click();
    await expect(page).toHaveURL(new URL(href!, page.url()).href);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  }

  static async openLogin(page: Page) {
    await page.locator(L.account).last().click();
    await page.getByText('Login', { exact: true }).click();
    await expect(page.locator(L.mobile)).toBeVisible();
  }

  static async login(page: Page, mobile: string, otp: string) {
    await this.openLogin(page);
    await page.locator(L.mobile).fill(mobile);
    await page.getByRole('button', { name: 'Get OTP', exact: true }).click();
    await expect(page.locator(L.otp)).toHaveCount(otp.length);
    for (let i = 0; i < otp.length; i++) await page.locator(L.otp).nth(i).fill(otp[i]);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator(L.search)).toBeVisible({ timeout: 30000 });
  }

  static async verifyGuest(page: Page) {
    await this.verifySearch(page);
    await page.locator(L.search).fill('');
    await page.getByRole('link', { name: 'Mobiles & Tablets', exact: true }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator(L.productCards).first()).toBeVisible();
    await this.open(page);
    await this.openLogin(page);
  }
}
