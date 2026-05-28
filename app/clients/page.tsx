import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isCalendarConnected } from "@/lib/google";
import AppShell from "../app-shell";
import ClientRoomsList from "./client-rooms-list";

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const calendarConnected = await isCalendarConnected();

  const [{ data: inquiries }, { data: messages }] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, client_name, client_email, project_type, event_date, booked_at, pre_shoot_completed_at, invoice_status, deliverable_url, completed_at, archived_at")
      .eq("status", "booked")
      .is("archived_at", null)
      .order("event_date", { ascending: true }),
    supabase
      .from("project_messages")
      .select("inquiry_id"),
  ]);

  const messageCountByInquiryId = new Map<string, number>();
  for (const msg of messages ?? []) {
    if (msg.inquiry_id) {
      messageCountByInquiryId.set(msg.inquiry_id, (messageCountByInquiryId.get(msg.inquiry_id) ?? 0) + 1);
    }
  }

  const clients = (inquiries ?? []).map((inq) => ({
    ...inq,
    messageCount: messageCountByInquiryId.get(inq.id) ?? 0,
  }));

  return (
    <AppShell calendarConnected={calendarConnected}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Clients</h1>
          <p className="mt-2 text-sm text-zinc-600">
            All booked projects. Each row links to that client's project room.
          </p>
        </div>
        <ClientRoomsList clients={clients} />
      </div>
    </AppShell>
  );
}
