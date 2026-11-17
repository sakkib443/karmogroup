"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { materials } from "@/cms/pages/home";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import SectionHeading from "@/components/karmo/home/SectionHeading";

/**
 * Shop by material — the four core materials a Karmo mattress is built from,
 * in an asymmetric bento. Not mattress *types* any more; these are the layers
 * the brochure's "intersection" diagrams name over and over.
 *
 * The client's words were "add this segment, but much better spacing and boxes
 * (assymentric)", so this is deliberately *not* the reference's symmetric
 * three-column split. Two tall cards bracket a stacked pair, and the tall ones
 * are unequal — the first is the widest, the last the narrowest.
 *
 * Pictures and words: Admin → Site content → Home → Shop by material. The grid
 * placement below is design and stays fixed.
 */

const SLOTS = [
  {
    /* The chip colour is the point of this photo — only a soft wash behind the type. */
    wash: "bg-gradient-to-r from-black/35 via-black/10 to-transparent",
    span: "lg:col-start-1 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  { span: "lg:col-start-2 lg:row-start-1", ratio: "aspect-[16/9]", sizes: "(min-width: 1024px) 36vw, 100vw" },
  { span: "lg:col-start-2 lg:row-start-2", ratio: "aspect-[16/9]", sizes: "(min-width: 1024px) 36vw, 100vw" },
  { span: "lg:col-start-3 lg:row-span-2 lg:row-start-1", ratio: "aspect-[4/5]", sizes: "(min-width: 1024px) 26vw, 100vw" },
];

function MaterialCard({ item, slot }) {
  const image = item.image || {};

  return (
    <motion.article
      variants={fade}
      className={`group relative overflow-hidden bg-[#EFE9E3] ${slot.ratio} ${slot.span} lg:aspect-auto lg:h-full`}
    >
      <Link href={item.href || "#"} className="group relative block h-full overflow-hidden">
        {image.src ? (
          <span className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <Image
              src={image.src}
              alt={image.alt || ""}
              fill
              sizes={slot.sizes}
              className="object-cover"
              style={imageStyle(image)}
            />
          </span>
        ) : null}

        {/* Dark overlay on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/45"
        />

        {/* Inset white rectangle frame matching DivisionEditorials */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[9%] border-2 border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[10%] lg:inset-[11%]"
        />

        {/* Content centered inside the rectangle frame on hover */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="flex flex-col items-center px-4 translate-y-1.5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-[11px] lg:text-[12px]">
              {item.name}
            </span>
            <h3
              className="display title-card-line mt-2 uppercase text-white"
              style={{
                fontSize: "clamp(1.15rem, 0.95rem + 0.75vw, 1.65rem)",
                fontWeight: 350,
                fontVariationSettings: '"wght" 350',
                lineHeight: 1.15,
                letterSpacing: "0.04em",
              }}
            >
              <CmsText value={item.line} size={item.lineSize} />
            </h3>
          </span>
        </span>
      </Link>
    </motion.article>
  );
}

export default function ShopByMaterial() {
  const c = useSection("materials", materials.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-0 md:pt-10">
      <TextureSlides lighter />

      <SectionHeading eyebrow={c.eyebrow} title={c.title} titleAccent={c.titleAccent} titleSize={c.titleSize} reveal={reveal} />

      {/* Uneven columns and rows — the asymmetry the client asked for. The
          grid takes a height at lg so the two tall cards and the stacked pair
          end on the same line; below lg each card falls back to its own ratio
          and they stack. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mt-6 grid gap-1 px-0 md:mt-8 md:gap-1.5 md:px-0 lg:aspect-[16/7.6] lg:grid-cols-[1.18fr_1.1fr_0.82fr] lg:grid-rows-[1fr_1fr]"
      >
        {(c.cards || []).slice(0, SLOTS.length).map((item, i) => (
          <MaterialCard key={`${i}-${item.name}`} item={item} slot={SLOTS[i]} />
        ))}
      </motion.div>
    </section>
  );
}
