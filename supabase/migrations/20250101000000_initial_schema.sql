-- ==========================================
-- AFROMERICA ENTERTAINMENT - DATABASE SCHEMA
-- PostgreSQL + Supabase
-- Migration: Initial Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ==========================================
-- USERS & AUTHENTICATION
-- ==========================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==========================================
-- VENUES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  coordinates JSONB, -- {lat, lng}
  capacity INTEGER,
  description TEXT,
  image_url TEXT,
  amenities JSONB, -- Array of amenities
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_country ON public.venues(country);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON public.venues(slug);

-- ==========================================
-- EVENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  time TEXT,
  capacity INTEGER,
  tickets_sold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled', 'soldout')),
  category TEXT CHECK (category IN ('concert', 'festival', 'club', 'private', 'tour')),
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  cover_image_url TEXT,
  gallery JSONB, -- Array of image URLs
  metadata JSONB, -- Additional event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= date),
  CONSTRAINT valid_capacity CHECK (capacity IS NULL OR capacity > 0)
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(featured);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- Event-Venue relationship
CREATE TABLE IF NOT EXISTS public.event_venues (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, venue_id)
);

-- Ticket Types
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  quantity INTEGER NOT NULL,
  available INTEGER NOT NULL,
  max_per_order INTEGER DEFAULT 10,
  sale_start TIMESTAMP WITH TIME ZONE,
  sale_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_quantity CHECK (quantity > 0 AND available >= 0 AND available <= quantity),
  CONSTRAINT valid_max_per_order CHECK (max_per_order > 0)
);

CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON public.ticket_types(event_id);

-- ==========================================
-- ARTISTS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  stage_name TEXT,
  bio TEXT,
  genre JSONB, -- Array of genres
  image_url TEXT,
  cover_image_url TEXT,
  social_media JSONB, -- {instagram, twitter, facebook, youtube, spotify}
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON public.artists(featured);

-- Event-Artist relationship (lineup)
CREATE TABLE IF NOT EXISTS public.event_artists (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  performance_order INTEGER,
  performance_time TIMESTAMP WITH TIME ZONE,
  set_duration INTEGER, -- in minutes
  PRIMARY KEY (event_id, artist_id)
);

-- ==========================================
-- BOOKINGS (Event Tickets)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id),
  user_id UUID REFERENCES public.profiles(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT UNIQUE,
  paystack_reference TEXT,
  booking_reference TEXT UNIQUE NOT NULL,
  qr_code TEXT, -- Base64 or URL to QR code
  metadata JSONB, -- Additional booking data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON public.bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at);

CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id),
  quantity INTEGER NOT NULL,
  price_per_ticket DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_quantity CHECK (quantity > 0),
  CONSTRAINT valid_prices CHECK (price_per_ticket >= 0 AND total_price >= 0)
);

-- ==========================================
-- DECEMBER SHOWCASE VOTING (Free Voting)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.showcase_finalists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stage_name TEXT NOT NULL,
  bio TEXT,
  genre JSONB,
  image_url TEXT,
  cover_image_url TEXT,
  social_media JSONB,
  video_url TEXT,
  performance_video_url TEXT,
  vote_count INTEGER DEFAULT 0,
  rank INTEGER,
  is_qualified BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_vote_count CHECK (vote_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_showcase_finalists_rank ON public.showcase_finalists(rank);
CREATE INDEX IF NOT EXISTS idx_showcase_finalists_votes ON public.showcase_finalists(vote_count);

CREATE TABLE IF NOT EXISTS public.showcase_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finalist_id UUID REFERENCES public.showcase_finalists(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL, -- Hashed device fingerprint
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_voter UNIQUE(voter_id)
);

CREATE INDEX IF NOT EXISTS idx_showcase_votes_finalist ON public.showcase_votes(finalist_id);
CREATE INDEX IF NOT EXISTS idx_showcase_votes_voter ON public.showcase_votes(voter_id);

CREATE TABLE IF NOT EXISTS public.showcase_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voting_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  top_performers_count INTEGER DEFAULT 3,
  rules_text TEXT,
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (voting_end_date > voting_start_date),
  CONSTRAINT valid_top_count CHECK (top_performers_count > 0)
);

-- ==========================================
-- PILOT EVENT VOTING (Paid Voting)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.pilot_artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stage_name TEXT NOT NULL,
  bio TEXT,
  genre JSONB,
  image_url TEXT,
  cover_image_url TEXT,
  social_media JSONB,
  performance_video_url TEXT,
  total_votes INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  rank INTEGER,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_votes CHECK (total_votes >= 0),
  CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pilot_artists_rank ON public.pilot_artists(rank);
CREATE INDEX IF NOT EXISTS idx_pilot_artists_votes ON public.pilot_artists(total_votes);

CREATE TABLE IF NOT EXISTS public.vote_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  votes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  discount INTEGER DEFAULT 0, -- Percentage discount
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_votes CHECK (votes > 0),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_discount CHECK (discount >= 0 AND discount <= 100)
);

CREATE TABLE IF NOT EXISTS public.vote_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  total_votes INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  items JSONB NOT NULL, -- Cart items snapshot
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  paystack_reference TEXT,
  metadata JSONB,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_votes CHECK (total_votes > 0),
  CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_vote_purchases_email ON public.vote_purchases(email);
CREATE INDEX IF NOT EXISTS idx_vote_purchases_status ON public.vote_purchases(payment_status);

CREATE TABLE IF NOT EXISTS public.vote_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID REFERENCES public.vote_purchases(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.pilot_artists(id) ON DELETE CASCADE,
  votes INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_votes CHECK (votes > 0),
  CONSTRAINT valid_amount CHECK (amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pilot_transactions_artist ON public.vote_transactions(artist_id);
CREATE INDEX IF NOT EXISTS idx_pilot_transactions_purchase ON public.vote_transactions(purchase_id);

CREATE TABLE IF NOT EXISTS public.pilot_voting_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voting_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  rules_text TEXT,
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (voting_end_date > voting_start_date)
);

-- ==========================================
-- NEWSLETTER
-- ==========================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT, -- Where they signed up from
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscribers(status);
