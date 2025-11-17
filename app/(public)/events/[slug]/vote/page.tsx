import { createClient } from "@/utils/supabase/server";
import { VotingForm } from "@/components/forms/VoteForm";
import { PageHero } from "@/components/layout/page-hero";

export default async function VotePage() {
  const supabase = await createClient();
  
  // Fetch pilot artists (December Showcase)
  const { data: artists } = await supabase
    .from('pilot_artists')
    .select('*')
    .order('rank', { ascending: true });

  // Fetch vote packages
  const { data: packages } = await supabase
    .from('vote_packages')
    .select('*')
    .eq('active', true)
    .order('price', { ascending: true });

  return (
    <div className="min-h-screen">
      <PageHero
        title="Vote for Your Favorite Artist"
        description="Support your favorite artist by purchasing votes"
        badge="December Showcase Voting"
      />

      <section className="container-wide py-16">
        <VotingForm artists={artists || []} packages={packages || []} />
      </section>
    </div>
  );
}