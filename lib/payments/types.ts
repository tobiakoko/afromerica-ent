// Payment Types for Voting and Booking
 
export type PaymentType = 'voting' | 'booking';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider = 'paystack' | 'stripe' | 'flutterwave';
 
export interface PaymentMetadata {
  type: PaymentType;
  userId?: string;
  email: string;
  items?: any[];
  description?: string;
  [key: string]: any;
}
 
export interface PaymentInitializeRequest {
  email: string;
  amount: number;
  currency?: string;
  type: PaymentType;
  metadata: PaymentMetadata;
  callbackUrl?: string;
}
 
export interface PaymentInitializeResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    authorizationUrl: string;
    accessCode: string;
  };
  error?: string;
}
 
export interface PaymentVerifyRequest {
  reference: string;
}
 
export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: PaymentStatus;
    paidAt?: string;
    metadata: PaymentMetadata;
  };
  error?: string;
}
 
export interface WebhookEvent {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    paid_at: string;
    metadata: PaymentMetadata;
    customer: {
      email: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}