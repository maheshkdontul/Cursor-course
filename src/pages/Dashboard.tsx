// Import React for JSX and hooks for component state and effects
import { useState, useEffect } from 'react'
// Import Supabase API functions
import { fetchAssets, fetchLocations, fetchWaves, fetchWorkOrders } from '../services/api'
// Import types
import type { Asset, Location, Wave, WorkOrder } from '../types'
// Import connection test component (optional - remove after testing)
import { TestConnection } from '../utils/testConnection'

// Dashboard component - main overview page with KPIs from Supabase
function Dashboard() {
  // State to store data from Supabase
  const [assets, setAssets] = useState<Asset[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [waves, setWaves] = useState<Wave[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from Supabase on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all data in parallel for better performance
        const [assetsData, locationsData, wavesData, workOrdersData] = await Promise.all([
          fetchAssets(),
          fetchLocations(),
          fetchWaves(),
          fetchWorkOrders(),
        ])
        
        setAssets(assetsData)
        setLocations(locationsData)
        setWaves(wavesData)
        setWorkOrders(workOrdersData)
      } catch (err: any) {
        console.error('Error loading dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate KPIs from data
  // Assets with completed status
  const completedMigrations = assets.filter(a => a.status === 'completed').length
  // Work orders in progress
  const inProgress = workOrders.filter(wo => wo.status === 'In Progress').length
  // Failed work orders
  const failedInstalls = workOrders.filter(wo => wo.status === 'Failed').length
  
  // Calculate average time per install
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'Completed' && wo.start_time && wo.end_time)
  let averageTimePerInstall = 'N/A'
  if (completedWorkOrders.length > 0) {
    const totalTime = completedWorkOrders.reduce((sum, wo) => {
      const start = new Date(wo.start_time!).getTime()
      const end = new Date(wo.end_time!).getTime()
      return sum + (end - start)
    }, 0)
    const avgMs = totalTime / completedWorkOrders.length
    const avgHours = avgMs / (1000 * 60 * 60)
    averageTimePerInstall = `${avgHours.toFixed(1)} hours`
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Supabase Connection Test - Remove this after verifying connection works */}
      <TestConnection />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Migrations Completed Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              {/* KPI label */}
              <p className="text-sm font-medium text-gray-600">Completed Migrations</p>
              {/* KPI value - large number */}
              <p className="text-3xl font-bold text-primary-700 mt-2">{completedMigrations}</p>
            </div>
            {/* Icon */}
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{inProgress}</p>
            </div>
            <div className="text-4xl">🔄</div>
          </div>
        </div>

        {/* Failed Installs Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Installs</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{failedInstalls}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>

        {/* Average Time Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time/Install</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{averageTimePerInstall}</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Waves Progress Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Waves Progress</h2>
        {waves.length === 0 ? (
          <p className="text-gray-500">No waves found. Create waves in the Waves Management page.</p>
        ) : (
          <div className="space-y-4">
            {/* Map through waves to show progress bars */}
            {waves.map((wave) => (
              <div key={wave.id} className="space-y-2">
                {/* Wave name and percentage */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{wave.name}</span>
                  <span className="text-sm text-gray-600">{wave.progress_percentage}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${wave.progress_percentage}%` }}
                  />
                </div>
                {/* Wave dates */}
                <p className="text-xs text-gray-500">
                  {wave.start_date} to {wave.end_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Locations</h2>
        {locations.length === 0 ? (
          <p className="text-gray-500">No locations found. Upload CSV data in Assets & Locations page.</p>
        ) : (
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
                    Fiber Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Map through locations to display rows */}
                {locations.slice(0, 5).map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Color-coded status badge */}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
