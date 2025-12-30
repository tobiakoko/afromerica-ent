import { createAdminClient } from "@/utils/supabase/admin";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, DollarSign, Ticket as TicketIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const adminClient = createAdminClient();

  // Fetch statistics using admin client
  const [
    { count: totalEvents },
    { count: totalArtists },
    { count: totalBookings },
    { data: ticketRevenue },
    { data: artistStats },
    { data: recentTickets },
    { data: recentVotes }
  ] = await Promise.all([
    adminClient.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('artists').select('*', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('tickets').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    adminClient.from('tickets').select('total_amount').eq('payment_status', 'completed'),
    adminClient
      .from('artists')
      .select('total_votes, total_vote_amount')
      .eq('is_active', true)
      .is('deleted_at', null),
    adminClient
      .from('tickets')
      .select('*, event:events(title)')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5),
    adminClient
      .from('votes')
      .select('*, artist:artists(stage_name, name), event:events(title)')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const ticketRevenueTotal =
    ticketRevenue?.reduce((sum, ticket) => sum + Number(ticket.total_amount || 0), 0) || 0
  const voteRevenueFromArtists =
    artistStats?.reduce((sum, artist) => sum + Number(artist.total_vote_amount || 0), 0) || 0
  const totalVotesCast =
    artistStats?.reduce((sum, artist) => sum + Number(artist.total_votes || 0), 0) || 0
  const totalRevenue = ticketRevenueTotal + voteRevenueFromArtists;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents || 0,
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      title: 'Total Artists',
      value: totalArtists || 0,
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: 'Completed Bookings',
      value: totalBookings || 0,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Votes Cast',
      value: totalVotesCast || 0,
      icon: TrendingUp,
      color: 'text-pink-500',
    },
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Live overview of events, artists, tickets, and votes</p>
        </div>
        <p className="text-xs text-muted-foreground">Data updates on each load</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-xl font-semibold">Recent Ticket Bookings</h2>
            <TicketIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentTickets && recentTickets.length > 0 ? (
            <div className="space-y-3 divide-y">
              {recentTickets.map((ticket: any) => (
                <div key={ticket.id} className="flex items-start justify-between pt-3 first:pt-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{ticket.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.event?.title || 'Event'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''} • ₦{Number(ticket.total_amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ticket.payment_status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : ticket.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent ticket bookings</p>
          )}
        </Card>

        {/* Recent Votes */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-xl font-semibold">Recent Votes</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentVotes && recentVotes.length > 0 ? (
            <div className="space-y-3 divide-y">
              {recentVotes.map((vote: any) => (
                <div key={vote.id} className="flex items-start justify-between pt-3 first:pt-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{vote.voter_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Voted for {vote.artist?.stage_name || vote.artist?.name || 'Artist'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vote.quantity} vote{vote.quantity > 1 ? 's' : ''} • ₦{Number(vote.amount_paid).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(vote.created_at), { addSuffix: true })}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vote.payment_status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : vote.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vote.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent votes</p>
          )}
        </Card>
      </div>
    </div>
  );
}
