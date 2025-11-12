'use client';

import Image from 'next/image';
import { Trophy, TrendingUp } from 'lucide-react';
import type { Finalist } from '../types/voting.types';

interface LeaderboardProps {
  finalists: Finalist[]; // Top 3 finalists
}

export function Leaderboard({ finalists }: LeaderboardProps) {
  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-yellow-400 to-yellow-600',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/30',
          text: 'text-yellow-400',
          size: 'lg:scale-110',
        };
      case 2:
        return {
          gradient: 'from-gray-300 to-gray-500',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/30',
          text: 'text-gray-400',
          size: 'lg:scale-105',
        };
      case 3:
        return {
          gradient: 'from-orange-400 to-orange-600',
          bg: 'bg-orange-400/10',
          border: 'border-orange-400/30',
          text: 'text-orange-400',
          size: 'lg:scale-100',
        };
      default:
        return {
          gradient: 'from-lime-400 to-lime-600',
          bg: 'bg-white/5',
          border: 'border-white/10',
          text: 'text-white',
          size: '',
        };
    }
  };

  // Order: 2nd, 1st, 3rd for podium effect
  const orderedFinalists = [finalists[1], finalists[0], finalists[2]].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Current Leaderboard
        </h2>
        <p className="text-white/70">Top 3 artists leading the race</p>
      </div>

      {/* Podium Layout */}
      <div className="flex items-end justify-center gap-4 md:gap-6">
        {orderedFinalists.map((finalist) => {
          const styles = getRankStyles(finalist.rank);
          const isFirst = finalist.rank === 1;

          return (
            <div
              key={finalist.id}
              className={`flex flex-col items-center ${styles.size} transition-all duration-300`}
            >
              {/* Rank Badge */}
              <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${styles.gradient} rounded-full flex items-center justify-center shadow-2xl mb-4 ${isFirst ? 'ring-4 ring-yellow-400/30' : ''}`}>
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Artist Card */}
              <div className={`${styles.bg} border ${styles.border} rounded-xl p-4 md:p-6 w-48 md:w-56 text-center backdrop-blur-sm`}>
                {/* Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white/10">
                  {finalist.image ? (
                    <Image
                      src={finalist.image}
                      alt={finalist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-lime-400/20 to-purple-600/20 flex items-center justify-center">
                      <span className="text-4xl">🎤</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className={`text-lg md:text-xl font-bold ${styles.text} mb-1`}>
                  {finalist.stageName}
                </h3>
                <p className="text-white/60 text-sm mb-3">{finalist.name}</p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className={`flex items-center justify-center gap-2 ${styles.text}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-2xl font-bold">
                      {finalist.voteCount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs">votes</p>
                </div>

                {/* Rank Position */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className={`text-sm font-semibold ${styles.text}`}>
                    #{finalist.rank} Position
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <p className="text-white/70 text-lg">
          Vote now to help your favorite artist reach the top!
        </p>
      </div>
    </div>
  );
}