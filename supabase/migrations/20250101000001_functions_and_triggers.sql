-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Business Logic Layer
-- ==========================================

-- ==========================================
-- UTILITY FUNCTIONS
-- ==========================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_updated_at_column IS 
  'Automatically updates updated_at timestamp on row modification';

-- ==========================================
-- TICKET MANAGEMENT FUNCTIONS
-- ==========================================

-- BEFORE trigger: Update ticket status when payment completes
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when payment status changes to completed
  IF NEW.payment_status = 'completed' 
     AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    
    -- Update booking status and verified timestamp
    NEW.booking_status = 'confirmed';
    NEW.verified_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_ticket_availability IS 
  'BEFORE trigger: Updates ticket status when payment completes';

-- AFTER trigger: Update inventory after successful payment
CREATE OR REPLACE FUNCTION update_inventory_after_ticket_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_ticket_type_available INTEGER;
BEGIN
  -- Only process when payment status changes to completed
  IF NEW.payment_status = 'completed' 
     AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    
    -- Lock and check ticket type availability (prevents race conditions)
    SELECT available INTO v_ticket_type_available
    FROM public.ticket_types
    WHERE id = NEW.ticket_type_id
    FOR UPDATE; -- Lock row for this transaction
    
    -- Validate sufficient tickets available
    IF v_ticket_type_available < NEW.quantity THEN
      RAISE EXCEPTION 'Insufficient tickets available. Requested: %, Available: %', 
        NEW.quantity, v_ticket_type_available;
    END IF;
    
    -- Decrement ticket type availability
    UPDATE public.ticket_types
    SET available = available - NEW.quantity
    WHERE id = NEW.ticket_type_id;
    
    -- Increment event tickets_sold counter
    UPDATE public.events
    SET tickets_sold = tickets_sold + NEW.quantity
    WHERE id = NEW.event_id;
    
    RAISE NOTICE 'Inventory updated: % tickets sold for event %', NEW.quantity, NEW.event_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_inventory_after_ticket_payment IS 
  'AFTER trigger: Decrements ticket availability after successful payment.
  Uses SELECT FOR UPDATE to prevent overselling in concurrent transactions.';

-- Validate ticket amount matches ticket type price
CREATE OR REPLACE FUNCTION validate_ticket_amount()
RETURNS TRIGGER AS $$
DECLARE
  expected_price DECIMAL(10,2);
BEGIN
  -- Only validate if ticket type is specified
  IF NEW.ticket_type_id IS NOT NULL THEN
    -- Get expected price from ticket type
    SELECT price INTO expected_price
    FROM public.ticket_types
    WHERE id = NEW.ticket_type_id;
    
    -- Validate price matches
    IF NEW.price_per_ticket != expected_price THEN
      RAISE EXCEPTION 'Ticket price mismatch. Expected: ₦%, Received: ₦%', 
        expected_price, NEW.price_per_ticket;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_ticket_amount IS 
  'BEFORE trigger: Prevents price manipulation by validating ticket amounts';

-- ==========================================
-- VOTING MANAGEMENT FUNCTIONS
-- ==========================================

-- BEFORE trigger: Update vote verified timestamp
CREATE OR REPLACE FUNCTION update_vote_verified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Set verified timestamp when payment completes
  IF NEW.payment_status = 'completed' 
     AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    NEW.verified_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_vote_verified_timestamp IS 
  'BEFORE trigger: Sets verified_at when vote payment completes';

-- AFTER trigger: Update artist vote totals and rankings
CREATE OR REPLACE FUNCTION update_artist_totals_after_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when payment status changes to completed
  IF NEW.payment_status = 'completed' 
     AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    
    -- Increment artist vote totals
    UPDATE public.artists
    SET
      total_votes = total_votes + NEW.vote_count,
      total_vote_amount = total_vote_amount + NEW.amount_paid,
      updated_at = NOW()
    WHERE id = NEW.artist_id;
    
    -- Recalculate all artist rankings
    PERFORM recalculate_artist_rankings();
    
    RAISE NOTICE 'Artist % received % votes (₦%)', NEW.artist_id, NEW.vote_count, NEW.amount_paid;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_artist_totals_after_vote IS 
  'AFTER trigger: Updates artist vote totals and recalculates leaderboard rankings';

-- Recalculate artist rankings (called by vote trigger)
CREATE OR REPLACE FUNCTION recalculate_artist_rankings()
RETURNS VOID AS $$
BEGIN
  -- Calculate rankings based on total votes (tie-breaker: total amount)
  WITH ranked_artists AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY total_votes DESC, total_vote_amount DESC
      ) as new_rank
    FROM public.artists
    WHERE is_active = true AND deleted_at IS NULL
  )
  UPDATE public.artists
  SET rank = ranked_artists.new_rank
  FROM ranked_artists
  WHERE public.artists.id = ranked_artists.id;
  
  RAISE NOTICE 'Artist rankings recalculated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION recalculate_artist_rankings IS 
  'Recalculates artist rankings based on total votes.
  Tie-breaker: If votes are equal, higher amount paid ranks higher.
  Only includes active, non-deleted artists.';

-- ==========================================
-- SOFT DELETE FUNCTIONS
-- ==========================================

-- Track artist soft deletes
CREATE OR REPLACE FUNCTION soft_delete_artist()
RETURNS TRIGGER AS $$
BEGIN
  -- When artist is deactivated, track who did it and when
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deleted_at = NOW();
    NEW.deleted_by = auth.uid(); -- Current admin user
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION soft_delete_artist IS 
  'Tracks artist deactivation for audit trail (soft delete)';

-- Track event soft deletes
CREATE OR REPLACE FUNCTION soft_delete_event()
RETURNS TRIGGER AS $$
BEGIN
  -- When event is deactivated, track who did it and when
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deleted_at = NOW();
    NEW.deleted_by = auth.uid(); -- Current admin user
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION soft_delete_event IS 
  'Tracks event deactivation for audit trail (soft delete)';

-- ==========================================
-- CLEANUP FUNCTIONS
-- ==========================================

-- Cleanup expired OTP validation codes
CREATE OR REPLACE FUNCTION cleanup_expired_validations()
RETURNS VOID AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete codes expired more than 1 hour ago (keep recent for debugging)
  DELETE FROM public.vote_validations
  WHERE expires_at < NOW() - INTERVAL '1 hour';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Cleaned up % expired validation codes', deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_validations IS 
  'Deletes expired OTP codes older than 1 hour.
  Schedule to run hourly: SELECT cleanup_expired_validations();';

-- ==========================================
-- TRIGGERS - UPDATED_AT
-- ==========================================

-- Auto-update updated_at on all tables
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

-- ==========================================
-- TRIGGERS - TICKET PAYMENT WORKFLOW
-- ==========================================

-- Step 1: BEFORE - Update ticket status
CREATE TRIGGER update_tickets_before_payment
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_availability();

-- Step 2: AFTER - Update inventory
CREATE TRIGGER update_inventory_after_ticket_payment
  AFTER UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_after_ticket_payment();

-- Step 3: BEFORE INSERT/UPDATE - Validate amounts
CREATE TRIGGER validate_ticket_amount_trigger
  BEFORE INSERT OR UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION validate_ticket_amount();

-- ==========================================
-- TRIGGERS - VOTE PAYMENT WORKFLOW
-- ==========================================

-- Step 1: BEFORE - Update verified timestamp
CREATE TRIGGER update_votes_before_payment
  BEFORE UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_verified_timestamp();

-- Step 2: AFTER - Update artist totals and rankings
CREATE TRIGGER update_artist_totals_after_vote
  AFTER UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_totals_after_vote();

-- ==========================================
-- TRIGGERS - SOFT DELETE TRACKING
-- ==========================================

CREATE TRIGGER artist_soft_delete
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_artist();

CREATE TRIGGER event_soft_delete
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_event();

-- ==========================================
-- BUSINESS LOGIC DOCUMENTATION
-- ==========================================

COMMENT ON TRIGGER update_tickets_before_payment ON public.tickets IS 
  'Payment workflow Step 1: Updates ticket status and verified timestamp';

COMMENT ON TRIGGER update_inventory_after_ticket_payment ON public.tickets IS 
  'Payment workflow Step 2: Decrements ticket availability and updates event totals.
  Uses row locking to prevent overselling in concurrent transactions.';

COMMENT ON TRIGGER validate_ticket_amount_trigger ON public.tickets IS 
  'Payment workflow Step 3: Validates ticket price matches ticket type.
  Prevents price manipulation attacks.';

COMMENT ON TRIGGER update_votes_before_payment ON public.votes IS 
  'Vote workflow Step 1: Sets verified timestamp when payment completes';

COMMENT ON TRIGGER update_artist_totals_after_vote ON public.votes IS 
  'Vote workflow Step 2: Updates artist vote totals and recalculates leaderboard.
  Ensures leaderboard always shows current rankings.';

COMMENT ON TRIGGER artist_soft_delete ON public.artists IS 
  'Tracks who deactivated artist and when (audit trail)';

COMMENT ON TRIGGER event_soft_delete ON public.events IS 
  'Tracks who deactivated event and when (audit trail)';

-- ==========================================
-- WORKFLOW EXAMPLES
-- ==========================================

COMMENT ON FUNCTION update_inventory_after_ticket_payment IS 
  'Example workflow when user purchases 2 tickets:
  
  1. Webhook receives payment confirmation
  2. UPDATE tickets SET payment_status = ''completed'' WHERE id = ...
  3. BEFORE trigger: Sets booking_status = ''confirmed'', verified_at = NOW()
  4. AFTER trigger: 
     - Locks ticket_type row (prevents race condition)
     - Checks: available >= 2 tickets
     - Updates: ticket_types.available = available - 2
     - Updates: events.tickets_sold = tickets_sold + 2
  5. Email sent to user with confirmed booking
  
  If two users try to buy last ticket simultaneously:
  - First transaction locks row, completes purchase
  - Second transaction waits for lock
  - Second transaction sees insufficient tickets, raises error
  - No overselling possible!';

COMMENT ON FUNCTION update_artist_totals_after_vote IS 
  'Example workflow when user purchases 50 votes for Artist A:
  
  1. Webhook receives payment confirmation
  2. UPDATE votes SET payment_status = ''completed'' WHERE id = ...
  3. BEFORE trigger: Sets verified_at = NOW()
  4. AFTER trigger:
     - Updates artists: total_votes += 50, total_vote_amount += ₦1800
     - Recalculates rankings for ALL artists
     - Artist A might move from rank 3 → rank 1
  5. Email sent to user confirming votes
  6. Leaderboard immediately reflects new ranking';