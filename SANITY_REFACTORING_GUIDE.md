# Sanity CMS Integration Guide

## What's Been Completed

### ✅ Infrastructure Setup
1. **Sanity Client Configuration** (`lib/cms/sanity.ts`)
   - Read and write clients configured
   - Image URL builder with optimization
   - Environment variables setup

2. **TypeScript Types** (`lib/cms/types.ts`)
   - Complete type definitions for Artist, Event, Page, SiteSettings
   - Sanity image and block content types
   - Content section types for flexible pages

3. **GROQ Queries** (`lib/cms/queries.ts`)
   - Artist queries (all, featured, by slug, by genre)
   - Event queries (all, featured, by slug, by category, upcoming)
   - Page and settings queries

4. **Service Layer** (`lib/cms/services.ts`)
   - Async functions for all data fetching
   - Error handling built-in
   - Cache-ready with revalidation tags

5. **Reusable Components**
   - `components/sanity/sanity-image.tsx` - Image component with fallback
   - `components/sanity/portable-text.tsx` - Rich text renderer

6. **Refactored Pages**
   - ✅ Home page (`app/(public)/page.tsx`) - Fetches events from Sanity

## 🔄 Remaining Refactoring Work

### Artists Pages

#### 1. Artists Listing (`app/(public)/artists/page.tsx`)

```typescript
import { getAllArtists } from "@/lib/cms/services";
import { SanityImage } from "@/components/sanity/sanity-image";

export default async function ArtistsPage() {
  const artists = await getAllArtists();

  // Get unique genres
  const allGenres = artists.flatMap((artist) => artist.genre || []);
  const uniqueGenres = ["All Genres", ...Array.from(new Set(allGenres))];

  // Replace mock data with artists.map((artist) => (
  //   key={artist._id}
  //   name={artist.name}
  //   slug={artist.slug}
  //   image={<SanityImage image={artist.image} />}
  //   genre={artist.genre[0]}
  //   city={artist.city}
  //   state={artist.state}
  //   rating={artist.rating}
  //   totalBookings={artist.totalBookings}
  // ))
}
```

#### 2. Artist Detail (`app/(public)/artists/[slug]/page.tsx`)

```typescript
import { getArtistBySlug } from "@/lib/cms/services";
import { SanityImage } from "@/components/sanity/sanity-image";
import { PortableText } from "@/components/sanity/portable-text";

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  // Replace mock data with artist data:
  // - artist.name
  // - <SanityImage image={artist.image} />
  // - <PortableText content={artist.bio} />
  // - artist.genre.map(...)
  // - artist.specialties
  // - artist.awards
  // - artist.upcomingEvents (comes from query)
}
```

### Events Pages

#### 3. Events Listing (`app/(public)/events/page.tsx`)

```typescript
import { getAllEvents } from "@/lib/cms/services";
import { SanityImage } from "@/components/sanity/sanity-image";

export default async function EventsPage() {
  const events = await getAllEvents();

  // Get unique categories
  const categories = ["All Events", ...Array.from(new Set(events.map(e => e.category)))];

  // Replace mock data with events.map((event) => (
  //   key={event._id}
  //   title={event.title}
  //   slug={event.slug}
  //   image={<SanityImage image={event.image} />}
  //   date={event.date}
  //   time={`${event.startTime} - ${event.endTime}`}
  //   venue={event.venue}
  //   city={event.city}
  //   pricing={event.pricing}
  //   attendees={event.attendees}
  // ))
}
```

#### 4. Event Detail (`app/(public)/events/[slug]/page.tsx`)

```typescript
import { getEventBySlug } from "@/lib/cms/services";
import { SanityImage } from "@/components/sanity/sanity-image";
import { PortableText } from "@/components/sanity/portable-text";

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Replace mock data with event data:
  // - event.title
  // - <SanityImage image={event.image} />
  // - <PortableText content={event.description} />
  // - event.date, event.startTime, event.endTime
  // - event.venue, event.address
  // - event.pricing (earlyBird, general, vip)
  // - event.artists.map(...) (populated from query)
  // - event.lineup
  // - event.highlights
  // - event.ageRequirement
  // - event.dressCode
}
```

### Static Pages

#### 5. About Page (`app/(public)/about/page.tsx`)

```typescript
import { getPageBySlug } from "@/lib/cms/services";

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  // Option 1: Use page.sections to render dynamic content
  // Option 2: Keep current design, fetch specific data from Sanity

  // If using dynamic sections:
  // page.sections.map((section) => {
  //   switch(section._type) {
  //     case "heroSection": return <HeroSection {...section} />
  //     case "statsSection": return <StatsSection {...section} />
  //     case "teamSection": return <TeamSection {...section} />
  //     // etc
  //   }
  // })
}
```

#### 6. Contact Page (`app/(public)/contact/page.tsx`)

```typescript
import { getSiteSettings } from "@/lib/cms/services";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  // Replace hardcoded contact info with settings data:
  // - settings.contact.email
  // - settings.contact.phone
  // - settings.contact.address

  // Keep the contact form as-is (client component)
}
```

### Header & Footer

#### 7. Header (`components/layout/header.tsx`)

```typescript
import { getSiteSettings } from "@/lib/cms/services";

export async function Header() {
  const settings = await getSiteSettings();

  // Use settings.navigation for nav items
  // Use settings.logo for site logo
}
```

#### 8. Footer (`components/layout/footer.tsx`)

```typescript
import { getSiteSettings } from "@/lib/cms/services";

export async function Footer() {
  const settings = await getSiteSettings();

  // Use settings.footer for footer links
  // Use settings.socialMedia for social links
  // Use settings.contact for contact info
}
```

## 📝 Setting Up Sanity Studio

### 1. Create Sanity Project

```bash
npm install -g @sanity/cli
sanity init
```

### 2. Configure Sanity Studio

Update `.env.local` with your actual Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-actual-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-actual-token"
```

### 3. Create Schemas

Create these schema files in `sanity/schemas/`:

**artist.ts**
```typescript
export default {
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' } },
    { name: 'image', type: 'image', title: 'Image' },
    { name: 'bio', type: 'array', of: [{ type: 'block' }] },
    { name: 'genre', type: 'array', of: [{ type: 'string' }] },
    { name: 'location', type: 'string' },
    { name: 'city', type: 'string' },
    { name: 'state', type: 'string' },
    { name: 'specialties', type: 'array', of: [{ type: 'string' }] },
    { name: 'awards', type: 'array', of: [{ type: 'string' }] },
    { name: 'rating', type: 'number' },
    { name: 'totalBookings', type: 'number' },
    { name: 'joinedDate', type: 'date' },
    { name: 'status', type: 'string', options: { list: ['active', 'inactive'] } },
    { name: 'featured', type: 'boolean' },
  ],
}
```

**event.ts**
```typescript
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'description', type: 'array', of: [{ type: 'block' }] },
    { name: 'shortDescription', type: 'text' },
    { name: 'image', type: 'image', title: 'Image' },
    { name: 'category', type: 'string' },
    { name: 'date', type: 'date' },
    { name: 'startTime', type: 'string' },
    { name: 'endTime', type: 'string' },
    { name: 'venue', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'city', type: 'string' },
    { name: 'state', type: 'string' },
    {
      name: 'artists',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
    },
    {
      name: 'pricing',
      type: 'object',
      fields: [
        { name: 'earlyBird', type: 'number' },
        { name: 'general', type: 'number' },
        { name: 'vip', type: 'number' },
        { name: 'currency', type: 'string' },
      ],
    },
    { name: 'capacity', type: 'number' },
    { name: 'attendees', type: 'number' },
    { name: 'highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'ageRequirement', type: 'string' },
    { name: 'dressCode', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'featured', type: 'boolean' },
  ],
}
```

### 4. Deploy Sanity Studio

```bash
cd sanity
sanity deploy
```

## 🧪 Testing

1. **Add sample data** in Sanity Studio
2. **Test each page** to ensure data loads correctly
3. **Check image optimization** (Sanity serves optimized images)
4. **Verify error handling** (empty states, 404s)

## 🚀 Next Steps

1. Complete remaining page refactoring
2. Add ISR/revalidation for better performance
3. Implement search and filtering
4. Add pagination for large datasets
5. Set up Sanity webhooks for automatic revalidation

## 📚 Resources

- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Query Reference](https://www.sanity.io/docs/groq)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
