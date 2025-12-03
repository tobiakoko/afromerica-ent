"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ArtistWithVotes } from "@/types";
import { getArtistInitials, getRankChange, RankIndicator } from "./RankIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";


interface LeaderboardProps {
  artists: ArtistWithVotes[];
  lastUpdated?: Date | string;
  onArtistClick?: (artist: ArtistWithVotes) => void;
  enableNavigation?: boolean;
  eventSlug?: string;
}

function LeaderboardRowContent({
  artist,
  enableNavigation,
  eventSlug,
}: {
  artist: ArtistWithVotes;
  enableNavigation?: boolean;
  eventSlug?: string;
}) {
  const { voteStats } = artist;
  const rankChange = getRankChange(voteStats.rank, voteStats.previousRank);
  const displayName = artist.stageName || artist.name;
  const imageUrl = artist.profileImage || artist.image;

  const cellContent = (content: React.ReactNode) => {
    if (enableNavigation) {
      return (
        <Link href={`/artists/${artist.slug}`} className="block">
          {content}
        </Link>
      );
    }
    return content;
  };

  return (
    <>
      <TableCell className="w-16 sm:w-20">
        {cellContent(<RankIndicator rank={voteStats.rank} change={rankChange} />)}
      </TableCell>

      <TableCell>
        {cellContent(
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-10 w-10 sm:h-14 sm:w-14 ring-2 ring-border">
              <AvatarImage
                src={imageUrl}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-xs sm:text-sm font-semibold">
                {getArtistInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs sm:text-sm truncate">
                  {displayName}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {artist.name}
              </p>
            </div>
          </div>
        )}
      </TableCell>

      <TableCell className="text-right tabular-nums">
        {cellContent(
          <p className="font-bold text-sm sm:text-base">
            {voteStats.totalVotes.toLocaleString()}
          </p>
        )}
      </TableCell>

      <TableCell className="text-center">
        {eventSlug ? (
          <Button size="sm" asChild className="h-8 px-2 sm:px-4">
            <Link href={`/events/${eventSlug}/vote?artist=${artist.slug}`}>
              <Vote className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>Vote</span>
            </Link>
          </Button>
        ) : (
          <Button size="sm" disabled className="h-8 px-2 sm:px-4">
            <Vote className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>Vote</span>
          </Button>
        )}
      </TableCell>
    </>
  );
}

export function Leaderboard({
  artists,
  lastUpdated,
  onArtistClick,
  enableNavigation = true,
  eventSlug,
}: LeaderboardProps) {
  const lastUpdateDate = lastUpdated ? (typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated) : null;

  const sortedArtists = [...artists].sort((a, b) => {
    if (a.voteStats.rank === null) return 1;
    if (b.voteStats.rank === null) return -1;
    return a.voteStats.rank - b.voteStats.rank;
  });

  const handleRowClick = (artist: ArtistWithVotes) => {
    onArtistClick?.(artist);
  };

  return (
    <Card>
      {lastUpdateDate && (
        <CardHeader className="py-3 px-4 border-b">
          <p className="text-xs text-muted-foreground">
            Last updated:{" "}
            <span className="text-foreground font-medium">
              {lastUpdateDate.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              at{" "}
              {lastUpdateDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
            (local time)
          </p>
        </CardHeader>
      )}

      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-16 sm:w-20 text-xs font-medium uppercase tracking-wider">
                Rank
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider min-w-[180px]">
                Artist
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-20 sm:w-28">
                Total
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider w-24 sm:w-32">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedArtists.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No artists in the leaderboard yet
                </TableCell>
              </TableRow>
            ) : (
              sortedArtists.map((artist) => {
                return (
                  <TableRow
                    key={artist.id}
                    className={cn(
                      (enableNavigation || onArtistClick) && "cursor-pointer",
                      "hover:bg-muted/30 transition-colors"
                    )}
                    onClick={() => handleRowClick(artist)}
                  >
                    <LeaderboardRowContent
                      artist={artist}
                      enableNavigation={enableNavigation}
                      eventSlug={eventSlug}
                    />
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}