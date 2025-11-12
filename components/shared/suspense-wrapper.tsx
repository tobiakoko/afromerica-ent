import { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Reusable Suspense Wrapper with default loading spinner
 */
export function SuspenseWrapper({
  children,
  fallback,
  className = '',
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * Full page loading fallback
 */
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

/**
 * Card loading skeleton
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
    </div>
  );
}

/**
 * Table loading skeleton
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
