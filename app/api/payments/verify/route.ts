import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment, convertFromKobo } from '@/lib/paystack/paystack.service';
import { processPayment, type PaymentType } from '@/lib/paystack/payment-handlers';
import type { PaymentVerifyResponse } from '@/lib/paystack/types';
import { PAYMENT_STATUS } from '@/lib/constants';
 
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
        paymentStatus = PAYMENT_STATUS.COMPLETED;
        break;
      case 'failed':
        paymentStatus = PAYMENT_STATUS.FAILED;
        break;
      default:
        paymentStatus = PAYMENT_STATUS.PENDING;
    }

    // Process payment using shared handler
    const metadata = data.metadata;
    const paymentType = metadata?.type as PaymentType;

    if (paymentStatus === PAYMENT_STATUS.COMPLETED || paymentStatus === PAYMENT_STATUS.FAILED) {
      try {
        await processPayment(
          reference,
          paymentType,
          paymentStatus,
          data.paid_at
        );
      } catch (error) {
        console.error('Error processing payment:', error);
        // Continue to return response even if update fails
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