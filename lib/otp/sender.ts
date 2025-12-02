export async function sendOTPEmail(email: string, otp: string) {
  const TERMII_API_KEY = process.env.TERMII_API_KEY;
  const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com';

  if (!TERMII_API_KEY) {
    throw new Error('Email service not configured');
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/api/email/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        email_address: email,
        code: otp,
        email_configuration_id: process.env.TERMII_EMAIL_CONFIG_ID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Termii email error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification code');
  }
}

export async function sendOTPSMS(phone: string, otp: string) {
  // Integration with Termii (popular in Africa)

  const TERMII_API_KEY = process.env.TERMII_API_KEY;
  const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com';
  const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'Afromerica';

  if (!TERMII_API_KEY) {
    throw new Error('SMS service not configured');
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/api/sms/send`, {
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