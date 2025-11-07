"use client";

import { useUpcomingEvents } from "@/lib/supabase/hooks";

export function useFeaturedEvents(limit: number = 6) {
  return useUpcomingEvents(limit);
}
