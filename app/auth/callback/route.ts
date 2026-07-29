import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Supabase redirects here after the user clicks a password-recovery (or
// email-confirmation) link.  The URL carries a one-time `code` param that
// we exchange for a real session, then send the user on to `next`.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Something went wrong — bounce back to login with an error hint.
  return NextResponse.redirect(
    new URL("/login?error=invalid_recovery_link", origin),
  );
}
