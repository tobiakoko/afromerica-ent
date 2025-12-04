'use client'

/**
 * Event View Tracker Component
 * Tracks when users view event detail pages
 */

import { useEffect } from 'react'
import { analytics, AnalyticsEvent } from '@/lib/analytics'

interface EventViewTrackerProps {
  eventId: string
  eventSlug: string
  eventTitle: string
  eventDate?: string
  eventPrice?: number | null
  eventStatus?: string
}

export function EventViewTracker({
  eventId,
  eventSlug,
  eventTitle,
  eventDate,
  eventPrice,
  eventStatus,
}: EventViewTrackerProps) {
  useEffect(() => {
    analytics.track(AnalyticsEvent.EVENT_VIEW, {
      event_id: eventId,
      event_slug: eventSlug,
      event_title: eventTitle,
      event_date: eventDate,
      event_price: eventPrice || undefined,
      event_status: eventStatus,
    })
  }, [eventId, eventSlug, eventTitle, eventDate, eventPrice, eventStatus])

  return null
}
