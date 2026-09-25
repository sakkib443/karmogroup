"use client";

import Image from "next/image";

/**
 * Furniture page — four catalogue foam grades sitting in a living room.
 * Full-viewport, full-width still.
 */
export default function FurnitureGradesLineup({
  lineup,
  alt = "",
  heading = "The set foam line",
}) {
  if (!lineup) return null;

  return (
    <section
      id="furniture-grades"
      aria-label={alt || "Karmo furniture foam grades"}
      className="relative mb-1.5 w-full overflow-hidden bg-[#2a241c]"
      style={{ height: "calc(100svh - 112px)" }}
    >
      <Image
        src={lineup}
        alt={alt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "left center" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/18"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to left, rgba(11,21,40,0.58) 0%, rgba(11,21,40,0.28) 38%, rgba(11,21,40,0.08) 100%)",
        }}
      />
      {heading ? (
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-end px-6 text-right sm:px-10 lg:px-16">
          <p
            className="display title-card-line uppercase text-white text-right"
            style={{
              fontSize: "clamp(1.05rem, 0.9rem + 1.2vw, 1.85rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              letterSpacing: "0.14em",
              lineHeight: 1.15,
              textShadow: "0 2px 22px rgba(0,0,0,0.45)",
            }}
          >
            {heading}
          </p>
        </div>
      ) : null}
    </section>
  );
}
