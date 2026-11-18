/**
 * Picture slots — every picture or film a page's data names becomes a "slot" that
 * staff can change straight from the public page (the ✎ button on each picture).
 *
 * A slot's key is the picture's place in the data, e.g. "imagePair.images.0.src".
 * The live content (page-content/<page>) holds
 *   slots   { key: { src, overlay } }   src "" or missing = the design's own file
 *   history { key: [src, …] }           every picture the slot has shown, newest first
 * The design's own files stay in public/ as the fallback.
 */
import { resolveMedia } from "./core";

export const MEDIA_RE = /^\/[^\s"']+\.(webp|jpe?g|png|gif|avif|svg|mp4|webm)(\?[^\s"']*)?$/i;
export const isVideo = (src) => /\.(mp4|webm)(\?|$)/i.test(src || "");

/** Every media string in `data`, as [{ key, src }], in page order. */
export function collectSlots(data) {
  const out = [];
  const walk = (v, path) => {
    if (typeof v === "string") {
      if (MEDIA_RE.test(v)) out.push({ key: path.join("."), src: v });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, [...path, i]));
    } else if (v && typeof v === "object") {
      for (const k of Object.keys(v)) walk(v[k], [...path, k]);
    }
  };
  walk(data, []);
  return out;
}

/** `data` with each changed slot's picture swapped in. */
export function applySlots(data, content) {
  const slots = content?.slots || {};
  const walk = (v, path) => {
    if (typeof v === "string") {
      const s = slots[path.join(".")];
      return s?.src && MEDIA_RE.test(v) ? resolveMedia(s.src) : v;
    }
    if (Array.isArray(v)) return v.map((x, i) => walk(x, [...path, i]));
    if (v && typeof v === "object") {
      const o = {};
      for (const k of Object.keys(v)) o[k] = walk(v[k], [...path, k]);
      return o;
    }
    return v;
  };
  return walk(data, []);
}

/** The address a slot shows now (full URL for uploads). */
export function currentSrc(slot, content) {
  const s = content?.slots?.[slot.key];
  return s?.src ? resolveMedia(s.src) : slot.src;
}
