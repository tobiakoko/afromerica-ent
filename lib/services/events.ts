/**
 * Event Service Layer
 * Handles all event-related data fetching and business logic
 */

import { createClient } from '@/utils/supabase/server'
import { createCachedClient } from '@/utils/supabase/server-cached'
import {
  type DatabaseEvent,
  type PublicEvent,
  type EventQuery,
  sanitizeEvent,
  transformToPublicEvent,
  isEventAccessible,
} from '@/lib/validations/event'
import { cache } from 'react'

/**
 * Event selection query (all fields needed for public display)
 */
const EVENT_SELECT = `
  id,
  title,
  slug,
  description,
  short_description,
  event_date,
  end_date,
  time,
  venue,
  venue_address,
  city,
  ticket_price,
  capacity,
  tickets_sold,
  image_url,
  cover_image_url,
  status,
  is_active,
  is_published,
  featured,
  show_leaderboard,
  metadata,
  deleted_at,
  created_at,
  updated_at,
  published_at
` as const

/**
 * Fetch all published events with optional filtering
 * Cached per request to avoid duplicate database calls
 */
export const getEvents = cache(async (query?: Partial<EventQuery>): Promise<{
  events: PublicEvent[]
  error: Error | null
}> => {
  try {
    const supabase = await createClient()

    let queryBuilder = supabase
      .from('events')
      .select(EVENT_SELECT)
      .eq('is_published', true)
      .eq('is_active', true)
      .is('deleted_at', null)

    // Apply filters
    if (query?.filter === 'upcoming') {
      queryBuilder = queryBuilder
        .gte('event_date', new Date().toISOString())
        .eq('status', 'upcoming')
    } else if (query?.filter === 'past') {
      queryBuilder = queryBuilder
        .lt('event_date', new Date().toISOString())
    } else if (query?.filter === 'featured') {
      queryBuilder = queryBuilder.eq('featured', true)
    } else if (query?.filter === 'soldout') {
      queryBuilder = queryBuilder.eq('status', 'soldout')
    }

    // Filter by city
    if (query?.city) {
      queryBuilder = queryBuilder.ilike('city', `%${query.city}%`)
    }

    // Search
    if (query?.search) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query.search}%,description.ilike.%${query.search}%,venue.ilike.%${query.search}%`
      )
    }

    // Sorting
    switch (query?.sort) {
      case 'date-asc':
        queryBuilder = queryBuilder.order('event_date', { ascending: true })
        break
      case 'date-desc':
        queryBuilder = queryBuilder.order('event_date', { ascending: false })
        break
      case 'price-asc':
        queryBuilder = queryBuilder.order('ticket_price', { ascending: true, nullsFirst: false })
        break
      case 'price-desc':
        queryBuilder = queryBuilder.order('ticket_price', { ascending: false, nullsFirst: false })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('tickets_sold', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('event_date', { ascending: true })
    }

    // Pagination
    if (query?.page && query?.limit) {
      const start = (query.page - 1) * query.limit
      const end = start + query.limit - 1
      queryBuilder = queryBuilder.range(start, end)
    }

    const { data, error: fetchError } = await queryBuilder

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
      return { events: [], error: new Error('Failed to fetch events') }
    }

    // Validate and transform events
    const validEvents = (data || [])
      .map(sanitizeEvent)
      .filter((event): event is DatabaseEvent => event !== null)
      .map(transformToPublicEvent)

    return { events: validEvents, error: null }
  } catch (err) {
    console.error('Unexpected error fetching events:', err)
    return {
      events: [],
      error: err instanceof Error ? err : new Error('Unknown error'),
    }
  }
})

/**
 * Fetch all published events with optional filtering (CACHED VERSION for ISR)
 * Uses createCachedClient for static generation - no cookies/auth
 * Use this version for public pages that should be cached
 */
export const getEventsCached = cache(async (query?: Partial<EventQuery>): Promise<{
  events: PublicEvent[]
  error: Error | null
}> => {
  try {
    const supabase = createCachedClient()

    let queryBuilder = supabase
      .from('events')
      .select(EVENT_SELECT)
      .eq('is_published', true)
      .eq('is_active', true)
      .is('deleted_at', null)

    // Apply filters
    if (query?.filter === 'upcoming') {
      queryBuilder = queryBuilder
        .gte('event_date', new Date().toISOString())
        .eq('status', 'upcoming')
    } else if (query?.filter === 'past') {
      queryBuilder = queryBuilder
        .lt('event_date', new Date().toISOString())
    } else if (query?.filter === 'featured') {
      queryBuilder = queryBuilder.eq('featured', true)
    } else if (query?.filter === 'soldout') {
      queryBuilder = queryBuilder.eq('status', 'soldout')
    }

    // Apply sorting
    if (query?.sort === 'date-asc') {
      queryBuilder = queryBuilder.order('event_date', { ascending: true })
    } else if (query?.sort === 'date-desc') {
      queryBuilder = queryBuilder.order('event_date', { ascending: false })
    } else {
      queryBuilder = queryBuilder.order('event_date', { ascending: true })
    }

    const { data, error: fetchError } = await queryBuilder

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
      return { events: [], error: new Error('Failed to fetch events') }
    }

    // Validate and transform events
    const validEvents = (data || [])
      .map(sanitizeEvent)
      .filter((event): event is DatabaseEvent => event !== null)
      .map(transformToPublicEvent)

    return { events: validEvents, error: null }
  } catch (err) {
    console.error('Unexpected error fetching events:', err)
    return {
      events: [],
      error: err instanceof Error ? err : new Error('Unknown error'),
    }
  }
})

/**
 * Fetch a single event by slug
 * Cached per request to avoid duplicate database calls
 */
export const getEventBySlug = cache(async (slug: string): Promise<{
  event: PublicEvent | null
  error: Error | null
}> => {
  try {
    const supabase = await createClient()

    const { data, error: fetchError } = await supabase
      .from('events')
      .select(EVENT_SELECT)
      .eq('slug', slug)
      .eq('is_published', true)
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle()

    if (fetchError) {
      console.error(`Error fetching event with slug "${slug}":`, fetchError)
      return { event: null, error: new Error('Failed to fetch event') }
    }

    if (!data) {
      return { event: null, error: null } // Event not found, not an error
    }

    // Validate and transform event
    const validEvent = sanitizeEvent(data)
    if (!validEvent) {
      return { event: null, error: new Error('Invalid event data') }
    }

    // Double-check accessibility (defense in depth)
    if (!isEventAccessible(validEvent)) {
      return { event: null, error: null }
    }

    const publicEvent = transformToPublicEvent(validEvent)

    return { event: publicEvent, error: null }
  } catch (err) {
    console.error(`Unexpected error fetching event "${slug}":`, err)
    return {
      event: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    }
  }
})

/**
 * Fetch upcoming events (homepage featured section)
 * Cached per request
 */
export const getUpcomingEvents = cache(async (limit = 6): Promise<{
  events: PublicEvent[]
  error: Error | null
}> => {
  return getEvents({
    filter: 'upcoming',
    sort: 'date-asc',
    limit,
    page: 1,
  })
})

/**
 * Fetch featured events
 * Cached per request
 */
export const getFeaturedEvents = cache(async (limit = 3): Promise<{
  events: PublicEvent[]
  error: Error | null
}> => {
  return getEvents({
    filter: 'featured',
    sort: 'date-asc',
    limit,
    page: 1,
  })
})

/**
 * Check if event has available tickets
 */
export function hasAvailableTickets(event: PublicEvent): boolean {
  return !event.is_sold_out && event.tickets_available > 0
}

/**
 * Get event urgency level for UI messaging
 */
export function getEventUrgency(event: PublicEvent): 'critical' | 'high' | 'medium' | 'none' {
  if (event.is_sold_out) {
    return 'critical'
  }
  if (event.sold_out_percentage >= 95) {
    return 'critical'
  }
  if (event.sold_out_percentage >= 90) {
    return 'high'
  }
  if (event.sold_out_percentage >= 75) {
    return 'medium'
  }
  return 'none'
}
