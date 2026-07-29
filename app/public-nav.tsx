"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { KENNY_PROFILE } from "@/lib/profile";
import { MailIcon, SocialIcon } from "./social-icon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-12 flex flex-wrap items-center justify-between gap-x-5 gap-y-4 text-sm">
      <Link href="/" className="flex min-w-0 items-center gap-4" aria-label="Oak One Eight Visualz — home">
        <Image
          src="/logo.png"
          alt="Oak One Eight Visualz"
          width={200}
          height={200}
          className="h-24 w-24 opacity-90 hover:opacity-100 sm:h-[200px] sm:w-[200px]"
        />
        <div className="max-w-[13rem] sm:max-w-none">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 sm:text-sm sm:tracking-wider">
            Your Personal Cinematographer
          </p>
          <p
            className="text-5xl font-normal italic text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kenny
          </p>
        </div>
      </Link>
      <div className="flex shrink-0 items-center gap-5">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "whitespace-nowrap text-zinc-50"
              : "whitespace-nowrap text-zinc-300 underline-offset-2 hover:text-zinc-50 hover:underline"
          }
          aria-current={pathname === link.href ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
      <span aria-hidden className="h-4 w-px bg-zinc-700" />
      <div className="flex items-center gap-3 text-zinc-300">
        <a
          href={`mailto:${KENNY_PROFILE.email}`}
          aria-label={`Email ${KENNY_PROFILE.email}`}
          className="transition hover:text-zinc-100"
        >
          <MailIcon />
        </a>
        {KENNY_PROFILE.socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="transition hover:text-zinc-100"
          >
            <SocialIcon kind={social.kind} />
          </a>
        ))}
      </div>
      </div>
    </nav>
  );
}
