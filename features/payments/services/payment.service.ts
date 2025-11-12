// Minimal payment service shim for build/dev.
export const paymentService = {
  async initializePayment(_opts: { amount: number; bookingId: string; email?: string }) {
    return { reference: 'stub-ref', authorizationUrl: 'https://payments.example/authorize' }
  },
  async refundPayment(_reference?: string) {
    return { success: true }
  },
}
