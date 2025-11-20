# OTP Verification Test Guide

## Testing the Complete OTP Flow

### 1. Send OTP (via Voting Form)
When you fill in your email and click "Continue to Verification", the system will:

**Request to `/api/votes/validate`:**
```json
{
  "email": "your-email@example.com",
  "method": "email"
}
```

**What happens:**
1. OTP is generated (6 digits)
2. OTP is hashed and stored in `vote_validations` table
3. Email is sent via Resend
4. **In development**: OTP is logged to console and returned in response

**Check console for:**
```
OTP sent to email: your-email@example.com Code: 123456
```

**API Response (development only):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "expiresIn": 600,
  "debug": {
    "otp": "123456"
  }
}
```

### 2. Verify OTP
Enter the 6-digit code and click "Verify & Continue to Payment"

**Request to `/api/votes/verify`:**
```json
{
  "email": "your-email@example.com",
  "code": "123456",
  "method": "email"
}
```

**What happens:**
1. System finds the most recent unused OTP for your email
2. Checks if OTP is expired (10 minutes)
3. Checks if max attempts reached (3)
4. Hashes your input and compares with stored hash
5. If valid: marks as verified, generates JWT token

**Successful Response:**
```json
{
  "success": true,
  "message": "Verification successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Failed Response (invalid code):**
```json
{
  "success": false,
  "message": "Invalid verification code",
  "attemptsLeft": 2
}
```

### 3. Check Email
You should receive an email with:
- Subject: "Your verification code: 123456"
- Large 6-digit code displayed prominently
- Security warning
- 10 minute expiry notice

## Common Issues & Solutions

### Issue: "Failed to store verification code"
**Solution:** Run the migration to create `vote_validations` table (already done)

### Issue: "Verification code not found"
**Possible causes:**
1. Code expired (>10 minutes)
2. Code already used
3. Typing wrong email/phone

### Issue: Email not received
**Check:**
1. RESEND_API_KEY is set in .env.local ✓
2. Email domain is verified in Resend dashboard
3. Check spam folder
4. In development, check console for the OTP code

### Issue: "Too many failed attempts"
**Solution:** Request a new code (3 attempts max per code)

## Database Queries for Debugging

```sql
-- Check recent OTP codes
SELECT
  identifier,
  method,
  attempts,
  max_attempts,
  is_used,
  is_verified,
  expires_at,
  created_at
FROM vote_validations
ORDER BY created_at DESC
LIMIT 10;

-- Clean up expired codes
DELETE FROM vote_validations
WHERE expires_at < NOW();
```

## Development Tips

1. **See OTP in console**: Check your terminal where `npm run dev` is running
2. **See OTP in API response**: Check Network tab → Response for `/api/votes/validate`
3. **Test expiry**: Change `expiresAt` to 1 minute in `/app/api/otp/send/route.ts` line 67
4. **Test max attempts**: Try entering wrong code 3 times

## Security Features

✅ OTP is hashed before storage (SHA-256)
✅ Codes expire after 10 minutes
✅ Max 3 verification attempts per code
✅ Codes are single-use (marked as used after verification)
✅ JWT token expires after 1 hour
✅ No OTP exposed in production logs/responses
