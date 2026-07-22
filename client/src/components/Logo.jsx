import Image from "next/image";

/**
 * The official Karmo lockup (public/logo.png) — mark stacked over the
 * wordmark. Callers set the display size through className; keep `w-auto`
 * so the 426x333 aspect ratio is preserved.
 */
export default function Logo({ className = "h-11 w-auto", priority = false }) {
  return (
    <Image
      src="/logo.png"
      alt="Karmo"
      width={426}
      height={333}
      priority={priority}
      className={className}
    />
  );
}
