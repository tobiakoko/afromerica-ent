/**
 * Script to create a test admin user in Supabase
 * Usage: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Admin user credentials
const TEST_ADMIN = {
  email: 'admin@afromericaent.com',
  password: 'Get_Gingered@123#',
  fullName: 'Super Admin',
  role: 'admin'
}

async function createAdminUser() {
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('🚀 Creating test admin user...\n')

  try {
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('email, is_active')
      .eq('email', TEST_ADMIN.email)
      .single()

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log(`   Email: ${TEST_ADMIN.email}`)
      console.log(`   Active: ${existingAdmin.is_active}`)

      if (!existingAdmin.is_active) {
        console.log('\n🔄 Activating existing admin...')
        const { error } = await supabase
          .from('admins')
          .update({ is_active: true })
          .eq('email', TEST_ADMIN.email)

        if (error) {
          console.error('❌ Failed to activate admin:', error.message)
          process.exit(1)
        }
        console.log('✅ Admin activated successfully!')
      }

      console.log('\n📋 Login credentials:')
      console.log(`   Email: ${TEST_ADMIN.email}`)
      console.log(`   Password: ${TEST_ADMIN.password}`)
      console.log(`   URL: http://localhost:3000/signin`)
      process.exit(0)
    }

    // Create auth user
    console.log('1️⃣  Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
      email_confirm: true, // Auto-confirm email for test user
      user_metadata: {
        full_name: TEST_ADMIN.fullName,
      },
    })

    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message)
      process.exit(1)
    }

    if (!authData.user) {
      console.error('❌ No user data returned')
      process.exit(1)
    }

    console.log('✅ Auth user created')

    // Create admin record
    console.log('2️⃣  Creating admin record...')
    const { error: adminError } = await supabase
      .from('admins')
      .insert({
        id: authData.user.id,
        email: TEST_ADMIN.email,
        full_name: TEST_ADMIN.fullName,
        role: TEST_ADMIN.role,
        is_active: true, // Active by default for test user
      })

    if (adminError) {
      console.error('❌ Failed to create admin record:', adminError.message)
      // Try to clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      process.exit(1)
    }

    console.log('✅ Admin record created')

    console.log('\n🎉 Test admin user created successfully!\n')
    console.log('📋 Login credentials:')
    console.log(`   Email: ${TEST_ADMIN.email}`)
    console.log(`   Password: ${TEST_ADMIN.password}`)
    console.log(`   URL: http://localhost:3000/signin`)
    console.log('\n💡 You can now sign in to the admin dashboard!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

createAdminUser()
