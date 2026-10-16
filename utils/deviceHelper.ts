/**
 * DeviceHelper.ts
 * Centralized utility to identify the execution environment 
 * based on the project naming convention in playwright.config.ts
 */

export class DeviceHelper {
  
  /**
   * Checks if the current project environment is configured for mobile.
   * Relies on the 'PROJECT' environment variable defined in your 
   * terminal command (e.g., IDFC-chrome-uat-mobile-iphone13).
   */
    static isMobile(): boolean {
    const project = process.env.PROJECT?.toLowerCase() || '';
    
    // Check if it's one of your known iPhones or Galaxies
    const mobileDevices = ['iphone12', 'iphone13', 'iphonese', 'galaxys20', 'galaxys21', 'pixel4a', 'pixel5', 'oneplus8', 'oneplus9'];
    
    // Returns true if the project string contains "mobile" OR any of these device names
    return project.includes('mobile') || mobileDevices.some(device => project.includes(device));
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