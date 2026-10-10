"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

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
    src: "/karmo/images/home-02/materials/rebonded-foam-v14.webp",
    alt: "Close-up of Karmo rebonded foam — finely bonded pastel chips",
    /* The chip colour is the point of this photo — only a soft wash behind the type. */
    wash: "bg-gradient-to-r from-black/35 via-black/10 to-transparent",
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
    src: "/karmo/images/home-02/materials/pe-foam-v2.webp",
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
    src: "/karmo/images/home-02/materials/natural-coir.webp",
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
    src: "/karmo/images/home-02/materials/pocket-spring.webp",
    alt: "Close-up of a Karmo pocket-spring unit — fabric-bagged steel coils",
    span: "lg:col-start-3 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 26vw, 100vw",
  },
];

function MaterialCard({ item }) {
  const slides = item.slides ?? [item.src];
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={fade}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -8, transition: { duration: 0.7, ease: [0.45, 0, 0.2, 1] } }
      }
      className={`group relative overflow-hidden bg-[#EFE9E3] ${item.ratio} ${item.span} lg:aspect-auto lg:h-full`}
    >
      <Link href={item.href} className="group relative block h-full overflow-hidden">
        {slides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? item.alt : ""}
            aria-hidden={i !== active}
            fill
            sizes={item.sizes}
            className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:scale-[1.03] ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        <span
          aria-hidden
          className={`absolute inset-0 ${item.wash || "bg-black/40"}`}
        />

        <div className={`absolute inset-0 z-[1] flex flex-col items-start justify-start px-5 pb-5 pt-24 sm:px-6 sm:pt-32 lg:justify-center lg:px-9 lg:pb-0 lg:pt-0 ${item.wash ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" : ""}`}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 sm:text-[11px]">
            {item.name}
          </span>
          <h3
            className="display title-card-line mt-2 whitespace-nowrap uppercase text-white"
            style={{
              fontSize: "clamp(1.05rem, 0.85rem + 0.85vw, 1.55rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              lineHeight: 1.12,
              letterSpacing: "0.04em",
            }}
          >
            {item.line}
          </h3>
        </div>
      </Link>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % slides.length)}
            aria-label={`Show ${item.name} image ${((active + 1) % slides.length) + 1} of ${slides.length}`}
            className="absolute top-1/2 right-3 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:h-11 sm:w-11 lg:right-4"
          >
            <FiChevronRight className="text-[20px]" aria-hidden />
          </button>
          <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${item.name} image ${i + 1}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
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
