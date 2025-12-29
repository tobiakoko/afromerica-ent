#!/usr/bin/env tsx

/**
 * Test Admin Finale Data Fetch
 *
 * This script tests if the admin client can fetch events with finale configs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testAdminFetch() {
  console.log('🔍 Testing Admin Client Finale Data Fetch...\n')

  // Test the exact query used in the admin page
  const { data: events, error: eventsError } = await adminClient
    .from('events')
    .select(
      `
      id,
      title,
      slug,
      event_date,
      finale_configs!finale_configs_event_id_fkey (
        id,
        event_id,
        current_status,
        current_stage,
        voting_enabled,
        leaderboard_visible,
        stage_1_started_at,
        stage_1_ended_at,
        stage_2_started_at,
        stage_2_ended_at,
        stage_3_started_at,
        stage_3_ended_at,
        stage_4_started_at,
        stage_4_ended_at,
        top_5_calculated_at,
        top_5_contestant_ids,
        settings,
        created_at,
        updated_at
      )
    `
    )
    .eq('is_active', true)
    .order('event_date', { ascending: false })

  if (eventsError) {
    console.error('❌ Error fetching events:')
    console.error(JSON.stringify(eventsError, null, 2))
    process.exit(1)
  }

  console.log(`✅ Successfully fetched ${events?.length || 0} events\n`)

  if (!events || events.length === 0) {
    console.log('⚠️  No events found')
    return
  }

  // Display events
  events.forEach((event: any) => {
    console.log(`📅 Event: ${event.title}`)
    console.log(`   ID: ${event.id}`)
    console.log(`   Slug: ${event.slug}`)
    console.log(`   Date: ${event.event_date}`)

    // Handle both array and object responses from PostgREST
    const finaleConfig = Array.isArray(event.finale_configs)
      ? event.finale_configs[0]
      : event.finale_configs

    if (finaleConfig && finaleConfig.id) {
      console.log(`   ✅ HAS FINALE CONFIG:`)
      console.log(`      Status: ${finaleConfig.current_status}`)
      console.log(`      Stage: ${finaleConfig.current_stage || 'Not started'}`)
      console.log(`      Voting: ${finaleConfig.voting_enabled ? 'Enabled' : 'Disabled'}`)
      console.log(`      Leaderboard: ${finaleConfig.leaderboard_visible ? 'Visible' : 'Hidden'}`)
    } else {
      console.log(`   ❌ NO FINALE CONFIG`)
    }
    console.log()
  })

  // Separate check for events with finale
  const eventsWithFinale = events.filter((e: any) => {
    const config = Array.isArray(e.finale_configs) ? e.finale_configs[0] : e.finale_configs
    return config && config.id
  })
  const eventsWithoutFinale = events.filter((e: any) => {
    const config = Array.isArray(e.finale_configs) ? e.finale_configs[0] : e.finale_configs
    return !config || !config.id
  })

  console.log(`📊 Summary:`)
  console.log(`   Total events: ${events.length}`)
  console.log(`   With finale config: ${eventsWithFinale.length}`)
  console.log(`   Without finale config: ${eventsWithoutFinale.length}`)
}

testAdminFetch().catch(console.error)
