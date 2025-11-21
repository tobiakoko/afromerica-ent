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

    // Find OTP record using identifier (email or phone)
    const identifier = method === 'email' ? email : phone;

    const { data: otpRecord, error } = await supabase
      .from('vote_validations')
      .select('*')
      .eq('identifier', identifier)
      .eq('method', method)
      .eq('is_used', false)
      .eq('is_verified', false)
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
      // Mark as used
      await supabase
        .from('vote_validations')
        .update({ is_used: true })
        .eq('id', otpRecord.id);

      return NextResponse.json(
        { success: false, message: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Check attempts (max attempts from database)
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      await supabase
        .from('vote_validations')
        .update({ is_used: true })
        .eq('id', otpRecord.id);

      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP
    const hashedInput = hashOTP(code);

    if (hashedInput !== otpRecord.verification_code) {
      // Increment attempts
      await supabase
        .from('vote_validations')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification code',
          attemptsLeft: otpRecord.max_attempts - (otpRecord.attempts + 1)
        },
        { status: 400 }
      );
    }

    // OTP is valid - mark it as verified and used
    await supabase
      .from('vote_validations')
      .update({
        is_verified: true,
        is_used: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', otpRecord.id);

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
  } catch (error: any) { //FIXME: figure out how to get rid of this typescript error
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