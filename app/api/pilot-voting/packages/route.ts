import { NextResponse } from 'next/server';
import type { VotePackage, VotePackagesResponse } from '@/features/pilot-voting/types/voting.types';

// Vote packages configuration
const VOTE_PACKAGES: VotePackage[] = [
  {
    id: 'pkg-1',
    name: 'Starter',
    votes: 10,
    price: 1000,
    currency: 'NGN',
    discount: 0,
    popular: false,
    savings: 0,
  },
  {
    id: 'pkg-2',
    name: 'Supporter',
    votes: 50,
    price: 4500,
    currency: 'NGN',
    discount: 10,
    popular: true,
    savings: 500,
  },
  {
    id: 'pkg-3',
    name: 'Super Fan',
    votes: 100,
    price: 8000,
    currency: 'NGN',
    discount: 20,
    popular: false,
    savings: 2000,
  },
  {
    id: 'pkg-4',
    name: 'Mega Supporter',
    votes: 250,
    price: 18750,
    currency: 'NGN',
    discount: 25,
    popular: false,
    savings: 6250,
  },
];

export async function GET() {
  try {
    // TODO: In production:
    // - Store packages in database
    // - Allow dynamic package creation
    // - Support different currencies
    // - Add limited-time offers

    const response: VotePackagesResponse = {
      data: VOTE_PACKAGES,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}