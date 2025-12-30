import { createAdminClient } from "@/utils/supabase/admin";
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
  const supabase = createAdminClient();
  
  const { data: purchases } = await supabase
    .from('votes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: artistStats } = await supabase
    .from('artists')
    .select('stage_name, total_votes, total_vote_amount, rank')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('rank', { ascending: true });

  const { data: finaleConfigs } = await supabase
    .from('finale_configs')
    .select('event_id, settings, current_stage, current_status')
    .limit(5);

  const totalVotesCast =
    artistStats?.reduce((sum, a) => sum + (a.total_votes || 0), 0) ?? 0
  const totalRevenue =
    artistStats?.reduce((sum, a) => sum + Number(a.total_vote_amount || 0), 0) ?? 0
  const totalPurchases =
    purchases?.filter((p) => p.payment_status === 'completed').length ?? 0

  const formatDate = (value?: string | null) => {
    if (!value) return '—'
    const date = new Date(value)
    if (isNaN(date.getTime())) return '—'
    return format(date, 'MMM d, yyyy HH:mm')
  }

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
          <p className="text-3xl font-bold">{totalVotesCast.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Purchases</p>
          <p className="text-3xl font-bold">{totalPurchases}</p>
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
                <TableCell>₦{Number(artist.total_vote_amount).toLocaleString()}</TableCell>
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
                <TableCell>{purchase.total_votes ?? 0}</TableCell>
                <TableCell>₦{Number(purchase.total_amount || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    purchase.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    purchase.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {purchase.payment_status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(purchase.purchased_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Finale Codes (from finale_configs.settings) */}
      {finaleConfigs && finaleConfigs.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Finale Codes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {finaleConfigs.map((config) => {
              const settings = (config.settings || {}) as {
                judge_codes?: string[]
                in_house_code?: string
                online_code?: string
              }

              return (
                <div key={config.event_id} className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Event: {config.event_id}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold">Judges</p>
                      <p className="font-mono text-xs">
                        {settings.judge_codes?.join(', ') || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">In-house</p>
                      <p className="font-mono text-xs">
                        {settings.in_house_code || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Online</p>
                      <p className="font-mono text-xs">
                        {settings.online_code || 'Not set'}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Stage: {config.current_stage || 'N/A'} | Status: {config.current_status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
