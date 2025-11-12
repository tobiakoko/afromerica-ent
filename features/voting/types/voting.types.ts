export interface Finalist {
  id: string;
  name: string;
  slug: string;
  stageName: string;
  bio: string;
  genre: string[];
  image: string;
  profileImage?: string;
  coverImage?: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
  };
  videoUrl?: string; // Performance/audition video
  voteCount: number;
  rank: number;
  isQualified: boolean; // For showcase qualification
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  finalistId: string;
  voterId: string; // Can be IP, session ID, or user ID
  timestamp: string;
  metadata?: {
    userAgent?: string;
    location?: string;
  };
}

export interface VotingStats {
  totalVotes: number;
  uniqueVoters: number;
  votingEndsAt: string;
  isVotingActive: boolean;
}

export interface FinalistsResponse {
  data: Finalist[];
  stats: VotingStats;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  finalist?: Finalist;
  userVote?: {
    finalistId: string;
    votedAt: string;
  };
}

export interface UserVoteStatus {
  hasVoted: boolean;
  votedFor?: string; // Finalist ID
  votedAt?: string;
  canVoteAgain: boolean;
  nextVoteTime?: string; // If implementing rate limiting
}

// Query parameters
export interface VotingQueryParams {
  sortBy?: 'rank' | 'votes' | 'name';
  order?: 'asc' | 'desc';
}