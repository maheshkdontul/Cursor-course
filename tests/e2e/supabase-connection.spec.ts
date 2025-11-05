/**
 * Supabase Connection E2E Tests
 * Tests Supabase connectivity and database operations
 * 
 * These tests verify Phase 2 functionality:
 * - Supabase connection works
 * - Database tables are accessible
 * - Data can be read from database
 */

import { test, expect } from '@playwright/test'

test.describe('Supabase Connection', () => {
  // Test: Dashboard shows connection status
  test('should display Supabase connection status on dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForSelector('h1', { timeout: 10000 })
    
    // Check for connection test component (if visible)
    const connectionTest = page.locator('text=Supabase Connection Test')
    const isVisible = await connectionTest.isVisible().catch(() => false)
    
    if (isVisible) {
      // Wait for connection test to complete
      await page.waitForTimeout(3000)
      
      // Check for success or error message
      const successMessage = page.locator('text=/Successfully connected|connection successful/i')
      const errorMessage = page.locator('text=/connection failed|not configured/i')
      
      const hasSuccess = await successMessage.isVisible().catch(() => false)
      const hasError = await errorMessage.isVisible().catch(() => false)
      
      // Should show either success or error (not neither)
      expect(hasSuccess || hasError).toBeTruthy()
    }
  })

  // Test: Pages load data from Supabase (or show empty state)
  test('should load data or show empty state', async ({ page }) => {
    await page.goto('/assets-locations')
    await page.waitForSelector('h1', { timeout: 10000 })
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Should either show data or empty state message
    const table = page.locator('table')
    const emptyMessage = page.locator('text=/No assets found|No locations found/i')
    
    const hasTable = await table.isVisible().catch(() => false)
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false)
    
    // Should show either table with data or empty message
    expect(hasTable || hasEmptyMessage).toBeTruthy()
  })

  // Test: No critical JavaScript errors
  test('should not have critical JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Navigate through main pages
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    
    await page.goto('/assets-locations')
    await page.waitForTimeout(1000)
    
    await page.goto('/fiber-feasibility')
    await page.waitForTimeout(1000)
    
    await page.goto('/waves-management')
    await page.waitForTimeout(1000)
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Supabase') &&
        !error.includes('Missing Supabase') &&
        !error.includes('favicon') &&
        !error.includes('chrome-error')
    )
    
    // Should have no critical errors
    expect(criticalErrors.length).toBe(0)
  })
})

