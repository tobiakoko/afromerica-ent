# Features Directory Guide

## Overview

The `features/` directory contains modular, feature-based code organization integrated with Supabase for database operations and real-time updates. Each feature is self-contained with its own types, hooks, components, and utilities.

## Directory Structure

```
features/
├── artists/          # Artist management
├── events/           # Event management
├── bookings/         # Booking system
├── auth/             # Authentication
└── payments/         # Payment processing
```

## What's Been Updated

All features have been updated to:
- ✅ Use Supabase for data operations
- ✅ Include TypeScript type definitions
- ✅ Provide React hooks with real-time updates
- ✅ Support filtering and search
- ✅ Handle loading and error states

---

## Artists Feature

### Structure
```
features/artists/
├── types/
│   └── artist.types.ts       # TypeScript types
├── hooks/
│   └── use-artists.ts        # React hooks with filtering
└── components/
    ├── artist-card.tsx       # Placeholder
    ├── artist-grid.tsx       # Placeholder
    └── artist-profile.tsx    # Placeholder
```

### Types (`artist.types.ts`)

```typescript
import type { Database } from "@/lib/supabase/types";

export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type ArtistInsert = Database["public"]["Tables"]["artists"]["Insert"];
export type ArtistUpdate = Database["public"]["Tables"]["artists"]["Update"];

export interface ArtistWithEvents extends Artist {
  upcomingEvents?: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
    venue: string;
  }>;
}

export interface ArtistFilters {
  genre?: string;
  location?: string;
  featured?: boolean;
  search?: string;
}
```

### Hook Usage (`use-artists.ts`)

```typescript
import { useArtists } from "@/features/artists/hooks/use-artists";

function ArtistsPage() {
  const { artists, loading, error } = useArtists({
    genre: "Afrobeat",      // Filter by genre
    featured: true,          // Only featured artists
    search: "kofi",          // Search by name
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {artists.map((artist) => (
        <div key={artist.id}>{artist.name}</div>
      ))}
    </div>
  );
}
```

### Features
- ✅ Real-time updates when artists change
- ✅ Client-side filtering by genre, location, featured status
- ✅ Search by name
- ✅ Loading and error states
- ✅ Type-safe operations

---

## Events Feature

### Structure
```
features/events/
├── types/
│   └── event.types.ts        # TypeScript types
├── hooks/
│   ├── use-events.tsx        # All events with filtering
│   ├── use-event.tsx         # Single event
│   └── use-featured-events.tsx  # Featured/upcoming events
├── components/
│   ├── event-card.tsx        # Placeholder
│   ├── event-grid.tsx        # Placeholder
│   ├── event-filters.tsx     # Placeholder
│   └── event-detail/         # Placeholder components
└── utils/
    └── event-helpers.ts      # Placeholder
```

### Types (`event.types.ts`)

```typescript
export type Event = Database["public"]["Tables"]["events"]["Row"];

export interface EventWithArtists extends Event {
  artists?: Array<{
    id: string;
    name: string;
    slug: string;
    genre: string[];
    role?: string;
  }>;
}

export interface EventFilters {
  category?: string;
  date?: string;
  location?: string;
  status?: "upcoming" | "ongoing" | "past" | "cancelled";
  featured?: boolean;
  search?: string;
}

export const EVENT_CATEGORIES = [
  "Concerts",
  "Festivals",
  "Club Nights",
  "Cultural Events",
  "Workshops",
  "Other",
] as const;
```

### Hook Usage

**All Events with Filtering:**
```typescript
import { useEvents } from "@/features/events/hooks/use-events";

function EventsPage() {
  const { events, loading, error } = useEvents({
    category: "Concerts",
    status: "upcoming",
    location: "New York",
  });

  return <EventList events={events} />;
}
```

**Single Event:**
```typescript
import { useEvent } from "@/features/events/hooks/use-event";

function EventDetailPage({ slug }: { slug: string }) {
  const { event, loading, error } = useEvent(slug);

  if (!event) return <div>Event not found</div>;

  return <div>{event.title}</div>;
}
```

**Featured/Upcoming Events:**
```typescript
import { useFeaturedEvents } from "@/features/events/hooks/use-featured-events";

function HomePage() {
  const { events, loading, error } = useFeaturedEvents(6);

  return <div>Next {events.length} events</div>;
}
```

### Features
- ✅ Real-time updates when events change
- ✅ Filter by category, status, date, location
- ✅ Search by title
- ✅ Fetch single event by slug
- ✅ Featured/upcoming events

---

## Bookings Feature

### Structure
```
features/bookings/
├── types/
│   ├── booking.types.ts      # TypeScript types
│   └── booking.schema.ts     # Placeholder (Zod schemas)
├── hooks/
│   ├── use-bookings.ts       # User's bookings
│   ├── use-create-booking.ts # Create booking
│   └── use-cancel-booking.ts # Cancel booking
├── components/              # Placeholder components
│   ├── booking-card.tsx
│   ├── booking-list.tsx
│   ├── booking-details.tsx
│   └── booking-form/
└── utils/
    └── booking-helpers.ts    # Placeholder
```

### Types (`booking.types.ts`)

```typescript
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export interface BookingWithEvent extends Booking {
  event?: {
    id: string;
    title: string;
    slug: string;
    date: string;
    venue: string;
  };
}

export interface BookingFormData {
  event_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ticket_type: "earlyBird" | "general" | "vip";
  quantity: number;
  notes?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "completed" | "failed";
```

### Hook Usage

**Get User's Bookings:**
```typescript
import { useBookings } from "@/features/bookings/hooks/use-bookings";

function MyBookings() {
  const { user } = useAuth();
  const { bookings, loading, error } = useBookings(user?.id || null);

  return (
    <div>
      {bookings.map((booking) => (
        <div key={booking.id}>
          {booking.event?.title} - {booking.quantity} tickets
        </div>
      ))}
    </div>
  );
}
```

**Create Booking:**
```typescript
import { useCreateBooking } from "@/features/bookings/hooks/use-create-booking";

function BookingForm({ event }: { event: Event }) {
  const { createBooking, loading, error } = useCreateBooking();

  const handleSubmit = async (formData: BookingFormData) => {
    try {
      const booking = await createBooking(formData, event.pricing);
      console.log("Booking created:", booking);
      // Redirect to payment or confirmation
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Cancel Booking:**
```typescript
import { useCancelBooking } from "@/features/bookings/hooks/use-cancel-booking";

function BookingActions({ bookingId }: { bookingId: string }) {
  const { cancelBooking, loading } = useCancelBooking();

  const handleCancel = async () => {
    if (confirm("Cancel this booking?")) {
      await cancelBooking(bookingId);
    }
  };

  return (
    <button onClick={handleCancel} disabled={loading}>
      Cancel Booking
    </button>
  );
}
```

### Features
- ✅ Real-time booking updates
- ✅ Create bookings with automatic price calculation
- ✅ Cancel bookings
- ✅ View user's bookings with event details
- ✅ Type-safe operations

---

## Auth Feature

### Structure
```
features/auth/
├── types/
│   └── auth.types.ts         # TypeScript types
├── hooks/
│   └── use-auth.ts           # Auth state management
└── components/              # Placeholder components
    ├── auth-guard.tsx
    ├── login-form.tsx
    └── register-form.tsx
```

### Types (`auth.types.ts`)

```typescript
import type { User, Session } from "@supabase/supabase-js";

export type { User, Session };
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRole = "user" | "artist" | "admin";

export interface SignUpFormData {
  email: string;
  password: string;
  full_name: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}
```

### Hook Usage (`use-auth.ts`)

```typescript
import { useAuth } from "@/features/auth/hooks/use-auth";

function ProfilePage() {
  const { user, profile, session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user.email}</h1>
      <p>Role: {profile?.role}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Sign Up/Sign In Example

```typescript
import { createClient } from "@/lib/supabase/client";

async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
}

async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
```

### Features
- ✅ Real-time auth state updates
- ✅ User session management
- ✅ Profile data fetching
- ✅ Auth state change listener
- ✅ Type-safe operations

---

## Payments Feature

### Structure
```
features/payments/
├── types/
│   └── payment.types.ts      # Placeholder
├── hooks/
│   ├── use-paystack.ts       # Placeholder
│   └── use-payment-status.ts # Placeholder
└── components/              # Placeholder components
    ├── checkout-button.tsx
    ├── payment-methods.tsx
    └── payment-status.tsx
```

**Note:** Payment feature structure is in place but requires implementation based on your payment provider (Paystack, Stripe, etc.).

---

## Usage Patterns

### Server Components (Recommended for SEO)

```typescript
// app/(public)/events/page.tsx
import { getAllEvents } from "@/lib/supabase/services";

export default async function EventsPage() {
  const events = await getAllEvents();

  return <EventList events={events} />;
}
```

### Client Components (With Real-Time)

```typescript
// components/live-events-list.tsx
"use client";

import { useEvents } from "@/features/events/hooks/use-events";

export function LiveEventsList() {
  const { events, loading } = useEvents({ status: "upcoming" });

  // This component updates in real-time!
  return <div>{events.length} upcoming events</div>;
}
```

### Combining Server + Client

```typescript
// app/(public)/events/page.tsx
import { getAllEvents } from "@/lib/supabase/services";
import { LiveEventFilters } from "@/components/live-event-filters";

export default async function EventsPage() {
  // Initial server-side render for SEO
  const initialEvents = await getAllEvents();

  return (
    <div>
      <h1>Events</h1>
      {/* Client component with real-time filtering */}
      <LiveEventFilters initialData={initialEvents} />
    </div>
  );
}
```

---

## Best Practices

### 1. Use Server Components When Possible
- Better for SEO
- Faster initial page load
- No JavaScript needed for initial render

### 2. Use Client Hooks for Interactivity
- Real-time updates
- User interactions
- Filtering and search
- Form submissions

### 3. Type Everything
```typescript
// ✅ Good
const { events }: { events: Event[] } = useEvents();

// ❌ Bad
const { events }: { events: any } = useEvents();
```

### 4. Handle Loading and Errors
```typescript
const { data, loading, error } = useEvents();

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <EventList events={data} />;
```

### 5. Clean Up Subscriptions
The hooks automatically handle cleanup, but if you're creating custom subscriptions:

```typescript
useEffect(() => {
  const channel = supabase.channel('custom').subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## Creating New Features

To add a new feature module:

1. **Create Directory Structure:**
```bash
features/
└── your-feature/
    ├── types/
    │   └── your-feature.types.ts
    ├── hooks/
    │   └── use-your-feature.ts
    ├── components/
    │   └── your-component.tsx
    └── utils/
        └── helpers.ts
```

2. **Define Types:**
```typescript
// types/your-feature.types.ts
import type { Database } from "@/lib/supabase/types";

export type YourType = Database["public"]["Tables"]["your_table"]["Row"];
```

3. **Create Hooks:**
```typescript
// hooks/use-your-feature.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function useYourFeature() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Fetch data
    supabase.from("your_table").select("*").then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });

    // Subscribe to changes
    const channel = supabase
      .channel("your_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "your_table" }, () => {
        // Refetch on changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}
```

---

## Testing

### Test Server-Side Fetching
```typescript
import { getAllEvents } from "@/lib/supabase/services";

// In your tests
const events = await getAllEvents();
expect(events).toBeInstanceOf(Array);
```

### Test Hooks
```typescript
import { renderHook } from "@testing-library/react";
import { useEvents } from "@/features/events/hooks/use-events";

// In your tests
const { result } = renderHook(() => useEvents());
expect(result.current.loading).toBe(true);
```

---

## Troubleshooting

### "Cannot find module '@/lib/supabase/...'"
- Ensure Supabase is set up correctly
- Check `lib/supabase/` directory exists
- Verify imports use correct paths

### Real-time not working
- Check Supabase real-time is enabled in dashboard
- Verify database replication settings
- Ensure component is client-side (`"use client"`)

### Type errors
- Regenerate types: Run database migration
- Check `lib/supabase/types.ts` is up to date
- Verify Database type is imported correctly

---

## Next Steps

1. ✅ Features directory updated with Supabase integration
2. ⏳ Implement placeholder components
3. ⏳ Add form validation with Zod schemas
4. ⏳ Create shared utilities (formatters, validators)
5. ⏳ Add comprehensive error handling
6. ⏳ Implement payment integration
7. ⏳ Add tests for hooks and utilities

---

## Resources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
