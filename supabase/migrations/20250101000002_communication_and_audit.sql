-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Communication & Monitoring Layer
-- ==========================================

-- ==========================================
-- CONTACT MESSAGES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sender Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Message Content
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status Tracking
  status message_status DEFAULT 'new' NOT NULL,
  
  -- Admin Response (optional)
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  
  -- Audit Trail (for security)
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT contact_messages_email_format_check CHECK (is_valid_email(email)),
  CONSTRAINT contact_messages_phone_format_check CHECK (phone IS NULL OR is_valid_phone(phone))
);

-- Indexes
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Composite index for admin dashboard (new/read messages)
CREATE INDEX idx_contact_messages_status_date ON public.contact_messages(status, created_at DESC)
  WHERE status IN ('new', 'read');

COMMENT ON TABLE public.contact_messages IS 'Contact form submissions from website';
COMMENT ON COLUMN public.contact_messages.status IS 'Message status: new → read → replied → archived';
COMMENT ON COLUMN public.contact_messages.ip_address IS 'Sender IP for security/spam prevention';

-- ==========================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Subscriber Information
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- Source Tracking (where did they subscribe?)
  source TEXT, -- e.g., 'homepage', 'event_page', 'checkout'
  
  -- Timestamps
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  unsubscribed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT newsletter_email_format_check CHECK (is_valid_email(email))
);

-- Indexes
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_is_active ON public.newsletter_subscribers(is_active) 
  WHERE is_active = true;
CREATE INDEX idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX idx_newsletter_source ON public.newsletter_subscribers(source) 
  WHERE source IS NOT NULL;

COMMENT ON TABLE public.newsletter_subscribers IS 'Email newsletter subscriptions';
COMMENT ON COLUMN public.newsletter_subscribers.source IS 'Where user subscribed (for analytics)';
COMMENT ON COLUMN public.newsletter_subscribers.is_active IS 'false if user unsubscribed';

-- ==========================================
-- WEBHOOK LOGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook Source
  source TEXT NOT NULL, -- e.g., 'paystack', 'termii'
  event_type TEXT NOT NULL, -- e.g., 'charge.success', 'transfer.failed'
  reference TEXT, -- Transaction/payment reference
  
  -- Request Data (for debugging)
  payload JSONB NOT NULL, -- Full webhook payload
  headers JSONB, -- Request headers
  
  -- Processing Status
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for debugging and monitoring
CREATE INDEX idx_webhook_logs_source ON public.webhook_logs(source);
CREATE INDEX idx_webhook_logs_event_type ON public.webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_reference ON public.webhook_logs(reference) 
  WHERE reference IS NOT NULL;
CREATE INDEX idx_webhook_logs_processed ON public.webhook_logs(processed);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

-- Composite index for unprocessed webhooks
CREATE INDEX idx_webhook_logs_unprocessed ON public.webhook_logs(created_at DESC)
  WHERE processed = false;

-- Composite index for failed webhooks
CREATE INDEX idx_webhook_logs_errors ON public.webhook_logs(created_at DESC)
  WHERE error_message IS NOT NULL;

COMMENT ON TABLE public.webhook_logs IS 'Webhook events for debugging and audit trail';
COMMENT ON COLUMN public.webhook_logs.source IS 'Webhook source system (paystack, termii, etc.)';
COMMENT ON COLUMN public.webhook_logs.processed IS 'Whether webhook was successfully processed';
COMMENT ON COLUMN public.webhook_logs.error_message IS 'Error details if processing failed';

-- ==========================================
-- WEBHOOK LOG RETENTION POLICY
-- ==========================================

-- Function to cleanup old webhook logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.webhook_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  RAISE NOTICE 'Cleaned up webhook logs older than 30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_webhook_logs IS 
  'Deletes webhook logs older than 30 days. 
  Schedule this to run daily: SELECT cleanup_old_webhook_logs();';

-- ==========================================
-- COMMUNICATION FLOW DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.contact_messages IS 
  'Contact form system. Flow:
  1. User submits contact form (status: new)
  2. Admin reads message (status: read)
  3. Admin replies via email (status: replied, adds response text)
  4. Can archive old messages (status: archived)
  Used for customer support and inquiries';

COMMENT ON TABLE public.newsletter_subscribers IS 
  'Newsletter subscription system. Flow:
  1. User subscribes (is_active: true)
  2. Sends confirmation email
  3. Can unsubscribe (is_active: false, sets unsubscribed_at)
  Source tracking helps understand which pages drive signups';

COMMENT ON TABLE public.webhook_logs IS 
  'Webhook audit trail. Every webhook received is logged here.
  Critical for debugging payment issues:
  - If payment not confirmed, check if webhook was received
  - If webhook received but not processed, check error_message
  - Payload contains full event data for investigation
  
  Automatically cleaned up after 30 days to save storage.
  For production issues, always check webhook logs first!';

-- ==========================================
-- EXAMPLE QUERIES FOR MONITORING
-- ==========================================

-- Check unprocessed webhooks (run every 5 minutes)
COMMENT ON COLUMN public.webhook_logs.processed IS 
  'Monitor with: 
  SELECT * FROM public.webhook_logs 
  WHERE processed = false 
  AND created_at > NOW() - INTERVAL ''1 hour''
  ORDER BY created_at DESC;';

-- Check failed webhooks (run daily)
COMMENT ON COLUMN public.webhook_logs.error_message IS 
  'Monitor with:
  SELECT event_type, reference, error_message, created_at 
  FROM public.webhook_logs 
  WHERE error_message IS NOT NULL 
  AND created_at > NOW() - INTERVAL ''24 hours''
  ORDER BY created_at DESC;';

-- Check new contact messages (admin dashboard)
COMMENT ON COLUMN public.contact_messages.status IS 
  'Admin query:
  SELECT name, email, subject, created_at 
  FROM public.contact_messages 
  WHERE status = ''new'' 
  ORDER BY created_at DESC;';