import { Play } from 'lucide-react';
import type { Album } from '@/features/artists/types/artist.types';

interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
  showArtist?: boolean;
}

export function AlbumCard({ album, onClick, showArtist = true }: AlbumCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg hover:shadow-2xl hover:shadow-lime-400/20 transition-all duration-300">
        {album.image ? (
          <img
            src={album.image}
            alt={`${album.title} by ${album.artist}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full transition-transform duration-500 group-hover:scale-110 relative"
            style={{ backgroundColor: album.color }}
          >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-lime-400 rounded-full p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Play className="w-6 h-6 text-black fill-black" />
          </div>
        </div>

        {/* Border glow effect on hover */}
        <div className="absolute inset-0 border-2 border-lime-400 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
      </div>
      
      <h4 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-lime-400 transition-colors">
        {album.title}
      </h4>
      <p className="text-white/60 text-xs truncate">
        {showArtist && album.artist}
        {showArtist && (album.year || album.tracks) && ' • '}
        {album.year && album.year}
        {album.year && album.tracks && ' • '}
        {album.tracks && `${album.tracks} tracks`}
      </p>
    </div>
  );
}