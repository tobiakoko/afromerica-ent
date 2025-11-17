import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default async function PaymentVerifyPage({
  searchParams,
}: {
  searchParams: { reference: string };
}) {
  const { reference } = searchParams;

  if (!reference) {
    redirect('/');
  }

  const supabase = await createClient();

  // Verify with Paystack
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();
  const success = data.status && data.data.status === 'success';

  // Get transaction details
  const metadata = data.data?.metadata || {};
  const type = metadata.type;

  let details = null;

  if (success && type === 'ticket') {
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, events(title)')
      .eq('payment_reference', reference)
      .single();
    details = booking;
  } else if (success && type === 'vote') {
    const { data: purchase } = await supabase
      .from('vote_purchases')
      .select('*')
      .eq('reference', reference)
      .single();
    details = purchase;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container-wide max-w-2xl">
        <Card className="p-8 text-center">
          {success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your payment has been confirmed
              </p>

              {type === 'ticket' && details && (
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                  <p className="text-2xl font-bold mb-4">{details.booking_reference}</p>
                  <p className="text-sm">
                    Event: <strong>{details.events?.title}</strong>
                  </p>
                  <p className="text-sm">
                    Amount: <strong>₦{details.total_amount.toLocaleString()}</strong>
                  </p>
                </div>
              )}

              {type === 'vote' && details && (
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Purchase Reference</p>
                  <p className="text-2xl font-bold mb-4">{details.reference}</p>
                  <p className="text-sm">
                    Votes: <strong>{details.total_votes}</strong>
                  </p>
                  <p className="text-sm">
                    Amount: <strong>₦{details.total_amount.toLocaleString()}</strong>
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-6">
                A confirmation email has been sent to your email address
              </p>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/">Go Home</Link>
                </Button>
                {type === 'vote' && (
                  <Button variant="outline" asChild>
                    <Link href="/events/december-showcase-2025/leaderboard">
                      View Leaderboard
                    </Link>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't process your payment. Please try again.
              </p>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/">Go Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}