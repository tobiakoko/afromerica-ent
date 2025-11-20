// import { Resend } from 'resend';
import { sendOTP } from '@/lib/emails/render';

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string) {
  try {
    await sendOTP({
      to: email,
      otp, 
      expiresInMinutes: 10,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification code');
  }
}

export async function sendOTPSMS(phone: string, otp: string) {
  // Integration with Twilio, Africa's Talking, or Termii
  // Example with Termii (popular in Africa)
  
  const TERMII_API_KEY = process.env.TERMII_API_KEY;
  const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'Afromerica';

  if (!TERMII_API_KEY) {
    throw new Error('SMS service not configured');
  }

  try {
    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phone,
        from: TERMII_SENDER_ID,
        sms: `Your Afromerica verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        type: 'plain',
        channel: 'generic',
        api_key: TERMII_API_KEY,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS');
    }

    return { success: true };
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send verification code via SMS');
  }
}

// Alternative: Using Twilio
export async function sendOTPSMSTwilio(phone: string, otp: string) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio not configured');
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: TWILIO_PHONE_NUMBER,
          Body: `Your Afromerica verification code is: ${otp}. Valid for 10 minutes.`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send SMS via Twilio');
    }

    return { success: true };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw new Error('Failed to send verification code via SMS');
  }
}