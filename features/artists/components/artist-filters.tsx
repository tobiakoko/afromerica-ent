'use client';

import type { ArtistGenreFilter } from '../types/artist.types';

interface ArtistFiltersProps {
  activeFilter: ArtistGenreFilter;
  onFilterChange: (filter: ArtistGenreFilter) => void;
}

const FILTER_OPTIONS: { value: ArtistGenreFilter; label: string }[] = [
  { value: 'all', label: 'All Artists' },
  { value: 'afrobeats', label: 'Afrobeats' },
  { value: 'hiphop', label: 'Hip-Hop' },
  { value: 'rnb', label: 'R&B' },
  { value: 'soul', label: 'Soul' },
  { value: 'pop', label: 'Pop' },
];

export function ArtistFilters({ activeFilter, onFilterChange }: ArtistFiltersProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
            activeFilter === option.value
              ? 'bg-lime-400 text-black'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}