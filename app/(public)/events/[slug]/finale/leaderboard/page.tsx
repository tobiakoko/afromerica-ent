import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { notFound } from 'next/navigation'
import { FinaleLeaderboard } from '@/components/finale/FinaleLeaderboard'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface FinaleLeaderboardPageProps {
  params: Promise<{ slug: string }>
}

export default async function FinaleLeaderboardPage({
  params,
}: FinaleLeaderboardPageProps) {
  const { slug } = await params
  const supabase = createCachedClient()

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select('id, title, slug, event_date, venue, city')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !event) {
    notFound()
  }

  // Check if finale is configured for this event
  const { data: finaleConfig, error: finaleError } = await supabase
    .from('finale_configs')
    .select('*')
    .eq('event_id', event.id)
    .single()

  if (finaleError) {
    console.error('Error fetching finale config:', {
      eventId: event.id,
      message: finaleError.message,
      code: finaleError.code,
      details: finaleError.details,
    })
  }

  if (!finaleConfig) {
    return (
      <div className="min-h-screen">
        <PageHero
          title="Grand Finale Leaderboard"
          description="Live standings and scores"
          badge={event.title}
          badgeHref={`/events/${slug}`}
        />

        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
                <h3 className="text-lg font-semibold">Finale Not Configured</h3>
                <p className="text-muted-foreground">
                  The finale voting system has not been set up for this event yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Grand Finale Leaderboard"
        description="Live standings and scores from all stages"
        badge={event.title}
        badgeHref={`/events/${slug}`}
      />

      <div className="container mx-auto px-4 py-8">
        <FinaleLeaderboard eventId={event.id} />
      </div>
    </div>
  )
}
