# Signin Fix - December 29, 2025

## Problem

Users were getting the error **"You do not have admin access to this application"** when trying to sign in with valid admin credentials.

## Root Cause

The issue was caused by a circular dependency in the Row Level Security (RLS) policies:

1. The `signIn` function was using a regular Supabase client to check if the user exists in the `admins` table
2. The RLS policy on the `admins` table only allows users who are already in the `admins` table to query it:
   ```sql
   CREATE POLICY "Admins can view all admin records"
     ON public.admins FOR SELECT
     USING (
       auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
     );
   ```
3. This created a catch-22: You can't check if you're an admin without already being an admin

## Solution

Modified the `signIn` function in [lib/auth/actions.ts](lib/auth/actions.ts#L157-L179) to use the **admin client** (which bypasses RLS) when checking if a user is an admin:

```typescript
// Before (using regular client - blocked by RLS)
const { data: admin, error: adminError } = await supabase
  .from('admins')
  .select('id, is_active, full_name, role')
  .eq('id', authData.user.id)
  .single()

// After (using admin client - bypasses RLS)
const adminClient = createAdminClient()
const { data: admin, error: adminError } = await adminClient
  .from('admins')
  .select('id, is_active, full_name, role')
  .eq('id', authData.user.id)
  .single()
```

## Testing

A test script was created to verify the fix works correctly:

```bash
npx tsx scripts/test-signin.ts
```

The test confirms:
1. ✅ Authentication with Supabase Auth works
2. ✅ Admin record can be queried using admin client
3. ✅ Last login timestamp updates successfully

## Verification

You can now sign in with the admin credentials:
- **Email**: admin@afromericaent.com
- **Password**: Get_Gingered@123#
- **URL**: [/signin](/signin)

After successful signin, you'll be redirected to [/admin](/admin) and can access all admin features including the finale panel at [/admin/finale](/admin/finale).

## Additional Notes

- The admin client uses the `SUPABASE_SERVICE_ROLE_KEY` which has full database access and bypasses all RLS policies
- This is the correct approach for server-side admin checks during authentication
- All other admin operations should continue to use the regular client where RLS policies provide additional security
