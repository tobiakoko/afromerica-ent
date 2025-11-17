import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

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
      featured?: boolean;
    };
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const genres = (artist.genre as string[]) || [];

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={artist.photo_url || '/images/default-artist.jpg'}
            alt={artist.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {artist.featured && (
            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{artist.name}</h3>
          {artist.stage_name && (
            <p className="text-sm text-muted-foreground mb-2">&quot;{artist.stage_name}&quot;</p>
          )}
          {genres.length > 0 && (
            <p className="text-xs text-muted-foreground truncate">
              {genres.slice(0, 2).join(', ')}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}