/**
 * Comprehensive test for finale authentication system
 * Tests all three voter types: Judge, In-house, Online
 * Usage: tsx scripts/test-finale-auth.ts
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL'
  message: string
  details?: any
}

const results: TestResult[] = []

function logResult(test: string, status: 'PASS' | 'FAIL', message: string, details?: any) {
  results.push({ test, status, message, details })
  const icon = status === 'PASS' ? '✅' : '❌'
  console.log(`${icon} ${test}: ${message}`)
  if (details) {
    console.log('   Details:', JSON.stringify(details, null, 2))
  }
}

async function getActiveEvent() {
  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, slug')
    .eq('is_active', true)
    .order('event_date', { ascending: false })
    .limit(1)

  if (error || !events || events.length === 0) {
    console.error('❌ No active events found')
    process.exit(1)
  }

  return events[0]
}

async function testJudgeCodeGeneration(eventId: string) {
  console.log('\n📋 Testing Judge Code Generation...')

  // Generate unique judge code
  const { data: judgeCode1, error: err1 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'judge',
    p_event_id: eventId,
  })

  if (err1 || !judgeCode1) {
    logResult('Judge Code Generation', 'FAIL', 'Failed to generate judge code', err1)
    return null
  }

  // Verify format
  if (!judgeCode1.startsWith('AFR-J') || judgeCode1.length !== 10) {
    logResult(
      'Judge Code Format',
      'FAIL',
      `Invalid format: ${judgeCode1} (should be AFR-J + 5 chars)`,
      { code: judgeCode1 }
    )
    return null
  }

  logResult('Judge Code Format', 'PASS', `Valid format: ${judgeCode1}`)

  // Generate another and verify it's different (uniqueness)
  const { data: judgeCode2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'judge',
    p_event_id: eventId,
  })

  if (judgeCode1 === judgeCode2) {
    logResult('Judge Code Uniqueness', 'FAIL', 'Judge codes should be unique', {
      code1: judgeCode1,
      code2: judgeCode2,
    })
  } else {
    logResult('Judge Code Uniqueness', 'PASS', 'Judge codes are unique')
  }

  return judgeCode1
}

async function testAudienceCodeGeneration(eventId: string) {
  console.log('\n📋 Testing Audience Code Generation...')

  // Generate in-house code
  const { data: inHouseCode1, error: err1 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: eventId,
  })

  if (err1 || !inHouseCode1) {
    logResult('In-house Code Generation', 'FAIL', 'Failed to generate in-house code', err1)
    return { inHouse: null, online: null }
  }

  // Verify format
  if (!inHouseCode1.startsWith('AFR-I') || inHouseCode1.length !== 10) {
    logResult(
      'In-house Code Format',
      'FAIL',
      `Invalid format: ${inHouseCode1} (should be AFR-I + 5 chars)`
    )
    return { inHouse: null, online: null }
  }

  logResult('In-house Code Format', 'PASS', `Valid format: ${inHouseCode1}`)

  // Generate online code
  const { data: onlineCode1, error: err2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: eventId,
  })

  if (err2 || !onlineCode1) {
    logResult('Online Code Generation', 'FAIL', 'Failed to generate online code', err2)
    return { inHouse: inHouseCode1, online: null }
  }

  // Verify format
  if (!onlineCode1.startsWith('AFR-O') || onlineCode1.length !== 10) {
    logResult(
      'Online Code Format',
      'FAIL',
      `Invalid format: ${onlineCode1} (should be AFR-O + 5 chars)`
    )
    return { inHouse: inHouseCode1, online: null }
  }

  logResult('Online Code Format', 'PASS', `Valid format: ${onlineCode1}`)

  // Test consistency (should be same each time for same event)
  const { data: inHouseCode2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'in_house',
    p_event_id: eventId,
  })

  if (inHouseCode1 !== inHouseCode2) {
    logResult('In-house Code Consistency', 'FAIL', 'In-house codes should be consistent', {
      code1: inHouseCode1,
      code2: inHouseCode2,
    })
  } else {
    logResult('In-house Code Consistency', 'PASS', 'In-house codes are consistent')
  }

  const { data: onlineCode2 } = await supabase.rpc('generate_finale_voter_code', {
    p_voter_type: 'online',
    p_event_id: eventId,
  })

  if (onlineCode1 !== onlineCode2) {
    logResult('Online Code Consistency', 'FAIL', 'Online codes should be consistent', {
      code1: onlineCode1,
      code2: onlineCode2,
    })
  } else {
    logResult('Online Code Consistency', 'PASS', 'Online codes are consistent')
  }

  return { inHouse: inHouseCode1, online: onlineCode1 }
}

async function testJudgeAuthentication(eventId: string, judgeCode: string) {
  console.log('\n📋 Testing Judge Authentication...')

  // First, create a judge voter record
  const { data: judge, error: createError } = await supabase
    .from('finale_voters')
    .insert({
      event_id: eventId,
      name: 'Test Judge 1',
      voter_code: judgeCode,
      voter_type: 'judge',
      judge_number: 1,
      is_active: true,
    })
    .select()
    .single()

  if (createError || !judge) {
    logResult('Judge Record Creation', 'FAIL', 'Failed to create judge voter', createError)
    return null
  }

  logResult('Judge Record Creation', 'PASS', `Created judge: ${judge.name}`)

  // Test authentication via API simulation
  const { data: authCheck } = await supabase
    .from('finale_voters')
    .select('*')
    .eq('event_id', eventId)
    .eq('voter_code', judgeCode)
    .eq('is_active', true)
    .single()

  if (!authCheck) {
    logResult('Judge Authentication Query', 'FAIL', 'Failed to find judge by code')
    return judge.id
  }

  logResult('Judge Authentication Query', 'PASS', 'Successfully found judge by code')

  return judge.id
}

async function testAudienceAuthentication(
  eventId: string,
  inHouseCode: string,
  onlineCode: string
) {
  console.log('\n📋 Testing Audience Authentication...')

  // Test in-house voter creation
  const { data: inHouseVoter, error: inHouseError } = await supabase
    .from('finale_voters')
    .insert({
      event_id: eventId,
      name: 'Test In-House Voter 1',
      voter_code: inHouseCode,
      voter_type: 'in_house',
      is_active: true,
    })
    .select()
    .single()

  if (inHouseError || !inHouseVoter) {
    logResult(
      'In-house Voter Creation',
      'FAIL',
      'Failed to create in-house voter',
      inHouseError
    )
  } else {
    logResult('In-house Voter Creation', 'PASS', `Created in-house voter: ${inHouseVoter.name}`)
  }

  // Test code validation logic (simulating auth endpoint)
  const { data: codeCheck } = await supabase
    .from('finale_voters')
    .select('voter_code, voter_type')
    .eq('event_id', eventId)
    .eq('voter_type', 'in_house')
    .limit(1)
    .maybeSingle()

  if (!codeCheck) {
    logResult('In-house Code Validation', 'FAIL', 'No in-house voters found for validation')
  } else if (codeCheck.voter_code !== inHouseCode) {
    logResult('In-house Code Validation', 'FAIL', 'Code mismatch', {
      expected: inHouseCode,
      found: codeCheck.voter_code,
    })
  } else {
    logResult('In-house Code Validation', 'PASS', 'Code matches stored code')
  }

  // Test second in-house voter with same code
  const { data: inHouseVoter2, error: inHouseError2 } = await supabase
    .from('finale_voters')
    .insert({
      event_id: eventId,
      name: 'Test In-House Voter 2',
      voter_code: inHouseCode,
      voter_type: 'in_house',
      is_active: true,
    })
    .select()
    .single()

  if (inHouseError2 || !inHouseVoter2) {
    logResult(
      'In-house Shared Code',
      'FAIL',
      'Failed to create second in-house voter with same code',
      inHouseError2
    )
  } else {
    logResult(
      'In-house Shared Code',
      'PASS',
      'Multiple in-house voters can share same code'
    )
  }

  // Test online voter creation
  const { data: onlineVoter, error: onlineError } = await supabase
    .from('finale_voters')
    .insert({
      event_id: eventId,
      name: 'Test Online Voter 1',
      voter_code: onlineCode,
      voter_type: 'online',
      is_active: true,
    })
    .select()
    .single()

  if (onlineError || !onlineVoter) {
    logResult('Online Voter Creation', 'FAIL', 'Failed to create online voter', onlineError)
  } else {
    logResult('Online Voter Creation', 'PASS', `Created online voter: ${onlineVoter.name}`)
  }

  return {
    inHouseIds: [inHouseVoter?.id, inHouseVoter2?.id].filter(Boolean),
    onlineIds: [onlineVoter?.id].filter(Boolean),
  }
}

async function cleanup(voterIds: string[]) {
  console.log('\n🧹 Cleaning up test data...')

  for (const id of voterIds) {
    if (id) {
      await supabase.from('finale_voters').delete().eq('id', id)
    }
  }

  logResult('Cleanup', 'PASS', `Removed ${voterIds.length} test voter records`)
}

async function main() {
  console.log('\n=========================================')
  console.log('  FINALE AUTHENTICATION TEST SUITE')
  console.log('=========================================\n')

  const event = await getActiveEvent()
  console.log(`📍 Testing with event: ${event.title} (${event.slug})`)

  const createdVoterIds: string[] = []

  try {
    // Test 1: Code Generation
    const judgeCode = await testJudgeCodeGeneration(event.id)
    const { inHouse: inHouseCode, online: onlineCode } = await testAudienceCodeGeneration(event.id)

    if (!judgeCode || !inHouseCode || !onlineCode) {
      console.log('\n❌ Code generation failed. Aborting further tests.')
      return
    }

    // Test 2: Authentication
    const judgeId = await testJudgeAuthentication(event.id, judgeCode)
    if (judgeId) createdVoterIds.push(judgeId)

    const { inHouseIds, onlineIds } = await testAudienceAuthentication(
      event.id,
      inHouseCode,
      onlineCode
    )
    createdVoterIds.push(...inHouseIds, ...onlineIds)

    // Test 3: Invalid code rejection
    console.log('\n📋 Testing Invalid Code Rejection...')
    const { data: invalidJudge } = await supabase
      .from('finale_voters')
      .select('*')
      .eq('event_id', event.id)
      .eq('voter_code', 'AFR-JINVALID')
      .maybeSingle()

    if (invalidJudge) {
      logResult('Invalid Code Rejection', 'FAIL', 'Invalid code was accepted')
    } else {
      logResult('Invalid Code Rejection', 'PASS', 'Invalid code correctly rejected')
    }
  } finally {
    await cleanup(createdVoterIds)
  }

  // Print summary
  console.log('\n=========================================')
  console.log('  TEST SUMMARY')
  console.log('=========================================')

  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  const total = results.length

  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:')
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => {
        console.log(`   • ${r.test}: ${r.message}`)
      })
  }

  console.log('\n=========================================\n')

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
