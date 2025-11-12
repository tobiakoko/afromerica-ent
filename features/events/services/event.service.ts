import { createClient } from '@/utils/supabase/server'
import { cacheService } from '@/lib/cache/cache.service'
import type { Database } from '@/utils/supabase/types'

type Event = Database['public']['Tables']['events']['Row']
type EventWithRelations = Event & {
  venue?: Database['public']['Tables']['venues']['Row'] | null
  artists?: Database['public']['Tables']['artists']['Row'][]
  ticket_types?: Database['public']['Tables']['ticket_types']['Row'][]
}

class EventService {
  private readonly CACHE_TTL = 3600 // 1 hour

  async getEventBySlug(slug: string): Promise<EventWithRelations | null> {
    return cacheService.remember(
      `event:${slug}`,
      this.CACHE_TTL,
      async () => {
        const supabase = await createClient()

        const { data: event, error } = await supabase
          .from('events')
          .select(`
            *,
            event_venues!inner(
              venues(*)
            ),
            event_artists(
              artists(*)
            ),
            ticket_types(*)
          `)
          .eq('slug', slug)
          .single()

        if (error || !event) {
          console.error('Error fetching event by slug:', error)
          return null
        }

        // Transform the nested structure
        return {
          ...event,
          venue: event.event_venues?.[0]?.venues || null,
          artists: event.event_artists?.map((ea: any) => ea.artists) || [],
          ticket_types: event.ticket_types || [],
        }
      }
    )
  }

  async getEventById(id: string): Promise<EventWithRelations | null> {
    return cacheService.remember(
      `event:id:${id}`,
      this.CACHE_TTL,
      async () => {
        const supabase = await createClient()

        const { data: event, error } = await supabase
          .from('events')
          .select(`
            *,
            event_venues!inner(
              venues(*)
            ),
            event_artists(
              artists(*)
            ),
            ticket_types(*)
          `)
          .eq('id', id)
          .single()

        if (error || !event) {
          console.error('Error fetching event by id:', error)
          return null
        }

        return {
          ...event,
          venue: event.event_venues?.[0]?.venues || null,
          artists: event.event_artists?.map((ea: any) => ea.artists) || [],
          ticket_types: event.ticket_types || [],
        }
      }
    )
  }

  async getAllEvents(): Promise<Event[]> {
    return cacheService.remember(
      'events:all',
      this.CACHE_TTL,
      async () => {
        const supabase = await createClient()

        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })

        if (error) {
          console.error('Error fetching all events:', error)
          return []
        }

        return events || []
      }
    )
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return cacheService.remember(
      `events:upcoming:${limit}`,
      this.CACHE_TTL,
      async () => {
        const supabase = await createClient()
        const now = new Date().toISOString()

        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', now)
          .eq('status', 'upcoming')
          .order('date', { ascending: true })
          .limit(limit)

        if (error) {
          console.error('Error fetching upcoming events:', error)
          return []
        }

        return events || []
      }
    )
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return cacheService.remember(
      'events:featured',
      this.CACHE_TTL,
      async () => {
        const supabase = await createClient()

        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('featured', true)
          .order('date', { ascending: true })
          .limit(5)

        if (error) {
          console.error('Error fetching featured events:', error)
          return []
        }

        return events || []
      }
    )
  }

  async decrementTickets(ticketTypeId: string, quantity: number): Promise<void> {
    const supabase = await createClient()

    // Decrement available tickets using Supabase RPC
    const { error } = await supabase.rpc('decrement_ticket_availability', {
      ticket_type_id: ticketTypeId,
      quantity_to_decrement: quantity,
    })

    if (error) {
      console.error('Error decrementing tickets:', error)
      throw new Error('Failed to update ticket availability')
    }

    // Invalidate related caches
    const { data: ticketType } = await supabase
      .from('ticket_types')
      .select('event_id')
      .eq('id', ticketTypeId)
      .single()

    if (ticketType?.event_id) {
      await this.invalidateEventCache(ticketType.event_id)
    }
  }

  async incrementTickets(ticketTypeId: string, quantity: number): Promise<void> {
    const supabase = await createClient()

    // Increment available tickets
    const { error } = await supabase.rpc('increment_ticket_availability', {
      ticket_type_id: ticketTypeId,
      quantity_to_increment: quantity,
    })

    if (error) {
      console.error('Error incrementing tickets:', error)
      throw new Error('Failed to update ticket availability')
    }

    // Invalidate related caches
    const { data: ticketType } = await supabase
      .from('ticket_types')
      .select('event_id')
      .eq('id', ticketTypeId)
      .single()

    if (ticketType?.event_id) {
      await this.invalidateEventCache(ticketType.event_id)
    }
  }

  async invalidateEventCache(eventIdOrSlug: string): Promise<void> {
    await cacheService.del(`event:${eventIdOrSlug}`)
    await cacheService.del(`event:id:${eventIdOrSlug}`)
    await cacheService.del('events:all')
    await cacheService.del('events:featured')
    // Invalidate upcoming events cache with various limits
    for (let i = 5; i <= 20; i += 5) {
      await cacheService.del(`events:upcoming:${i}`)
    }
  }
}

export const eventService = new EventService()
