/**
 * Site content (CMS) — the shared, server-safe pieces.
 *
 * How it works
 *   - Every editable section has DEFAULTS: the design's own content, written in code
 *     (src/cms/pages/…). With nothing edited, the site looks exactly as designed.
 *   - Staff edit in Admin → Site content. The database keeps ONLY what they changed,
 *     per page: { sectionKey: { fieldKey: value } }.
 *   - A section reads deepMerge(DEFAULTS, saved) — see useSection() in CmsProvider.
 *
 * Images and videos uploaded in the admin live in the media library (GridFS) and are
 * saved as "/api/media/<id>". resolveMedia() turns those into full URLs on the API.
 */
import { API_URL } from "@/config/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;

/** Objects merge key by key; arrays and plain values in `over` replace `base`. */
export function deepMerge(base, over) {
  if (over === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(over)) return over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
  return out;
}

/** "/api/media/<id>" → "https://api…/api/media/<id>", everywhere inside `v`. */
export function resolveMedia(v) {
  if (typeof v === "string") return v.startsWith("/api/media/") ? `${API_ORIGIN}${v}` : v;
  if (Array.isArray(v)) return v.map(resolveMedia);
  if (isPlainObject(v)) {
    const out = {};
    for (const k of Object.keys(v)) out[k] = resolveMedia(v[k]);
    return out;
  }
  return v;
}

export const mergeSection = (defaults, override) => resolveMedia(deepMerge(defaults, override));

/* ─── Style helpers for the values the editor produces ─────────────────── */

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/**
 * An image field → inline style for its <img>/<Image>: fit, focal point and zoom.
 * (The image's frame must clip — overflow-hidden — for zoom to stay inside it.)
 */
export function imageStyle(img) {
  if (!img || typeof img !== "object") return undefined;
  const style = {};
  if (img.fit === "contain" || img.fit === "cover") style.objectFit = img.fit;
  const hasPos = Number.isFinite(img.x) || Number.isFinite(img.y);
  if (hasPos) {
    const x = clamp(Number.isFinite(img.x) ? img.x : 50, 0, 100);
    const y = clamp(Number.isFinite(img.y) ? img.y : 50, 0, 100);
    style.objectPosition = `${x}% ${y}%`;
    style.transformOrigin = `${x}% ${y}%`;
  }
  const zoom = Number(img.zoom);
  if (Number.isFinite(zoom) && zoom !== 100) style.transform = `scale(${clamp(zoom, 50, 300) / 100})`;
  return Object.keys(style).length ? style : undefined;
}

/** "#0b1220" + 45 → "rgba(11,18,32,0.45)". */
export function rgba(hex, opacityPct = 100) {
  const h = String(hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  const a = clamp(Number(opacityPct) || 0, 0, 100) / 100;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** An overlay field { color, opacity } → a style for an absolutely-placed veil. */
export const overlayStyle = (ov) =>
  ov && Number(ov.opacity) > 0 ? { backgroundColor: rgba(ov.color || "#000000", ov.opacity) } : { display: "none" };

/** A text-size field (percent, 100 = as designed) → a style for an inner <span>. */
export const textScale = (pct) => {
  const n = Number(pct);
  return Number.isFinite(n) && n > 0 && n !== 100 ? { fontSize: `${clamp(n, 40, 250) / 100}em` } : undefined;
};
