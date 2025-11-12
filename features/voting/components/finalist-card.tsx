'use client';

import Image from 'next/image';
import { ThumbsUp, Trophy, CheckCircle } from 'lucide-react';
import type { Finalist } from '../types/voting.types';

interface FinalistCardProps {
  finalist: Finalist;
  onVoteClick: () => void;
  hasVoted: boolean;
  isVotingActive: boolean;
}

export function FinalistCard({ finalist, onVoteClick, hasVoted, isVotingActive }: FinalistCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-lime-400 to-lime-600';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center shadow-lg z-10`}>
          <Trophy className="w-6 h-6 text-white" />
        </div>
      );
    }
    return (
      <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10">
        <span className="text-white font-bold text-sm">#{rank}</span>
      </div>
    );
  };

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-lime-400/50 transition-all duration-300 hover:scale-[1.02]">
      {/* Rank Badge */}
      {getRankBadge(finalist.rank)}

      {/* Voted Badge */}
      {hasVoted && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-lime-400 rounded-full z-10">
          <CheckCircle className="w-4 h-4 text-black" />
          <span className="text-black font-bold text-xs">Your Vote</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-72 overflow-hidden cursor-pointer" onClick={onVoteClick}>
        {finalist.image ? (
          <Image
            src={finalist.image}
            alt={finalist.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-lime-400/20 to-purple-600/20 flex items-center justify-center">
            <span className="text-6xl">🎤</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Name */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
            {finalist.stageName}
          </h3>
          <p className="text-white/60 text-sm">{finalist.name}</p>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2">
          {finalist.genre.map((g, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Vote Count */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-lime-400" />
            <span className="text-white/80 text-sm font-medium">
              {finalist.voteCount.toLocaleString()} votes
            </span>
          </div>
        </div>

        {/* Vote Button */}
        <button
          onClick={onVoteClick}
          disabled={!isVotingActive}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            hasVoted
              ? 'bg-lime-400 text-black cursor-default'
              : isVotingActive
              ? 'bg-white/10 text-white hover:bg-lime-400 hover:text-black border border-white/20 hover:border-lime-400'
              : 'bg-white/5 text-white/40 cursor-not-allowed'
          }`}
        >
          {!isVotingActive
            ? 'Voting Ended'
            : hasVoted
            ? 'Voted ✓'
            : 'Vote Now'}
        </button>
      </div>
    </article>
  );
}