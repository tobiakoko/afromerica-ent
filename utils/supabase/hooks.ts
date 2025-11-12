"use client";
 
import { useEffect, useState } from "react";
import { createClient } from "./client";
import type { Database } from "./types";
 
type Artist = Database["public"]["Tables"]["artists"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
 
// Hook to fetch artists with real-time updates
export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchArtists() {
      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });
 
        if (error) throw error;
        setArtists(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    fetchArtists();
 
    // Set up real-time subscription
    const channel = supabase
      .channel("artists_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "artists",
        },
        () => {
          fetchArtists();
        }
      )
      .subscribe();
 
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
 
  return { artists, loading, error };
}
 
// Hook to fetch featured artists
export function useFeaturedArtists(limit: number = 6) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchFeaturedArtists() {
      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("status", "active")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(limit);
 
        if (error) throw error;
        setArtists(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    fetchFeaturedArtists();
  }, [limit]);
 
  return { artists, loading, error };
}
 
// Hook to fetch events with real-time updates
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "upcoming")
          .order("date", { ascending: true });
 
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    fetchEvents();
 
    // Set up real-time subscription
    const channel = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();
 
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
 
  return { events, loading, error };
}
 
// Hook to fetch upcoming events
export function useUpcomingEvents(limit: number = 6) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchUpcomingEvents() {
      try {
        const today = new Date().toISOString().split("T")[0];
 
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "upcoming")
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(limit);
 
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    fetchUpcomingEvents();
  }, [limit]);
 
  return { events, loading, error };
}
 
// Hook to fetch a single event by slug
export function useEvent(slug: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchEvent() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("slug", slug)
          .single();
 
        if (error) throw error;
        setEvent(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    if (slug) {
      fetchEvent();
    }
  }, [slug]);
 
  return { event, loading, error };
}
 
// Hook to fetch a single artist by slug
export function useArtist(slug: string) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchArtist() {
      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("slug", slug)
          .single();
 
        if (error) throw error;
        setArtist(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    if (slug) {
      fetchArtist();
    }
  }, [slug]);
 
  return { artist, loading, error };
}
 
// Hook to fetch user bookings
export function useUserBookings(userId: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  useEffect(() => {
    const supabase = createClient();
 
    async function fetchBookings() {
      if (!userId) {
        setLoading(false);
        return;
      }
 
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, events(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
 
        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
 
    fetchBookings();
 
    // Set up real-time subscription for user's bookings
    if (userId) {
      const channel = supabase
        .channel(`user_bookings_${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
            filter: `user_id=eq.${userId}`,
          },
          () => {
            fetchBookings();
          }
        )
        .subscribe();
 
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);
 
  return { bookings, loading, error };
}