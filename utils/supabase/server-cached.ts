import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for cached/public data fetching
 * This client does NOT use cookies, making it cache-friendly
 * Use this for public data that doesn't require authentication
 */
export function createCachedClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
