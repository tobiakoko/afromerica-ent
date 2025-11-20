import { createAdminClient } from '@/utils/supabase/admin';

export type PaymentType = 'ticket' | 'vote';

/**
 * Process payment status update for tickets or votes
 * This function is called after payment verification or webhook
 */
export async function processPayment(
  reference: string,
  type: PaymentType,
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
  paidAt?: string
) {
  const supabase = createAdminClient();

  if (type === 'ticket') {
    const { error } = await supabase
      .from('tickets')
      .update({
        payment_status: status,
        paystack_reference: reference,
        ...(status === 'completed' && paidAt
          ? { verified_at: paidAt }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating ticket payment status:', error);
      throw new Error('Failed to update ticket payment status');
    }
  } else if (type === 'vote') {
    const { error } = await supabase
      .from('votes')
      .update({
        payment_status: status,
        paystack_reference: reference,
        ...(status === 'completed' && paidAt
          ? { verified_at: paidAt }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating vote payment status:', error);
      throw new Error('Failed to update vote payment status');
    }
  } else {
    throw new Error(`Unknown payment type: ${type}`);
  }
}
