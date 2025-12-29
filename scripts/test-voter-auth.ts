/**
 * Test voter authentication and registration
 * Usage: tsx scripts/test-voter-auth.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
import { config } from 'dotenv'
import { resolve } from 'path'

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
  console.log('  TEST VOTER AUTHENTICATION')
  console.log('===========================================\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get events
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

  console.log(`\n✓ Selected: ${selectedEvent.title}\n`)

  // Get codes for this event
  const { data: inHouseCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: selectedEvent.id,
  })

  const { data: onlineCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: selectedEvent.id,
  })

  console.log('Event Codes:')
  console.log(`  In-house: ${inHouseCode}`)
  console.log(`  Online: ${onlineCode}\n`)

  // Test in-house voter registration
  console.log('Testing in-house voter registration...')
  const testInHouseName = 'Test In-House Voter'

  const { data: inHouseVoter, error: inHouseError } = await supabase
    .from('finale_voters')
    .insert({
      event_id: selectedEvent.id,
      name: testInHouseName,
      voter_code: inHouseCode,
      voter_type: 'in_house',
      is_active: true,
      judge_number: null,
      email: null,
      phone: null,
    })
    .select()
    .single()

  if (inHouseError) {
    console.error('❌ In-house voter creation failed:', inHouseError.message)
    console.error('   Details:', inHouseError.details || inHouseError.hint)
  } else {
    console.log('✅ In-house voter created successfully')
    console.log(`   ID: ${inHouseVoter.id}`)
    console.log(`   Name: ${inHouseVoter.name}`)
    console.log(`   Code: ${inHouseVoter.voter_code}`)
  }

  // Test online voter registration
  console.log('\nTesting online voter registration...')
  const testOnlineName = 'Test Online Voter'

  const { data: onlineVoter, error: onlineError } = await supabase
    .from('finale_voters')
    .insert({
      event_id: selectedEvent.id,
      name: testOnlineName,
      voter_code: onlineCode,
      voter_type: 'online',
      is_active: true,
      judge_number: null,
      email: null,
      phone: null,
    })
    .select()
    .single()

  if (onlineError) {
    console.error('❌ Online voter creation failed:', onlineError.message)
    console.error('   Details:', onlineError.details || onlineError.hint)
  } else {
    console.log('✅ Online voter created successfully')
    console.log(`   ID: ${onlineVoter.id}`)
    console.log(`   Name: ${onlineVoter.name}`)
    console.log(`   Code: ${onlineVoter.voter_code}`)
  }

  // Clean up test voters
  if (inHouseVoter) {
    await supabase.from('finale_voters').delete().eq('id', inHouseVoter.id)
    console.log('\n✓ Cleaned up test in-house voter')
  }

  if (onlineVoter) {
    await supabase.from('finale_voters').delete().eq('id', onlineVoter.id)
    console.log('✓ Cleaned up test online voter')
  }

  console.log('\n===========================================\n')

  rl.close()
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
