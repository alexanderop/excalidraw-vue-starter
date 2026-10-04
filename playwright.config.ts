import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
const testDir = defineBddConfig({
  features: 'tests/e2e/*.feature',
  steps: 'tests/e2e/*.steps.ts',
});
export default defineConfig({
  testDir,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:43719',
    trace: 'retain-on-failure',
    channel: 'chrome',
  },
  webServer: {
    command:
      'pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 43719 --strictPort',
    url: 'http://127.0.0.1:43719',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
});
