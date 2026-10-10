"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Bedroom photo is the full-bleed background, including behind the logos.
 * Marks sit in the vertical centre of the left column, on a light wash.
 */

const DESKTOP_H = "calc(100svh - 64px)";

export default function MattressBrands({
  heading,
  imageAlt,
  background,
  composed = false,
  items = [],
}) {
  if (!items.length && !background) return null;

  if (composed && background) {
    return (
      <section
        id="our-mattress-brands"
        aria-label={heading || "Our mattress brands"}
        className="mattress-brands-band relative mb-1.5 overflow-hidden bg-[#0c1c33]"
        style={{ ["--mattress-brands-h"]: "auto" }}
      >
        <div className="relative aspect-[1916/821] w-full">
          <Image
            src={background}
            alt={imageAlt || heading || "Our mattress brands"}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      id="our-mattress-brands"
      aria-label={heading || "Our mattress brands"}
      className="mattress-brands-band relative mb-1.5 overflow-hidden bg-[#f7f7f8] lg:h-[calc(100svh-64px)] lg:min-h-[calc(100svh-64px)]"
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

      <div className="relative grid min-h-[min(72svh,620px)] lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]">
        <aside className="flex items-center justify-center bg-white/55 px-5 py-8 sm:px-7 lg:px-8">
          {items.length ? (
            <ul className="grid w-full grid-cols-2 items-center gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={item.wide ? "col-span-2" : undefined}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-center"
                  >
                    <span
                      className={`relative block w-full ${
                        item.wide
                          ? "h-[72px] sm:h-[84px] lg:h-[96px]"
                          : "h-[104px] sm:h-[118px] lg:h-[132px]"
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes={
                          item.wide
                            ? "(min-width: 1024px) 28vw, 90vw"
                            : "(min-width: 1024px) 14vw, 42vw"
                        }
                        className="object-contain object-center"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
        <div className="min-h-[min(36svh,280px)] lg:min-h-0" aria-hidden />
      </div>
    </section>
  );
}
