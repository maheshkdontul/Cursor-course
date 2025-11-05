/**
 * Application Constants
 * Centralized constants to avoid magic strings and numbers
 */

// Valid regions in British Columbia
export const VALID_REGIONS = [
  'Vancouver Island',
  'Lower Mainland',
  'Interior',
  'North',
] as const

// Valid asset types
export const VALID_ASSET_TYPES = ['copper', 'fiber', 'ONT'] as const

// Valid asset statuses
export const VALID_ASSET_STATUSES = ['active', 'pending', 'completed', 'failed'] as const

// Valid fiber statuses
export const VALID_FIBER_STATUSES = [
  'Fiber Ready',
  'Pending Feasibility',
  'Copper Only',
] as const

// Valid customer cohorts
export const VALID_CUSTOMER_COHORTS = ['Hospitals', 'Government', 'Enterprise'] as const

// CSV upload batch size for Supabase
export const CSV_BATCH_SIZE = 50

// Default region for forms
export const DEFAULT_REGION = 'Lower Mainland'

// Default customer cohort for forms
export const DEFAULT_CUSTOMER_COHORT = 'Hospitals'

// Date format regex
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/

// Map display limits
export const MAP_DISPLAY_LIMIT = 12

// Filter "All" option
export const FILTER_ALL = 'All'

