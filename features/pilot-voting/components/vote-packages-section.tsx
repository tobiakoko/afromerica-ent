'use client';

import { Check, Zap } from 'lucide-react';
import type { VotePackage } from '../types/voting.types';

interface VotePackagesSectionProps {
  packages: VotePackage[];
}

export function VotePackagesSection({ packages }: VotePackagesSectionProps) {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Vote Package
          </h2>
          <p className="text-white/70 text-lg">
            Support your favorite artist with the package that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                pkg.popular
                  ? 'bg-gradient-to-br from-lime-400/20 to-lime-600/20 border-lime-400/50'
                  : 'bg-white/5 border-white/10 hover:border-lime-400/30'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-lime-400 rounded-full">
                    <Zap className="w-3 h-3 text-black" />
                    <span className="text-xs font-bold text-black">POPULAR</span>
                  </div>
                </div>
              )}

              {/* Package Details */}
              <div className="text-center space-y-4">
                {/* Name */}
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>

                {/* Votes */}
                <div>
                  <p className="text-5xl font-bold text-lime-400">{pkg.votes}</p>
                  <p className="text-white/60">votes</p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-3xl font-bold text-white">
                    ₦{pkg.price.toLocaleString()}
                  </p>
                  {pkg.discount && (
                    <p className="text-lime-400 text-sm font-semibold mt-1">
                      Save {pkg.discount}%
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-lime-400" />
                    <span className="text-sm">Instant vote counting</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-lime-400" />
                    <span className="text-sm">Email confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-lime-400" />
                    <span className="text-sm">Leaderboard updates</span>
                  </div>
                  {pkg.savings && pkg.savings > 0 && (
                    <div className="flex items-center gap-2 text-lime-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Save ₦{pkg.savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price per Vote */}
                <p className="text-white/40 text-xs pt-2">
                  ₦{(pkg.price / pkg.votes).toFixed(2)} per vote
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center mt-12">
          <p className="text-white/60">
            💡 Larger packages offer better value! Choose wisely to maximize your support.
          </p>
        </div>
      </div>
    </section>
  );
}