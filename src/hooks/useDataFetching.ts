/**
 * Custom Hook for Data Fetching
 * DRY principle - eliminates repeated loading/error state logic
 */

import { useState, useEffect } from 'react'
import { handleApiError } from '../utils/errorHandler'

interface UseDataFetchingOptions<T> {
  /** Function that fetches data */
  fetchFn: () => Promise<T[]>
  /** Optional: fetch data on mount (default: true) */
  enabled?: boolean
}

interface UseDataFetchingResult<T> {
  /** Fetched data */
  data: T[]
  /** Loading state */
  loading: boolean
  /** Error message or null */
  error: string | null
  /** Function to refetch data */
  refetch: () => Promise<void>
  /** Function to clear error */
  clearError: () => void
}

/**
 * Custom hook for data fetching with loading and error states
 */
export function useDataFetching<T>({
  fetchFn,
  enabled = true,
}: UseDataFetchingOptions<T>): UseDataFetchingResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      const apiError = handleApiError(err, 'useDataFetching')
      setError(apiError.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearError: () => setError(null),
  }
}

