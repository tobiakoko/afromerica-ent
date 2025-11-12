import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/utils/supabase/types';

/**
 * GET /api/pilot-voting/stats
 * Get pilot voting statistics
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get total votes and amount across all artists
    const { data: artists, error: artistsError } = await supabase
      .from('pilot_artists')
      .select('total_votes, total_amount') as {
        data: Array<Pick<Database['public']['Tables']['pilot_artists']['Row'], 'total_votes' | 'total_amount'>> | null;
        error: any;
      };

    if (artistsError) {
      console.error('Error fetching artist stats:', artistsError);
      return NextResponse.json(
        { error: 'Failed to fetch voting statistics' },
        { status: 500 }
      );
    }

    const totalVotes = artists?.reduce((sum, a) => sum + (a.total_votes || 0), 0) || 0;
    const totalAmount = artists?.reduce((sum, a) => sum + (a.total_amount || 0), 0) || 0;

    // Get voting settings
    const { data: settings } = await supabase
      .from('pilot_voting_settings')
      .select('*')
      .eq('is_active', true)
      .single() as { data: Database['public']['Tables']['pilot_voting_settings']['Row'] | null; error: any };

    // Get unique voters count
    const { count: uniqueVoters } = await supabase
      .from('vote_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'completed');

    const stats = {
      totalVotes,
      totalAmount,
      uniqueVoters: uniqueVoters || 0,
      artistCount: artists?.length || 0,
      votingEndsAt: settings?.voting_end_date || null,
      isVotingActive: settings?.is_active || false,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching voting stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voting statistics' },
      { status: 500 }
    );
  }
}
