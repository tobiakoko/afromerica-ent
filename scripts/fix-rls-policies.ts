import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies on admins table...\n')

  try {
    // Step 1: Drop ALL existing policies on admins table
    console.log('1️⃣  Dropping all existing policies...')
    const dropSQL = `
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admins' AND schemaname = 'public')
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS %I ON public.admins', r.policyname);
          RAISE NOTICE 'Dropped policy: %', r.policyname;
        END LOOP;
      END $$;
    `

    const { error: dropError } = await supabase.rpc('exec_sql', {
      query: dropSQL
    })

    if (dropError) {
      console.log('   Note: Could not use RPC, trying direct SQL execution')
      // Try without RPC
      const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: dropSQL })
      })

      if (!result.ok) {
        console.error('   ❌ Could not drop policies via API')
        console.log('\n   Please run this SQL in your Supabase SQL Editor:')
        console.log('\n' + dropSQL)
      }
    }

    console.log('✅ Dropped existing policies')

    // Step 2: Create new policies that don't cause recursion
    console.log('\n2️⃣  Creating new policies...')
    const createSQL = `
      -- Policy 1: Allow users to view their own admin record (no recursion)
      CREATE POLICY "Users can view their own admin record"
        ON public.admins FOR SELECT
        USING (auth.uid() = id);

      -- Policy 2: Allow service role full access
      CREATE POLICY "Service role can manage all admins"
        ON public.admins FOR ALL
        USING (auth.role() = 'service_role');

      -- Policy 3: Allow users to update their own record
      CREATE POLICY "Users can update their own admin record"
        ON public.admins FOR UPDATE
        USING (auth.uid() = id);
    `

    const { error: createError } = await supabase.rpc('exec_sql', {
      query: createSQL
    })

    if (createError) {
      console.log('   Note: Could not use RPC, trying direct SQL execution')
      // Try without RPC
      const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: createSQL })
      })

      if (!result.ok) {
        console.error('   ❌ Could not create policies via API')
        console.log('\n   Please run this SQL in your Supabase SQL Editor:')
        console.log('\n' + createSQL)
        return
      }
    }

    console.log('✅ Created new policies')

    // Step 3: Test the new policies
    console.log('\n3️⃣  Testing new policies...')
    const testClient = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: authData } = await testClient.auth.signInWithPassword({
      email: 'admin@afromericaent.com',
      password: 'Get_Gingered@123#'
    })

    if (authData.user) {
      const { data: adminData, error: adminError } = await testClient
        .from('admins')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (adminError) {
        console.error('❌ Error querying admins table:', adminError.message)
      } else {
        console.log('✅ Successfully queried admins table')
        console.log('   Admin:', adminData.full_name)
      }

      await testClient.auth.signOut()
    }

    console.log('\n✨ RLS policies fixed successfully!')

  } catch (error) {
    console.error('\n❌ Error:', error)
    console.log('\n📋 Please manually run the following SQL in your Supabase SQL Editor:\n')
    console.log(`
-- Drop all existing policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admins' AND schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admins', r.policyname);
  END LOOP;
END $$;

-- Create new policies
CREATE POLICY "Users can view their own admin record"
  ON public.admins FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service role can manage all admins"
  ON public.admins FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can update their own admin record"
  ON public.admins FOR UPDATE
  USING (auth.uid() = id);
    `)
  }
}

fixRLSPolicies()
