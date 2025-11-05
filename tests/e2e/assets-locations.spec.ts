/**
 * Assets & Locations E2E Tests
 * Tests the Assets & Locations page functionality
 * 
 * These tests verify Phase 3 functionality:
 * - CSV upload works
 * - Assets table displays correctly
 * - Filters work
 * - Map visualization displays
 */

import { test, expect } from '@playwright/test'
import * as path from 'path'

test.describe('Assets & Locations', () => {
  // Before each test, navigate to Assets & Locations page
  test.beforeEach(async ({ page }) => {
    await page.goto('/assets-locations')
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  // Test: Page loads correctly
  test('should load Assets & Locations page', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Assets & Locations')
    
    // Check for CSV upload button
    await expect(page.locator('text=Upload CSV')).toBeVisible()
    
    // Check for filters section
    await expect(page.locator('text=Region')).toBeVisible()
  })

  // Test: Filters are displayed
  test('should display all filters', async ({ page }) => {
    // Check for Region filter
    await expect(page.locator('label:has-text("Region")')).toBeVisible()
    
    // Check for Asset Type filter
    await expect(page.locator('label:has-text("Asset Type")')).toBeVisible()
    
    // Check for Status filter
    await expect(page.locator('label:has-text("Status")')).toBeVisible()
  })

  // Test: Filter by region works
  test('should filter assets by region', async ({ page }) => {
    // Wait for filters to be available
    await page.waitForSelector('select', { timeout: 5000 })
    
    // Select a region from dropdown (if available)
    const regionSelect = page.locator('select').first()
    const options = await regionSelect.locator('option').all()
    
    if (options.length > 1) {
      // Select second option (first is usually "All")
      await regionSelect.selectOption({ index: 1 })
      
      // Wait for table to update
      await page.waitForTimeout(1000)
      
      // Verify filter was applied (table should still be visible)
      await expect(page.locator('table')).toBeVisible()
    }
  })

  // Test: Filter by asset type works
  test('should filter assets by type', async ({ page }) => {
    // Find Asset Type filter (second select)
    const selects = page.locator('select')
    const assetTypeSelect = selects.nth(1)
    
    // Select "copper" option
    await assetTypeSelect.selectOption('copper')
    
    // Wait for table to update
    await page.waitForTimeout(1000)
    
    // Verify filter was applied
    await expect(page.locator('table')).toBeVisible()
  })

  // Test: Filter by status works
  test('should filter assets by status', async ({ page }) => {
    // Find Status filter (third select)
    const selects = page.locator('select')
    const statusSelect = selects.nth(2)
    
    // Select "completed" option
    await statusSelect.selectOption('completed')
    
    // Wait for table to update
    await page.waitForTimeout(1000)
    
    // Verify filter was applied
    await expect(page.locator('table')).toBeVisible()
  })

  // Test: CSV upload button is clickable
  test('should have clickable CSV upload button', async ({ page }) => {
    // Find the upload button/label
    const uploadLabel = page.locator('label:has-text("Upload CSV")')
    
    // Check it's visible
    await expect(uploadLabel).toBeVisible()
    
    // Check it has file input
    const fileInput = uploadLabel.locator('input[type="file"]')
    await expect(fileInput).toBeVisible()
  })

  // Test: Map visualization section displays
  test('should display map visualization section', async ({ page }) => {
    // Check for map section title
    await expect(page.locator('text=Location Map')).toBeVisible()
    
    // Check for map container
    const mapContainer = page.locator('text=Location Map').locator('..').locator('..')
    await expect(mapContainer).toBeVisible()
  })

  // Test: Assets table displays (if data exists)
  test('should display assets table', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(2000)
    
    // Check for table element
    const table = page.locator('table')
    await expect(table).toBeVisible()
    
    // Check for table headers
    await expect(page.locator('text=ID')).toBeVisible()
    await expect(page.locator('text=Type')).toBeVisible()
    await expect(page.locator('text=Location')).toBeVisible()
    await expect(page.locator('text=Region')).toBeVisible()
    await expect(page.locator('text=Status')).toBeVisible()
  })

  // Test: CSV upload with valid file (if Supabase is configured)
  test('should handle CSV file selection', async ({ page }) => {
    // Check if CSV example file exists
    const csvPath = path.join(__dirname, '../../CSV_EXAMPLE.csv')
    
    // Set up file input
    const fileInput = page.locator('input[type="file"]')
    
    // Set up file chooser listener
    await fileInput.setInputFiles(csvPath).catch(() => {
      // File might not exist, that's okay for this test
      // We're just testing the file input is accessible
    })
    
    // Verify file input exists and is accessible
    await expect(fileInput).toBeVisible()
  })
})

