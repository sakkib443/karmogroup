"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Brochure page 3 — same band type as homepage Chemicals:
 * screen-tall photo, catalogue page overlaid on the left.
 */

const DESKTOP_H = "calc(100svh - 64px)";

export default function MattressBrands({
  heading,
  image,
  imageAlt,
  background,
  items = [],
}) {
  if (!image && !items.length) return null;

  return (
    <section
      id="our-mattress-brands"
      aria-label={heading || "Our mattress brands"}
      className="mattress-brands-band relative mb-1.5 overflow-hidden bg-[#0B1A33] lg:h-[calc(100svh-64px)] lg:min-h-[calc(100svh-64px)]"
      style={{ ["--mattress-brands-h"]: DESKTOP_H }}
    >
      {background ? (
        <Image
          src={background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />
      ) : null}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-l from-black/42 via-black/22 to-black/10"
      />

      <div className="relative grid min-h-[min(72svh,620px)] lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]">
        <aside className="relative order-2 min-h-[min(56svh,520px)] lg:order-1 lg:min-h-0">
          {image ? (
            <Image
              src={image}
              alt={imageAlt || heading || "Our mattress brands"}
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover object-center"
            />
          ) : null}
        </aside>
        <div
          className="relative order-1 min-h-[min(36svh,300px)] lg:order-2 lg:min-h-0"
          aria-hidden
        />
      </div>

      {items.length ? (
        <nav className="sr-only" aria-label={heading || "Mattress brands"}>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.alt}</Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </section>
  );
}
