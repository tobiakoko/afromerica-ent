import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { AlertCircle, Trophy } from 'lucide-react'
import { type ArtistWithVotes } from '@/types'
import { LeaderboardWithRankTracking } from '@/components/events/LeaderboardWithRankTracking'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

// Enable ISR with 10-second revalidation for near real-time updates
// This ensures the leaderboard updates quickly when votes are cast
export const revalidate = 10

interface LeaderboardPageProps {
  params: Promise<{ slug: string }>
}

export async function getLeaderboardData(eventSlug: string): Promise<{
  artists: ArtistWithVotes[];
  error: string | null;
  eventTitle?: string;
}> {
  try {
    const supabase = createCachedClient()

    // First, get the event to validate it exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title')
      .eq('slug', eventSlug)
      .eq('is_active', true)
      .single()

    if (eventError || !event) {
      console.error('Error fetching event:', eventError)
      return {
        artists: [],
        error: 'Event not found',
        eventTitle: undefined,
      }
    }

    // Fetch leaderboard data from the view
    // This view has global vote totals, ranks, and previous ranks that are
    // automatically updated by database triggers when votes are completed
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('artist_leaderboard')
      .select('*')
      .order('rank', { ascending: true, nullsFirst: false })

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError)
      return {
        artists: [],
        error: 'Failed to load leaderboard data',
        eventTitle: event.title,
      }
    }

    // Transform leaderboard data to ArtistWithVotes format
    const artists: ArtistWithVotes[] = (leaderboardData || [])
      .filter((row) => row.id && row.slug && row.name)
      .map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        stageName: row.stage_name ?? undefined,
        image: row.photo_url ?? undefined,
        profileImage: row.photo_url ?? undefined,
        voteStats: {
          artistId: row.id,
          totalVotes: row.total_votes ?? 0,
          totalVoteAmount: row.total_vote_amount ?? 0,
          rank: row.rank ?? null,
          previousRank: row.previous_rank ?? undefined,
          completedTransactions: row.completed_transactions ?? undefined,
          transactionCount: row.transaction_count ?? undefined,
          avgVotesPerTransaction: row.avg_votes_per_transaction ?? undefined,
        },
      }))

    return { artists, error: null, eventTitle: event.title }
  } catch (err) {
    console.error('Unexpected error fetching leaderboard:', err)
    return {
      artists: [],
      error: 'Failed to load leaderboard data',
      eventTitle: undefined,
    }
  }
}

async function LeaderboardContent({ eventSlug }: { eventSlug: string }) {
  const { artists, error } = await getLeaderboardData(eventSlug);

  // Check if voting is closed for this event
  const isVotingClosed = eventSlug === 'december-showcase-2025';

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading leaderboard</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (artists.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No artists in the leaderboard yet. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {isVotingClosed && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Voting Closed</AlertTitle>
          <AlertDescription>
            Voting is closed for this time.
          </AlertDescription>
        </Alert>
      )}
      <LeaderboardWithRankTracking
        artists={artists}
        lastUpdated={new Date().toISOString()}
        enableNavigation={true}
        eventSlug={isVotingClosed ? undefined : eventSlug}
      />
    </>
  );
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { slug } = await params

  // Fetch event title for the badge
  const supabase = createCachedClient()
  const { data: event } = await supabase
    .from('events')
    .select('title')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  const eventTitle = event?.title || 'Event'

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      <PageHero
        title={
          <span className="flex items-center justify-center gap-2 sm:gap-3">
            <Trophy className="size-6 sm:size-8 text-yellow-500" />
            Leaderboard
          </span>
        }
        description="Live rankings updated in real-time"
        badge={eventTitle}
        badgeHref={`/events/${slug}`}
      />

      <LeaderboardContent eventSlug={slug} />
    </div>
  )
}
