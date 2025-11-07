import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature, convertFromKobo } from '@/lib/payments/paystack';
import { createClient } from '@/lib/supabase/server';
import type { WebhookEvent } from '@/lib/payments/types';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('Paystack secret key not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate webhook signature
    const isValid = validateWebhookSignature(body, signature, secretKey);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the event
    const event: WebhookEvent = JSON.parse(body);

    console.log('Paystack webhook event:', event.event, event.data.reference);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event);
        break;

      case 'charge.failed':
        await handleChargeFailed(event);
        break;

      case 'transfer.success':
      case 'transfer.failed':
      case 'transfer.reversed':
        // Handle transfer events if needed
        console.log('Transfer event:', event.event);
        break;

      default:
        console.log('Unhandled event type:', event.event);
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

async function handleChargeSuccess(event: WebhookEvent) {
  const { reference, metadata } = event.data;
  const paymentType = metadata?.type;

  const supabase = await createClient();

  console.log('Processing successful charge:', reference, 'Type:', paymentType);

  if (paymentType === 'voting') {
    // Update vote purchase
    const { error: updateError } = await supabase
      .from('vote_purchases')
      .update({
        payment_status: 'completed',
        purchased_at: event.data.paid_at,
      })
      .eq('payment_reference', reference);

    if (updateError) {
      console.error('Error updating vote purchase:', updateError);
      return;
    }

    // Get purchase details
    const { data: purchase } = await supabase
      .from('vote_purchases')
      .select('items')
      .eq('payment_reference', reference)
      .single();

    if (purchase && purchase.items) {
      // Apply votes to artists
      const items = purchase.items as any[];
      console.log('Applying votes for', items.length, 'items');

      for (const item of items) {
        const { error: voteError } = await supabase.rpc('apply_votes_to_artist', {
          artist_id: item.artistId,
          vote_count: item.totalVotes,
        });

        if (voteError) {
          console.error('Error applying votes:', voteError);
        } else {
          console.log(
            `Applied ${item.totalVotes} votes to artist ${item.artistId}`
          );
        }
      }
    }
  } else if (paymentType === 'booking') {
    // Update booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'completed',
      })
      .eq('payment_reference', reference);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return;
    }

    console.log('Booking confirmed:', reference);

    // TODO: Send confirmation email to customer
    // TODO: Send notification to event organizer
  }
}

async function handleChargeFailed(event: WebhookEvent) {
  const { reference, metadata } = event.data;
  const paymentType = metadata?.type;

  const supabase = await createClient();

  console.log('Processing failed charge:', reference, 'Type:', paymentType);

  if (paymentType === 'voting') {
    // Update vote purchase
    const { error } = await supabase
      .from('vote_purchases')
      .update({ payment_status: 'failed' })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating vote purchase:', error);
    }
  } else if (paymentType === 'booking') {
    // Update booking
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
      })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating booking:', error);
    }
  }
}
