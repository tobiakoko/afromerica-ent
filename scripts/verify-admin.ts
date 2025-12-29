import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAdmin() {
  console.log('🔍 Checking admin record...\n')

  // Check admin record
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', 'admin@afromericaent.com')
    .single()

  if (adminError) {
    console.error('❌ Error fetching admin:', adminError)
    return
  }

  console.log('✅ Admin record found:')
  console.log(JSON.stringify(admin, null, 2))

  // Check auth user
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error('❌ Error fetching users:', usersError)
    return
  }

  const authUser = users.find(u => u.email === 'admin@afromericaent.com')

  if (authUser) {
    console.log('\n✅ Auth user found:')
    console.log('   ID:', authUser.id)
    console.log('   Email:', authUser.email)
    console.log('   Email Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No')
    console.log('   Created:', authUser.created_at)
  } else {
    console.log('\n❌ Auth user not found!')
  }
}

verifyAdmin()
