-- Create validation_codes table
CREATE TABLE IF NOT EXISTS public.validation_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  code TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('email', 'phone')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Index for faster lookups
CREATE INDEX idx_validation_codes_email ON public.validation_codes(email);
CREATE INDEX idx_validation_codes_phone ON public.validation_codes(phone);
CREATE INDEX idx_validation_codes_code ON public.validation_codes(code);
CREATE INDEX idx_validation_codes_expires ON public.validation_codes(expires_at);

-- Enable RLS
ALTER TABLE public.validation_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow inserts for code generation
CREATE POLICY "Anyone can create validation codes"
  ON public.validation_codes FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow reads for verification
CREATE POLICY "Anyone can read validation codes"
  ON public.validation_codes FOR SELECT
  USING (true);

-- RLS Policy: Allow deletes after verification
CREATE POLICY "Anyone can delete validation codes"
  ON public.validation_codes FOR DELETE
  USING (true);

-- Function to clean up expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_validation_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.validation_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-validation-codes', '*/15 * * * *', 'SELECT cleanup_expired_validation_codes();');
