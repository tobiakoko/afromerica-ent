import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

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

    // Check if user is admin using admin client to bypass RLS
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

    // Fetch all voters for the event
    const { data: voters, error } = await adminClient
      .from('finale_voters')
      .select('*')
      .eq('event_id', event_id)
      .order('voter_type', { ascending: true })
      .order('judge_number', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching voters:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch voters' },
        { status: 500 }
      )
    }

    // Group voters by type
    const judges = voters.filter((v) => v.voter_type === 'judge')
    const inHouse = voters.filter((v) => v.voter_type === 'in_house')
    const online = voters.filter((v) => v.voter_type === 'online')

    return NextResponse.json({
      success: true,
      voters: {
        judges,
        in_house: inHouse,
        online,
        total: voters.length,
      },
    })
  } catch (error: any) {
    console.error('Voters fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching voters',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}
