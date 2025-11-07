import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment, convertFromKobo } from '@/lib/payments/paystack';
import { createClient } from '@/lib/supabase/server';
import type { PaymentVerifyResponse } from '@/lib/payments/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment reference is required',
        } as PaymentVerifyResponse,
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment service not configured',
        } as PaymentVerifyResponse,
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await verifyPayment(reference, secretKey);

    if (!response.status || !response.data) {
      return NextResponse.json(
        {
          success: false,
          message: response.message || 'Failed to verify payment',
        } as PaymentVerifyResponse,
        { status: 400 }
      );
    }

    const { data } = response;

    // Map Paystack status to our status
    let paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    switch (data.status) {
      case 'success':
        paymentStatus = 'completed';
        break;
      case 'failed':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'pending';
    }

    // Process based on payment type from metadata
    const metadata = data.metadata;
    const paymentType = metadata?.type;

    if (paymentStatus === 'completed') {
      const supabase = await createClient();

      if (paymentType === 'voting') {
        // Update vote purchase status
        const { error: updateError } = await supabase
          .from('vote_purchases')
          .update({ payment_status: 'completed' })
          .eq('payment_reference', reference);

        if (updateError) {
          console.error('Error updating vote purchase:', updateError);
        } else {
          // Apply votes to artists
          const { data: purchase } = await supabase
            .from('vote_purchases')
            .select('items')
            .eq('payment_reference', reference)
            .single();

          if (purchase && purchase.items) {
            const items = purchase.items as any[];
            for (const item of items) {
              await supabase.rpc('apply_votes_to_artist', {
                artist_id: item.artistId,
                vote_count: item.totalVotes,
              });
            }
          }
        }
      } else if (paymentType === 'booking') {
        // Update booking status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed', payment_status: 'completed' })
          .eq('payment_reference', reference);

        if (updateError) {
          console.error('Error updating booking:', updateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        reference: data.reference,
        amount: convertFromKobo(data.amount),
        status: paymentStatus,
        paidAt: data.paid_at,
        metadata,
      },
    } as PaymentVerifyResponse);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while verifying payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as PaymentVerifyResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Also support POST for programmatic verification
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment reference is required',
        } as PaymentVerifyResponse,
        { status: 400 }
      );
    }

    // Create a new URL with the reference as a query param
    const url = new URL(request.url);
    url.searchParams.set('reference', reference);

    // Reuse the GET handler
    const modifiedRequest = new NextRequest(url, request);
    return GET(modifiedRequest);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while verifying payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as PaymentVerifyResponse,
      { status: 500 }
    );
  }
}
