'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-red-100">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Critical Error
                </h1>
                <p className="text-gray-600">
                  A critical error has occurred. We apologize for the inconvenience.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && error.message && (
                <div className="p-4 bg-red-50 rounded-lg text-left border border-red-200">
                  <p className="text-sm font-mono text-red-800 break-words">
                    {error.message}
                  </p>
                </div>
              )}

              {error.digest && (
                <p className="text-xs text-gray-500">
                  Error ID: <span className="font-mono">{error.digest}</span>
                </p>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={reset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Return to Home
                </Button>
              </div>

              <p className="text-xs text-gray-500 pt-4">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
