import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for E2E testing
 * This file configures how Playwright runs tests
 * 
 * See https://playwright.dev/docs/test-configuration for more details
 */
export default defineConfig({
  // Test directory - where test files are located
  testDir: './tests/e2e',
  
  // Maximum time one test can run (in milliseconds)
  timeout: 30 * 1000, // 30 seconds
  
  // Test execution settings
  fullyParallel: true, // Run tests in parallel for faster execution
  forbidOnly: !!process.env.CI, // Fail build if test.only is used in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Use 1 worker in CI, auto-detect locally
  
  // Reporter configuration
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL for tests - points to local dev server
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying failed test (useful for debugging)
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium', // Chrome/Edge browser
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run local dev server before tests
  webServer: {
    // Command to start dev server
    command: 'npm run dev',
    // Port where dev server runs
    url: 'http://localhost:3000',
    // How long to wait for server to start
    timeout: 120 * 1000, // 2 minutes
    // Reuse existing server if available
    reuseExistingServer: !process.env.CI,
  },
})

