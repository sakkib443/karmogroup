"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { FeatureIcon } from "@/components/karmo/division/mattressFeatureIcons";

/**
 * Mattress "Built layer by layer" band.
 *
 * Navy copy panel on the left that bleeds into the pocket-spring cutaway,
 * with callouts pinned to the photo. The light feature row under the photo
 * is the same mattress side edge that closes the homepage size band.
 * Driven by `zones` on the mattress division only (layout: "editorial").
 */

/* Same tile as ShopBySize — a seamless middle cut, repeated side by side. */
const EDGE_SRC = "/pages/home/sizes/mattress-side-edge-tile.webp";

/**
 * Navy → transparent over the photo: solid to FADE_FROM %, then an eased fade
 * (opacity = (1 + cos πt) / 2) that reaches zero at FADE_TO %. Stops every 1/16th
 * of the way keep the curve smooth instead of a few straight segments.
 */
const FADE_FROM = 20;
const FADE_TO = 46;
const NAVY_FADE = `linear-gradient(to right, #0b1a33 0%, ${Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  const alpha = ((1 + Math.cos(Math.PI * t)) / 2).toFixed(4);
  const at = (FADE_FROM + (FADE_TO - FADE_FROM) * t).toFixed(2);
  return `rgba(11,26,51,${alpha}) ${at}%`;
}).join(", ")}, rgba(11,26,51,0) 100%)`;

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

        {/* Navy wash — solid under the copy, then an eased (sine in-out) fade
            into the light photo. Many close stops follow the curve, so there is
            no visible kink or start/end line — just navy melting into white. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: NAVY_FADE }}
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

      <div className="bg-white">
        <div
          role="img"
          aria-label="Side view of a Karmo pillow-top mattress showing its thickness"
          className="h-[50px] w-full opacity-70 sm:h-[66px] lg:h-[clamp(44px,7.5svh,82px)]"
          style={{
            backgroundImage: `url(${EDGE_SRC})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
          }}
        />
      </div>
    </section>
  );
}
