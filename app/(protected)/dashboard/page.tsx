import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLoader } from '@/components/shared/suspense-wrapper';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { Calendar, Ticket, TrendingUp, User } from 'lucide-react';

/**
 * User Dashboard Page
 * Shows user profile, voting history, and bookings
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/signin?redirect=/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">
          View your activity, bookings, and voting history
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="votes">Voting History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <DashboardOverview userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="bookings">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <UserBookings userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="votes">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <VotingHistory userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="profile">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <UserProfile userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function DashboardOverview({ userId }: { userId: string }) {
  const supabase = await createClient();

  // Fetch dashboard stats
  const [bookingsResult, votesResult, profileResult] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, total_amount', { count: 'exact' })
      .eq('user_id', userId)
      .eq('payment_status', 'completed'),
    supabase
      .from('user_vote_history')
      .select('votes_cast', { count: 'exact' })
      .eq('user_id', userId),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),
  ]);

  const totalBookings = bookingsResult.count || 0;
  const totalSpent = bookingsResult.data?.reduce((sum, b) => sum + b.total_amount, 0) || 0;
  const totalVotes = votesResult.data?.reduce((sum, v) => sum + v.votes_cast, 0) || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">Event tickets booked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVotes}</div>
          <p className="text-xs text-muted-foreground">Artists supported</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">On events and votes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Active</div>
          <p className="text-xs text-muted-foreground">
            Member since {new Date(profileResult.data?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function UserBookings({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      events:event_id (
        id,
        title,
        date,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return <div className="text-destructive">Error loading bookings: {error.message}</div>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No bookings yet</p>
          <a href="/events" className="text-primary hover:underline mt-2 inline-block">
            Browse upcoming events
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const event = Array.isArray(booking.events) ? booking.events[0] : booking.events;
        return (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {event?.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{event?.title || 'Event'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event?.date || '').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      Booking Ref: <span className="font-mono">{booking.booking_reference}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₦{booking.total_amount.toLocaleString()}</div>
                  <div className={`text-sm mt-1 px-2 py-1 rounded inline-block ${
                    booking.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

async function VotingHistory({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: votes, error } = await supabase
    .from('user_vote_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return <div className="text-destructive">Error loading voting history: {error.message}</div>;
  }

  if (!votes || votes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No votes yet</p>
          <a href="/vote" className="text-primary hover:underline mt-2 inline-block">
            Start voting for artists
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {votes.map((vote) => (
        <Card key={vote.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{vote.artist_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {vote.vote_type === 'showcase' ? 'December Showcase' : 'Pilot Event'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(vote.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{vote.votes_cast} {vote.votes_cast === 1 ? 'Vote' : 'Votes'}</div>
                {vote.amount > 0 && (
                  <div className="text-sm text-muted-foreground">₦{vote.amount.toLocaleString()}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function UserProfile({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: { user } } = await supabase.auth.getUser();

  if (!profile || !user) {
    return <div>Error loading profile</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <p className="text-lg">{profile.full_name || 'Not set'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="text-lg">{profile.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <p className="text-lg">{profile.phone || 'Not set'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Member Since</label>
          <p className="text-lg">
            {new Date(profile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
