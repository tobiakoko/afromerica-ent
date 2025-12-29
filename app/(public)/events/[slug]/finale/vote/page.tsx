import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { notFound, redirect } from 'next/navigation'
import { VoterAuthForm } from '@/components/finale/VoterAuthForm'

export const dynamic = 'force-dynamic'

interface VotePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function VotePage({ params, searchParams }: VotePageProps) {
  const { slug } = await params
  const { token } = await searchParams
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
  const { data: finaleConfig } = await supabase
    .from('finale_configs')
    .select('*')
    .eq('event_id', event.id)
    .single()

  if (!finaleConfig) {
    redirect(`/events/${slug}/finale`)
  }

  // If user has a token, redirect them to the appropriate voting page
  if (token) {
    // Token validation will happen in the voting page
    redirect(`/events/${slug}/finale/vote/submit?token=${token}`)
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Finale Voting Authentication"
        description="Enter your details to cast your vote"
        badge={event.title}
        badgeHref={`/events/${slug}`}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <VoterAuthForm eventId={event.id} eventSlug={slug} />
        </div>
      </div>
    </div>
  )
}
