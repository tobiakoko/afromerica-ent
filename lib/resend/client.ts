import { Resend } from 'resend'

/**
 * Shared Resend client, created on first use rather than at import time so `next build`
 * works without RESEND_API_KEY. Sending still fails loudly if the key is missing at runtime.
 */
let client: Resend | null = null

export function getResend(): Resend {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required')
  }
  client = new Resend(apiKey)
  return client
}
