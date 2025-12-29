#!/usr/bin/env tsx

/**
 * Check Finale Data in Database
 *
 * This script checks what data exists for the finale voting system
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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkFinaleData() {
  console.log('🔍 Checking Finale Voting Data...\n')

  // Check Events
  console.log('📅 EVENTS:')
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, title, slug, event_date, is_active')
    .order('event_date', { ascending: false })

  if (eventsError) {
    console.error('❌ Error fetching events:', eventsError)
  } else {
    console.log(`   Total events: ${events?.length || 0}`)
    console.log(`   Active events: ${events?.filter(e => e.is_active).length || 0}`)
    events?.slice(0, 3).forEach(e => {
      console.log(`   - ${e.title} (${e.slug}) - ${e.is_active ? 'Active' : 'Inactive'}`)
    })
  }

  // Check Finale Configs
  console.log('\n⚙️  FINALE CONFIGS:')
  const { data: configs, error: configsError } = await supabase
    .from('finale_configs')
    .select(`
      id,
      event_id,
      current_status,
      current_stage,
      voting_enabled,
      events (title)
    `)

  if (configsError) {
    console.error('❌ Error fetching configs:', configsError)
  } else {
    console.log(`   Total configs: ${configs?.length || 0}`)
    configs?.forEach(c => {
      const event = (c as any).events
      console.log(`   - ${event?.title || 'Unknown Event'}:`)
      console.log(`     Status: ${c.current_status}`)
      console.log(`     Stage: ${c.current_stage || 'Not started'}`)
      console.log(`     Voting: ${c.voting_enabled ? 'Enabled' : 'Disabled'}`)
    })
  }

  // Check Finale Contestants
  console.log('\n🎤 FINALE CONTESTANTS:')
  const { data: contestants, error: contestantsError } = await supabase
    .from('finale_contestants')
    .select(`
      id,
      contestant_number,
      is_active,
      is_finalist,
      is_eliminated,
      artist:artists (name, stage_name),
      event:events (title)
    `)
    .order('contestant_number', { ascending: true })

  if (contestantsError) {
    console.error('❌ Error fetching contestants:', contestantsError)
  } else {
    console.log(`   Total contestants: ${contestants?.length || 0}`)
    console.log(`   Active: ${contestants?.filter(c => c.is_active).length || 0}`)
    console.log(`   Finalists: ${contestants?.filter(c => c.is_finalist).length || 0}`)
    console.log(`   Eliminated: ${contestants?.filter(c => c.is_eliminated).length || 0}`)

    // Group by event
    const byEvent = contestants?.reduce((acc: any, c: any) => {
      const eventTitle = c.event?.title || 'Unknown'
      if (!acc[eventTitle]) acc[eventTitle] = []
      acc[eventTitle].push(c)
      return acc
    }, {})

    Object.entries(byEvent || {}).forEach(([event, list]: [string, any]) => {
      console.log(`\n   Event: ${event}`)
      list.slice(0, 5).forEach((c: any) => {
        const artist = c.artist
        console.log(`     #${c.contestant_number}: ${artist?.name || artist?.stage_name || 'Unknown'}`)
      })
      if (list.length > 5) {
        console.log(`     ... and ${list.length - 5} more`)
      }
    })
  }

  // Check Finale Voters
  console.log('\n👥 FINALE VOTERS:')
  const { data: voters, error: votersError } = await supabase
    .from('finale_voters')
    .select('id, name, voter_type, is_active, event:events (title)')

  if (votersError) {
    console.error('❌ Error fetching voters:', votersError)
  } else {
    const judges = voters?.filter(v => v.voter_type === 'judge') || []
    const inHouse = voters?.filter(v => v.voter_type === 'in_house') || []
    const online = voters?.filter(v => v.voter_type === 'online') || []

    console.log(`   Total voters: ${voters?.length || 0}`)
    console.log(`   Judges: ${judges.length}`)
    console.log(`   In-House: ${inHouse.length}`)
    console.log(`   Online: ${online.length}`)
  }

  // Check Votes
  console.log('\n🗳️  VOTES:')
  const { data: judgeVotes, error: judgeVotesError } = await supabase
    .from('finale_judge_votes')
    .select('id, stage')

  const { data: audienceVotes, error: audienceVotesError } = await supabase
    .from('finale_audience_votes')
    .select('id, stage, voter_type')

  if (!judgeVotesError && !audienceVotesError) {
    console.log(`   Judge votes: ${judgeVotes?.length || 0}`)
    console.log(`   Audience votes: ${audienceVotes?.length || 0}`)
    console.log(`   Total votes: ${(judgeVotes?.length || 0) + (audienceVotes?.length || 0)}`)
  }

  // Check Leaderboard Snapshots
  console.log('\n📊 LEADERBOARD SNAPSHOTS:')
  const { data: snapshots, error: snapshotsError } = await supabase
    .from('finale_leaderboard_snapshots')
    .select('id, stage')

  if (snapshotsError) {
    console.error('❌ Error fetching snapshots:', snapshotsError)
  } else {
    const byStage = snapshots?.reduce((acc: any, s) => {
      acc[s.stage] = (acc[s.stage] || 0) + 1
      return acc
    }, {})

    console.log(`   Total snapshots: ${snapshots?.length || 0}`)
    Object.entries(byStage || {}).forEach(([stage, count]) => {
      console.log(`   ${stage}: ${count}`)
    })
  }

  console.log('\n✅ Data check complete!')
}

checkFinaleData().catch(console.error)
