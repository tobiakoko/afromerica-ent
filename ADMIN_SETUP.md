# Admin User Setup

This document contains information about the super admin account for the Afromerica Entertainment platform.

## Super Admin Credentials

A super admin account has been created with the following credentials:

- **Email**: `admin@afromericaent.com`
- **Password**: `Get_Gingered@123#`
- **Role**: Admin (full access)
- **Status**: Active

## Sign In

To access the admin panel:

1. Navigate to [/signin](/signin)
2. Enter the credentials above
3. You will be redirected to the admin dashboard at [/admin](/admin)

## Admin Panel Features

Once signed in, you can access:

- **Events Management**: Create and manage events
- **Artists Management**: Add and manage artists
- **Tickets Management**: View ticket sales and bookings
- **Votes Management**: Track voting activities
- **Finale Management**: Configure and manage finale voting stages at [/admin/finale](/admin/finale)

## Creating Additional Admin Users

To create additional admin users, you can use the existing script:

```bash
# Edit the credentials in scripts/create-admin.ts
# Then run:
npm run create-admin
```

Alternatively, you can:

1. Sign in as the super admin
2. Navigate to the admin panel
3. Use the admin management interface (if available)

## Security Notes

⚠️ **Important**:
- Change the default password after first login (when password change functionality is available)
- Keep these credentials secure
- Do not commit this file to version control if it contains sensitive information
- Consider implementing 2FA for additional security

## Troubleshooting

If you cannot sign in:

1. Verify the admin user exists in the database:
   - Check the `auth.users` table for the email
   - Check the `public.admins` table for the corresponding record
2. Ensure `is_active` is set to `true` in the `public.admins` table
3. Check that email is confirmed in `auth.users` table
4. Review the browser console and server logs for error messages

## Database Schema

The admin user consists of two records:

1. **Auth User** (`auth.users`):
   - Created by Supabase Auth
   - Contains authentication credentials
   - Email is auto-confirmed

2. **Admin Record** (`public.admins`):
   - Links to the auth user via `id`
   - Contains admin-specific metadata (role, active status, etc.)
   - Protected by Row Level Security (RLS) policies
