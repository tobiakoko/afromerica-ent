import { Play, Music } from 'lucide-react';
import type { Artist } from '../types/artist.types';

interface ArtistCardProps {
  artist: Pick<Artist, 'id' | 'name' | 'genre' | 'image'>;
  onClick?: () => void;
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
  const genreDisplay = Array.isArray(artist.genre)
    ? artist.genre.join(', ')
    : artist.genre || 'Artist';

  return (
    <div
      className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View ${artist.name}'s profile`}
    >
      {/* Artist Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-md hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
        {artist.image ? (
          <>
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-16 h-16 text-white/30" />
            </div>
          </>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-primary/40">
            <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Artist Info */}
      <h3 className="text-base font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors duration-200 truncate">
        {artist.name}
      </h3>
      <p className="text-muted-foreground text-xs truncate group-hover:text-foreground/80 transition-colors duration-200">{genreDisplay}</p>
    </div>
  );
}
