import type {
  PilotArtistsResponse,
  VotePackagesResponse,
  PurchaseResponse,
  PilotVotingStats,
  CartItem,
} from '../types/voting.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Fetch all pilot artists with current vote counts
 */
export async function getPilotArtists(): Promise<PilotArtistsResponse> {
  const response = await fetch(`${API_BASE_URL}/pilot-voting/artists`, {
    next: { revalidate: 30 }, // Revalidate every 30 seconds for live updates
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artists');
  }

  return response.json();
}

/**
 * Fetch voting statistics
 */
export async function getPilotVotingStats(): Promise<PilotVotingStats> {
  const response = await fetch(`${API_BASE_URL}/pilot-voting/stats`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
}

/**
 * Fetch available vote packages
 */
export async function getVotePackages(): Promise<VotePackagesResponse> {
  const response = await fetch(`${API_BASE_URL}/pilot-voting/packages`, {
    cache: 'force-cache', // Packages rarely change
  });

  if (!response.ok) {
    throw new Error('Failed to fetch packages');
  }

  return response.json();
}

/**
 * Initialize payment for votes
 */
export async function initializePayment(data: {
  email: string;
  items: CartItem[];
  totalAmount: number;
}): Promise<PurchaseResponse> {
  const response = await fetch(`${API_BASE_URL}/pilot-voting/payment/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initialize payment');
  }

  return response.json();
}

/**
 * Verify payment after redirect
 */
export async function verifyPayment(reference: string): Promise<PurchaseResponse> {
  const response = await fetch(
    `${API_BASE_URL}/pilot-voting/payment/verify?reference=${reference}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
}

/**
 * Get user's vote history
 */
export async function getVoteHistory(email: string) {
  const response = await fetch(
    `${API_BASE_URL}/pilot-voting/history?email=${encodeURIComponent(email)}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch vote history');
  }

  return response.json();
}