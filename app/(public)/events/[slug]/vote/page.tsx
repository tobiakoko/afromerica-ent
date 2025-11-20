/**
 * Vote Page
 * Allows users to vote for their favorite artists
 */

import { createCachedClient } from '@/utils/supabase/server-cached'
import { VotingForm } from '@/components/forms/VoteForm'
import { PageHero } from '@/components/layout/page-hero'
import { Card, CardContent } from '@/components/ui/card'
import { Vote as VoteIcon } from 'lucide-react'

// Enable ISR with 30-second revalidation
export const revalidate = 30

interface VotePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ artist?: string }>
}

export default async function VotePage({ params, searchParams }: VotePageProps) {
  const { slug: eventSlug } = await params
  const { artist: artistSlug } = await searchParams
  const supabase = createCachedClient()

  // Validate that the event exists and is active
  const { error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', eventSlug)
    .eq('is_active', true)
    .single()

  if (eventError) {
    console.error('Error fetching event:', {
      message: eventError.message,
      details: eventError.details,
      hint: eventError.hint,
      code: eventError.code,
    })
  }

  // Fetch base vote price from vote_packages (smallest package)
  const { data: basePackage } = await supabase
    .from('vote_packages')
    .select('price, votes')
    .eq('is_active', true)
    .order('votes', { ascending: true })
    .limit(1)
    .single()

  // Calculate price per vote from the base package (default: ₦500 per vote)
  const votePrice = basePackage ? basePackage.price / basePackage.votes : 500

  // Fetch active artists
  const { data: artists, error: artistsError } = await supabase
    .from('artists')
    .select('id, name, slug, stage_name, photo_url, total_votes, rank')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('rank', { ascending: true, nullsFirst: false })
    .order('total_votes', { ascending: false })

  if (artistsError) {
    console.error('Error fetching artists:', {
      message: artistsError.message,
      details: artistsError.details,
      hint: artistsError.hint,
      code: artistsError.code,
    })
  }

  // Check if we have data to display
  if (!artists || artists.length === 0) {
    return (
      <div className="min-h-screen">
        <PageHero
          title="Vote for Your Favorite Artist"
          description="Support your favorite artist by purchasing votes"
          badge="December Showcase Voting"
        />

        <section className="container-wide py-16">
          <Card>
            <CardContent className="py-12 text-center">
              <VoteIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No artists available for voting at the moment. Check back soon!
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Vote for Your Favorite Artist"
        description="Support your favorite artist by purchasing votes"
        badge="December Showcase Voting"
      />

      <section className="container-wide py-16">
        <VotingForm
          artists={artists}
          preselectedArtistSlug={artistSlug}
          votePrice={votePrice}
        />
      </section>
    </div>
  )
}