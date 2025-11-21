import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';
import { sendTicketConfirmation, sendVoteConfirmation } from '@/lib/emails/render';
import { PAYMENT_STATUS } from '@/lib/constants';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log('Webhook event received:', event.event);

    // Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, metadata, customer, amount, paid_at } = event.data;
      
      const supabase = createAdminClient();

      if (metadata.type === 'ticket') {
        // Update tickets
        const { data: ticket, error: updateError } = await supabase
          .from('tickets')
          .update({
            payment_status: PAYMENT_STATUS.SUCCESS,
            paystack_reference: reference,
            verified_at: paid_at,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_reference', reference)
          .select(`
            *,
            events (
              title,
              event_date,
              venue,
              venue_address,
              city
            )
          `)
          .single();

        if (updateError) {
          console.error('Error updating tickets:', updateError);
          throw updateError;
        }

        if (ticket) {
          // Send confirmation email
          await sendTicketConfirmation({
            to: customer.email,
            booking: {
              ...ticket,
              event: ticket.events,
            },
          });

          // console.log(`Ticket confirmation sent to ${customer.email}`);
        }
      } else if (metadata.type === 'vote') {
        // Update vote purchase
        const { error: voteError } = await supabase
          .from('votes')
          .update({
            payment_status: PAYMENT_STATUS.SUCCESS,
            paystack_reference: reference,
            verified_at: paid_at,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_reference', reference);

        if (voteError) {
          console.error('Error updating vote purchase:', voteError);
          throw voteError;
        }

        // Send confirmation email
        await sendVoteConfirmation({
          to: customer.email,
          artistName: metadata.artistName || 'Artist',
          votes: metadata.votes || 0,
          amount: amount / 100,
        });

      //  console.log(`Vote confirmation sent to ${customer.email}`);
      }

      return NextResponse.json({ received: true });
    }

    // Handle failed charge
    if (event.event === 'charge.failed') {
      const { reference, metadata } = event.data;
      const supabase = createAdminClient();

      if (metadata.type === 'ticket') {
        await supabase
          .from('tickets')
          .update({
            payment_status: PAYMENT_STATUS.FAILED,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_reference', reference);
      } else if (metadata.type === 'vote') {
        await supabase
          .from('votes')
          .update({
            payment_status: PAYMENT_STATUS.FAILED,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_reference', reference);
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}