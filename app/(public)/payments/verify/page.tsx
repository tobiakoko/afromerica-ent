import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { PAYSTACK_CONFIG } from "@/lib/constants";
import { sendVoteConfirmation } from "@/lib/emails/render";

// This page must be dynamic as it requires search params
export const dynamic = 'force-dynamic';

export default async function PaymentVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  // Paystack sends 'trxref' parameter, but we also support 'reference' for manual testing
  const reference = params.trxref || params.reference;

  console.log('Payment verification params:', params);

  if (!reference) {
    console.error('No reference found in URL params');
    redirect('/');
  }

  // Use admin client to bypass RLS for payment verification
  const supabase = createAdminClient();

  // Verify with Paystack
  const response = await fetch(
    `${PAYSTACK_CONFIG.API_BASE_URL}${PAYSTACK_CONFIG.VERIFY_ENDPOINT}/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store', // Don't cache verification requests
    }
  );

  const data = await response.json();

  console.log('Paystack verification response:', {
    status: data.status,
    transactionStatus: data.data?.status,
    reference,
    fullData: data,
  });

  const success = data.status && data.data?.status === 'success';

  // Get transaction details
  const metadata = data.data?.metadata || {};
  const type = metadata.type;

  let details = null;

  // Update payment status in database if successful
  if (success) {
    if (type === 'ticket') {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .update({
          payment_status: 'completed',
          paystack_reference: data.data.reference,
        })
        .eq('payment_reference', reference)
        .select('*, events(title)')
        .single();

      if (error) {
        console.error('Error updating ticket:', error);
      }
      details = ticket;
    } else if (type === 'vote') {
      const { data: vote, error } = await supabase
        .from('votes')
        .update({
          payment_status: 'completed',
          paystack_reference: data.data.reference,
          verified_at: new Date().toISOString(),
        })
        .eq('payment_reference', reference)
        .select('*, artists(name, stage_name)')
        .single();

      if (error) {
        console.error('Error updating vote:', error);
      } else if (vote) {
        // Send confirmation email or text message
        try {
          await sendVoteConfirmation({
            to: vote.user_identifier,
            artistName: vote.artists?.stage_name || vote.artists?.name || 'Artist',
            votes: vote.vote_count,
            amount: vote.amount_paid,
            reference: vote.payment_reference,
          });
          console.log('Vote confirmation email sent to:', vote.user_identifier);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the whole transaction if email fails
        }
      }
      details = vote;
    }
  } else {
    // Payment failed or pending - just fetch the record
    if (type === 'ticket') {
      const { data: ticket } = await supabase
        .from('tickets')
        .select('*, events(title)')
        .eq('payment_reference', reference)
        .single();
      details = ticket;
    } else if (type === 'vote') {
      const { data: vote } = await supabase
        .from('votes')
        .select('*, artists(name, stage_name)')
        .eq('payment_reference', reference)
        .single();
      details = vote;
    }
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
                  <p className="text-2xl font-bold mb-4">{details.payment_reference}</p>
                  <p className="text-sm">
                    Votes: <strong>{details.vote_count}</strong>
                  </p>
                  <p className="text-sm">
                    Amount: <strong>₦{details.amount_paid.toLocaleString()}</strong>
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
                We couldn&apos;t process your payment. Please try again.
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