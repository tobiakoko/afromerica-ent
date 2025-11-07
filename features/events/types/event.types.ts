import type { Database } from "@/lib/supabase/types";

// Re-export Supabase types
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type EventArtist = Database["public"]["Tables"]["event_artists"]["Row"];

// Extended types for UI
export interface EventWithArtists extends Event {
  artists?: Array<{
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    genre: string[];
    role?: string;
    set_time?: string | null;
  }>;
}

export interface EventFilters {
  category?: string;
  date?: string;
  location?: string;
  status?: Event["status"];
  featured?: boolean;
  search?: string;
}

export interface EventFormData {
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  pricing: {
    currency: string;
    earlyBird?: number;
    general: number;
    vip?: number;
  };
  capacity: number;
  highlights?: string[];
  age_requirement?: string;
  dress_code?: string;
  featured?: boolean;
}

export type EventCategory =
  | "Concerts"
  | "Festivals"
  | "Club Nights"
  | "Cultural Events"
  | "Workshops"
  | "Other";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Concerts",
  "Festivals",
  "Club Nights",
  "Cultural Events",
  "Workshops",
  "Other",
];
