'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Play,
  Pause,
  Eye,
  EyeOff,
  RefreshCw,
  Calculator,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import type { FinaleConfig, FinaleStage } from '@/types/finale'
import { getStageDisplayName } from '@/types/finale'

interface FinaleControlTabProps {
  eventId: string
  config: FinaleConfig
  onUpdate: () => void
}

export function FinaleControlTab({ eventId, config, onUpdate }: FinaleControlTabProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const updateConfig = async (updates: Partial<FinaleConfig>) => {
    setLoading('config')
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          ...updates,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to update configuration')
        return
      }

      toast.success('Configuration updated successfully')
      onUpdate()
    } catch (error) {
      console.error('Error updating config:', error)
      toast.error('An error occurred while updating configuration')
    } finally {
      setLoading(null)
    }
  }

  const activateStage = async (stage: FinaleStage) => {
    const stageStatus = `${stage}_active` as any
    await updateConfig({
      current_status: stageStatus,
      current_stage: stage,
      voting_enabled: true,
    })
  }

  const calculateTop5 = async () => {
    setLoading('top5')
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          action: 'calculate_top_5',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to calculate Top 5')
        return
      }

      toast.success('Top 5 finalists calculated successfully!')
      onUpdate()
    } catch (error) {
      console.error('Error calculating Top 5:', error)
      toast.error('An error occurred while calculating Top 5')
    } finally {
      setLoading(null)
    }
  }

  const recalculateLeaderboard = async (stage: FinaleStage) => {
    setLoading(`leaderboard-${stage}`)
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          action: 'recalculate_leaderboard',
          stage,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to recalculate leaderboard')
        return
      }

      toast.success(`${getStageDisplayName(stage)} leaderboard recalculated!`)
    } catch (error) {
      console.error('Error recalculating leaderboard:', error)
      toast.error('An error occurred while recalculating leaderboard')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Controls</CardTitle>
          <CardDescription>Enable/disable voting and leaderboard visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="voting-enabled" className="text-base font-semibold">
                  Enable Voting
                </Label>
                {config.voting_enabled ? (
                  <Badge className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Allow voters to cast their votes for the current stage
              </p>
            </div>
            <Switch
              id="voting-enabled"
              checked={config.voting_enabled}
              onCheckedChange={(checked) => updateConfig({ voting_enabled: checked })}
              disabled={loading === 'config'}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="leaderboard-visible" className="text-base font-semibold">
                  Show Leaderboard
                </Label>
                {config.leaderboard_visible ? (
                  <Badge className="bg-blue-500">Visible</Badge>
                ) : (
                  <Badge variant="secondary">Hidden</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Make the leaderboard visible to the public
              </p>
            </div>
            <Switch
              id="leaderboard-visible"
              checked={config.leaderboard_visible}
              onCheckedChange={(checked) => updateConfig({ leaderboard_visible: checked })}
              disabled={loading === 'config'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage Management */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Management</CardTitle>
          <CardDescription>Activate stages and manage progression</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stages 1-3 */}
          <div className="space-y-3">
            <h3 className="font-semibold">Stages 1-3: Initial Rounds</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {(['stage_1', 'stage_2', 'stage_3'] as FinaleStage[]).map((stage) => {
                const stageNum = parseInt(stage.split('_')[1])
                const isActive = config.current_stage === stage
                const isCompleted = config[`${stage}_started_at` as keyof FinaleConfig]

                return (
                  <div key={stage} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Stage {stageNum}</span>
                      {isActive && <Badge variant="default" className="bg-green-500">Active</Badge>}
                      {isCompleted && !isActive && <Badge variant="secondary">Completed</Badge>}
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => activateStage(stage)}
                        disabled={loading === 'config'}
                        size="sm"
                        className="w-full"
                        variant={isActive ? 'outline' : 'default'}
                      >
                        {isActive ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-2" />
                            Reactivate
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => recalculateLeaderboard(stage)}
                        disabled={loading === `leaderboard-${stage}`}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        {loading === `leaderboard-${stage}` ? (
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        ) : (
                          <Calculator className="w-3 h-3 mr-2" />
                        )}
                        Recalculate
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Top 5 Calculation */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Calculate Top 5 Finalists
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                  After Stage 3 is complete, calculate the top 5 finalists based on cumulative scores from all three stages. This will mark contestants as finalists for Stage 4.
                </p>
                <Button
                  onClick={calculateTop5}
                  disabled={loading === 'top5' || !config.stage_3_started_at}
                  size="lg"
                  className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
                >
                  {loading === 'top5' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Top 5 Finalists
                    </>
                  )}
                </Button>
                {config.top_5_calculated_at && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Calculated on {new Date(config.top_5_calculated_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Stage 4 */}
          <div className="space-y-3">
            <h3 className="font-semibold">Stage 4: Final Battle</h3>
            <p className="text-sm text-muted-foreground">
              The final stage with top 5 finalists. Previous scores are reset and fresh voting begins.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => activateStage('stage_4')}
                disabled={loading === 'config' || !config.top_5_calculated_at}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {config.current_stage === 'stage_4' ? 'Reactivate Stage 4' : 'Start Final Battle'}
              </Button>
              <Button
                onClick={() => recalculateLeaderboard('stage_4')}
                disabled={loading === 'leaderboard-stage_4' || !config.stage_4_started_at}
                size="lg"
                variant="outline"
              >
                {loading === 'leaderboard-stage_4' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="w-4 h-4 mr-2" />
                )}
                Recalculate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Public Links</CardTitle>
          <CardDescription>View how voters see the finale pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={`/events/${eventId}/finale/vote`} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Voting Page
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`/events/${eventId}/finale/leaderboard`} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Leaderboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
