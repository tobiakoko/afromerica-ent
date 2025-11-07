"use client";

import { useUserBookings } from "@/lib/supabase/hooks";

export function useBookings(userId: string | null) {
  return useUserBookings(userId);
}
