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
ALTER TABLE public.showcase_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_voting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- EVENTS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- VENUES POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Venues are viewable by everyone" ON public.venues;
CREATE POLICY "Venues are viewable by everyone"
  ON public.venues FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage venues" ON public.venues;
CREATE POLICY "Admins can manage venues"
  ON public.venues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- ==========================================
-- ARTISTS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Artists are viewable by everyone" ON public.artists;
CREATE POLICY "Artists are viewable by everyone"
  ON public.artists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage artists" ON public.artists;
CREATE POLICY "Admins can manage artists"
  ON public.artists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- ==========================================
-- TICKET TYPES POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Ticket types are viewable by everyone" ON public.ticket_types;
CREATE POLICY "Ticket types are viewable by everyone"
  ON public.ticket_types FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage ticket types" ON public.ticket_types;
CREATE POLICY "Admins can manage ticket types"
  ON public.ticket_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- BOOKINGS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- BOOKING ITEMS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Users can view own booking items" ON public.booking_items;
CREATE POLICY "Users can view own booking items"
  ON public.booking_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND (bookings.user_id = auth.uid() OR auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
      ))
    )
  );

DROP POLICY IF EXISTS "Users can create booking items" ON public.booking_items;
CREATE POLICY "Users can create booking items"
  ON public.booking_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_items.booking_id
      AND (bookings.user_id = auth.uid() OR bookings.user_id IS NULL)
    )
  );

-- ==========================================
-- SHOWCASE VOTING POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Showcase finalists are viewable by everyone" ON public.showcase_finalists;
CREATE POLICY "Showcase finalists are viewable by everyone"
  ON public.showcase_finalists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage showcase finalists" ON public.showcase_finalists;
CREATE POLICY "Admins can manage showcase finalists"
  ON public.showcase_finalists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can vote in showcase" ON public.showcase_votes;
CREATE POLICY "Anyone can vote in showcase"
  ON public.showcase_votes FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Showcase votes are viewable by admins" ON public.showcase_votes;
CREATE POLICY "Showcase votes are viewable by admins"
  ON public.showcase_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Showcase settings are viewable by everyone" ON public.showcase_settings;
CREATE POLICY "Showcase settings are viewable by everyone"
  ON public.showcase_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage showcase settings" ON public.showcase_settings;
CREATE POLICY "Admins can manage showcase settings"
  ON public.showcase_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- PILOT VOTING POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Pilot artists are viewable by everyone" ON public.pilot_artists;
CREATE POLICY "Pilot artists are viewable by everyone"
  ON public.pilot_artists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage pilot artists" ON public.pilot_artists;
CREATE POLICY "Admins can manage pilot artists"
  ON public.pilot_artists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Vote packages are viewable by everyone" ON public.vote_packages;
CREATE POLICY "Vote packages are viewable by everyone"
  ON public.vote_packages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage vote packages" ON public.vote_packages;
CREATE POLICY "Admins can manage vote packages"
  ON public.vote_packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can purchase votes" ON public.vote_purchases;
CREATE POLICY "Anyone can purchase votes"
  ON public.vote_purchases FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own vote purchases" ON public.vote_purchases;
CREATE POLICY "Users can view own vote purchases"
  ON public.vote_purchases FOR SELECT
  USING (
    auth.uid() = user_id
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Anyone can create vote transactions" ON public.vote_transactions;
CREATE POLICY "Anyone can create vote transactions"
  ON public.vote_transactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view vote transactions" ON public.vote_transactions;
CREATE POLICY "Admins can view vote transactions"
  ON public.vote_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Pilot voting settings are viewable by everyone" ON public.pilot_voting_settings;
CREATE POLICY "Pilot voting settings are viewable by everyone"
  ON public.pilot_voting_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage pilot voting settings" ON public.pilot_voting_settings;
CREATE POLICY "Admins can manage pilot voting settings"
  ON public.pilot_voting_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- NEWSLETTER POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own newsletter subscription" ON public.newsletter_subscribers;
CREATE POLICY "Users can update own newsletter subscription"
  ON public.newsletter_subscribers FOR UPDATE
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
