"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PilotVotingStats } from "../types/voting.types";

export function useVotingStats() {
  const [stats, setStats] = useState<PilotVotingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchStats() {
      try {
        setLoading(true);

        // Get voting config
        const { data: config, error: configError } = await supabase
          .from("voting_config")
          .select("*")
          .single();

        if (configError) throw configError;
        if (!config) {
          setStats(null);
          return;
        }

        // Get artists for stats
        const { data: artists, error: artistsError } = await supabase
          .from("pilot_artists")
          .select("*")
          .order("rank", { ascending: true });

        if (artistsError) throw artistsError;

        // Get total revenue from completed purchases
        const { data: purchases, error: purchasesError } = await supabase
          .from("vote_purchases")
          .select("total_amount, email")
          .eq("payment_status", "completed");

        if (purchasesError) throw purchasesError;

        const totalVotes = (artists || []).reduce(
          (sum, artist) => sum + (artist.total_votes || 0),
          0
        );
        const totalRevenue = (purchases || []).reduce(
          (sum, p) => sum + parseFloat(p.total_amount),
          0
        );
        const uniqueVoters = new Set((purchases || []).map(p => p.email)).size;

        const topArtist = artists && artists[0] || { id: "", stage_name: "", name: "", total_votes: 0 };

        // Calculate time remaining
        const votingEndsAt = new Date(config.voting_ends_at);
        const now = new Date();
        const diffMs = votingEndsAt.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        let timeRemaining = "";
        if (diffDays > 0) {
          timeRemaining = `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
        } else if (diffHours > 0) {
          timeRemaining = `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
        } else {
          timeRemaining = "Ending soon";
        }

        setStats({
          totalVotes,
          totalRevenue,
          uniqueVoters,
          votingEndsAt: config.voting_ends_at,
          isVotingActive: config.is_voting_active && diffMs > 0,
          timeRemaining,
          topArtist: {
            id: topArtist.id,
            name: topArtist.stage_name || topArtist.name,
            votes: topArtist.total_votes || 0,
          },
        });

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Real-time subscription for updates
    const artistsChannel = supabase
      .channel("voting_stats_artists")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pilot_artists",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const purchasesChannel = supabase
      .channel("voting_stats_purchases")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vote_purchases",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(artistsChannel);
      supabase.removeChannel(purchasesChannel);
    };
  }, []);

  return { stats, loading, error };
}
