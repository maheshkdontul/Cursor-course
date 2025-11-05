/**
 * Notification Component
 * Replaces browser alert() with proper UI notifications
 */

import { useState, useEffect } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  /** Notification message */
  message: string
  /** Notification type */
  type: NotificationType
  /** Auto-dismiss after milliseconds (0 = never) */
  duration?: number
  /** Callback when notification is dismissed */
  onDismiss?: () => void
}

/**
 * Notification component for user feedback
 */
export default function Notification({
  message,
  type,
  duration = 5000,
  onDismiss,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  if (!isVisible) return null

  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-lg border p-4 shadow-lg max-w-md ${typeClasses[type]}`}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss?.()
          }}
          className="ml-4 text-current opacity-70 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/**
 * Hook to manage notifications
 */
export function useNotification() {
  const [notification, setNotification] = useState<{
    message: string
    type: NotificationType
  } | null>(null)

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type })
  }

  const dismissNotification = () => {
    setNotification(null)
  }

  return {
    notification,
    showNotification,
    dismissNotification,
  }
}

