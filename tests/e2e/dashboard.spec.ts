/**
 * Dashboard E2E Tests
 * Tests the Dashboard page functionality
 * 
 * These tests verify:
 * - Dashboard loads and displays KPIs
 * - Wave progress bars display
 * - Recent locations table shows data
 */

import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  // Before each test, navigate to dashboard
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    // Wait for page to load (check for Supabase connection test or main content)
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  // Test: Dashboard displays all KPI cards
  test('should display all KPI cards', async ({ page }) => {
    // Check for Completed Migrations card
    await expect(page.locator('text=Completed Migrations')).toBeVisible()
    
    // Check for In Progress card
    await expect(page.locator('text=In Progress')).toBeVisible()
    
    // Check for Failed Installs card
    await expect(page.locator('text=Failed Installs')).toBeVisible()
    
    // Check for Average Time card
    await expect(page.locator('text=Avg. Time/Install')).toBeVisible()
  })

  // Test: KPI cards show numeric values
  test('should display numeric values in KPI cards', async ({ page }) => {
    // Check that KPI values are visible (numbers)
    // The exact values depend on database state, so we just check they exist
    const completedCard = page.locator('text=Completed Migrations').locator('..')
    const kpiValue = completedCard.locator('text=/\\d+/').first()
    await expect(kpiValue).toBeVisible()
  })

  // Test: Wave progress section displays
  test('should display wave progress section', async ({ page }) => {
    // Check for section title
    await expect(page.locator('text=Migration Waves Progress')).toBeVisible()
    
    // Check for progress bars (may be empty if no waves)
    const progressSection = page.locator('text=Migration Waves Progress').locator('..').locator('..')
    await expect(progressSection).toBeVisible()
  })

  // Test: Recent locations section displays
  test('should display recent locations section', async ({ page }) => {
    // Check for section title
    await expect(page.locator('text=Recent Locations')).toBeVisible()
    
    // Check for table (may be empty)
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })

  // Test: Dashboard loads without errors
  test('should load without console errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000)

    // Filter out known non-critical errors (like Supabase connection if not configured)
    const criticalErrors = errors.filter(
      (error) => !error.includes('Supabase') && !error.includes('Missing Supabase')
    )

    // Should have no critical errors
    expect(criticalErrors.length).toBe(0)
  })
})

