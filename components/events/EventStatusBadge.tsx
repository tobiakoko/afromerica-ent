/**
 * Event Status Badge Component
 * Displays event status with appropriate styling
 */

import { type PublicEvent } from '@/lib/validations/event'
import { getEventStatusBadge } from '@/lib/validations/event'
import { cn } from '@/lib/utils'

interface EventStatusBadgeProps {
  event: PublicEvent
  className?: string
}

export function EventStatusBadge({ event, className }: EventStatusBadgeProps) {
  const badge = getEventStatusBadge(event)

  if (!badge) {
    return null
  }

  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    warning: 'bg-orange-500 text-white',
    success: 'bg-green-500 text-white',
  }

  return (
    <span
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium shadow-lg',
        variantStyles[badge.variant],
        className
      )}
    >
      {badge.label}
    </span>
  )
}
