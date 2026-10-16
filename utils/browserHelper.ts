//import * as commonData from '../testdata/colpro.testdata.json'; 

export class BrowserHelper {
    // Get the current window handle (returns the URL of the current page)
    static async getCurrentWindowHandle(page: any): Promise<string> {
        const currentUrl = page.url();
        console.log(`Current window handle (URL): ${currentUrl}`);
        return currentUrl;
    }

    static async createNewWindow(page: any): Promise<void> {
        await page.context().newPage();
        console.log('New browser window (tab) created.');
    }

    // Switch to a specific window using URL
    static async switchToWindow(page: any, targetUrl: string): Promise<void> {
        const allPages = page.context().pages();
        const targetPage = allPages.find((p: any) => p.url() === targetUrl);
        if (targetPage) {
            await targetPage.bringToFront();
            console.log(`Switched to window with URL: ${targetUrl}`);
        } else {
            throw new Error(`Window with URL ${targetUrl} not found.`);
        }
    }
    static async switchToTab(page: any): Promise<void> {
        const context = page.context();
        const allPages = await context.pages();
        const newTab = allPages.find((p: any) => p.url() !== page.url());

        if (newTab) {
            await newTab.bringToFront();
        } else {
            console.error('No new tab found');
        }
    }
    static async clickButtonInsideIframe(iframe: any, buttonSelector: string) {
        const button = await iframe.waitForSelector(buttonSelector);
        await button.click();
    }
    static async switchToIframe(page: any, iframeSelector: string) {
        const iframeElement = await page.waitForSelector(iframeSelector);
        const iframe = await iframeElement.contentFrame();
        if (!iframe) {
            throw new Error(`Unable to switch to iframe with selector: ${iframeSelector}`);
        }
        return iframe;
    }
    static async setGeolocation(page: any, latitude: number, longitude: number): Promise<void> {
        await page.context().grantPermissions(['geolocation']);
        await page.context().setGeolocation({ latitude, longitude });
        console.log(`Geolocation set to Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    // Get window width
    static async getWindowWidth(page: any): Promise<number> {
        const viewportSize = page.viewportSize();
        return viewportSize ? viewportSize.width : 0;
    }

    // Get window height
    static async getWindowHeight(page: any): Promise<number> {
        const viewportSize = page.viewportSize();
        return viewportSize ? viewportSize.height : 0;
    }

    // Set window size
    static async setWindowSize(page: any, width: number, height: number): Promise<void> {
        await page.setViewportSize({ width, height });
    }

    // Close the current window
    static async closeWindow(page: any): Promise<void> {
        await page.close();
    }

    // Close a tab
    static async closeTab(page: any): Promise<void> {
        await page.close();
        console.log('Tab closed');
    }

    // Minimize the browser window
    static async minimizeWindow(page: any): Promise<void> {
        await page.setViewportSize({ width: 800, height: 600 });
    }

    // Maximize the browser window
    static async maximizeWindow(page: any): Promise<void> {
        const viewport = { width: 1920, height: 1080 };
        await page.setViewportSize(viewport);
        console.log('Browser window maximized.');
    }

    // Full-screen the browser window
    static async fullScreenWindow(page: any): Promise<void> {
        await page.setViewportSize({ width: 1920, height: 1080 });
    }

    // Refresh the current page
    static async refreshPage(page: any): Promise<void> {
        await page.reload();
        console.log('Page refreshed.');
    }

    // Take a screenshot of the current page
    static async takeScreenshot(page: any, path: string): Promise<void> {
        await page.screenshot({ path });
        console.log(`Screenshot saved at: ${path}`);
    }

    // Emulate a device (e.g., iPhone 12)
    static async emulateDevice(page: any, deviceName: string): Promise<void> {
        const devices = require('playwright').devices;
        const device = devices[deviceName];
        if (!device) throw new Error(`Device ${deviceName} not found.`);
        await page.context().newPage(device);
        console.log(`Device emulation started: ${deviceName}`);
    }

    // Capture network traffic (requests and responses)
    static async captureNetworkTraffic(page: any): Promise<void> {
        page.on('request', (request: { url: () => any; method: () => any; }) => {
            console.log(`Request: ${request.url()} - ${request.method()}`);
        });
        page.on('response', (response: { url: () => any; status: () => any; }) => {
            console.log(`Response: ${response.url()} - ${response.status()}`);
        });
    }

    // Get all cookies
    static async getCookies(page: any): Promise<any[]> {
        const cookies = await page.context().cookies();
        console.log('Cookies retrieved:', cookies);
        return cookies;
    }

    // Set a cookie
    static async setCookie(page: any, cookie: any): Promise<void> {
        await page.context().addCookies([cookie]);
        console.log('Cookie added:', cookie);
    }

    // Clear all cookies
    static async clearCookies(page: any): Promise<void> {
        await page.context().clearCookies();
        console.log('All cookies cleared.');
    }

    // Download a file from a URL
    static async downloadFile(page: any, downloadUrl: string, downloadPath: string): Promise<void> {
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.goto(downloadUrl),
        ]);
        await download.saveAs(downloadPath);
        console.log(`File downloaded to: ${downloadPath}`);
    }

    // Get current browser language
    static async getBrowserLanguage(page: any): Promise<string> {
        const language = await page.evaluate(() => navigator.language);
        console.log(`Browser language: ${language}`);
        return language;
    }

    // Get the viewport size
    static async getViewportSize(page: any): Promise<{ width: number; height: number }> {
        const viewport = page.viewportSize();
        console.log('Viewport size:', viewport);
        return viewport;
    }

    // Simulate offline mode
    static async goOffline(page: any): Promise<void> {
        await page.context().setOffline(true);
        console.log('Browser set to offline mode.');
    }

    // Re-enable online mode
    static async goOnline(page: any): Promise<void> {
        await page.context().setOffline(false);
        console.log('Browser set to online mode.');
    }
}