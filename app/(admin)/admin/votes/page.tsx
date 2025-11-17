import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function AdminVotesPage() {
  const supabase = await createClient();
  
  const { data: purchases } = await supabase
    .from('vote_purchases')
    .select('*')
    .order('purchased_at', { ascending: false })
    .limit(100);

  const { data: artistStats } = await supabase
    .from('pilot_artists')
    .select('stage_name, total_votes, total_amount, rank')
    .order('rank', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voting Analytics</h1>
        <p className="text-muted-foreground">Track vote purchases and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Votes Cast</p>
          <p className="text-3xl font-bold">
            {artistStats?.reduce((sum, a) => sum + a.total_votes, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">
            ₦{artistStats?.reduce((sum, a) => sum + Number(a.total_amount), 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Purchases</p>
          <p className="text-3xl font-bold">
            {purchases?.filter(p => p.payment_status === 'completed').length || 0}
          </p>
        </Card>
      </div>

      {/* Artist Rankings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Artist Rankings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Total Votes</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artistStats?.map((artist) => (
              <TableRow key={artist.stage_name}>
                <TableCell className="font-bold">#{artist.rank}</TableCell>
                <TableCell>{artist.stage_name}</TableCell>
                <TableCell>{artist.total_votes.toLocaleString()}</TableCell>
                <TableCell>₦{Number(artist.total_amount).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Recent Purchases */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases?.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-mono text-sm">{purchase.reference}</TableCell>
                <TableCell>{purchase.email}</TableCell>
                <TableCell>{purchase.total_votes}</TableCell>
                <TableCell>₦{purchase.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    purchase.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    purchase.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {purchase.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(purchase.purchased_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

