import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            <Link href="/" className="group">
              <div className="p-6 border rounded-lg hover:border-primary hover:bg-accent transition-all">
                <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Home</h3>
                <p className="text-xs text-muted-foreground">
                  Back to homepage
                </p>
              </div>
            </Link>

            <Link href="/artists" className="group">
              <div className="p-6 border rounded-lg hover:border-primary hover:bg-accent transition-all">
                <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Artists</h3>
                <p className="text-xs text-muted-foreground">
                  Discover artists
                </p>
              </div>
            </Link>

            <Link href="/events" className="group">
              <div className="p-6 border rounded-lg hover:border-primary hover:bg-accent transition-all">
                <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Events</h3>
                <p className="text-xs text-muted-foreground">
                  Browse events
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            If you believe this is an error, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
