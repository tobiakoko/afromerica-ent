# Supabase Configuration Guide

## Overview

This guide explains how to configure Supabase to update your frontend interface with database data, including real-time updates.

## What's Been Set Up

### ✅ Infrastructure

1. **Supabase Client Configuration**
   - `lib/supabase/client.ts` - Browser client for client components
   - `lib/supabase/server.ts` - Server client for server components/actions
   - `lib/supabase/middleware.ts` - Session management for middleware

2. **Type Safety**
   - `lib/supabase/types.ts` - Complete TypeScript definitions for database schema
   - Type-safe queries and mutations
   - Auto-completion in IDE

3. **Service Layer**
   - `lib/supabase/services.ts` - Server-side data fetching functions
   - All CRUD operations for Artists, Events, Bookings
   - Statistics and analytics functions

4. **React Hooks**
   - `lib/supabase/hooks.ts` - Client-side hooks with real-time subscriptions
   - `useArtists()`, `useEvents()`, `useUpcomingEvents()`, etc.
   - Automatic real-time updates when data changes

5. **Database Migration**
   - `supabase/migrations/001_initial_schema.sql` - Complete database schema
   - Tables: artists, events, event_artists, profiles, bookings
   - Indexes, triggers, RLS policies

6. **Seed Data**
   - `supabase/seed.sql` - Sample data for testing
   - 6 sample artists, 3 sample events with relationships

## Setting Up Supabase

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - Name: `afromerica-ent`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created

### Step 2: Get Your Project Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (for server-side operations - keep secret!)

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

### Step 3: Run Database Migrations

#### Option A: Using Supabase Dashboard

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. Verify tables were created under **Table Editor**

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 4: Seed Sample Data

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of `supabase/seed.sql`
3. Paste and click "Run"
4. Verify data under **Table Editor**

### Step 5: Configure Storage (For Images)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `public-images`
3. Set it to **Public**
4. Create folders: `artists/`, `events/`

## Using Supabase in Your Code

### Server Components (Recommended for SEO)

```typescript
// app/(public)/page.tsx
import { getUpcomingEvents } from "@/lib/supabase/services";

export default async function HomePage() {
  const events = await getUpcomingEvents(3);

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <img src={event.image_url} alt={event.title} />
        </div>
      ))}
    </div>
  );
}
```

### Client Components (With Real-Time Updates)

```typescript
// components/events-list.tsx
"use client";

import { useUpcomingEvents } from "@/lib/supabase/hooks";

export function EventsList() {
  const { events, loading, error } = useUpcomingEvents(6);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          {/* Real-time: updates automatically when data changes */}
        </div>
      ))}
    </div>
  );
}
```

## Available Services

### Artist Services

```typescript
import {
  getAllArtists,
  getFeaturedArtists,
  getArtistBySlug,
  getArtistsByGenre,
} from "@/lib/supabase/services";

// Get all active artists
const artists = await getAllArtists();

// Get featured artists
const featured = await getFeaturedArtists(6);

// Get artist by slug
const artist = await getArtistBySlug("kofi-mensah");

// Filter by genre
const afrobeatArtists = await getArtistsByGenre("Afrobeat");
```

### Event Services

```typescript
import {
  getAllEvents,
  getFeaturedEvents,
  getUpcomingEvents,
  getEventBySlug,
  getEventsByCategory,
} from "@/lib/supabase/services";

// Get all upcoming events
const events = await getAllEvents();

// Get featured events
const featured = await getFeaturedEvents(6);

// Get upcoming events
const upcoming = await getUpcomingEvents(3);

// Get event with artists
const event = await getEventBySlug("afrobeat-night-2025");
// Returns: { ...event, artists: [...] }

// Filter by category
const concerts = await getEventsByCategory("Concerts");
```

### Booking Services

```typescript
import {
  createBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
} from "@/lib/supabase/services";

// Create a booking
const booking = await createBooking({
  event_id: "event-uuid",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  ticket_type: "general",
  quantity: 2,
  total_amount: 70,
});

// Get user's bookings
const myBookings = await getUserBookings("user-uuid");

// Update booking status
await updateBookingStatus("booking-uuid", "confirmed");
```

## Available Hooks (Client-Side with Real-Time)

### useArtists()

```typescript
const { artists, loading, error } = useArtists();
```

Fetches all artists and subscribes to real-time updates.

### useEvents()

```typescript
const { events, loading, error } = useEvents();
```

Fetches all events and subscribes to real-time updates.

### useUpcomingEvents(limit)

```typescript
const { events, loading, error } = useUpcomingEvents(6);
```

Fetches upcoming events (no real-time subscription).

### useEvent(slug)

```typescript
const { event, loading, error } = useEvent("afrobeat-night-2025");
```

Fetches a single event by slug.

### useArtist(slug)

```typescript
const { artist, loading, error } = useArtist("kofi-mensah");
```

Fetches a single artist by slug.

### useUserBookings(userId)

```typescript
const { bookings, loading, error } = useUserBookings(userId);
```

Fetches user's bookings with real-time updates.

## Real-Time Features

Supabase provides real-time updates out of the box. The hooks in `lib/supabase/hooks.ts` automatically subscribe to database changes.

### How It Works

1. Hook fetches initial data
2. Sets up a real-time subscription
3. When data changes in database, hook automatically refetches
4. Component re-renders with new data

### Example

```typescript
"use client";

export function LiveEventCounter() {
  const { events } = useEvents();

  // This number updates in real-time when events are added/removed
  return <div>Total Events: {events.length}</div>;
}
```

## Image Storage

### Uploading Images

```typescript
import { createClient } from "@/lib/supabase/client";

async function uploadImage(file: File, folder: "artists" | "events") {
  const supabase = createClient();

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("public-images")
    .upload(`${folder}/${fileName}`, file);

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("public-images").getPublicUrl(data.path);

  return publicUrl;
}
```

### Using Image URLs

```typescript
<img
  src={artist.image_url || "/placeholder.png"}
  alt={artist.name}
  width={400}
  height={400}
/>
```

## Row Level Security (RLS)

The database has RLS enabled with the following policies:

### Public Access

- ✅ Everyone can **read** artists
- ✅ Everyone can **read** events
- ✅ Everyone can **read** event_artists
- ✅ Everyone can **read** profiles

### Protected Access

- 🔒 Only **admins** can create/update artists
- 🔒 Only **admins** can create/update events
- 🔒 Users can only view **their own** bookings
- 🔒 Users can only update **their own** profile

## Authentication (Optional)

### Enable Email Auth

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates

### Sign Up

```typescript
import { createClient } from "@/lib/supabase/client";

async function signUp(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: "John Doe",
      },
    },
  });

  return { data, error };
}
```

### Sign In

```typescript
async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
```

### Get Current User

```typescript
async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
```

## Refactoring Pages to Use Supabase

### Example: Artists Page

**Before (Mock Data):**

```typescript
export default function ArtistsPage() {
  const artists = [
    { id: "1", name: "Artist 1" },
    // ...mock data
  ];

  return <div>{/* render artists */}</div>;
}
```

**After (Supabase):**

```typescript
import { getAllArtists } from "@/lib/supabase/services";

export default async function ArtistsPage() {
  const artists = await getAllArtists();

  return <div>{/* render artists */}</div>;
}
```

### Example: Event Detail Page

**Before:**

```typescript
export default function EventPage({ params }) {
  const event = mockEvents.find((e) => e.id === params.id);
  return <div>{/* render event */}</div>;
}
```

**After:**

```typescript
import { getEventBySlug } from "@/lib/supabase/services";

export default async function EventPage({ params }) {
  const { slug } = await params;
  const eventData = await getEventBySlug(slug);

  if (!eventData) notFound();

  return (
    <div>
      <h1>{eventData.title}</h1>
      {/* event.artists is already populated */}
      {eventData.artists.map((ea: any) => (
        <div key={ea.artist_id}>
          {ea.artists.name} - {ea.role}
        </div>
      ))}
    </div>
  );
}
```

## Testing

### Test Data Access

```bash
# In Supabase SQL Editor
SELECT * FROM artists;
SELECT * FROM events;
SELECT * FROM event_artists;
```

### Test Real-Time

1. Open your app in two browser windows
2. In one window, use Supabase dashboard to add a new artist
3. Watch the other window update automatically (if using hooks)

## Production Checklist

- [ ] Update environment variables in production
- [ ] Enable RLS on all tables
- [ ] Configure storage bucket policies
- [ ] Set up database backups
- [ ] Monitor database performance
- [ ] Configure email templates for auth
- [ ] Set up monitoring and alerts

## Troubleshooting

### "Missing supabase URL or key"

- Make sure `.env.local` has correct values
- Restart dev server after changing env vars

### "Row Level Security policy violation"

- Check RLS policies in Supabase dashboard
- Ensure user is authenticated for protected operations

### Real-time not working

- Verify real-time is enabled in Supabase dashboard: **Database** > **Replication**
- Check browser console for subscription errors
- Ensure you're using client-side hooks in client components

## Next Steps

1. ✅ Complete database setup
2. ⏳ Refactor all pages to use Supabase services
3. ⏳ Add image upload functionality
4. ⏳ Implement authentication
5. ⏳ Add admin dashboard for content management
6. ⏳ Set up automated backups
7. ⏳ Configure production environment

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase with Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
