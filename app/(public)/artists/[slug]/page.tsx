import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Youtube, Music } from "lucide-react";

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  spotify: Music,
  appleMusic: Music,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: artist, error } = await supabase
    .from('artists')
    .select(`
      id,
      name,
      slug,
      stage_name,
      bio,
      genre,
      photo_url,
      cover_image_url,
      instagram,
      twitter,
      spotify_url,
      apple_music_url,
      youtube_url,
      total_votes,
      rank,
      is_active,
      featured
    `)
    .eq('slug', slug)
    .eq('is_active', true) // Only show active artists
    .is('deleted_at', null) // Only show non-deleted artists
    .maybeSingle();

  if (error) {
    console.error('Error fetching artist:', error);
    notFound();
  }

  if (!artist) {
    notFound();
  }

  // Build social media object from individual columns
  const socialMedia: Record<string, string> = {};
  if (artist.instagram) socialMedia.instagram = artist.instagram;
  if (artist.twitter) socialMedia.twitter = artist.twitter;
  if (artist.spotify_url) socialMedia.spotify = artist.spotify_url;
  if (artist.apple_music_url) socialMedia.appleMusic = artist.apple_music_url;
  if (artist.youtube_url) socialMedia.youtube = artist.youtube_url;

  const genres = Array.isArray(artist.genre) ? artist.genre : [];

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-80 md:h-96 w-full bg-muted">
        {(artist.cover_image_url || artist.photo_url) ? (
          <Image
          src={artist.cover_image_url || artist.photo_url}
          alt={artist.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <Music className="w-24 h-24 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Artist Info */}
      <div className="container-wide -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Image */}
          <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-background shadow-xl">
            {artist.photo_url ? (
            <Image
              src={artist.photo_url || '/images/default-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
            />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                <Music className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{artist.name}</h1>
            {artist.stage_name && (
              <p className="text-xl text-muted-foreground mb-4">&quot;{artist.stage_name}&quot;</p>
            )}

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            {Object.keys(socialMedia).length > 0 && (
            <div className="flex gap-3 mb-8">
              {Object.entries(socialMedia).map(([platform, url]) => {
                const Icon = socialIcons[platform as keyof typeof socialIcons] || Music;
                return (
                  <Button key={platform} variant="outline" size="icon" asChild>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-4 h-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
            )}

            {/* Bio */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground">{artist.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: artist } = await supabase
    .from('artists')
    .select('name, stage_name, bio, photo_url')
    .eq('slug', slug)
    .single();

  if (!artist) {
    return {
      title: 'Artist Not Found',
    };
  }

  return {
    title: `${artist.name} - Afromerica Entertainment`,
    description: artist.bio?.slice(0, 160) || `View ${artist.name}'s profile`,
    openGraph: {
      title: artist.name,
      description: artist.bio?.slice(0, 160),
      images: artist.photo_url ? [artist.photo_url] : [],
    },
  };
}
