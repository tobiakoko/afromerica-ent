import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { paystackClient } from '@/lib/paystack/client';
import crypto from 'crypto';
import { CURRENCY, PAYMENT_STATUS, APP_METADATA } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, amount, ...metadata } = body;

    // Validate required fields
    if (!type || !email || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount (Paystack minimum is ₦100 = 10,000 kobo)
    const amountInKobo = Math.round(amount * 100);
    if (amountInKobo < 10000) {
      return NextResponse.json(
        { success: false, message: 'Amount must be at least ₦100' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `AFR-${type.toUpperCase()}-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Use admin client to bypass RLS for payment initialization
    const supabase = createAdminClient();

    // Initialize Paystack payment
    console.log('Initializing Paystack payment:', {
      email,
      amount: Math.round(amount * 100),
      reference,
      callback_url: `${APP_METADATA.URL}/payments/verify?reference=${reference}`,
    });

    let paymentData;
    try {
      paymentData = await paystackClient.initializeTransaction({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference,
        callback_url: `${APP_METADATA.URL}/payments/verify?reference=${reference}`,
        metadata: {
          type,
          ...metadata,
          reference,
        },
        channels: ['card', 'bank', 'ussd', 'bank_transfer'], // Available payment methods
      });

      console.log('Paystack response:', paymentData);

      if (!paymentData.status) {
        console.error('Paystack initialization failed:', paymentData);
        throw new Error(paymentData.message || 'Payment initialization failed');
      }
    } catch (paystackError: any) { // FIXME: figure out how to fix this type error
      console.error('Paystack API error:', {
        message: paystackError.message,
        error: paystackError,
      });
      throw new Error(`Paystack error: ${paystackError.message}`);
    }

    // Save pending transaction to database
    if (type === 'ticket') {
      const { error } = await supabase.from('tickets').insert({
        event_id: metadata.eventId,
        user_email: email,
        user_name: metadata.fullName || '',
        user_phone: metadata.phone || '',
        quantity: metadata.quantity || 1,
        price_per_ticket: metadata.pricePerTicket || amount,
        total_amount: amount,
        currency: CURRENCY.CODE,
        payment_status: PAYMENT_STATUS.PENDING,
        payment_reference: reference,
        ticket_type_id: metadata.ticketTypeId || null,
        metadata: metadata,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create ticket record');
      }
    } else if (type === 'vote') {
      const voteCount = metadata.voteCount || metadata.votes || 0;

      if (voteCount <= 0) {
        throw new Error('Vote count must be greater than 0');
      }

      const { error } = await supabase.from('votes').insert({
        payment_reference: reference,
        user_identifier: email,
        user_name: metadata.userName || '',
        artist_id: metadata.artistId,
        event_id: metadata.eventId || null,
        vote_count: voteCount,
        amount_paid: amount,
        currency: CURRENCY.CODE,
        payment_status: PAYMENT_STATUS.PENDING,
        items: metadata,
        metadata: metadata,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create vote record');
      }
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
      accessCode: paymentData.data.access_code,
    });
  } catch (error: any) {  // FIX ME: figure out how to fix this type error
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}