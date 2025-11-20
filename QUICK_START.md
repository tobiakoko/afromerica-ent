# Quick Start Guide

## Test the Admin Dashboard

You can now test the admin dashboard with the test credentials that have been created.

### 1. Access the Sign In Page

Open your browser and navigate to:
```
http://localhost:3000/signin
```

### 2. Sign In with Test Credentials

**Email:** `admin@afromerica.com`
**Password:** `Admin123!Test`

### 3. Explore the Dashboard

After signing in, you'll be redirected to the admin dashboard at `/admin` where you can:

- View platform statistics (events, artists, bookings, revenue)
- Manage events at `/admin/events`
- Manage artists at `/admin/artists`
- View tickets at `/admin/tickets`
- Manage users at `/admin/users`
- View votes at `/admin/votes`

## What's Been Implemented

### Authentication System

✅ **Complete authentication flow:**
- Sign in/Sign up pages with form validation
- Email verification via callback route
- Password reset functionality
- Protected admin routes via middleware
- Role-based access control

✅ **Security features:**
- Supabase Auth integration
- Row Level Security (RLS) policies
- Active status checking
- Session management with automatic refresh
- Service role for admin operations

✅ **Database:**
- `admins` table with role management
- User profiles linked to auth
- Proper constraints and indexes

### Test User

A test admin user has been created and activated:
- **Email:** `admin@afromerica.com`
- **Password:** `Admin123!Test`
- **Role:** admin
- **Status:** Active ✅

### Developer Tools

✅ **Script to create admin users:**
```bash
npm run create-admin
```

Edit `scripts/create-admin.ts` to customize credentials before running.

## File Structure

```
app/
├── (admin)/
│   └── admin/          # Admin dashboard pages
│       ├── page.tsx    # Dashboard home with stats
│       ├── events/     # Event management
│       ├── artists/    # Artist management
│       └── ...
├── (auth)/
│   ├── signin/         # Sign in page
│   ├── signup/         # Sign up page
│   ├── callback/       # Auth callback handler
│   └── ...
├── (public)/           # Public-facing pages
│   └── events/         # Public event pages

components/
├── auth/               # Auth forms and components
├── admin/              # Admin-specific components
└── ui/                 # Shared UI components

lib/
├── auth/
│   └── actions.ts      # Server actions for auth
└── ...

utils/
└── supabase/
    ├── client.ts       # Browser client
    ├── server.ts       # Server client
    ├── admin.ts        # Admin client
    └── middleware.ts   # Session management

middleware.ts           # Route protection
```

## Environment Setup

Your environment is configured with:

```bash
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jwdlkisltfforznjdvqd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Common Tasks

### Create Another Admin User

**Option 1: Via Script**
```bash
# Edit scripts/create-admin.ts first
npm run create-admin
```

**Option 2: Via Sign Up Page**
1. Navigate to http://localhost:3000/signup
2. Fill in the form
3. Check email for verification link
4. Click link to activate account

### Sign Out

Click the user menu in the top right corner and select "Sign Out"

### Access Admin Dashboard Directly

If you're already signed in:
```
http://localhost:3000/admin
```

### View Public Pages

The public-facing site is at:
```
http://localhost:3000
http://localhost:3000/events
```

## What to Test

### Authentication Flow

1. **Sign In**
   - [ ] Valid credentials → redirect to dashboard
   - [ ] Invalid credentials → error message
   - [ ] Inactive account → error message

2. **Protected Routes**
   - [ ] Access `/admin` without auth → redirect to signin
   - [ ] Access `/admin` with auth → dashboard loads
   - [ ] Sign out → redirect to home

3. **Sign Up** (if testing email)
   - [ ] Create new account
   - [ ] Receive verification email
   - [ ] Click verification link
   - [ ] Account activated
   - [ ] Sign in successful

### Dashboard Features

1. **Statistics**
   - [ ] Total events count displays
   - [ ] Total artists count displays
   - [ ] Total bookings displays
   - [ ] Total revenue displays

2. **Navigation**
   - [ ] All admin menu items load
   - [ ] Events management page works
   - [ ] Artists management page works
   - [ ] Other admin pages accessible

3. **Session Management**
   - [ ] Session persists on page refresh
   - [ ] Middleware protects routes
   - [ ] Sign out clears session

## Troubleshooting

**Can't access dashboard after signing in?**
- Check browser console for errors
- Verify you're using the correct credentials
- Ensure dev server is running on port 3000

**"You do not have admin access" error?**
- The user exists in auth but not in the `admins` table
- Run `npm run create-admin` to create proper admin user

**Session expires immediately?**
- Check that `NEXT_PUBLIC_BASE_URL` is set correctly
- Restart the dev server after changing `.env.local`

**Dev server won't start?**
- Check if port 3000 is already in use
- Kill the process: `lsof -i :3000` then `kill -9 <PID>`
- Restart: `npm run dev`

## Next Steps

Now that authentication is working, you can:

1. Test the full dashboard functionality
2. Create events and artists via the admin panel
3. Test the public event pages
4. Test the voting and ticketing flow
5. Customize the dashboard UI

## Documentation

For detailed information, see:
- [AUTHENTICATION.md](AUTHENTICATION.md) - Complete auth documentation
- [IMAGE_HANDLING.md](IMAGE_HANDLING.md) - Image optimization guide

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Review the auth documentation
4. Verify environment variables are set correctly
