# Payment Flow - Issue Resolution Summary

## Issues Fixed ✅

### 1. Transaction Reference Mismatch
**Problem:** Paystack couldn't find the transaction because we were using the wrong URL parameter.

**Solution:**
- Paystack sends the reference as `trxref` (not `reference`) when redirecting back
- Updated verification page to accept both `trxref` and `reference` parameters
- Added logging to see what parameters are received

**File:** [app/(public)/payments/verify/page.tsx](app/(public)/payments/verify/page.tsx#L17-L26)

### 2. Database Not Updating After Payment
**Problem:** Payment succeeded on Paystack but database still showed "pending" status.

**Solution:**
- Added database update logic after successful verification
- Updates `payment_status` to 'completed'
- Stores Paystack's reference for reconciliation
- Sets `verified_at` timestamp for votes

**File:** [app/(public)/payments/verify/page.tsx](app/(public)/payments/verify/page.tsx#L59-L107)

### 3. Vote Count Field Mismatch
**Problem:** Vote record creation failed with "vote_count must be > 0" error.

**Solution:**
- Fixed field name mismatch: form sends `voteCount`, backend expected `votes`
- Added fallback to check both field names
- Added validation to ensure vote count is always > 0

**File:** [app/api/payments/initialize/route.ts](app/api/payments/initialize/route.ts#L66-L78)

### 4. Missing Confirmation Emails
**Problem:** Users weren't receiving confirmation emails after successful payment.

**Solution:**
- Added email sending after successful vote verification
- Sends professional confirmation email with vote details
- Includes artist info, vote count, amount, and reference number
- Email failures don't break the payment flow (logged but not thrown)

**File:** [app/(public)/payments/verify/page.tsx](app/(public)/payments/verify/page.tsx#L91-L104)

## Complete Payment Flow

### User Journey:
1. **Select Artist & Votes** → User chooses artist and number of votes
2. **Request OTP** → User enters email, receives 6-digit code
3. **Verify OTP** → User enters code, gets validated
4. **Initialize Payment** → System creates pending vote record and redirects to Paystack
5. **Pay on Paystack** → User completes payment on Paystack's secure checkout
6. **Return to Site** → Paystack redirects with `trxref` parameter
7. **Verify Payment** → System verifies with Paystack API
8. **Update Database** → Vote record updated to 'completed' status
9. **Send Email** → Confirmation email sent to user
10. **Show Success** → User sees success page with vote details

### Technical Flow:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills vote form                                     │
│    POST /api/votes/validate → Send OTP                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User verifies OTP                                        │
│    POST /api/votes/verify → Returns JWT token              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Initialize payment                                       │
│    POST /api/payments/initialize                            │
│    - Create vote record (status: pending)                   │
│    - Call Paystack API                                      │
│    - Get authorization_url                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Redirect to Paystack                                     │
│    window.location.href = authorization_url                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User pays on Paystack                                    │
│    Paystack processes payment                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Paystack redirects back                                  │
│    GET /payments/verify?trxref=AFR-VOTE-xxx                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Verify with Paystack                                     │
│    GET https://api.paystack.co/transaction/verify/{ref}     │
│    - Check payment status                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Update database (if successful)                          │
│    UPDATE votes SET                                         │
│      payment_status = 'completed',                          │
│      verified_at = NOW()                                    │
│    WHERE payment_reference = ref                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Send confirmation email                                  │
│    - Vote details                                           │
│    - Artist information                                     │
│    - View leaderboard link                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Show success page                                       │
│     Display payment confirmation                            │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema Updates

### Votes Table - Updated Fields:
```sql
vote_count: INTEGER             -- Fixed: Now correctly populated
payment_status: TEXT            -- Updated to 'completed' after payment
paystack_reference: TEXT        -- Stores Paystack's transaction ref
verified_at: TIMESTAMPTZ        -- Timestamp when payment was verified
```

## Email Templates

### Vote Confirmation Email Includes:
- ✅ Transaction reference number
- ✅ Artist name (stage name preferred)
- ✅ Number of votes cast
- ✅ Amount paid
- ✅ Link to view leaderboard
- ✅ Call to action to share with friends
- ✅ Support contact information

## Environment Variables Required

```env
# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# Resend (Email)
RESEND_API_KEY=re_...

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Checklist

### Test Payment Flow:
- [x] Vote form displays correctly
- [x] OTP sent to email
- [x] OTP verification works
- [x] Payment initialization succeeds
- [x] Redirect to Paystack works
- [x] Payment on Paystack succeeds
- [x] Redirect back to site with correct params
- [x] Payment verification with Paystack API
- [x] Database updated to 'completed'
- [x] Confirmation email sent
- [x] Success page displays correct details

### Test Error Cases:
- [ ] Invalid OTP code
- [ ] Expired OTP (>10 minutes)
- [ ] Payment cancelled on Paystack
- [ ] Payment failed on Paystack
- [ ] Invalid transaction reference

## Known Issues & Limitations

### CSP Warning (Non-blocking):
- Warning: Content-Security-Policy violation on Paystack checkout
- **Status:** This is expected and doesn't affect functionality
- **Cause:** Paystack uses inline scripts on their checkout page
- **Impact:** None - just a browser console warning

### Future Enhancements:
1. **Webhook Handler:** Add Paystack webhook for real-time payment updates
2. **Retry Logic:** Add retry mechanism for failed email sends
3. **Payment Reconciliation:** Automated daily reconciliation with Paystack
4. **Failed Payment Recovery:** Send reminder emails for abandoned payments

## Debugging Tips

### Check Payment Status:
```sql
-- Find recent votes
SELECT
  payment_reference,
  user_identifier,
  vote_count,
  amount_paid,
  payment_status,
  verified_at,
  created_at
FROM votes
ORDER BY created_at DESC
LIMIT 10;
```

### Check Logs:
```bash
# Terminal where npm run dev is running
# Look for:
- "OTP sent to email: ... Code: ..."
- "Initializing Paystack payment: ..."
- "Paystack response: ..."
- "Payment verification params: ..."
- "Paystack verification response: ..."
- "Vote confirmation email sent to: ..."
```

### Test Paystack API Directly:
```bash
curl -H "Authorization: Bearer sk_test_..." \
  https://api.paystack.co/transaction/verify/AFR-VOTE-xxx
```

## Support

For issues:
1. Check terminal logs for errors
2. Check browser console for client-side errors
3. Verify environment variables are set
4. Check Paystack dashboard for transaction status
5. Check Resend dashboard for email delivery status

---

**Status:** ✅ All payment flow issues resolved
**Last Updated:** 2025-11-20
