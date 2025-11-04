// Import React for JSX and hooks for component state and effects
import { useState, useEffect } from 'react'
// Import Supabase API functions
import { fetchAssets, fetchLocations, bulkCreateAssets, createLocation } from '../services/api'
// Import CSV parsing utilities
import { parseCSV, convertCSVToData } from '../utils/csvParser'
// Import types
import type { Asset, Location } from '../types'

// AssetsLocations component - manage inventory with Supabase integration
function AssetsLocations() {
  // State to store data from Supabase
  const [assets, setAssets] = useState<Asset[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for CSV upload
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  
  // State for filters
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  // Fetch data from Supabase on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch both assets and locations in parallel
        const [assetsData, locationsData] = await Promise.all([
          fetchAssets(),
          fetchLocations(),
        ])
        
        setAssets(assetsData)
        setLocations(locationsData)
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, []) // Empty dependency array - only run on mount

  // Get unique regions from locations
  const regions = ['All', ...new Set(locations.map(loc => loc.region))]

  // Filter assets based on selected filters
  const filteredAssets = assets.filter((asset) => {
    // Find location for this asset
    const location = locations.find(loc => loc.id === asset.location_id)
    
    // Filter by region
    const regionMatch = selectedRegion === 'All' || location?.region === selectedRegion
    // Filter by asset type
    const typeMatch = selectedType === 'All' || asset.type === selectedType
    // Filter by status
    const statusMatch = selectedStatus === 'All' || asset.status === selectedStatus
    
    // Asset passes if all filters match
    return regionMatch && typeMatch && statusMatch
  })

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setUploading(true)
    setError(null)
    setUploadResult(null)

    try {
      // Read file content
      const fileContent = await file.text()
      
      // Parse CSV
      const csvRows = parseCSV(fileContent)
      
      // Convert CSV rows to Location and Asset objects
      const { locations: newLocations, assets: newAssets, errors: validationErrors } = 
        await convertCSVToData(csvRows)

      // Show validation errors if any
      if (validationErrors.length > 0) {
        setError(`Validation errors found:\n${validationErrors.join('\n')}`)
      }

      // Create locations first (assets need location IDs)
      const createdLocations: Location[] = []
      for (const locationData of newLocations) {
        const created = await createLocation(locationData)
        if (created) {
          createdLocations.push(created)
        }
      }

      // Link assets to created locations
      const assetsWithLocationIds: Omit<Asset, 'id'>[] = newAssets.map((asset, index) => ({
        ...asset,
        location_id: createdLocations[index]?.id || '',
      }))

      // Filter out assets without valid location IDs
      const validAssets = assetsWithLocationIds.filter(asset => asset.location_id)

      // Bulk create assets
      const result = await bulkCreateAssets(validAssets)

      setUploadResult(result)

      // Refresh data if any assets were created
      if (result.success > 0) {
        // Reload assets and locations
        const [assetsData, locationsData] = await Promise.all([
          fetchAssets(),
          fetchLocations(),
        ])
        setAssets(assetsData)
        setLocations(locationsData)
      }

      // Show success/error message
      if (result.success > 0) {
        alert(`Successfully uploaded ${result.success} assets!${result.failed > 0 ? ` (${result.failed} failed)` : ''}`)
      } else {
        alert(`Upload failed: ${result.errors.join(', ')}`)
      }
    } catch (err: any) {
      console.error('CSV upload error:', err)
      setError(err.message || 'Failed to process CSV file')
      alert(`Error: ${err.message || 'Failed to process CSV file'}`)
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assets and locations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page title and action buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Assets & Locations</h1>
        
        {/* CSV Upload Button */}
        <label className="btn-primary cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Upload result */}
      {uploadResult && (
        <div className={`rounded-lg p-4 ${
          uploadResult.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`font-medium ${
            uploadResult.success > 0 ? 'text-green-800' : 'text-yellow-800'
          }`}>
            Upload complete: {uploadResult.success} successful, {uploadResult.failed} failed
          </p>
          {uploadResult.errors.length > 0 && (
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              {uploadResult.errors.slice(0, 5).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
              {uploadResult.errors.length > 5 && (
                <li>... and {uploadResult.errors.length - 5} more errors</li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="All">All</option>
              <option value="copper">Copper</option>
              <option value="fiber">Fiber</option>
              <option value="ONT">ONT</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="All">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Map through filtered assets */}
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {assets.length === 0 
                      ? 'No assets found. Upload a CSV file to get started.' 
                      : 'No assets match the selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  // Find associated location
                  const location = locations.find(loc => loc.id === asset.location_id)
                  
                  return (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {asset.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {location?.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location?.region || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Color-coded status badge */}
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            asset.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : asset.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : asset.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Map</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Simple map visualization using coordinates */}
          {locations.length > 0 ? (
            <div className="w-full h-full p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {locations.slice(0, 12).map((location) => (
                  <div
                    key={location.id}
                    className="bg-white p-2 rounded shadow-sm border border-gray-200"
                    title={location.address}
                  >
                    <p className="font-medium truncate">{location.address.split(',')[0]}</p>
                    <p className="text-gray-500 text-xs">
                      {location.coordinates.lat.toFixed(2)}, {location.coordinates.lng.toFixed(2)}
                    </p>
                    <span className={`inline-block mt-1 px-1 py-0.5 rounded text-xs ${
                      location.fiber_status === 'Fiber Ready'
                        ? 'bg-green-100 text-green-800'
                        : location.fiber_status === 'Pending Feasibility'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.fiber_status}
                    </span>
                  </div>
                ))}
              </div>
              {locations.length > 12 && (
                <p className="text-center text-gray-500 mt-4">
                  Showing 12 of {locations.length} locations. Use filters to narrow down.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No locations to display. Upload CSV data to see locations on the map.</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Note: Full interactive map with Mapbox/Leaflet integration can be added in future enhancement.
        </p>
      </div>
    </div>
  )
}

export default AssetsLocations
