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

const SUPABASE_PORTFOLIO = "https://hiirfnqszohdrjokyyyw.supabase.co/storage/v1/object/public/portfolio";

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "engagement",
    title: "Engagement film",
    subtitle: "Jenell & Emanuel",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/jenell-emanuel-engagement.mp4`,
  },
  {
    id: "pre-wedding",
    title: "Pre-wedding reel",
    subtitle: "J & E",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/je-pre-wedding-reel.mp4`,
  },
  {
    id: "prom",
    title: "Prom reel",
    subtitle: "Jaylnn — 2025",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/jaylnn-prom-2025.mp4`,
  },
  {
    id: "bday-saint",
    title: "Birthday reel",
    subtitle: "Saint",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/Saint%20Bday%20Reel.mp4`,
  },
  {
    id: "bday-niecey",
    title: "Birthday film",
    subtitle: "Niecey — Feeling Good 37",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/niecey-37-bday.mp4`,
  },
];
