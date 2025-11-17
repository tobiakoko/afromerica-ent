-- Create OTP codes table
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  code TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('email', 'sms')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_or_phone CHECK (
    (method = 'email' AND email IS NOT NULL) OR 
    (method = 'sms' AND phone IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email) WHERE email IS NOT NULL;
CREATE INDEX idx_otp_codes_phone ON public.otp_codes(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_otp_codes_expires ON public.otp_codes(expires_at);
CREATE INDEX idx_otp_codes_created ON public.otp_codes(created_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create OTP codes"
  ON public.otp_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read their OTP codes"
  ON public.otp_codes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update their OTP codes"
  ON public.otp_codes FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete their OTP codes"
  ON public.otp_codes FOR DELETE
  USING (true);

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

-- Optional: Schedule cleanup with pg_cron if available
-- SELECT cron.schedule('cleanup-expired-otps', '*/5 * * * *', 'SELECT cleanup_expired_otps();');
-- SELECT cron.schedule('cleanup-old-otps', '0 0 * * *', 'SELECT cleanup_old_otps();');
