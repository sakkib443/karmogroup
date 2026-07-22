import Image from "next/image";

// Intrinsic size of public/logo.png. These have to match the file: next/image
// derives the aspect ratio from them, so a stale pair silently squashes the
// artwork rather than failing.
const LOGO_W = 384;
const LOGO_H = 53;

/**
 * The Karmo wordmark. Callers set the height through className; keep `w-auto`
 * so the 7.25:1 ratio is preserved.
 */
export default function Logo({ className = "h-9 w-auto", priority = false }) {
  return (
    <Image
      src="/logo.png"
      alt="Karmo"
      width={LOGO_W}
      height={LOGO_H}
      priority={priority}
      // object-contain is the safety net: if a parent ever squeezes the box,
      // the artwork letterboxes instead of stretching. A distorted logo is
      // much worse than a slightly smaller one.
      className={`object-contain ${className}`}
    />
  );
}
