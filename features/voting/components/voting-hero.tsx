'use client';

import { Trophy, Clock, Users } from 'lucide-react';
import type { VotingStats } from '../types/voting.types';

interface VotingHeroProps {
  stats: VotingStats;
}

export function VotingHero({ stats }: VotingHeroProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(stats.votingEndsAt).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining('Voting Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stats.votingEndsAt]);

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-purple-600/20 to-black" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 sm:px-8 flex items-center">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 text-sm font-bold rounded-full mb-6">
            <Trophy className="w-4 h-4" />
            DECEMBER SHOWCASE 2025
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Vote for Your
            <br />
            <span className="text-lime-400">Favorite Artist</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl">
            10 incredible talents. 1 showcase. Your vote decides who takes the stage at Afromerica's biggest event of the year.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-lime-400" />
                <span className="text-white/60 font-medium">Total Votes</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.totalVotes.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-lime-400" />
                <span className="text-white/60 font-medium">Finalists</span>
              </div>
              <p className="text-3xl font-bold text-white">10</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-lime-400" />
                <span className="text-white/60 font-medium">Time Left</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {timeRemaining}
              </p>
            </div>
          </div>

          {/* Voting Status */}
          {!stats.isVotingActive && (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-semibold">
                Voting has ended. Thank you for participating!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}