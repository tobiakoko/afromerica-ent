"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp } from "lucide-react";
import type { PilotArtist } from "../types/voting.types";

interface LeaderboardProps {
  artists: PilotArtist[];
  limit?: number;
}

export function Leaderboard({ artists, limit = 10 }: LeaderboardProps) {
  const topArtists = artists.slice(0, limit);
  const totalVotes = artists.reduce((sum, artist) => sum + artist.totalVotes, 0);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topArtists.map((artist) => {
          const percentage = totalVotes > 0 ? (artist.totalVotes / totalVotes) * 100 : 0;

          return (
            <Link
              key={artist.id}
              href={`/pilot-voting/${artist.slug}`}
              className="block group"
            >
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                <div className={`text-2xl font-bold min-w-[2rem] ${getRankColor(artist.rank)}`}>
                  #{artist.rank}
                </div>

                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={artist.image}
                    alt={artist.stageName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {artist.stageName}
                    </h4>
                    {artist.rank <= 3 && (
                      <Badge variant="secondary" className="shrink-0">
                        <Trophy className="h-3 w-3 mr-1" />
                        Top {artist.rank}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{artist.totalVotes.toLocaleString()} votes</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
