"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PilotArtist, PilotVotingQueryParams } from "../types/voting.types";

export function usePilotArtists(params?: PilotVotingQueryParams) {
  const [artists, setArtists] = useState<PilotArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchArtists() {
      try {
        setLoading(true);

        let query = supabase.from("pilot_artists").select("*");

        // Apply sorting
        const sortBy = params?.sortBy || "rank";
        const order = params?.order || "asc";

        if (sortBy === "rank") {
          query = query.order("rank", { ascending: order === "asc" });
        } else if (sortBy === "votes") {
          query = query.order("total_votes", { ascending: order === "asc" });
        } else if (sortBy === "name") {
          query = query.order("name", { ascending: order === "asc" });
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const formattedArtists: PilotArtist[] = (data || []).map(artist => ({
          id: artist.id,
          name: artist.name,
          slug: artist.slug,
          stageName: artist.stage_name,
          bio: artist.bio || "",
          genre: artist.genre || [],
          image: artist.image,
          coverImage: artist.cover_image,
          performanceVideo: artist.performance_video,
          socialMedia: artist.social_media || {},
          totalVotes: artist.total_votes || 0,
          rank: artist.rank || 0,
          createdAt: artist.created_at,
          updatedAt: artist.updated_at,
        }));

        setArtists(formattedArtists);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch artists"));
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();

    // Real-time subscription for vote updates
    const channel = supabase
      .channel("pilot_artists_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pilot_artists",
        },
        () => {
          fetchArtists();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params?.sortBy, params?.order]);

  return { artists, loading, error };
}
