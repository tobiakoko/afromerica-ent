import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import type { FinaleContestant } from '@/types/finale'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const event_id = searchParams.get('event_id')

    if (!event_id) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: admin } = await adminClient
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Fetch contestants with artist info
    const { data: contestants, error } = await adminClient
      .from('finale_contestants')
      .select(
        `
        *,
        artist:artists!finale_contestants_artist_id_fkey(
          id,
          name,
          stage_name,
          photo_url,
          slug
        )
      `
      )
      .eq('event_id', event_id)
      .eq('is_active', true)
      .order('contestant_number', { ascending: true })

    if (error) {
      console.error('Error fetching contestants:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch contestants' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contestants,
    })
  } catch (error) {
    console.error('Contestants fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching contestants',
        ...(process.env.NODE_ENV === 'development' && {
          debug: (error as Error).message,
        }),
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      contestant_id: string
      is_finalist?: boolean
      is_eliminated?: boolean
      eliminated_at_stage?: FinaleContestant['eliminated_at_stage']
    }
    const { contestant_id, is_finalist, is_eliminated, eliminated_at_stage } = body

    if (!contestant_id) {
      return NextResponse.json(
        { success: false, message: 'Contestant ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const adminClient = createAdminClient()
    const { data: admin } = await adminClient
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Update contestant
    const updates: Partial<FinaleContestant> & { updated_at: string } = {
      updated_at: new Date().toISOString(),
    }

    if (is_finalist !== undefined) updates.is_finalist = is_finalist
    if (is_eliminated !== undefined) updates.is_eliminated = is_eliminated
    if (eliminated_at_stage !== undefined) updates.eliminated_at_stage = eliminated_at_stage

    const { data: contestant, error } = await adminClient
      .from('finale_contestants')
      .update(updates)
      .eq('id', contestant_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contestant:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update contestant' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contestant updated successfully',
      contestant,
    })
  } catch (error) {
    console.error('Contestant update error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while updating contestant',
        ...(process.env.NODE_ENV === 'development' && {
          debug: (error as Error).message,
        }),
      },
      { status: 500 }
    )
  }
}
