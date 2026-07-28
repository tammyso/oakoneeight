-- Edit plan generator output + completed-project lifecycle marker.
-- app/page.tsx's dashboard query selects all three columns, so the
-- dashboard is broken until this runs. Idempotent — safe to re-run.

alter table public.inquiries
  add column if not exists edit_plan text,
  add column if not exists edit_plan_generated_at timestamptz,
  add column if not exists completed_at timestamptz;
