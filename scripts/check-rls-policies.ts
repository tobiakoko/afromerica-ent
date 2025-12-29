import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRLSPolicies() {
  console.log('🔍 Checking RLS policies on admins table...\n')

  // Query the pg_policies view to see all policies
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE tablename = 'admins'
      ORDER BY policyname;
    `
  })

  if (error) {
    // If the RPC doesn't exist, try direct query
    console.log('Trying alternative method...')

    const result = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'admins')

    if (result.error) {
      console.error('❌ Error:', result.error.message)
      console.log('\nLet me try to test the actual policy by querying admins table...\n')

      // Test with a regular client (not admin)
      const testClient = createClient(
        supabaseUrl,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // First, sign in
      const { data: authData } = await testClient.auth.signInWithPassword({
        email: 'admin@afromericaent.com',
        password: 'Get_Gingered@123#'
      })

      if (authData.user) {
        console.log('✅ Signed in as:', authData.user.email)

        // Try to query admins table
        const { data: adminData, error: adminError } = await testClient
          .from('admins')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (adminError) {
          console.error('❌ Error querying admins table:', adminError.message)
          console.error('   Code:', adminError.code)
        } else {
          console.log('✅ Successfully queried admins table')
          console.log('   Admin:', adminData)
        }

        await testClient.auth.signOut()
      }
      return
    }

    console.log('Policies found:', result.data)
    return
  }

  console.log('Policies:', data)
}

checkRLSPolicies()
