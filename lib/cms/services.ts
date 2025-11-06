import { sanityClient } from "./sanity";
import type { Artist, Event, PageContent, SiteSettings, Testimonial } from "./types";
import {
  ARTISTS_QUERY,
  FEATURED_ARTISTS_QUERY,
  ARTIST_BY_SLUG_QUERY,
  ARTISTS_BY_GENRE_QUERY,
  EVENTS_QUERY,
  FEATURED_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  EVENTS_BY_CATEGORY_QUERY,
  UPCOMING_EVENTS_QUERY,
  PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
  FEATURED_TESTIMONIALS_QUERY,
} from "./queries";

// Artist Services
export async function getAllArtists(): Promise<Artist[]> {
  try {
    return await sanityClient.fetch(ARTISTS_QUERY);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export async function getFeaturedArtists(): Promise<Artist[]> {
  try {
    return await sanityClient.fetch(FEATURED_ARTISTS_QUERY);
  } catch (error) {
    console.error("Error fetching featured artists:", error);
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    return await sanityClient.fetch(ARTIST_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error(`Error fetching artist with slug ${slug}:`, error);
    return null;
  }
}

export async function getArtistsByGenre(genre: string): Promise<Artist[]> {
  try {
    return await sanityClient.fetch(ARTISTS_BY_GENRE_QUERY, { genre });
  } catch (error) {
    console.error(`Error fetching artists by genre ${genre}:`, error);
    return [];
  }
}

// Event Services
export async function getAllEvents(): Promise<Event[]> {
  try {
    return await sanityClient.fetch(EVENTS_QUERY);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    return await sanityClient.fetch(FEATURED_EVENTS_QUERY);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    return await sanityClient.fetch(EVENT_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return null;
  }
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  try {
    return await sanityClient.fetch(EVENTS_BY_CATEGORY_QUERY, { category });
  } catch (error) {
    console.error(`Error fetching events by category ${category}:`, error);
    return [];
  }
}

export async function getUpcomingEvents(limit: number = 6): Promise<Event[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    return await sanityClient.fetch(UPCOMING_EVENTS_QUERY, { today, limit });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

// Page Services
export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  try {
    return await sanityClient.fetch(PAGE_QUERY, { slug });
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}

// Site Settings Services
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch(SITE_SETTINGS_QUERY);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

// Testimonial Services
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    return await sanityClient.fetch(TESTIMONIALS_QUERY);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    return await sanityClient.fetch(FEATURED_TESTIMONIALS_QUERY);
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return [];
  }
}

// Cache revalidation helper
export const revalidateTags = {
  artists: "artists",
  events: "events",
  pages: "pages",
  settings: "settings",
  testimonials: "testimonials",
};
