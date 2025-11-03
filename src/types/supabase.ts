// Supabase database types
// This file defines TypeScript types for the Supabase database schema
// These types ensure type safety when working with database tables

// Database type definition
// This is a placeholder - will be generated from actual Supabase schema
// For now, we define the structure based on our data model from the PRD

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database type definition
export interface Database {
  public: {
    Tables: {
      // Assets table - stores infrastructure assets (copper, fiber, ONT)
      assets: {
        Row: {
          id: string // Primary key - UUID
          type: 'copper' | 'fiber' | 'ONT' // Asset type from enum
          location_id: string | null // Foreign key to locations table
          status: 'active' | 'pending' | 'completed' | 'failed' // Asset status
          installation_date: string | null // ISO date string (YYYY-MM-DD)
          technician_id: string | null // Foreign key to technicians table
          created_at: string // Timestamp when record was created
          updated_at: string // Timestamp when record was last updated
        }
        Insert: {
          id?: string // Optional - Supabase will generate UUID if not provided
          type: 'copper' | 'fiber' | 'ONT'
          location_id?: string | null
          status?: 'active' | 'pending' | 'completed' | 'failed'
          installation_date?: string | null
          technician_id?: string | null
          created_at?: string // Optional - defaults to now()
          updated_at?: string // Optional - defaults to now()
        }
        Update: {
          id?: string
          type?: 'copper' | 'fiber' | 'ONT'
          location_id?: string | null
          status?: 'active' | 'pending' | 'completed' | 'failed'
          installation_date?: string | null
          technician_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Locations table - stores physical addresses
      locations: {
        Row: {
          id: string // Primary key
          address: string // Street address
          region: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North' // BC region
          coordinates: Json // JSON object with lat/lng: { lat: number, lng: number }
          wave_id: string | null // Foreign key to waves table
          fiber_status: 'Fiber Ready' | 'Pending Feasibility' | 'Copper Only' // Fiber readiness
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          address: string
          region: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
          coordinates: Json
          wave_id?: string | null
          fiber_status?: 'Fiber Ready' | 'Pending Feasibility' | 'Copper Only'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          address?: string
          region?: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
          coordinates?: Json
          wave_id?: string | null
          fiber_status?: 'Fiber Ready' | 'Pending Feasibility' | 'Copper Only'
          created_at?: string
          updated_at?: string
        }
      }
      // Waves table - migration wave groups
      waves: {
        Row: {
          id: string // Primary key
          name: string // Wave name (e.g., "Wave 1 - Lower Mainland Hospitals")
          start_date: string // ISO date (YYYY-MM-DD)
          end_date: string // ISO date (YYYY-MM-DD)
          region: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
          customer_cohort: 'Hospitals' | 'Government' | 'Enterprise'
          progress_status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
          progress_percentage: number // 0-100
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          region: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
          customer_cohort: 'Hospitals' | 'Government' | 'Enterprise'
          progress_status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          region?: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
          customer_cohort?: 'Hospitals' | 'Government' | 'Enterprise'
          progress_status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Technicians table - field service personnel
      technicians: {
        Row: {
          id: string // Primary key
          name: string // Full name
          phone: string // Phone number
          assigned_jobs: number // Count of assigned jobs (calculated field)
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          assigned_jobs?: number // Defaults to 0
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          assigned_jobs?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Customers table - business clients
      customers: {
        Row: {
          id: string // Primary key
          name: string // Business name
          phone: string // Contact phone
          address: string // Physical address
          consent_status: 'Consented' | 'Pending' | 'Declined'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address: string
          consent_status?: 'Consented' | 'Pending' | 'Declined'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string
          consent_status?: 'Consented' | 'Pending' | 'Declined'
          created_at?: string
          updated_at?: string
        }
      }
      // Work orders table - technician assignments
      work_orders: {
        Row: {
          id: string // Primary key
          location_id: string // Foreign key to locations
          technician_id: string // Foreign key to technicians
          status: 'Assigned' | 'In Progress' | 'Completed' | 'Failed'
          start_time: string | null // ISO timestamp
          end_time: string | null // ISO timestamp
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_id: string
          technician_id: string
          status?: 'Assigned' | 'In Progress' | 'Completed' | 'Failed'
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          technician_id?: string
          status?: 'Assigned' | 'In Progress' | 'Completed' | 'Failed'
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Consent logs table - audit trail for customer consent
      consent_logs: {
        Row: {
          id: string // Primary key
          customer_id: string // Foreign key to customers
          agent_name: string // Name of agent who recorded consent
          status: 'Consented' | 'Pending' | 'Declined'
          timestamp: string // ISO timestamp
          notes: string | null // Additional notes
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          agent_name: string
          status: 'Consented' | 'Pending' | 'Declined'
          timestamp?: string // Defaults to now()
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          agent_name?: string
          status?: 'Consented' | 'Pending' | 'Declined'
          timestamp?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never // No views defined yet
    }
    Functions: {
      [_ in never]: never // No functions defined yet
    }
    Enums: {
      // Enum types for database constraints
      asset_type: 'copper' | 'fiber' | 'ONT'
      asset_status: 'active' | 'pending' | 'completed' | 'failed'
      region: 'Vancouver Island' | 'Lower Mainland' | 'Interior' | 'North'
      fiber_status: 'Fiber Ready' | 'Pending Feasibility' | 'Copper Only'
      customer_cohort: 'Hospitals' | 'Government' | 'Enterprise'
      wave_progress_status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
      work_order_status: 'Assigned' | 'In Progress' | 'Completed' | 'Failed'
      consent_status: 'Consented' | 'Pending' | 'Declined'
    }
  }
}

