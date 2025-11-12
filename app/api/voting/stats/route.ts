import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { VotingStats } from '@/features/voting/types/voting.types';

/**
 * GET /api/voting/stats
 * Get overall voting statistics from Supabase
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch voting settings
    const { data: settings } = await supabase
      .from('showcase_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    // Get total votes from all finalists
    const { data: finalists } = await supabase
      .from('showcase_finalists')
      .select('vote_count');

    const totalVotes = finalists?.reduce((sum, f) => sum + (f.vote_count || 0), 0) || 0;

    // Get unique voters count
    const { count: uniqueVoters } = await supabase
      .from('showcase_votes')
      .select('*', { count: 'exact', head: true });

    const stats: VotingStats = {
      totalVotes,
      uniqueVoters: uniqueVoters || 0,
      votingEndsAt: settings?.voting_end_date || new Date().toISOString(),
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