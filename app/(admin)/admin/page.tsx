import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch statistics
  const [
    { count: totalEvents },
    { count: totalArtists },
    { count: totalBookings },
    { count: totalVotes },
    { data: ticketRevenue },
    { data: voteRevenue }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('artists').select('*', { count: 'exact', head: true }),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    supabase.from('votes').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    supabase.from('tickets').select('total_amount').eq('payment_status', 'completed'),
    supabase.from('votes').select('amount_paid').eq('payment_status', 'completed'),
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
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* Add recent bookings, votes, etc. */}
        <p className="text-muted-foreground">No recent activity</p>
      </Card>
    </div>
  );
}