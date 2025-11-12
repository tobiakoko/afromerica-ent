import { NextResponse } from 'next/server';
import type { VotingStats } from '@/features/voting/types/voting.types';

/**
 * GET /api/voting/stats
 * Get overall voting statistics
 */
export async function GET() {
  try {
    // TODO: In production, fetch from database
    // For now, return mock data
    
    const stats: VotingStats = {
      totalVotes: 8374,
      uniqueVoters: 8374, // Assuming 1 vote per person
      votingEndsAt: '2025-12-01T23:59:59Z',
      isVotingActive: new Date() < new Date('2025-12-01T23:59:59Z'),
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