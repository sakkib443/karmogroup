"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { FeatureIcon } from "@/components/karmo/division/mattressFeatureIcons";

/**
 * Mattress "Built layer by layer" band.
 *
 * Navy copy panel on the left that bleeds into the pocket-spring cutaway,
 * callouts pinned to the photo, and a light feature strip underneath.
 * Driven by `zones` on the mattress division only (layout: "editorial").
 */

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
      className="relative mb-0 w-full bg-[#0b1a33]"
    >
      <div className="relative w-full overflow-hidden lg:aspect-[2.85/1]">
        {/* Cutaway — pushed right so the navy panel has room to breathe. Its
            left edge fades out so the photo melts into the navy instead of
            cutting against it. */}
        <div className="absolute inset-0 hidden overflow-hidden lg:block">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        {/* Navy wash — dark under the copy, then one long, gentle fade that
            melts into the photo (no hard edge). */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] lg:block"
          style={{
            background:
              "linear-gradient(to right, #0b1a33 0%, #0b1a33 52%, rgba(11,26,51,0.7) 68%, rgba(11,26,51,0.32) 84%, rgba(11,26,51,0) 100%)",
          }}
        />

        {/* Callouts — desktop only, pinned to the photo box */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
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
            className="object-cover object-[78%_center]"
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
                  <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden bg-white xl:h-16 xl:w-16">
                    <FeatureIcon id={icon.id} />
                  </span>
                  <p className="mt-1.5 text-[9.5px] font-bold uppercase leading-tight tracking-[0.08em] text-white xl:text-[10.5px]">
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
              className="group mt-8 inline-flex h-[42px] w-fit items-center justify-center gap-2 bg-brand px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark xl:mt-9 xl:h-[46px] xl:px-8 xl:text-[12px]"
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
                <span className="relative h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <FeatureIcon id={f.id} />
                </span>
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
