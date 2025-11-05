/**
 * FiberFeasibility Component
 * Validate fiber readiness with Supabase integration
 */

import { useMemo, useState } from 'react'
import { useDataFetching } from '../hooks/useDataFetching'
import { useAsyncOperation } from '../hooks/useAsyncOperation'
import { fetchLocations, updateLocationFiberStatus } from '../services/api'
import { getErrorMessage } from '../utils/errorHandler'
import { FILTER_ALL, MAP_DISPLAY_LIMIT } from '../utils/constants'
import type { Location, FiberStatus } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import StatusBadge from '../components/StatusBadge'
import Notification, { useNotification } from '../components/Notification'

function FiberFeasibility() {
  // Fetch locations using custom hook
  const locationsData = useDataFetching<Location>({ fetchFn: fetchLocations })

  // Notification system
  const { notification, showNotification, dismissNotification } = useNotification()

  // State for filter
  const [selectedRegion, setSelectedRegion] = useState<string>(FILTER_ALL)

  // State for updating status
  const [updating, setUpdating] = useState<string | null>(null)

  // Get unique regions
  const regions = useMemo(
    () => [FILTER_ALL, ...new Set(locationsData.data.map((loc) => loc.region))],
    [locationsData.data]
  )

  // Filter locations by region
  const filteredLocations = useMemo(
    () =>
      locationsData.data.filter(
        (loc) => selectedRegion === FILTER_ALL || loc.region === selectedRegion
      ),
    [locationsData.data, selectedRegion]
  )

  // Count locations by fiber status
  const fiberReadyCount = useMemo(
    () => filteredLocations.filter((loc) => loc.fiber_status === 'Fiber Ready').length,
    [filteredLocations]
  )
  const pendingCount = useMemo(
    () => filteredLocations.filter((loc) => loc.fiber_status === 'Pending Feasibility').length,
    [filteredLocations]
  )
  const copperOnlyCount = useMemo(
    () => filteredLocations.filter((loc) => loc.fiber_status === 'Copper Only').length,
    [filteredLocations]
  )

  // Async operation for status update
  const updateStatusOperation = useAsyncOperation({
    operationFn: async () => {
      // This will be called with context in handleStatusUpdate
      return Promise.resolve()
    },
    onSuccess: () => {
      showNotification('Fiber status updated successfully', 'success')
    },
    onError: (error) => {
      showNotification(`Failed to update status: ${error}`, 'error')
    },
  })

  // Handle manual status update - saves to Supabase
  const handleStatusUpdate = async (locationId: string, newStatus: FiberStatus) => {
    setUpdating(locationId)
    try {
      await updateLocationFiberStatus(locationId, newStatus)

      // Update local state to reflect the change
      locationsData.refetch()
      updateStatusOperation.onSuccess?.()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      updateStatusOperation.onError?.(errorMessage)
    } finally {
      setUpdating(null)
    }
  }

  // Loading state
  if (locationsData.loading) {
    return <LoadingSpinner message="Loading fiber feasibility data..." />
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={dismissNotification}
        />
      )}

      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-900">Fiber Feasibility Validation</h1>

      {/* Error message */}
      {locationsData.error && (
        <ErrorMessage message={locationsData.error} onDismiss={locationsData.clearError} />
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Region</label>
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
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No locations found. Upload CSV data in Assets & Locations page to get started.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{location.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={location.fiber_status} type="fiber" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
          {filteredLocations.length > 0 ? (
            <div className="w-full h-full p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {filteredLocations.slice(0, MAP_DISPLAY_LIMIT).map((location) => (
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
                    <p className="font-medium truncate text-xs">
                      {location.address.split(',')[0]}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {location.coordinates.lat.toFixed(2)}, {location.coordinates.lng.toFixed(2)}
                    </p>
                    <StatusBadge status={location.fiber_status} type="fiber" />
                  </div>
                ))}
              </div>
              {filteredLocations.length > MAP_DISPLAY_LIMIT && (
                <p className="text-center text-gray-500 mt-4">
                  Showing {MAP_DISPLAY_LIMIT} of {filteredLocations.length} locations. Use filters
                  to narrow down.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No locations to display. Upload CSV data to see locations on the map.
            </p>
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
