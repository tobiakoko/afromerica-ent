/**
 * Paystack API Client
 * Documentation: https://paystack.com/docs/api/
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackInitializePayload {
  email: string;
  amount: number; // In kobo (₦100 = 10000 kobo)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: ('card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer')[];
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, any>;
  };
}

class PaystackClient {
  private baseURL = PAYSTACK_BASE_URL;
  private secretKey = PAYSTACK_SECRET_KEY;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Paystack request failed');
    }

    return data;
  }

  /**
   * Initialize a payment transaction
   */
  async initializeTransaction(payload: PaystackInitializePayload) {
    return this.request<{
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    }>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    return this.request<PaystackVerifyResponse>(
      `/transaction/verify/${reference}`
    );
  }

  /**
   * List all transactions
   */
  async listTransactions(params?: {
    perPage?: number;
    page?: number;
    status?: 'success' | 'failed' | 'abandoned';
    from?: string;
    to?: string;
  }) {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request(`/transaction?${queryParams}`);
  }

  /**
   * Get transaction timeline
   */
  async getTransactionTimeline(reference: string) {
    return this.request(`/transaction/timeline/${reference}`);
  }

  /**
   * Create a customer
   */
  async createCustomer(email: string, firstName?: string, lastName?: string) {
    return this.request('/customer', {
      method: 'POST',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    });
  }
}

export const paystackClient = new PaystackClient();