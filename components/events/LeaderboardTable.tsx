"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { type ArtistWithVotes } from "@/types";

interface LeaderboardTableProps {
  artists: ArtistWithVotes[];
}

export function LeaderboardTable({ artists }: LeaderboardTableProps) {
  const getRankIcon = (rank: number | null) => {
    if (!rank) return null;

    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold">{rank}</span>;
    }
  };

  const getRankClass = (rank: number | null) => {
    if (!rank) return "";

    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {artists.map((artist) => {
        const rank = artist.voteStats.rank;
        const totalVotes = artist.voteStats.totalVotes;

        return (
          <Card
            key={artist.id}
            className={`p-6 transition-all duration-300 hover:shadow-lg ${
              rank && rank <= 3 ? `border-2 ${getRankClass(rank)}` : ''
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Rank */}
              <div className="shrink-0 w-12 flex justify-center">
                {getRankIcon(rank)}
              </div>

              {/* Artist Image */}
              <Link href={`/artists/${artist.slug}`} className="shrink-0">
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring ring-border hover:ring-primary transition-all">
                  <Image
                    src={artist.image || artist.profileImage || '/images/default-artist.svg'}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Artist Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/artists/${artist.slug}`} className="hover:underline">
                  <h3 className="font-bold text-lg truncate">
                    {artist.stageName || artist.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{artist.name}</p>
                </Link>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {totalVotes.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">votes</p>
              </div>
            </div>
          </Card>
        );
      })}

      {artists.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No artists in the leaderboard yet</p>
        </div>
      )}
    </div>
  );
}