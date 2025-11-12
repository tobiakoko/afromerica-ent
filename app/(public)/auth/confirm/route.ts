import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // Redirect to the next URL or dashboard
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(
    new URL("/auth/error?error=email_confirmation_failed", request.url)
  );
}
