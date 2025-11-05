# Playwright E2E Testing Setup Guide

## Quick Start

### 1. Install Playwright

Playwright is already in `package.json`. Install it:

```bash
npm install
```

### 2. Install Browser Binaries

Playwright needs browser binaries to run tests:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers.

**Note:** This may take a few minutes as it downloads browser binaries (~300MB).

### 3. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI (recommended for first time)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed
```

## What Tests Are Included

### ✅ Navigation Tests (`navigation.spec.ts`)
- All pages load correctly
- Navigation links work
- Active page highlighting
- Routes are correct

### ✅ Dashboard Tests (`dashboard.spec.ts`)
- KPI cards display
- Wave progress shows
- Recent locations table
- No console errors

### ✅ Assets & Locations Tests (`assets-locations.spec.ts`)
- CSV upload button works
- Filters function correctly
- Table displays assets
- Map visualization shows

### ✅ Fiber Feasibility Tests (`fiber-feasibility.spec.ts`)
- Summary cards display
- Status updates work
- Filters work
- Color-coded map

### ✅ Wave Management Tests (`wave-management.spec.ts`)
- Wave creation modal
- Form validation
- Progress bars
- Refresh functionality

### ✅ Supabase Connection Tests (`supabase-connection.spec.ts`)
- Connection status
- Data loading
- Error handling

### ✅ CSV Upload Tests (`example-csv-upload.spec.ts`)
- File selection
- File validation
- Upload processing

## Test Configuration

**File:** `playwright.config.ts`

- **Base URL**: `http://localhost:3000`
- **Auto-start dev server**: Yes
- **Timeout**: 30 seconds per test
- **Browsers**: Chromium (default)

## Running Specific Tests

```bash
# Run one test file
npx playwright test tests/e2e/dashboard.spec.ts

# Run tests matching a pattern
npx playwright test dashboard

# Run in debug mode
npx playwright test --debug
```

## Viewing Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This shows:
- Pass/fail status
- Screenshots of failures
- Videos of test runs
- Execution time

## Troubleshooting

### "Cannot find module '@playwright/test'"

Run:
```bash
npm install
```

### "Browser not found"

Run:
```bash
npx playwright install
```

### "Dev server not starting"

Make sure port 3000 is available. The config tries to start the dev server automatically.

### Tests fail with "timeout"

- Check that dev server is running on port 3000
- Increase timeout in `playwright.config.ts` if needed
- Check Supabase connection (some tests depend on it)

### "Element not found" errors

- Tests may need data in database
- Some tests check for empty states
- Check selectors match your actual UI

## Next Steps

1. Install Playwright: `npm install && npx playwright install`
2. Run tests: `npm run test:e2e:ui`
3. Review results and fix any failures
4. Add more tests as you add features

## CI/CD Integration

Tests can be added to CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install
- name: Install Playwright browsers
  run: npx playwright install --with-deps
- name: Run E2E tests
  run: npm run test:e2e
```

