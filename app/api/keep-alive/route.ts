// Lightweight daily ping that keeps the Supabase project awake.
// Supabase free tier pauses after 7 days of zero activity — this prevents that.
// Triggered by the Vercel cron in vercel.json.

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  // Admin client — anon has no SELECT policy on inquiries, so the anon-role
  // client would fail this query silently (same root cause as the /submit
  // read-after-insert bug).
  const supabase = createSupabaseAdminClient();
  // Minimal query — just enough to register activity with Supabase.
  const { error } = await supabase.from("inquiries").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
