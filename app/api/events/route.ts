import { NextRequest } from 'next/server'
import { createCachedClient } from '@/utils/supabase/server-cached'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { ErrorCodes } from '@/lib/api/types'
import { EVENT_STATUS } from '@/lib/constants'

// Enable caching for public data
export const dynamic = 'force-static'
export const revalidate = 300 // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Use cache-friendly client that doesn't require cookies
    const supabase = createCachedClient()
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
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .eq('is_active', true)
      .is('deleted_at', null)

    // Apply filter
    const now = new Date().toISOString()
    switch (filter) {
      case EVENT_STATUS.UPCOMING:
        query = query.gte('event_date', now).eq('status', EVENT_STATUS.UPCOMING)
        break
      case 'past':
        query = query.lt('event_date', now)
        break
      case 'featured':
        query = query.eq('featured', true)
        break
      case EVENT_STATUS.SOLDOUT:
        query = query.eq('status', EVENT_STATUS.SOLDOUT)
        break
      case EVENT_STATUS.ONGOING:
        query = query.eq('status', EVENT_STATUS.ONGOING)
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
    query = query.range(start, end).order('event_date', { ascending: true })

    const { data: events, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return errorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch events', { details: error.message })
    }

    const response = successResponse({
      events: events || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return response
  } catch (error) {
    console.error('Error fetching events:', error)
    return handleApiError(error)
  }
}