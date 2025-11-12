import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { ErrorCodes } from '@/lib/api/types'
import type { Database } from '@/utils/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const filter = searchParams.get('filter') || 'all'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
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
      `, { count: 'exact' })

    // Apply filter
    const now = new Date().toISOString()
    switch (filter) {
      case 'upcoming':
        query = query.gte('date', now).eq('status', 'upcoming')
        break
      case 'past':
        query = query.lt('date', now)
        break
      case 'featured':
        query = query.eq('featured', true)
        break
      case 'soldout':
        query = query.eq('status', 'soldout')
        break
      case 'ongoing':
        query = query.eq('status', 'ongoing')
        break
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply search
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit - 1
    query = query.range(start, end).order('date', { ascending: true })

    const { data: events, error, count } = await query as {
      data: Array<Database['public']['Tables']['events']['Row'] & {
        event_venues?: Array<{ venues: Database['public']['Tables']['venues']['Row'] }>;
        event_artists?: Array<{ artists: Database['public']['Tables']['artists']['Row'] }>;
        ticket_types?: Database['public']['Tables']['ticket_types']['Row'][];
      }> | null;
      error: any;
      count: number | null;
    }

    if (error) {
      console.error('Supabase error:', error)
      return errorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch events', { details: error.message })
    }

    // Transform data to match expected format
    const transformedEvents = events?.map(event => ({
      ...event,
      venue: event.event_venues?.[0]?.venues || null,
      artists: event.event_artists?.map((ea) => ea.artists) || [],
      tickets: event.ticket_types || [],
    })) || []

    return successResponse({
      events: transformedEvents,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return handleApiError(error)
  }
}