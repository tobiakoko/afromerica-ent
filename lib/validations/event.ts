/**
 * Event Validation & Sanitization
 * Ensures data integrity for event-related operations
 */

import { z } from 'zod'

// Database event schema (matches Supabase schema)
export const eventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().nullable().optional(),
  short_description: z.string().max(500).nullable().optional(),
  event_date: z.string().datetime(),
  end_date: z.string().datetime().nullable().optional(),
  time: z.string().nullable().optional(),
  venue: z.string().min(1).nullable().optional(),
  venue_address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  ticket_price: z.number().min(0).nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  tickets_sold: z.number().int().min(0).default(0),
  image_url: z.string().url().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'soldout']),
  is_active: z.boolean().default(true),
  is_published: z.boolean().default(false),
  featured: z.boolean().default(false),
  show_leaderboard: z.boolean().default(false),
  metadata: z.record(z.any()).nullable().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  published_at: z.string().datetime().nullable().optional(),
})

export type DatabaseEvent = z.infer<typeof eventSchema>

// Public-facing event type (computed fields added)
export const publicEventSchema = eventSchema.extend({
  tickets_available: z.number().int().min(0),
  sold_out_percentage: z.number().min(0).max(100),
  is_sold_out: z.boolean(),
  is_past: z.boolean(),
  is_upcoming: z.boolean(),
})

export type PublicEvent = z.infer<typeof publicEventSchema>

// Event query parameters
export const eventQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  filter: z.enum(['all', 'upcoming', 'past', 'featured', 'soldout']).default('all'),
  city: z.string().optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['date-asc', 'date-desc', 'price-asc', 'price-desc', 'popular']).default('date-asc'),
})

export type EventQuery = z.infer<typeof eventQuerySchema>

/**
 * Sanitize and validate event data from database
 */
export function sanitizeEvent(rawEvent: unknown): DatabaseEvent | null {
  const result = eventSchema.safeParse(rawEvent)
  if (!result.success) {
    console.error('Event validation failed:', result.error.errors)
    return null
  }
  return result.data
}

/**
 * Transform database event to public event with computed fields
 */
export function transformToPublicEvent(event: DatabaseEvent): PublicEvent {
  const now = new Date()
  const eventDate = new Date(event.event_date)
  const capacity = event.capacity || 0
  const ticketsSold = event.tickets_sold || 0
  const ticketsAvailable = Math.max(0, capacity - ticketsSold)
  const soldOutPercentage = capacity > 0 ? (ticketsSold / capacity) * 100 : 0

  return {
    ...event,
    tickets_available: ticketsAvailable,
    sold_out_percentage: Math.min(100, soldOutPercentage),
    is_sold_out: ticketsAvailable <= 0 || event.status === 'soldout',
    is_past: eventDate < now,
    is_upcoming: eventDate > now && event.status === 'upcoming',
  }
}

/**
 * Check if event is accessible (published, active, not deleted)
 */
export function isEventAccessible(event: DatabaseEvent): boolean {
  return event.is_published && event.is_active && !event.deleted_at
}

/**
 * Get event status badge info
 */
export function getEventStatusBadge(event: PublicEvent): {
  label: string
  variant: 'default' | 'destructive' | 'warning' | 'success'
} | null {
  if (event.is_sold_out) {
    return { label: 'Sold Out', variant: 'destructive' }
  }
  if (event.sold_out_percentage >= 90) {
    return { label: 'Almost Sold Out', variant: 'warning' }
  }
  if (event.featured) {
    return { label: 'Featured Event', variant: 'default' }
  }
  if (event.status === 'ongoing') {
    return { label: 'Happening Now', variant: 'success' }
  }
  return null
}

/**
 * Format event date range
 */
export function formatEventDateRange(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate)

  if (!endDate) {
    return start.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const end = new Date(endDate)
  const startStr = start.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return `${startStr} - ${endStr}`
}

/**
 * Validate event query parameters
 */
export function validateEventQuery(query: unknown): EventQuery {
  const result = eventQuerySchema.safeParse(query)
  if (!result.success) {
    return eventQuerySchema.parse({}) // Return defaults on error
  }
  return result.data
}
