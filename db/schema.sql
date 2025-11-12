-- ==========================================
-- AFROMERICA ENTERTAINMENT - DATABASE SCHEMA
-- PostgreSQL + Supabase
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS & AUTHENTICATION
-- ==========================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ==========================================
-- VENUES
-- ==========================================

CREATE TABLE public.venues (
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

-- ==========================================
-- EVENTS
-- ==========================================

CREATE TABLE public.events (
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

-- Event-Venue relationship
CREATE TABLE public.event_venues (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, venue_id)
);

-- Ticket Types
CREATE TABLE public.ticket_types (
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

-- ==========================================
-- ARTISTS
-- ==========================================

CREATE TABLE public.artists (
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

-- Event-Artist relationship (lineup)
CREATE TABLE public.event_artists (
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

CREATE TABLE public.bookings (
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

CREATE TABLE public.booking_items (
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

CREATE TABLE public.showcase_finalists (
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

CREATE TABLE public.showcase_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finalist_id UUID REFERENCES public.showcase_finalists(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL, -- Hashed device fingerprint
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_voter UNIQUE(voter_id)
);

CREATE TABLE public.showcase_settings (
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

CREATE TABLE public.pilot_artists (
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

CREATE TABLE public.vote_packages (
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

CREATE TABLE public.vote_purchases (
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

CREATE TABLE public.vote_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID REFERENCES public.vote_purchases(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.pilot_artists(id) ON DELETE CASCADE,
  votes INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_votes CHECK (votes > 0),
  CONSTRAINT valid_amount CHECK (amount >= 0)
);

CREATE TABLE public.pilot_voting_settings (
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

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT, -- Where they signed up from
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Events
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_featured ON public.events(featured);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_category ON public.events(category);

-- Bookings
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_event ON public.bookings(event_id);
CREATE INDEX idx_bookings_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_created ON public.bookings(created_at);

-- Showcase Voting
CREATE INDEX idx_showcase_votes_finalist ON public.showcase_votes(finalist_id);
CREATE INDEX idx_showcase_votes_voter ON public.showcase_votes(voter_id);
CREATE INDEX idx_showcase_finalists_rank ON public.showcase_finalists(rank);
CREATE INDEX idx_showcase_finalists_votes ON public.showcase_finalists(vote_count);

-- Pilot Voting
CREATE INDEX idx_pilot_transactions_artist ON public.vote_transactions(artist_id);
CREATE INDEX idx_pilot_transactions_purchase ON public.vote_transactions(purchase_id);
CREATE INDEX idx_vote_purchases_email ON public.vote_purchases(email);
CREATE INDEX idx_vote_purchases_status ON public.vote_purchases(payment_status);
CREATE INDEX idx_pilot_artists_rank ON public.pilot_artists(rank);
CREATE INDEX idx_pilot_artists_votes ON public.pilot_artists(total_votes);

-- Artists
CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_artists_featured ON public.artists(featured);

-- Venues
CREATE INDEX idx_venues_city ON public.venues(city);
CREATE INDEX idx_venues_country ON public.venues(country);

-- Newsletter
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON public.newsletter_subscribers(status);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showcase_finalists_updated_at
  BEFORE UPDATE ON public.showcase_finalists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pilot_artists_updated_at
  BEFORE UPDATE ON public.pilot_artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Recalculate showcase finalist rankings
CREATE OR REPLACE FUNCTION recalculate_showcase_rankings()
RETURNS VOID AS $$
BEGIN
  WITH ranked_finalists AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY vote_count DESC) as new_rank
    FROM public.showcase_finalists
  )
  UPDATE public.showcase_finalists
  SET rank = ranked_finalists.new_rank
  FROM ranked_finalists
  WHERE public.showcase_finalists.id = ranked_finalists.id;
END;
$$ LANGUAGE plpgsql;

-- Function: Recalculate pilot artist rankings
CREATE OR REPLACE FUNCTION recalculate_pilot_rankings()
RETURNS VOID AS $$
BEGIN
  WITH ranked_artists AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY total_votes DESC, total_amount DESC) as new_rank
    FROM public.pilot_artists
  )
  UPDATE public.pilot_artists
  SET rank = ranked_artists.new_rank
  FROM ranked_artists
  WHERE public.pilot_artists.id = ranked_artists.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update showcase finalist votes and rankings
CREATE OR REPLACE FUNCTION update_showcase_finalist_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.showcase_finalists
  SET vote_count = vote_count + 1
  WHERE id = NEW.finalist_id;
  
  PERFORM recalculate_showcase_rankings();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_showcase_votes_after_insert
  AFTER INSERT ON public.showcase_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_showcase_finalist_votes();

-- Trigger: Update pilot artist votes and rankings
CREATE OR REPLACE FUNCTION update_pilot_artist_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.pilot_artists
  SET 
    total_votes = total_votes + NEW.votes,
    total_amount = total_amount + NEW.amount
  WHERE id = NEW.artist_id;
  
  PERFORM recalculate_pilot_rankings();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pilot_votes_after_transaction
  AFTER INSERT ON public.vote_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_pilot_artist_votes();

-- Trigger: Reduce ticket availability after booking
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND OLD.payment_status = 'pending' THEN
    UPDATE public.ticket_types tt
    SET available = tt.available - bi.quantity
    FROM public.booking_items bi
    WHERE bi.booking_id = NEW.id
    AND bi.ticket_type_id = tt.id;
    
    -- Update event tickets_sold
    UPDATE public.events
    SET tickets_sold = tickets_sold + (
      SELECT COALESCE(SUM(quantity), 0)
      FROM public.booking_items
      WHERE booking_id = NEW.id
    )
    WHERE id = NEW.event_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_after_payment
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_availability();

-- Function: Generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    ref := 'AFR-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_reference = ref) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_finalists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events: Public read, admin write
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Venues: Public read, admin write
CREATE POLICY "Venues are viewable by everyone"
  ON public.venues FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage venues"
  ON public.venues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Artists: Public read, admin write
CREATE POLICY "Artists are viewable by everyone"
  ON public.artists FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage artists"
  ON public.artists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Ticket Types: Public read, admin write
CREATE POLICY "Ticket types are viewable by everyone"
  ON public.ticket_types FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ticket types"
  ON public.ticket_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Bookings: Users can view own bookings, admins can view all
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Showcase Voting: Public read, restricted write
CREATE POLICY "Showcase finalists are viewable by everyone"
  ON public.showcase_finalists FOR SELECT
  USING (true);

CREATE POLICY "Anyone can vote in showcase"
  ON public.showcase_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Showcase votes are viewable by admins"
  ON public.showcase_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Pilot Voting: Public read for artists/packages
CREATE POLICY "Pilot artists are viewable by everyone"
  ON public.pilot_artists FOR SELECT
  USING (true);

CREATE POLICY "Vote packages are viewable by everyone"
  ON public.vote_packages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can purchase votes"
  ON public.vote_purchases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own vote purchases"
  ON public.vote_purchases FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Newsletter: Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- SEED DATA (Optional - for development)
-- ==========================================

-- Insert default vote packages
INSERT INTO public.vote_packages (name, votes, price, discount, popular, description) VALUES
  ('Bronze Package', 10, 500, 0, false, '10 votes for your favorite artist'),
  ('Silver Package', 25, 1000, 20, false, '25 votes with 20% discount'),
  ('Gold Package', 50, 1800, 28, true, '50 votes with 28% discount - Most popular!'),
  ('Platinum Package', 100, 3200, 36, false, '100 votes with 36% discount - Best value!'),
  ('Diamond Package', 250, 7500, 40, false, '250 votes with 40% discount - Ultimate support!');

-- Insert showcase settings (adjust dates as needed)
INSERT INTO public.showcase_settings (
  voting_start_date,
  voting_end_date,
  is_active,
  top_performers_count,
  rules_text
) VALUES (
  '2025-12-01 00:00:00+00',
  '2025-12-31 23:59:59+00',
  true,
  3,
  'Vote for your favorite finalist! One vote per person. Voting ends December 31st.'
);

-- Insert pilot voting settings
INSERT INTO public.pilot_voting_settings (
  voting_start_date,
  voting_end_date,
  is_active,
  rules_text
) VALUES (
  '2025-11-01 00:00:00+00',
  '2026-01-31 23:59:59+00',
  true,
  'Purchase vote packages and support your favorite artists. Voting ends January 31st, 2026.'
);

-- ==========================================
-- END OF SCHEMA
-- ==========================================