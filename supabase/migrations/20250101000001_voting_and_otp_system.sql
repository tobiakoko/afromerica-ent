-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Voting & Security Layer
-- ==========================================

-- ==========================================
-- VOTE PACKAGES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.vote_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Package Details
  name TEXT NOT NULL, -- e.g., "Bronze Pack", "Gold Pack"
  description TEXT,
  votes INTEGER NOT NULL, -- Number of votes in package
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  discount INTEGER DEFAULT 0, -- Percentage discount (0-100)
  
  -- Display Settings
  display_order INTEGER DEFAULT 0, -- For UI sorting
  popular BOOLEAN DEFAULT false, -- Highlight as "Most Popular"
  
  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT vote_packages_valid_votes_check CHECK (votes > 0),
  CONSTRAINT vote_packages_valid_price_check CHECK (price >= 0),
  CONSTRAINT vote_packages_valid_discount_check CHECK (discount >= 0 AND discount <= 100)
);

-- Indexes
CREATE INDEX idx_vote_packages_is_active ON public.vote_packages(is_active) 
  WHERE is_active = true;
CREATE INDEX idx_vote_packages_popular ON public.vote_packages(popular) 
  WHERE popular = true;
CREATE INDEX idx_vote_packages_display_order ON public.vote_packages(display_order);

COMMENT ON TABLE public.vote_packages IS 'Paid vote packages with pricing tiers';
COMMENT ON COLUMN public.vote_packages.discount IS 'Discount percentage (e.g., 20 = 20% off)';
COMMENT ON COLUMN public.vote_packages.popular IS 'Show "Most Popular" badge in UI';

-- ==========================================
-- VOTES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL, -- Optional event context
  
  -- User Identification (no account required, just validated contact)
  user_identifier TEXT NOT NULL, -- Email or phone number
  user_name TEXT,
  
  -- Vote Details
  vote_count INTEGER NOT NULL, -- Number of votes purchased
  amount_paid DECIMAL(10,2) NOT NULL, -- Total amount paid
  currency TEXT DEFAULT 'NGN' NOT NULL,
  
  -- Payment Information (Paystack)
  payment_reference TEXT UNIQUE NOT NULL, -- Our internal reference
  paystack_reference TEXT UNIQUE, -- Paystack transaction reference
  paystack_access_code TEXT, -- For payment initialization
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT, -- card, bank_transfer, ussd, etc.
  
  -- Cart Snapshot (stores package details at purchase time)
  items JSONB, -- e.g., [{"package_id": "...", "votes": 10, "price": 500}]
  
  -- Validation & Security
  validation_token TEXT, -- JWT token from OTP verification
  otp_verified BOOLEAN DEFAULT false, -- Whether OTP was verified before payment
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ, -- When payment was confirmed
  
  -- Constraints
  CONSTRAINT votes_valid_vote_count_check CHECK (vote_count > 0),
  CONSTRAINT votes_valid_amount_check CHECK (amount_paid >= 0),
  CONSTRAINT votes_valid_identifier_check CHECK (
    is_valid_email(user_identifier) OR is_valid_phone(user_identifier)
  )
);

-- Indexes for performance
CREATE INDEX idx_votes_artist_id ON public.votes(artist_id);
CREATE INDEX idx_votes_event_id ON public.votes(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_votes_user_identifier ON public.votes(user_identifier);
CREATE INDEX idx_votes_payment_status ON public.votes(payment_status);
CREATE INDEX idx_votes_payment_reference ON public.votes(payment_reference);
CREATE INDEX idx_votes_paystack_reference ON public.votes(paystack_reference) 
  WHERE paystack_reference IS NOT NULL;
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);

-- Composite indexes for analytics
CREATE INDEX idx_votes_artist_status ON public.votes(artist_id, payment_status);
CREATE INDEX idx_votes_artist_date ON public.votes(artist_id, created_at DESC);
CREATE INDEX idx_votes_verified ON public.votes(artist_id, verified_at) 
  WHERE payment_status = 'completed';

-- Dashboard queries
CREATE INDEX idx_votes_dashboard ON public.votes(created_at DESC, payment_status, artist_id);
CREATE INDEX idx_votes_revenue ON public.votes(verified_at, amount_paid) 
  WHERE payment_status = 'completed';

COMMENT ON TABLE public.votes IS 'Vote purchases with payment tracking';
COMMENT ON COLUMN public.votes.user_identifier IS 'Email or phone number (verified via OTP)';
COMMENT ON COLUMN public.votes.validation_token IS 'JWT token from OTP verification process';
COMMENT ON COLUMN public.votes.items IS 'Snapshot of vote package at purchase time';

-- ==========================================
-- VOTE VALIDATIONS TABLE (OTP)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.vote_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Information
  identifier TEXT NOT NULL, -- Email or phone number
  method otp_method NOT NULL, -- How code was sent: 'email' or 'sms'
  
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
  CONSTRAINT validations_valid_attempts_check CHECK (attempts >= 0 AND attempts <= max_attempts),
  CONSTRAINT validations_valid_identifier_check CHECK (
    is_valid_email(identifier) OR is_valid_phone(identifier)
  ),
  CONSTRAINT validations_logical_timestamps_check CHECK (
    expires_at > created_at AND
    (verified_at IS NULL OR (verified_at >= created_at AND verified_at <= expires_at))
  )
);

-- Indexes for performance
CREATE INDEX idx_vote_validations_identifier ON public.vote_validations(identifier);
CREATE INDEX idx_vote_validations_expires_at ON public.vote_validations(expires_at);
CREATE INDEX idx_vote_validations_created_at ON public.vote_validations(created_at DESC);

-- Partial index for active codes only (huge performance boost)
CREATE INDEX idx_vote_validations_active ON public.vote_validations(identifier, expires_at)
  WHERE is_used = false 
    AND is_verified = false 
    AND expires_at > NOW() 
    AND attempts < max_attempts;

COMMENT ON TABLE public.vote_validations IS 'OTP codes for vote verification (email/SMS)';
COMMENT ON COLUMN public.vote_validations.verification_code IS 'Hashed 6-digit OTP code (never store plain text)';
COMMENT ON COLUMN public.vote_validations.attempts IS 'Failed verification attempts (rate limiting)';
COMMENT ON COLUMN public.vote_validations.expires_at IS 'Code expires 10 minutes after creation';

-- ==========================================
-- INSERT DEFAULT VOTE PACKAGES
-- ==========================================

-- Pre-populate with standard vote packages
INSERT INTO public.vote_packages (name, description, votes, price, discount, display_order, popular) VALUES
  (
    'Starter Pack',
    '10 votes to support your favorite artist',
    10,
    500.00,
    0,
    1,
    false
  ),
  (
    'Bronze Pack',
    '25 votes with 20% bonus value',
    25,
    1000.00,
    20,
    2,
    false
  ),
  (
    'Silver Pack',
    '50 votes with 28% bonus value - Most Popular!',
    50,
    1800.00,
    28,
    3,
    true
  ),
  (
    'Gold Pack',
    '100 votes with 36% bonus value',
    100,
    3200.00,
    36,
    4,
    false
  ),
  (
    'Platinum Pack',
    '250 votes with 40% bonus value - Best Deal!',
    250,
    7500.00,
    40,
    5,
    false
  )
ON CONFLICT DO NOTHING;

-- ==========================================
-- VOTING FLOW DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.vote_packages IS 
  'Vote packages with tiered pricing. Flow: 
  1. User selects package
  2. User enters email/phone
  3. OTP sent to verify contact
  4. User verifies OTP
  5. Redirect to Paystack payment
  6. Webhook confirms payment
  7. Votes recorded and leaderboard updated';

COMMENT ON TABLE public.votes IS 
  'Vote records. Status flow: 
  pending → processing → completed
  Failed payments stay in "failed" status
  Refunds change to "refunded" status';

COMMENT ON TABLE public.vote_validations IS 
  'OTP verification system. Flow:
  1. User requests OTP (creates record)
  2. Code sent via email/SMS
  3. User enters code (increments attempts if wrong)
  4. Success: is_verified=true, generates JWT token
  5. Token used to authorize payment initiation
  Codes expire after 10 minutes';