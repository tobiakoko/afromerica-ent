/**
 * Test script to verify voter code generation
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get first event
  const { data: events } = await supabase
    .from('events')
    .select('id, title, slug')
    .eq('is_active', true)
    .limit(1)

  if (!events || events.length === 0) {
    console.error('No events found')
    process.exit(1)
  }

  const event = events[0]
  console.log(`\nTesting with event: ${event.title}`)
  console.log(`Event ID: ${event.id}\n`)

  // Generate codes
  const { data: inHouseCode, error: inHouseError } = await supabase.rpc(
    'generate_finale_voter_code',
    {
      p_voter_type: 'in_house',
      p_event_id: event.id,
    }
  )

  const { data: onlineCode, error: onlineError } = await supabase.rpc(
    'generate_finale_voter_code',
    {
      p_voter_type: 'online',
      p_event_id: event.id,
    }
  )

  const { data: judgeCode, error: judgeError } = await supabase.rpc(
    'generate_finale_voter_code',
    {
      p_voter_type: 'judge',
      p_event_id: event.id,
    }
  )

  if (inHouseError) console.error('In-house error:', inHouseError)
  if (onlineError) console.error('Online error:', onlineError)
  if (judgeError) console.error('Judge error:', judgeError)

  console.log('Generated Codes:')
  console.log('-------------------------------------------')
  console.log(`In-house: ${inHouseCode}`)
  console.log(`Online: ${onlineCode}`)
  console.log(`Judge: ${judgeCode}`)
  console.log('-------------------------------------------\n')

  // Test consistency - generate again to verify deterministic codes
  const { data: inHouseCode2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: event.id,
  })

  const { data: onlineCode2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: event.id,
  })

  console.log('Consistency Check (should be the same):')
  console.log('-------------------------------------------')
  console.log(`In-house 1: ${inHouseCode}`)
  console.log(`In-house 2: ${inHouseCode2}`)
  console.log(`Match: ${inHouseCode === inHouseCode2} ✓\n`)

  console.log(`Online 1: ${onlineCode}`)
  console.log(`Online 2: ${onlineCode2}`)
  console.log(`Match: ${onlineCode === onlineCode2} ✓`)
  console.log('-------------------------------------------\n')

  // Check if any voters exist
  const { data: voters } = await supabase
    .from('finale_voters')
    .select('voter_code, voter_type, name')
    .eq('event_id', event.id)

  console.log(`Existing voters for this event: ${voters?.length || 0}`)
  if (voters && voters.length > 0) {
    console.log('-------------------------------------------')
    voters.forEach((v) => {
      console.log(`${v.voter_type}: ${v.name} (${v.voter_code})`)
    })
  }
}

main().catch(console.error)
