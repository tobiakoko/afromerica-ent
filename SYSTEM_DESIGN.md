# AfroMerica Entertainment - System Design

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [API Design](#api-design)
5. [Data Flow](#data-flow)
6. [Security](#security)
7. [Performance & Scalability](#performance--scalability)
8. [Monitoring & Observability](#monitoring--observability)
9. [Deployment Strategy](#deployment-strategy)
10. [Technology Stack](#technology-stack)

---

## Overview

### Purpose
AfroMerica Entertainment is a comprehensive platform for discovering artists, attending events, and participating in pilot program voting for the December Launch Event. The system enables:

- **Artist Discovery**: Browse and discover African and Afro-Caribbean artists
- **Event Management**: Create, browse, and book tickets for events
- **Pilot Voting System**: Purchase votes to support favorite artists for the pilot event
- **Payment Processing**: Secure payments via Paystack for voting and bookings
- **Real-time Updates**: Live leaderboard and vote updates via Supabase Realtime

### Key Features
- ✅ Unlimited voting (purchase as many votes as you want)
- ✅ Shopping cart system with multiple artists
- ✅ Paystack payment integration
- ✅ Real-time leaderboard updates
- ✅ No voting frequency restrictions
- ✅ Artist profiles with social media integration
- ✅ Event booking system
- ✅ Content management via Sanity CMS

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Web Browser │  │    Mobile    │  │   Bot/Crawl  │          │
│  │   (Next.js)  │  │  (Responsive)│  │   (SEO/API)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                            │
│                         (Next.js 14+)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Server Components  │  Client Components  │  API Routes   │  │
│  │  - SSR Pages        │  - Interactive UI   │  - REST API   │  │
│  │  - Data Fetching    │  - Real-time Updates│  - Webhooks   │  │
│  │  - SEO Optimization │  - Form Handling    │  - Auth       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    Data/Services Layer    │  │   External Services      │
│                           │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │  Supabase          │  │  │  │  Paystack          │ │
│  │  - PostgreSQL      │  │  │  │  - Payments        │ │
│  │  - Auth            │  │  │  │  - Webhooks        │ │
│  │  - Realtime        │  │  │  └────────────────────┘ │
│  │  - Storage         │  │  │                          │
│  └────────────────────┘  │  │  ┌────────────────────┐ │
│                           │  │  │  Sanity CMS        │ │
│  ┌────────────────────┐  │  │  │  - Content Mgmt    │ │
│  │  Services          │  │  │  │  - Media Storage   │ │
│  │  - Artist Service  │  │  │  └────────────────────┘ │
│  │  - Event Service   │  │  │                          │
│  │  - Voting Service  │  │  │  ┌────────────────────┐ │
│  │  - Payment Service │  │  │  │  Monitoring        │ │
│  │  - Booking Service │  │  │  │  - Sentry          │ │
│  └────────────────────┘  │  │  │  - Analytics       │ │
└──────────────────────────┘  │  └────────────────────┘ │
                               └──────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Feature-Based Structure                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  features/                                                        │
│  ├── artists/                                                     │
│  │   ├── types/          # TypeScript definitions                │
│  │   ├── hooks/          # React hooks (useArtists, etc.)       │
│  │   ├── services/       # API calls                            │
│  │   └── components/     # Reusable components                  │
│  │                                                                │
│  ├── events/                                                      │
│  │   ├── types/                                                  │
│  │   ├── hooks/          # Event filtering, fetching            │
│  │   └── components/                                             │
│  │                                                                │
│  ├── pilot-voting/                                               │
│  │   ├── types/          # Voting, Cart, Payment types          │
│  │   ├── hooks/          # useVotingStats, usePilotArtists      │
│  │   ├── services/       # Voting logic, rank updates           │
│  │   ├── components/     # Leaderboard, Cart, Package cards     │
│  │   └── context/        # CartContext for state management     │
│  │                                                                │
│  ├── bookings/                                                    │
│  │   ├── types/                                                  │
│  │   ├── hooks/          # Booking management                   │
│  │   └── components/     # BookingCheckout                      │
│  │                                                                │
│  └── auth/                                                        │
│      ├── types/                                                  │
│      ├── hooks/          # useAuth for session management       │
│      └── components/                                             │
│                                                                   │
│  lib/                                                             │
│  ├── supabase/          # Database client & services            │
│  ├── payments/          # Paystack integration                  │
│  ├── cms/               # Sanity CMS integration                │
│  ├── performance.ts     # Performance monitoring                │
│  ├── monitoring.ts      # Error & event tracking                │
│  └── seo.ts             # SEO utilities                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│     profiles        │       │      artists        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK, FK→users)   │       │ id (PK)             │
│ email               │       │ name                │
│ full_name           │       │ slug (UNIQUE)       │
│ avatar_url          │       │ bio                 │
│ role                │       │ genre[]             │
│ created_at          │       │ rating              │
└─────────────────────┘       │ total_bookings      │
                              │ status              │
                              │ featured            │
                              └─────────────────────┘
                                       │
                                       │ 1:N
                                       ▼
                              ┌─────────────────────┐
                              │  event_artists      │
                              ├─────────────────────┤
                              │ id (PK)             │
                              │ event_id (FK)       │
                              │ artist_id (FK)      │
                              │ role                │
                              └─────────────────────┘
                                       │
                                       │ N:1
                                       ▼
┌─────────────────────┐       ┌─────────────────────┐
│      bookings       │       │       events        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │◄─────┤ id (PK)             │
│ event_id (FK)       │  N:1  │ title               │
│ user_id (FK)        │       │ slug (UNIQUE)       │
│ customer_name       │       │ description         │
│ customer_email      │       │ date                │
│ ticket_type         │       │ venue               │
│ quantity            │       │ pricing (JSONB)     │
│ total_amount        │       │ capacity            │
│ payment_status      │       │ status              │
│ payment_reference   │       │ featured            │
└─────────────────────┘       └─────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│              Pilot Voting System Schema                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐       ┌─────────────────────┐     │
│  │   pilot_artists     │       │   vote_packages     │     │
│  ├─────────────────────┤       ├─────────────────────┤     │
│  │ id (PK)             │       │ id (PK)             │     │
│  │ name                │       │ name                │     │
│  │ slug (UNIQUE)       │       │ votes               │     │
│  │ stage_name          │       │ price               │     │
│  │ bio                 │       │ currency            │     │
│  │ genre[]             │       │ discount            │     │
│  │ image               │       │ popular             │     │
│  │ cover_image         │       │ savings             │     │
│  │ performance_video   │       │ active              │     │
│  │ social_media (JSON) │       └─────────────────────┘     │
│  │ total_votes         │                 │                  │
│  │ rank                │                 │ N:M              │
│  │ created_at          │                 ▼                  │
│  │ updated_at          │       ┌─────────────────────┐     │
│  └─────────────────────┘       │  vote_purchases     │     │
│            │                    ├─────────────────────┤     │
│            │                    │ id (PK)             │     │
│            │ 1:N                │ user_id (FK)        │     │
│            └───────────────────►│ email               │     │
│                                 │ items (JSONB)       │     │
│                                 │ total_votes         │     │
│                                 │ total_amount        │     │
│                                 │ currency            │     │
│                                 │ payment_status      │     │
│                                 │ payment_reference   │     │
│                                 │ payment_method      │     │
│                                 │ purchased_at        │     │
│                                 └─────────────────────┘     │
│                                                               │
│  ┌─────────────────────┐                                    │
│  │  voting_config      │                                    │
│  ├─────────────────────┤                                    │
│  │ id (PK)             │                                    │
│  │ voting_ends_at      │                                    │
│  │ is_voting_active    │                                    │
│  └─────────────────────┘                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema Details

#### Core Tables

**artists**
- Primary entity for artist management
- Supports multiple genres (array)
- Rating system (0-5)
- Status: active/inactive
- Featured flag for homepage

**events**
- Event management with full details
- JSONB pricing for flexible ticket types
- Status: upcoming/ongoing/past/cancelled
- Supports multiple artists via junction table

**profiles**
- Extends Supabase auth.users
- Role-based access (user/artist/admin)
- Linked to bookings and purchases

**bookings**
- Event ticket purchases
- Payment tracking with reference
- Status: pending/confirmed/cancelled/refunded

#### Pilot Voting Tables

**pilot_artists**
- Separate from main artists for voting isolation
- Real-time rank calculation
- Social media integration (JSONB)
- Performance video support

**vote_packages**
- Predefined voting packages (10, 50, 100, 250, 500 votes)
- Discount and savings calculation
- Popular flag for UI highlighting

**vote_purchases**
- Transaction records for vote purchases
- JSONB items array (supports cart with multiple artists)
- Paystack integration fields
- Status tracking: pending/completed/failed

**voting_config**
- Global voting settings
- Voting period management
- Active/inactive toggle

### Key Database Functions

```sql
-- Apply votes to artist and update rankings
CREATE FUNCTION apply_votes_to_artist(
  artist_id UUID,
  vote_count INTEGER
)
RETURNS VOID

-- Update all artist rankings based on total votes
CREATE FUNCTION update_artist_rankings()
RETURNS VOID
```

### Indexes for Performance

```sql
-- Artist lookups
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_status ON artists(status);
CREATE INDEX idx_artists_featured ON artists(featured);

-- Event queries
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);

-- Voting performance
CREATE INDEX idx_pilot_artists_rank ON pilot_artists(rank);
CREATE INDEX idx_pilot_artists_total_votes ON pilot_artists(total_votes DESC);
CREATE INDEX idx_vote_purchases_payment_status ON vote_purchases(payment_status);
```

---

## API Design

### REST API Endpoints

#### Payments

```
POST   /api/payments/initialize
  - Initialize Paystack payment
  - Body: { email, amount, currency, type, metadata }
  - Returns: { authorizationUrl, reference }

GET    /api/payments/verify?reference=XXX
  - Verify payment status
  - Returns: { success, data: { status, amount, reference } }

POST   /api/webhooks/paystack
  - Handle Paystack webhook events
  - Events: charge.success, charge.failed
  - Applies votes or confirms bookings
```

#### Voting (via Supabase)

```
GET    /supabase/pilot_artists
  - Fetch all pilot artists
  - Sort by rank or votes
  - Real-time subscription available

GET    /supabase/vote_packages
  - Fetch active voting packages

POST   /supabase/vote_purchases
  - Create purchase record
  - Triggers on payment success
```

### GraphQL (Sanity CMS)

```graphql
query {
  artists {
    _id
    name
    slug
    image
    genre
    bio
  }

  events {
    _id
    title
    slug
    date
    venue
    pricing
    artists {
      _ref
    }
  }
}
```

### WebSocket (Supabase Realtime)

```javascript
// Real-time vote updates
supabase
  .channel('pilot_artists_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'pilot_artists'
  }, (payload) => {
    // Update UI with new rankings
  })
  .subscribe()
```

---

## Data Flow

### Voting Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│                    User Journey: Voting                      │
└─────────────────────────────────────────────────────────────┘

1. Browse Artists
   ├─► User visits /pilot-voting
   ├─► Fetches pilot_artists (sorted by rank)
   ├─► Displays leaderboard with real-time updates
   └─► Shows voting stats (total votes, time remaining)

2. Select Artist & Package
   ├─► User clicks "Vote" on artist card
   ├─► Modal displays vote packages
   ├─► User selects package (e.g., 50 votes for $20)
   └─► Adds to cart

3. Shopping Cart
   ├─► User can add votes for multiple artists
   ├─► Cart persists in localStorage
   ├─► Can update quantities or remove items
   ├─► Shows total votes and total price
   └─► Proceeds to checkout

4. Checkout & Payment
   ├─► User enters email
   ├─► Creates vote_purchase record (status: pending)
   ├─► Calls POST /api/payments/initialize
   ├─► Receives Paystack authorization URL
   ├─► Redirects to Paystack payment page
   └─► User completes payment

5. Payment Processing
   ├─► Paystack sends webhook to /api/webhooks/paystack
   ├─► Validates webhook signature
   ├─► Updates vote_purchase (status: completed)
   ├─► Calls apply_votes_to_artist() for each item
   ├─► Triggers update_artist_rankings()
   └─► Real-time update via Supabase Realtime

6. Confirmation
   ├─► User redirected to /payments/verify?reference=XXX
   ├─► Verifies payment status
   ├─► Displays success message
   ├─► Shows applied votes
   └─► Clears cart
```

### Booking Flow

```
1. Browse Events
   ├─► User visits /events
   └─► Fetches events (upcoming/ongoing)

2. Event Details
   ├─► User selects event
   ├─► Views lineup, pricing, highlights
   └─► Clicks "Book Tickets"

3. Booking Form
   ├─► User fills customer info (name, email, phone)
   ├─► Selects ticket type (earlyBird/general/vip)
   ├─► Specifies quantity
   └─► Confirms booking

4. Payment & Confirmation
   ├─► Creates booking record (status: pending)
   ├─► Paystack payment flow (same as voting)
   └─► Webhook confirms booking (status: confirmed)
```

### Real-time Updates Flow

```
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│   Payment      │         │   Database     │         │   All Clients  │
│   Webhook      │────────►│   Update       │────────►│   (Realtime)   │
└────────────────┘         └────────────────┘         └────────────────┘
                                    │
                                    ├─► Update pilot_artists.total_votes
                                    ├─► Call update_artist_rankings()
                                    └─► Broadcast change via Realtime
```

---

## Security

### Authentication & Authorization

**Supabase Auth**
- Email/password authentication
- Magic link support
- JWT-based sessions
- Row Level Security (RLS) policies

**RLS Policies**

```sql
-- Public read access
CREATE POLICY "Artists viewable by everyone"
  ON public.artists FOR SELECT
  USING (true);

-- Protected write access
CREATE POLICY "Only authenticated users can update"
  ON public.artists FOR UPDATE
  USING (auth.role() = 'authenticated');

-- User data access
CREATE POLICY "Users can view own purchases"
  ON public.vote_purchases FOR SELECT
  USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
```

### Payment Security

**Paystack Integration**
- Webhook signature validation
- Secret key stored in environment variables
- HTTPS-only communication
- PCI DSS compliant (handled by Paystack)

**Webhook Validation**
```typescript
function validateWebhookSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(payload)
    .digest('hex');
  return hash === signature;
}
```

### Data Protection

- Environment variables for sensitive keys
- No secret keys in client-side code
- CORS configuration
- Rate limiting on API routes
- Input validation and sanitization

---

## Performance & Scalability

### Performance Optimizations

**Frontend**
- Server-side rendering (SSR) for SEO
- Static site generation (SSG) where applicable
- Image optimization (Next.js Image)
- Code splitting and lazy loading
- Resource hints (preconnect, prefetch)

**Database**
- Indexes on frequently queried columns
- Connection pooling (Supabase)
- Query optimization (select only needed fields)
- Real-time subscriptions (Supabase Realtime)

**Caching Strategy**
```
┌────────────────────────────────────────────────┐
│            Caching Layers                       │
├────────────────────────────────────────────────┤
│ CDN (Vercel Edge)                              │
│  ├─► Static assets (images, CSS, JS)          │
│  └─► Cache-Control headers                     │
│                                                 │
│ ISR (Incremental Static Regeneration)         │
│  ├─► Artist pages (revalidate: 3600s)         │
│  ├─► Event pages (revalidate: 600s)           │
│  └─► Blog/content pages                        │
│                                                 │
│ Client-side (SWR/React Query)                  │
│  ├─► API responses                             │
│  ├─► Stale-while-revalidate                   │
│  └─► localStorage (cart persistence)          │
│                                                 │
│ Database (Supabase)                            │
│  ├─► Query result caching                      │
│  └─► Connection pooling                        │
└────────────────────────────────────────────────┘
```

### Scalability Considerations

**Horizontal Scaling**
- Serverless functions (Vercel/AWS Lambda)
- Supabase scales automatically
- CDN distribution (Vercel Edge Network)

**Database Scaling**
- Supabase automatic scaling
- Read replicas for read-heavy workloads
- Partitioning for large tables (future)

**Real-time Scaling**
- Supabase Realtime uses Phoenix channels
- Handles thousands of concurrent connections
- Automatic load balancing

**Load Testing Targets**
- 10,000+ concurrent users
- 1,000+ votes per minute
- <200ms API response time
- 99.9% uptime

---

## Monitoring & Observability

### Metrics & Logging

**Application Metrics**
- Web Vitals (LCP, FID, CLS)
- API response times
- Error rates
- User engagement (page views, clicks)

**Business Metrics**
- Total votes purchased
- Revenue (by day, week, month)
- Conversion rates
- Popular artists/events

**Monitoring Stack**
```
┌────────────────────────────────────────────────┐
│         Monitoring Architecture                 │
├────────────────────────────────────────────────┤
│                                                 │
│  Frontend                                       │
│   ├─► Performance: Web Vitals API              │
│   ├─► Errors: ErrorTracker class               │
│   ├─► Events: EventTracker class               │
│   └─► Analytics: Google Analytics              │
│                                                 │
│  Backend                                        │
│   ├─► Logs: Logger class (structured logging)  │
│   ├─► Errors: Sentry integration               │
│   ├─► APM: Vercel Analytics                    │
│   └─► Uptime: StatusCake/Pingdom               │
│                                                 │
│  Database                                       │
│   ├─► Query performance: Supabase dashboard    │
│   ├─► Connection pool: Supabase metrics        │
│   └─► Slow queries: pg_stat_statements         │
│                                                 │
│  Payments                                       │
│   ├─► Transaction logs: Paystack dashboard     │
│   ├─► Webhook delivery: Custom logging         │
│   └─► Failed payments: Alert system            │
│                                                 │
└────────────────────────────────────────────────┘
```

### Health Checks

```typescript
// API health endpoint
GET /api/health
{
  "status": "healthy",
  "checks": {
    "database": true,
    "api": true,
    "cache": true
  },
  "timestamp": 1234567890
}
```

### Alerting

- Error rate > 5%
- API response time > 1s
- Payment webhook failures
- Database connection issues
- High memory usage (>90%)

---

## Deployment Strategy

### CI/CD Pipeline

```
┌────────────────────────────────────────────────┐
│           Deployment Pipeline                   │
├────────────────────────────────────────────────┤
│                                                 │
│  1. Code Push (GitHub)                         │
│     └─► Branch: main, develop, feature/*       │
│                                                 │
│  2. CI Checks (GitHub Actions)                 │
│     ├─► Lint (ESLint, Prettier)                │
│     ├─► Type check (TypeScript)                │
│     ├─► Tests (Jest, Playwright)               │
│     └─► Build verification                      │
│                                                 │
│  3. Preview Deploy (Vercel)                    │
│     ├─► Every PR gets preview URL              │
│     ├─► Automatic deployment                    │
│     └─► Environment: preview                    │
│                                                 │
│  4. Production Deploy (Vercel)                 │
│     ├─► Merge to main branch                   │
│     ├─► Automatic deployment                    │
│     ├─► Environment: production                 │
│     └─► Domain: afromerica-ent.com             │
│                                                 │
│  5. Database Migrations (Supabase)             │
│     ├─► Run migrations on deploy                │
│     ├─► Backup before migration                 │
│     └─► Rollback plan                           │
│                                                 │
└────────────────────────────────────────────────┘
```

### Environments

**Development**
- Local development with `.env.local`
- Hot reload for rapid iteration
- Test payment keys (Paystack test mode)

**Preview (Staging)**
- Automatic deployment for PRs
- Preview URLs for testing
- Separate Supabase project
- Test payment integration

**Production**
- Main branch auto-deploys
- Custom domain
- Live Paystack keys
- Production Supabase project

### Rollback Strategy

1. **Instant Rollback**: Vercel allows instant rollback to previous deployment
2. **Database Rollback**: Migration rollback scripts in `supabase/migrations`
3. **Feature Flags**: Disable features without deployment

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (Serverless Functions)
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Realtime**: Supabase Realtime
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

### Payments
- **Provider**: Paystack
- **Integration**: REST API + Webhooks
- **Currencies**: NGN, USD, GHS, ZAR

### CMS
- **Platform**: Sanity.io
- **Content**: Artists, Events, Pages
- **Media**: Image optimization

### Hosting & Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain + SSL
- **Analytics**: Vercel Analytics

### Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: npm/pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Playwright
- **CI/CD**: GitHub Actions + Vercel

### Monitoring
- **Errors**: Sentry (optional)
- **Analytics**: Google Analytics
- **Performance**: Web Vitals API
- **Uptime**: StatusCake (optional)

---

## Future Enhancements

### Phase 2 Features
- [ ] Email notifications (Resend/SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] Admin dashboard
- [ ] Artist dashboard
- [ ] Advanced analytics
- [ ] Multiple voting campaigns
- [ ] Social sharing features
- [ ] Referral program

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Live streaming integration
- [ ] Chat/messaging system
- [ ] Loyalty program
- [ ] Multi-currency support expansion

---

## Appendix

### Environment Variables

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Payments
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Monitoring (Optional)
SENTRY_DSN=
NEXT_PUBLIC_ANALYTICS_ENDPOINT=
```

### Key Decision Rationale

**Why Next.js?**
- Server-side rendering for SEO
- File-based routing
- API routes for backend logic
- Excellent developer experience

**Why Supabase?**
- PostgreSQL (robust, scalable)
- Real-time subscriptions out of the box
- Built-in authentication
- Row-level security
- Generous free tier

**Why Paystack?**
- African market focus
- Multiple currency support
- Reliable webhook system
- Great documentation
- No setup fees

**Why Feature-Based Structure?**
- Better code organization
- Easier to maintain and scale
- Clear separation of concerns
- Reusable components

---

**Last Updated**: January 2025
**Version**: 1.0
**Author**: AfroMerica Entertainment Development Team
