import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { SignJWT } from 'jose'
import type { VoterAuthRequest, VoterAuthResponse } from '@/types/finale'

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
})()

export async function POST(request: NextRequest) {
  try {
    const body: VoterAuthRequest = await request.json()
    const { name, code, event_id } = body

    if (!name || !code || !event_id) {
      return NextResponse.json<VoterAuthResponse>(
        {
          success: false,
          message: 'Name, code, and event ID are required',
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const upperCode = code.toUpperCase()

    // Determine voter type from code prefix
    let voterType: 'judge' | 'in_house' | 'online'
    if (upperCode.startsWith('AFR-J')) {
      voterType = 'judge'
    } else if (upperCode.startsWith('AFR-I')) {
      // In-house codes are disabled
      return NextResponse.json<VoterAuthResponse>(
        {
          success: false,
          message: 'In-house voting codes are currently disabled. Use online voting codes only. Please use online voting codes.',
        },
        { status: 403 }
      )
    } else if (upperCode.startsWith('AFR-O')) {
      voterType = 'online'
    } else {
      return NextResponse.json<VoterAuthResponse>(
        {
          success: false,
          message: 'Invalid voter code format',
        },
        { status: 400 }
      )
    }

    let voter

    if (voterType === 'judge') {
      // Judges have unique codes - find existing voter
      const { data: judgeVoter, error: voterError } = await supabase
        .from('finale_voters')
        .select('*')
        .eq('event_id', event_id)
        .eq('voter_code', upperCode)
        .eq('is_active', true)
        .single()

      if (voterError || !judgeVoter) {
        return NextResponse.json<VoterAuthResponse>(
          {
            success: false,
            message: 'Invalid judge code or code not found for this event',
          },
          { status: 404 }
        )
      }

      voter = judgeVoter
    } else {
      // In-house and online voters share codes - create or find voter
      // First verify the code is valid by checking if any voter with this code exists for this event
      const { data: codeCheck } = await supabase
        .from('finale_voters')
        .select('voter_code, voter_type')
        .eq('event_id', event_id)
        .eq('voter_type', voterType)
        .limit(1)
        .maybeSingle()

      // If no voters exist yet for this type, generate and verify the expected code
      if (!codeCheck) {
        const { data: expectedCode } = await supabase.rpc('generate_finale_voter_code', {
          p_voter_type: voterType,
          p_event_id: event_id,
        })

        if (upperCode !== expectedCode) {
          return NextResponse.json<VoterAuthResponse>(
            {
              success: false,
              message: 'Invalid voter code for this event',
            },
            { status: 404 }
          )
        }
      } else {
        // Voters exist - verify the code matches the existing shared code
        if (upperCode !== codeCheck.voter_code) {
          return NextResponse.json<VoterAuthResponse>(
            {
              success: false,
              message: 'Invalid voter code for this event',
            },
            { status: 404 }
          )
        }
      }

      // Try to find existing voter by name and type
      const { data: existingVoter } = await supabase
        .from('finale_voters')
        .select('*')
        .eq('event_id', event_id)
        .eq('voter_type', voterType)
        .eq('is_active', true)
        .ilike('name', name)
        .maybeSingle()

      if (existingVoter) {
        voter = existingVoter
      } else {
        // Create new voter
        const { data: newVoter, error: createError } = await supabase
          .from('finale_voters')
          .insert({
            event_id,
            name,
            voter_code: upperCode,
            voter_type: voterType,
            is_active: true,
            judge_number: null,
            email: null,
            phone: null,
          })
          .select()
          .single()

        if (createError || !newVoter) {
          console.error('Error creating voter:', createError)
          return NextResponse.json<VoterAuthResponse>(
            {
              success: false,
              message: `Failed to create voter record: ${createError?.message || 'Unknown error'}`,
              ...(process.env.NODE_ENV === 'development' && {
                debug: createError?.details || createError?.message,
              }),
            },
            { status: 500 }
          )
        }

        voter = newVoter
      }
    }

    // Get finale config to determine current stage and status
    const { data: config, error: configError } = await supabase
      .from('finale_configs')
      .select('*')
      .eq('event_id', event_id)
      .single()

    if (configError || !config) {
      return NextResponse.json<VoterAuthResponse>(
        {
          success: false,
          message: 'Finale configuration not found for this event',
        },
        { status: 404 }
      )
    }

    // Generate JWT token valid for 4 hours
    const token = await new SignJWT({
      voter_id: voter.id,
      event_id: voter.event_id,
      voter_type: voter.voter_type,
      judge_number: voter.judge_number,
      name: voter.name,
      verified: true,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(JWT_SECRET)

    return NextResponse.json<VoterAuthResponse>({
      success: true,
      message: 'Authentication successful',
      voter,
      config,
      token,
    })
  } catch (error: any) {
    console.error('Voter authentication error:', error)

    return NextResponse.json<VoterAuthResponse>(
      {
        success: false,
        message: 'An error occurred during authentication',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message }),
      },
      { status: 500 }
    )
  }
}
