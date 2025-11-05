/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

/**
 * Error handler for API calls
 * Logs errors in development, returns user-friendly messages
 */
export function handleApiError(error: unknown, context: string): ApiError {
  // In development, log full error details
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error:`, error)
  }

  // Extract user-friendly error message
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, error)
  }

  if (typeof error === 'string') {
    return new ApiError(error)
  }

  // Fallback for unknown error types
  return new ApiError('An unexpected error occurred', undefined, error)
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

