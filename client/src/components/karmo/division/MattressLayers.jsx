"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/**
 * Mattress "Built layer by layer" band.
 *
 * Navy copy panel on the left that bleeds into the pocket-spring cutaway,
 * callouts pinned to the photo, and a light feature strip underneath.
 * Driven by `zones` on the mattress division only (layout: "editorial").
 */

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function LayerIcon({ id, className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {id === "foam" && (
        <>
          <path d="M4 11.5 16 6l12 5.5-12 5.5L4 11.5Z" {...line} />
          <path d="M4 16.5 16 22l12-5.5" {...line} />
          <path d="M4 21.5 16 27l12-5.5" {...line} />
        </>
      )}
      {id === "pillow" && (
        <>
          <path d="M4 17.5c0-2.2 1.6-4 3.6-4h16.8c2 0 3.6 1.8 3.6 4v4.8c0 1-.8 1.7-1.7 1.7H5.7c-.9 0-1.7-.7-1.7-1.7v-4.8Z" {...line} />
          <path d="M6.6 13.5c0-2.6 2-4.6 4.4-4.6h10c2.4 0 4.4 2 4.4 4.6" {...line} />
          <path d="M4 19.6h24" {...line} />
        </>
      )}
      {id === "springs" && (
        <>
          <rect x="4" y="8" width="24" height="16" rx="1.6" {...line} />
          <path d="M10 8v16M16 8v16M22 8v16" {...line} />
          <path d="M4 12.5h24M4 16h24M4 19.5h24" {...line} />
        </>
      )}
    </svg>
  );
}

export default function MattressLayers({
  src,
  alt,
  eyebrow,
  heading,
  headingLead,
  headingAccent,
  subheading,
  icons = [],
  cta,
  callouts = [],
  features = [],
}) {
  return (
    <section
      aria-label={heading}
      className="relative mb-0 w-full bg-[#0a1830]"
    >
      <div className="relative w-full overflow-hidden lg:aspect-[2.85/1]">
        {/* Cutaway — pushed right so the navy panel has room to breathe. Its
            left edge fades out so the photo melts into the navy instead of
            cutting against it. */}
        <div
          className="absolute inset-y-0 right-0 hidden w-[90%] lg:block"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
            maskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="90vw"
            className="object-cover object-[center_62%]"
            priority={false}
          />
        </div>

        {/* Navy wash — dark under the copy, then one long, gentle fade that
            melts into the photo (no hard edge). */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] lg:block"
          style={{
            background:
              "linear-gradient(to right, #0a1830 0%, rgba(10,24,48,0.8) 30%, rgba(10,24,48,0.45) 55%, rgba(10,24,48,0.18) 78%, rgba(10,24,48,0) 100%)",
          }}
        />

        {/* Callouts — desktop only, pinned to the photo box */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[84%] lg:block">
          {callouts.map((c) => {
            const above = c.place === "above";
            const top = Math.min(c.y, c.anchorY);
            const height = Math.abs(c.anchorY - c.y);
            return (
              <div key={c.id}>
                <span
                  className="absolute w-px bg-[#16304f]/30"
                  style={{ left: `${c.x}%`, top: `${top}%`, height: `${height}%` }}
                />
                <span
                  className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16304f]/70"
                  style={{ left: `${c.x}%`, top: `${c.anchorY}%` }}
                />
                <div
                  className={`absolute w-[11rem] ${above ? "-translate-y-full pb-2" : "pt-2"}`}
                  style={{ left: `${c.x}%`, top: `${c.y}%`, marginLeft: 10 }}
                >
                  <p className="text-[9.5px] font-bold uppercase leading-tight tracking-[0.09em] text-[#16304f] xl:text-[10.5px]">
                    {c.title}
                  </p>
                  <p className="mt-1 text-[9.5px] leading-[1.45] text-[#44617f] xl:text-[10.5px]">
                    {c.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / tablet — photo sits above the copy, no callouts */}
        <div className="relative h-[230px] w-full sm:h-[300px] lg:hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover object-[62%_58%]"
          />
        </div>

        {/* Copy panel */}
        <div className="relative z-[1] flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:h-full lg:w-[36%] lg:px-12 lg:py-0 xl:px-16">
          {eyebrow && (
            <p className="flex items-center gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70 xl:text-[11px]">
                {eyebrow}
              </span>
              <span className="h-px w-12 bg-white/25" />
            </p>
          )}

          <h2
            className="display mt-4 uppercase leading-[1.05] text-white"
            style={{
              fontSize: "clamp(1.7rem, 1.0rem + 2vw, 2.9rem)",
              fontWeight: 300,
              fontVariationSettings: '"wght" 300',
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block">{headingLead || heading}</span>
            {headingAccent && (
              <span className="block text-[#8fc0ea]">{headingAccent}</span>
            )}
          </h2>

          {subheading && (
            <p className="body-copy mt-4 max-w-[24rem] text-[12.5px] leading-[1.65] text-white/60 xl:text-[13.5px]">
              {subheading}
            </p>
          )}

          {icons.length > 0 && (
            <ul className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5 xl:mt-8 xl:gap-x-6">
              {icons.map((icon) => (
                <li key={icon.id}>
                  <LayerIcon id={icon.id} className="h-7 w-7 text-white xl:h-8 xl:w-8" />
                  <p className="mt-2.5 text-[9.5px] font-bold uppercase leading-tight tracking-[0.08em] text-white xl:text-[10.5px]">
                    {icon.label}
                  </p>
                  {icon.note && (
                    <p className="mt-1 text-[9.5px] leading-[1.45] text-white/50 xl:text-[10.5px]">
                      {icon.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {cta && (
            <Link
              href={cta.href}
              className="group mt-8 inline-flex h-[42px] w-fit items-center justify-center gap-3 rounded-full border border-white/35 px-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0a1830] xl:mt-9 xl:h-[46px] xl:text-[12px]"
            >
              {cta.label}
              <FiArrowRight className="text-[14px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Feature strip */}
      {features.length > 0 && (
        <div className="w-full bg-[#f4f5f7]">
          <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-6 px-6 py-8 sm:grid-cols-3 sm:px-10 lg:grid-cols-5 lg:gap-y-0 lg:px-12 xl:px-16">
            {features.map((f, i) => (
              <li
                key={f.id}
                className={`flex items-center gap-3 lg:px-5 ${
                  i > 0 ? "lg:border-l lg:border-ink/10" : "lg:pl-0"
                }`}
              >
                {f.src ? (
                  <span className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                    <Image
                      src={f.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-ink xl:text-[11px]">
                    {f.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-[1.45] text-ink/55 xl:text-[11px]">
                    {f.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
