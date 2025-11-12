import { VotingHero } from '@/features/voting/components/voting-hero';
import { FinalistsGrid } from '@/features/voting/components/finalists-grid';
import { VotingRules } from '@/features/voting/components/voting-rules';
import { Leaderboard } from '@/features/voting/components/leaderboard';
import { getFinalists, getVotingStats } from '@/features/voting/api/voting.api';

export const metadata = {
  title: 'December Showcase 2025 - Vote for Your Favorite Artist | Afromerica Entertainment',
  description: 'Vote for your favorite artist in the Afromerica December Showcase 2025. 10 talented finalists competing for the top spot!',
};

export default async function VotingPage() {
  // Fetch data server-side
  const [finalistsData, stats] = await Promise.all([
    getFinalists(),
    getVotingStats(),
  ]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <VotingHero stats={stats} />

      {/* Voting Rules */}
      <VotingRules />

      {/* Leaderboard - Top 3 Highlighted */}
      <section className="py-12 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-4 sm:px-8">
          <Leaderboard finalists={finalistsData.data.slice(0, 3)} />
        </div>
      </section>

      {/* All Finalists - Interactive Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet the Finalists
            </h2>
            <p className="text-white/70 text-lg">
              Click on any artist to learn more and cast your vote
            </p>
          </div>

          <FinalistsGrid initialFinalists={finalistsData.data} stats={stats} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-lime-400/10 to-purple-600/10">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Every Vote Counts!
          </h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto mb-8">
            Help your favorite artist secure their spot at the December Showcase. 
            Share this page and encourage others to vote!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-all duration-200 hover:scale-105">
              Share on Twitter
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
              Share on Instagram
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/*

import { PilotVotingHero } from '@/features/pilot-voting/components/pilot-voting-hero';
import { PilotLeaderboard } from '@/features/pilot-voting/components/pilot-leaderboard';
import { PilotArtistsGrid } from '@/features/pilot-voting/components/pilot-artists-grid';
import { VotePackagesSection } from '@/features/pilot-voting/components/vote-packages-section';
import { CartProvider } from '@/features/pilot-voting/context/cart-context';
import { FloatingCart } from '@/features/pilot-voting/components/floating-cart';
import { getPilotArtists, getPilotVotingStats, getVotePackages } from '@/features/pilot-voting/api/pilot-voting.api';

export const metadata = {
  title: 'Afromerica Pilot Event - Vote for Your Favorite Artist',
  description: 'Support your favorite artist at the Afromerica Pilot Launch Event! Purchase votes and help them win.',
};

export default async function PilotVotingPage() {
  // Fetch data server-side
  const [artistsData, stats, packages] = await Promise.all([
    getPilotArtists(),
    getPilotVotingStats(),
    getVotePackages(),
  ]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-black">
        {/* Hero Section *}
        <PilotVotingHero stats={stats} />

        {/* How It Works Section *}
        <section className="py-16 border-y border-white/10">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                How Voting Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-black">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Choose Artist</h3>
                  <p className="text-white/70">
                    Browse artists and select your favorite to support
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-black">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Select Votes</h3>
                  <p className="text-white/70">
                    Choose a vote package and add to cart
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-black">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Pay & Vote</h3>
                  <p className="text-white/70">
                    Complete payment and your votes are counted instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vote Packages Showcase *}
        <VotePackagesSection packages={packages.data} />

        {/* Real-time Leaderboard *}
        <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-4 sm:px-8">
            <PilotLeaderboard artists={artistsData.data} stats={stats} />
          </div>
        </section>

        {/* All Artists Grid *}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Vote for Your Favorite Artist
              </h2>
              <p className="text-white/70 text-lg">
                Select an artist and purchase votes to support them
              </p>
            </div>

            <PilotArtistsGrid 
              initialArtists={artistsData.data}
              packages={packages.data}
            />
          </div>
        </section>

        {/* FAQ Section *}
        <section className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    How many times can I vote?
                  </h3>
                  <p className="text-white/70">
                    You can purchase as many votes as you want! There's no limit. 
                    The more votes you purchase, the better your artist's chances.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    When are votes counted?
                  </h3>
                  <p className="text-white/70">
                    Votes are added instantly after successful payment. You'll see 
                    the leaderboard update in real-time!
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Can I vote for multiple artists?
                  </h3>
                  <p className="text-white/70">
                    Yes! You can add votes for different artists to your cart and 
                    check out all at once.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    What happens after voting ends?
                  </h3>
                  <p className="text-white/70">
                    The artist with the most votes wins and performs at the Afromerica 
                    Pilot Launch Event. Winners will be announced immediately after voting closes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Cart Button *}
        <FloatingCart />
      </div>
    </CartProvider>
  );
}


*/