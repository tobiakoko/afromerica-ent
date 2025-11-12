// Payment gateway interface - temporarily defined here
interface PaymentGateway {
  initializePayment(params: any): Promise<any>
  verifyPayment(reference: string): Promise<any>
}

interface InitializePaymentDto {
  email: string
  amount: number
  bookingId: string
  metadata?: any
}

interface PaymentResponse {
  authorization_url: string
  reference: string
  access_code: string
}

interface PaymentVerification {
  status: string
  amount: number
  reference: string
  paid_at?: string
}

interface RefundResponse {
  status: string
  message: string
}

export class PaystackGateway implements PaymentGateway {
  private apiKey: string
  private baseUrl = 'https://api.paystack.co'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async initializePayment(data: InitializePaymentDto): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        currency: 'NGN',
        metadata: data.metadata,
      }),
    })

    const result = await response.json()

    return {
      reference: result.data.reference,
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerification> {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    )

    const result = await response.json()

    return {
      status: result.data.status === 'success' ? 'success' : 'failed',
      amount: result.data.amount / 100,
      reference: result.data.reference,
    }
  }

  async refundPayment(reference: string): Promise<RefundResponse> {
    // Implement Paystack refund logic
    throw new Error('Not implemented')
  }
}