import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { activateAdmin } from "@/lib/auth/actions"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code as string | undefined
  const token_hash = params.token_hash as string | undefined
  const type = params.type as string | undefined
  const next = (params.next as string) || "/admin"
  const error = params.error as string | undefined

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    redirect(`/signin?error=${error}`)
  }

  const supabase = await createClient()
  let userId: string | undefined

  // Handle authorization code exchange (PKCE flow)
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      redirect("/signin?error=auth_callback_error")
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  // Handle email confirmation with token_hash (Magic Link & Email Verification)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (verifyError) {
      console.error('OTP verification error:', verifyError)
      redirect("/signin?error=verification_failed")
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  // Activate admin account after email verification
  if (userId) {
    const activationResult = await activateAdmin(userId)

    if (activationResult.error) {
      console.error('Admin activation error:', activationResult.error)
      // Still redirect to next page - user is authenticated
      // They may need to contact support about activation
    }

    redirect(next)
  }

  // If we reach here, something went wrong
  redirect("/signin?error=auth_callback_error")
}
