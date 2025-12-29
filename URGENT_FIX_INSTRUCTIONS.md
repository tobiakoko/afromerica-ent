# 🚨 URGENT: Fix Infinite Recursion Error

## The Problem

You're seeing this error when trying to access admin pages:
```
infinite recursion detected in policy for relation "admins"
```

This happens because the Row Level Security (RLS) policy on the `admins` table is checking if a user exists in the `admins` table, which queries the same table, causing infinite recursion.

## The Solution

You need to run a SQL script in your Supabase Dashboard to replace the problematic RLS policies.

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project (jwdlkisltfforznjdvqd)

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Fix Script**
   - Open the file: `FIX_ADMINS_RLS.sql` (in your project root)
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see output showing the dropped and created policies
   - The last message should say: "✅ RLS policies fixed successfully!"

5. **Test Signin**
   - Go to your app at `/signin`
   - Sign in with:
     - Email: `admin@afromericaent.com`
     - Password: `Get_Gingered@123#`
   - You should now be able to access `/admin` and `/admin/finale` without errors

## What This Fix Does

The script:
1. Drops all existing policies on the `admins` table
2. Creates three new policies that don't cause recursion:
   - **"Users can view their own admin record"**: Allows signed-in users to check if they're an admin (no recursion because it uses simple `auth.uid() = id` comparison)
   - **"Service role can manage all admins"**: Allows server-side operations to manage admins
   - **"Users can update their own admin record"**: Allows admins to update their profile

## Alternative: Manual SQL

If the automated script doesn't work, you can manually run these commands in the SQL Editor:

```sql
-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admins;
DROP POLICY IF EXISTS "Users can view their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Service role can manage all admins" ON public.admins;
DROP POLICY IF EXISTS "Users can update their own admin record" ON public.admins;

-- 2. Create new policies
CREATE POLICY "Users can view their own admin record"
  ON public.admins FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service role can manage all admins"
  ON public.admins FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can update their own admin record"
  ON public.admins FOR UPDATE
  USING (auth.uid() = id);
```

## Need Help?

If you encounter any issues:
1. Check that you're connected to the correct project
2. Verify you have admin access to the Supabase project
3. Check the SQL Editor output for any error messages
4. Make sure the `admins` table exists in your database

---

**After running this fix, the infinite recursion error will be resolved and you'll be able to sign in and access all admin pages.**
