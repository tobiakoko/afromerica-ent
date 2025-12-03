-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Database Schema
-- ==========================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';

-- ==========================================
-- ENUM TYPES
-- ==========================================

CREATE TYPE event_status AS ENUM (
  'draft',
  'upcoming',
  'ongoing',
  'completed',
  'cancelled',
  'soldout'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'checked_in'
);

CREATE TYPE otp_method AS ENUM ('email', 'sms');

CREATE TYPE message_status AS ENUM (
  'new',
  'read',
  'replied',
  'archived'
);

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Email validation function
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

-- Phone validation function
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~ '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

-- Generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  LOOP
    ref := 'AFR-' || UPPER(
      LPAD(TO_CHAR(EXTRACT(EPOCH FROM NOW())::BIGINT % 100000000, 'FM00000000'), 8, '0') ||
      LPAD(TO_CHAR(FLOOR(RANDOM() * 10000)::INTEGER, 'FM0000'), 4, '0')
    );
    
    SELECT EXISTS(SELECT 1 FROM public.tickets WHERE booking_reference = ref) INTO exists;
    EXIT WHEN NOT exists;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique booking reference after % attempts', max_attempts;
    END IF;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate check-in code
CREATE OR REPLACE FUNCTION generate_check_in_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- ADMIN USERS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT admins_email_format_check CHECK (is_valid_email(email))
);

CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admins_is_active ON public.admins(is_active) WHERE is_active = true;

-- ==========================================
-- ARTISTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  stage_name TEXT,
  bio TEXT,

  -- Classification
  genre TEXT[],

  -- Media
  photo_url TEXT,
  cover_image_url TEXT,

  -- Social Media
  instagram TEXT,
  twitter TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,

  -- Stats
  total_votes INTEGER DEFAULT 0 NOT NULL,
  total_vote_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  rank INTEGER,

  -- Flags
  is_active BOOLEAN DEFAULT true NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,

  -- Soft Delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES public.admins(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT artists_slug_format_check CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT artists_valid_votes_check CHECK (total_votes >= 0),
  CONSTRAINT artists_valid_amount_check CHECK (total_vote_amount >= 0)
);

CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_artists_is_active ON public.artists(is_active) WHERE is_active = true;
CREATE INDEX idx_artists_featured ON public.artists(featured) WHERE featured = true;
CREATE INDEX idx_artists_rank ON public.artists(rank) WHERE rank IS NOT NULL;
CREATE INDEX idx_artists_votes ON public.artists(total_votes DESC);
CREATE INDEX idx_artists_name_trgm ON public.artists USING gin(name gin_trgm_ops);
CREATE UNIQUE INDEX idx_artists_slug_active ON public.artists(slug) WHERE is_active = true AND deleted_at IS NULL;

-- ==========================================
-- EVENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Scheduling
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  time TEXT,

  -- Location
  venue TEXT NOT NULL,
  venue_address TEXT,
  city TEXT,

  -- Ticketing
  ticket_price DECIMAL(10,2),
  capacity INTEGER,
  tickets_sold INTEGER DEFAULT 0 NOT NULL,

  -- Media
  image_url TEXT,
  cover_image_url TEXT,

  -- Status & Flags
  status event_status DEFAULT 'draft' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  show_leaderboard BOOLEAN DEFAULT false NOT NULL,

  -- SEO & Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Soft Delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES public.admins(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT events_slug_format_check CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT events_valid_dates_check CHECK (end_date IS NULL OR end_date >= event_date),
  CONSTRAINT events_valid_capacity_check CHECK (capacity IS NULL OR capacity > 0),
  CONSTRAINT events_valid_tickets_sold_check CHECK (tickets_sold >= 0),
  CONSTRAINT events_valid_price_check CHECK (ticket_price IS NULL OR ticket_price >= 0),
  CONSTRAINT events_logical_dates_check CHECK (
    (end_date IS NULL OR end_date >= event_date) AND
    (published_at IS NULL OR published_at <= created_at + INTERVAL '1 year')
  )
);

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_is_active ON public.events(is_active) WHERE is_active = true;
CREATE INDEX idx_events_is_published ON public.events(is_published) WHERE is_published = true;
CREATE INDEX idx_events_featured ON public.events(featured) WHERE featured = true;
CREATE INDEX idx_events_show_leaderboard ON public.events(show_leaderboard) WHERE show_leaderboard = true;
CREATE INDEX idx_events_upcoming ON public.events(event_date) WHERE status = 'upcoming' AND is_published = true;
CREATE UNIQUE INDEX idx_events_slug_active ON public.events(slug) WHERE is_published = true AND deleted_at IS NULL;

CREATE INDEX idx_events_fts ON public.events USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- ==========================================
-- TICKET_TYPES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Basic Information
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,

  -- Inventory
  quantity INTEGER NOT NULL,
  available INTEGER NOT NULL,

  -- Purchase Limits
  max_per_order INTEGER DEFAULT 10,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,

  -- Display Order
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT ticket_types_valid_price_check CHECK (price >= 0),
  CONSTRAINT ticket_types_valid_quantity_check CHECK (quantity > 0),
  CONSTRAINT ticket_types_valid_available_check CHECK (available >= 0 AND available <= quantity),
  CONSTRAINT ticket_types_valid_max_per_order_check CHECK (max_per_order > 0),
  CONSTRAINT ticket_types_non_negative_available_check CHECK (available >= 0)
);

CREATE INDEX idx_ticket_types_event ON public.ticket_types(event_id);
CREATE INDEX idx_ticket_types_is_active ON public.ticket_types(is_active) WHERE is_active = true;
CREATE INDEX idx_ticket_types_display_order ON public.ticket_types(event_id, display_order);

-- ==========================================
-- TICKETS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,

  -- Customer Information
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_name TEXT NOT NULL,

  -- Purchase Details
  quantity INTEGER NOT NULL,
  price_per_ticket DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,

  -- Payment Information
  payment_reference TEXT UNIQUE NOT NULL,
  paystack_reference TEXT UNIQUE,
  paystack_access_code TEXT,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,

  -- Booking Status
  booking_status booking_status DEFAULT 'pending' NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL DEFAULT generate_booking_reference(),

  -- Check-in
  qr_code TEXT,
  check_in_code TEXT UNIQUE DEFAULT generate_check_in_code(),
  checked_in_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT tickets_valid_quantity_check CHECK (quantity > 0),
  CONSTRAINT tickets_valid_amounts_check CHECK (
    price_per_ticket >= 0 AND
    total_amount >= 0 AND
    total_amount = price_per_ticket * quantity
  ),
  CONSTRAINT tickets_email_format_check CHECK (is_valid_email(user_email)),
  CONSTRAINT tickets_phone_format_check CHECK (user_phone IS NULL OR is_valid_phone(user_phone)),
  CONSTRAINT tickets_logical_timestamps_check CHECK (verified_at IS NULL OR verified_at >= created_at)
);

CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_email ON public.tickets(user_email);
CREATE INDEX idx_tickets_payment_status ON public.tickets(payment_status);
CREATE INDEX idx_tickets_booking_status ON public.tickets(booking_status);
CREATE INDEX idx_tickets_payment_reference ON public.tickets(payment_reference);
CREATE INDEX idx_tickets_paystack_reference ON public.tickets(paystack_reference) WHERE paystack_reference IS NOT NULL;
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX idx_tickets_check_in_code ON public.tickets(check_in_code) WHERE check_in_code IS NOT NULL;
CREATE INDEX idx_tickets_event_status ON public.tickets(event_id, payment_status);
CREATE INDEX idx_tickets_email_status ON public.tickets(user_email, payment_status);
CREATE INDEX idx_tickets_dashboard ON public.tickets(created_at DESC, payment_status, event_id);
CREATE INDEX idx_tickets_revenue ON public.tickets(verified_at, total_amount) WHERE payment_status = 'completed';

-- ==========================================
-- VOTE PACKAGES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.vote_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Package Details
  name TEXT NOT NULL,
  description TEXT,
  votes INTEGER NOT NULL,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  discount INTEGER DEFAULT 0,

  -- Display
  display_order INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,

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

CREATE INDEX idx_vote_packages_is_active ON public.vote_packages(is_active) WHERE is_active = true;
CREATE INDEX idx_vote_packages_popular ON public.vote_packages(popular) WHERE popular = true;
CREATE INDEX idx_vote_packages_display_order ON public.vote_packages(display_order);

-- ==========================================
-- VOTES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,

  -- User Identification
  user_identifier TEXT NOT NULL,
  user_name TEXT,

  -- Vote Details
  vote_count INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,

  -- Payment Information
  payment_reference TEXT UNIQUE NOT NULL,
  paystack_reference TEXT UNIQUE,
  paystack_access_code TEXT,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,

  -- Cart snapshot
  items JSONB,

  -- Validation
  validation_token TEXT,
  otp_verified BOOLEAN DEFAULT false,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT votes_valid_vote_count_check CHECK (vote_count > 0),
  CONSTRAINT votes_valid_amount_check CHECK (amount_paid >= 0),
  CONSTRAINT votes_valid_identifier_check CHECK (
    is_valid_email(user_identifier) OR is_valid_phone(user_identifier)
  )
);

CREATE INDEX idx_votes_artist_id ON public.votes(artist_id);
CREATE INDEX idx_votes_event_id ON public.votes(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_votes_user_identifier ON public.votes(user_identifier);
CREATE INDEX idx_votes_payment_status ON public.votes(payment_status);
CREATE INDEX idx_votes_payment_reference ON public.votes(payment_reference);
CREATE INDEX idx_votes_paystack_reference ON public.votes(paystack_reference) WHERE paystack_reference IS NOT NULL;
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);
CREATE INDEX idx_votes_artist_status ON public.votes(artist_id, payment_status);
CREATE INDEX idx_votes_artist_date ON public.votes(artist_id, created_at DESC);
CREATE INDEX idx_votes_verified ON public.votes(artist_id, verified_at) WHERE payment_status = 'completed';
CREATE INDEX idx_votes_dashboard ON public.votes(created_at DESC, payment_status, artist_id);
CREATE INDEX idx_votes_revenue ON public.votes(verified_at, amount_paid) WHERE payment_status = 'completed';

-- ==========================================
-- VOTE VALIDATIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.vote_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  method otp_method NOT NULL,
  verification_code TEXT NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  max_attempts INTEGER DEFAULT 3 NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
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

CREATE INDEX idx_vote_validations_identifier ON public.vote_validations(identifier);
CREATE INDEX idx_vote_validations_expires_at ON public.vote_validations(expires_at);
CREATE INDEX idx_vote_validations_created_at ON public.vote_validations(created_at DESC);
CREATE INDEX idx_vote_validations_active ON public.vote_validations(identifier, expires_at)
  WHERE is_used = false AND is_verified = false AND attempts < max_attempts;

-- ==========================================
-- CONTACT MESSAGES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status message_status DEFAULT 'new' NOT NULL,
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT contact_messages_email_format_check CHECK (is_valid_email(email)),
  CONSTRAINT contact_messages_phone_format_check CHECK (phone IS NULL OR is_valid_phone(phone))
);

CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_status_date ON public.contact_messages(status, created_at DESC)
  WHERE status IN ('new', 'read');

-- ==========================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  unsubscribed_at TIMESTAMPTZ,

  CONSTRAINT newsletter_email_format_check CHECK (is_valid_email(email))
);

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_is_active ON public.newsletter_subscribers(is_active) WHERE is_active = true;
CREATE INDEX idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);

-- ==========================================
-- WEBHOOK LOGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  reference TEXT,
  payload JSONB NOT NULL,
  headers JSONB,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_webhook_logs_source ON public.webhook_logs(source);
CREATE INDEX idx_webhook_logs_event_type ON public.webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_reference ON public.webhook_logs(reference) WHERE reference IS NOT NULL;
CREATE INDEX idx_webhook_logs_processed ON public.webhook_logs(processed);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

-- ==========================================
-- BUSINESS LOGIC FUNCTIONS
-- ==========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CORRECTED: Update ticket status and verified timestamp (BEFORE trigger)
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    NEW.booking_status = 'confirmed';
    NEW.verified_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CORRECTED: Update inventory after payment (AFTER trigger with locking)
CREATE OR REPLACE FUNCTION update_inventory_after_ticket_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_ticket_type_available INTEGER;
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    
    -- Lock and check ticket type availability
    SELECT available INTO v_ticket_type_available
    FROM public.ticket_types
    WHERE id = NEW.ticket_type_id
    FOR UPDATE;

    IF v_ticket_type_available < NEW.quantity THEN
      RAISE EXCEPTION 'Insufficient tickets available';
    END IF;

    -- Update ticket type availability
    UPDATE public.ticket_types
    SET available = available - NEW.quantity
    WHERE id = NEW.ticket_type_id;

    -- Update event tickets_sold
    UPDATE public.events
    SET tickets_sold = tickets_sold + NEW.quantity
    WHERE id = NEW.event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate ticket amount matches ticket type price
CREATE OR REPLACE FUNCTION validate_ticket_amount()
RETURNS TRIGGER AS $$
DECLARE
  expected_price DECIMAL(10,2);
BEGIN
  IF NEW.ticket_type_id IS NOT NULL THEN
    SELECT price INTO expected_price
    FROM public.ticket_types
    WHERE id = NEW.ticket_type_id;
    
    IF NEW.price_per_ticket != expected_price THEN
      RAISE EXCEPTION 'Ticket price mismatch. Expected: %, Got: %', expected_price, NEW.price_per_ticket;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recalculate artist rankings
CREATE OR REPLACE FUNCTION recalculate_artist_rankings()
RETURNS VOID AS $$
BEGIN
  WITH ranked_artists AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY total_votes DESC, total_vote_amount DESC) as new_rank
    FROM public.artists
    WHERE is_active = true AND deleted_at IS NULL
  )
  UPDATE public.artists
  SET rank = ranked_artists.new_rank
  FROM ranked_artists
  WHERE public.artists.id = ranked_artists.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CORRECTED: Update vote verified timestamp (BEFORE trigger)
CREATE OR REPLACE FUNCTION update_vote_verified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    NEW.verified_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CORRECTED: Update artist totals (AFTER trigger)
CREATE OR REPLACE FUNCTION update_artist_totals_after_vote()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN

    -- Update artist totals
    UPDATE public.artists
    SET
      total_votes = total_votes + NEW.vote_count,
      total_vote_amount = total_vote_amount + NEW.amount_paid,
      updated_at = NOW()
    WHERE id = NEW.artist_id;

    -- Recalculate rankings
    PERFORM recalculate_artist_rankings();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete tracking
CREATE OR REPLACE FUNCTION soft_delete_artist()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deleted_at = NOW();
    NEW.deleted_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION soft_delete_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deleted_at = NOW();
    NEW.deleted_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup expired validations
CREATE OR REPLACE FUNCTION cleanup_expired_validations()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.vote_validations
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup old webhook logs
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.webhook_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Updated_at triggers
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_types_updated_at
  BEFORE UPDATE ON public.ticket_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vote_packages_updated_at
  BEFORE UPDATE ON public.vote_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- CORRECTED: Ticket payment triggers
CREATE TRIGGER update_tickets_before_payment
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_availability();

CREATE TRIGGER update_inventory_after_ticket_payment
  AFTER UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_after_ticket_payment();

CREATE TRIGGER validate_ticket_amount_trigger
  BEFORE INSERT OR UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION validate_ticket_amount();

-- CORRECTED: Vote payment triggers
CREATE TRIGGER update_votes_before_payment
  BEFORE UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_verified_timestamp();

CREATE TRIGGER update_artist_totals_after_vote
  AFTER UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_totals_after_vote();

-- Soft delete triggers
CREATE TRIGGER artist_soft_delete
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_artist();

CREATE TRIGGER event_soft_delete
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_event();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Admins policies
CREATE POLICY "Admins can view all admin records"
  ON public.admins FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Admins can update their own profile"
  ON public.admins FOR UPDATE
  USING (auth.uid() = id);

-- Artists policies
CREATE POLICY "Anyone can view active artists"
  ON public.artists FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Admins can manage artists"
  ON public.artists FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Events policies
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Ticket Types policies
CREATE POLICY "Anyone can view active ticket types"
  ON public.ticket_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage ticket types"
  ON public.ticket_types FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- CORRECTED: Tickets policies
CREATE POLICY "Admins can view all tickets"
  ON public.tickets FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage tickets"
  ON public.tickets FOR ALL
  USING (
    auth.role() = 'service_role'
  );

-- Vote Packages policies
CREATE POLICY "Anyone can view active vote packages"
  ON public.vote_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage vote packages"
  ON public.vote_packages FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- CORRECTED: Votes policies
CREATE POLICY "Admins can view all votes"
  ON public.votes FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage votes"
  ON public.votes FOR ALL
  USING (
    auth.role() = 'service_role'
  );

-- CORRECTED: Vote Validations policies
CREATE POLICY "Service role can manage validations"
  ON public.vote_validations FOR ALL
  USING (
    auth.role() = 'service_role'
  );

-- Contact Messages policies
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Webhook Logs policies
CREATE POLICY "Admins can view webhook logs"
  ON public.webhook_logs FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage webhook logs"
  ON public.webhook_logs FOR ALL
  USING (
    auth.role() = 'service_role'
  );

-- ==========================================
-- PERFORMANCE OPTIMIZATIONS
-- ==========================================

ALTER TABLE public.tickets SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE public.votes SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE public.webhook_logs SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE public.events ALTER COLUMN status SET STATISTICS 1000;
ALTER TABLE public.events ALTER COLUMN event_date SET STATISTICS 1000;
ALTER TABLE public.tickets ALTER COLUMN payment_status SET STATISTICS 1000;
ALTER TABLE public.votes ALTER COLUMN payment_status SET STATISTICS 1000;

-- ==========================================
-- INITIAL DATA
-- ==========================================

INSERT INTO public.vote_packages (name, description, votes, price, discount, display_order, popular) VALUES
  ('Starter Pack', '10 votes to support your artist', 10, 50, 0, 1, false),
  ('Bronze Pack', '25 votes with 20% bonus', 25, 100, 20, 2, false),
  ('Silver Pack', '50 votes with 28% bonus', 50, 180, 28, 3, true),
  ('Gold Pack', '100 votes with 36% bonus', 100, 320, 36, 4, false),
  ('Platinum Pack', '250 votes with 40% bonus', 250, 750, 40, 5, false)
ON CONFLICT DO NOTHING;

-- ==========================================
-- ANALYTICS VIEWS
-- ==========================================

CREATE OR REPLACE VIEW public.event_analytics AS
SELECT
  e.id,
  e.title,
  e.slug,
  e.event_date,
  e.status,
  e.capacity,
  e.tickets_sold,
  CASE
    WHEN e.capacity > 0 THEN ROUND((e.tickets_sold::numeric / e.capacity) * 100, 2)
    ELSE 0
  END as occupancy_percentage,
  COUNT(t.id) as total_bookings,
  COUNT(t.id) FILTER (WHERE t.payment_status = 'completed') as completed_bookings,
  COALESCE(SUM(t.total_amount) FILTER (WHERE t.payment_status = 'completed'), 0) as total_revenue,
  COALESCE(AVG(t.total_amount) FILTER (WHERE t.payment_status = 'completed'), 0) as avg_ticket_value
FROM public.events e
LEFT JOIN public.tickets t ON t.event_id = e.id
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.title, e.slug, e.event_date, e.status, e.capacity, e.tickets_sold;

CREATE OR REPLACE VIEW public.artist_leaderboard AS
SELECT
  a.id,
  a.name,
  a.slug,
  a.stage_name,
  a.photo_url,
  a.total_votes,
  a.total_vote_amount,
  a.rank,
  COUNT(v.id) as transaction_count,
  COUNT(v.id) FILTER (WHERE v.payment_status = 'completed') as completed_transactions,
  COALESCE(AVG(v.vote_count) FILTER (WHERE v.payment_status = 'completed'), 0) as avg_votes_per_transaction
FROM public.artists a
LEFT JOIN public.votes v ON v.artist_id = a.id
WHERE a.is_active = true AND a.deleted_at IS NULL
GROUP BY a.id, a.name, a.slug, a.stage_name, a.photo_url, a.total_votes, a.total_vote_amount, a.rank
ORDER BY a.rank NULLS LAST, a.total_votes DESC;

COMMENT ON SCHEMA public IS 'Afromerica Entertainment Platform - Corrected Schema v2.1';