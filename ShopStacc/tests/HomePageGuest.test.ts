import { test, expect } from '../../utils/testBase';
import { HomePage } from '../pages/HomePage';

// Separate file intentionally has no authenticated beforeEach hook.
test(
  'TC_HOME_036: Guest can browse, search and navigate categories without login',
  { tag: ['@bobcard', '@homepage', '@smoke', '@guest', '@sanity', '@functional'] },
  async ({ browser }, testInfo) => {
    const homepageUrl = process.env.SHOPSTACC_GUEST_HOME_URL;
    if (!homepageUrl) {
      throw new Error('Set SHOPSTACC_GUEST_HOME_URL to the direct BOBCARD storefront URL, not the SSO login URL');
    }
    const context = await browser.newContext({
      ...testInfo.project.use,
      storageState: { cookies: [], origins: [] },
    });
    try {
      expect(await context.cookies()).toEqual([]);
      const page = await context.newPage();
      await test.step('Open homepage in a clean session and verify guest browsing', async () => {
        await HomePage.verifyGuestHomepage(page, homepageUrl);
      });
    } finally {
      await context.close();
    }
  }
);
