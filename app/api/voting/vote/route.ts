import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api/response';
import { ErrorCodes } from '@/lib/api/types';
import { showcaseVoteSchema } from '@/lib/validations/schemas';

/**
 * POST /api/voting/vote
 * Submit a vote for the December Showcase (one vote per device)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Validate request
    const validatedData = showcaseVoteSchema.parse({
      finalist_id: body.finalist_id,
      voter_id: body.voter_id,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
      metadata: body.metadata,
    });

    // Check if voting is active
    const { data: settings } = await supabase
      .from('showcase_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (!settings) {
      return errorResponse(
        ErrorCodes.VOTING_CLOSED,
        'Voting is not currently active'
      );
    }

    // Type assertion for settings
    const typedSettings = settings as {
      voting_start_date: string;
      voting_end_date: string;
    };

    const now = new Date();
    const startDate = new Date(typedSettings.voting_start_date);
    const endDate = new Date(typedSettings.voting_end_date);

    if (now < startDate || now > endDate) {
      return errorResponse(
        ErrorCodes.VOTING_CLOSED,
        'Voting period has not started or has ended'
      );
    }

    // Check if finalist exists
    const { data: finalist, error: finalistError } = await supabase
      .from('showcase_finalists')
      .select('id, stage_name')
      .eq('id', validatedData.finalist_id)
      .single();

    if (finalistError || !finalist) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Finalist not found',
        { details: finalistError?.message }
      );
    }

    // Type assertion for finalist
    const typedFinalist = finalist as {
      id: string;
      stage_name: string;
    };

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('showcase_votes')
      .select('id')
      .eq('voter_id', validatedData.voter_id)
      .maybeSingle();

    if (existingVote) {
      return errorResponse(
        ErrorCodes.ALREADY_VOTED,
        'You have already voted. Only one vote per person is allowed.'
      );
    }

    // Insert vote (trigger will update finalist vote_count and rank)
    const { data: vote, error: voteError } = await supabase
      .from('showcase_votes')
      .insert([{
        finalist_id: validatedData.finalist_id,
        voter_id: validatedData.voter_id,
        ip_address: validatedData.ip_address,
        user_agent: validatedData.user_agent,
        metadata: validatedData.metadata,
      }])
      .select()
      .single();

    if (voteError) {
      // Check if it's a unique constraint violation
      if (voteError.code === '23505') {
        return errorResponse(
          ErrorCodes.ALREADY_VOTED,
          'You have already voted. Only one vote per person is allowed.'
        );
      }

      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to record vote',
        { details: voteError.message }
      );
    }

    // Get updated finalist data
    const { data: updatedFinalist } = await supabase
      .from('showcase_finalists')
      .select('id, stage_name, vote_count, rank')
      .eq('id', validatedData.finalist_id)
      .single();

    return successResponse(
      {
        vote,
        finalist: updatedFinalist,
      },
      {
        message: `Vote recorded for ${typedFinalist.stage_name}!`,
        status: 201,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/voting/vote
 * Check if user has voted
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const voterId = searchParams.get('voter_id');

    if (!voterId) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Voter ID is required'
      );
    }

    const supabase = await createClient();

    const { data: existingVote } = await supabase
      .from('showcase_votes')
      .select(
        `
        *,
        finalist:showcase_finalists(id, stage_name, image_url)
      `
      )
      .eq('voter_id', voterId)
      .single();

    return successResponse({
      has_voted: !!existingVote,
      vote: existingVote || null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}