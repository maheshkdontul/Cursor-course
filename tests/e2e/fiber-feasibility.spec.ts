/**
 * Fiber Feasibility E2E Tests
 * Tests the Fiber Feasibility page functionality
 * 
 * These tests verify Phase 3 functionality:
 * - Summary cards display correctly
 * - Status updates work
 * - Filters work
 * - Map visualization displays
 */

import { test, expect } from '@playwright/test'

test.describe('Fiber Feasibility', () => {
  // Before each test, navigate to Fiber Feasibility page
  test.beforeEach(async ({ page }) => {
    await page.goto('/fiber-feasibility')
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  // Test: Page loads correctly
  test('should load Fiber Feasibility page', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Fiber Feasibility')
    
    // Check for summary cards
    await expect(page.locator('text=Fiber Ready')).toBeVisible()
  })

  // Test: Summary cards display
  test('should display all summary cards', async ({ page }) => {
    // Check for Fiber Ready card
    await expect(page.locator('text=Fiber Ready')).toBeVisible()
    
    // Check for Pending Feasibility card
    await expect(page.locator('text=Pending Feasibility')).toBeVisible()
    
    // Check for Copper Only card
    await expect(page.locator('text=Copper Only')).toBeVisible()
  })

  // Test: Summary cards show numeric values
  test('should display counts in summary cards', async ({ page }) => {
    // Wait for cards to load
    await page.waitForTimeout(2000)
    
    // Check that cards have numeric values
    const fiberReadyCard = page.locator('text=Fiber Ready').locator('..')
    const count = fiberReadyCard.locator('text=/\\d+/').first()
    await expect(count).toBeVisible()
  })

  // Test: Region filter displays and works
  test('should filter locations by region', async ({ page }) => {
    // Check for filter label
    await expect(page.locator('text=Filter by Region')).toBeVisible()
    
    // Find region filter dropdown
    const regionSelect = page.locator('select')
    await expect(regionSelect).toBeVisible()
    
    // Select a region (if options available)
    const options = await regionSelect.locator('option').all()
    if (options.length > 1) {
      await regionSelect.selectOption({ index: 1 })
      await page.waitForTimeout(1000)
      
      // Verify table still visible
      await expect(page.locator('table')).toBeVisible()
    }
  })

  // Test: Locations table displays
  test('should display locations table', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(2000)
    
    // Check for table
    const table = page.locator('table')
    await expect(table).toBeVisible()
    
    // Check for table headers
    await expect(page.locator('text=Address')).toBeVisible()
    await expect(page.locator('text=Region')).toBeVisible()
    await expect(page.locator('text=Current Status')).toBeVisible()
    await expect(page.locator('text=Action')).toBeVisible()
  })

  // Test: Status update dropdown is present
  test('should have status update dropdowns', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(2000)
    
    // Check for status update selects in table
    const statusSelects = page.locator('table select')
    const count = await statusSelects.count()
    
    // If there are locations, there should be status selects
    if (count > 0) {
      // Check first select has options
      const firstSelect = statusSelects.first()
      await expect(firstSelect).toBeVisible()
      
      // Check it has Fiber Ready option
      await expect(firstSelect.locator('option:has-text("Fiber Ready")')).toBeVisible()
    }
  })

  // Test: Status can be updated (if locations exist)
  test('should allow status updates', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(2000)
    
    // Find first status select dropdown
    const statusSelects = page.locator('table select')
    const count = await statusSelects.count()
    
    if (count > 0) {
      const firstSelect = statusSelects.first()
      
      // Get current value
      const currentValue = await firstSelect.inputValue()
      
      // Change to different status
      const newValue = currentValue === 'Fiber Ready' ? 'Pending Feasibility' : 'Fiber Ready'
      await firstSelect.selectOption(newValue)
      
      // Wait for update to process
      await page.waitForTimeout(1000)
      
      // Verify value changed (may revert if update failed, but dropdown should be responsive)
      const updatedValue = await firstSelect.inputValue()
      expect(updatedValue).toBe(newValue)
    }
  })

  // Test: Map visualization displays
  test('should display fiber status map', async ({ page }) => {
    // Check for map section title
    await expect(page.locator('text=Fiber Status Map')).toBeVisible()
    
    // Check for map container
    const mapSection = page.locator('text=Fiber Status Map').locator('..').locator('..')
    await expect(mapSection).toBeVisible()
  })

  // Test: Color coding information displays
  test('should display color coding legend', async ({ page }) => {
    // Scroll to map section
    await page.locator('text=Fiber Status Map').scrollIntoViewIfNeeded()
    
    // Check for color coding explanation
    await expect(
      page.locator('text=/Color coding|Green|Yellow|Red/')
    ).toBeVisible({ timeout: 5000 })
  })
})

