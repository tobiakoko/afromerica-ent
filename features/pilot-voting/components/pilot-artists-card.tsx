"use client";
 
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import type { PilotArtist } from "../types/voting.types";
 
interface PilotArtistCardProps {
  artist: PilotArtist;
  showVoteButton?: boolean;
  onVote?: (artist: PilotArtist) => void;
}
 
export function PilotArtistCard({ artist, showVoteButton = true, onVote }: PilotArtistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-purple-500/10">
        <Image
          src={artist.image}
          alt={artist.stageName}
          fill
          className="object-cover"
        />
        {artist.rank <= 3 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yellow-500 text-black">
              <Trophy className="h-3 w-3 mr-1" />
              Rank #{artist.rank}
            </Badge>
          </div>
        )}
        {artist.rank > 3 && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">
              Rank #{artist.rank}
            </Badge>
          </div>
        )}
      </div>
 
      <CardHeader>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{artist.stageName}</h3>
          <p className="text-sm text-muted-foreground">{artist.name}</p>
          <div className="flex flex-wrap gap-1">
            {artist.genre.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
 
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-primary">
            <TrendingUp className="h-4 w-4" />
            <span className="font-semibold">{artist.totalVotes.toLocaleString()} votes</span>
          </div>
        </div>
 
        <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
 
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/pilot-voting/${artist.slug}`}>
              View Profile
            </Link>
          </Button>
          {showVoteButton && onVote && (
            <Button className="flex-1" onClick={() => onVote(artist)}>
              Vote Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}