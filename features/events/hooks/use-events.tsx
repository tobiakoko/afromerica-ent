"use client";

import { useEvents as useSupabaseEvents } from "@/lib/supabase/hooks";
import type { Event, EventFilters } from "../types/event.types";
import { useMemo } from "react";

export function useEvents(filters?: EventFilters) {
  const { events, loading, error } = useSupabaseEvents();

  const filteredEvents = useMemo(() => {
    if (!filters) return events;

    return events.filter((event: Event) => {
      // Filter by category
      if (filters.category && event.category !== filters.category) {
        return false;
      }

      // Filter by status
      if (filters.status && event.status !== filters.status) {
        return false;
      }

      // Filter by date
      if (filters.date && event.date !== filters.date) {
        return false;
      }

      // Filter by location
      if (filters.location && event.city !== filters.location) {
        return false;
      }

      // Filter by featured
      if (filters.featured !== undefined && event.featured !== filters.featured) {
        return false;
      }

      // Search by title
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return event.title.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [events, filters]);

  return {
    events: filteredEvents,
    loading,
    error,
  };
}
