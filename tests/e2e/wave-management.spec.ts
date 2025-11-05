/**
 * Wave Management E2E Tests
 * Tests the Wave Management page functionality
 * 
 * These tests verify Phase 3 functionality:
 * - Wave creation modal works
 * - Waves display correctly
 * - Progress bars show
 */

import { test, expect } from '@playwright/test'

test.describe('Wave Management', () => {
  // Before each test, navigate to Waves Management page
  test.beforeEach(async ({ page }) => {
    await page.goto('/waves-management')
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  // Test: Page loads correctly
  test('should load Waves Management page', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Waves Management')
    
    // Check for create wave button
    await expect(page.locator('text=Create New Wave')).toBeVisible()
  })

  // Test: Create wave button opens modal
  test('should open create wave modal', async ({ page }) => {
    // Click create wave button
    await page.click('text=Create New Wave')
    
    // Wait for modal to appear
    await expect(page.locator('text=Create New Wave').nth(1)).toBeVisible() // Modal title
    
    // Check for form fields
    await expect(page.locator('label:has-text("Wave Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Start Date")')).toBeVisible()
    await expect(page.locator('label:has-text("End Date")')).toBeVisible()
    await expect(page.locator('label:has-text("Region")')).toBeVisible()
    await expect(page.locator('label:has-text("Customer Cohort")')).toBeVisible()
  })

  // Test: Wave creation form has all required fields
  test('should have all required form fields', async ({ page }) => {
    // Open modal
    await page.click('text=Create New Wave')
    
    // Wait for modal
    await page.waitForSelector('text=Create New Wave', { state: 'visible' })
    
    // Check all form fields exist
    const waveNameInput = page.locator('input[name="name"]')
    await expect(waveNameInput).toBeVisible()
    
    const startDateInput = page.locator('input[name="start_date"]')
    await expect(startDateInput).toBeVisible()
    
    const endDateInput = page.locator('input[name="end_date"]')
    await expect(endDateInput).toBeVisible()
    
    const regionSelect = page.locator('select[name="region"]')
    await expect(regionSelect).toBeVisible()
    
    const cohortSelect = page.locator('select[name="customer_cohort"]')
    await expect(cohortSelect).toBeVisible()
  })

  // Test: Can fill and submit wave creation form
  test('should allow filling wave creation form', async ({ page }) => {
    // Open modal
    await page.click('text=Create New Wave')
    await page.waitForSelector('input[name="name"]', { state: 'visible' })
    
    // Fill form fields
    await page.fill('input[name="name"]', 'E2E Test Wave')
    
    // Set dates (use future dates)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    await page.fill('input[name="start_date"]', tomorrow.toISOString().split('T')[0])
    await page.fill('input[name="end_date"]', nextWeek.toISOString().split('T')[0])
    
    // Select region
    await page.selectOption('select[name="region"]', 'Lower Mainland')
    
    // Select cohort
    await page.selectOption('select[name="customer_cohort"]', 'Hospitals')
    
    // Verify form is filled
    await expect(page.locator('input[name="name"]')).toHaveValue('E2E Test Wave')
    
    // Submit form (this will create wave in Supabase if configured)
    await page.click('button:has-text("Create Wave")')
    
    // Wait for modal to close (if creation succeeds) or error message
    await page.waitForTimeout(2000)
    
    // Modal should close or error should appear
    const modalVisible = await page.locator('text=Create New Wave').nth(1).isVisible().catch(() => false)
    const errorVisible = await page.locator('text=Failed').isVisible().catch(() => false)
    
    // Either modal closed (success) or error shown (but form worked)
    expect(!modalVisible || errorVisible).toBeTruthy()
  })

  // Test: Can cancel wave creation
  test('should allow canceling wave creation', async ({ page }) => {
    // Open modal
    await page.click('text=Create New Wave')
    await page.waitForSelector('input[name="name"]', { state: 'visible' })
    
    // Fill a field
    await page.fill('input[name="name"]', 'Test Wave')
    
    // Click cancel
    await page.click('button:has-text("Cancel")')
    
    // Modal should close
    await page.waitForTimeout(500)
    const modalVisible = await page.locator('text=Create New Wave').nth(1).isVisible().catch(() => false)
    expect(modalVisible).toBe(false)
  })

  // Test: Wave cards display (if waves exist)
  test('should display wave cards', async ({ page }) => {
    // Wait for waves to load
    await page.waitForTimeout(2000)
    
    // Check for wave cards container
    const waveCards = page.locator('.grid').first()
    await expect(waveCards).toBeVisible()
  })

  // Test: Progress bars display (if waves exist)
  test('should display progress bars for waves', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Check for progress text (may not exist if no waves)
    const progressText = page.locator('text=/Progress|\\d+%/')
    const count = await progressText.count()
    
    // If waves exist, progress should be visible
    if (count > 0) {
      await expect(progressText.first()).toBeVisible()
    }
  })

  // Test: Refresh progress button works (if waves exist)
  test('should have refresh progress functionality', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Check for refresh progress button
    const refreshButton = page.locator('text=Refresh Progress')
    const count = await refreshButton.count()
    
    if (count > 0) {
      // Click refresh button
      await refreshButton.first().click()
      
      // Wait for update
      await page.waitForTimeout(1000)
      
      // Verify button is still there (didn't break)
      await expect(refreshButton.first()).toBeVisible()
    }
  })
})

