/**
 * StatusBadge Component
 * Reusable status badge with color coding
 */

import type { AssetStatus, FiberStatus, WaveProgressStatus } from '../types'

type StatusType = AssetStatus | FiberStatus | WaveProgressStatus | string

interface StatusBadgeProps {
  /** Status value to display */
  status: StatusType
  /** Status type determines color scheme */
  type?: 'asset' | 'fiber' | 'wave'
}

/**
 * Get color classes for status badge
 */
function getStatusClasses(status: StatusType, type: StatusBadgeProps['type'] = 'asset'): string {
  // Asset status colors
  if (type === 'asset') {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Fiber status colors
  if (type === 'fiber') {
    switch (status) {
      case 'Fiber Ready':
        return 'bg-green-100 text-green-800'
      case 'Pending Feasibility':
        return 'bg-yellow-100 text-yellow-800'
      case 'Copper Only':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Wave status colors
  if (type === 'wave') {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Planning':
        return 'bg-gray-100 text-gray-800'
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return 'bg-gray-100 text-gray-800'
}

export default function StatusBadge({ status, type = 'asset' }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(status, type)}`}>
      {status}
    </span>
  )
}

