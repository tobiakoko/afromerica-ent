import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code as string | undefined
  const next = (params.next as string) || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      redirect(next)
    }
  }

  // If there's an error or no code, redirect to login
  redirect("/auth/signin?error=auth_callback_error")
}
