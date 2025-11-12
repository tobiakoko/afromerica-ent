// Paystack Payment Service
// Handles payment initialization and verification
 
export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}
 
export interface PaystackInitializePayload {
  email: string;
  amount: number; // In kobo (smallest currency unit)
  reference: string;
  currency?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}
 
export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
 
export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    fees: number;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
  };
}
 
/**
 * Initialize a Paystack payment transaction
 */
export async function initializePayment(
  payload: PaystackInitializePayload,
  secretKey: string
): Promise<PaystackInitializeResponse> {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
 
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initialize payment');
  }
 
  return response.json();
}
 
/**
 * Verify a Paystack payment transaction
 */
export async function verifyPayment(
  reference: string,
  secretKey: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    }
  );
 
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify payment');
  }
 
  return response.json();
}
 
/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(prefix: string = 'TXN'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
 
/**
 * Convert amount to kobo (or smallest currency unit)
 * Paystack expects amounts in kobo for NGN (1 Naira = 100 kobo)
 */
export function convertToKobo(amount: number, currency: string = 'NGN'): number {
  // For NGN, multiply by 100 to convert to kobo
  // For other currencies, check if they use smallest units
  if (currency === 'NGN' || currency === 'GHS' || currency === 'ZAR') {
    return Math.round(amount * 100);
  }
  // For currencies like USD, EUR, also multiply by 100 (cents)
  return Math.round(amount * 100);
}
 
/**
 * Convert kobo to main currency unit
 */
export function convertFromKobo(amount: number): number {
  return amount / 100;
}
 
/**
 * Validate Paystack webhook signature
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(payload)
    .digest('hex');
  return hash === signature;
}
 
/**
 * Get payment status message for users
 */
export function getPaymentStatusMessage(status: string): string {
  switch (status) {
    case 'success':
      return 'Payment successful! Your transaction has been completed.';
    case 'failed':
      return 'Payment failed. Please try again or contact support.';
    case 'abandoned':
      return 'Payment was abandoned. Please try again.';
    case 'pending':
      return 'Payment is being processed. Please wait.';
    default:
      return 'Payment status unknown. Please contact support.';
  }
}