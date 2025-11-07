// Pilot Event Voting System - Paid Voting Types
// Users can purchase unlimited votes for artists

export interface PilotArtist {
  id: string;
  name: string;
  slug: string;
  stageName: string;
  bio: string;
  genre: string[];
  image: string;
  coverImage?: string;
  performanceVideo?: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
  };
  totalVotes: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

// Vote packages available for purchase
export interface VotePackage {
  id: string;
  name: string;
  votes: number;
  price: number;
  currency: string;
  discount?: number; // Percentage discount
  popular?: boolean; // Highlight as popular choice
  savings?: number; // Amount saved compared to single votes
}

// Cart item for votes
export interface CartItem {
  id: string;
  artistId: string;
  artistName: string;
  artistImage: string;
  packageId: string;
  packageName: string;
  votes: number;
  pricePerPackage: number;
  quantity: number; // How many packages
  totalVotes: number; // votes * quantity
  totalPrice: number; // pricePerPackage * quantity
}

// Shopping cart
export interface VotingCart {
  items: CartItem[];
  totalVotes: number;
  totalPrice: number;
  currency: string;
}

// Vote purchase (after payment)
export interface VotePurchase {
  id: string;
  userId?: string;
  email: string;
  items: CartItem[];
  totalVotes: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentReference: string;
  paymentMethod: 'paystack' | 'card' | 'bank_transfer';
  purchasedAt: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  artist: PilotArtist;
  votes: number;
  rank: number;
  percentageOfTotal: number;
  isLeading: boolean;
}

// Voting statistics
export interface PilotVotingStats {
  totalVotes: number;
  totalRevenue: number;
  uniqueVoters: number;
  votingEndsAt: string;
  isVotingActive: boolean;
  timeRemaining: string;
  topArtist: {
    id: string;
    name: string;
    votes: number;
  };
}

// API Response types
export interface PilotArtistsResponse {
  data: PilotArtist[];
  stats: PilotVotingStats;
}

export interface VotePackagesResponse {
  data: VotePackage[];
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  purchase?: VotePurchase;
  paymentUrl?: string; // Paystack payment URL
  reference?: string;
}

export interface VoteHistoryItem {
  id: string;
  artistName: string;
  votes: number;
  amount: number;
  purchasedAt: string;
  status: 'completed' | 'pending' | 'failed';
}

// Cart actions
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // item id
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Query parameters
export interface PilotVotingQueryParams {
  sortBy?: 'rank' | 'votes' | 'name';
  order?: 'asc' | 'desc';
}
