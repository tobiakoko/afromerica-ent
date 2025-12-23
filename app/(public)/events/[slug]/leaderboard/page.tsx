import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { AlertCircle, Medal, Trophy } from 'lucide-react'
import { type ArtistWithVotes } from '@/types'
import { LeaderboardWithRankTracking } from '@/components/events/LeaderboardWithRankTracking'
import { FinalScoringTable } from '@/components/events/FinalScoringTable'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  isFinalScoring?: boolean;
}> {
  try {
    const supabase = createCachedClient()

    // Check if this is the December showcase (final scoring enabled)
    const isFinalScoring = eventSlug === 'december-showcase-2025';

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
        isFinalScoring: false,
      }
    }

    // Use final leaderboard view if final scoring is enabled
    const viewName = isFinalScoring ? 'artist_final_leaderboard' : 'artist_leaderboard';


    // Fetch leaderboard data from the view
    // This view has global vote totals, ranks, and previous ranks that are
    // automatically updated by database triggers when votes are completed
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from(viewName)
      .select('*')
      .order(isFinalScoring ? 'final_rank' : 'rank', { ascending: true, nullsFirst: false })

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
          rank: isFinalScoring ? row.final_rank : row.rank ?? null,
          previousRank: row.previous_rank ?? undefined,
          completedTransactions: row.completed_transactions ?? undefined,
          transactionCount: row.transaction_count ?? undefined,
          avgVotesPerTransaction: row.avg_votes_per_transaction ?? undefined,
        },
        // Include final scoring data if available
        ...(isFinalScoring && {
          finalScores: {
            paid_score: row.paid_score ?? 0,
            public_score: row.public_score ?? 0,
            judges_score: row.judges_score ?? 0,
            performance_score: row.performance_score ?? 0,
            total_score: row.total_score ?? 0,
            final_rank: row.final_rank ?? null,
            is_top_10: row.is_top_10 ?? false,
          }
        })
      }))

    return { artists, error: null, eventTitle: event.title, isFinalScoring }
  } catch (err) {
    console.error('Unexpected error fetching leaderboard:', err)
    return {
      artists: [],
      error: 'Failed to load leaderboard data',
      eventTitle: undefined,
      isFinalScoring: false,
    }
  }
}

async function LeaderboardContent({ eventSlug }: { eventSlug: string }) {
  const { artists, error, isFinalScoring } = await getLeaderboardData(eventSlug);

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
      {/* Final Scoring Notice */}
      {isFinalScoring && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <Trophy className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-900 dark:text-yellow-100">
            Final Scoring Active
          </AlertTitle>
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Rankings now include: Paid Votes (35%), Public Score (10%), Judges Score (30%), and Performance Score (25%).
          </AlertDescription>
        </Alert>
      )}

      {/* Voting Closed Notice */}
      {isVotingClosed && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Voting Closed</AlertTitle>
          <AlertDescription>
            Voting is closed for this time.
          </AlertDescription>
        </Alert>
      )}

      {/* Top 10 Highlight Card */}
      {isFinalScoring && (
        <Card className="border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
              <Medal className="h-6 w-6 text-yellow-600" />
              Top 10 Grand Finale Contestants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {artists
                .filter(a => a.finalScores?.is_top_10)
                .map((artist, index) => (
                  <div 
                    key={artist.id}
                    className="flex flex-col items-center p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-yellow-400"
                  >
                    <Badge variant="secondary" className="mb-2">
                      #{index + 1}
                    </Badge>
                    <p className="text-sm font-semibold text-center">
                      {artist.stageName || artist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {artist.finalScores?.total_score.toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Leaderboard */}
      {isFinalScoring ? (
        <FinalScoringTable
          artists={artists}
          lastUpdated={new Date().toISOString()}
          enableNavigation={true}
        />
      ) : (
        <LeaderboardWithRankTracking
          artists={artists}
          lastUpdated={new Date().toISOString()}
          enableNavigation={true}
          eventSlug={isVotingClosed ? undefined : eventSlug}
        />
      )}

      {/* Scoring Breakdown Legend */}
      {isFinalScoring && (
        <Card>
          <CardHeader>
            <CardTitle>Scoring Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">35%</p>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Paid Votes</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Online voting support
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">10%</p>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">Public Score</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Social media engagement
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">30%</p>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Judges Score</p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Professional evaluation
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">25%</p>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Performance</p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Live showcase performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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
  const isFinalScoring = slug === 'december-showcase-2025';

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      <PageHero
        title={
          <span className="flex items-center justify-center gap-2 sm:gap-3">
            <Trophy className="size-6 sm:size-8 text-yellow-500" />
            {isFinalScoring ? 'Final Results' : 'Leaderboard'}
          </span>
        }
        description={
          isFinalScoring 
            ? "Complete scoring breakdown - Voting, Judges, Performance" 
            : "Live rankings updated in real-time"
        }
        badge={eventTitle}
        badgeHref={`/events/${slug}`}
      />

      <LeaderboardContent eventSlug={slug} />
    </div>
  )
}
