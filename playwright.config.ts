// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  webServer: {
    command: 'yarn run serve',
    port: 8000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
export default config;
