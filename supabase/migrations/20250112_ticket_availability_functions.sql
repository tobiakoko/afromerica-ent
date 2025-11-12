-- Supabase RPC functions for ticket availability management
-- These functions ensure atomic updates to ticket availability

-- Function to decrement ticket availability
CREATE OR REPLACE FUNCTION decrement_ticket_availability(
  ticket_type_id UUID,
  quantity_to_decrement INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update with a check to ensure we don't go negative
  UPDATE ticket_types
  SET
    available = available - quantity_to_decrement,
    updated_at = NOW()
  WHERE id = ticket_type_id
    AND available >= quantity_to_decrement;

  -- Check if the update affected any rows
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient tickets available or ticket type not found';
  END IF;
END;
$$;

-- Function to increment ticket availability (for cancellations/refunds)
CREATE OR REPLACE FUNCTION increment_ticket_availability(
  ticket_type_id UUID,
  quantity_to_increment INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ticket_types
  SET
    available = available + quantity_to_increment,
    updated_at = NOW()
  WHERE id = ticket_type_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ticket type not found';
  END IF;
END;
$$;

-- Function to generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate reference: BK-YYYYMMDD-RANDOM
    ref := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_reference = ref) INTO exists;

    -- If unique, return it
    IF NOT exists THEN
      RETURN ref;
    END IF;
  END LOOP;
END;
$$;

-- Function to apply votes to pilot artists
CREATE OR REPLACE FUNCTION apply_votes_to_artist(
  artist_id UUID,
  vote_count INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment total votes
  UPDATE pilot_artists
  SET
    total_votes = total_votes + vote_count,
    updated_at = NOW()
  WHERE id = artist_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;

  -- Recalculate ranks for all artists
  WITH ranked_artists AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY total_votes DESC, created_at ASC) as new_rank
    FROM pilot_artists
  )
  UPDATE pilot_artists pa
  SET rank = ra.new_rank
  FROM ranked_artists ra
  WHERE pa.id = ra.id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION decrement_ticket_availability TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_ticket_availability TO authenticated, anon;
GRANT EXECUTE ON FUNCTION generate_booking_reference TO authenticated, anon;
GRANT EXECUTE ON FUNCTION apply_votes_to_artist TO authenticated, anon;
