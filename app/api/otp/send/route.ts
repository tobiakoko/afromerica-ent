import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateOTP, hashOTP } from '@/lib/otp/generator';
import { SendOTPSchema, validateRequest } from '@/lib/validations/api'
import { errorResponse, ErrorCodes } from '@/lib/api/response'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = validateRequest(SendOTPSchema, body)
  if (!validation.success) {
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      'Invalid request data',
      validation.error.errors
    )
  }

  const { email, phone, method } = validation.data

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

    // 1. Add IP-based rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const ipRateLimit = await checkRateLimit(ip, 10, 3600); // 10 requests per hour per IP

    // 2. Add account-based rate limiting
    const accountRateLimit = await checkRateLimit(email || phone, 5, 3600); // 5 per hour

    // 3. Implement backoff
    const attempts = await getRecentAttempts(email || phone);
    const waitTime = Math.min(300, Math.pow(2, attempts) * 60); // Exponential backoff

    // 4. Add CAPTCHA after 3 failed verifications
    if (attempts >= 3 && !captchaToken) {
      return NextResponse.json({ requiresCaptcha: true }, { status: 429 });
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
      {
        success: false,
        message: 'An error occurred. Please try again later.',
        ...(process.env.NODE_ENV === 'development' && { debug: error.message })
      },
      { status: 500 }
    );
  }
}
