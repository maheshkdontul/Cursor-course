/**
 * Navigation E2E Tests
 * Tests that all navigation links work correctly and pages load
 * 
 * These tests verify Phase 1 functionality:
 * - Sidebar navigation works
 * - All pages are accessible
 * - Routes are correct
 */

import { test, expect } from '@playwright/test'

// Test suite: Navigation between pages
test.describe('Navigation', () => {
  // Before each test, navigate to the dashboard
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Wait for the page to load (check for main content)
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  // Test: Dashboard page loads correctly
  test('should load Dashboard page', async ({ page }) => {
    // Check that we're on the dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Check for KPI cards (completed migrations card)
    await expect(page.locator('text=Completed Migrations')).toBeVisible()
  })

  // Test: Navigate to Assets & Locations page
  test('should navigate to Assets & Locations page', async ({ page }) => {
    // Click on Assets & Locations in sidebar
    await page.click('text=Assets & Locations')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/assets-locations')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Assets & Locations')
    
    // Check for CSV upload button
    await expect(page.locator('text=Upload CSV')).toBeVisible()
  })

  // Test: Navigate to Fiber Feasibility page
  test('should navigate to Fiber Feasibility page', async ({ page }) => {
    // Click on Fiber Feasibility in sidebar
    await page.click('text=Fiber Feasibility')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/fiber-feasibility')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Fiber Feasibility')
    
    // Check for summary cards
    await expect(page.locator('text=Fiber Ready')).toBeVisible()
  })

  // Test: Navigate to Technician Scheduling page
  test('should navigate to Technician Scheduling page', async ({ page }) => {
    // Click on Technician Scheduling in sidebar
    await page.click('text=Technician Scheduling')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/technician-scheduling')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Technician Scheduling')
  })

  // Test: Navigate to Customer Engagement page
  test('should navigate to Customer Engagement page', async ({ page }) => {
    // Click on Customer Engagement in sidebar
    await page.click('text=Customer Engagement')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/customer-engagement')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Customer Engagement')
  })

  // Test: Navigate to Waves Management page
  test('should navigate to Waves Management page', async ({ page }) => {
    // Click on Waves Management in sidebar
    await page.click('text=Waves Management')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/waves-management')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Waves Management')
    
    // Check for create wave button
    await expect(page.locator('text=Create New Wave')).toBeVisible()
  })

  // Test: Navigate to Reports page
  test('should navigate to Reports page', async ({ page }) => {
    // Click on Reports in sidebar
    await page.click('text=Reports & Analytics')
    
    // Wait for URL to change
    await expect(page).toHaveURL('/reports')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Reports & Analytics')
  })

  // Test: Sidebar highlights active page
  test('should highlight active page in sidebar', async ({ page }) => {
    // Navigate to Dashboard
    await page.click('text=Dashboard')
    await expect(page).toHaveURL('/dashboard')
    
    // Check that Dashboard link has active styling
    const dashboardLink = page.locator('a[href="/dashboard"]')
    await expect(dashboardLink).toHaveClass(/bg-primary-100|font-semibold/)
    
    // Navigate to Assets page
    await page.click('text=Assets & Locations')
    await expect(page).toHaveURL('/assets-locations')
    
    // Check that Assets link is now active
    const assetsLink = page.locator('a[href="/assets-locations"]')
    await expect(assetsLink).toHaveClass(/bg-primary-100|font-semibold/)
  })
})

