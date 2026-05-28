import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { getVideoEmbedUrl } from "@/lib/video-embed";
import ProjectComment from "./project-comment";
import ProjectMessages from "./project-messages";
import ApproveButton from "./approve-button";

type ProjectRoomData = {
  id: string;
  client_name: string;
  project_type: string | null;
  event_date: string | null;
  status: string | null;
  deliverable_url: string | null;
  pre_shoot_completed_at: string | null;
  client_approved_at: string | null;
};

type InvoiceData = {
  id: string;
  total: number;
  retainer_amount: number;
  payment_type: string;
  status: string;
  stripe_retainer_url: string | null;
  stripe_balance_url: string | null;
};

const formatDate = (value: string | null) => {
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return value;
};

// Returns true for direct file URLs (Supabase Storage, Dropbox, etc.)
// where a download button makes sense. Hosted players (Vimeo/YouTube)
// handle their own downloading.
const isDirectFileUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return (
      !u.hostname.includes("vimeo.com") &&
      !u.hostname.includes("youtube.com") &&
      !u.hostname.includes("youtu.be")
    );
  } catch {
    return false;
  }
};

export default async function ProjectRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select(
      "id, client_name, project_type, event_date, status, deliverable_url, pre_shoot_completed_at, client_approved_at",
    )
    .eq("id", id)
    .maybeSingle<ProjectRoomData>();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, total, retainer_amount, payment_type, status, stripe_retainer_url, stripe_balance_url")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<InvoiceData>();

  const { data: messages } = await supabase
    .from("project_messages")
    .select("id, sender_name, message, created_at")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: true });

  if (!inquiry || inquiry.status !== "booked") {
    notFound();
  }

  const eventLabel = formatDate(inquiry.event_date);
  const projectLabel = inquiry.project_type ?? "Shoot";
  const hasVideo = Boolean(inquiry.deliverable_url);
  const embedUrl = inquiry.deliverable_url ? getVideoEmbedUrl(inquiry.deliverable_url) : null;
  const canDownload = inquiry.deliverable_url ? isDirectFileUrl(inquiry.deliverable_url) : false;
  const isApproved = Boolean(inquiry.client_approved_at);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Branded header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-zinc-900">
            K
          </span>
          <span className="text-sm font-semibold text-white">Oak One Eight Visualz</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-12">

        {/* Video delivery hero — only shown once Kenny adds a deliverable URL */}
        {hasVideo ? (
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Final delivery
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {inquiry.client_name}, your film is ready.
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Watch it below. When you are happy with it, hit Approve.
            </p>

            {/* Video player */}
            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Your film"
                  allowFullScreen
                  allow="autoplay; encrypted-media; fullscreen"
                  className="aspect-video w-full"
                />
              ) : (
                <video
                  src={inquiry.deliverable_url!}
                  controls
                  className="aspect-video w-full"
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <ApproveButton
                inquiryId={inquiry.id}
                clientName={inquiry.client_name}
                approved={isApproved}
              />
              {canDownload && (
                <a
                  href={inquiry.deliverable_url!}
                  download
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Download
                </a>
              )}
            </div>

            {/* Feedback / revision notes */}
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <ProjectComment inquiryId={inquiry.id} dark />
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Project room
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {inquiry.client_name}
            </h1>
            <p className="mt-3 text-base text-zinc-400">
              Your {projectLabel.toLowerCase()} with Kenny is booked
              {eventLabel ? ` for ${eventLabel}` : ""}. This page is the live
              status for your project — bookmark it to check back any time.
            </p>
          </div>
        )}

        {/* Project details + invoice + questionnaire */}
        <div className="space-y-4">

          {/* Booking details */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Booking
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Project</dt>
                <dd className="font-medium text-zinc-100">{projectLabel}</dd>
              </div>
              {eventLabel && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Date</dt>
                  <dd className="font-medium text-zinc-100">{eventLabel}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Status</dt>
                <dd className="font-medium text-emerald-400">Confirmed</dd>
              </div>
              {isApproved && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Film</dt>
                  <dd className="font-medium text-emerald-400">Approved</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Invoice */}
          {invoice && invoice.status === "draft" && (
            <section className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Invoice</p>
              <p className="mt-2 text-sm text-zinc-500">
                Your invoice is being prepared and will appear here shortly.
              </p>
            </section>
          )}

          {invoice && invoice.status !== "draft" && (
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Invoice
              </p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Total</p>
                    <p className="text-2xl font-semibold text-white">
                      {(invoice.total / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500">Status</p>
                    <p className="font-medium capitalize text-zinc-100">
                      {invoice.status === "paid_in_full" ? "Paid in full" : invoice.status === "retainer_paid" ? "Retainer paid" : "Sent"}
                    </p>
                  </div>
                </div>
                {invoice.status !== "paid_in_full" && invoice.payment_type === "retainer" && invoice.stripe_retainer_url && invoice.status === "sent" && (
                  <a
                    href={invoice.stripe_retainer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                  >
                    Pay retainer ({(invoice.retainer_amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })})
                  </a>
                )}
                {invoice.status !== "paid_in_full" && invoice.payment_type === "retainer" && invoice.stripe_balance_url && invoice.status === "retainer_paid" && (
                  <a
                    href={invoice.stripe_balance_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                  >
                    Pay remaining balance ({((invoice.total - invoice.retainer_amount) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })})
                  </a>
                )}
                {invoice.status !== "paid_in_full" && invoice.payment_type === "full" && invoice.stripe_retainer_url && (
                  <a
                    href={invoice.stripe_retainer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                  >
                    Pay in full ({(invoice.total / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })})
                  </a>
                )}
                <a
                  href={`/invoices/${invoice.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-zinc-700 px-5 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
                >
                  View full invoice
                </a>
              </div>
            </section>
          )}

          {/* Pre-shoot questionnaire prompt */}
          {!inquiry.pre_shoot_completed_at && (
            <section className="rounded-xl border border-amber-900/50 bg-amber-950/30 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
                Action needed
              </p>
              <p className="mt-2 text-sm text-amber-200/80">
                Pre-shoot details aren&apos;t filled out yet. Takes about 3
                minutes and helps the day run smoothly.
              </p>
              <a
                href={`/questionnaire/${inquiry.id}`}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-medium text-white transition hover:bg-amber-500"
              >
                Fill out pre-shoot details
              </a>
            </section>
          )}

          {/* Placeholder when no video yet */}
          {!hasVideo && (
            <section className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-8 text-center text-sm text-zinc-600">
              Your film will land here once the shoot is in the can.
            </section>
          )}
        </div>

        {/* Messages */}
        <ProjectMessages inquiryId={id} messages={messages ?? []} dark />
      </main>
    </div>
  );
}
