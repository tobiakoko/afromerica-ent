/**
 * Paystack Types
 */

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    paidAt?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
}

export interface PaymentInitializeResponse {
  success: boolean;
  message?: string;
  authorizationUrl?: string;
  reference?: string;
  accessCode?: string;
}
