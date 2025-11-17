import { createClient } from "@/utils/supabase/server";
import { LeaderboardTable } from "@/components/events/LeaderboardTable";
import { PageHero } from "@/components/layout/page-hero";
import { Trophy } from "lucide-react";

export const revalidate = 30; // Revalidate every 30 seconds

export default async function LeaderboardPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Fetch pilot artists with rankings
  const { data: artists } = await supabase
    .from('pilot_artists')
    .select('*')
    .order('rank', { ascending: true });

  return (
    <div className="min-h-screen">
      <PageHero
        title={
          <span className="flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Leaderboard
          </span>
        }
        description="Live rankings updated in real-time"
        badge="December Showcase"
      />

      <section className="container-wide py-16">
        <LeaderboardTable artists={artists || []} />
      </section>
    </div>
  );
}