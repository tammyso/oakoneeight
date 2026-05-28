"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import { getVideoEmbedUrl } from "@/lib/video-embed";

// Reel-style card: muted autoplay on scroll into view, tap to unmute.
// Supports multiple videos (videoPaths) with prev/next arrows.
// Falls back to click-to-play iframe for YouTube / Vimeo links.
export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false); // for iframe fallback
  const [videoIndex, setVideoIndex] = useState(0);

  const paths = item.videoPaths ?? (item.videoPath ? [item.videoPath] : []);
  const activePath = paths[videoIndex] ?? null;
  const isMulti = paths.length > 1;
  const embedUrl = item.videoUrl ? getVideoEmbedUrl(item.videoUrl) : null;

  // Restart and play when the active video changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activePath) return;
    video.load();
    video.play().catch(() => {});
  }, [videoIndex, activePath]);

  // Start/stop playback based on visibility (IntersectionObserver).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Sync muted state to the video element.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const prev = () => setVideoIndex((i) => (i - 1 + paths.length) % paths.length);
  const next = () => setVideoIndex((i) => (i + 1) % paths.length);

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Portrait aspect ratio — matches how these reels were shot */}
      <div className="relative aspect-[9/16] overflow-hidden bg-zinc-800">
        {activePath ? (
          <>
            <video
              ref={videoRef}
              src={activePath}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Prev / next arrows for multi-video cards */}
            {isMulti && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous video"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                    <path d="M7 1 L3 5 L7 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next video"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                    <path d="M3 1 L7 5 L3 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1">
                  {paths.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVideoIndex(i)}
                      aria-label={`Video ${i + 1}`}
                      className={`h-1.5 w-1.5 rounded-full transition ${i === videoIndex ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Mute / unmute button */}
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
            >
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.985 6.985 0 0 1 14 19.05v2.06c1.37-.26 2.63-.82 3.72-1.6L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </>
        ) : playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={item.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            {item.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.posterUrl}
                alt={item.title}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-800" />
            )}
            {embedUrl && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${item.title}`}
                className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/20"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition group-hover:scale-105">
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" className="ml-1 text-zinc-900" aria-hidden>
                    <path d="M0 0 L0 22 L20 11 Z" />
                  </svg>
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Category label */}
      <figcaption className="px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{item.category}</p>
      </figcaption>
    </figure>
  );
}
