"use client";

import { useEvent as useSupabaseEvent } from "@/lib/supabase/hooks";

export function useEvent(slug: string) {
  return useSupabaseEvent(slug);
}
