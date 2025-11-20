/**
 * Paystack Service
 * Higher-level service functions for Paystack operations
 */

import { paystackClient, type PaystackVerifyResponse } from './client';

/**
 * Convert amount from kobo to naira
 */
export function convertFromKobo(kobo: number): number {
  return kobo / 100;
}

/**
 * Convert amount from naira to kobo
 */
export function convertToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Verify a payment with Paystack
 */
export async function verifyPayment(
  reference: string,
  _secretKey?: string
): Promise<PaystackVerifyResponse> {
  return paystackClient.verifyTransaction(reference);
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
}
