-- ==========================================
-- FIX INFINITE RECURSION IN ADMINS RLS POLICY
-- ==========================================
-- The current policy causes infinite recursion because it queries
-- the same table it's protecting. We'll replace it with a simpler
-- policy that allows users to view their own admin record.

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;

-- Create new policies that don't cause recursion
-- Policy 1: Allow users to view their own admin record
CREATE POLICY "Users can view their own admin record"
  ON public.admins FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Allow service role (bypasses RLS anyway, but explicit is good)
CREATE POLICY "Service role can manage all admins"
  ON public.admins FOR ALL
  USING (auth.role() = 'service_role');

-- Keep the existing update policy (it's fine)
-- This allows admins to update their own profile
-- No changes needed for: "Admins can update their own profile"

-- Add a comment for documentation
COMMENT ON TABLE public.admins IS 'Admin users table with RLS policies that prevent infinite recursion';
