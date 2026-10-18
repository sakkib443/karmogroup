/**
 * Bottom stop of the mattress hero wash — 15%, approved by the client.
 * Mid and top stops scale with it.
 */
export const MATTRESS_VEIL = 15;

/**
 * Navy title-card wash. At 50 the centre slide would match the drawn gradient
 * (0.50 / 0.22 / 0.14) and a right slide the slider default (0.48 / 0.22 / 0.10);
 * other values scale those stops together.
 */
export function mattressTitleOverlay(align, bottomPct = MATTRESS_VEIL) {
  const pct = Math.min(90, Math.max(0, Number(bottomPct) || 0));
  const scale = pct / 100 / 0.5;
  const a = (base) => Math.min(0.92, Math.max(0, base * scale)).toFixed(3);
  if (align === "right") {
    return `linear-gradient(to left, rgba(11,21,40,${a(0.48)}) 0%, rgba(11,21,40,${a(0.22)}) 40%, rgba(11,21,40,${a(0.1)}) 100%)`;
  }
  return `linear-gradient(to top, rgba(11,21,40,${a(0.5)}) 0%, rgba(11,21,40,${a(0.22)}) 45%, rgba(11,21,40,${a(0.14)}) 100%)`;
}
