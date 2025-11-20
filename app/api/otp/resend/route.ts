import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, method } = body;

    const supabase = await createClient();

    // Mark any existing OTPs for this identifier as used
    const identifier = method === 'email' ? email : phone;

    await supabase
      .from('vote_validations')
      .update({ is_used: true })
      .eq('identifier', identifier)
      .eq('is_used', false);

    // Forward to send endpoint
    const sendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/otp/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await sendResponse.json();
    return NextResponse.json(data, { status: sendResponse.status });
  } catch (error: any) {
    console.error('OTP resend error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message })
      },
      { status: 500 }
    );
  }
}