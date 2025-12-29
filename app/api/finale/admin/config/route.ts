import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import type { FinaleConfig, FinaleStage, FinaleStatus } from '@/types/finale'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      event_id,
      current_status,
      current_stage,
      voting_enabled,
      leaderboard_visible,
    } = body

    if (!event_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event ID is required',
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
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
        {
          success: false,
          message: 'Admin access required',
        },
        { status: 403 }
      )
    }

    // Build update object
    const updates: Partial<FinaleConfig> = {
      updated_at: new Date().toISOString(),
    }

    if (current_status !== undefined) {
      updates.current_status = current_status as FinaleStatus
    }

    if (current_stage !== undefined) {
      updates.current_stage = current_stage as FinaleStage | null
    }

    if (voting_enabled !== undefined) {
      updates.voting_enabled = voting_enabled
    }

    if (leaderboard_visible !== undefined) {
      updates.leaderboard_visible = leaderboard_visible
    }

    // Update timestamp fields based on current stage
    if (current_stage) {
      const stageStartedField = `${current_stage}_started_at` as keyof FinaleConfig
      const { data: existingConfig } = await supabase
        .from('finale_configs')
        .select(stageStartedField as string)
        .eq('event_id', event_id)
        .single()

      // If stage started_at is null, set it to now
      if (existingConfig && !existingConfig[stageStartedField]) {
        ;(updates as any)[stageStartedField] = new Date().toISOString()
      }
    }

    // Update config
    const { data: config, error } = await supabase
      .from('finale_configs')
      .update(updates as any)
      .eq('event_id', event_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating config:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update configuration',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      config,
    })
  } catch (error: any) {
    console.error('Admin config update error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while updating configuration',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, action } = body

    if (!event_id || !action) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event ID and action are required',
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
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
        {
          success: false,
          message: 'Admin access required',
        },
        { status: 403 }
      )
    }

    if (action === 'calculate_top_5') {
      // Call the stored procedure to calculate Top 5
      const { error } = await supabase.rpc('calculate_top_5_finalists', {
        p_event_id: event_id,
      })

      if (error) {
        console.error('Error calculating Top 5:', error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to calculate Top 5 finalists',
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Top 5 finalists calculated successfully',
      })
    }

    if (action === 'recalculate_leaderboard') {
      const { stage } = body

      if (!stage) {
        return NextResponse.json(
          {
            success: false,
            message: 'Stage is required for leaderboard recalculation',
          },
          { status: 400 }
        )
      }

      const { error } = await supabase.rpc('calculate_finale_leaderboard', {
        p_event_id: event_id,
        p_stage: stage,
      })

      if (error) {
        console.error('Error recalculating leaderboard:', error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to recalculate leaderboard',
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Leaderboard recalculated successfully',
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid action',
      },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Admin action error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while performing action',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}
