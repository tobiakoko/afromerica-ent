'use client';

import { Trophy, Clock, DollarSign, Users, Sparkles } from 'lucide-react';
import type { PilotVotingStats } from '../types/voting.types';
import { useState, useEffect } from 'react';

interface PilotVotingHeroProps {
  stats: PilotVotingStats;
}

export function PilotVotingHero({ stats }: PilotVotingHeroProps) {
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
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [stats.votingEndsAt]);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-purple-600/20 to-black" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="w-8 h-8 text-lime-400/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Trophy className="w-12 h-12 text-yellow-400/30" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float">
          <Sparkles className="w-6 h-6 text-purple-400/30" />
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400/20 backdrop-blur-sm border border-lime-400/30 rounded-full">
            <Trophy className="w-5 h-5 text-lime-400" />
            <span className="text-lime-400 font-bold text-lg">AFROMERICA PILOT EVENT</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Vote for Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-600">
                Favorite Artist
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Support your favorite artist and help them win a spot at the Afromerica Pilot Launch Event. 
              Every vote counts!
            </p>
          </div>

          {/* Lead Artist Info */}
          {stats.topArtist && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <p className="text-white/70 text-sm">Currently Leading</p>
                <p className="text-white font-bold">{stats.topArtist.name}</p>
              </div>
              <div className="text-right border-l border-white/20 pl-3">
                <p className="text-lime-400 font-bold text-lg">
                  {stats.topArtist.votes.toLocaleString()}
                </p>
                <p className="text-white/70 text-xs">votes</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <Users className="w-5 h-5 text-lime-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalVotes.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm">Total Votes</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <DollarSign className="w-5 h-5 text-lime-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                ₦{(stats.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-white/60 text-sm">Raised</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <Trophy className="w-5 h-5 text-lime-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.uniqueVoters.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm">Voters</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <Clock className="w-5 h-5 text-lime-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{timeRemaining}</p>
              <p className="text-white/60 text-sm">Time Left</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={() => {
                document.getElementById('artists-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-5 bg-lime-400 hover:bg-lime-300 text-black font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-2xl shadow-lime-400/20"
            >
              Start Voting Now
            </button>
          </div>

          {/* Voting Status */}
          {!stats.isVotingActive && (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-semibold text-lg">
                Voting has ended. Winners will be announced soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}