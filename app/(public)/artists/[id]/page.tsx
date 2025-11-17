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

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  const { data: artist, error } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !artist) {
    notFound();
  }

  const socialMedia = artist.social_media as Record<string, string> || {};
  const genres = (artist.genre as string[]) || [];

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-80 md:h-96 w-full">
        <Image
          src={artist.cover_image_url || artist.image_url || '/images/default-artist.jpg'}
          alt={artist.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Artist Info */}
      <div className="container-wide -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Image */}
          <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-background shadow-xl">
            <Image
              src={artist.image_url || '/images/default-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 pt-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{artist.name}</h1>
            {artist.stage_name && (
              <p className="text-xl text-muted-foreground mb-4">"{artist.stage_name}"</p>
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
