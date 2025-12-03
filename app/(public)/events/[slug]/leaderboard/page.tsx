import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { AlertCircle, Trophy } from 'lucide-react'
import { type ArtistWithVotes } from '@/types'
import { LeaderboardWithRankTracking } from '@/components/events/LeaderboardWithRankTracking'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

// Enable ISR with 30-second revalidation
export const revalidate = 30 // Revalidate every 30 seconds

interface LeaderboardPageProps {
  params: Promise<{ slug: string }>
}

export async function getLeaderboardData(): Promise<{
  artists: ArtistWithVotes[];
  error: string | null;
}> {
  try {
    const supabase = createCachedClient()

    // Fetch artists from leaderboard view with rankings
    const { data: leaderboardData } = await supabase
        .from('artist_leaderboard')
        .select('*')
        .order('rank', { ascending: true, nullsFirst: false })

    const artists: ArtistWithVotes[] = (leaderboardData || [])
      .filter((row: any) => row.id && row.slug && row.name) // Filter out incomplete records
      .map((row: any) => ({
        id: row.id!,
        slug: row.slug!,
        name: row.name!,
        stageName: row.stage_name ?? undefined,
        image: row.photo_url ?? undefined,
        profileImage: row.photo_url ?? undefined,
        voteStats: {
          artistId: row.id!,
          totalVotes: row.total_votes ?? 0,
          totalVoteAmount: row.total_vote_amount ?? 0,
          rank: row.rank ?? null,
          completedTransactions: row.completed_transactions ?? undefined,
          transactionCount: row.transaction_count ?? undefined,
          avgVotesPerTransaction: row.avg_votes_per_transaction ?? undefined,
        },
      }))

    return { artists, error: null };
  } catch (err) {
    console.error("Unexpected error fetching leaderboard:", err);
    return {
      artists: [],
      error: "Failed to load leaderboard data",
    };
  }
}

async function LeaderboardContent({ eventSlug }: { eventSlug: string }) {
  const { artists, error } = await getLeaderboardData();

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
    <LeaderboardWithRankTracking
      artists={artists}
      lastUpdated={new Date().toISOString()}
      enableNavigation={true}
      eventSlug={eventSlug}
    />
  );
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { slug } = await params

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
        badge="December Showcase"
        badgeHref={`/events/${slug}`}
      />

      <LeaderboardContent eventSlug={slug} />
    </div>
  )
}
