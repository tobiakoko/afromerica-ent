-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Security Layer - Row Level Security (RLS)
-- ==========================================

-- ==========================================
-- ENABLE RLS ON ALL TABLES
-- ==========================================

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

-- ==========================================
-- ADMINS TABLE POLICIES
-- ==========================================

-- Admins can view all admin records (for user management)
CREATE POLICY "Admins can view all admin records"
  ON public.admins FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Admins can update their own profile only
CREATE POLICY "Admins can update their own profile"
  ON public.admins FOR UPDATE
  USING (auth.uid() = id);

COMMENT ON POLICY "Admins can view all admin records" ON public.admins IS
  'Allows admins to see other admin users in the dashboard';

COMMENT ON POLICY "Admins can update their own profile" ON public.admins IS
  'Admins can only edit their own profile (not other admins)';

-- ==========================================
-- ARTISTS TABLE POLICIES
-- ==========================================

-- Anyone can view active, non-deleted artists (public website)
CREATE POLICY "Anyone can view active artists"
  ON public.artists FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

-- Admins can do everything with artists (CRUD)
CREATE POLICY "Admins can manage artists"
  ON public.artists FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can view active artists" ON public.artists IS
  'Public access to artist profiles on website. Excludes deleted artists.';

COMMENT ON POLICY "Admins can manage artists" ON public.artists IS
  'Full CRUD access for admins to manage artist roster';

-- ==========================================
-- EVENTS TABLE POLICIES
-- ==========================================

-- Anyone can view published, non-deleted events (public website)
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);

-- Admins can do everything with events (CRUD)
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can view published events" ON public.events IS
  'Public access to event listings. Only shows published, non-deleted events.';

COMMENT ON POLICY "Admins can manage events" ON public.events IS
  'Full CRUD access for admins to manage events';

-- ==========================================
-- TICKET TYPES TABLE POLICIES
-- ==========================================

-- Anyone can view active ticket types (for checkout page)
CREATE POLICY "Anyone can view active ticket types"
  ON public.ticket_types FOR SELECT
  USING (is_active = true);

-- Admins can manage ticket types
CREATE POLICY "Admins can manage ticket types"
  ON public.ticket_types FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can view active ticket types" ON public.ticket_types IS
  'Public access to ticket pricing and availability';

COMMENT ON POLICY "Admins can manage ticket types" ON public.ticket_types IS
  'Admins can create/edit ticket types (VIP, Regular, etc.)';

-- ==========================================
-- TICKETS TABLE POLICIES
-- ==========================================

-- Admins can view all tickets (for dashboard/management)
CREATE POLICY "Admins can view all tickets"
  ON public.tickets FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Service role can manage tickets (for API operations)
CREATE POLICY "Service role can manage tickets"
  ON public.tickets FOR ALL
  USING (
    auth.role() = 'service_role'
  );

COMMENT ON POLICY "Admins can view all tickets" ON public.tickets IS
  'Admins can see all ticket purchases in dashboard';

COMMENT ON POLICY "Service role can manage tickets" ON public.tickets IS
  'API endpoints use service role to create/update tickets.
  This is secure because API layer validates user input.
  Public users do not get direct database access.';

-- ==========================================
-- VOTE PACKAGES TABLE POLICIES
-- ==========================================

-- Anyone can view active vote packages (for voting page)
CREATE POLICY "Anyone can view active vote packages"
  ON public.vote_packages FOR SELECT
  USING (is_active = true);

-- Admins can manage vote packages
CREATE POLICY "Admins can manage vote packages"
  ON public.vote_packages FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can view active vote packages" ON public.vote_packages IS
  'Public access to vote package pricing';

COMMENT ON POLICY "Admins can manage vote packages" ON public.vote_packages IS
  'Admins can create/edit vote packages and pricing';

-- ==========================================
-- VOTES TABLE POLICIES
-- ==========================================

-- Admins can view all votes (for analytics)
CREATE POLICY "Admins can view all votes"
  ON public.votes FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Service role can manage votes (for API operations)
CREATE POLICY "Service role can manage votes"
  ON public.votes FOR ALL
  USING (
    auth.role() = 'service_role'
  );

COMMENT ON POLICY "Admins can view all votes" ON public.votes IS
  'Admins can view voting analytics and transaction history';

COMMENT ON POLICY "Service role can manage votes" ON public.votes IS
  'API endpoints use service role to record votes after payment.
  OTP verification happens in API layer before allowing vote submission.';

-- ==========================================
-- VOTE VALIDATIONS TABLE POLICIES
-- ==========================================

-- Service role only (managed entirely by API)
CREATE POLICY "Service role can manage validations"
  ON public.vote_validations FOR ALL
  USING (
    auth.role() = 'service_role'
  );

COMMENT ON POLICY "Service role can manage validations" ON public.vote_validations IS
  'OTP codes are sensitive. Only API (service role) can access them.
  No direct user or admin access to validation codes.';

-- ==========================================
-- CONTACT MESSAGES TABLE POLICIES
-- ==========================================

-- Anyone can submit contact messages (public contact form)
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Admins can manage all contact messages
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can submit contact messages" ON public.contact_messages IS
  'Public contact form allows anyone to submit messages';

COMMENT ON POLICY "Admins can manage contact messages" ON public.contact_messages IS
  'Admins can view, update status, and respond to messages';

-- ==========================================
-- NEWSLETTER SUBSCRIBERS TABLE POLICIES
-- ==========================================

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Service role can manage unsubscribes (for unsubscribe API endpoint)
CREATE POLICY "Service role can manage subscribers"
  ON public.newsletter_subscribers FOR UPDATE
  USING (
    auth.role() = 'service_role'
  );

COMMENT ON POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers IS
  'Public newsletter signup form';

COMMENT ON POLICY "Admins can view subscribers" ON public.newsletter_subscribers IS
  'Admins can export subscriber list for email campaigns';

COMMENT ON POLICY "Service role can manage subscribers" ON public.newsletter_subscribers IS
  'Unsubscribe endpoint uses service role to update is_active status';

-- ==========================================
-- WEBHOOK LOGS TABLE POLICIES
-- ==========================================

-- Admins can view webhook logs (for debugging)
CREATE POLICY "Admins can view webhook logs"
  ON public.webhook_logs FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

-- Service role can manage webhook logs (for logging webhooks)
CREATE POLICY "Service role can manage webhook logs"
  ON public.webhook_logs FOR ALL
  USING (
    auth.role() = 'service_role'
  );

COMMENT ON POLICY "Admins can view webhook logs" ON public.webhook_logs IS
  'Admins can view webhook history for debugging payment issues';

COMMENT ON POLICY "Service role can manage webhook logs" ON public.webhook_logs IS
  'Webhook endpoint uses service role to log incoming webhooks';

-- ==========================================
-- SECURITY ARCHITECTURE DOCUMENTATION
-- ==========================================

COMMENT ON SCHEMA public IS 
  'Afromerica Entertainment Platform - Security Architecture

  🔒 THREE-TIER ACCESS CONTROL:
  
  1. PUBLIC (Unauthenticated Users)
     - Can view: Published events, active artists, ticket types, vote packages
     - Can insert: Contact messages, newsletter subscriptions
     - Cannot: See tickets, votes, admin data, webhook logs
     - Access via: Website browsing, contact form, newsletter signup
  
  2. ADMINS (Authenticated Dashboard Users)
     - Can view: Everything (all tickets, votes, messages, analytics)
     - Can manage: Artists, events, ticket types, vote packages, messages
     - Cannot: Directly access OTP codes (handled by API)
     - Access via: Admin dashboard at admin.domain.com
  
  3. SERVICE ROLE (API Endpoints)
     - Can do: Everything (full CRUD access)
     - Used by: API routes for ticket/vote creation, payments, OTPs
     - Security: API validates input, enforces business logic
     - Examples: /api/tickets, /api/votes, /api/paystack/webhook
  
  🛡️ WHY THIS DESIGN?
  
  Public users do not get direct database access for tickets/votes because:
  - Prevents price manipulation (users cannot set their own prices)
  - Enforces OTP verification (cannot bypass validation)
  - Maintains payment integrity (cannot fake payment status)
  - Enables proper error handling and logging
  
  API layer acts as gatekeeper:
  1. Validates user input
  2. Enforces business rules (e.g., ticket availability)
  3. Verifies OTP before allowing votes
  4. Confirms payments before recording
  5. Uses service role to execute database operations
  
  🔐 SECURITY BEST PRACTICES:
  
  1. Never expose service role key to clients
  2. Always validate input in API routes
  3. Use prepared statements (prevents SQL injection)
  4. Log all sensitive operations (webhook_logs)
  5. Rate limit API endpoints
  6. Hash OTP codes (never store plain text)
  7. Verify Paystack webhook signatures
  8. Use HTTPS only
  
  📊 ACCESS PATTERNS:
  
  Website Browse Events:
  - Public → SELECT events WHERE is_published = true
  
  User Buys Ticket:
  - Public → POST /api/tickets/checkout (with Paystack)
  - API validates → Service role → INSERT tickets
  - Paystack webhook → Service role → UPDATE tickets payment_status
  
  User Votes:
  - Public → POST /api/votes/validate (request OTP)
  - API → Service role → INSERT vote_validations
  - Public → POST /api/votes/verify (verify OTP)
  - API checks code → Service role → UPDATE is_verified
  - Public → POST /api/votes/submit (with Paystack)
  - API validates → Service role → INSERT votes
  - Paystack webhook → Service role → UPDATE votes payment_status
  
  Admin Views Dashboard:
  - Admin auth → SELECT tickets, votes, events (sees everything)
  - Admin creates event → INSERT events
  - Admin updates artist → UPDATE artists
  ';