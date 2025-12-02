import Link from "next/link";
import Image from "next/image";
import { Music } from "lucide-react";

interface ArtistCardProps {
    artist: {
      id: string;
      name: string;
      slug: string;
      stage_name?: string;
      bio?: string;
      genre?: string[];
      photo_url?: string;
      rank?: number;
      total_votes?: number;
    };
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const genres = (artist.genre as string[]) || [];

  return (
    <Link href={`/artists/${artist.slug}`} className="group block h-full">
      {/* Apple-style card with minimal border and subtle shadow */}
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1">
        {/* Image - reduced height */}
        <div className="relative bg-gray-100 dark:bg-gray-800 aspect-4/3 overflow-hidden">
          {artist.photo_url ? (
            <Image
              src={artist.photo_url}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <Music className="w-16 h-16 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content - reduced height by third */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-lg md:text-xl tracking-tight text-gray-900 dark:text-white mb-1 line-clamp-1 leading-snug">
            {artist.name}
          </h3>

          {artist.stage_name && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 line-clamp-1">
              &quot;{artist.stage_name}&quot;
            </p>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}