
export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 bg-white/10" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-white/10 rounded w-3/4" />

        {/* Artists */}
        <div className="h-4 bg-white/10 rounded w-1/2" />

        {/* Date & Location */}
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-4 bg-white/10 rounded w-full" />
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="space-y-1">
            <div className="h-3 bg-white/10 rounded w-16" />
            <div className="h-5 bg-white/10 rounded w-20" />
          </div>
          <div className="h-10 bg-white/10 rounded w-24" />
        </div>
      </div>
    </div>
  );
}