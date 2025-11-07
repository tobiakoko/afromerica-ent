"use client";

import { useArtists as useSupabaseArtists } from "@/lib/supabase/hooks";
import type { Artist, ArtistFilters } from "../types/artist.types";
import { useMemo } from "react";

export function useArtists(filters?: ArtistFilters) {
  const { artists, loading, error } = useSupabaseArtists();

  const filteredArtists = useMemo(() => {
    if (!filters) return artists;

    return artists.filter((artist: Artist) => {
      // Filter by genre
      if (filters.genre && !artist.genre.includes(filters.genre)) {
        return false;
      }

      // Filter by location
      if (filters.location && artist.city !== filters.location) {
        return false;
      }

      // Filter by featured
      if (filters.featured !== undefined && artist.featured !== filters.featured) {
        return false;
      }

      // Search by name
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return artist.name.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [artists, filters]);

  return {
    artists: filteredArtists,
    loading,
    error,
  };
}
