import { FiImage } from "react-icons/fi";

/**
 * A bordered stand-in for a photo that doesn't exist yet — the wireframe
 * pass for `/chemicals/polyurethane` (and any other section built before its
 * photography is ready). Every real image slot on the finished page becomes
 * one of these: same position, same aspect ratio, dashed border and a label
 * instead of a file, so the layout can be reviewed and approved before a
 * single photo is shot.
 *
 * Swap-out is meant to be trivial: drop in a real `<Image>` at the same spot
 * and delete this.
 */
export default function ImagePlaceholder({
  label = "Image",
  ratio = "16/9",
  /* Hero banners on every real division page are full-bleed and sized by
     their section's height (`h-[calc(100vh-112px)]`, an `absolute inset-0`
     layer), not by an aspect ratio — `fill` drops the `aspectRatio` style so
     this can sit in one of those sections instead of a boxed-in card. */
  fill = false,
  className = "",
}) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-ink/[0.03] text-ink/35 ${
        fill ? "h-full" : ""
      } ${className}`}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      <FiImage className="text-[28px]" aria-hidden />
      <span className="display text-[11px] font-bold uppercase tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}
