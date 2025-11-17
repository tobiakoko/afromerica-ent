import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, method } = body;

    const supabase = await createClient();

    // Delete any existing OTPs for this email/phone
    const deleteQuery = supabase.from('otp_codes').delete();
    
    if (method === 'email') {
      deleteQuery.eq('email', email);
    } else {
      deleteQuery.eq('phone', phone);
    }

    await deleteQuery;

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
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}