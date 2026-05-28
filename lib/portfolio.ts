// Portfolio items shown on the /submit page above the inquiry form.
//
// Three ways to fill these in:
// 1) videoUrl — YouTube or Vimeo link. Cards render an iframe embed (click to play).
// 2) videoPath — direct path or URL to a video file. Cards render an HTML5 <video> tag.
//    For local dev: use "/portfolio/filename.m4v"
//    For production: upload each file to Supabase Storage (public bucket) and paste
//    the full URL here, e.g. "https://xxxx.supabase.co/storage/v1/object/public/portfolio/..."
// 3) posterUrl only — static thumbnail, no playback.

export type PortfolioItem = {
  id: string;
  title: string;
  subtitle: string;
  posterUrl: string;
  videoUrl?: string;   // YouTube / Vimeo embed
  videoPath?: string;  // direct video file (local path or Supabase Storage URL)
};

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "engagement",
    title: "Engagement film",
    subtitle: "Jenell & Emanuel",
    posterUrl: "",
    videoPath: "/portfolio/jenell-emanuel-engagement.m4v",
  },
  {
    id: "pre-wedding",
    title: "Pre-wedding reel",
    subtitle: "J & E",
    posterUrl: "",
    videoPath: "/portfolio/je-pre-wedding-reel.m4v",
  },
  {
    id: "prom",
    title: "Prom reel",
    subtitle: "Jaylnn — 2025",
    posterUrl: "",
    videoPath: "/portfolio/jaylnn-prom-2025.m4v",
  },
  {
    id: "bday-saint",
    title: "Birthday reel",
    subtitle: "Saint",
    posterUrl: "",
    videoPath: "/portfolio/saint-bday-reel.m4v",
  },
  {
    id: "bday-niecey",
    title: "Birthday film",
    subtitle: "Niecey — Feeling Good 37",
    posterUrl: "",
    videoPath: "/portfolio/niecey-37-bday.m4v",
  },
];
