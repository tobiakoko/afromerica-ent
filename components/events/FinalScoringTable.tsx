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
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown } from "lucide-react";

interface FinalScoringTableProps {
  artists: ArtistWithVotes[];
  lastUpdated?: Date | string;
  enableNavigation?: boolean;
}

function FinalScoringRowContent({
  artist,
  enableNavigation,
  isTop10,
}: {
  artist: ArtistWithVotes;
  enableNavigation?: boolean;
  isTop10: boolean;
}) {
  const { voteStats, finalScores } = artist;
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
        {cellContent(
          <div className="flex items-center gap-1">
            <RankIndicator rank={finalScores?.final_rank ?? voteStats.rank} change={rankChange} />
            {isTop10 && (
              <Crown className="w-4 h-4 text-yellow-500 ml-1" />
            )}
          </div>
        )}
      </TableCell>

      <TableCell>
        {cellContent(
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className={cn(
              "h-10 w-10 sm:h-14 sm:w-14 ring-2",
              isTop10 ? "ring-yellow-500" : "ring-border"
            )}>
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
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm truncate">
                  {displayName}
                </span>
                {isTop10 && (
                  <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    Top 10
                  </Badge>
                )}
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
          <p className="font-semibold text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            {finalScores?.paid_score.toFixed(2) ?? '0.00'}
          </p>
        )}
      </TableCell>

      <TableCell className="text-right tabular-nums">
        {cellContent(
          <p className="font-semibold text-xs sm:text-sm text-green-700 dark:text-green-300">
            {finalScores?.public_score.toFixed(2) ?? '0.00'}
          </p>
        )}
      </TableCell>

      <TableCell className="text-right tabular-nums">
        {cellContent(
          <p className="font-semibold text-xs sm:text-sm text-purple-700 dark:text-purple-300">
            {finalScores?.judges_score.toFixed(2) ?? '0.00'}
          </p>
        )}
      </TableCell>

      <TableCell className="text-right tabular-nums">
        {cellContent(
          <p className="font-semibold text-xs sm:text-sm text-orange-700 dark:text-orange-300">
            {finalScores?.performance_score.toFixed(2) ?? '0.00'}
          </p>
        )}
      </TableCell>

      <TableCell className="text-right tabular-nums">
        {cellContent(
          <div className="flex items-center justify-end gap-1">
            <p className="font-bold text-sm sm:text-base">
              {finalScores?.total_score.toFixed(2) ?? '0.00'}
            </p>
            {isTop10 && <Trophy className="w-4 h-4 text-yellow-500" />}
          </div>
        )}
      </TableCell>
    </>
  );
}

export function FinalScoringTable({
  artists,
  lastUpdated,
  enableNavigation = true,
}: FinalScoringTableProps) {
  const lastUpdateDate = lastUpdated ? (typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated) : null;

  // Sort by final rank
  const sortedArtists = [...artists].sort((a, b) => {
    const rankA = a.finalScores?.final_rank ?? a.voteStats.rank ?? 999;
    const rankB = b.finalScores?.final_rank ?? b.voteStats.rank ?? 999;
    return rankA - rankB;
  });

  // Determine top 10 based on public score
  const artistsWithPublicScores = sortedArtists
    .filter(a => (a.finalScores?.public_score ?? 0) > 0)
    .sort((a, b) => (b.finalScores?.public_score ?? 0) - (a.finalScores?.public_score ?? 0))
    .slice(0, 10);

  const top10Ids = new Set(artistsWithPublicScores.map(a => a.id));

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
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-20 sm:w-24">
                <div className="flex flex-col items-end">
                  <span>Paid</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(35%)</span>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-20 sm:w-24">
                <div className="flex flex-col items-end">
                  <span>Public</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(10%)</span>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-20 sm:w-24">
                <div className="flex flex-col items-end">
                  <span>Judges</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(30%)</span>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-24 sm:w-28">
                <div className="flex flex-col items-end">
                  <span>Performance</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(25%)</span>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider w-24 sm:w-32">
                Total Score
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedArtists.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No artists in the leaderboard yet
                </TableCell>
              </TableRow>
            ) : (
              sortedArtists.map((artist) => {
                const isTop10 = top10Ids.has(artist.id);
                return (
                  <TableRow
                    key={artist.id}
                    className={cn(
                      enableNavigation && "cursor-pointer",
                      "hover:bg-muted/30 transition-colors",
                      isTop10 && "bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-100/50 dark:hover:bg-yellow-950/30"
                    )}
                  >
                    <FinalScoringRowContent
                      artist={artist}
                      enableNavigation={enableNavigation}
                      isTop10={isTop10}
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
