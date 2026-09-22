"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Brochure page 3 — Our Mattress Brands.
 * Official marks cropped from the catalogue, shown on a clean grid.
 */
export default function MattressBrands({ heading, kicker, items = [] }) {
  if (!items.length) return null;

  return (
    <section
      id="our-mattress-brands"
      aria-label={heading || "Our mattress brands"}
      className="relative mb-1.5 overflow-hidden py-10 md:py-12 lg:py-14"
      style={{ background: "#faf7f2" }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.26, filter: "blur(2.5px)" }}
        />
        <span
          className="absolute inset-0"
          style={{ background: "rgba(255,250,245,0.58)" }}
        />
      </div>

      <div className="shell relative z-[1] text-center">
        <h2 className="display section-heading title-card-line uppercase text-ink">
          {heading}
        </h2>
        {kicker && (
          <p className="mt-2 text-[13px] font-medium text-brand sm:text-[14px]">
            {kicker}
          </p>
        )}
      </div>

      <ul className="shell relative z-[1] mt-8 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-4 md:grid-cols-4 lg:mt-10 lg:gap-5">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.wide ? "col-span-2 md:col-span-2" : ""}
          >
            <Link
              href={item.href}
              aria-label={item.alt}
              className="group flex h-full min-h-[150px] items-center justify-center bg-white px-6 py-6 shadow-[0_1px_0_rgba(34,34,34,0.06)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] sm:min-h-[176px] sm:px-8 sm:py-8 lg:min-h-[188px]"
            >
              <span className="relative block h-[80px] w-full sm:h-[96px] lg:h-[108px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 22vw, 50vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
