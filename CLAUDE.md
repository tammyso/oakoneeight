# Kenny's Videography App

## Project context
This is a custom CRM and AI assistant built for Kenny, a videographer who does weddings, brand work, music videos, and events — and wants to land brand retainer clients. Built by Tammy (a recent grad, vibe coder) as a portfolio project and a real tool for Kenny.

## Deployment
- **Live URL:** `https://oakoneeight.vercel.app`
- **GitHub repo:** `https://github.com/tammyso/oakoneeight`
- **Git remote:** `git remote set-url origin https://github.com/tammyso/oakoneeight.git`
- Vercel auto-deploys on every push to `main`

## Accounts and logins
- **Vercel:** Tammy's account, project `oakoneeight`
- **Supabase:** Tammy's account, project ID `hiirfnqszohdrjokyyyw`
- **GitHub:** `tammyso/oakoneeight`
- **Resend:** Tammy's account (`tammyso`)
- **Anthropic API:** Tammy's account
- **Stripe:** Tammy's test account — Kenny needs his own before going live with real payments
- **Kenny's dashboard login:** `oakoneeight@gmail.com`, password `Kenny2026!` (temporary — he should reset it via the Forgot password link on `/login`)
- Vercel env var `OWNER_NOTIFICATION_EMAIL` is set to `oakoneeight@gmail.com` — all inquiry notifications and weekly digest go to Kenny

## Tech stack
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS for styling
- Supabase (Postgres database + auth + storage)
- Vercel for hosting and CI/CD
- GitHub for source control
- Anthropic API (Claude) for AI features
- Resend for transactional email
- Google Calendar API for scheduling
- Stripe for payment links and webhooks

## What's built (current state)

### Public site
- `/submit` — inquiry form with priority triage labels, reference image uploads, muted autoplay portfolio reel cards, SEO metadata
- `/packages` — full pricing page with all event and wedding packages + add-ons
- `/faq` — 13 questions covering booking, payment, refund policy, delivery, photography add-on
- `/about` — bio page written in Kenny's real voice from his PDF notes and Instagram
- `app/public-nav.tsx` — shared nav across all public pages; "Home" links to `/submit`
- `public/logo.png` — Kenny's logo extracted from PDFs, white PNG for dark backgrounds
- Portfolio reels at `/submit`: 4 cards (engagement, pre-wedding, prom, birthday), videos hosted in Supabase Storage `portfolio` bucket as compressed MP4s. Birthday card uses `videoPaths[]` with prev/next arrows for 2 reels.

### Auth + infrastructure
- Supabase Auth: dashboard requires login at `/login`, public pages stay open
- Password recovery flow: `/auth/callback` exchanges the recovery code, `/auth/reset-password` lets user set a new password. Login page has a "Forgot password?" button that sends a recovery email with the correct `redirectTo`.
- Supabase Site URL: `https://oakoneeight.vercel.app` (no trailing slash, no wildcard). Redirect URLs allowlist: `https://oakoneeight.vercel.app/**`
- `lib/email.ts` — `FROM_ADDRESS` constant, single env var (`RESEND_FROM`) controls sender. Falls back to `onboarding@resend.dev` if not set (no domain verified yet).
- `lib/site-url.ts` — `getSiteUrl()` handles `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL`, localhost fallback
- `lib/profile.ts` — Kenny's real contact info: `businessName: "Oak One Eight Visualz"`, `email: "Oakoneeight@gmail.com"`, `city: "New York"`, Instagram `https://www.instagram.com/oak18_visualz/`. Vimeo URL is still placeholder.
- `app/api/keep-alive/route.ts` — daily Supabase ping via Vercel cron (`0 12 * * *`) to prevent free tier pausing
- PWA manifest + app icons

### Dashboard (authenticated)
- Kanban board view + list view with search, filter chips, snooze, inline trash
- Filter tabs: Active / Snoozed / Completed / Archived
- Reporting dashboard: revenue chart (6 months / 1 year / all time), reads from both old inquiry-based invoices AND new invoice builder
- Activity feed, archive, internal notes
- Per-inquiry expanded panel: AI draft, client research, pre-shoot responses, edit plan, delivery link, project room link, client message alert, notes
- Pre-shoot questionnaire at `/questionnaire/[id]`
- Delivery + proofing workflow
- Weekly digest cron at `/api/digest` (Mondays 1am, `OWNER_NOTIFICATION_EMAIL`)
- **Completed status:** after delivery, Kenny marks a project complete — moves to Completed tab, project room stays accessible
- **Clients tab** (`/clients`): lists all booked clients with questionnaire/invoice/video status pills, orange message badge, direct "Open project room" button
- **Calendar tab** (`/calendar`): full in-app monthly calendar built from `inquiries` table — color-coded dots by project type, click a date to see shoots, upcoming shoots sidebar, color legend. Replaced Google Calendar external link in sidebar.

### AI features
- Auto-draft Claude API replies on inquiry submit — drafts stored in DB, shown inline on dashboard
- Calendar-aware drafts (checks Kenny's real availability before drafting)
- Inquiry triage + client research at intake (`lib/triage.ts`, `lib/research.ts`)
- Edit plan generator at `/edit-plan` — upload video clip (frames auto-extracted in browser) or manual screenshots + brief → structured Premiere scaffold with opening hook, beats, B-roll spots, pacing, music energy, closing beat. Plans saved to inquiry, viewable in expanded panel.
- AI voice tuned to Kenny's real style: no dashes, no bullet points in replies, signs off "Best,\nKenny\nOak One Eight Visualz" (`lib/prompts.ts`)

### Email flow (Resend)
When a client submits an inquiry:
1. Client immediately gets a confirmation email (subject: "Got your inquiry — Oak One Eight Visualz")
2. Kenny gets a notification at `OWNER_NOTIFICATION_EMAIL` with the inquiry, AI draft reply, triage label, client research, and dashboard link
3. Kenny reviews the draft in his dashboard, edits if needed, clicks Approve & Send — app sends the reply to the client
4. After that, back-and-forth continues in regular email/text — the app doesn't manage threaded replies

Other emails: booking confirmation (with project room URL + questionnaire link), invoice email (line items + Stripe payment links), review request automation, weekly digest.

### Google Calendar
- OAuth at `/api/google/connect` and `/api/google/callback`
- Free/busy badge per inquiry event date (queries all calendars, not just primary)
- Book-shoot flow: approving creates a Google Calendar event
- Conflict detection: "Book shoot" confirm dialog lists existing events on that date
- Per-day event list on the dashboard
- Note: Kenny doesn't actively use Google Calendar — the in-app `/calendar` page is the primary calendar view

### Stripe invoicing
- Full invoice builder at `/invoices/new` — itemized line items, package presets, discount, retainer (30%) vs pay-in-full toggle
- Edit draft invoices at `/invoices/[id]/edit` — locked once sent
- Pre-fills from inquiry when opened via "Create invoice →" link on dashboard; button hidden once invoice exists
- Auto-calculates retainer, balance due 14 days before event
- Stripe payment links generated per invoice, link IDs stored for webhook matching
- Invoice email sent to client via Resend with line items and payment links; returns error if Stripe fails (no silent send without links)
- Printable invoice at `/invoices/[id]/print` — public URL, client can save as PDF
- Invoice status: draft → sent → retainer_paid → paid_in_full
- Stripe webhook at `/api/stripe/webhook` — auto-updates invoice status on `checkout.session.completed`
- Invoice linked to inquiry via `inquiry_id` — client's project room shows the correct invoice
- **Currently using Tammy's Stripe test keys** — Kenny needs his own Stripe account before real payments can be collected

### Project room (`/project/[id]`)
- Public page (no auth), client bookmarks it
- Accessible as long as inquiry status is "booked" (survives project completion)
- Draft invoices show "Invoice being prepared" placeholder — full invoice + payment buttons only appear once sent
- Shows booking details, invoice with correct payment buttons (retainer / balance / full), pre-shoot questionnaire, final video delivery
- Message thread: client can send Kenny a message; stored in `project_messages` table
- Kenny finds and copies the project room link from the expanded panel on any booked inquiry
- Client message count shows as orange badge on inquiry row; alert in expanded panel links to project room

### Prospects / retainer engine
- `/prospects` — outbound prospect cards, new-prospect form, cold outreach notes

## Pending / blocked

### Must do before Kenny uses the dashboard
- **SQL migrations** — run these in [Supabase SQL Editor](https://supabase.com/dashboard/project/hiirfnqszohdrjokyyyw/sql/new):
```sql
alter table public.inquiries
  add column if not exists edit_plan text,
  add column if not exists edit_plan_generated_at timestamptz,
  add column if not exists completed_at timestamptz;
```

### Needs Kenny's decision
- **Stripe account** — Kenny needs his own Stripe account. Current keys are Tammy's test keys; real client payments would go to the wrong place. Swap `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel once he sets up his account.
- **Resend domain** — emails currently send from `onboarding@resend.dev`. To fix: Kenny buys a domain (e.g. `oakoneeight.com`, ~$12/year on Namecheap), verifies it in Resend, then set `RESEND_FROM=Kenny <kenny@oakoneeight.com>` in Vercel. Not a blocker — emails still deliver fine without it.
- **Vimeo URL** — `lib/profile.ts` still has `https://vimeo.com/kenny` as placeholder. Update with real URL or remove the link.
- **`STRIPE_WEBHOOK_SECRET`** — add `whsec_...` value to Vercel env vars so Stripe can auto-update invoice payment status.
- **Adobe Sign** — invoice builder has a placeholder for e-signature. Kenny has Adobe CC (includes Adobe Sign). Needs client ID, secret, and refresh token from his Adobe account to wire it up.

### Not blocked, just not built yet
- **Ownership migration** — transfer Supabase, Vercel, Anthropic, Resend accounts from Tammy to Kenny when ready
- **HTML email templates** — all emails are plain text; branded HTML would look more professional
- **Adobe Sign wiring** — contract e-signature flow on invoices; placeholder exists, needs Kenny's API credentials

## Cost breakdown (~$35–75/year)
- Vercel Hobby: free
- Supabase free tier: free (keep-alive cron prevents pausing)
- Resend free tier: free (3,000 emails/month)
- Google Calendar API: free
- Stripe: no monthly fee (2.9% + $0.30 per transaction)
- Anthropic API: ~$2–5/month based on inquiry volume
- Domain (optional): ~$12/year

## Supabase tables (all in `public` schema)
- `inquiries` — main table, anon INSERT (public form), authenticated SELECT/DELETE. Key columns: `status`, `completed_at`, `archived_at`, `snoozed_until`, `edit_plan`, `edit_plan_generated_at`
- `invoices` — invoice builder output; has `inquiry_id` FK, `stripe_retainer_link_id`, `stripe_balance_link_id`
- `project_messages` — client messages from project room; anon INSERT + SELECT
- `app_settings` — key/value store for Google refresh token etc.

## Environment variables (set in Vercel + `.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (`https://hiirfnqszohdrjokyyyw.supabase.co`). Never change this to the Vercel URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (long JWT starting with `eyJ`)
- `SUPABASE_SERVICE_ROLE_KEY` — admin client for server actions
- `ANTHROPIC_API_KEY` — Claude API
- `RESEND_API_KEY` — email sending
- `RESEND_FROM` — sender address, e.g. `Kenny <kenny@oakoneeight.com>` (falls back to `onboarding@resend.dev`)
- `OWNER_NOTIFICATION_EMAIL` — set to `oakoneeight@gmail.com`
- `STRIPE_SECRET_KEY` — Stripe API (currently Tammy's test key)
- `STRIPE_WEBHOOK_SECRET` — webhook signature verification (`whsec_...`)
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google Calendar OAuth
- `NEXT_PUBLIC_SITE_URL` — `https://oakoneeight.vercel.app`

## Important constraints
- Tammy is a vibe coder, not a senior engineer. Explain decisions clearly. Don't introduce complex patterns without justification.
- Budget is $50–150/month. Pro Claude plan is the only paid subscription so far.
- Kenny will eventually own the cloud accounts. Tammy owns everything for now.
- Code lives in Tammy's GitHub. Kenny gets the running app, not the source.
- Kenny has Adobe Creative Cloud (includes Adobe Sign for contracts) and Google Workspace.

## Known gotchas (already debugged)
- Supabase uses the legacy anon key (long JWT starting with `eyJ`) — the newer `sb_publishable_*` keys have auth issues with current supabase-js versions.
- New Supabase tables are NOT exposed via the Data API by default. After creating a table: Project Settings → Data API → Exposed tables → toggle on.
- After creating RLS policies, also run explicit GRANTs (e.g. `grant insert, select on public.table to anon`). Policies alone don't grant table-level access. Starting Oct 30 2026 this is enforced on all projects.
- Environment variables added after starting `npm run dev` won't be picked up until server restart.
- `NEXT_PUBLIC_SUPABASE_URL` must always point to the Supabase project URL, never the Vercel app URL — these are different things.
- Supabase Site URL (Authentication → URL Configuration) must be the exact URL with no trailing slash and no wildcard. Wildcards are only allowed in the Redirect URLs allowlist.
- Supabase free tier email rate limit: 2 auth emails per hour. If hit, use the admin API to set a password directly: `curl -X PUT https://[project].supabase.co/auth/v1/admin/users/[user_id] -H "Authorization: Bearer [service_role_key]" -H "Content-Type: application/json" -d '{"password":"..."}'`
- Vercel environment variables are NOT in the left sidebar. Go to Environments → click Production → scroll down to find the Environment Variables section.
- `useSearchParams()` in Next.js must be wrapped in a `<Suspense>` boundary or the build fails at static export.
- Public pages that use `<PublicNav>` need `max-w-5xl` on the outer container (nav is wide). Content sections inside use `max-w-3xl`.
- `sendInvoiceEmail` returns an error (does not send) if Stripe payment link creation fails — prevents clients receiving invoices with no way to pay.
- Project room checks `inquiry.status === "booked"` only — completed projects keep the room accessible because `completed_at` is a separate column, not a status change.
- Portfolio videos are stored in Supabase Storage `portfolio` bucket as compressed MP4s (HandBrake "Social" presets). File names with spaces must be URL-encoded in `lib/portfolio.ts` (e.g. `Saint%20Bday%20Reel.mp4`). Do not commit video files to git — they are in `.gitignore`.

## Style preferences
- Minimal but professional UI. No emoji in production code or copy.
- Short, clear comments. Prose over bullet lists in explanatory writing.
- When debugging, check simple/common causes first (env vars not loaded, server restart needed) before complex theories.
- AI reply voice: no dashes, no bullet points, signs off "Best,\nKenny\nOak One Eight Visualz". See `lib/prompts.ts` for full system prompt with real voice samples.
