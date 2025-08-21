import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',           // Directory where tests are located
  retries: 1,                  // Retry failed tests once
  reporter: [['json']],       // Emit machine readable JSON reports to stdout  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',    // Phase 1 defaults (tune later)
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  outputDir: 'artifacts',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add firefox/webkit later if you want cross-browser in Phase 1.x+
  ]
});
