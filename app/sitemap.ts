import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afromerica-ent.com';
  const supabase = await createClient();
 
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pilot-voting`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
 
  // Fetch artists
  const { data: artists } = await supabase
    .from('artists')
    .select('slug, updated_at')
    .eq('status', 'active');
 
  const artistRoutes: MetadataRoute.Sitemap =
    artists?.map((artist) => ({
      url: `${baseUrl}/artists/${artist.slug}`,
      lastModified: new Date(artist.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];
 
  // Fetch events
  const { data: events } = await supabase
    .from('events')
    .select('slug, updated_at')
    .in('status', ['upcoming', 'ongoing']);
 
  const eventRoutes: MetadataRoute.Sitemap =
    events?.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];
 
  // Fetch pilot voting artists
  const { data: pilotArtists } = await supabase
    .from('pilot_artists')
    .select('slug, updated_at');
 
  const pilotVotingRoutes: MetadataRoute.Sitemap =
    pilotArtists?.map((artist) => ({
      url: `${baseUrl}/pilot-voting/${artist.slug}`,
      lastModified: new Date(artist.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) || [];
 
  return [
    ...staticRoutes,
    ...artistRoutes,
    ...eventRoutes,
    ...pilotVotingRoutes,
  ];
}