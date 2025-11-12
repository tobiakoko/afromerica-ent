import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { FinalistsResponse } from '@/features/voting/types/voting.types';
import type { Database } from '@/utils/supabase/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'rank';
    const order = searchParams.get('order') || 'asc';

    // Fetch finalists from Supabase
    let query = supabase
      .from('showcase_finalists')
      .select('*');

    // Apply sorting
    const ascending = order === 'asc';
    if (sortBy === 'rank') {
      query = query.order('rank', { ascending, nullsFirst: false });
    } else if (sortBy === 'votes') {
      query = query.order('vote_count', { ascending });
    } else if (sortBy === 'name') {
      query = query.order('stage_name', { ascending });
    }

    const { data: finalists, error } = await query as { data: Database['public']['Tables']['showcase_finalists']['Row'][] | null; error: any };

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch finalists' },
        { status: 500 }
      );
    }

    // Fetch voting statistics
    const { data: settings } = await supabase
      .from('showcase_settings')
      .select('*')
      .eq('is_active', true)
      .single() as { data: Database['public']['Tables']['showcase_settings']['Row'] | null; error: any };

    // Calculate total votes and unique voters
    const totalVotes = finalists?.reduce((sum, f) => sum + (f.vote_count || 0), 0) || 0;

    const { count: uniqueVoters } = await supabase
      .from('showcase_votes')
      .select('*', { count: 'exact', head: true });

    // Transform data to match expected format
    const transformedFinalists = finalists?.map(f => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      stageName: f.stage_name,
      bio: f.bio || '',
      genre: (f.genre as string[]) || [],
      image: f.image_url || '',
      coverImage: f.cover_image_url || undefined,
      socialMedia: (f.social_media as any) || {},
      videoUrl: f.video_url || undefined,
      voteCount: f.vote_count || 0,
      rank: f.rank || 0,
      isQualified: f.is_qualified || false,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    })) || [];

    const response: FinalistsResponse = {
      data: transformedFinalists,
      stats: {
        totalVotes,
        uniqueVoters: uniqueVoters || 0,
        votingEndsAt: settings?.voting_end_date || new Date().toISOString(),
        isVotingActive: settings?.is_active || false,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching finalists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finalists' },
      { status: 500 }
    );
  }
}

// TODO: Add admin endpoints to manage finalists (POST, PUT, DELETE)
// These will be protected by authentication middleware
