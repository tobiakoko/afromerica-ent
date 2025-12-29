'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, LayoutDashboard, Trophy, Gavel, Settings } from 'lucide-react'
import type { FinaleConfig } from '@/types/finale'
import { FinaleOverviewTab } from './finale/FinaleOverviewTab'
import { FinaleJudgesTab } from './finale/FinaleJudgesTab'
import { FinaleContestantsTab } from './finale/FinaleContestantsTab'
import { FinaleControlTab } from './finale/FinaleControlTab'

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
  // Normalize events to ensure finale_configs is always an array
  const normalizedEvents = events.map((e) => ({
    ...e,
    finale_configs: Array.isArray(e.finale_configs)
      ? e.finale_configs
      : e.finale_configs && (e.finale_configs as any).id
      ? [e.finale_configs as any]
      : null,
  }))

  const [selectedEvent, setSelectedEvent] = useState<EventWithFinale | null>(
    normalizedEvents.find((e) => e.finale_configs && e.finale_configs.length > 0) || null
  )
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const config = selectedEvent?.finale_configs?.[0]

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

  useEffect(() => {
    if (!selectedEvent) return

    let cancelled = false

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/finale/admin/stats?event_id=${selectedEvent.id}`)
        const data = await response.json()

        if (!cancelled && data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching stats:', error)
        }
      }
    }

    loadStats()

    return () => {
      cancelled = true
    }
  }, [selectedEvent])

  if (normalizedEvents.length === 0) {
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

  // Show all events, but highlight those with finale configs
  const eventsWithFinale = normalizedEvents.filter((e) => e.finale_configs && e.finale_configs.length > 0)
  const eventsWithoutFinale = normalizedEvents.filter((e) => !e.finale_configs || e.finale_configs.length === 0)

  return (
    <div className="space-y-6">
      {/* Event Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>
            {eventsWithFinale.length > 0
              ? `Choose an event to manage its finale (${eventsWithFinale.length} configured)`
              : 'No finale configured yet - run setup script'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsWithFinale.length > 0 ? (
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
                  {event.finale_configs?.[0] && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Status: {event.finale_configs[0].current_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Finale Configured</h3>
                <p className="text-muted-foreground mb-4">
                  Run the setup script to configure the finale voting system for your events:
                </p>
                <code className="block bg-muted p-4 rounded-lg text-sm max-w-md mx-auto">
                  npm run setup-finale
                </code>
              </div>
              {eventsWithoutFinale.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Available events ({eventsWithoutFinale.length}):
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {eventsWithoutFinale.map((event) => (
                      <span key={event.id} className="px-3 py-1 rounded-full bg-muted text-sm">
                        {event.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
          <TabsContent value="stages" className="mt-6">
            <FinaleControlTab
              eventId={selectedEvent!.id}
              config={config}
              onUpdate={() => {
                fetchStats()
                setTimeout(() => window.location.reload(), 1000)
              }}
            />
          </TabsContent>

          {/* Contestants Tab */}
          <TabsContent value="contestants" className="mt-6">
            <FinaleContestantsTab eventId={selectedEvent!.id} />
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
