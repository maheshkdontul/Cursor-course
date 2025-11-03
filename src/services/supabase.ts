// Supabase client configuration
// This file creates and exports the Supabase client for use throughout the application

// Import Supabase client library
import { createClient } from '@supabase/supabase-js'

// Import TypeScript types for database schema
import type { Database } from '../types/supabase'

// Get Supabase credentials from environment variables
// These are loaded from .env file (not committed to git)
// VITE_ prefix is required for Vite to expose these variables to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
// This prevents runtime errors if Supabase is not configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables!\n' +
    'Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=your_supabase_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
  )
}

// Create and export the Supabase client
// This client is used to interact with the Supabase database and auth
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    // Auth configuration - using public access for MVP
    auth: {
      // Automatically refresh session tokens
      autoRefreshToken: true,
      // Persist session in browser storage
      persistSession: true,
      // Detect session from URL (for auth callbacks)
      detectSessionInUrl: true,
    },
  }
)

// Export a helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

