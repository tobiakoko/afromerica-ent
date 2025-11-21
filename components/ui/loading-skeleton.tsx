"use client"

export function LoadingSkeleton() {
  return (
    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
      {/* Apple-style loading animation */}
      <div className="relative">
        {/* Spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-[#00FFF0] animate-spin" />

        {/* Pulsing center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#00FFF0] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CarouselLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-black dark:via-gray-950 dark:to-black animate-pulse">
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />

      {/* Center loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-[#00FFF0] animate-spin" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">Loading...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        {/* Logo skeleton */}
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

        {/* Spinning loader */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-[#00FFF0] animate-spin" />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
