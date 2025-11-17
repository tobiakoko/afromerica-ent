ALTER TABLE public.otp_codes
  ADD COLUMN max_attempts INTEGER DEFAULT 3 NOT NULL,
  ADD COLUMN is_verified BOOLEAN DEFAULT false,
  ADD COLUMN is_used BOOLEAN DEFAULT false,
  ADD COLUMN ip_address TEXT,
  ADD COLUMN user_agent TEXT,
  ADD COLUMN verified_at TIMESTAMPTZ;

ALTER TABLE public.otp_codes
  ADD CONSTRAINT otp_valid_attempts CHECK (attempts >= 0 AND attempts <= max_attempts);

-- Drop the other tables
DROP TABLE IF EXISTS public.validation_codes;
DROP TABLE IF EXISTS public.vote_validations;


-- Indexes for performance
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email) WHERE email IS NOT NULL;
CREATE INDEX idx_otp_codes_phone ON public.otp_codes(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_otp_codes_expires ON public.otp_codes(expires_at);
CREATE INDEX idx_otp_codes_created ON public.otp_codes(created_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Drop dangerous policies
DROP POLICY "Anyone can read their OTP codes" ON public.otp_codes;
DROP POLICY "Anyone can update their OTP codes" ON public.otp_codes;
DROP POLICY "Anyone can delete their OTP codes" ON public.otp_codes;

-- Create secure policies
CREATE POLICY "Service role can manage OTP codes"
  ON public.otp_codes FOR ALL
  USING (auth.role() = 'service_role');

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old OTPs (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;