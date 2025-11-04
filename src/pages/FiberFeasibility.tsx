// Import React for JSX and hooks for component state and effects
import { useState, useEffect } from 'react'
// Import Supabase API functions
import { fetchLocations, updateLocationFiberStatus } from '../services/api'
// Import types
import type { Location, FiberStatus } from '../types'

// FiberFeasibility component - validate fiber readiness with Supabase integration
function FiberFeasibility() {
  // State to store locations from Supabase
  const [locations, setLocations] = useState<Location[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for filter
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  
  // State for updating status
  const [updating, setUpdating] = useState<string | null>(null)

  // Fetch locations from Supabase on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        
        const locationsData = await fetchLocations()
        setLocations(locationsData)
      } catch (err: any) {
        console.error('Error loading locations:', err)
        setError(err.message || 'Failed to load locations')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Get unique regions
  const regions = ['All', ...new Set(locations.map(loc => loc.region))]

  // Filter locations by region
  const filteredLocations = locations.filter(
    (loc) => selectedRegion === 'All' || loc.region === selectedRegion
  )

  // Count locations by fiber status
  const fiberReadyCount = filteredLocations.filter(loc => loc.fiber_status === 'Fiber Ready').length
  const pendingCount = filteredLocations.filter(loc => loc.fiber_status === 'Pending Feasibility').length
  const copperOnlyCount = filteredLocations.filter(loc => loc.fiber_status === 'Copper Only').length

  // Handle manual status update - saves to Supabase
  const handleStatusUpdate = async (locationId: string, newStatus: FiberStatus) => {
    setUpdating(locationId)
    try {
      const success = await updateLocationFiberStatus(locationId, newStatus)
      
      if (success) {
        // Update local state to reflect the change
        setLocations(
          locations.map((loc) =>
            loc.id === locationId ? { ...loc, fiber_status: newStatus } : loc
          )
        )
      } else {
        setError('Failed to update fiber status. Please try again.')
      }
    } catch (err: any) {
      console.error('Error updating fiber status:', err)
      setError(err.message || 'Failed to update fiber status')
    } finally {
      setUpdating(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fiber feasibility data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-900">Fiber Feasibility Validation</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fiber Ready Card */}
        <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Fiber Ready</p>
              <p className="text-3xl font-bold text-green-800 mt-2">{fiberReadyCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* Pending Feasibility Card */}
        <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Feasibility</p>
              <p className="text-3xl font-bold text-yellow-800 mt-2">{pendingCount}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        {/* Copper Only Card */}
        <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Copper Only</p>
              <p className="text-3xl font-bold text-red-800 mt-2">{copperOnlyCount}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Region
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Locations Table with Manual Update */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Map through filtered locations */}
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No locations found. Upload CSV data in Assets & Locations page to get started.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {location.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Current status badge */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          location.fiber_status === 'Fiber Ready'
                            ? 'bg-green-100 text-green-800'
                            : location.fiber_status === 'Pending Feasibility'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {location.fiber_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Status update dropdown - allows Network Planner to override */}
                      <select
                        value={location.fiber_status}
                        onChange={(e) => handleStatusUpdate(location.id, e.target.value as FiberStatus)}
                        disabled={updating === location.id}
                        className="border border-gray-300 rounded px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Fiber Ready">Fiber Ready</option>
                        <option value="Pending Feasibility">Pending Feasibility</option>
                        <option value="Copper Only">Copper Only</option>
                      </select>
                      {updating === location.id && (
                        <span className="ml-2 text-xs text-gray-500">Updating...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fiber Status Map</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Color-coded map visualization */}
          {filteredLocations.length > 0 ? (
            <div className="w-full h-full p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {filteredLocations.slice(0, 12).map((location) => (
                  <div
                    key={location.id}
                    className={`p-2 rounded shadow-sm border-2 ${
                      location.fiber_status === 'Fiber Ready'
                        ? 'bg-green-50 border-green-300'
                        : location.fiber_status === 'Pending Feasibility'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                    title={location.address}
                  >
                    <p className="font-medium truncate text-xs">{location.address.split(',')[0]}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {location.coordinates.lat.toFixed(2)}, {location.coordinates.lng.toFixed(2)}
                    </p>
                    <span className={`inline-block mt-1 px-1 py-0.5 rounded text-xs font-semibold ${
                      location.fiber_status === 'Fiber Ready'
                        ? 'bg-green-200 text-green-900'
                        : location.fiber_status === 'Pending Feasibility'
                        ? 'bg-yellow-200 text-yellow-900'
                        : 'bg-red-200 text-red-900'
                    }`}>
                      {location.fiber_status}
                    </span>
                  </div>
                ))}
              </div>
              {filteredLocations.length > 12 && (
                <p className="text-center text-gray-500 mt-4">
                  Showing 12 of {filteredLocations.length} locations. Use filters to narrow down.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No locations to display. Upload CSV data to see locations on the map.</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Color coding: Green = Fiber Ready, Yellow = Pending Feasibility, Red = Copper Only
        </p>
      </div>
    </div>
  )
}

export default FiberFeasibility
