import { NextRequest, NextResponse } from 'next/server';
import {
  initializePayment,
  generatePaymentReference,
  convertToKobo,
} from '@/lib/payments/paystack';
import type { PaymentInitializeRequest, PaymentInitializeResponse } from '@/lib/payments/types';
 
export async function POST(request: NextRequest) {
  try {
    const body: PaymentInitializeRequest = await request.json();
 
    // Validate required fields
    if (!body.email || !body.amount || !body.type) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: email, amount, type',
        } as PaymentInitializeResponse,
        { status: 400 }
      );
    }
 
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
        } as PaymentInitializeResponse,
        { status: 400 }
      );
    }
 
    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Amount must be greater than 0',
        } as PaymentInitializeResponse,
        { status: 400 }
      );
    }
 
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment service not configured',
        } as PaymentInitializeResponse,
        { status: 500 }
      );
    }
 
    // Generate unique reference
    const reference = generatePaymentReference(
      body.type === 'voting' ? 'VOTE' : 'BOOK'
    );
 
    // Convert amount to kobo
    const currency = body.currency || 'NGN';
    const amountInKobo = convertToKobo(body.amount, currency);
 
    // Prepare callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const callbackUrl =
      body.callbackUrl ||
      `${baseUrl}/payments/verify?reference=${reference}&type=${body.type}`;
 
    // Initialize payment with Paystack
    const response = await initializePayment(
      {
        email: body.email,
        amount: amountInKobo,
        reference,
        currency,
        callback_url: callbackUrl,
        metadata: {
          ...body.metadata,
          reference,
          type: body.type,
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      },
      secretKey
    );
 
    if (!response.status) {
      return NextResponse.json(
        {
          success: false,
          message: response.message || 'Failed to initialize payment',
        } as PaymentInitializeResponse,
        { status: 400 }
      );
    }
 
    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        reference,
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
      },
    } as PaymentInitializeResponse);
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while initializing payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as PaymentInitializeResponse,
      { status: 500 }
    );
  }
}