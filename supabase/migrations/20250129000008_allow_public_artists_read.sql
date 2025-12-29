-- ==========================================
-- ALLOW PUBLIC READ ACCESS TO ARTISTS TABLE
-- ==========================================
-- This is needed for the finale voting interfaces to fetch
-- contestant data with artist information joined.
-- Without this, the anon client cannot read artists table
-- when joining from finale_contestants.
-- ==========================================

-- Enable RLS on artists table if not already enabled
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view artists
-- (Artists are public data displayed on the website)
CREATE POLICY "Anyone can view artists"
  ON public.artists FOR SELECT
  USING (true);

-- Service role can manage artists (for admin operations)
CREATE POLICY "Service role can manage artists"
  ON public.artists FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.artists IS
'Artists table - Public read access enabled for contestant lookups';
