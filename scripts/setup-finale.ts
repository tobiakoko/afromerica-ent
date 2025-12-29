/**
 * Finale Voting System Setup Script
 *
 * This script helps you initialize the finale voting system for an event.
 *
 * Usage:
 *   tsx scripts/setup-finale.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('\n===========================================')
  console.log('  FINALE VOTING SYSTEM SETUP')
  console.log('===========================================\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Step 1: Select Event
  console.log('Step 1: Select Event\n')
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, title, slug, event_date')
    .eq('is_active', true)
    .order('event_date', { ascending: false })

  if (eventsError || !events || events.length === 0) {
    console.error('No active events found')
    process.exit(1)
  }

  console.log('Available events:')
  events.forEach((event, index) => {
    console.log(
      `  ${index + 1}. ${event.title} (${new Date(event.event_date).toLocaleDateString()})`
    )
  })

  const eventIndex = parseInt(await question('\nSelect event number: ')) - 1
  const selectedEvent = events[eventIndex]

  if (!selectedEvent) {
    console.error('Invalid event selection')
    process.exit(1)
  }

  console.log(`\n✓ Selected: ${selectedEvent.title}`)

  // Step 2: Check if finale already exists
  const { data: existingConfig } = await supabase
    .from('finale_configs')
    .select('*')
    .eq('event_id', selectedEvent.id)
    .single()

  if (existingConfig) {
    const overwrite = await question(
      '\n Finale configuration already exists. Overwrite? (yes/no): '
    )
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.')
      rl.close()
      return
    }
  }

  // Step 3: Automatically get top 10 artists from leaderboard
  console.log('\n\nStep 2: Getting Top 10 Contestants from Leaderboard\n')
  const { data: topArtists, error: artistsError } = await supabase
    .from('artist_leaderboard')
    .select('id, name, stage_name, photo_url, rank, total_votes')
    .order('rank', { ascending: true, nullsFirst: false })
    .limit(10)

  if (artistsError || !topArtists || topArtists.length === 0) {
    console.error('Error fetching top artists from leaderboard:', artistsError?.message)
    process.exit(1)
  }

  console.log('Top 10 Artists from Leaderboard:')
  console.log('-------------------------------------------')
  topArtists.forEach((artist, index) => {
    const displayName = artist.stage_name || artist.name
    console.log(
      `  ${index + 1}. ${displayName} (Rank: ${artist.rank}, Votes: ${artist.total_votes})`
    )
  })

  const contestants: Array<{ artist_id: string; number: number }> = topArtists.map(
    (artist, index) => ({
      artist_id: artist.id,
      number: index + 1, // Contestant numbers 1-10 based on leaderboard position
    })
  )

  console.log(`\n✓ Automatically selected ${contestants.length} contestants based on leaderboard ranking`)

  // Step 4: Create Judge Voters
  console.log('\n\nStep 3: Create Judge Voters\n')

  const numJudges = 3
  const judgeNames = []
  for (let i = 1; i <= numJudges; i++) {
    const name = await question(`Enter name for Judge ${i}: `)
    judgeNames.push(name || `Judge ${i}`)
  }

  console.log('\n\nStep 4: Confirm Setup\n')
  console.log('===========================================')
  console.log(`Event: ${selectedEvent.title}`)
  console.log(`Contestants: ${contestants.length} (auto-selected from top 10 leaderboard)`)
  console.log(`Judges: ${numJudges}`)
  console.log(`In-house Audience: Dynamic (voters register as they join)`)
  console.log(`Online Viewers: Dynamic (voters register as they join)`)
  console.log('===========================================\n')

  const confirm = await question('Proceed with setup? (yes/no): ')
  if (confirm.toLowerCase() !== 'yes') {
    console.log('Setup cancelled.')
    rl.close()
    return
  }

  console.log('\n\nSetting up finale voting system...\n')

  // Create finale config
  console.log('Creating finale configuration...')

  if (existingConfig) {
    // Update existing config
    const { error: configError } = await supabase
      .from('finale_configs')
      .update({
        current_status: 'upcoming',
        current_stage: null,
        voting_enabled: false,
        leaderboard_visible: true,
      })
      .eq('event_id', selectedEvent.id)

    if (configError) {
      console.error('Error updating config:', configError.message)
      process.exit(1)
    }
    console.log('✓ Configuration updated')
  } else {
    // Create new config
    const { error: configError } = await supabase
      .from('finale_configs')
      .insert({
        event_id: selectedEvent.id,
        current_status: 'upcoming',
        current_stage: null,
        voting_enabled: false,
        leaderboard_visible: true,
      })

    if (configError) {
      console.error('Error creating config:', configError.message)
      process.exit(1)
    }
    console.log('✓ Configuration created')
  }

  // Delete existing contestants if overwriting
  if (existingConfig) {
    await supabase
      .from('finale_contestants')
      .delete()
      .eq('event_id', selectedEvent.id)
  }

  // Create contestants
  console.log('\nCreating contestants...')
  const contestantsData = contestants.map((c) => ({
    event_id: selectedEvent.id,
    artist_id: c.artist_id,
    contestant_number: c.number,
    is_active: true,
    is_finalist: false,
  }))

  const { error: contestantsError } = await supabase
    .from('finale_contestants')
    .insert(contestantsData)

  if (contestantsError) {
    console.error('Error creating contestants:', contestantsError.message)
    process.exit(1)
  }
  console.log(`✓ Created ${contestants.length} contestants`)

  // Delete existing voters if overwriting
  if (existingConfig) {
    await supabase.from('finale_voters').delete().eq('event_id', selectedEvent.id)
  }

  // Generate shared voter codes for in-house and online voters
  const { data: inHouseCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: selectedEvent.id,
  })

  const { data: onlineCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: selectedEvent.id,
  })

  // Create judges
  console.log('\nCreating judges...')
  const judgesData = judgeNames.map((name, index) => ({
    event_id: selectedEvent.id,
    name: name,
    voter_code: '', // Will be generated by function
    voter_type: 'judge',
    judge_number: index + 1,
  }))

  for (const judge of judgesData) {
    const { data: voterCodeData } = await supabase.rpc('generate_finale_voter_code', {
      p_voter_type: 'judge',
      p_event_id: selectedEvent.id,
    })
    const { error: judgeError } = await supabase
      .from('finale_voters')
      .insert({ ...judge, voter_code: voterCodeData })

    if (judgeError) {
      console.error('Error creating judge:', judgeError.message)
    }
  }
  console.log(`✓ Created ${numJudges} judges`)

  console.log('\n✓ In-house audience and online viewers will register dynamically during the event')

  // Fetch and display judge voter codes
  console.log('\n\n===========================================')
  console.log('  SETUP COMPLETE!')
  console.log('===========================================\n')

  const { data: judges } = await supabase
    .from('finale_voters')
    .select('name, voter_code, judge_number')
    .eq('event_id', selectedEvent.id)
    .eq('voter_type', 'judge')
    .order('judge_number')

  console.log('JUDGE VOTER CODES:')
  console.log('-------------------------------------------')
  judges?.forEach((judge) => {
    console.log(`${judge.name}: ${judge.voter_code}`)
  })

  console.log('\n\nSHARED VOTER CODES:')
  console.log('-------------------------------------------')
  console.log(`In-house Audience: ${inHouseCode}`)
  console.log(`Online Viewers: ${onlineCode}`)

  console.log('\n\nNEXT STEPS:')
  console.log('1. Distribute unique judge voter codes to judges')
  console.log('2. Share in-house code with all in-house audience members')
  console.log('3. Share online code with all online viewers')
  console.log('4. Use admin interface to activate Stage 1')
  console.log('5. Enable voting when ready')
  console.log(`6. Access finale at: /events/${selectedEvent.slug}/finale`)

  rl.close()
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
