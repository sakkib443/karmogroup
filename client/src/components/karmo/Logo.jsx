import Image from "next/image";

// Intrinsic size of public/logo.png and its ink cut. These have to match the
// file: next/image derives the aspect ratio from them, so a stale pair
// silently squashes the artwork rather than failing.
const LOGO_W = 384;
const LOGO_H = 53;

/**
 * The Karmo wordmark. Callers set the height through className; keep `w-auto`
 * so the ratio is preserved.
 *
 * `src` exists because the default artwork is reversed — "KARMO" in red but
 * "GROUP", "Since 1965" and the ® set in white — so it only reads on a dark
 * panel. On a light one, half the wordmark disappears. Home 02's header is
 * white and passes /karmo/logo-ink.png, the same artwork with the white ink
 * recoloured to slate. Both files must stay in step if the mark is ever
 * redrawn.
 *
 * `width`/`height` default to that wordmark's size but are overridable,
 * because not every Karmo mark shares its 7.25:1 ratio — `/karmo/logo-mark.png`,
 * the short "KARMO" with the black 1965 device and no "GROUP", is 400x120.
 * Passing a file without its matching pair is the one way to misuse this: the
 * ratio would be wrong and `object-contain` would letterbox it inside a box
 * of the wrong shape rather than complain.
 */
export default function Logo({
  className = "h-9 w-auto",
  priority = false,
  src = "/karmo/logo.png",
  width = LOGO_W,
  height = LOGO_H,
}) {
  return (
    <Image
      src={src}
      alt="Karmo"
      width={width}
      height={height}
      priority={priority}
      // object-contain is the safety net: if a parent ever squeezes the box,
      // the artwork letterboxes instead of stretching. A distorted logo is
      // much worse than a slightly smaller one.
      className={`object-contain ${className}`}
    />
  );
}
