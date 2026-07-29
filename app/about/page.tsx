import Link from "next/link";
import type { Metadata } from "next";
import { KENNY_PROFILE } from "@/lib/profile";
import PublicNav from "../public-nav";

export const metadata: Metadata = {
  title: "About",
  description: "About Kenny — videographer based in New York.",
};

const BIO_PARAGRAPHS = [
  "I'm Kenny, a New York filmmaker operating as Oak One Eight Visualz. I shoot weddings, engagements, birthdays, prom reels, brand work, and music videos. Videography is the foundation. When photography is added, it is built around the film.",
  "A lot of the work starts personal. My niece asked if I could film her prom send-off. A friend's kid turning one. A couple days away from the I Do's. These are the milestones that do not come back around, and that is exactly why I take them seriously.",
  "Weddings do not unfold in predictable blocks of time. They move. They breathe. They shift emotionally. My work is built around capturing the day as a complete story. Not staged moments or rushed timelines. Just intentional storytelling.",
];

const SHOOTS = [
  {
    label: "Wedding films",
    blurb:
      "Cinematic coverage built around natural pacing and authentic reactions. Three collections: Essential, Signature, and Legacy. Focused ceremony or reception coverage also available.",
  },
  {
    label: "Engagements and events",
    blurb:
      "Milestone shoots, birthday films, prom reels, and celebrations. Structured to capture the energy of the day without disrupting it.",
  },
  {
    label: "Brand work",
    blurb:
      "Recurring social content, hero campaigns, founder stories. For brands that want video as a consistent part of their voice.",
  },
  {
    label: "Music videos",
    blurb:
      "Single-shot performance pieces to full narrative cuts. Independent artists, small labels, solo projects.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <PublicNav />

        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              About
            </p>
          </div>

          <div className="space-y-5">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-zinc-300">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-14">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              What I shoot
            </p>
            <dl className="mt-4 space-y-5">
              {SHOOTS.map((s) => (
                <div key={s.label}>
                  <dt className="text-base font-medium text-zinc-100">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-400">{s.blurb}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-14 rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
            <p className="text-base text-zinc-300">
              Got a project in mind? I&apos;d love to hear about it.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition hover:bg-white"
            >
              Send me an inquiry
            </Link>
          </div>

          <footer className="mt-16 text-center text-xs text-zinc-500">
            Based in {KENNY_PROFILE.city} · &copy; {new Date().getFullYear()} {KENNY_PROFILE.businessName}
          </footer>
        </div>
      </main>
    </div>
  );
}
