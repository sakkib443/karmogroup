"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A mix of Karmo's own studio product shots and the rooms those products end
 * up in. Heights vary so the rows read as a scattered wall rather than a
 * filmstrip, which is what the staggered look in the reference relies on.
 */
const topRow = [
  { src: "/images/FurnitureFoam1.png", alt: "Karmo 180 foam sheets", h: "h-44" },
  { src: "/images/foam-sofa-1965.jpg", alt: "Sofa beside Karmo 1965 foam blocks", h: "h-64" },
  { src: "/images/FurnitureFoam2.png", alt: "Karmo 2001 foam sheets", h: "h-48" },
  { src: "/images/mattress-suite.jpg", alt: "Karmo mattress in a chandelier-lit suite", h: "h-60" },
  { src: "/images/FurnitureFoam4.png", alt: "Karmo Poly foam sheets", h: "h-44" },
  { src: "/images/mattress-family.jpg", alt: "Children playing on a Karmo mattress", h: "h-56" },
];

const bottomRow = [
  { src: "/images/comforter-red-stripe.jpg", alt: "Karmo Red Stripe comforter", h: "h-60" },
  { src: "/images/FurnitureFoam5.png", alt: "Karmo foam sheet range", h: "h-44" },
  { src: "/images/mattress-detail.jpg", alt: "Quilted top of a Karmo mattress", h: "h-52" },
  { src: "/images/fabric-alpona.jpg", alt: "Alpona printed cotton bed sheet fabric", h: "h-48" },
  { src: "/image10.jpg", alt: "Interior finished with Karmo materials", h: "h-64" },
  { src: "/images/foam-karmo-280.jpg", alt: "Stack of Karmo 280 foam blocks", h: "h-48" },
];

const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

function Row({ items }) {
  // The list is rendered twice back to back. The track travels exactly half
  // its width, so the second copy lands where the first started and the loop
  // has no seam.
  const doubled = [...items, ...items];

  return (
    <div className="flex w-max gap-4">
      {doubled.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className={`relative ${item.h} w-[clamp(150px,17vw,260px)] shrink-0 overflow-hidden rounded-xl bg-black/5`}
        >
          <Image
            src={item.src}
            alt={index < items.length ? item.alt : ""}
            aria-hidden={index >= items.length}
            fill
            sizes="(min-width: 1024px) 17vw, 45vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Oversized word behind the rows, the way the reference sets it. */}
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none text-[13vw] font-extrabold leading-none tracking-tighter text-ink/[0.045]"
      >
        gallery
      </span>

      <div className="shell relative">
        <motion.div variants={group} {...reveal} viewport={once}>
          <span className="block overflow-hidden">
            <motion.span
              variants={line}
              className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
            >
              <span className="h-px w-10 bg-brand" />
              Gallery
            </motion.span>
          </span>

          <h2 className="display mt-5 max-w-xl text-[1.75rem] font-light leading-[1.15] text-ink sm:text-[2.15rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                From the block
                <span className="font-bold"> to the bedroom</span>
              </motion.span>
            </span>
          </h2>
        </motion.div>
      </div>

      {/* Rows run past both edges and are masked at the sides so images fade
          out rather than being chopped by a hard border. */}
      <div className="marquee-rows relative mt-12 space-y-4 overflow-hidden">
        <div
          className={
            reduceMotion ? "flex gap-4 overflow-x-auto" : "marquee marquee-left"
          }
        >
          <Row items={topRow} />
        </div>

        <div
          className={
            reduceMotion ? "flex gap-4 overflow-x-auto" : "marquee marquee-right"
          }
        >
          <Row items={bottomRow} />
        </div>
      </div>
    </section>
  );
}
