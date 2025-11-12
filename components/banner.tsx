'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  dismissible?: boolean;
}

export default function AnnouncementBanner({
  message = "Join us for the December Pilot Vote! Cast your vote for your favorite artist.",
  linkText = "Vote Now",
  linkHref = "/pilot-vote",
  dismissible = true,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-primary to-secondary px-6 py-2.5 sm:px-3.5">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-accent/20 to-secondary/20 opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-accent/20 to-secondary/20 opacity-30"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white animate-pulse" aria-hidden="true" />
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">{message}</strong>
          </p>
        </div>
        {linkHref && linkText && (
          <Link
            href={linkHref}
            className="flex-none rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 backdrop-blur-sm"
          >
            {linkText} <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <div className="flex flex-none items-center gap-x-1">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="-m-3 p-3 focus-visible:outline-offset-[-4px] hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Dismiss announcement"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
