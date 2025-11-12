import { apiClient } from '@/lib/api/client'
import type {
  Event,
  PaginatedResponse,
  SingleEventResponse,
  EventsResponse,
  EventQueryParams
} from '../types/event.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const eventsApi = {
  getEvents: async (params?: EventQueryParams): Promise<PaginatedResponse<Event>> => {
    const response = await apiClient.get<PaginatedResponse<Event>>('/events', params)
    return response.data
  },

  getEvent: async (slug: string): Promise<Event> => {
    const response = await apiClient.get<Event>(`/events/${slug}`)
    return response.data
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events/featured')
    return response.data
  },
}

/**
 * Fetch events with optional filters
 * This will eventually connect to Sanity CMS
 */
export async function getEvents(params?: EventQueryParams): Promise<EventsResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const url = `${API_BASE_URL}/events${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

/**
 * Fetch a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  const data: SingleEventResponse = await response.json();
  return data.data;
}

/**
 * Fetch featured event
 */
export async function getFeaturedEvent(): Promise<Event | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/featured`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data: SingleEventResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch featured event:', error);
    return null;
  }
}

/**
 * Search events
 */
export async function searchEvents(query: string): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error('Failed to search events');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get events by city
 */
export async function getEventsByCity(city: string): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch events by city');
  }

  const data: EventsResponse = await response.json();
  return data.events;
}