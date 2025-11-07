# Payment Integration Guide - Paystack

This guide explains how to set up and use the Paystack payment integration for voting and booking payments.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Payment Types](#payment-types)
- [API Routes](#api-routes)
- [Components](#components)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## Overview

The payment system supports two types of payments:
1. **Voting Payments**: Users purchase vote packages for pilot event artists
2. **Booking Payments**: Users purchase event tickets

Both payment types use Paystack as the payment provider and follow the same flow:
1. Create a payment record in the database
2. Initialize payment with Paystack
3. Redirect user to Paystack payment page
4. Verify payment after completion
5. Update database and apply actions (votes/bookings)

## Setup

### 1. Get Paystack API Keys

1. Sign up for a Paystack account at https://paystack.com
2. Navigate to Settings > API Keys & Webhooks
3. Copy your **Secret Key** and **Public Key**

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Paystack API Keys
PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here"

# App URL (for payment callbacks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important Notes:**
- Use **test keys** (starting with `sk_test_` and `pk_test_`) for development
- Use **live keys** (starting with `sk_live_` and `pk_live_`) for production
- Never commit your `.env.local` file to version control

### 3. Set Up Webhook

1. Go to Paystack Dashboard > Settings > API Keys & Webhooks
2. Click on "Add Webhook URL"
3. Enter your webhook URL:
   - **Development**: Use a tool like ngrok to expose your local server
   - **Production**: `https://yourdomain.com/api/webhooks/paystack`
4. Save the webhook URL

Paystack will send event notifications to this endpoint when payments are completed.

## Payment Types

### Voting Payments

**Flow:**
1. User adds vote packages to cart
2. User proceeds to checkout
3. Payment is initialized
4. After successful payment, votes are applied to artists
5. Artist rankings are updated

**Database Tables:**
- `vote_purchases`: Stores purchase records
- `pilot_artists`: Receives vote updates

**Code Example:**
```typescript
import { useCart } from "@/features/pilot-voting/context/cart-context";

// In your component
const { cart } = useCart();

// Cart contains:
// - items: CartItem[]
// - totalVotes: number
// - totalPrice: number
// - currency: string
```

### Booking Payments

**Flow:**
1. User selects event and ticket type
2. User fills in customer details
3. Payment is initialized
4. After successful payment, booking is confirmed
5. Confirmation email is sent (optional)

**Database Tables:**
- `bookings`: Stores booking records
- `events`: Event details

**Code Example:**
```typescript
import { BookingCheckout } from "@/features/bookings/components/booking-checkout";

<BookingCheckout
  eventId="event-uuid"
  eventTitle="Summer Music Festival"
  ticketType="General Admission"
  quantity={2}
  totalAmount={100.00}
  currency="USD"
  onSuccess={() => console.log("Booking confirmed")}
  onError={(error) => console.error(error)}
/>
```

## API Routes

### Initialize Payment

**Endpoint:** `POST /api/payments/initialize`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 100.00,
  "currency": "USD",
  "type": "voting" | "booking",
  "metadata": {
    "type": "voting",
    "email": "customer@example.com",
    "items": [...],
    "description": "Vote purchase"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "reference": "VOTE-1234567890-ABC123",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "abc123xyz"
  }
}
```

### Verify Payment

**Endpoint:** `GET /api/payments/verify?reference=PAYMENT_REFERENCE`

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "VOTE-1234567890-ABC123",
    "amount": 100.00,
    "status": "completed",
    "paidAt": "2025-01-01T12:00:00Z",
    "metadata": {...}
  }
}
```

### Webhook Handler

**Endpoint:** `POST /api/webhooks/paystack`

**Headers:**
- `x-paystack-signature`: Webhook signature for validation

**Events Handled:**
- `charge.success`: Payment completed successfully
- `charge.failed`: Payment failed

## Components

### Voting Cart (`app/(public)/pilot-voting/cart/page.tsx`)

Features:
- Display cart items with artist info
- Update quantities
- Remove items
- Email collection
- Paystack payment initialization

### Booking Checkout (`features/bookings/components/booking-checkout.tsx`)

Features:
- Display booking summary
- Collect customer information
- Validate form fields
- Paystack payment initialization

### Payment Verification (`app/(public)/payments/verify/page.tsx`)

Features:
- Verify payment status
- Display success/failure message
- Show payment details
- Redirect to appropriate page

## Payment Service Utilities

### Paystack Service (`lib/payments/paystack.ts`)

**Key Functions:**

```typescript
// Initialize payment
await initializePayment({
  email: "customer@example.com",
  amount: 10000, // Amount in kobo (100.00 NGN)
  reference: "VOTE-123",
  currency: "NGN",
  callback_url: "https://yourapp.com/payments/verify",
  metadata: {...}
}, secretKey);

// Verify payment
await verifyPayment("VOTE-123", secretKey);

// Generate unique reference
const reference = generatePaymentReference("VOTE");

// Convert amounts
const kobo = convertToKobo(100.00, "NGN"); // 10000
const naira = convertFromKobo(10000); // 100.00

// Validate webhook signature
const isValid = validateWebhookSignature(
  payloadString,
  signature,
  secretKey
);
```

## Testing

### Test Mode

Paystack provides test cards for development:

**Successful Payment:**
- Card Number: `4084 0840 8408 4081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**
- Card Number: `5060 6666 6666 6666`
- CVV: Any
- Expiry: Any future date

### Test Voting Payment

1. Go to `/pilot-voting`
2. Select an artist and vote package
3. Add to cart
4. Proceed to checkout
5. Enter test email and use test card
6. Complete payment
7. Verify votes are applied to artist

### Test Booking Payment

1. Go to event detail page
2. Use the `BookingCheckout` component
3. Fill in customer details
4. Use test card for payment
5. Verify booking is confirmed

### Test Webhook

Use Paystack's webhook testing feature:
1. Go to Dashboard > Settings > API Keys & Webhooks
2. Click "Test Webhook"
3. Select event type (`charge.success`)
4. Send test event

## Production Deployment

### Checklist

- [ ] Replace test API keys with live keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure webhook URL with production domain
- [ ] Test webhook endpoint is accessible
- [ ] Enable HTTPS for webhook endpoint
- [ ] Test full payment flow with real card
- [ ] Monitor webhook logs for errors
- [ ] Set up email notifications for payments
- [ ] Configure error tracking (Sentry, etc.)

### Security Best Practices

1. **API Keys:**
   - Never expose secret key in client-side code
   - Store keys in environment variables
   - Rotate keys periodically

2. **Webhook Validation:**
   - Always validate webhook signatures
   - Reject requests with invalid signatures
   - Log all webhook events for audit

3. **Database:**
   - Use transactions for payment updates
   - Implement idempotency for duplicate webhooks
   - Log all payment state changes

4. **Error Handling:**
   - Handle network failures gracefully
   - Retry failed webhook processing
   - Alert on payment verification failures

### Monitoring

Monitor these metrics:
- Payment success rate
- Average payment time
- Failed payment reasons
- Webhook processing time
- Database update failures

### Currency Support

Paystack supports multiple currencies. Update the conversion function if needed:

```typescript
// lib/payments/paystack.ts
export function convertToKobo(amount: number, currency: string): number {
  // NGN, GHS, ZAR use 100 (kobo/pesewa/cents)
  // Add more currencies as needed
  return Math.round(amount * 100);
}
```

## Troubleshooting

### Payment Initialization Fails

**Symptoms:** API returns error when initializing payment

**Solutions:**
- Check API keys are correct
- Verify amount is positive
- Ensure email format is valid
- Check Paystack account status

### Webhook Not Received

**Symptoms:** Payment succeeds but database not updated

**Solutions:**
- Verify webhook URL is accessible
- Check webhook signature validation
- Review webhook logs in Paystack dashboard
- Ensure firewall allows Paystack IPs

### Votes/Bookings Not Applied

**Symptoms:** Payment verified but actions not applied

**Solutions:**
- Check webhook event processing
- Verify database function `apply_votes_to_artist` exists
- Review application logs
- Check for database errors

### Double Charging

**Prevention:**
- Use unique payment references
- Implement idempotency in webhook handler
- Check payment status before retrying

## Support

For Paystack-specific issues:
- Documentation: https://paystack.com/docs
- Support: support@paystack.com
- Status: https://status.paystack.com

For application issues:
- Check application logs
- Review Supabase logs
- Contact development team

## Additional Resources

- [Paystack API Documentation](https://paystack.com/docs/api)
- [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
- [Webhook Best Practices](https://paystack.com/docs/payments/webhooks)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
