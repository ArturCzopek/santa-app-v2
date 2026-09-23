import { defineConfig, devices } from '@playwright/test';

// Run with `npm run test:e2e`, which starts the Firebase emulators first.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1, // tests share the emulators
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173',
    locale: 'pl-PL',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx vite --mode emulators --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
