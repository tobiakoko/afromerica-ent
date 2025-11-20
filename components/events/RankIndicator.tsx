import { ChevronUp, ChevronDown, Minus } from "lucide-react";

type RankChange = "up" | "down" | "same" | "new";

export function getRankChange(
  current: number | null,
  previous: number | null | undefined
): RankChange {
  if (previous === undefined || previous === null) return "new";
  if (current === null) return "same";
  if (current < previous) return "up";
  if (current > previous) return "down";
  return "same";
}

export function RankIndicator({
  rank,
  change,
}: {
  rank: number | null;
  change: RankChange;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-6 text-right tabular-nums">
        {rank ?? "-"}
      </span>
      <div className="flex items-center justify-center">
        {change === "up" && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
            <ChevronUp className="h-3 w-3 text-white" />
          </div>
        )}
        {change === "down" && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
            <ChevronDown className="h-3 w-3 text-white" />
          </div>
        )}
        {(change === "same" || change === "new") && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted">
            <Minus className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

export function getArtistInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}