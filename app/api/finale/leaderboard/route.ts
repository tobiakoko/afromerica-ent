import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type {
  LeaderboardResponse,
  DetailedLeaderboardEntry,
} from '@/types/finale'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const event_id = searchParams.get('event_id')
    const stage = searchParams.get('stage')
    const include_breakdown = searchParams.get('include_breakdown') === 'true'

    if (!event_id) {
      return NextResponse.json<LeaderboardResponse>(
        {
          success: false,
          message: 'Event ID is required',
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get finale config
    const { data: config, error: configError } = await supabase
      .from('finale_configs')
      .select('*')
      .eq('event_id', event_id)
      .single()

    if (configError || !config) {
      return NextResponse.json<LeaderboardResponse>(
        {
          success: false,
          message: 'Finale configuration not found',
        },
        { status: 404 }
      )
    }

    // Check if leaderboard is visible
    if (!config.leaderboard_visible) {
      // Return empty leaderboard instead of error, so frontend can show "not started" message
      return NextResponse.json<LeaderboardResponse>({
        success: true,
        message: 'Leaderboard is currently hidden',
        config,
        leaderboard: [],
        last_updated: new Date().toISOString(),
      })
    }

    const currentStage = stage || config.current_stage

    if (!currentStage) {
      // Return empty leaderboard with config, voting hasn't started yet
      return NextResponse.json<LeaderboardResponse>({
        success: true,
        message: 'No active stage yet',
        config,
        leaderboard: [],
        last_updated: new Date().toISOString(),
      })
    }

    // Determine which leaderboard to fetch
    let leaderboardData: DetailedLeaderboardEntry[] = []

    if (currentStage === 'stage_4') {
      // Stage 4: Only show finalists with Stage 4 scores
      const { data, error } = await supabase
        .from('finale_contestants')
        .select(
          `
          *,
          artists!finale_contestants_artist_id_fkey (
            id,
            name,
            stage_name,
            photo_url,
            slug
          ),
          finale_leaderboard_snapshots!inner (
            judge_score_raw,
            judge_score_weighted,
            in_house_votes,
            in_house_score_weighted,
            online_votes,
            online_score_weighted,
            total_score,
            rank,
            calculated_at
          )
        `
        )
        .eq('event_id', event_id)
        .eq('is_active', true)
        .eq('is_finalist', true)
        .eq('finale_leaderboard_snapshots.stage', currentStage)
        .order('finale_leaderboard_snapshots.rank', { ascending: true })

      if (error) {
        console.error('Error fetching Stage 4 leaderboard:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return NextResponse.json<LeaderboardResponse>(
          {
            success: false,
            message: `Failed to fetch leaderboard data: ${error.message || 'Unknown error'}`,
          },
          { status: 500 }
        )
      }

      leaderboardData = data.map((item: any) => {
        const snapshot = item.finale_leaderboard_snapshots[0] || {}
        return {
          contestant: {
            id: item.id,
            event_id: item.event_id,
            artist_id: item.artist_id,
            contestant_number: item.contestant_number,
            is_active: item.is_active,
            is_finalist: item.is_finalist,
            is_eliminated: item.is_eliminated,
            eliminated_at_stage: item.eliminated_at_stage,
            created_at: item.created_at,
            updated_at: item.updated_at,
          },
          artist: {
            id: item.artists.id,
            name: item.artists.name,
            stage_name: item.artists.stage_name,
            photo_url: item.artists.photo_url,
            slug: item.artists.slug,
          },
          scores: {
            judge_score_raw: snapshot.judge_score_raw || 0,
            judge_score_weighted: snapshot.judge_score_weighted || 0,
            in_house_votes: snapshot.in_house_votes || 0,
            in_house_score_weighted: snapshot.in_house_score_weighted || 0,
            online_votes: snapshot.online_votes || 0,
            online_score_weighted: snapshot.online_score_weighted || 0,
            total_score: snapshot.total_score || 0,
          },
          rank: snapshot.rank || 999,
        }
      })
    } else {
      // Stages 1-3: Show cumulative scores
      const { data, error } = await supabase
        .from('finale_contestants')
        .select(
          `
          *,
          artists!finale_contestants_artist_id_fkey (
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

      if (error) {
        console.error('Error fetching contestants:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return NextResponse.json<LeaderboardResponse>(
          {
            success: false,
            message: `Failed to fetch contestants: ${error.message || 'Unknown error'}`,
          },
          { status: 500 }
        )
      }

      // Get snapshots for all stages up to current
      const stages = ['stage_1', 'stage_2', 'stage_3'].filter((s) => {
        const stageNum = parseInt(s.split('_')[1])
        const currentNum = parseInt(currentStage.split('_')[1])
        return stageNum <= currentNum
      })

      const { data: snapshots, error: snapshotError } = await supabase
        .from('finale_leaderboard_snapshots')
        .select('*')
        .eq('event_id', event_id)
        .in('stage', stages)

      if (snapshotError) {
        console.error('Error fetching snapshots:', snapshotError)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch leaderboard data',
            error: snapshotError.message,
          },
          { status: 500 }
        )
      }

      // Calculate cumulative scores
      leaderboardData = data
        .map((contestant: any) => {
          const contestantSnapshots = (snapshots || []).filter(
            (s: any) => s.contestant_id === contestant.id
          )

          const cumulativeScores = contestantSnapshots.reduce(
            (acc: any, snap: any) => {
              acc.judge_score_raw += snap.judge_score_raw || 0
              acc.judge_score_weighted += snap.judge_score_weighted || 0
              acc.in_house_votes += snap.in_house_votes || 0
              acc.in_house_score_weighted += snap.in_house_score_weighted || 0
              acc.online_votes += snap.online_votes || 0
              acc.online_score_weighted += snap.online_score_weighted || 0
              acc.total_score += snap.total_score || 0
              return acc
            },
            {
              judge_score_raw: 0,
              judge_score_weighted: 0,
              in_house_votes: 0,
              in_house_score_weighted: 0,
              online_votes: 0,
              online_score_weighted: 0,
              total_score: 0,
            }
          )

          const entry: DetailedLeaderboardEntry = {
            contestant: {
              id: contestant.id,
              event_id: contestant.event_id,
              artist_id: contestant.artist_id,
              contestant_number: contestant.contestant_number,
              is_active: contestant.is_active,
              is_finalist: contestant.is_finalist,
              is_eliminated: contestant.is_eliminated,
              eliminated_at_stage: contestant.eliminated_at_stage,
              created_at: contestant.created_at,
              updated_at: contestant.updated_at,
            },
            artist: {
              id: contestant.artists.id,
              name: contestant.artists.name,
              stage_name: contestant.artists.stage_name,
              photo_url: contestant.artists.photo_url,
              slug: contestant.artists.slug,
            },
            scores: cumulativeScores,
            rank: 0, // Will be calculated below
          }

          if (include_breakdown) {
            entry.stage_breakdown = {}
            contestantSnapshots.forEach((snap: any) => {
              if (entry.stage_breakdown) {
                ;(entry.stage_breakdown as any)[snap.stage] = snap
              }
            })
          }

          return entry
        })
        .sort((a, b) => b.scores.total_score - a.scores.total_score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }))
    }

    return NextResponse.json<LeaderboardResponse>({
      success: true,
      message: 'Leaderboard fetched successfully',
      config,
      leaderboard: leaderboardData,
      last_updated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error)

    return NextResponse.json<LeaderboardResponse>(
      {
        success: false,
        message: 'An error occurred while fetching the leaderboard',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}
