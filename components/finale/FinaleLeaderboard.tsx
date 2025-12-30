'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Loader2, Trophy, Medal, Crown } from 'lucide-react'
import Image from 'next/image'
import type {
  FinaleConfig,
  DetailedLeaderboardEntry,
  LeaderboardResponse,
  FinaleStage,
} from '@/types/finale'
import { getStageDisplayName } from '@/types/finale'
import { WinnersCelebration } from './WinnersCelebration'

interface FinaleLeaderboardProps {
  eventId: string
}

export function FinaleLeaderboard({ eventId }: FinaleLeaderboardProps) {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<FinaleConfig | null>(null)
  const [leaderboard, setLeaderboard] = useState<DetailedLeaderboardEntry[]>([])
  const [selectedStage, setSelectedStage] = useState<FinaleStage | 'cumulative' | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchLeaderboard = useCallback(
    async (stage?: FinaleStage | 'cumulative' | null) => {
      try {
        const params = new URLSearchParams({
          event_id: eventId,
          include_breakdown: 'true',
        })

        if (stage && stage !== 'cumulative') {
          params.set('stage', stage)
        }

        const response = await fetch(`/api/finale/leaderboard?${params.toString()}`)

        const data: LeaderboardResponse = await response.json()

        if (!response.ok || !data.success) {
          toast.error(data.message || 'Failed to fetch leaderboard')
          return
        }

        if (data.config) {
          setConfig(data.config)
          if (selectedStage === null && data.config.current_stage) {
            setSelectedStage(data.config.current_stage)
          }
        }

        if (data.leaderboard) {
          setLeaderboard(data.leaderboard)
        }

        if (data.last_updated) {
          setLastUpdated(data.last_updated)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        toast.error('Failed to fetch leaderboard data')
      }
    },
    [eventId, selectedStage]
  )

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      await fetchLeaderboard()
      if (isMounted) {
        setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [eventId, fetchLeaderboard])

  // Set up real-time subscription with fallback polling
  useEffect(() => {
    if (!config || !autoRefresh) return

    // Real-time subscription for instant updates
    const channel = supabase
      .channel(`finale-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'finale_leaderboard_snapshots',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          const stageParam =
            selectedStage && selectedStage !== 'cumulative' ? selectedStage : undefined
          fetchLeaderboard(stageParam || null)
        }
      )
      .subscribe()

    // Fallback polling every 30 seconds (in case real-time fails)
    const interval = setInterval(() => {
      const stageParam =
        selectedStage && selectedStage !== 'cumulative' ? selectedStage : undefined
      fetchLeaderboard(stageParam || null)
    }, 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [eventId, config, autoRefresh, selectedStage, supabase, fetchLeaderboard])

  const handleStageChange = (stage: FinaleStage | 'cumulative') => {
    setSelectedStage(stage)
    const stageParam = stage === 'cumulative' ? null : stage
    fetchLeaderboard(stageParam)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!config) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">Finale configuration not found.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentStage =
    selectedStage === 'cumulative' ? config.current_stage : selectedStage || config.current_stage
  const isStage4 = currentStage === 'stage_4'
  const isCompleted = config.current_status === 'completed'

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
    if (rank === 2)
      return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />
    if (rank === 3)
      return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
  }

  const getTop5Indicator = (rank: number) => {
    if (rank <= 5 && !isStage4) {
      return (
        <Badge variant="secondary" className="bg-green-500 text-white">
          Top 5
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Status and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                {currentStage && getStageDisplayName(currentStage)}
              </CardTitle>
              <CardDescription>
                {isStage4
                  ? 'Final Battle - Top 5 Finalists'
                  : 'Cumulative Scores from All Completed Stages'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={config.voting_enabled ? 'default' : 'secondary'}>
                {config.voting_enabled ? 'Voting Active' : 'Voting Closed'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Pause Updates' : 'Resume Updates'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Winners Celebration - Show when finale is completed */}
      {isCompleted && isStage4 && (
        <WinnersCelebration winners={leaderboard.filter(w => w.rank <= 3)} />
      )}

      {/* Stage Selector (for Stages 1-3) */}
      {!isStage4 && (
        <Card>
          <CardHeader>
            <CardTitle>View By Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={(selectedStage || config.current_stage || 'cumulative') as string}
              onValueChange={(value) =>
                handleStageChange(value as FinaleStage | 'cumulative')
              }
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="stage_1">Stage 1</TabsTrigger>
                <TabsTrigger value="stage_2">Stage 2</TabsTrigger>
                <TabsTrigger value="stage_3">Stage 3</TabsTrigger>
                <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Standings</CardTitle>
            <p className="text-xs text-muted-foreground">
              Last updated:{' '}
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Contestant</TableHead>
                  <TableHead className="text-right">Judge Score</TableHead>
                  {!isStage4 && <TableHead className="text-right">Online Votes</TableHead>}
                  <TableHead className="text-right">Total Score</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isStage4 ? 5 : 6} className="text-center text-muted-foreground">
                      No data available yet. Voting may not have started.
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((entry) => (
                    <TableRow
                      key={entry.contestant.id}
                      className={
                        entry.rank <= 3
                          ? 'bg-yellow-50 dark:bg-yellow-950/20'
                          : entry.rank === 5 && !isStage4
                          ? 'border-b-4 border-green-500'
                          : ''
                      }
                    >
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {entry.artist?.photo_url && (
                            <Image
                              src={entry.artist.photo_url}
                              alt={entry.artist.name || 'Contestant'}
                              className="w-10 h-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                          )}
                          <div>
                            <p className="font-semibold">
                              #{entry.contestant.contestant_number}{' '}
                              {entry.artist?.stage_name || entry.artist?.name || 'Unknown Artist'}
                            </p>
                            {entry.artist?.stage_name && (
                              <p className="text-xs text-muted-foreground">
                                {entry.artist.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">
                            {entry.scores.judge_score_weighted.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            / {isStage4 ? '100' : '60'} (
                            {((entry.scores.judge_score_weighted / (isStage4 ? 100 : 60)) * 100).toFixed(
                              1
                            )}
                            %)
                          </p>
                        </div>
                      </TableCell>
                      {!isStage4 && (
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">
                              {entry.scores.online_score_weighted.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.scores.online_votes} votes (
                              {((entry.scores.online_score_weighted / 40) * 100).toFixed(
                                1
                              )}
                              %)
                            </p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <p className="text-lg font-bold">
                          {entry.scores.total_score.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">/ 100</p>
                      </TableCell>
                      <TableCell>{getTop5Indicator(entry.rank)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isStage4 && leaderboard.length >= 5 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-500">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                The line above shows the Top 5 cutoff. Only the top 5 contestants will
                advance to Stage 4 (Final Battle).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scoring Breakdown Info */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {isStage4 ? (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Judges (100%)
              </p>
              <p className="text-2xl font-bold">100 pts</p>
              <p className="text-xs text-muted-foreground mt-1">
                3 judges × 20 points each (max 60), normalized to 100
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Judges (60%)
                </p>
                <p className="text-2xl font-bold">60 pts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 judges × stage-specific points
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Online Viewers (40%)
                </p>
                <p className="text-2xl font-bold">40 pts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Proportional to votes received
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
