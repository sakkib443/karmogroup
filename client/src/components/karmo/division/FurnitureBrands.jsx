"use client";

import Image from "next/image";

/**
 * Furniture page — four lifestyle rooms in one row, same hover as
 * homepage Our Divisions: wash + inset white frame + foam label.
 */

export default function FurnitureBrands({ heading, sofas = [] }) {
  if (!sofas.length) return null;

  return (
    <section
      id="our-brands"
      aria-label={heading || "Furniture foam in the room"}
      className="relative mb-1.5 w-full overflow-hidden"
    >
      <ul className="grid grid-cols-2 gap-[2px] md:grid-cols-4 md:gap-1">
        {sofas.slice(0, 4).map((sofa) => (
          <li key={sofa.id} className="min-w-0">
            <article className="group relative block aspect-square overflow-hidden bg-[#e8e8e8]">
              <Image
                src={sofa.src}
                alt={sofa.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/8"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/32 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,21,40,0.42) 0%, rgba(11,21,40,0.22) 48%, rgba(11,21,40,0.16) 100%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[12%] border border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[14%] lg:inset-[15%]"
              />
              {sofa.label ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="display translate-y-1 px-3 text-center text-[15px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[16px] lg:text-[18px]">
                    {sofa.label}
                  </span>
                </span>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
