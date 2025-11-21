'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function AnnouncementBanner({
  message,
  linkText,
  linkHref,
  dismissible = true,
  onDismiss,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative isolate flex items-center justify-center gap-x-6 overflow-hidden bg-linear-to-r from-[#00FFF0] to-[#00E6D8] px-6 py-3 sm:px-3.5 shadow-lg">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        {/* Content */}
        <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-black/80 animate-pulse" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-black">
              {message}
            </p>
          </div>
          {linkHref && linkText && (
            <Link
              href={linkHref}
              className="flex-none rounded-full bg-black/10 px-4 py-1.5 text-sm font-semibold text-black hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all duration-200 backdrop-blur-sm"
            >
              {linkText} <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <div className="flex flex-none items-center gap-x-1 absolute right-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="-m-2 p-2 focus-visible:outline-offset-4 hover:bg-black/10 rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-black"
              aria-label="Dismiss announcement"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4 text-black/80" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
