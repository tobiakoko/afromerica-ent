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

    const supabase = createAdminClient();

    // Check if this webhook event has already been processed (idempotency)
    const eventId = event.id || event.data?.id;
    const paymentReference = event.data?.reference;

    if (eventId) {
      const { data: existingLog } = await supabase
        .from('webhook_logs')
        .select('id, processed')
        .eq('source', 'paystack')
        .eq('reference', eventId.toString())
        .eq('processed', true)
        .single();

      if (existingLog) {
        console.log('Webhook already processed:', eventId);
        return NextResponse.json({ received: true, message: 'Already processed' });
      }
    }

    // Additional idempotency check: ensure vote/ticket hasn't already been completed
    if (event.event === 'charge.success' && paymentReference) {
      const metadata = event.data?.metadata;

      if (metadata?.type === 'vote') {
        const { data: existingVote } = await supabase
          .from('votes')
          .select('payment_status')
          .eq('payment_reference', paymentReference)
          .single();

        if (existingVote && existingVote.payment_status === 'completed') {
          console.log('Vote already marked as completed:', paymentReference);
          return NextResponse.json({ received: true, message: 'Payment already processed' });
        }
      } else if (metadata?.type === 'ticket') {
        const { data: existingTicket } = await supabase
          .from('tickets')
          .select('payment_status')
          .eq('payment_reference', paymentReference)
          .single();

        if (existingTicket && existingTicket.payment_status === 'completed') {
          console.log('Ticket already marked as completed:', paymentReference);
          return NextResponse.json({ received: true, message: 'Payment already processed' });
        }
      }
    }

    // Log the webhook event
    const { data: webhookLog } = await supabase
      .from('webhook_logs')
      .insert({
        source: 'paystack',
        event_type: event.event,
        reference: eventId ? eventId.toString() : paymentReference,
        payload: event,
        headers: {
          signature,
        },
        processed: false,
      })
      .select()
      .single();

    const webhookLogId = webhookLog?.id;

    // Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, metadata, customer, amount, paid_at } = event.data;
      
      const supabase = createAdminClient();

      if (metadata.type === 'ticket') {
        // Update tickets
        const { data: ticket, error: updateError } = await supabase
          .from('tickets')
          .update({
            payment_status: 'completed',
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
            payment_status: 'completed',
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

      // Mark webhook as processed
      if (webhookLogId) {
        await supabase
          .from('webhook_logs')
          .update({ processed: true, processed_at: new Date().toISOString() })
          .eq('id', webhookLogId);
      }

      return NextResponse.json({ received: true });
    }

    // Handle failed charge
    if (event.event === 'charge.failed') {
      const { reference, metadata } = event.data;

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

      // Mark webhook as processed
      if (webhookLogId) {
        await supabase
          .from('webhook_logs')
          .update({ processed: true, processed_at: new Date().toISOString() })
          .eq('id', webhookLogId);
      }

      return NextResponse.json({ received: true });
    }

    // Mark other events as processed (even if we don't handle them)
    if (webhookLogId) {
      await supabase
        .from('webhook_logs')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('id', webhookLogId);
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