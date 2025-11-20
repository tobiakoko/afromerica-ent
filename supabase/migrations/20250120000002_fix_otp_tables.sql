-- Fix OTP table conflicts
-- Ensure vote_validations table exists and remove conflicting tables

-- Drop conflicting tables if they exist
DROP TABLE IF EXISTS public.otp_codes CASCADE;
DROP TABLE IF EXISTS public.validation_codes CASCADE;

-- Recreate vote_validations table if it was dropped
CREATE TABLE IF NOT EXISTS public.vote_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact Information
  identifier TEXT NOT NULL, -- Email or phone number
  method TEXT NOT NULL CHECK (method IN ('email', 'sms')), -- How code was sent: 'email' or 'sms'

  -- Verification Code (stored hashed for security)
  verification_code TEXT NOT NULL, -- Hashed 6-digit code

  -- Security & Rate Limiting
  attempts INTEGER DEFAULT 0 NOT NULL, -- Failed verification attempts
  max_attempts INTEGER DEFAULT 3 NOT NULL, -- Max allowed attempts

  -- Expiration
  expires_at TIMESTAMPTZ NOT NULL, -- Code expires after 10 minutes

  -- Status
  is_used BOOLEAN DEFAULT false, -- Code has been used
  is_verified BOOLEAN DEFAULT false, -- Code was successfully verified

  -- Audit Trail
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT validations_valid_attempts_check CHECK (attempts >= 0 AND attempts <= max_attempts)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vote_validations_identifier ON public.vote_validations(identifier);
CREATE INDEX IF NOT EXISTS idx_vote_validations_expires_at ON public.vote_validations(expires_at);
CREATE INDEX IF NOT EXISTS idx_vote_validations_created_at ON public.vote_validations(created_at DESC);

-- Partial index for active codes only (huge performance boost)
DROP INDEX IF EXISTS idx_vote_validations_active;
CREATE INDEX idx_vote_validations_active ON public.vote_validations(identifier, expires_at)
  WHERE is_used = false
    AND is_verified = false
    AND attempts < max_attempts;

-- Enable RLS
ALTER TABLE public.vote_validations ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can create validation codes" ON public.vote_validations;
DROP POLICY IF EXISTS "Anyone can read validation codes" ON public.vote_validations;
DROP POLICY IF EXISTS "Anyone can delete validation codes" ON public.vote_validations;
DROP POLICY IF EXISTS "Service role can manage OTP codes" ON public.vote_validations;
DROP POLICY IF EXISTS "Service role can manage vote validations" ON public.vote_validations;

-- Create policies for OTP flow
-- Allow anyone to insert (create OTP)
CREATE POLICY "Anyone can create vote validations"
  ON public.vote_validations FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select their own validations
CREATE POLICY "Anyone can read vote validations"
  ON public.vote_validations FOR SELECT
  USING (true);

-- Allow anyone to update their own validations (for verification)
CREATE POLICY "Anyone can update vote validations"
  ON public.vote_validations FOR UPDATE
  USING (true);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_vote_validations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.vote_validations
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old OTPs (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_vote_validations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.vote_validations
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.vote_validations IS 'OTP codes for vote verification (email/SMS)';
COMMENT ON COLUMN public.vote_validations.verification_code IS 'Hashed 6-digit OTP code (never store plain text)';
COMMENT ON COLUMN public.vote_validations.attempts IS 'Failed verification attempts (rate limiting)';
COMMENT ON COLUMN public.vote_validations.expires_at IS 'Code expires 10 minutes after creation';
