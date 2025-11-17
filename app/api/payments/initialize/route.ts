import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { paystackClient } from '@/lib/paystack/client';
import crypto from 'crypto';

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

    // Generate unique reference
    const reference = `AFR-${type.toUpperCase()}-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const supabase = await createClient();

    // Initialize Paystack payment
    const paymentData = await paystackClient.initializeTransaction({
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify?reference=${reference}`,
      metadata: {
        type,
        ...metadata,
        reference,
      },
      channels: ['card', 'bank', 'ussd', 'bank_transfer'], // Available payment methods
    });

    if (!paymentData.status) {
      throw new Error(paymentData.message || 'Payment initialization failed');
    }

    // Save pending transaction to database
    if (type === 'ticket') {
      const { error } = await supabase.from('bookings').insert({
        event_id: metadata.eventId,
        email,
        full_name: metadata.fullName || '',
        phone: metadata.phone || '',
        total_amount: amount,
        currency: 'NGN',
        payment_status: 'pending',
        payment_reference: reference,
        booking_reference: reference,
        metadata: metadata,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create booking record');
      }
    } else if (type === 'vote') {
      const { error } = await supabase.from('vote_purchases').insert({
        reference,
        email,
        total_votes: metadata.votes || 0,
        total_amount: amount,
        currency: 'NGN',
        payment_status: 'pending',
        items: metadata,
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create vote purchase record');
      }
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
      accessCode: paymentData.data.access_code,
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}