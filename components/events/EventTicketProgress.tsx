/**
 * Event Ticket Progress Component
 * Shows ticket availability with progress bar
 */

import { type PublicEvent } from '@/lib/validations/event'
import { getEventUrgency } from '@/lib/services/events'
import { cn } from '@/lib/utils'

interface EventTicketProgressProps {
  event: PublicEvent
  showDetails?: boolean
  className?: string
}

export function EventTicketProgress({
  event,
  showDetails = true,
  className,
}: EventTicketProgressProps) {
  const urgency = getEventUrgency(event)

  const urgencyColors = {
    critical: 'bg-destructive',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    none: 'bg-primary',
  }

  const urgencyTextColors = {
    critical: 'text-destructive',
    high: 'text-orange-600 dark:text-orange-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    none: 'text-muted-foreground',
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showDetails && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Tickets Available</span>
          <span className="font-bold">
            {event.is_sold_out ? '0' : event.tickets_available.toLocaleString()}
          </span>
        </div>
      )}

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            urgencyColors[urgency]
          )}
          style={{ width: `${Math.min(event.sold_out_percentage, 100)}%` }}
          aria-label={`${event.sold_out_percentage.toFixed(0)}% sold`}
        />
      </div>

      {showDetails && !event.is_sold_out && urgency !== 'none' && (
        <p className={cn('text-xs font-medium', urgencyTextColors[urgency])}>
          {urgency === 'critical' && `⚡ Only ${event.tickets_available} tickets left!`}
          {urgency === 'high' && `🔥 Selling fast - ${event.tickets_available} left!`}
          {urgency === 'medium' && `⏰ ${event.tickets_available} tickets remaining`}
        </p>
      )}
    </div>
  )
}
