import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { UserVoteStatus } from '@/features/voting/types/voting.types';

/**
 * GET /api/voting/status
 * Check if the current user has voted and get their vote status
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Check if user has voted (using cookie)
    const hasVoted = cookieStore.has('voted');
    const votedFor = cookieStore.get('votedFor')?.value;

    const status: UserVoteStatus = {
      hasVoted,
      votedFor: votedFor || undefined,
      votedAt: hasVoted ? cookieStore.get('voted')?.value : undefined,
      canVoteAgain: false, // One vote per user
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking vote status:', error);
    
    // Return default status if error occurs
    return NextResponse.json({
      hasVoted: false,
      canVoteAgain: true,
    } as UserVoteStatus);
  }
}