# Caching Configuration Guide

This document explains the caching strategy implemented in the application and how to properly use it.

## Problem: "Auto No Cache" Error

### Why Next.js Disables Caching

Next.js automatically disables caching when:

1. **Using `cookies()` function** - Reading or writing cookies forces dynamic rendering
2. **Using `headers()` function** - Accessing request headers forces dynamic rendering
3. **Middleware runs on every request** - Our Supabase middleware reads cookies for authentication
4. **Dynamic segments without proper configuration** - Routes with `[params]` without cache config

### The Solution

We've implemented a **dual-client strategy**:

#### 1. **Cookie-based Client** (for authenticated requests)
- **File**: `utils/supabase/server.ts`
- **When to use**: Authentication, user-specific data, admin routes
- **Caching**: Cannot be cached (dynamic)

```typescript
import { createClient } from '@/utils/supabase/server'

// This will force dynamic rendering
const supabase = await createClient()
```

#### 2. **Cache-friendly Client** (for public data)
- **File**: `utils/supabase/server-cached.ts`
- **When to use**: Public data, leaderboards, events, articles
- **Caching**: Can be cached with ISR or static generation

```typescript
import { createCachedClient } from '@/utils/supabase/server-cached'

// This is cache-friendly
const supabase = createCachedClient()
```

## Implementation Examples

### 1. Server Components with ISR

```typescript
import { createCachedClient } from '@/utils/supabase/server-cached'
import { unstable_cache } from 'next/cache'

// Enable ISR with 30-second revalidation
export const revalidate = 30

export async function getData() {
  const supabase = createCachedClient()
  const { data } = await supabase.from('table').select('*')
  return data
}
```

### 2. API Routes with Caching

For **GET requests** (public data):

```typescript
import { createCachedClient } from '@/utils/supabase/server-cached'

// Enable caching
export const dynamic = 'force-static'
export const revalidate = 300

export async function GET(request: NextRequest) {
  const supabase = createCachedClient()

  // ... fetch data

  const response = NextResponse.json(data)

  // Add cache headers
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  )

  return response
}
```

For **POST/PUT/DELETE requests** (never cache):

```typescript
import { createClient } from '@/utils/supabase/server'

// Disable caching for mutations
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // ... handle mutation

  const response = NextResponse.json(data)

  // Add no-cache headers
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  )

  return response
}
```

### 3. Using `unstable_cache` for Fine-grained Control

```typescript
import { unstable_cache } from 'next/cache'

const getCachedData = unstable_cache(
  async () => {
    const supabase = createCachedClient()
    const { data } = await supabase.from('table').select('*')
    return data
  },
  ['cache-key'], // Unique cache key
  {
    revalidate: 30, // Revalidate every 30 seconds
    tags: ['data'], // Tag for on-demand revalidation
  }
)
```

## Route Segment Config Options

### `export const dynamic`
- `'auto'` (default) - Let Next.js decide based on usage
- `'force-dynamic'` - Always render dynamically (no cache)
- `'force-static'` - Always generate statically
- `'error'` - Force static but error if dynamic

### `export const revalidate`
- `false` - Cache indefinitely
- `0` - Never cache
- `number` - Revalidate after N seconds

### `export const fetchCache`
- `'auto'` (default) - Use cache when possible
- `'default-cache'` - Cache fetch requests
- `'only-cache'` - Only use cache
- `'force-cache'` - Force caching
- `'force-no-store'` - Never cache

## Cache Headers Explained

### Public Data (CDN-friendly)
```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```
- `public` - Can be cached by CDNs and browsers
- `s-maxage=300` - CDN caches for 5 minutes
- `stale-while-revalidate=600` - Serve stale content for 10 min while revalidating

### Private Data (user-specific)
```
Cache-Control: private, max-age=60
```
- `private` - Only browser caches, not CDNs
- `max-age=60` - Cache for 1 minute

### No Cache (mutations, sensitive data)
```
Cache-Control: no-store, no-cache, must-revalidate, private
```
- `no-store` - Don't cache at all
- `no-cache` - Revalidate before using cached version
- `must-revalidate` - Must revalidate stale responses
- `private` - Only browser can cache

## Current Implementation

### Pages Using Cache-friendly Client
- ✅ `/events/[slug]/leaderboard` - ISR with 30s revalidation

### API Routes Using Cache-friendly Client
- ✅ `/api/events` - Cached for 5 minutes

### Pages/Routes That Must Stay Dynamic
- `/admin/*` - Requires authentication
- `/api/otp/*` - Sensitive operations
- `/api/payments/*` - Transactional data
- `/api/votes/*` - Real-time voting

## Testing Cache Behavior

### In Development
```bash
npm run dev
# Cache is disabled in dev mode
```

### In Production
```bash
npm run build
npm start
# Check logs for cache hits/misses
```

### Vercel Deployment
- View cache status in Vercel dashboard
- Check response headers in browser DevTools
- Use Vercel Speed Insights

## On-Demand Revalidation

To revalidate cache on-demand (e.g., after voting):

```typescript
import { revalidateTag, revalidatePath } from 'next/cache'

// Revalidate by tag
revalidateTag('leaderboard')

// Revalidate by path
revalidatePath('/events/[slug]/leaderboard')
```

## Best Practices

1. **Use cached client for public data** - Don't force dynamic rendering unnecessarily
2. **Set appropriate revalidation times** - Balance freshness vs. performance
3. **Use tags for on-demand revalidation** - Update cache when data changes
4. **Add proper cache headers** - Help CDNs cache effectively
5. **Test in production mode** - Dev mode has different caching behavior
6. **Monitor cache hit rates** - Optimize based on actual usage

## Troubleshooting

### Still seeing "auto no cache"?
1. Check if you're using `cookies()` or `headers()`
2. Verify you're using `createCachedClient()` not `createClient()`
3. Ensure `export const dynamic` is set correctly
4. Check middleware isn't forcing dynamic rendering

### Data not updating?
1. Lower `revalidate` time
2. Implement on-demand revalidation
3. Check if `force-static` is appropriate

### Getting stale data?
1. Add `stale-while-revalidate` header
2. Implement optimistic updates
3. Use on-demand revalidation after mutations

## References

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
