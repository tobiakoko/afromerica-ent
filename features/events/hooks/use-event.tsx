"use client";
 
import { useEvent as useSupabaseEvent } from "@/utils/supabase/hooks";
 
export function useEvent(slug: string) {
  return useSupabaseEvent(slug);
}