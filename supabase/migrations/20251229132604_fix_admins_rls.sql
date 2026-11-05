-- ==========================================
-- FIX INFINITE RECURSION IN ADMINS RLS POLICY
-- ==========================================
-- This SQL fixes the infinite recursion error by replacing
-- the problematic RLS policy with ones that don't cause recursion.
--
-- TO APPLY THIS FIX:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Paste this entire file
-- 6. Click "Run" or press Cmd/Ctrl + Enter
-- ==========================================

-- Step 1: Drop ALL existing policies on the admins table
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'admins' AND schemaname = 'public'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admins', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $$;

-- Step 2: Create new policies that don't cause recursion

-- Policy 1: Allow users to view their OWN admin record
-- This doesn't cause recursion because it directly compares auth.uid() with the id column
CREATE POLICY "Users can view their own admin record"
  ON public.admins
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Allow service role full access (for server-side operations)
CREATE POLICY "Service role can manage all admins"
  ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy 3: Allow users to update their own record
CREATE POLICY "Users can update their own admin record"
  ON public.admins
  FOR UPDATE
  USING (auth.uid() = id);

-- Step 3: Verify RLS is enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Step 4: Display the new policies
SELECT
  policyname,
  cmd,
  qual as "USING clause"
FROM pg_policies
WHERE tablename = 'admins' AND schemaname = 'public'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies fixed successfully!';
  RAISE NOTICE 'You should now be able to sign in and access admin pages without infinite recursion errors.';
END $$;
