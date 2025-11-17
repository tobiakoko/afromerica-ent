import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { hashOTP, isOTPExpired } from '@/lib/otp/generator';
import { SignJWT } from 'jose';

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
})();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, code, method } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (!method || (method !== 'email' && method !== 'sms')) {
      return NextResponse.json(
        { success: false, message: 'Invalid method' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find OTP record
    const query = supabase
      .from('otp_codes')
      .select('*')
      .eq('method', method);

    if (method === 'email') {
      query.eq('email', email);
    } else {
      query.eq('phone', phone);
    }

    const { data: otpRecord, error } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Verification code not found' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(new Date(otpRecord.expires_at))) {
      // Clean up expired OTP
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
      
      return NextResponse.json(
        { success: false, message: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Check attempts (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
      
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP
    const hashedInput = hashOTP(code);
    
    if (hashedInput !== otpRecord.code) {
      // Increment attempts
      await supabase
        .from('otp_codes')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid verification code',
          attemptsLeft: 3 - (otpRecord.attempts + 1)
        },
        { status: 400 }
      );
    }

    // OTP is valid - delete it and generate verification token
    await supabase.from('otp_codes').delete().eq('id', otpRecord.id);

    // Generate JWT token valid for 1 hour
    const token = await new SignJWT({
      email: method === 'email' ? email : null,
      phone: method === 'sms' ? phone : null,
      verified: true,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      token,
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);

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