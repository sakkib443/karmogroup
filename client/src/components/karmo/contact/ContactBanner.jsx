"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";
import { contactHeroSlides } from "@/components/karmo/contact/contactData";

/**
 * Contact cover — the homepage's own hero slider: one screen tall under the
 * 112px header, the one-line title card over the homepage photos and veil.
 */
export default function ContactBanner() {
  return (
    <OverlayHeroSlider
      slides={contactHeroSlides}
      asHero
      size="viewport"
      firstSlideMs={5200}
      autoplayMs={4500}
      fadeDuration={1.25}
      className="mb-0"
    />
  );
}
