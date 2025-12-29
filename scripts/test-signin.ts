/**
 * Script to test the signin flow
 * This simulates what happens during the signin process
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const TEST_CREDENTIALS = {
  email: 'admin@afromericaent.com',
  password: 'Get_Gingered@123#',
}

async function testSignIn() {
  console.log('🔐 Testing signin flow...\n')

  // Step 1: Sign in with anon client (like a normal user)
  console.log('1️⃣  Signing in with credentials...')
  const anonClient = createClient(supabaseUrl, supabaseAnonKey)

  const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
    email: TEST_CREDENTIALS.email,
    password: TEST_CREDENTIALS.password,
  })

  if (authError) {
    console.error('❌ Auth error:', authError.message)
    return
  }

  if (!authData.user) {
    console.error('❌ No user returned')
    return
  }

  console.log('✅ Successfully authenticated')
  console.log('   User ID:', authData.user.id)

  // Step 2: Check admin access using admin client (bypassing RLS)
  console.log('\n2️⃣  Checking admin access...')
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: admin, error: adminError } = await adminClient
    .from('admins')
    .select('id, is_active, full_name, role')
    .eq('id', authData.user.id)
    .single()

  if (adminError) {
    console.error('❌ Admin check error:', adminError.message)
    await anonClient.auth.signOut()
    return
  }

  if (!admin) {
    console.error('❌ No admin record found')
    await anonClient.auth.signOut()
    return
  }

  console.log('✅ Admin record found:')
  console.log('   Name:', admin.full_name)
  console.log('   Role:', admin.role)
  console.log('   Active:', admin.is_active)

  if (!admin.is_active) {
    console.error('❌ Admin account is inactive')
    await anonClient.auth.signOut()
    return
  }

  // Step 3: Update last login
  console.log('\n3️⃣  Updating last login timestamp...')
  const { error: updateError } = await adminClient
    .from('admins')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', admin.id)

  if (updateError) {
    console.error('❌ Update error:', updateError.message)
  } else {
    console.log('✅ Last login updated')
  }

  // Cleanup
  await anonClient.auth.signOut()

  console.log('\n✨ Signin test completed successfully!')
  console.log('🎯 You should now be able to sign in at /signin')
}

testSignIn()
