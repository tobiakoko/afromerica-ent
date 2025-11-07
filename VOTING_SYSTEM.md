# Pilot Voting System - December Launch Event

## Overview

The AfroMerica Entertainment Pilot Voting System enables fans to purchase votes to support their favorite artists competing for the December Pilot Launch Event. This system implements **unlimited voting** with a shopping cart, payment integration, and real-time leaderboard updates.

## Key Features

### ✅ Unlimited Voting
- **No Restrictions**: Purchase as many votes as you want
- **Multiple Packages**: Choose from 5 different vote packages (10 to 500 votes)
- **Bulk Discounts**: Save more with larger packages
- **Multiple Artists**: Support multiple artists in one transaction

### ✅ Shopping Cart System
- **Multi-Artist Support**: Add votes for different artists to cart
- **Quantity Control**: Adjust package quantities
- **Persistent Cart**: Cart saved in localStorage
- **Real-time Totals**: See total votes and cost instantly

### ✅ Payment Integration (Paystack)
- **Secure Payments**: PCI DSS compliant via Paystack
- **Multiple Channels**: Card, Bank, USSD, Mobile Money
- **Multi-Currency**: NGN, USD, GHS, ZAR support
- **Instant Application**: Votes applied immediately after payment

### ✅ Real-time Leaderboard
- **Live Updates**: See rankings change in real-time
- **Supabase Realtime**: WebSocket-based updates
- **Vote Percentage**: See each artist's share of total votes
- **Top Rankings**: Special badges for top 3 artists

### ✅ No Frequency Restrictions
- **Vote Anytime**: No cooldown periods
- **Instant Purchases**: Multiple purchases in succession
- **Unlimited Transactions**: No daily/weekly limits

---

## System Architecture

### Vote Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     VOTING FLOW                                 │
└────────────────────────────────────────────────────────────────┘

Step 1: Browse Artists
┌──────────────────────────┐
│  /pilot-voting           │
│  ┌────────────────────┐  │
│  │  Artist Cards      │  │
│  │  - Photo           │  │
│  │  - Name            │  │
│  │  - Rank Badge      │  │
│  │  - Total Votes     │  │
│  │  - Vote Button     │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  Leaderboard Tab   │  │
│  │  - Top 10 Artists  │  │
│  │  - Progress Bars   │  │
│  │  - Percentages     │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  Voting Stats      │  │
│  │  - Total Votes     │  │
│  │  - Unique Voters   │  │
│  │  - Time Remaining  │  │
│  │  - Leading Artist  │  │
│  └────────────────────┘  │
└──────────────────────────┘
          │
          ▼
Step 2: Select Package
┌──────────────────────────┐
│  Package Modal           │
│  ┌────────────────────┐  │
│  │  Starter Pack      │  │
│  │  10 votes - $5     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Popular Pack ⭐   │  │
│  │  50 votes - $20    │  │
│  │  Save $5 (20% off) │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Super Pack        │  │
│  │  100 votes - $35   │  │
│  │  Save $15 (30%)    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Mega Pack         │  │
│  │  250 votes - $75   │  │
│  │  Save $50 (40%)    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Ultimate Pack     │  │
│  │  500 votes - $125  │  │
│  │  Save $125 (50%)   │  │
│  └────────────────────┘  │
└──────────────────────────┘
          │
          ▼
Step 3: Shopping Cart
┌──────────────────────────┐
│  /pilot-voting/cart      │
│  ┌────────────────────┐  │
│  │  Cart Items        │  │
│  │  ┌──────────────┐  │  │
│  │  │ Artist: Chi  │  │  │
│  │  │ Pack: 50     │  │  │
│  │  │ Qty: [2] ▼   │  │  │
│  │  │ $40.00       │  │  │
│  │  │ 100 votes    │  │  │
│  │  └──────────────┘  │  │
│  │  ┌──────────────┐  │  │
│  │  │ Artist: M-D  │  │  │
│  │  │ Pack: 100    │  │  │
│  │  │ Qty: [1] ▼   │  │  │
│  │  │ $35.00       │  │  │
│  │  │ 100 votes    │  │  │
│  │  └──────────────┘  │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Order Summary     │  │
│  │  Total Votes: 200  │  │
│  │  Total: $75.00     │  │
│  │                    │  │
│  │  Email: [______]   │  │
│  │  [Proceed to Pay]  │  │
│  └────────────────────┘  │
└──────────────────────────┘
          │
          ▼
Step 4: Payment (Paystack)
┌──────────────────────────┐
│  Paystack Payment Page   │
│  ┌────────────────────┐  │
│  │  Card Number       │  │
│  │  [____________]    │  │
│  │  CVV    Expiry     │  │
│  │  [___]  [____]     │  │
│  │                    │  │
│  │  OR                │  │
│  │  ┌──────────────┐  │  │
│  │  │ Bank Transfer│  │  │
│  │  │ USSD         │  │  │
│  │  │ Mobile Money │  │  │
│  │  └──────────────┘  │  │
│  │                    │  │
│  │  [Pay $75.00]      │  │
│  └────────────────────┘  │
└──────────────────────────┘
          │
          ▼
Step 5: Webhook Processing
┌──────────────────────────┐
│  Backend Processing      │
│  1. Validate webhook     │
│  2. Update purchase      │
│     status: completed    │
│  3. Apply votes:         │
│     Chi Chi: +100 votes  │
│     M-Dash:  +100 votes  │
│  4. Update rankings      │
│  5. Broadcast realtime   │
└──────────────────────────┘
          │
          ▼
Step 6: Confirmation
┌──────────────────────────┐
│  /payments/verify        │
│  ┌────────────────────┐  │
│  │  ✓ Success!        │  │
│  │                    │  │
│  │  Your votes have   │  │
│  │  been applied!     │  │
│  │                    │  │
│  │  Reference: VOT... │  │
│  │  Amount: $75.00    │  │
│  │  Votes: 200        │  │
│  │                    │  │
│  │  [Back to Voting]  │  │
│  └────────────────────┘  │
└──────────────────────────┘
          │
          ▼
Step 7: Real-time Update
┌──────────────────────────┐
│  All Connected Clients   │
│  ┌────────────────────┐  │
│  │  Leaderboard       │  │
│  │  1. Chi Chi ⬆      │  │
│  │     1,350 votes    │  │
│  │  2. M-Dash  ⬆      │  │
│  │     1,080 votes    │  │
│  │  3. Lady A         │  │
│  │     875 votes      │  │
│  └────────────────────┘  │
│  (Updates automatically) │
└──────────────────────────┘
```

---

## Implementation Details

### 1. Vote Packages

**Available Packages:**

| Package | Votes | Price (USD) | Discount | Savings | Popular |
|---------|-------|-------------|----------|---------|---------|
| Starter | 10 | $5.00 | 0% | - | No |
| Popular | 50 | $20.00 | 20% | $5.00 | **Yes** |
| Super | 100 | $35.00 | 30% | $15.00 | No |
| Mega | 250 | $75.00 | 40% | $50.00 | No |
| Ultimate | 500 | $125.00 | 50% | $125.00 | No |

**Database Schema:**
```sql
CREATE TABLE vote_packages (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  votes INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  discount NUMERIC(5, 2), -- Percentage
  popular BOOLEAN DEFAULT FALSE,
  savings NUMERIC(10, 2),
  active BOOLEAN DEFAULT TRUE
);
```

### 2. Shopping Cart

**Cart Structure:**
```typescript
interface VotingCart {
  items: CartItem[];
  totalVotes: number;
  totalPrice: number;
  currency: string;
}

interface CartItem {
  id: string; // Unique cart item ID
  artistId: string; // pilot_artists.id
  artistName: string; // Display name
  artistImage: string; // Artist photo
  packageId: string; // vote_packages.id
  packageName: string; // Package display name
  votes: number; // Votes per package
  pricePerPackage: number;
  quantity: number; // How many packages
  totalVotes: number; // votes * quantity
  totalPrice: number; // pricePerPackage * quantity
}
```

**Cart Operations:**
```typescript
// Add item to cart
addItem(item: CartItem): void

// Remove item from cart
removeItem(itemId: string): void

// Update quantity
updateQuantity(itemId: string, quantity: number): void

// Clear entire cart
clearCart(): void
```

**Persistence:**
- Cart saved to `localStorage` as JSON
- Restored on page load
- Survives browser refresh
- Cleared after successful payment

### 3. Artist Ranking System

**Rank Calculation:**
```sql
-- Automatic ranking based on total votes
CREATE FUNCTION update_artist_rankings()
RETURNS VOID AS $$
BEGIN
  WITH ranked_artists AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY total_votes DESC, name ASC
      ) AS new_rank
    FROM pilot_artists
  )
  UPDATE pilot_artists
  SET rank = ranked_artists.new_rank
  FROM ranked_artists
  WHERE pilot_artists.id = ranked_artists.id;
END;
$$ LANGUAGE plpgsql;
```

**Vote Application:**
```sql
CREATE FUNCTION apply_votes_to_artist(
  artist_id UUID,
  vote_count INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- Add votes to artist
  UPDATE pilot_artists
  SET total_votes = total_votes + vote_count
  WHERE id = artist_id;

  -- Recalculate all rankings
  PERFORM update_artist_rankings();
END;
$$ LANGUAGE plpgsql;
```

### 4. Payment Processing

**Payment Flow:**

```typescript
// 1. Create purchase record
const { data: purchase } = await supabase
  .from('vote_purchases')
  .insert({
    email: 'fan@example.com',
    items: cartItems,
    total_votes: 200,
    total_amount: 75.00,
    currency: 'USD',
    payment_status: 'pending',
    payment_reference: 'VOTE-1234567890-ABC',
    payment_method: 'paystack'
  });

// 2. Initialize Paystack payment
const response = await fetch('/api/payments/initialize', {
  method: 'POST',
  body: JSON.stringify({
    email: 'fan@example.com',
    amount: 75.00,
    currency: 'USD',
    type: 'voting',
    metadata: {
      type: 'voting',
      purchaseId: purchase.id,
      items: cartItems,
      totalVotes: 200
    }
  })
});

// 3. Redirect to Paystack
window.location.href = response.data.authorizationUrl;

// 4. Webhook processes payment
// (Handled by /api/webhooks/paystack)
// - Validates signature
// - Updates purchase status
// - Applies votes to artists
// - Triggers ranking update

// 5. User sees confirmation
// (at /payments/verify?reference=VOTE-...)
```

### 5. Real-time Updates

**Supabase Realtime Integration:**

```typescript
// Client-side subscription
const supabase = createClient();

const channel = supabase
  .channel('pilot_artists_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'pilot_artists'
  }, (payload) => {
    // Payload contains updated artist data
    console.log('Artist updated:', payload.new);

    // Re-fetch artists to update UI
    fetchArtists();
  })
  .subscribe();

// Cleanup on unmount
return () => {
  supabase.removeChannel(channel);
};
```

**What Triggers Updates:**
- Any vote purchase completion
- Manual admin updates (if implemented)
- Rank changes
- Vote count changes

### 6. Voting Statistics

**Real-time Stats Display:**

```typescript
interface PilotVotingStats {
  totalVotes: number; // Sum of all votes
  totalRevenue: number; // Sum of all payments
  uniqueVoters: number; // Count of unique emails
  votingEndsAt: string; // Timestamp
  isVotingActive: boolean; // Can vote now?
  timeRemaining: string; // "5 days 3 hours"
  topArtist: {
    id: string;
    name: string;
    votes: number;
  };
}
```

**Calculation:**
```typescript
// Total votes across all artists
const totalVotes = artists.reduce(
  (sum, artist) => sum + artist.totalVotes,
  0
);

// Revenue from completed purchases
const totalRevenue = purchases
  .filter(p => p.payment_status === 'completed')
  .reduce((sum, p) => sum + p.total_amount, 0);

// Unique voters
const uniqueVoters = new Set(
  purchases.map(p => p.email)
).size;

// Time remaining
const votingEndsAt = new Date(config.voting_ends_at);
const now = new Date();
const diffMs = votingEndsAt.getTime() - now.getTime();
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
const diffHours = Math.floor(
  (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
);
```

---

## User Interface

### Main Voting Page (`/pilot-voting`)

**Components:**
1. **Hero Section**
   - Title: "Vote for Your Favorite Artist"
   - Subtitle: Explanation of pilot event
   - Cart button (shows item count)

2. **Voting Stats Cards**
   - Total Votes
   - Total Revenue
   - Unique Voters
   - Time Remaining

3. **Tabs**
   - **All Artists**: Grid of artist cards
   - **Leaderboard**: Top 10 ranked list

4. **Artist Cards** (Grid View)
   - Artist photo
   - Rank badge (Top 3 highlighted)
   - Stage name
   - Genres
   - Total votes
   - "Vote Now" button

5. **Package Selection Modal**
   - Opens when clicking "Vote Now"
   - Shows all 5 packages
   - Highlights popular package
   - Shows savings
   - "Select Package" button

### Artist Detail Page (`/pilot-voting/[slug]`)

**Components:**
1. **Cover Image** (if available)
2. **Profile Section**
   - Artist photo
   - Rank badge
   - Stage name
   - Real name
   - Genres
   - Total votes

3. **About Section**
   - Biography
   - Performance video (if available)
   - Social media links

4. **Voting Sidebar** (Sticky)
   - Current rank display
   - Total votes display
   - "Vote for [Artist]" button
   - Package selection modal

### Shopping Cart Page (`/pilot-voting/cart`)

**Components:**
1. **Cart Items List**
   - Artist photo
   - Artist name
   - Package details
   - Quantity selector
   - Price per item
   - Total votes per item
   - Remove button

2. **Order Summary**
   - Total votes
   - Total items
   - Total price
   - Email input
   - "Proceed to Payment" button

3. **Empty State**
   - "Your cart is empty" message
   - "Back to Voting" button

### Payment Verification Page (`/payments/verify`)

**Components:**
1. **Loading State**
   - Spinner animation
   - "Verifying your payment..." message

2. **Success State**
   - Green checkmark icon
   - Success message
   - Payment details (reference, amount)
   - "Your votes have been applied!" message
   - "Back to Voting" button

3. **Failed State**
   - Red X icon
   - Error message
   - Payment reference
   - "Try Again" button
   - "Back to Voting" button

---

## API Endpoints

### Payment Initialization

```http
POST /api/payments/initialize
Content-Type: application/json

Request:
{
  "email": "fan@example.com",
  "amount": 75.00,
  "currency": "USD",
  "type": "voting",
  "metadata": {
    "type": "voting",
    "purchaseId": "uuid",
    "items": [...],
    "totalVotes": 200,
    "description": "Vote purchase for 2 artist(s)"
  }
}

Response:
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "reference": "VOTE-1234567890-ABC",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "abc123xyz"
  }
}
```

### Payment Verification

```http
GET /api/payments/verify?reference=VOTE-1234567890-ABC

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "VOTE-1234567890-ABC",
    "amount": 75.00,
    "status": "completed",
    "paidAt": "2025-01-01T12:00:00Z",
    "metadata": {
      "type": "voting",
      "totalVotes": 200,
      "items": [...]
    }
  }
}
```

### Webhook Handler

```http
POST /api/webhooks/paystack
Content-Type: application/json
x-paystack-signature: signature_hash

Request:
{
  "event": "charge.success",
  "data": {
    "reference": "VOTE-1234567890-ABC",
    "status": "success",
    "amount": 7500, // In kobo (75.00 USD)
    "currency": "USD",
    "paid_at": "2025-01-01T12:00:00Z",
    "metadata": {
      "type": "voting",
      "items": [
        {
          "artistId": "uuid",
          "totalVotes": 100
        }
      ]
    }
  }
}

Response:
{
  "received": true
}
```

---

## Database Queries

### Fetch Artists with Rankings

```sql
SELECT
  id,
  name,
  slug,
  stage_name,
  bio,
  genre,
  image,
  cover_image,
  social_media,
  total_votes,
  rank,
  created_at,
  updated_at
FROM pilot_artists
ORDER BY rank ASC;
```

### Get Leaderboard

```sql
SELECT
  pa.*,
  (pa.total_votes::FLOAT / NULLIF(
    (SELECT SUM(total_votes) FROM pilot_artists),
    0
  ) * 100) AS percentage
FROM pilot_artists pa
ORDER BY rank ASC
LIMIT 10;
```

### Get User Vote History

```sql
SELECT
  id,
  items,
  total_votes,
  total_amount,
  currency,
  payment_status,
  payment_reference,
  purchased_at
FROM vote_purchases
WHERE email = 'fan@example.com'
  AND payment_status = 'completed'
ORDER BY purchased_at DESC;
```

### Get Voting Statistics

```sql
-- Total votes
SELECT SUM(total_votes) as total
FROM pilot_artists;

-- Total revenue
SELECT SUM(total_amount) as revenue
FROM vote_purchases
WHERE payment_status = 'completed';

-- Unique voters
SELECT COUNT(DISTINCT email) as unique_voters
FROM vote_purchases
WHERE payment_status = 'completed';

-- Leading artist
SELECT stage_name, total_votes
FROM pilot_artists
ORDER BY rank ASC
LIMIT 1;
```

---

## Configuration

### Voting Period

```sql
-- Set voting period
INSERT INTO voting_config (
  voting_ends_at,
  is_voting_active
) VALUES (
  '2025-12-01 00:00:00+00', -- December 1st, 2025
  true
);

-- Update voting period
UPDATE voting_config
SET voting_ends_at = '2025-12-01 00:00:00+00',
    is_voting_active = true
WHERE id = 'config-id';

-- Disable voting
UPDATE voting_config
SET is_voting_active = false;
```

### Add New Artists

```sql
INSERT INTO pilot_artists (
  name,
  slug,
  stage_name,
  bio,
  genre,
  image,
  cover_image,
  performance_video,
  social_media,
  total_votes,
  rank
) VALUES (
  'Artist Name',
  'artist-name',
  'Stage Name',
  'Artist biography...',
  ARRAY['Afrobeats', 'Hip-Hop'],
  'https://images.unsplash.com/...',
  'https://images.unsplash.com/...',
  'https://www.youtube.com/watch?v=...',
  '{"instagram": "https://instagram.com/artist"}'::jsonb,
  0, -- Initial votes
  0  -- Initial rank (will be calculated)
);
```

---

## Testing

### Test Voting Flow

1. **Browse Artists**
   - Visit `/pilot-voting`
   - Verify artist cards display correctly
   - Check leaderboard shows top 10
   - Confirm stats are accurate

2. **Select Package**
   - Click "Vote Now" on an artist
   - Modal opens with packages
   - Select "Popular Pack" (50 votes, $20)
   - Item added to cart

3. **Shopping Cart**
   - Cart icon shows (1) item
   - Navigate to `/pilot-voting/cart`
   - Verify item details correct
   - Try quantity adjustment
   - Add another artist
   - Verify totals update

4. **Checkout**
   - Enter email
   - Click "Proceed to Payment"
   - Purchase record created
   - Redirects to Paystack

5. **Payment (Test Mode)**
   - Use test card: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`
   - OTP: `123456`
   - Complete payment

6. **Webhook**
   - Check webhook received
   - Verify signature validation
   - Confirm votes applied
   - Rankings updated

7. **Confirmation**
   - Redirected to `/payments/verify`
   - Success message displays
   - Payment details shown
   - Cart cleared

8. **Real-time Update**
   - Open second browser tab
   - Navigate to `/pilot-voting`
   - Verify leaderboard updates automatically
   - Check vote counts match

---

## Security Considerations

### Payment Security
- ✅ Webhook signature validation
- ✅ Secret keys in environment variables
- ✅ HTTPS-only communication
- ✅ No sensitive data in client code

### Data Security
- ✅ Row Level Security (RLS) policies
- ✅ Users can only view own purchases
- ✅ Payment references are unique
- ✅ SQL injection prevention (parameterized queries)

### Rate Limiting
- ⚠️ Consider implementing rate limits for:
  - Cart operations
  - Payment initialization
  - API calls

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Voting Metrics**
   - Total votes purchased (per day/week)
   - Average votes per transaction
   - Popular vote packages
   - Peak voting times

2. **Revenue Metrics**
   - Total revenue
   - Average transaction value
   - Revenue by payment method
   - Conversion rate (visits → purchases)

3. **Artist Metrics**
   - Votes per artist
   - Rank changes over time
   - Most supported artists
   - Geographic distribution of support

4. **Technical Metrics**
   - Payment success rate
   - Webhook delivery rate
   - API response times
   - Real-time connection count

---

## Troubleshooting

### Common Issues

**Cart not persisting**
- Check localStorage is enabled
- Verify JSON serialization working
- Clear localStorage and try again

**Votes not applying**
- Check webhook received (Paystack dashboard)
- Verify payment status is "completed"
- Check database function `apply_votes_to_artist` executed
- Review application logs

**Real-time updates not working**
- Verify Supabase Realtime is enabled
- Check subscription is active
- Review browser console for errors
- Test with simple SQL update

**Payment failing**
- Verify Paystack secret key is correct
- Check amount is in correct format (kobo/cents)
- Review Paystack webhook logs
- Test with Paystack test cards

---

## Future Enhancements

### Phase 2
- [ ] Email notifications after vote purchase
- [ ] Vote history page for users
- [ ] Artist thank you messages
- [ ] Social sharing ("I voted for...")
- [ ] Voting milestones/achievements

### Phase 3
- [ ] Multiple voting campaigns
- [ ] Category-based voting (Best Male, Best Female, etc.)
- [ ] Fan comments/messages with votes
- [ ] Leaderboard animations
- [ ] Export voting results

---

**Last Updated**: January 2025
**Status**: ✅ **FULLY IMPLEMENTED**
**Version**: 1.0
