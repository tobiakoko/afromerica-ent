import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { jwtVerify, type JWTPayload } from 'jose'
import type { AudienceVoteRequest, VoteResponse } from '@/types/finale'

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
})()

interface VoterTokenPayload extends JWTPayload {
  voter_id: string
  event_id: string
  voter_type: 'judge' | 'in_house' | 'online'
  judge_number?: number | null
  name?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Authorization token required',
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let payload: VoterTokenPayload

    try {
      const verified = await jwtVerify<VoterTokenPayload>(token, JWT_SECRET)
      payload = verified.payload
    } catch {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      )
    }

    // Verify voter is audience (in-house or online)
    if (payload.voter_type !== 'in_house' && payload.voter_type !== 'online') {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Only audience members can submit audience votes',
        },
        { status: 403 }
      )
    }

    const body: AudienceVoteRequest = await request.json()
    const { voter_id, event_id, contestant_id, stage } = body

    // Validate required fields
    if (!voter_id || !event_id || !contestant_id || !stage) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // Verify voter_id matches token
    if (voter_id !== payload.voter_id || event_id !== payload.event_id) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Voter ID or Event ID mismatch',
        },
        { status: 403 }
      )
    }

    // Use service role client so RLS on vote tables doesn't block inserts
    const supabase = createAdminClient()

    // Check if voting is enabled and correct stage
    const { data: config, error: configError } = await supabase
      .from('finale_configs')
      .select('*')
      .eq('event_id', event_id)
      .single()

    if (configError || !config) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Finale configuration not found',
        },
        { status: 404 }
      )
    }

    if (!config.voting_enabled) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Voting is currently disabled',
        },
        { status: 403 }
      )
    }

    if (config.current_stage !== stage) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: `Voting is not open for ${stage}. Current stage is ${config.current_stage}`,
        },
        { status: 403 }
      )
    }

    // Verify voter exists and hasn't voted for this stage
    const { data: voter, error: voterError } = await supabase
      .from('finale_voters')
      .select('*')
      .eq('id', voter_id)
      .eq('event_id', event_id)
      .eq('is_active', true)
      .single()

    if (voterError || !voter) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Voter not found or inactive',
        },
        { status: 404 }
      )
    }

    const hasVotedField = `has_voted_${stage}` as keyof typeof voter
    if (voter[hasVotedField]) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'You have already voted for this stage',
        },
        { status: 409 }
      )
    }

    // Verify contestant exists and is eligible
    const { data: contestant, error: contestantError } = await supabase
      .from('finale_contestants')
      .select('*')
      .eq('id', contestant_id)
      .eq('event_id', event_id)
      .eq('is_active', true)
      .single()

    if (contestantError || !contestant) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Contestant not found or inactive',
        },
        { status: 404 }
      )
    }

    // For stage 4, verify contestant is a finalist
    if (stage === 'stage_4' && !contestant.is_finalist) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'This contestant is not eligible for Stage 4',
        },
        { status: 403 }
      )
    }

    // Insert audience vote
    const { data: vote, error: voteError } = await supabase
      .from('finale_audience_votes')
      .insert({
        event_id,
        voter_id,
        contestant_id,
        stage,
        voter_type: voter.voter_type,
      })
      .select()
      .single()

    if (voteError) {
      console.error('Error inserting audience vote:', voteError)
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: 'Failed to record vote',
        },
        { status: 500 }
      )
    }

    // Trigger leaderboard recalculation
    const { error: calcError } = await supabase.rpc('calculate_finale_leaderboard', {
      p_event_id: event_id,
      p_stage: stage,
    })

    if (calcError) {
      console.error('Error calculating leaderboard:', calcError)
      // Don't fail the vote if leaderboard calculation fails
    }

    return NextResponse.json<VoteResponse>({
      success: true,
      message: 'Vote recorded successfully',
      vote_id: vote.id,
    })
  } catch (error) {
    console.error('Audience voting error:', error)

    return NextResponse.json<VoteResponse>(
      {
        success: false,
        message: 'An error occurred while recording your vote',
        ...(process.env.NODE_ENV === 'development' && {
          debug: (error as Error).message,
        }),
      },
      { status: 500 }
    )
  }
}
