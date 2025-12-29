/**
 * Get voter codes for a specific event
 * Usage: tsx scripts/get-event-codes.ts
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
  console.log('  GET FINALE VOTER CODES')
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

  // Check if finale exists
  const { data: config } = await supabase
    .from('finale_configs')
    .select('*')
    .eq('event_id', selectedEvent.id)
    .single()

  if (!config) {
    console.log('❌ No finale configuration found for this event')
    console.log('   Run: npm run setup-finale')
    rl.close()
    return
  }

  // Generate shared codes
  const { data: inHouseCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: selectedEvent.id,
  })

  const { data: onlineCode } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: selectedEvent.id,
  })

  // Get judges
  const { data: judges } = await supabase
    .from('finale_voters')
    .select('name, voter_code, judge_number')
    .eq('event_id', selectedEvent.id)
    .eq('voter_type', 'judge')
    .order('judge_number')

  console.log('===========================================')
  console.log('  FINALE VOTER CODES')
  console.log('===========================================\n')

  console.log('JUDGE CODES:')
  console.log('-------------------------------------------')
  if (judges && judges.length > 0) {
    judges.forEach((judge) => {
      console.log(`${judge.name}: ${judge.voter_code}`)
    })
  } else {
    console.log('No judges configured')
  }

  console.log('\n\nSHARED CODES:')
  console.log('-------------------------------------------')
  console.log(`In-house Audience: ${inHouseCode}`)
  console.log(`Online Viewers: ${onlineCode}`)

  console.log('\n\nEVENT URL:')
  console.log('-------------------------------------------')
  console.log(`https://yoursite.com/events/${selectedEvent.slug}/finale`)

  console.log('\n===========================================\n')

  rl.close()
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
