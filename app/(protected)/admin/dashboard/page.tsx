import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLoader } from '@/components/shared/suspense-wrapper';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Music,
  MessageSquare,
  Ticket,
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Shows admin statistics, recent activity, and management tools
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Check authentication and admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/signin?redirect=/admin/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your platform, view analytics, and oversee operations
        </p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <AdminStats />
        </Suspense>
      </ErrorBoundary>

      <Tabs defaultValue="overview" className="space-y-6 mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="votes">Voting</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <RecentActivity />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="users">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <UsersOverview />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="events">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <EventsOverview />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="votes">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <VotingOverview />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="bookings">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BookingsOverview />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="messages">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <MessagesOverview />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function AdminStats() {
  const supabase = await createClient();

  // Fetch all statistics
  const [
    usersCount,
    eventsCount,
    bookingsData,
    showcaseVotesCount,
    pilotVotesData,
    contactMessagesCount,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
    supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'completed'),
    supabase.from('showcase_votes').select('*', { count: 'exact', head: true }),
    supabase.from('vote_purchases').select('total_votes, total_amount').eq('payment_status', 'completed'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const totalUsers = usersCount.count || 0;
  const upcomingEvents = eventsCount.count || 0;
  const totalRevenue = bookingsData.data?.reduce((sum, b) => sum + b.total_amount, 0) || 0;
  const showcaseVotes = showcaseVotesCount.count || 0;
  const pilotVotes = pilotVotesData.data?.reduce((sum, p) => sum + p.total_votes, 0) || 0;
  const pilotRevenue = pilotVotesData.data?.reduce((sum, p) => sum + p.total_amount, 0) || 0;
  const newMessages = contactMessagesCount.count || 0;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      description: 'Registered accounts',
      icon: Users,
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.toLocaleString(),
      description: 'Active events',
      icon: Calendar,
    },
    {
      title: 'Event Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      description: 'From ticket sales',
      icon: DollarSign,
    },
    {
      title: 'Showcase Votes',
      value: showcaseVotes.toLocaleString(),
      description: 'Free votes cast',
      icon: TrendingUp,
    },
    {
      title: 'Pilot Votes',
      value: pilotVotes.toLocaleString(),
      description: `₦${pilotRevenue.toLocaleString()} revenue`,
      icon: Music,
    },
    {
      title: 'New Messages',
      value: newMessages.toLocaleString(),
      description: 'Unread inquiries',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

async function RecentActivity() {
  const supabase = await createClient();

  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      events:event_id (title)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest ticket purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings?.map((booking) => {
            const event = Array.isArray(booking.events) ? booking.events[0] : booking.events;
            return (
              <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{booking.full_name}</p>
                  <p className="text-sm text-muted-foreground">{event?.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{booking.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

async function UsersOverview() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user) => (
            <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{user.full_name || user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 rounded bg-secondary">{user.role}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function EventsOverview() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .limit(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Manage your events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.map((event) => (
            <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.tickets_sold || 0} / {event.capacity || 0} tickets
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function VotingOverview() {
  const supabase = await createClient();

  const [showcaseFinalists, pilotArtists] = await Promise.all([
    supabase
      .from('showcase_finalists')
      .select('*')
      .order('vote_count', { ascending: false })
      .limit(10),
    supabase
      .from('pilot_artists')
      .select('*')
      .order('total_votes', { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Showcase Voting</CardTitle>
          <CardDescription>December Showcase finalists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {showcaseFinalists.data?.map((finalist, index) => (
              <div key={finalist.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">{finalist.stage_name}</span>
                </div>
                <span className="font-semibold text-primary">{finalist.vote_count} votes</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pilot Voting</CardTitle>
          <CardDescription>Paid voting leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pilotArtists.data?.map((artist, index) => (
              <div key={artist.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">{artist.stage_name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{artist.total_votes} votes</div>
                  <div className="text-xs text-muted-foreground">₦{artist.total_amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function BookingsOverview() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      events:event_id (title, date)
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>All ticket bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking) => {
            const event = Array.isArray(booking.events) ? booking.events[0] : booking.events;
            return (
              <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{booking.full_name}</p>
                  <p className="text-sm text-muted-foreground">{event?.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{booking.booking_reference}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{booking.total_amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                    booking.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

async function MessagesOverview() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>Inquiries from users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages?.map((message) => (
            <div key={message.id} className="border-b pb-3 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{message.name}</p>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  message.status === 'read' ? 'bg-gray-100 text-gray-800' :
                  message.status === 'replied' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {message.status}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{message.subject}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
