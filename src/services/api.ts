// Supabase API service functions
// This file contains all functions to interact with Supabase database
// Replaces mock data with actual database queries

import { supabase } from './supabase'
import type {
  Asset,
  Location,
  Wave,
  Technician,
  Customer,
  WorkOrder,
  ConsentLog,
  Region,
  CustomerCohort,
  FiberStatus,
  AssetStatus,
  WorkOrderStatus,
  ConsentStatus,
} from '../types'

// ============================================================================
// ASSETS API
// ============================================================================

/**
 * Fetch all assets from Supabase
 * Returns array of assets with their associated locations
 */
export async function fetchAssets(): Promise<Asset[]> {
  try {
    // Fetch assets with related location data
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching assets:', error)
      throw error
    }

    // Transform Supabase data to our Asset type
    return (data || []).map((asset) => ({
      id: asset.id,
      type: asset.type as Asset['type'],
      location_id: asset.location_id || '',
      status: asset.status as AssetStatus,
      installation_date: asset.installation_date || undefined,
      technician_id: asset.technician_id || undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch assets:', error)
    return []
  }
}

/**
 * Create a new asset in Supabase
 */
export async function createAsset(asset: Omit<Asset, 'id'>): Promise<Asset | null> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert({
        type: asset.type,
        location_id: asset.location_id || null,
        status: asset.status,
        installation_date: asset.installation_date || null,
        technician_id: asset.technician_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating asset:', error)
      throw error
    }

    return {
      id: data.id,
      type: data.type as Asset['type'],
      location_id: data.location_id || '',
      status: data.status as AssetStatus,
      installation_date: data.installation_date || undefined,
      technician_id: data.technician_id || undefined,
    }
  } catch (error) {
    console.error('Failed to create asset:', error)
    return null
  }
}

/**
 * Update an existing asset
 */
export async function updateAsset(id: string, updates: Partial<Asset>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('assets')
      .update({
        type: updates.type,
        location_id: updates.location_id || null,
        status: updates.status,
        installation_date: updates.installation_date || null,
        technician_id: updates.technician_id || null,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating asset:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Failed to update asset:', error)
    return false
  }
}

/**
 * Bulk insert assets from CSV upload
 */
export async function bulkCreateAssets(assets: Omit<Asset, 'id'>[]): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []

  // Process in batches to avoid overwhelming Supabase
  const batchSize = 50
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize)
    
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(
          batch.map((asset) => ({
            type: asset.type,
            location_id: asset.location_id || null,
            status: asset.status,
            installation_date: asset.installation_date || null,
            technician_id: asset.technician_id || null,
          }))
        )
        .select()

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
        failed += batch.length
        errors.push(`Batch ${i / batchSize + 1}: ${error.message}`)
      } else {
        success += data?.length || 0
      }
    } catch (error: any) {
      console.error(`Failed to insert batch ${i / batchSize + 1}:`, error)
      failed += batch.length
      errors.push(`Batch ${i / batchSize + 1}: ${error.message || 'Unknown error'}`)
    }
  }

  return { success, failed, errors }
}

// ============================================================================
// LOCATIONS API
// ============================================================================

/**
 * Fetch all locations from Supabase
 */
export async function fetchLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('address', { ascending: true })

    if (error) {
      console.error('Error fetching locations:', error)
      throw error
    }

    return (data || []).map((loc) => ({
      id: loc.id,
      address: loc.address,
      region: loc.region as Region,
      coordinates: loc.coordinates as { lat: number; lng: number },
      wave_id: loc.wave_id || undefined,
      fiber_status: loc.fiber_status as FiberStatus,
    }))
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    return []
  }
}

/**
 * Create a new location
 */
export async function createLocation(location: Omit<Location, 'id'>): Promise<Location | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .insert({
        address: location.address,
        region: location.region,
        coordinates: location.coordinates,
        wave_id: location.wave_id || null,
        fiber_status: location.fiber_status,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating location:', error)
      throw error
    }

    return {
      id: data.id,
      address: data.address,
      region: data.region as Region,
      coordinates: data.coordinates as { lat: number; lng: number },
      wave_id: data.wave_id || undefined,
      fiber_status: data.fiber_status as FiberStatus,
    }
  } catch (error) {
    console.error('Failed to create location:', error)
    return null
  }
}

/**
 * Update location fiber status
 */
export async function updateLocationFiberStatus(
  locationId: string,
  fiberStatus: FiberStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('locations')
      .update({ fiber_status: fiberStatus })
      .eq('id', locationId)

    if (error) {
      console.error('Error updating location fiber status:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Failed to update location fiber status:', error)
    return false
  }
}

// ============================================================================
// WAVES API
// ============================================================================

/**
 * Fetch all waves from Supabase
 */
export async function fetchWaves(): Promise<Wave[]> {
  try {
    const { data, error } = await supabase
      .from('waves')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching waves:', error)
      throw error
    }

    return (data || []).map((wave) => ({
      id: wave.id,
      name: wave.name,
      start_date: wave.start_date,
      end_date: wave.end_date,
      region: wave.region as Region,
      customer_cohort: wave.customer_cohort as CustomerCohort,
      progress_status: wave.progress_status as Wave['progress_status'],
      progress_percentage: wave.progress_percentage,
    }))
  } catch (error) {
    console.error('Failed to fetch waves:', error)
    return []
  }
}

/**
 * Create a new wave
 */
export async function createWave(wave: Omit<Wave, 'id' | 'progress_percentage'>): Promise<Wave | null> {
  try {
    const { data, error } = await supabase
      .from('waves')
      .insert({
        name: wave.name,
        start_date: wave.start_date,
        end_date: wave.end_date,
        region: wave.region,
        customer_cohort: wave.customer_cohort,
        progress_status: wave.progress_status || 'Planning',
        progress_percentage: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating wave:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      region: data.region as Region,
      customer_cohort: data.customer_cohort as CustomerCohort,
      progress_status: data.progress_status as Wave['progress_status'],
      progress_percentage: data.progress_percentage,
    }
  } catch (error) {
    console.error('Failed to create wave:', error)
    return null
  }
}

/**
 * Update wave progress based on work orders
 */
export async function updateWaveProgress(waveId: string): Promise<number> {
  try {
    // Count completed work orders for locations in this wave
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('id')
      .eq('wave_id', waveId)

    if (locationsError) {
      console.error('Error fetching locations for wave:', locationsError)
      throw locationsError
    }

    if (!locations || locations.length === 0) {
      // Update wave to 0% if no locations
      await supabase
        .from('waves')
        .update({ progress_percentage: 0 })
        .eq('id', waveId)
      return 0
    }

    const locationIds = locations.map((loc) => loc.id)

    // Fetch all work orders for these locations
    const { data: workOrders, error: workOrdersError } = await supabase
      .from('work_orders')
      .select('status')
      .in('location_id', locationIds)

    if (workOrdersError) {
      console.error('Error fetching work orders:', workOrdersError)
      throw workOrdersError
    }

    // Calculate progress
    const totalWorkOrders = workOrders?.length || 0
    const completedWorkOrders = workOrders?.filter(wo => wo.status === 'Completed').length || 0

    const progressPercentage = totalWorkOrders > 0
      ? Math.round((completedWorkOrders / totalWorkOrders) * 100)
      : 0

    // Update wave progress
    const { error: updateError } = await supabase
      .from('waves')
      .update({ progress_percentage: progressPercentage })
      .eq('id', waveId)

    if (updateError) {
      console.error('Error updating wave progress:', updateError)
      throw updateError
    }

    return progressPercentage
  } catch (error) {
    console.error('Failed to update wave progress:', error)
    return 0
  }
}

// ============================================================================
// TECHNICIANS API
// ============================================================================

/**
 * Fetch all technicians
 */
export async function fetchTechnicians(): Promise<Technician[]> {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching technicians:', error)
      throw error
    }

    return (data || []).map((tech) => ({
      id: tech.id,
      name: tech.name,
      phone: tech.phone,
      assigned_jobs: tech.assigned_jobs,
    }))
  } catch (error) {
    console.error('Failed to fetch technicians:', error)
    return []
  }
}

// ============================================================================
// WORK ORDERS API
// ============================================================================

/**
 * Fetch all work orders
 */
export async function fetchWorkOrders(): Promise<WorkOrder[]> {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching work orders:', error)
      throw error
    }

    return (data || []).map((wo) => ({
      id: wo.id,
      location_id: wo.location_id,
      technician_id: wo.technician_id,
      status: wo.status as WorkOrderStatus,
      start_time: wo.start_time || undefined,
      end_time: wo.end_time || undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch work orders:', error)
    return []
  }
}

/**
 * Update work order status
 */
export async function updateWorkOrderStatus(
  workOrderId: string,
  status: WorkOrderStatus,
  startTime?: string,
  endTime?: string
): Promise<boolean> {
  try {
    const updateData: any = { status }
    if (startTime) updateData.start_time = startTime
    if (endTime) updateData.end_time = endTime

    const { error } = await supabase
      .from('work_orders')
      .update(updateData)
      .eq('id', workOrderId)

    if (error) {
      console.error('Error updating work order:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Failed to update work order:', error)
    return false
  }
}

// ============================================================================
// CUSTOMERS API
// ============================================================================

/**
 * Fetch all customers
 */
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching customers:', error)
      throw error
    }

    return (data || []).map((cust) => ({
      id: cust.id,
      name: cust.name,
      phone: cust.phone,
      address: cust.address,
      consent_status: cust.consent_status as ConsentStatus,
    }))
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return []
  }
}

/**
 * Update customer consent status
 */
export async function updateCustomerConsent(
  customerId: string,
  consentStatus: ConsentStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({ consent_status: consentStatus })
      .eq('id', customerId)

    if (error) {
      console.error('Error updating customer consent:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Failed to update customer consent:', error)
    return false
  }
}

// ============================================================================
// CONSENT LOGS API
// ============================================================================

/**
 * Fetch all consent logs
 */
export async function fetchConsentLogs(): Promise<ConsentLog[]> {
  try {
    const { data, error } = await supabase
      .from('consent_logs')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching consent logs:', error)
      throw error
    }

    return (data || []).map((log) => ({
      id: log.id,
      customer_id: log.customer_id,
      agent_name: log.agent_name,
      status: log.status as ConsentStatus,
      timestamp: log.timestamp,
      notes: log.notes || undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch consent logs:', error)
    return []
  }
}

/**
 * Create a new consent log entry
 */
export async function createConsentLog(
  customerId: string,
  agentName: string,
  status: ConsentStatus,
  notes?: string
): Promise<ConsentLog | null> {
  try {
    const { data, error } = await supabase
      .from('consent_logs')
      .insert({
        customer_id: customerId,
        agent_name: agentName,
        status,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating consent log:', error)
      throw error
    }

    return {
      id: data.id,
      customer_id: data.customer_id,
      agent_name: data.agent_name,
      status: data.status as ConsentStatus,
      timestamp: data.timestamp,
      notes: data.notes || undefined,
    }
  } catch (error) {
    console.error('Failed to create consent log:', error)
    return null
  }
}

