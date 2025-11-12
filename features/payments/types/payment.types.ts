export interface PaymentGateway {
  initializePayment(data: InitializePaymentDto): Promise<PaymentResponse>
  verifyPayment(reference: string): Promise<PaymentVerification>
  refundPayment(reference: string): Promise<RefundResponse>
}

export interface InitializePaymentDto {
  amount: number
  email: string
  metadata: Record<string, any>
}

export interface PaymentResponse {
  reference: string
  authorizationUrl: string
}

export interface PaymentVerification {
  status: 'success' | 'failed' | 'pending'
  amount: number
  reference: string
}

export interface RefundResponse {
  status: string
  message: string
}