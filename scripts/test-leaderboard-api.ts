#!/usr/bin/env tsx

/**
 * Test Leaderboard API Endpoint
 *
 * This script tests the leaderboard API endpoint to verify it works correctly
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const baseUrl = 'http://localhost:3000'
const eventId = '40745efb-6778-4dbf-bd7f-68ac9c8e1566'

async function testLeaderboardAPI() {
  console.log('🔍 Testing Leaderboard API Endpoint...\n')

  const tests = [
    {
      name: 'Empty stage (current stage)',
      url: `${baseUrl}/api/finale/leaderboard?event_id=${eventId}&stage=&include_breakdown=true`,
    },
    {
      name: 'Stage 1',
      url: `${baseUrl}/api/finale/leaderboard?event_id=${eventId}&stage=stage_1&include_breakdown=true`,
    },
    {
      name: 'No stage parameter',
      url: `${baseUrl}/api/finale/leaderboard?event_id=${eventId}&include_breakdown=true`,
    },
  ]

  for (const test of tests) {
    console.log(`\n📋 Test: ${test.name}`)
    console.log(`   URL: ${test.url}`)

    try {
      const response = await fetch(test.url)
      const data = await response.json()

      console.log(`   Status: ${response.status} ${response.statusText}`)
      console.log(`   Success: ${data.success}`)
      console.log(`   Message: ${data.message || 'N/A'}`)

      if (data.config) {
        console.log(`   Config found: ✅`)
        console.log(`   - Current stage: ${data.config.current_stage || 'Not started'}`)
        console.log(`   - Voting enabled: ${data.config.voting_enabled}`)
        console.log(`   - Leaderboard visible: ${data.config.leaderboard_visible}`)
      }

      if (data.leaderboard) {
        console.log(`   Leaderboard entries: ${data.leaderboard.length}`)
        if (data.leaderboard.length > 0) {
          console.log(`   First entry:`)
          console.log(`   - Artist: ${data.leaderboard[0].artist?.name || 'N/A'}`)
          console.log(`   - Rank: ${data.leaderboard[0].rank}`)
          console.log(`   - Total score: ${data.leaderboard[0].scores?.total_score || 0}`)
        }
      }

      if (response.status === 500) {
        console.error(`   ❌ ERROR: ${data.message}`)
        if (data.error) {
          console.error(`   Error details: ${data.error}`)
        }
      } else if (response.ok) {
        console.log(`   ✅ SUCCESS`)
      } else {
        console.log(`   ⚠️  Non-200 response`)
      }
    } catch (error) {
      console.error(`   ❌ FETCH ERROR:`, error)
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await fetch(`${baseUrl}/api/health`, { method: 'HEAD' })
    return true
  } catch {
    console.log('⚠️  Server not running at', baseUrl)
    console.log('   Please start the server with: npm run dev')
    console.log('   Or update baseUrl in this script if using a different port\n')
    return false
  }
}

async function main() {
  const serverRunning = await checkServer()
  if (!serverRunning) {
    console.log('   Skipping API tests...\n')
    process.exit(1)
  }

  await testLeaderboardAPI()
}

main().catch(console.error)
