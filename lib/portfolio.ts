// Portfolio items shown on the /submit page above the inquiry form.
//
// Three ways to fill these in:
// 1) videoUrl — YouTube or Vimeo link. Cards render an iframe embed (click to play).
// 2) videoPath — direct path or URL to a single video file.
// 3) videoPaths — array of video files for one card (tap arrows to cycle through).
// For production, use Supabase Storage URLs. For local dev, use "/portfolio/filename.m4v".

export type PortfolioItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;    // short label shown under the reel (e.g. "Wedding", "Birthday shoot")
  posterUrl: string;
  videoUrl?: string;     // YouTube / Vimeo embed
  videoPath?: string;    // single direct video file
  videoPaths?: string[]; // multiple videos — card shows prev/next arrows
};

const SUPABASE_PORTFOLIO = "https://hiirfnqszohdrjokyyyw.supabase.co/storage/v1/object/public/portfolio";

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "engagement",
    title: "Engagement film",
    subtitle: "Jenell & Emanuel",
    category: "Engagement",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/jenell-emanuel-engagement.mp4`,
  },
  {
    id: "pre-wedding",
    title: "Pre-wedding reel",
    subtitle: "J & E",
    category: "Wedding",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/je-pre-wedding-reel.mp4`,
  },
  {
    id: "prom",
    title: "Prom reel",
    subtitle: "Jaylnn — 2025",
    category: "Prom",
    posterUrl: "",
    videoPath: `${SUPABASE_PORTFOLIO}/jaylnn-prom-2025.mp4`,
  },
  {
    id: "bday",
    title: "Birthday reels",
    subtitle: "Saint + Niecey",
    category: "Birthday shoot",
    posterUrl: "",
    videoPaths: [
      `${SUPABASE_PORTFOLIO}/Saint%20Bday%20Reel.mp4`,
      `${SUPABASE_PORTFOLIO}/niecey-37-bday.mp4`,
    ],
  },
];
