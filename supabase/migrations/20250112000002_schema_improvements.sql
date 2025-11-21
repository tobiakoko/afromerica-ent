-- ==========================================
-- SCHEMA IMPROVEMENTS
-- Add missing fields and tables
-- ==========================================

-- Add role field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==========================================
-- CONTACT MESSAGES
-- Store contact form submissions
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  user_id UUID REFERENCES public.profiles(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- USER VOTE HISTORY
-- Track all votes for user dashboard
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_vote_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  artist_id UUID,
  artist_name TEXT NOT NULL,
  votes_cast INTEGER DEFAULT 1,
  amount DECIMAL(10,2) DEFAULT 0,
  purchase_id UUID REFERENCES public.vote_purchases(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_votes CHECK (votes_cast > 0),
  CONSTRAINT valid_amount CHECK (amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_user_vote_history_user ON public.user_vote_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vote_history_email ON public.user_vote_history(email);
CREATE INDEX IF NOT EXISTS idx_user_vote_history_type ON public.user_vote_history(vote_type);
CREATE INDEX IF NOT EXISTS idx_user_vote_history_created ON public.user_vote_history(created_at DESC);

-- ==========================================
-- RLS POLICIES
-- Row Level Security for user data
-- ==========================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admins can view all contact messages
CREATE POLICY "Admins can view all contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update contact message status
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone can insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Enable RLS on user_vote_history
ALTER TABLE public.user_vote_history ENABLE ROW LEVEL SECURITY;

-- Admins can view all vote history
CREATE POLICY "Admins can view all vote history" ON public.user_vote_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert vote history
CREATE POLICY "System can insert vote history" ON public.user_vote_history
  FOR INSERT WITH CHECK (true);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone can create bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Enable RLS on vote_purchases
ALTER TABLE public.vote_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON public.vote_purchases
  FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases" ON public.vote_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone can create purchases
CREATE POLICY "Anyone can create purchases" ON public.vote_purchases
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- FUNCTIONS FOR VOTE HISTORY TRACKING
-- ==========================================

-- Function to record showcase vote in history
CREATE OR REPLACE FUNCTION record_showcase_vote_history()
RETURNS TRIGGER AS $$
BEGIN
-- Only record if payment is completed
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
  -- Insert into user vote history
  INSERT INTO public.user_vote_history (
    user_id,
    email,
    artist_id,
    artist_name,
    votes_cast,
    amount,
    purchase_id
  )
  SELECT
    NEW.user_id,
    NEW.email, -- showcase votes are anonymous keep track of the validation email
    'anonymous@showcase.vote', -- placeholder for anonymous votes
    'showcase',
    NEW.finalist_id,
    (SELECT stage_name FROM public.showcase_finalists WHERE id = NEW.finalist_id),
    1,
    0
  WHERE NEW.finalist_id IS NOT NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to record showcase votes
DROP TRIGGER IF EXISTS record_showcase_vote ON public.showcase_votes;
CREATE TRIGGER record_showcase_vote
  AFTER INSERT ON public.showcase_votes
  FOR EACH ROW
  EXECUTE FUNCTION record_showcase_vote_history();