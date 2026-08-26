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
 * `Mattress Brochure/MATERIAL-IMAGE-PROMPTS.md`).
 */

const materials = [
  {
    id: "rebonded-foam",
    name: "Rebonded Foam",
    line: "Finest hi-density foam chips, steam-bonded for support that lasts.",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/rebonded-foam.jpg",
    alt: "Close-up of Karmo rebonded foam — bonded hi-density foam chips",
    /* Tall left. `row-span-2` is what makes the row asymmetric at all. */
    span: "lg:col-start-1 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  {
    id: "pe-foam",
    name: "Polyethylene Foam",
    line: "Load-bearing hi-density core — made only by Karmo.",
    href: "/mattress",
    src: "/karmo/images/home-02/materials/pe-foam.jpg",
    alt: "Close-up of Karmo hi-density polyethylene (PE) foam",
    span: "lg:col-start-2 lg:row-start-1",
    ratio: "aspect-[16/9]",
    sizes: "(min-width: 1024px) 36vw, 100vw",
  },
  {
    id: "natural-coir",
    name: "Natural Coir",
    line: "100% coconut-husk fibre — breathable, cool, biodegradable.",
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
    line: "Vanadium-coated coils that move independently, contouring to you.",
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
      <Link href={item.href} className="block h-full">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={item.sizes}
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />

        {/* Bottom-weighted, because the copy sits low and the pictures are
            light at the top. Deeper than the gallery's because this one has a
            sentence to carry, not just a name. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
          <div className="min-w-0">
            <h3 className="display text-[1.05rem] font-bold! uppercase leading-[1.15]! tracking-[0.01em] text-white sm:text-[1.2rem]">
              {item.name}
            </h3>
            <p className="body-copy mt-1.5 max-w-[20rem] text-[12px] leading-[1.55] text-white/75 sm:text-[12.5px]">
              {item.line}
            </p>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-colors duration-300 group-hover:bg-brand group-hover:text-white sm:h-10 sm:w-10">
            <FiArrowRight className="text-[15px]" />
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
