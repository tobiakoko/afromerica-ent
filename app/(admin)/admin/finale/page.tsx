import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { FinaleAdminPanel } from '@/components/admin/FinaleAdminPanel'

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

  // Fetch all events with finale configs
  const { data: events } = await supabase
    .from('events')
    .select(
      `
      id,
      title,
      slug,
      event_date,
      finale_configs (
        id,
        current_status,
        current_stage,
        voting_enabled,
        leaderboard_visible,
        top_5_calculated_at,
        stage_1_started_at,
        stage_2_started_at,
        stage_3_started_at,
        stage_4_started_at
      )
    `
    )
    .eq('is_active', true)
    .order('event_date', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finale Voting Management</h1>
        <p className="text-muted-foreground">
          Manage finale voting stages and configurations for your events
        </p>
      </div>

      <FinaleAdminPanel events={events || []} />
    </div>
  )
}
