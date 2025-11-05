# E2E Tests with Playwright

This directory contains end-to-end (E2E) tests for the CFMS application using Playwright.

## Setup

### Install Dependencies

Playwright is already added to `package.json`. Install it:

```bash
npm install
```

### Install Playwright Browsers

After installing dependencies, install the browser binaries:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers needed for testing.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See tests running in real-time
- Debug individual tests
- Step through test execution
- View screenshots and videos

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

This runs tests with visible browser windows (useful for debugging).

### Run Specific Test File

```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
tests/
├── e2e/                    # End-to-end test files
│   ├── navigation.spec.ts   # Navigation tests
│   ├── dashboard.spec.ts  # Dashboard tests
│   ├── assets-locations.spec.ts  # Assets page tests
│   ├── fiber-feasibility.spec.ts  # Fiber feasibility tests
│   ├── wave-management.spec.ts     # Wave management tests
│   ├── supabase-connection.spec.ts # Supabase connection tests
│   └── example-csv-upload.spec.ts  # CSV upload tests
└── setup/
    └── test-helpers.ts     # Test utility functions
```

## Test Coverage

### Phase 1 Tests (Navigation & Layout)
- ✅ Navigation between all pages
- ✅ Sidebar active state highlighting
- ✅ Page titles and headers

### Phase 2 Tests (Supabase Connection)
- ✅ Connection status display
- ✅ Database accessibility
- ✅ Error handling

### Phase 3 Tests (Basic Functionality)
- ✅ Dashboard KPIs display
- ✅ Assets & Locations page
- ✅ CSV upload functionality
- ✅ Filters (region, type, status)
- ✅ Fiber Feasibility page
- ✅ Status updates
- ✅ Wave Management
- ✅ Wave creation modal
- ✅ Progress tracking

## Configuration

Playwright is configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./tests/e2e`
- **Timeout**: 30 seconds per test
- **Auto-start Dev Server**: Yes (starts `npm run dev` before tests)
- **Browsers**: Chromium (can add Firefox/WebKit)

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/page-url')
    await page.waitForSelector('h1')
  })

  test('should do something', async ({ page }) => {
    // Test code here
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

### Best Practices

1. **Use descriptive test names**: "should display all KPI cards"
2. **Wait for elements**: Use `waitForSelector` before interacting
3. **Use data-testid**: Add `data-testid` attributes to important elements for stable selectors
4. **Handle async operations**: Wait for API calls to complete
5. **Test user flows**: Test complete workflows, not just individual actions

## Debugging Tests

### Debug Mode

```bash
npx playwright test --debug
```

This opens Playwright Inspector where you can:
- Step through test execution
- Inspect page state
- View console logs
- See network requests

### Screenshots and Videos

Failed tests automatically capture:
- Screenshot at failure point
- Video of entire test run
- View in `test-results/` directory

### View Test Report

```bash
npx playwright show-report
```

Opens HTML report with:
- Test results
- Screenshots
- Videos
- Traces

## Continuous Integration

Tests can run in CI/CD pipelines. The config already includes:
- Retry logic for flaky tests
- Parallel execution
- HTML report generation

## Notes

- Tests require the dev server to be running (automatically started)
- Tests assume Supabase is configured (some tests may skip if not)
- Tests are designed to work with or without data in database
- Some tests check for empty states when no data exists

