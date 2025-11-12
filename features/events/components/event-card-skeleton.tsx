export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card border border-border/50 h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-muted/50 overflow-hidden">
        <div className="shimmer absolute inset-0" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Title */}
        <div className="relative h-5 bg-muted/50 rounded w-3/4 overflow-hidden">
          <div className="shimmer absolute inset-0" />
        </div>

        {/* Artists */}
        <div className="relative h-4 bg-muted/50 rounded w-1/2 overflow-hidden">
          <div className="shimmer absolute inset-0" />
        </div>

        {/* Date & Location */}
        <div className="space-y-1.5 flex-1">
          <div className="relative h-4 bg-muted/50 rounded w-2/3 overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="relative h-4 bg-muted/50 rounded w-full overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="space-y-1">
            <div className="relative h-3 bg-muted/50 rounded w-12 overflow-hidden">
              <div className="shimmer absolute inset-0" />
            </div>
            <div className="relative h-4 bg-muted/50 rounded w-16 overflow-hidden">
              <div className="shimmer absolute inset-0" />
            </div>
          </div>
          <div className="relative h-7 bg-muted/50 rounded-md w-20 overflow-hidden">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  );
}