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
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Artist Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-primary/10 to-secondary/10">
        {artist.image ? (
          <>
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-200"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-200"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="w-16 h-16 text-white/30" />
            </div>
          </>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
            <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Artist Info */}
      <h3 className="text-base font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
        {artist.name}
      </h3>
      <p className="text-muted-foreground text-xs truncate">{genreDisplay}</p>
    </div>
  );
}
