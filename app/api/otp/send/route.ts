import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateOTP, hashOTP } from '@/lib/otp/generator';
import { sendOTPEmail, sendOTPSMS } from '@/lib/otp/sender';
import { SendOTPSchema, validateRequest } from '@/lib/validations/api'
import { errorResponse, ErrorCodes } from '@/lib/api/response'

// Disable caching for POST endpoints
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = validateRequest(SendOTPSchema, body)
  if (!validation.success) {
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      'Invalid request data',
      validation.error.issues
    )
  }

  const { email, phone, method } = validation.data

  try {
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

    // TODO: Add IP-based rate limiting
    // const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    // const ipRateLimit = await checkRateLimit(ip, 10, 3600);

    // TODO: Add account-based rate limiting
    // const accountRateLimit = await checkRateLimit(email || phone, 5, 3600);

    // TODO: Implement backoff
    // const attempts = await getRecentAttempts(email || phone);
    // const waitTime = Math.min(300, Math.pow(2, attempts) * 60);

    // TODO: Add CAPTCHA after 3 failed verifications
    // if (attempts >= 3 && !captchaToken) {
    //   return NextResponse.json({ requiresCaptcha: true }, { status: 429 });
    // }

    // Generate OTP
    const otp = generateOTP(6);
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: insertError } = await supabase.from('vote_validations').insert({
      identifier: method === 'email' ? email : phone,
      verification_code: hashedOTP,
      method,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    });

    if (insertError) {
      console.error('Database error:', insertError);
      throw new Error('Failed to store verification code');
    }

    // Send OTP
    try {
      if (method === 'email') {
        await sendOTPEmail(email!, otp);
        console.log('OTP sent to email:', email, 'Code:', otp); // For development
      } else {
        await sendOTPSMS(phone!, otp);
        console.log('OTP sent to phone:', phone, 'Code:', otp); // For development
      }
    } catch (sendError: any) {
      console.error('Failed to send OTP:', sendError);
      // Still return success since OTP is stored in database
      // In development, the code is logged to console
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to send verification code');
      }
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${method === 'email' ? 'email' : 'phone'}`,
      expiresIn: 600, // seconds
      ...(process.env.NODE_ENV === 'development' && { debug: { otp } }), // Only in development
    });
  } catch (error: any) {
    console.error('OTP send error:', error);

    const errorResponse: Record<string, any> = {
      success: false,
      message: 'An error occurred. Please try again later.',
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.debug = error.message;
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
