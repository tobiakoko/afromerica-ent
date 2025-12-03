import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Youtube, Music, TrendingUp, Award, Video, Hash, Vote } from "lucide-react";

export const dynamic = 'force-dynamic'

const socialIcons = {
  instagram: Instagram,
  tiktok: Video,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  spotify: Music,
  appleMusic: Music,
} as const;

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
      artist_id,
      name,
      slug,
      stage_name,
      bio,
      genre,
      photo_url,
      cover_image_url,
      instagram,
      tiktok,
      total_votes,
      rank,
      is_active
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
  if (artist.tiktok) socialMedia.tiktok = artist.tiktok;

  const genres = Array.isArray(artist.genre) ? artist.genre : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />

        {/* Cover Image with Parallax Effect */}
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          {(artist.cover_image_url || artist.photo_url) ? (
            <Image
              src={artist.cover_image_url || artist.photo_url}
              alt={`${artist.name} cover image`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
                <Music className="relative w-32 h-32 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
              </div>
            </div>
          )}
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 dark:to-transparent" />
        </div>

        {/* Artist Info Container */}
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start -mt-24 lg:-mt-32">
            {/* Profile Image with Enhanced Shadow */}
            <div className="relative shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '100ms' }}>
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-950 shadow-2xl shadow-black/20 dark:shadow-black/60 transition-transform duration-500 hover:scale-105">
                {artist.photo_url ? (
                  <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <Music className="w-20 h-20 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Rank Badge */}
              {artist.rank && artist.rank <= 10 && (
                <div className="absolute -top-3 -right-3 px-4 py-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-full shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-white stroke-2" aria-hidden="true" />
                    <span className="text-white font-bold text-sm">#{artist.rank}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details with Staggered Animation */}
            <div className="flex-1 pt-0 lg:pt-20 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
              {/* Name and Stage Name */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
                  {artist.name}
                </h1>
                {artist.stage_name && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
                    &quot;{artist.stage_name}&quot;
                  </p>
                )}
              </div>

              {/* Genres with Apple Style Pills */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {genres.map((genre, index) => (
                    <span
                      key={genre}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Row - Apple Style Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '400ms' }}>
                {artist.artist_id && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Artist ID</span>
                    </div>
                    <div className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white font-mono">
                      {artist.artist_id}
                    </div>
                  </div>
                )}

                {artist.total_votes !== undefined && artist.total_votes > 0 && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Total Votes</span>
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {artist.total_votes.toLocaleString()}
                    </div>
                  </div>
                )}

                {artist.rank && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Ranking</span>
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      #{artist.rank}
                    </div>
                  </div>
                )}
              </div>

              {/* Vote Button */}
              <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '500ms' }}>
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/events/december-showcase-2025/vote?artist=${artist.slug}`}>
                    <Vote className="w-5 h-5 mr-2" />
                    Vote for {artist.stage_name || artist.name}
                  </Link>
                </Button>
              </div>

              {/* Social Links with Enhanced Styling */}
              {Object.keys(socialMedia).length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '600ms' }}>
                  {Object.entries(socialMedia).map(([platform, url], index) => {
                    const Icon = socialIcons[platform as keyof typeof socialIcons] || Music;
                    return (
                      <Button
                        key={platform}
                        variant="outline"
                        size="icon"
                        asChild
                        className="rounded-xl border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        style={{ animationDelay: `${700 + index * 50}ms` }}
                      >
                        <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${platform}`}>
                          <Icon className="w-[18px] h-[18px] stroke-[1.5]" aria-hidden="true" />
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Bio Section with Apple Typography */}
              {artist.bio && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200/60 dark:border-gray-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '600ms' }}>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
                    About
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed whitespace-pre-wrap">
                      {artist.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
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
