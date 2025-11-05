/**
 * Test Helper Functions
 * Utility functions for E2E tests
 */

import { Page } from '@playwright/test'

/**
 * Wait for Supabase connection to be established
 * Useful for pages that need to load data from database
 */
export async function waitForSupabaseConnection(page: Page, timeout = 10000) {
  try {
    // Wait for either connection success or error message
    await page.waitForSelector(
      'text=/Successfully connected|connection failed|not configured/i',
      { timeout }
    )
  } catch {
    // Connection test might not be visible, continue anyway
  }
}

/**
 * Wait for data to load on a page
 * Checks for either data table or empty state message
 */
export async function waitForDataLoad(page: Page) {
  // Wait for either table or empty message
  await Promise.race([
    page.waitForSelector('table', { timeout: 5000 }).catch(() => {}),
    page.waitForSelector('text=/No.*found|empty/i', { timeout: 5000 }).catch(() => {}),
  ])
}

/**
 * Get text content safely (handles missing elements)
 */
export async function getTextSafe(page: Page, selector: string): Promise<string> {
  try {
    const element = page.locator(selector)
    if (await element.count() > 0) {
      return await element.textContent() || ''
    }
  } catch {
    // Element not found
  }
  return ''
}

/**
 * Check if element exists and is visible
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    return await page.locator(selector).isVisible()
  } catch {
    return false
  }
}

