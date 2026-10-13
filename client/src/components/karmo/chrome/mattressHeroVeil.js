"use client";

import { useEffect, useState } from "react";

/** Bottom stop of the mattress hero wash, as designed. Mid and top scale with it. */
export const MATTRESS_VEIL_DEFAULT = 50;
const KEY = "karmo-mattress-hero-veil";
const EVENT = "karmo-mattress-veil";
const STEP = 5;
const MIN = 0;
const MAX = 90;

export function clampMattressVeil(n) {
  const v = Math.round(Number(n) / STEP) * STEP;
  if (!Number.isFinite(v)) return MATTRESS_VEIL_DEFAULT;
  return Math.min(MAX, Math.max(MIN, v));
}

/**
 * Navy title-card wash. At 50 the centre slide matches the drawn gradient
 * (0.50 / 0.22 / 0.14) and a right slide matches the slider default
 * (0.48 / 0.22 / 0.10). Other values scale those stops together.
 */
export function mattressTitleOverlay(align, bottomPct) {
  const bottom = clampMattressVeil(bottomPct) / 100;
  const scale = bottom / 0.5;
  const a = (base) => Math.min(0.92, Math.max(0, base * scale)).toFixed(3);
  if (align === "right") {
    return `linear-gradient(to left, rgba(11,21,40,${a(0.48)}) 0%, rgba(11,21,40,${a(0.22)}) 40%, rgba(11,21,40,${a(0.1)}) 100%)`;
  }
  return `linear-gradient(to top, rgba(11,21,40,${a(0.5)}) 0%, rgba(11,21,40,${a(0.22)}) 45%, rgba(11,21,40,${a(0.14)}) 100%)`;
}

export function useMattressHeroVeil() {
  const [pct, setPct] = useState(MATTRESS_VEIL_DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw != null) setPct(clampMattressVeil(raw));
    } catch {
      /* ignore */
    }
    const on = (e) => setPct(clampMattressVeil(e.detail));
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  const setVeil = (next) => {
    const n = clampMattressVeil(next);
    setPct(n);
    try {
      localStorage.setItem(KEY, String(n));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: n }));
  };

  return [pct, setVeil];
}
