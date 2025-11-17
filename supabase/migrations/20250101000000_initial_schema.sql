-- ==========================================
-- MIGRATION: 20250101000000_initial_schema.sql
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Foundation Layer - Core Database Structure
-- ==========================================
-- Purpose: Creates the core database structure for the platform
-- - PostgreSQL extensions
-- - Custom enum types
-- - Core business tables (admins, artists, events, tickets)
-- - Relationship tables (ticket_types)
-- - Base constraints and indexes
-- ==========================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For gen_random_uuid()

-- Set timezone
SET timezone = 'UTC';

-- ==========================================
-- CUSTOM ENUM TYPES
-- ==========================================

-- Event status lifecycle
CREATE TYPE event_status AS ENUM (
  'draft',      -- Being created/edited
  'upcoming',   -- Published, not yet started
  'ongoing',    -- Currently happening
  'completed',  -- Finished
  'cancelled',  -- Cancelled
  'soldout'     -- All tickets sold
);

-- Payment processing status
CREATE TYPE payment_status AS ENUM (
  'pending',     -- Awaiting payment
  'processing',  -- Payment in progress
  'completed',   -- Successfully paid
  'failed',      -- Payment failed
  'refunded'     -- Payment refunded
);

-- Booking/ticket status
CREATE TYPE booking_status AS ENUM (
  'pending',     -- Awaiting confirmation
  'confirmed',   -- Payment confirmed
  'cancelled',   -- Booking cancelled
  'checked_in'   -- User checked in at event
);

-- OTP delivery method
CREATE TYPE otp_method AS ENUM ('email', 'sms');

-- Contact message status
CREATE TYPE message_status AS ENUM (
  'new',      -- New message
  'read',     -- Admin read it
  'replied',  -- Admin replied
  'archived'  -- Archived
);

COMMENT ON TYPE event_status IS 'Event lifecycle status';
COMMENT ON TYPE payment_status IS 'Payment processing status';
COMMENT ON TYPE booking_status IS 'Ticket booking status';
COMMENT ON TYPE otp_method IS 'OTP delivery method (email or SMS)';
COMMENT ON TYPE message_status IS 'Contact message status';

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

COMMENT ON FUNCTION is_valid_email IS 'Validates email format using RFC 5322 compliant regex';

-- Validate phone format (E.164)
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~ '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

COMMENT ON FUNCTION is_valid_phone IS 'Validates phone number in E.164 format';

-- Generate unique booking reference (AFR-XXXXXXXX-XXXX)
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  LOOP
    -- Format: AFR-{timestamp}-{random}
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

COMMENT ON FUNCTION generate_booking_reference IS 'Generates unique booking reference for tickets';

-- Generate check-in code (6-char alphanumeric)
CREATE OR REPLACE FUNCTION generate_check_in_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION generate_check_in_code IS 'Generates 6-character check-in code for tickets';

-- ==========================================
-- ADMIN USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  
  -- Role & Permissions
  role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'editor')),
  
  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT admins_email_format_check CHECK (is_valid_email(email))
);

-- Indexes
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admins_is_active ON public.admins(is_active) WHERE is_active = true;

COMMENT ON TABLE public.admins IS 'Admin users with dashboard access';
COMMENT ON COLUMN public.admins.role IS 'Admin role: admin (full access) or editor (limited access)';

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
  genre TEXT[], -- e.g., ['afrobeats', 'hip-hop']
  
  -- Media
  photo_url TEXT,
  cover_image_url TEXT,
  
  -- Social Media Links
  instagram TEXT,
  twitter TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  
  -- Voting Stats (updated via triggers)
  total_votes INTEGER DEFAULT 0 NOT NULL,
  total_vote_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  rank INTEGER, -- Calculated ranking based on votes
  
  -- Status Flags
  is_active BOOLEAN DEFAULT true NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  
  -- Soft Delete (preserves data for audit trail)
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

-- Indexes for performance
CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_artists_is_active ON public.artists(is_active) WHERE is_active = true;
CREATE INDEX idx_artists_featured ON public.artists(featured) WHERE featured = true;
CREATE INDEX idx_artists_rank ON public.artists(rank) WHERE rank IS NOT NULL;
CREATE INDEX idx_artists_votes ON public.artists(total_votes DESC);
CREATE INDEX idx_artists_name_trgm ON public.artists USING gin(name gin_trgm_ops);

-- Unique slug for active artists only
CREATE UNIQUE INDEX idx_artists_slug_active 
  ON public.artists(slug) 
  WHERE is_active = true AND deleted_at IS NULL;

COMMENT ON TABLE public.artists IS 'Artists participating in voting competitions';
COMMENT ON COLUMN public.artists.slug IS 'URL-safe identifier (e.g., "wizkid", "davido")';
COMMENT ON COLUMN public.artists.total_votes IS 'Cumulative vote count (auto-updated)';
COMMENT ON COLUMN public.artists.rank IS 'Current ranking (auto-calculated)';

-- ==========================================
-- EVENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT, -- For previews/cards
  
  -- Scheduling
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  time TEXT, -- Display format: "8:00 PM WAT"
  
  -- Location
  venue TEXT NOT NULL,
  venue_address TEXT,
  city TEXT,
  
  -- Ticketing
  ticket_price DECIMAL(10,2), -- Base price (can have multiple types)
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
  show_leaderboard BOOLEAN DEFAULT false NOT NULL, -- Enable voting for this event
  
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

-- Indexes for performance
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_is_active ON public.events(is_active) WHERE is_active = true;
CREATE INDEX idx_events_is_published ON public.events(is_published) WHERE is_published = true;
CREATE INDEX idx_events_featured ON public.events(featured) WHERE featured = true;
CREATE INDEX idx_events_show_leaderboard ON public.events(show_leaderboard) WHERE show_leaderboard = true;
CREATE INDEX idx_events_upcoming ON public.events(event_date) 
  WHERE status = 'upcoming' AND is_published = true;

-- Unique slug for published events only
CREATE UNIQUE INDEX idx_events_slug_active 
  ON public.events(slug) 
  WHERE is_published = true AND deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_events_fts ON public.events USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

COMMENT ON TABLE public.events IS 'Events with ticketing and optional voting';
COMMENT ON COLUMN public.events.show_leaderboard IS 'Enable artist voting leaderboard for this event';
COMMENT ON COLUMN public.events.metadata IS 'Additional event data (JSON)';

-- ==========================================
-- TICKET TYPES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- Basic Information
  name TEXT NOT NULL, -- e.g., "VIP", "Regular", "Early Bird"
  description TEXT,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  
  -- Inventory Management
  quantity INTEGER NOT NULL, -- Total available
  available INTEGER NOT NULL, -- Currently available
  
  -- Purchase Limits
  max_per_order INTEGER DEFAULT 10,
  
  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- Display Order (for UI sorting)
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

-- Indexes
CREATE INDEX idx_ticket_types_event ON public.ticket_types(event_id);
CREATE INDEX idx_ticket_types_is_active ON public.ticket_types(is_active) WHERE is_active = true;
CREATE INDEX idx_ticket_types_display_order ON public.ticket_types(event_id, display_order);

COMMENT ON TABLE public.ticket_types IS 'Different ticket tiers for events (VIP, Regular, etc.)';
COMMENT ON COLUMN public.ticket_types.available IS 'Remaining tickets (decremented on purchase)';

-- ==========================================
-- TICKETS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
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
  
  -- Payment Information (Paystack)
  payment_reference TEXT UNIQUE NOT NULL, -- Our internal reference
  paystack_reference TEXT UNIQUE, -- Paystack transaction reference
  paystack_access_code TEXT, -- For payment initialization
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT, -- card, bank_transfer, ussd, etc.
  
  -- Booking Status
  booking_status booking_status DEFAULT 'pending' NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL DEFAULT generate_booking_reference(),
  
  -- Check-in System
  qr_code TEXT, -- QR code data for scanning
  check_in_code TEXT UNIQUE DEFAULT generate_check_in_code(),
  checked_in_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ, -- When payment was confirmed
  
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

-- Indexes for performance
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_email ON public.tickets(user_email);
CREATE INDEX idx_tickets_payment_status ON public.tickets(payment_status);
CREATE INDEX idx_tickets_booking_status ON public.tickets(booking_status);
CREATE INDEX idx_tickets_payment_reference ON public.tickets(payment_reference);
CREATE INDEX idx_tickets_paystack_reference ON public.tickets(paystack_reference) 
  WHERE paystack_reference IS NOT NULL;
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX idx_tickets_check_in_code ON public.tickets(check_in_code) 
  WHERE check_in_code IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX idx_tickets_event_status ON public.tickets(event_id, payment_status);
CREATE INDEX idx_tickets_email_status ON public.tickets(user_email, payment_status);

-- Dashboard queries
CREATE INDEX idx_tickets_dashboard ON public.tickets(created_at DESC, payment_status, event_id);
CREATE INDEX idx_tickets_revenue ON public.tickets(verified_at, total_amount) 
  WHERE payment_status = 'completed';

COMMENT ON TABLE public.tickets IS 'Ticket purchases and bookings';
COMMENT ON COLUMN public.tickets.payment_reference IS 'Internal unique reference for tracking';
COMMENT ON COLUMN public.tickets.booking_reference IS 'User-facing reference (AFR-XXXXXXXX-XXXX)';
COMMENT ON COLUMN public.tickets.qr_code IS 'QR code data for event check-in';

-- ==========================================
-- SCHEMA COMMENTS
-- ==========================================

COMMENT ON SCHEMA public IS 'Afromerica Entertainment Platform - Foundation Layer';