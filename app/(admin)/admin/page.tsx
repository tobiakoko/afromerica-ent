import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, DollarSign, Ticket as TicketIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // Fetch statistics using admin client
  const [
    { count: totalEvents },
    { count: totalArtists },
    { count: totalBookings },
    { count: totalVotes },
    { data: ticketRevenue },
    { data: voteRevenue },
    { data: recentTickets },
    { data: recentVotes }
  ] = await Promise.all([
    adminClient.from('events').select('*', { count: 'exact', head: true }),
    adminClient.from('artists').select('*', { count: 'exact', head: true }),
    adminClient.from('tickets').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    adminClient.from('votes').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    adminClient.from('tickets').select('total_amount').eq('payment_status', 'completed'),
    adminClient.from('votes').select('amount_paid').eq('payment_status', 'completed'),
    adminClient
      .from('tickets')
      .select('*, event:events(title)')
      .order('created_at', { ascending: false })
      .limit(5),
    adminClient
      .from('votes')
      .select('*, artist:artists(stage_name, name), event:events(title)')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const totalRevenue = (ticketRevenue?.reduce((sum, ticket) => sum + Number(ticket.total_amount), 0) || 0) +
                        (voteRevenue?.reduce((sum, vote) => sum + Number(vote.amount_paid), 0) || 0);

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
      title: 'Total Bookings',
      value: totalBookings || 0,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Total Votes',
      value: totalVotes || 0,
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
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
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Ticket Bookings</h2>
            <TicketIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentTickets && recentTickets.length > 0 ? (
            <div className="space-y-3">
              {recentTickets.map((ticket: any) => (
                <div key={ticket.id} className="flex items-start justify-between border-b pb-3 last:border-0">
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
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Votes</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentVotes && recentVotes.length > 0 ? (
            <div className="space-y-3">
              {recentVotes.map((vote: any) => (
                <div key={vote.id} className="flex items-start justify-between border-b pb-3 last:border-0">
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