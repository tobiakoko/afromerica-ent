import type { Database } from "@/utils/supabase/types";
 
// Re-export Supabase types
export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type ArtistInsert = Database["public"]["Tables"]["artists"]["Insert"];
export type ArtistUpdate = Database["public"]["Tables"]["artists"]["Update"];
 
// Extended types for UI
export interface ArtistWithEvents extends Artist {
  upcomingEvents?: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
    venue: string;
    city: string;
    state: string;
  }>;
}
 
export interface ArtistFilters {
  genre?: string;
  location?: string;
  featured?: boolean;
  search?: string;
}
 
export interface ArtistFormData {
  name: string;
  slug: string;
  bio?: string;
  image_url?: string;
  genre: string[];
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  website?: string;
  specialties: string[];
  featured?: boolean;
}