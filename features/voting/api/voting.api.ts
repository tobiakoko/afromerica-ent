import type {
  Finalist,
  FinalistsResponse,
  VoteResponse,
  UserVoteStatus,
  VotingStats,
  VotingQueryParams,
} from '../types/voting.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Fetch all finalists with current rankings
 */
export async function getFinalists(params?: VotingQueryParams): Promise<FinalistsResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const url = `${API_BASE_URL}/voting/finalists${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    next: { revalidate: 30 }, // Revalidate every 30 seconds for live updates
  });

  if (!response.ok) {
    throw new Error('Failed to fetch finalists');
  }

  return response.json();
}

/**
 * Fetch a single finalist by ID
 */
export async function getFinalistById(id: string): Promise<Finalist> {
  const response = await fetch(`${API_BASE_URL}/voting/finalists/${id}`, {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch finalist');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Submit a vote for a finalist
 */
export async function submitVote(finalistId: string): Promise<VoteResponse> {
  const response = await fetch(`${API_BASE_URL}/voting/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ finalistId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit vote');
  }

  return response.json();
}

/**
 * Check if user has already voted and get their vote status
 */
export async function getUserVoteStatus(): Promise<UserVoteStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/voting/status`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      return { hasVoted: false, canVoteAgain: true };
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch vote status:', error);
    return { hasVoted: false, canVoteAgain: true };
  }
}

/**
 * Get voting statistics
 */
export async function getVotingStats(): Promise<VotingStats> {
  const response = await fetch(`${API_BASE_URL}/voting/stats`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });

  if (!response.ok) {
    throw new Error('Failed to fetch voting stats');
  }

  return response.json();
}

/**
 * Get leaderboard (top finalists)
 */
export async function getLeaderboard(limit: number = 3): Promise<Finalist[]> {
  const response = await fetch(
    `${API_BASE_URL}/voting/leaderboard?limit=${limit}`,
    {
      next: { revalidate: 30 },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  const data = await response.json();
  return data.data;
}