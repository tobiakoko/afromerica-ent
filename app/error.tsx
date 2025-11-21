'use client';

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeftIcon } from 'lucide-react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);
  
  const handleGoBack = () => {
    router.back();
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            An unexpected error has occurred.
          </p>
 
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="p-3 bg-destructive/10 rounded-lg text-left">
              <p className="text-sm font-mono text-destructive wrap-break-word">
                {error.message}
              </p>
            </div>
          )}
 
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: <span className="font-mono">{error.digest}</span>
            </p>
          )}
 
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={reset}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
 
          <p className="text-xs text-muted-foreground pt-4">
            If this problem persists, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}