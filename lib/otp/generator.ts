import crypto from 'crypto';

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function verifyOTP(inputOTP: string, hashedOTP: string): boolean {
  const inputHash = hashOTP(inputOTP);
  return inputHash === hashedOTP;
}

export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}
