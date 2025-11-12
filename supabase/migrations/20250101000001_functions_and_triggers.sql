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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at trigger to all relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artists_updated_at ON public.artists;
CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_venues_updated_at ON public.venues;
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_showcase_finalists_updated_at ON public.showcase_finalists;
CREATE TRIGGER update_showcase_finalists_updated_at
  BEFORE UPDATE ON public.showcase_finalists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pilot_artists_updated_at ON public.pilot_artists;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_showcase_votes_after_insert ON public.showcase_votes;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_pilot_votes_after_transaction ON public.vote_transactions;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_tickets_after_payment ON public.bookings;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
