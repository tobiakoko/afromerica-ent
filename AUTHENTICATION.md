# Authentication Setup

This document describes the Supabase authentication implementation for the Afromerica Entertainment platform.

## Overview

The platform uses Supabase Auth with custom admin access control. The authentication system includes:

- Email/password authentication
- Email verification
- Password reset functionality
- Role-based access control (admin/editor)
- Protected admin routes via middleware

## Architecture

### Key Files

- **[utils/supabase/client.ts](utils/supabase/client.ts)** - Client-side Supabase client
- **[utils/supabase/server.ts](utils/supabase/server.ts)** - Server-side Supabase client
- **[utils/supabase/admin.ts](utils/supabase/admin.ts)** - Admin client with service role
- **[utils/supabase/middleware.ts](utils/supabase/middleware.ts)** - Session update and route protection
- **[lib/auth/actions.ts](lib/auth/actions.ts)** - Server actions for auth operations
- **[middleware.ts](middleware.ts)** - Next.js middleware for route protection
- **[app/(auth)/callback/page.tsx](app/(auth)/callback/page.tsx)** - OAuth and email verification callback handler

### Authentication Flow

1. **Sign Up**
   - User submits email, password, and full name
   - Auth user is created in Supabase Auth
   - Admin record is created in `admins` table
   - Account is set to `is_active: false` until email verification
   - Verification email is sent

2. **Email Verification**
   - User clicks verification link in email
   - Redirected to [/callback](app/(auth)/callback/page.tsx)
   - Code/token is exchanged for session (supports both PKCE and OTP verification)
   - Admin account is activated (`is_active: true`)
   - User is redirected to admin dashboard

3. **Sign In**
   - User submits email and password
   - Credentials are verified via Supabase Auth
   - System checks if user exists in `admins` table
   - System verifies `is_active` status
   - Last login timestamp is updated
   - User is redirected to admin dashboard

4. **Protected Routes**
   - Middleware intercepts all `/admin` routes
   - Session is validated via `getUser()`
   - Admin status is checked in database
   - Unauthorized users are redirected to `/signin`
   - Inactive accounts are rejected

## Database Schema

### Admins Table

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

## Environment Variables

Required environment variables in [.env.local](.env.local):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Test User

A test admin user has been created for development:

**Credentials:**
- **Email:** `admin@afromerica.com`
- **Password:** `Admin123!Test`
- **Role:** `admin`
- **Status:** Active

**Sign In URL:** [http://localhost:3000/signin](http://localhost:3000/signin)

## Creating Additional Admin Users

### Via Script

Run the script to create a new admin user:

```bash
npm run create-admin
```

Edit [scripts/create-admin.ts](scripts/create-admin.ts) to modify the credentials before running.

### Via Sign Up Page

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Fill in the registration form
3. Check email for verification link
4. Click verification link to activate account
5. Sign in at [http://localhost:3000/signin](http://localhost:3000/signin)

### Manually via Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Create a new user with email and password
3. Copy the user ID
4. Go to Table Editor → admins
5. Insert a new row:
   ```json
   {
     "id": "user_id_from_step_3",
     "email": "user@example.com",
     "full_name": "User Name",
     "role": "admin",
     "is_active": true
   }
   ```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Security Features

1. **Row Level Security (RLS)**
   - Policies enforce admin-only access to sensitive tables
   - Service role bypasses RLS for admin creation

2. **Email Verification**
   - New accounts are inactive until email is verified
   - Prevents unauthorized account creation

3. **Active Status Check**
   - Accounts can be deactivated without deletion
   - Inactive accounts cannot sign in

4. **Role-Based Access**
   - `admin` role: Full access to all features
   - `editor` role: Limited access (future implementation)

5. **Session Management**
   - Sessions are validated on every protected route
   - Middleware refreshes session cookies automatically

## API Routes

### Authentication Pages

- **[/signin](app/(auth)/signin/page.tsx)** - Sign in page
- **[/signup](app/(auth)/signup/page.tsx)** - Sign up page
- **[/forgot-password](app/(auth)/forgot-password/page.tsx)** - Password reset request
- **[/reset-password](app/(auth)/reset-password/page.tsx)** - Password update after reset
- **[/callback](app/(auth)/callback/page.tsx)** - OAuth/email verification callback

### Server Actions

All auth actions are in [lib/auth/actions.ts](lib/auth/actions.ts):

- `signUp(formData)` - Create new admin account
- `signIn(formData)` - Sign in existing user
- `signOut()` - Sign out current user
- `resetPassword(formData)` - Request password reset email
- `updatePassword(formData)` - Update password after reset
- `activateAdmin(userId)` - Activate account after verification

## Troubleshooting

### "You do not have admin access"

**Cause:** User exists in Auth but not in `admins` table

**Solution:** Add user to `admins` table via Supabase dashboard or script

### "Your account is inactive"

**Cause:** `is_active` is set to `false` in `admins` table

**Solution:** Either:
1. Click email verification link (for new accounts)
2. Manually update `is_active` to `true` in Supabase dashboard

### Session expires immediately

**Cause:** Middleware or session configuration issue

**Solution:** Check:
1. Middleware is properly configured in [middleware.ts](middleware.ts)
2. Cookies are being set correctly
3. `NEXT_PUBLIC_BASE_URL` is set in `.env.local`

### Email verification not working

**Cause:** Email service not configured or callback URL incorrect

**Solution:**
1. Check Supabase email settings in dashboard
2. Verify `NEXT_PUBLIC_BASE_URL` is correct
3. Check SMTP configuration in Supabase

## Testing Checklist

- [ ] Sign up creates auth user and admin record
- [ ] Email verification activates account
- [ ] Sign in redirects to `/admin` dashboard
- [ ] Unauthorized access to `/admin` redirects to `/signin`
- [ ] Inactive accounts cannot sign in
- [ ] Sign out clears session
- [ ] Password reset sends email
- [ ] Password update works after reset
- [ ] Dashboard loads statistics correctly
- [ ] Navigation shows admin menu items

## Next Steps

1. Implement password strength indicator on signup form
2. Add remember me functionality
3. Implement session timeout warnings
4. Add two-factor authentication (2FA)
5. Create audit log for admin actions
6. Implement role-based permissions for `editor` role
7. Add profile management page
