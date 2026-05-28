"use client";

import Link from "next/link";

type Client = {
  id: string;
  client_name: string;
  client_email: string;
  project_type: string;
  event_date: string | null;
  booked_at: string | null;
  pre_shoot_completed_at: string | null;
  invoice_status: string | null;
  deliverable_url: string | null;
  completed_at: string | null;
  messageCount: number;
};

function StatusPill({ done, label }: { done: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
      done
        ? "bg-emerald-100 text-emerald-700"
        : "bg-zinc-100 text-zinc-500"
    }`}>
      {done ? "✓ " : ""}{label}
    </span>
  );
}

export default function ClientRoomsList({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-zinc-500">No booked clients yet.</p>
        <p className="mt-1 text-sm text-zinc-400">
          Once you book an inquiry, the client appears here with their project room.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="divide-y divide-zinc-100">
        {clients.map((client) => {
          const isCompleted = Boolean(client.completed_at);
          const invoicePaid =
            client.invoice_status === "paid_in_full" ||
            client.invoice_status === "retainer_paid";
          const videoDelivered = Boolean(client.deliverable_url);
          const questionnaireDone = Boolean(client.pre_shoot_completed_at);

          const eventDate = client.event_date
            ? new Date(client.event_date + "T12:00:00")
            : null;

          return (
            <div key={client.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              {/* Client info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-zinc-900">{client.client_name}</p>
                  {isCompleted && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      Completed
                    </span>
                  )}
                  {client.messageCount > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                      {client.messageCount} {client.messageCount === 1 ? "message" : "messages"}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                  <span>{client.project_type}</span>
                  {eventDate && (
                    <span>
                      {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <span>{client.client_email}</span>
                </div>
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap gap-1.5">
                <StatusPill done={questionnaireDone} label="Questionnaire" />
                <StatusPill done={invoicePaid} label="Invoice" />
                <StatusPill done={videoDelivered} label="Video delivered" />
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/?q=${encodeURIComponent(client.client_name)}`}
                  className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Dashboard
                </Link>
                <a
                  href={`/project/${client.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
                >
                  Open project room
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
