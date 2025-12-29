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

    // Fetch audience vote stats
    const { data: audienceVotes } = await adminClient
      .from('finale_audience_votes')
      .select('stage, voter_type')
      .eq('event_id', event_id)

    // Fetch judge vote stats
    const { data: judgeVotes } = await adminClient
      .from('finale_judge_votes')
      .select('stage')
      .eq('event_id', event_id)

    // Fetch voter counts
    const { data: voters } = await adminClient
      .from('finale_voters')
      .select('voter_type, has_voted_stage_1, has_voted_stage_2, has_voted_stage_3, has_voted_stage_4')
      .eq('event_id', event_id)

    // Calculate stats by stage
    const stageStats = {
      stage_1: {
        judge_votes: judgeVotes?.filter((v) => v.stage === 'stage_1').length || 0,
        in_house_votes: audienceVotes?.filter((v) => v.stage === 'stage_1' && v.voter_type === 'in_house').length || 0,
        online_votes: audienceVotes?.filter((v) => v.stage === 'stage_1' && v.voter_type === 'online').length || 0,
      },
      stage_2: {
        judge_votes: judgeVotes?.filter((v) => v.stage === 'stage_2').length || 0,
        in_house_votes: audienceVotes?.filter((v) => v.stage === 'stage_2' && v.voter_type === 'in_house').length || 0,
        online_votes: audienceVotes?.filter((v) => v.stage === 'stage_2' && v.voter_type === 'online').length || 0,
      },
      stage_3: {
        judge_votes: judgeVotes?.filter((v) => v.stage === 'stage_3').length || 0,
        in_house_votes: audienceVotes?.filter((v) => v.stage === 'stage_3' && v.voter_type === 'in_house').length || 0,
        online_votes: audienceVotes?.filter((v) => v.stage === 'stage_3' && v.voter_type === 'online').length || 0,
      },
      stage_4: {
        judge_votes: judgeVotes?.filter((v) => v.stage === 'stage_4').length || 0,
        in_house_votes: audienceVotes?.filter((v) => v.stage === 'stage_4' && v.voter_type === 'in_house').length || 0,
        online_votes: audienceVotes?.filter((v) => v.stage === 'stage_4' && v.voter_type === 'online').length || 0,
      },
    }

    // Calculate voter participation
    const voterStats = {
      judges: {
        total: voters?.filter((v) => v.voter_type === 'judge').length || 0,
        voted_stage_1: voters?.filter((v) => v.voter_type === 'judge' && v.has_voted_stage_1).length || 0,
        voted_stage_2: voters?.filter((v) => v.voter_type === 'judge' && v.has_voted_stage_2).length || 0,
        voted_stage_3: voters?.filter((v) => v.voter_type === 'judge' && v.has_voted_stage_3).length || 0,
        voted_stage_4: voters?.filter((v) => v.voter_type === 'judge' && v.has_voted_stage_4).length || 0,
      },
      in_house: {
        total: voters?.filter((v) => v.voter_type === 'in_house').length || 0,
        voted_stage_1: voters?.filter((v) => v.voter_type === 'in_house' && v.has_voted_stage_1).length || 0,
        voted_stage_2: voters?.filter((v) => v.voter_type === 'in_house' && v.has_voted_stage_2).length || 0,
        voted_stage_3: voters?.filter((v) => v.voter_type === 'in_house' && v.has_voted_stage_3).length || 0,
        voted_stage_4: voters?.filter((v) => v.voter_type === 'in_house' && v.has_voted_stage_4).length || 0,
      },
      online: {
        total: voters?.filter((v) => v.voter_type === 'online').length || 0,
        voted_stage_1: voters?.filter((v) => v.voter_type === 'online' && v.has_voted_stage_1).length || 0,
        voted_stage_2: voters?.filter((v) => v.voter_type === 'online' && v.has_voted_stage_2).length || 0,
        voted_stage_3: voters?.filter((v) => v.voter_type === 'online' && v.has_voted_stage_3).length || 0,
        voted_stage_4: voters?.filter((v) => v.voter_type === 'online' && v.has_voted_stage_4).length || 0,
      },
    }

    return NextResponse.json({
      success: true,
      stats: {
        stage_stats: stageStats,
        voter_stats: voterStats,
      },
    })
  } catch (error: any) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching stats',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}
