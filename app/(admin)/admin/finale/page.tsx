import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { FinaleAdminPanel } from '@/components/admin/FinaleAdminPanel'
import type { FinaleConfig } from '@/types/finale'

interface EventWithFinale {
  id: string
  title: string
  slug: string
  event_date: string
  finale_configs: FinaleConfig[] | null
  artist_count?: number
  voter_count?: number
}

export const dynamic = 'force-dynamic'

export default async function FinaleAdminPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Check if user is admin using admin client to bypass RLS
  const adminClient = createAdminClient()
  const { data: admin } = await adminClient
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .single()

  if (!admin) {
    redirect('/signin')
  }

  // Fetch all active events with finale configs using admin client
  // Note: Using explicit foreign key relationship for PostgREST join
  const { data: events, error: eventsError } = await adminClient
    .from('events')
    .select(
      `
      id,
      title,
      slug,
      event_date,
      finale_configs!finale_configs_event_id_fkey (
        id,
        event_id,
        current_status,
        current_stage,
        voting_enabled,
        leaderboard_visible,
        stage_1_started_at,
        stage_1_ended_at,
        stage_2_started_at,
        stage_2_ended_at,
        stage_3_started_at,
        stage_3_ended_at,
        stage_4_started_at,
        stage_4_ended_at,
        top_5_calculated_at,
        top_5_contestant_ids,
        settings,
        created_at,
        updated_at
      )
    `
    )
    .eq('is_active', true)
    .order('event_date', { ascending: false })

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
    console.error('Error details:', JSON.stringify(eventsError, null, 2))
  }

  // Fetch artist counts per event
  const { data: artistCounts } = await adminClient
    .from('artists')
    .select('event_id')

  // Fetch voter counts per event
  const { data: voterCounts } = await adminClient
    .from('finale_voters')
    .select('event_id')

  const artistCountMap =
    artistCounts?.reduce<Record<string, number>>((acc, row) => {
      if (row.event_id) {
        acc[row.event_id] = (acc[row.event_id] || 0) + 1
      }
      return acc
    }, {}) || {}

  const voterCountMap =
    voterCounts?.reduce<Record<string, number>>((acc, row) => {
      if (row.event_id) {
        acc[row.event_id] = (acc[row.event_id] || 0) + 1
      }
      return acc
    }, {}) || {}

  const eventsWithCounts =
    (events as EventWithFinale[] | null)?.map((event) => ({
      ...event,
      artist_count: artistCountMap[event.id] ?? 0,
      voter_count: voterCountMap[event.id] ?? 0,
    })) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finale Voting Management</h1>
        <p className="text-muted-foreground">
          Manage finale voting stages and configurations for your events
        </p>
      </div>

      {eventsError && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-semibold">Error loading events:</p>
          <p className="text-sm">{eventsError.message}</p>
          <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(eventsError, null, 2)}</pre>
        </div>
      )}

      <FinaleAdminPanel events={eventsWithCounts} />
    </div>
  )
}
