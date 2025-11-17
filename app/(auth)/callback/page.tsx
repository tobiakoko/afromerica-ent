import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code as string | undefined
  const token_hash = params.token_hash as string | undefined
  const type = params.type as string | undefined
  const next = (params.next as string) || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Verify the session was created
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        redirect(next)
      }
    }
  }

  // Handle email confirmation with token_hash (recommended by Supabase)
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Verify the session was created
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        redirect(next)
      }
    }
  }

  // If there's an error or no code, redirect to login
  redirect("/auth/signin?error=auth_callback_error")
}
