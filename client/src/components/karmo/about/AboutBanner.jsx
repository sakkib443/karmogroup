"use client";

import Image from "next/image";

import { aboutBanner } from "@/components/karmo/about/aboutData";

/**
 * About page cover — Karmo's "Timeless comfort since 1965" artwork, full width.
 * The picture already carries the mark and the line, so nothing is laid over it.
 * From tablets up it fills the screen below the 112px header, cut evenly at the
 * sides around the centre, where the mark and the line sit; on phones a 4:5 frame
 * keeps the whole "KARMO" in view. The page's heading stays for search engines
 * and screen readers.
 */
export default function AboutBanner() {
  return (
    <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#efe4d2] sm:aspect-auto sm:h-[calc(100svh-112px)]">
      <Image
        src={aboutBanner.src}
        alt={aboutBanner.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <h1 className="sr-only">
        {aboutBanner.eyebrow} — {aboutBanner.title}. {aboutBanner.line}
      </h1>
    </section>
  );
}
