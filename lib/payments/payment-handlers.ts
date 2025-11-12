// Shared payment processing handlers
// Consolidates duplicate logic from verify and webhook routes

import { createClient } from '@/utils/supabase/server';

export type PaymentType = 'voting' | 'booking';
export type PaymentAction = 'completed' | 'failed';

/**
 * Process a successful payment - update database and apply votes if needed
 */
export async function processPaymentSuccess(
  reference: string,
  paymentType: PaymentType,
  paidAt?: string
): Promise<void> {
  const supabase = await createClient();

  if (paymentType === 'voting') {
    // Update vote purchase status
    const { error: updateError } = await supabase
      .from('vote_purchases')
      .update({
        payment_status: 'completed',
        ...(paidAt && { purchased_at: paidAt }),
      })
      .eq('payment_reference', reference);

    if (updateError) {
      console.error('Error updating vote purchase:', updateError);
      throw updateError;
    }

    // Get purchase details and apply votes to artists
    const { data: purchase } = await supabase
      .from('vote_purchases')
      .select('items')
      .eq('payment_reference', reference)
      .single();

    if (purchase && purchase.items) {
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
          console.log(`Applied ${item.totalVotes} votes to artist ${item.artistId}`);
        }
      }
    }
  } else if (paymentType === 'booking') {
    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'completed',
      })
      .eq('payment_reference', reference);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      throw updateError;
    }

    console.log('Booking confirmed:', reference);

    // TODO: Send confirmation email to customer
    // TODO: Send notification to event organizer
  }
}

/**
 * Process a failed payment - update database status
 */
export async function processPaymentFailure(
  reference: string,
  paymentType: PaymentType
): Promise<void> {
  const supabase = await createClient();

  if (paymentType === 'voting') {
    const { error } = await supabase
      .from('vote_purchases')
      .update({ payment_status: 'failed' })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating vote purchase:', error);
      throw error;
    }
  } else if (paymentType === 'booking') {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
      })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
}

/**
 * Generic payment processor - handles both success and failure
 */
export async function processPayment(
  reference: string,
  paymentType: PaymentType,
  action: PaymentAction,
  paidAt?: string
): Promise<void> {
  if (action === 'completed') {
    await processPaymentSuccess(reference, paymentType, paidAt);
  } else if (action === 'failed') {
    await processPaymentFailure(reference, paymentType);
  }
}
