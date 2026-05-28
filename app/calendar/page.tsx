import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isCalendarConnected } from "@/lib/google";
import AppShell from "../app-shell";
import CalendarView from "./calendar-view";

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const calendarConnected = await isCalendarConnected();

  const { data } = await supabase
    .from("inquiries")
    .select("id, client_name, project_type, event_date, status, archived_at")
    .not("event_date", "is", null)
    .is("archived_at", null)
    .order("event_date", { ascending: true });

  const inquiries = (data ?? []).filter((i) => i.event_date);

  return (
    <AppShell calendarConnected={calendarConnected}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Calendar</h1>
          <p className="mt-2 text-sm text-zinc-600">All shoots and upcoming project dates.</p>
        </div>
        <CalendarView inquiries={inquiries} />
      </div>
    </AppShell>
  );
}
