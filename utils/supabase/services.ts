import { createClient } from "./server";
import type { Database } from "./types";
 
type Artist = Database["public"]["Tables"]["artists"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"];
type EventArtist = Database["public"]["Tables"]["event_artists"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
 
// Artist Services
export async function getAllArtists() {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
 
  if (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
 
  return data || [];
}
 
export async function getFeaturedArtists(limit: number = 6) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
 
  if (error) {
    console.error("Error fetching featured artists:", error);
    return [];
  }
 
  return data || [];
}
 
export async function getArtistBySlug(slug: string) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();
 
  if (error) {
    console.error(`Error fetching artist with slug ${slug}:`, error);
    return null;
  }
 
  return data;
}
 
export async function getArtistsByGenre(genre: string) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("status", "active")
    .contains("genre", [genre])
    .order("created_at", { ascending: false });
 
  if (error) {
    console.error(`Error fetching artists by genre ${genre}:`, error);
    return [];
  }
 
  return data || [];
}
 
// Event Services
export async function getAllEvents() {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "upcoming")
    .order("date", { ascending: true });
 
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
 
  return data || [];
}
 
export async function getFeaturedEvents(limit: number = 6) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "upcoming")
    .eq("featured", true)
    .order("date", { ascending: true })
    .limit(limit);
 
  if (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
 
  return data || [];
}
 
export async function getUpcomingEvents(limit: number = 6) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
 
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "upcoming")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);
 
  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
 
  return data || [];
}
 
export async function getEventBySlug(slug: string) {
  const supabase = await createClient();
 
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
 
  if (eventError || !event) {
    console.error(`Error fetching event with slug ${slug}:`, eventError);
    return null;
  }
 
  // Fetch associated artists
  const { data: eventArtists, error: artistsError } = await supabase
    .from("event_artists")
    .select(`
      role,
      set_time,
      artists (*)
    `)
    .eq("event_id", event.id);
 
  if (artistsError) {
    console.error("Error fetching event artists:", artistsError);
  }
 
  return {
    ...event,
    artists: eventArtists || [],
  };
}
 
export async function getEventsByCategory(category: string) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "upcoming")
    .eq("category", category)
    .order("date", { ascending: true });
 
  if (error) {
    console.error(`Error fetching events by category ${category}:`, error);
    return [];
  }
 
  return data || [];
}
 
// Booking Services
export async function createBooking(bookingData: Database["public"]["Tables"]["bookings"]["Insert"]) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingData)
    .select()
    .single();
 
  if (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
 
  return data;
}
 
export async function getBookingById(id: string) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      events (*)
    `)
    .eq("id", id)
    .single();
 
  if (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    return null;
  }
 
  return data;
}
 
export async function getUserBookings(userId: string) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      events (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
 
  if (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    return [];
  }
 
  return data || [];
}
 
export async function updateBookingStatus(
  id: string,
  status: Database["public"]["Tables"]["bookings"]["Row"]["status"]
) {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
 
  if (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
 
  return data;
}
 
// Statistics
export async function getEventStats() {
  const supabase = await createClient();
 
  const [
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalArtists },
    { count: totalBookings }
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
    supabase.from("artists").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("bookings").select("*", { count: "exact", head: true })
  ]);
 
  return {
    totalEvents: totalEvents || 0,
    upcomingEvents: upcomingEvents || 0,
    totalArtists: totalArtists || 0,
    totalBookings: totalBookings || 0,
  };
}