"use client";
 
import { useUpcomingEvents } from "@/utils/supabase/hooks";
 
export function useFeaturedEvents(limit: number = 6) {
  return useUpcomingEvents(limit);
}