"use client";
 
import { useUserBookings } from "@/utils/supabase/hooks";
 
export function useBookings(userId: string | null) {
  return useUserBookings(userId);
}