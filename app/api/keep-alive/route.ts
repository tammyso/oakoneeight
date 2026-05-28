// Lightweight daily ping that keeps the Supabase project awake.
// Supabase free tier pauses after 7 days of zero activity — this prevents that.
// Triggered by the Vercel cron in vercel.json.

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  // Minimal query — just enough to register activity with Supabase.
  await supabase.from("inquiries").select("id").limit(1);
  return NextResponse.json({ ok: true });
}
