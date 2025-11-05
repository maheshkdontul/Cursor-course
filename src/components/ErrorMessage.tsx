/**
 * ErrorMessage Component
 * Reusable error message display
 */

interface ErrorMessageProps {
  /** Error message to display */
  message: string
  /** Optional callback to dismiss error */
  onDismiss?: () => void
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <p className="text-red-800 text-sm whitespace-pre-line">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

