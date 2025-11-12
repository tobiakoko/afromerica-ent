"use client";
 
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import type { PilotVotingStats } from "../types/voting.types";
 
interface VotingStatsProps {
  stats: PilotVotingStats;
}
 
export function VotingStats({ stats }: VotingStatsProps) {
  const statItems = [
    {
      label: "Total Votes",
      value: stats.totalVotes.toLocaleString(),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Unique Voters",
      value: stats.uniqueVoters.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Time Remaining",
      value: stats.timeRemaining,
      icon: Clock,
      color: "text-orange-600",
    },
  ];
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-accent ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}