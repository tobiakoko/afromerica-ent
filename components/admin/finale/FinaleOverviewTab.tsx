'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, CheckCircle2, Clock, Users, TrendingUp } from 'lucide-react'
import type { FinaleConfig } from '@/types/finale'
import { getStageDisplayName } from '@/types/finale'

interface FinaleOverviewTabProps {
  config: FinaleConfig
  stats?: {
    stage_stats: Record<string, any>
    voter_stats: Record<string, any>
  }
}

export function FinaleOverviewTab({ config, stats }: FinaleOverviewTabProps) {
  const currentStageVotes = stats?.stage_stats[config.current_stage || 'stage_1']

  return (
    <div className="space-y-6">
      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                config.voting_enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <p className="text-2xl font-bold capitalize">
                {config.current_status.replace(/_/g, ' ')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <p className="text-2xl font-bold">
                {config.current_stage ? getStageDisplayName(config.current_stage).split(':')[0] : 'Not Started'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Voting Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {config.voting_enabled ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-2xl font-bold text-gray-600">Closed</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {config.top_5_calculated_at ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-2xl font-bold text-green-600">Calculated</p>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-2xl font-bold text-gray-600">Pending</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Stage Timeline
          </CardTitle>
          <CardDescription>Track the progress through each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(['stage_1', 'stage_2', 'stage_3', 'stage_4'] as const).map((stage, index) => {
              const started = config[`${stage}_started_at` as keyof FinaleConfig]
              const ended = config[`${stage}_ended_at` as keyof FinaleConfig]
              const isActive = config.current_stage === stage
              const stageNum = index + 1

              return (
                <div key={stage} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background">
                    {ended ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : started ? (
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">{stageNum}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">
                        {getStageDisplayName(stage)}
                      </h4>
                      {isActive && (
                        <Badge className="bg-blue-500">Active</Badge>
                      )}
                      {ended && !isActive && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {started
                        ? `Started: ${new Date(started as string).toLocaleString()}`
                        : 'Not started yet'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Stage Voting Stats */}
      {config.current_stage && currentStageVotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Current Stage Voting Statistics
            </CardTitle>
            <CardDescription>
              Real-time vote counts for {getStageDisplayName(config.current_stage)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Judge Votes</p>
                <p className="text-3xl font-bold">{currentStageVotes.judge_votes || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weight: 60%
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">In-House Votes</p>
                <p className="text-3xl font-bold">{currentStageVotes.in_house_votes || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weight: 25%
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Online Votes</p>
                <p className="text-3xl font-bold">{currentStageVotes.online_votes || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weight: 15%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Voter Participation */}
      {stats?.voter_stats && (
        <Card>
          <CardHeader>
            <CardTitle>Voter Participation Summary</CardTitle>
            <CardDescription>Track voter engagement across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Judges</p>
                  <p className="text-2xl font-bold">{stats.voter_stats.judges?.total || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">60% weight</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">In-House</p>
                  <p className="text-2xl font-bold">{stats.voter_stats.in_house?.total || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">25% weight</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Online</p>
                  <p className="text-2xl font-bold">{stats.voter_stats.online?.total || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">15% weight</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Important Timestamps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {config.top_5_calculated_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top 5 Calculated:</span>
                <span className="font-medium">{new Date(config.top_5_calculated_at).toLocaleString()}</span>
              </div>
            )}
            {config.stage_4_started_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Battle Started:</span>
                <span className="font-medium">{new Date(config.stage_4_started_at).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">{new Date(config.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
