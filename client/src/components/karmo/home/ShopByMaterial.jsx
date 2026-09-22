"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Shop by material — the four core materials a Karmo mattress is built from,
 * in an asymmetric bento. Not mattress *types* any more; these are the layers
 * the brochure's "intersection" diagrams name over and over — the section's
 * "built from the inside out" eyebrow taken literally.
 *
 * The client's words were "add this segment, but much better spacing and boxes
 * (assymentric)", so this is deliberately *not* the reference's symmetric
 * three-column split. Two tall cards bracket a stacked pair, and the tall ones
 * are unequal — Rebonded Foam is the widest because foam is the craft the
 * company is known for, Pocket Spring the narrowest.
 *
 * Macro close-ups of the four brochure materials live under
 * `/karmo/images/home-02/materials/` (prompts in
 * `karmo-library/02-catalogues/mattress-brochure/MATERIAL-IMAGE-PROMPTS.md`).
 */

const materials = [
  {
    id: "rebonded-foam",
    name: "Rebonded Foam",
    line: "Support that lasts",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/rebonded-foam-v4.jpg",
    alt: "Close-up of Karmo rebonded foam — finely bonded pastel chips",
    /* Tall left. `row-span-2` is what makes the row asymmetric at all. */
    span: "lg:col-start-1 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  {
    id: "pe-foam",
    name: "Polyethylene Foam",
    line: "Hi-density core",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/pe-foam-v2.jpg",
    alt: "Close-up of charcoal egg-crate contour foam",
    span: "lg:col-start-2 lg:row-start-1",
    ratio: "aspect-[16/9]",
    sizes: "(min-width: 1024px) 36vw, 100vw",
  },
  {
    id: "natural-coir",
    name: "Natural Coir",
    line: "Cool and breathable",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/natural-coir.jpg",
    alt: "Close-up of a Karmo natural coir sheet — pressed coconut-husk fibre",
    span: "lg:col-start-2 lg:row-start-2",
    ratio: "aspect-[16/9]",
    sizes: "(min-width: 1024px) 36vw, 100vw",
  },
  {
    id: "pocket-spring",
    name: "Pocket Spring",
    line: "Independent coils",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/pocket-spring.jpg",
    alt: "Close-up of a Karmo pocket-spring unit — fabric-bagged steel coils",
    span: "lg:col-start-3 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 26vw, 100vw",
  },
];

function MaterialCard({ item }) {
  return (
    <motion.article
      variants={fade}
      className={`group relative overflow-hidden bg-[#EFE9E3] ${item.ratio} ${item.span} lg:aspect-auto lg:h-full`}
    >
      <Link href={item.href} className="group relative block h-full overflow-hidden">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={item.sizes}
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <span
          aria-hidden
          className="absolute inset-0 bg-black/40"
        />

        <div className="absolute inset-0 z-[1] flex flex-col items-start justify-start px-6 pb-6 pt-16 sm:px-7 sm:pb-7 sm:pt-[4.5rem] lg:px-8 lg:pb-8 lg:pt-24">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] sm:text-[13px] lg:text-[14px]">
            {item.name}
          </span>
          <h3
            className="display title-card-line mt-3 whitespace-nowrap uppercase text-white"
            style={{
              fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            {item.line}
          </h3>
          <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.02em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] transition-colors duration-300 group-hover:text-brand sm:mt-6 sm:text-[14px] lg:text-[15px]">
            Explore
            <FiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ShopByMaterial() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pt-4 pb-0 md:pt-5 lg:pt-6">
      {/* Uneven columns and rows — the asymmetry the client asked for. The
          grid takes a height at lg so the two tall cards and the stacked pair
          end on the same line; below lg each card falls back to its own ratio
          and they stack. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid gap-1 px-0 md:gap-1.5 md:px-0 lg:aspect-[16/7.6] lg:grid-cols-[1.18fr_1.1fr_0.82fr] lg:grid-rows-[1fr_1fr]"
      >
        {materials.map((item) => (
          <MaterialCard key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
