"use client";

import Image from "next/image";

/**
 * Furniture page — four catalogue foam grades sitting in a living room.
 * Full-viewport, full-width still.
 */
export default function FurnitureGradesLineup({
  lineup,
  alt = "",
  heading = "All your upholstery needs",
}) {
  if (!lineup) return null;

  return (
    <section
      id="furniture-grades"
      aria-label={alt || "Karmo furniture foam grades"}
      className="relative mb-1.5 w-full overflow-hidden bg-[#2a241c]"
      style={{ minHeight: "100svh" }}
    >
      <Image
        src={lineup}
        alt={alt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[center_72%]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/22"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(11,21,40,0.28) 0%, rgba(11,21,40,0.12) 48%, rgba(11,21,40,0.08) 100%)",
        }}
      />
      {heading ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-center px-5 pt-8 text-center sm:px-8 sm:pt-10 lg:pt-14">
          <p
            className="display title-card-line uppercase text-white"
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
