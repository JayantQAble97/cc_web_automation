/**
 * DeviceHelper.ts
 * Centralized utility to identify the execution environment 
 * based on the project naming convention in playwright.config.ts
 */

// Same device list playwright.config.ts uses, so a device added there is
// automatically treated as mobile here.
const mobileDevices: { name: string }[] = require('../mobileDevices');
const MOBILE_DEVICE_NAMES = mobileDevices.map(d => d.name.toLowerCase());

export class DeviceHelper {

  /**
   * Checks if the current project environment is configured for mobile.
   * Relies on the 'PROJECT' environment variable defined in your
   * terminal command (e.g., tripstacc-chrome-UAT-mobile-iphone13 or tripstacc-chrome-UAT-GalaxyS21).
   */
    static isMobile(): boolean {
    const segments = (process.env.PROJECT?.toLowerCase() || '').split('-');

    // Returns true if PROJECT has a "mobile" segment OR a segment naming a device from mobileDevices.js
    return segments.includes('mobile') || segments.some(segment => MOBILE_DEVICE_NAMES.includes(segment));
  }

  /**
   * Returns true if the environment is NOT mobile (Desktop).
   */
  static isWeb(): boolean {
    return !this.isMobile();
  }

  /**
   * Optional: Can be used to log the current device type for debugging.
   */
  static getDeviceType(): string {
    return this.isMobile() ? 'MOBILE' : 'WEB';
  }
}