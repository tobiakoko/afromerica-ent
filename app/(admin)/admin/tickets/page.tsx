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

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, events(title)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ticket Sales</h1>
        <p className="text-muted-foreground">View all ticket purchases</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-sm">
                  {booking.booking_reference}
                </TableCell>
                <TableCell>{booking.events?.title}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.full_name}</p>
                    <p className="text-sm text-muted-foreground">{booking.email}</p>
                  </div>
                </TableCell>
                <TableCell>₦{booking.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    booking.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(booking.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!bookings?.length && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}