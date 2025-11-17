import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateOTP, hashOTP } from '@/lib/otp/generator';
import { sendOTPEmail, sendOTPSMS } from '@/lib/otp/sender';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, method } = body;

    if (!method || (method !== 'email' && method !== 'sms')) {
      return NextResponse.json(
        { success: false, message: 'Invalid method' },
        { status: 400 }
      );
    }

    if (method === 'email' && !email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (method === 'sms' && !phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for recent OTP requests (rate limiting)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: recentOTP } = await supabase
      .from('otp_codes')
      .select('id')
      .or(email ? `email.eq.${email}` : `phone.eq.${phone}`)
      .gte('created_at', fiveMinutesAgo)
      .single();

    if (recentOTP) {
      return NextResponse.json(
        { success: false, message: 'Please wait 5 minutes before requesting another code' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP(6);
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: insertError } = await supabase.from('otp_codes').insert({
      email: method === 'email' ? email : null,
      phone: method === 'sms' ? phone : null,
      code: hashedOTP,
      method,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    });

    if (insertError) {
      console.error('Database error:', insertError);
      throw new Error('Failed to store verification code');
    }

    // Send OTP
    if (method === 'email') {
      await sendOTPEmail(email, otp);
    } else {
      await sendOTPSMS(phone, otp);
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${method === 'email' ? 'email' : 'phone'}`,
      expiresIn: 600, // seconds
    });
  } catch (error: any) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
