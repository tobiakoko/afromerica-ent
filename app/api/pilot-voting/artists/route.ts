import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { PilotArtistsResponse } from '@/features/pilot-voting/types/voting.types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'rank';
    const order = searchParams.get('order') || 'asc';

    // Fetch artists from Supabase
    let query = supabase
      .from('pilot_artists')
      .select('*');

    // Apply sorting
    const ascending = order === 'asc';
    if (sortBy === 'rank') {
      query = query.order('rank', { ascending, nullsFirst: false });
    } else if (sortBy === 'votes') {
      query = query.order('total_votes', { ascending });
    } else if (sortBy === 'name') {
      query = query.order('stage_name', { ascending });
    }

    const { data: artists, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch artists' },
        { status: 500 }
      );
    }

    // Fetch voting settings
    const { data: settings } = await supabase
      .from('pilot_voting_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    // Calculate total votes and revenue
    const totalVotes = (artists as any[])?.reduce((sum: number, a: any) => sum + (a.total_votes || 0), 0) || 0;

    // Get unique voters count from vote_purchases
    const { count: uniqueVoters } = await supabase
      .from('vote_purchases')
      .select('user_id', { count: 'exact', head: true });

    // Get total revenue from vote purchases
    const { data: purchases } = await supabase
      .from('vote_purchases')
      .select('total_amount');

    const totalRevenue = (purchases as any[])?.reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0) || 0;

    // Transform data to match expected format
    const transformedArtists = (artists as any[])?.map((a: any) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      stageName: a.stage_name,
      bio: a.bio || '',
      genre: a.genre as string[] || [],
      image: a.image_url || '',
      coverImage: a.cover_image_url,
      socialMedia: a.social_media || {},
      videoUrl: a.video_url,
      performanceVideoUrl: a.performance_video_url,
      totalVotes: a.total_votes || 0,
      rank: a.rank || 0,
      displayOrder: a.display_order,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    })) || [];

    // Find top artist
    const topArtist = transformedArtists.length > 0
      ? transformedArtists.reduce((prev, current) =>
          (current.totalVotes > prev.totalVotes) ? current : prev
        )
      : null;

    // Calculate time remaining
    const votingEndsAt = (settings as any)?.voting_end_date || new Date().toISOString();
    const endDate = new Date(votingEndsAt);
    const now = new Date();
    const timeRemaining = endDate > now
      ? Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + ' days'
      : '0 days';

    const response: PilotArtistsResponse = {
      data: transformedArtists,
      stats: {
        totalVotes,
        totalRevenue,
        uniqueVoters: uniqueVoters || 0,
        votingEndsAt,
        isVotingActive: (settings as any)?.is_active || false,
        timeRemaining,
        topArtist: topArtist ? {
          id: topArtist.id,
          name: topArtist.stageName,
          votes: topArtist.totalVotes,
        } : {
          id: '',
          name: 'No artists yet',
          votes: 0,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching pilot artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

// TODO: Add admin endpoints to manage artists (POST, PUT, DELETE)
// These will be protected by authentication middleware
