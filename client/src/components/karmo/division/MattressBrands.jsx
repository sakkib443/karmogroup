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
  backgroundAspect = "1916 / 821",
  composed = false,
  /* Composed photo fills a screen-tall band; wide banners with logos at the
     edges leave this off so nothing is cropped away. */
  screenTall = false,
  items = [],
  /* Bedroom photo with a soft dark shade on its left quarter: words on top,
     the brand logos below in two columns. */
  shaded = false,
  eyebrow,
  titleLine1,
  titleLine2,
  body,
}) {
  if (!items.length && !background) return null;

  if (shaded && background) {
    /* Same build as the homepage Chemicals band: photo full-bleed, a 70% black
       panel on the left (~a third), centred eyebrow + two-line uppercase heading,
       then the logos in two columns. No button. */
    return (
      <section
        id="our-mattress-brands"
        aria-label={heading || "Our mattress brands"}
        className="mattress-brands-band relative mb-1.5 overflow-hidden bg-[#0B1A33] lg:h-[calc(100svh-40px)]"
      >
        <Image
          src={background}
          alt={imageAlt || heading || "Our mattress brands"}
          fill
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/10 to-black/5" />

        <div className="relative grid min-h-[min(72svh,620px)] lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]">
          <aside className="relative flex flex-col items-center justify-center px-7 py-10 text-center text-white sm:px-9 lg:px-10 lg:py-12">
            <span aria-hidden className="absolute inset-0 bg-black/50" />
            {eyebrow ? (
              <span className="relative flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] sm:text-[12px]">
                <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-brand sm:w-10" />
                <span className="text-white/80">
                  {eyebrow.split(" ")[0]}{" "}
                  <span className="text-brand">{eyebrow.split(" ").slice(1).join(" ")}</span>
                </span>
                <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-brand sm:w-10" />
              </span>
            ) : null}
            <h2
              className="relative display title-card-line mt-3 uppercase text-white"
              style={{
                fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
                fontWeight: 350,
                fontVariationSettings: '"wght" 350',
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
              }}
            >
              <span className="block text-white/90">{titleLine1}</span>
              <span className="block text-white">{titleLine2}</span>
              <span aria-hidden className="mx-auto mt-4 block h-[2px] w-12 rounded-full bg-brand" />
            </h2>

            {items.length ? (
              <ul className="relative mt-8 grid w-full max-w-[27rem] grid-cols-2 gap-3 sm:mt-10 xl:gap-3.5">
                {items.map((item) => (
                  <li key={item.id} className={item.wide ? "col-span-2" : undefined}>
                    <Link
                      href={item.href}
                      title={item.alt}
                      className="group flex items-center justify-center rounded-lg border border-white/40 bg-gradient-to-b from-white/40 to-[#f3eee8]/30 backdrop-blur-[2px] px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span
                        className={`relative block w-full ${
                          item.wide ? "h-[40px] sm:h-[44px] xl:h-[50px]" : "h-[58px] sm:h-[64px] xl:h-[72px]"
                        }`}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(min-width: 1024px) 220px, 45vw"
                          className="object-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
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

  if (composed && background) {
    return (
      <section
        id="our-mattress-brands"
        aria-label={heading || "Our mattress brands"}
        className="mattress-brands-band relative mb-1.5 overflow-hidden bg-[#0c1c33]"
        style={{ ["--mattress-brands-h"]: "auto" }}
      >
        <div
          className={`relative w-full aspect-[var(--brands-aspect)] ${
            screenTall ? "lg:aspect-auto lg:h-[calc(100svh-32px)]" : ""
          }`}
          style={{ ["--brands-aspect"]: backgroundAspect.replace(/\s/g, "") }}
        >
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
