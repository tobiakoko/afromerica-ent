import { Loader2, Music2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-mesh opacity-30" />

      {/* Content */}
      <div className="text-center space-y-6 z-10 relative">
        {/* Logo/Icon with animation */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div className="relative flex items-center justify-center">
            <Music2 className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading spinner */}
        <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gradient">Loading your experience</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Preparing something amazing for you...
          </p>
        </div>
      </div>
    </div>
  );
}