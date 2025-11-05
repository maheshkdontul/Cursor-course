/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

interface LoadingSpinnerProps {
  /** Optional message to display below spinner */
  message?: string
  /** Size of spinner (default: 'md') */
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  )
}

