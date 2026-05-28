import Link from "next/link";
import type { Metadata } from "next";
import { KENNY_PROFILE } from "@/lib/profile";
import PublicNav from "../public-nav";

export const metadata: Metadata = {
  title: "About",
  description: "About Kenny — videographer based in New York.",
};

const BIO_PARAGRAPHS = [
  "I'm Kenny, a New York wedding filmmaker and videographer. I specialize in cinematic wedding videography, focusing on authentic moments, natural pacing, and storytelling that feels timeless rather than trendy.",
  "Weddings don't unfold in predictable blocks of time. They move. They breathe. They shift emotionally. My work is built around capturing the day as a complete story. Every collection is structured to preserve natural pacing, authentic reactions, and the atmosphere that makes your wedding feel uniquely yours.",
  "I believe clarity before the wedding day creates freedom during it. Professional planning, clear coverage boundaries, and consistent delivery timelines mean you can be present on the day instead of managing logistics.",
];

const SHOOTS = [
  {
    label: "Wedding films",
    blurb:
      "Cinematic coverage structured around complete story arcs. Three collections available: Essential, Signature, and Legacy. Focused ceremony or reception coverage also available.",
  },
  {
    label: "Brand work",
    blurb:
      "Recurring social cuts, hero campaigns, founder stories. Built for brands that want video as a consistent part of their voice, not a one-time launch.",
  },
  {
    label: "Music videos",
    blurb:
      "From single-shot performance pieces to narrative cuts. Independent artists, small labels, solo projects.",
  },
  {
    label: "Events",
    blurb:
      "Milestone celebrations, conferences, brand activations. Cinematic recap reels that capture the energy and atmosphere of the day.",
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
              href="/submit"
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
