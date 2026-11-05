/**
 * Shared JWT signing key for the OTP, finale-voter and payment tokens.
 *
 * Resolved on first use rather than at import time, so `next build` (which imports every
 * route to collect page data) works without production secrets. Requests still fail
 * loudly if JWT_SECRET is missing at runtime.
 */
let cached: Uint8Array | null = null

export function getJwtSecret(): Uint8Array {
  if (cached) return cached
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  cached = new TextEncoder().encode(secret)
  return cached
}
