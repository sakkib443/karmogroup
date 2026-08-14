"use client";

import { useEffect } from "react";

/**
 * Home Two — soft section snap for full-viewport bands.
 *
 * Fixed header is 112px. Full-height sections use `calc(100svh - 112px)`, so
 * they only look "perfect" when their top sits exactly under that bar. A mouse
 * wheel notch rarely lands there: one click leaves a sliver of the previous
 * section, the next overshoots into the next. After the shared SmoothScroll
 * ease settles, if we are within a short distance of a marked snap section we
 * pull the page the last few pixels so the band sits flush.
 *
 * Desktop / fine pointer only. Touch keeps native momentum.
 */

const HEADER = 112;
/* How close (px) before we pull into a snap. Large enough to catch a near
   miss from one wheel notch, small enough not to steal intentional mid-scroll. */
const PULL = 140;
const SETTLE_MS = 160;

export default function HomeTwoSectionSnap() {
  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!fine.matches) return undefined;

    let timer = 0;
    let snapping = false;

    const snaps = () =>
      Array.from(document.querySelectorAll("[data-home-two-snap]")).map(
        (el) => {
          const top = el.getBoundingClientRect().top + window.scrollY;
          return Math.max(0, Math.round(top - HEADER));
        },
      );

    const settle = () => {
      if (snapping) return;
      const y = window.scrollY;
      const points = snaps();
      let best = null;
      let bestDist = PULL;

      for (const p of points) {
        const d = Math.abs(p - y);
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      }

      if (best == null || bestDist < 2) return;

      snapping = true;
      window.scrollTo({ top: best, behavior: "smooth" });
      window.setTimeout(() => {
        snapping = false;
      }, 420);
    };

    const onScroll = () => {
      if (snapping) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
