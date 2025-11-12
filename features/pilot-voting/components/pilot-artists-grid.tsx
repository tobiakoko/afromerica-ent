'use client';

import { useQuery } from '@tanstack/react-query';
import { PilotArtistCard } from './pilot-artists-card';
import { getPilotArtists } from '../api/pilot-voting.api';
import type { PilotArtist, VotePackage } from '../types/voting.types';

interface PilotArtistsGridProps {
  initialArtists: PilotArtist[];
  packages: VotePackage[];
}

export function PilotArtistsGrid({ initialArtists, packages }: PilotArtistsGridProps) {
  // Fetch artists with real-time updates
  const { data } = useQuery({
    queryKey: ['pilot-artists'],
    queryFn: getPilotArtists,
    initialData: { data: initialArtists, stats: {} as any },
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000,
  });

  const artists = data?.data || initialArtists;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artists.map((artist) => (
        <PilotArtistCard key={artist.id} artist={artist} /> // packages={packages} />
      ))}
    </div>
  );
}