"use client";

import { useEffect, useState } from "react";
import { type ArtistWithVotes } from "@/types";
import { Leaderboard } from "./RankTable";

interface LeaderboardWithRankTrackingProps {
  artists: ArtistWithVotes[];
  lastUpdated: Date | string;
  enableNavigation?: boolean;
  eventSlug?: string;
}

const STORAGE_KEY = "leaderboard_previous_ranks";
const STORAGE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface StoredRankData {
  ranks: Record<string, number | null>;
  timestamp: number;
}

export function LeaderboardWithRankTracking({
  artists,
  lastUpdated,
  enableNavigation = true,
  eventSlug,
}: LeaderboardWithRankTrackingProps) {
  const [previousRanks, setPreviousRanks] = useState<Record<string, number | null>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load previous ranks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredRankData = JSON.parse(stored);
        // Check if data is not expired
        if (Date.now() - data.timestamp < STORAGE_EXPIRY) {
          setPreviousRanks(data.ranks);
        } else {
          // Clear expired data
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading previous ranks:", error);
    }
    setIsInitialized(true);
  }, []);

  // Merge current data with previous ranks
  const artistsWithPreviousRanks: ArtistWithVotes[] = artists.map((artist) => {
    const previousRank = previousRanks[artist.id];

    return {
      ...artist,
      voteStats: {
        ...artist.voteStats,
        previousRank: previousRank ?? undefined,
      },
    };
  });

  // Update stored ranks when data changes
  useEffect(() => {
    if (!isInitialized) return;

    // Create current ranks object
    const currentRanks: Record<string, number | null> = {};
    artists.forEach((artist) => {
      currentRanks[artist.id] = artist.voteStats.rank;
    });

    // Check if ranks have actually changed
    const hasChanged = artists.some(
      (artist) => previousRanks[artist.id] !== artist.voteStats.rank
    );

    if (hasChanged) {
      // Update state and localStorage
      setPreviousRanks(currentRanks);
      try {
        const data: StoredRankData = {
          ranks: currentRanks,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving previous ranks:", error);
      }
    }
  }, [artists, previousRanks, isInitialized]);

  return (
    <Leaderboard
      artists={artistsWithPreviousRanks}
      lastUpdated={lastUpdated}
      enableNavigation={enableNavigation}
      eventSlug={eventSlug}
    />
  );
}
