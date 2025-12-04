"use client";

import { type ArtistWithVotes } from "@/types";
import { Leaderboard } from "./RankTable";

interface LeaderboardWithRankTrackingProps {
  artists: ArtistWithVotes[];
  lastUpdated: Date | string;
  enableNavigation?: boolean;
  eventSlug?: string;
}

/**
 * LeaderboardWithRankTracking Component
 *
 * Now simplified to directly pass through artists data with previousRank
 * from the database. The previous_rank is stored in the database and
 * updated by the recalculate_artist_rankings() function.
 *
 * No need for localStorage or client-side state management!
 */
export function LeaderboardWithRankTracking({
  artists,
  lastUpdated,
  enableNavigation = true,
  eventSlug,
}: LeaderboardWithRankTrackingProps) {
  return (
    <Leaderboard
      artists={artists}
      lastUpdated={lastUpdated}
      enableNavigation={enableNavigation}
      eventSlug={eventSlug}
    />
  );
}
