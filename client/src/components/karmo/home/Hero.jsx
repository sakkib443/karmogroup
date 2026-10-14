"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";
import { useSection } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { hero } from "@/cms/pages/home";

/**
 * Homepage hero — original left / right / center placement, one-line title.
 * Slides, headings, pictures and darkness come from Admin → Site content → Home →
 * Hero slider (defaults: src/cms/pages/home.js).
 */
export default function Hero() {
  const c = useSection("hero", hero.defaults);
  if (c.hidden) return null;

  const slides = (c.slides || [])
    .filter((s) => s?.media?.src)
    .map((s, i) => {
      const m = s.media;
      const base = {
        id: s.id || `slide-${i}`,
        align: s.align || "center",
        titleCard: true,
        headingLead: s.heading,
        headingScale: s.headingSize,
        overlay: s.overlay,
        holdMs: Number(s.holdSec) > 0 ? Number(s.holdSec) * 1000 : undefined,
      };
      return m.type === "video"
        ? { ...base, video: { src: m.src, poster: m.poster || undefined, rate: Number(m.rate) || 1, style: imageStyle(m) } }
        : { ...base, image: { src: m.src, alt: m.alt || "", fit: m.fit, style: imageStyle(m) } };
    });

  return (
    <OverlayHeroSlider
      slides={slides}
      asHero
      size="viewport"
      firstSlideMs={5200}
      autoplayMs={(Number(c.autoplaySec) || 4.5) * 1000}
      fadeDuration={1.25}
      className="mb-0"
    />
  );
}
