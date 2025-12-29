#!/usr/bin/env tsx

/**
 * Debug Leaderboard Page Finale Config Fetch
 *
 * This script tests if the public client can fetch finale configs
 * to diagnose why the leaderboard page shows "Finale Not Configured"
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  process.exit(1)
}

// Create public client (same as used in the page)
const publicClient = createClient(supabaseUrl, supabaseAnonKey)

async function debugLeaderboardPage() {
  console.log('🔍 Debugging Leaderboard Page Finale Config Fetch...\n')

  const slug = 'december-showcase-2025'

  // Step 1: Fetch event (same as page does)
  console.log('Step 1: Fetching event by slug...')
  const { data: event, error: eventError } = await publicClient
    .from('events')
    .select('id, title, slug, event_date, venue, city')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (eventError) {
    console.error('❌ Error fetching event:')
    console.error(JSON.stringify(eventError, null, 2))
    process.exit(1)
  }

  if (!event) {
    console.error('❌ Event not found')
    process.exit(1)
  }

  console.log('✅ Event found:')
  console.log(`   ID: ${event.id}`)
  console.log(`   Title: ${event.title}`)
  console.log(`   Slug: ${event.slug}\n`)

  // Step 2: Fetch finale config (same as page does)
  console.log('Step 2: Fetching finale config...')
  console.log(`   Query: finale_configs WHERE event_id = '${event.id}'`)

  const { data: finaleConfig, error: finaleError } = await publicClient
    .from('finale_configs')
    .select('*')
    .eq('event_id', event.id)
    .single()

  console.log('\nQuery Result:')
  console.log('   Data:', finaleConfig ? 'Found' : 'NULL')
  console.log('   Error:', finaleError || 'None')

  if (finaleError) {
    console.error('\n❌ Error fetching finale config:')
    console.error('   Message:', finaleError.message)
    console.error('   Details:', finaleError.details)
    console.error('   Hint:', finaleError.hint)
    console.error('   Code:', finaleError.code)
    console.error('\n   Full error:', JSON.stringify(finaleError, null, 2))
  }

  if (!finaleConfig) {
    console.error('\n❌ Finale config not found')
    console.error('   The page will show "Finale Not Configured" message')

    // Try alternative query without .single()
    console.log('\n🔍 Trying alternative query without .single()...')
    const { data: configs, error: configsError } = await publicClient
      .from('finale_configs')
      .select('*')
      .eq('event_id', event.id)

    console.log('   Result:', configs?.length || 0, 'rows')
    if (configsError) {
      console.error('   Error:', JSON.stringify(configsError, null, 2))
    } else if (configs && configs.length > 0) {
      console.log('\n✅ Found configs when not using .single()!')
      console.log('   Config:', JSON.stringify(configs[0], null, 2))
    }
  } else {
    console.log('\n✅ Finale config found:')
    console.log('   ID:', finaleConfig.id)
    console.log('   Status:', finaleConfig.current_status)
    console.log('   Stage:', finaleConfig.current_stage || 'Not started')
    console.log('   Voting:', finaleConfig.voting_enabled ? 'Enabled' : 'Disabled')
    console.log('   Leaderboard:', finaleConfig.leaderboard_visible ? 'Visible' : 'Hidden')
  }

  // Step 3: Check RLS policies
  console.log('\n\nStep 3: Checking if RLS is the issue...')
  console.log('   Testing direct count query...')

  const { count, error: countError } = await publicClient
    .from('finale_configs')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)

  console.log('   Count:', count)
  console.log('   Error:', countError ? JSON.stringify(countError, null, 2) : 'None')
}

debugLeaderboardPage().catch(console.error)
