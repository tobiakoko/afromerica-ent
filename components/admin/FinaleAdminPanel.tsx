'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Trophy,
  Play,
  Pause,
  Eye,
  EyeOff,
  RefreshCw,
  Calculator,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Users,
  Gavel,
  Settings,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import type { FinaleStage, FinaleStatus, FinaleConfig } from '@/types/finale'
import { getStageDisplayName } from '@/types/finale'
import { FinaleOverviewTab } from './finale/FinaleOverviewTab'
import { FinaleJudgesTab } from './finale/FinaleJudgesTab'
import { FinaleContestantsTab } from './finale/FinaleContestantsTab'

interface EventWithFinale {
  id: string
  title: string
  slug: string
  event_date: string
  finale_configs: FinaleConfig[] | null
}

interface FinaleAdminPanelProps {
  events: EventWithFinale[]
}

export function FinaleAdminPanel({ events }: FinaleAdminPanelProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventWithFinale | null>(
    events.find((e) => e.finale_configs && e.finale_configs.length > 0) || null
  )
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const config = selectedEvent?.finale_configs?.[0]

  useEffect(() => {
    if (selectedEvent) {
      fetchStats()
    }
  }, [selectedEvent])

  const fetchStats = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/finale/admin/stats?event_id=${selectedEvent.id}`)
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateConfig = async (updates: Partial<FinaleConfig>) => {
    if (!selectedEvent) return

    setLoading('config')
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          ...updates,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to update configuration')
        return
      }

      toast.success('Configuration updated successfully')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error updating config:', error)
      toast.error('An error occurred while updating configuration')
    } finally {
      setLoading(null)
    }
  }

  const activateStage = async (stage: FinaleStage) => {
    const stageStatus = `${stage}_active` as FinaleStatus
    await updateConfig({
      current_status: stageStatus,
      current_stage: stage,
      voting_enabled: true,
    })
  }

  const calculateTop5 = async () => {
    if (!selectedEvent) return

    setLoading('top5')
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          action: 'calculate_top_5',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to calculate Top 5')
        return
      }

      toast.success('Top 5 finalists calculated successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error calculating Top 5:', error)
      toast.error('An error occurred while calculating Top 5')
    } finally {
      setLoading(null)
    }
  }

  const recalculateLeaderboard = async (stage: FinaleStage) => {
    if (!selectedEvent) return

    setLoading(`leaderboard-${stage}`)
    try {
      const response = await fetch('/api/finale/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
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
      fetchStats()
    } catch (error) {
      console.error('Error recalculating leaderboard:', error)
      toast.error('An error occurred while recalculating leaderboard')
    } finally {
      setLoading(null)
    }
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
            <h3 className="text-lg font-semibold">No Active Events</h3>
            <p className="text-muted-foreground">
              Create an active event first, then run the setup script to configure the finale.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const eventsWithFinale = events.filter((e) => e.finale_configs && e.finale_configs.length > 0)

  if (eventsWithFinale.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
            <h3 className="text-lg font-semibold">No Finale Configured</h3>
            <p className="text-muted-foreground">
              Run the setup script to configure the finale voting system:
            </p>
            <code className="block bg-muted p-4 rounded-lg text-sm">
              npm run setup-finale
            </code>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>Choose an event to manage its finale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {eventsWithFinale.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedEvent?.id === event.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {config && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="stages">
              <Settings className="w-4 h-4 mr-2" />
              Stages & Controls
            </TabsTrigger>
            <TabsTrigger value="contestants">
              <Trophy className="w-4 h-4 mr-2" />
              Contestants
            </TabsTrigger>
            <TabsTrigger value="voters">
              <Gavel className="w-4 h-4 mr-2" />
              Judges & Voters
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <FinaleOverviewTab config={config} stats={stats} />
          </TabsContent>

          {/* Stages & Controls Tab */}
          <TabsContent value="stages" className="mt-6 space-y-6">
            {/* Stage Controls */}
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
                            {isActive && (
                              <Badge variant="default" className="bg-green-500">
                                Active
                              </Badge>
                            )}
                            {isCompleted && !isActive && (
                              <Badge variant="secondary">Completed</Badge>
                            )}
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
                  <h3 className="font-semibold">Top 5 Finalists</h3>
                  <p className="text-sm text-muted-foreground">
                    After Stage 3 is complete, calculate the top 5 finalists based on cumulative scores.
                  </p>
                  <Button
                    onClick={calculateTop5}
                    disabled={loading === 'top5' || !config.stage_3_started_at}
                    size="lg"
                    className="w-full sm:w-auto"
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
                    <p className="text-sm text-green-600">
                      ✓ Calculated on {new Date(config.top_5_calculated_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Stage 4 */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Stage 4: Final Battle</h3>
                  <p className="text-sm text-muted-foreground">
                    The final stage with top 5 finalists. Previous scores are reset.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => activateStage('stage_4')}
                      disabled={loading === 'config' || !config.top_5_calculated_at}
                      size="lg"
                      className="bg-yellow-600 hover:bg-yellow-700"
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

            {/* Voting Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Voting Controls</CardTitle>
                <CardDescription>Enable or disable voting and leaderboard visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voting-enabled">Enable Voting</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow voters to cast their votes
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="leaderboard-visible">Show Leaderboard</Label>
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

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>View public pages for this finale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <a
                      href={`/events/${selectedEvent?.slug}/finale`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Finale Page
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={`/events/${selectedEvent?.slug}/finale/vote`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vote Page
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={`/events/${selectedEvent?.slug}/finale/leaderboard`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leaderboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contestants Tab */}
          <TabsContent value="contestants" className="mt-6">
            <FinaleContestantsTab eventId={selectedEvent.id} />
          </TabsContent>

          {/* Voters Tab */}
          <TabsContent value="voters" className="mt-6">
            <FinaleJudgesTab eventId={selectedEvent.id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
