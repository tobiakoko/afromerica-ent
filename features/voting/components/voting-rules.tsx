'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

export function VotingRules() {
  const rules = [
    'Each person can vote once per device',
    'Voting closes on December 1st, 2025 at 11:59 PM',
    'Top 3 artists with the most votes perform at the showcase',
    'Votes are final and cannot be changed',
    'Winners will be announced on December 5th, 2025',
  ];

  const guidelines = [
    'Be respectful to all artists and voters',
    'Share the voting page to support your favorite artist',
    'Follow artists on social media for updates',
  ];

  return (
    <section className="py-16 border-y border-white/10">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Voting Rules & Guidelines
            </h2>
            <p className="text-white/70 text-lg">
              Please read the following before casting your vote
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Rules */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-lime-400" />
                <h3 className="text-xl font-bold text-white">Rules</h3>
              </div>
              <ul className="space-y-3">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-lime-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-white/80 leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guidelines */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-lime-400" />
                <h3 className="text-xl font-bold text-white">Guidelines</h3>
              </div>
              <ul className="space-y-3">
                {guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 leading-relaxed">{guideline}</span>
                  </li>
                ))}
              </ul>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm leading-relaxed">
                  <strong className="text-white">Note:</strong> We use device tracking to prevent 
                  duplicate votes. Your vote is secure and anonymous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}