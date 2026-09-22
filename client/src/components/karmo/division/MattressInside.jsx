"use client";

import Image from "next/image";

/**
 * Brochure intersections — exploded layers left, pocket cutaway right,
 * copy in the middle. Full-bleed, full-viewport height.
 */
const PANEL_H = "100svh";

export default function MattressInside({
  heading,
  accent,
  body,
  layers = [],
  exploded,
  cutaway,
}) {
  return (
    <section
      id="inside-every-karmo"
      aria-label="Inside a Karmo mattress"
      className="mb-1.5 overflow-hidden bg-[#f4efe8]"
    >
      <div
        className="grid lg:grid-cols-3"
        style={{ minHeight: PANEL_H }}
      >
        <figure
          className="relative h-full bg-[#f4efe8]"
          style={{ minHeight: "52svh" }}
        >
          <Image
            src={exploded.src}
            alt={exploded.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover object-center"
            priority={false}
          />
        </figure>

        <div className="flex flex-col justify-center bg-white px-6 py-10 sm:px-8 lg:px-9 lg:py-12">
          <h2 className="display section-heading title-card-line uppercase text-ink">
            {heading}{" "}
            {accent && <span className="text-brand">{accent}</span>}
          </h2>
          {body && (
            <p className="body-copy mt-3 max-w-md text-[13px] leading-relaxed text-ink/60 sm:text-[14px]">
              {body}
            </p>
          )}

          <ol className="mt-8 flex flex-col gap-4 lg:mt-9 lg:gap-5">
            {layers.map((layer, i) => (
              <li key={layer.id} className="flex gap-3.5">
                <span className="display w-7 shrink-0 text-[12px] font-semibold text-brand sm:text-[13px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="display block text-[12px] font-semibold uppercase tracking-[0.06em] text-ink sm:text-[13px]">
                    {layer.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink/55">
                    {layer.line}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {cutaway && (
          <figure
            className="relative h-full bg-[#efe9e3]"
            style={{ minHeight: "52svh" }}
          >
            <Image
              src={cutaway.src}
              alt={cutaway.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover object-center"
            />
            {cutaway.caption && (
              <figcaption className="absolute bottom-5 left-5 bg-white/92 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink sm:bottom-6 sm:left-6 sm:text-[12px]">
                {cutaway.caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}
