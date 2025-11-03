// Database connection test file
// This file can be used to test Supabase connectivity
// Run this in browser console or use it in development

import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Test Supabase connection by fetching waves
 * This function checks if:
 * 1. Supabase is configured (env variables set)
 * 2. Connection to Supabase works
 * 3. Database tables are accessible
 */
export async function testSupabaseConnection() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not configured!')
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file')
    return false
  }

  console.log('✅ Supabase is configured')
  console.log('Testing connection...')

  try {
    // Test query - fetch waves table
    const { data, error } = await supabase
      .from('waves')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection error:', error)
      return false
    }

    console.log('✅ Successfully connected to Supabase!')
    console.log('✅ Database tables are accessible')
    console.log('Sample data:', data)
    return true
  } catch (err) {
    console.error('❌ Connection failed:', err)
    return false
  }
}

/**
 * Test all tables are accessible
 */
export async function testAllTables() {
  const tables = ['waves', 'locations', 'technicians', 'customers', 'assets', 'work_orders', 'consent_logs']
  const results: { [key: string]: boolean } = {}

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1)
      results[table] = !error
      if (error) {
        console.error(`❌ Error accessing ${table}:`, error.message)
      } else {
        console.log(`✅ ${table} is accessible`)
      }
    } catch (err) {
      results[table] = false
      console.error(`❌ ${table} failed:`, err)
    }
  }

  return results
}

// Export test functions for use in development
export { supabase }

