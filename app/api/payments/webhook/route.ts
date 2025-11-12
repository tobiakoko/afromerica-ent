import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/payments/paystack';
import { processPaymentSuccess, processPaymentFailure, type PaymentType } from '@/lib/payments/payment-handlers';
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
  const { reference, metadata, paid_at } = event.data;
  const paymentType = metadata?.type as PaymentType;

  console.log('Processing successful charge:', reference, 'Type:', paymentType);

  try {
    await processPaymentSuccess(reference, paymentType, paid_at);
  } catch (error) {
    console.error('Error processing charge success:', error);
  }
}
 
async function handleChargeFailed(event: WebhookEvent) {
  const { reference, metadata } = event.data;
  const paymentType = metadata?.type as PaymentType;

  console.log('Processing failed charge:', reference, 'Type:', paymentType);

  try {
    await processPaymentFailure(reference, paymentType);
  } catch (error) {
    console.error('Error processing charge failure:', error);
  }
}