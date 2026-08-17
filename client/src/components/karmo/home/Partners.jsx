"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The client roll — who Karmo actually supplies.
 *
 * Real logos, cut from the client's own "PARTNERS & CLIENTS" sheet
 * (`logos company.jpg`). Intrinsic sizes below keep each mark's true ratio
 * under `object-contain`. The marquee is a sample of a longer list — the
 * "100+" claim is the client's figure for the wider network this strip
 * represents, not a count of files in the folder.
 */

const logos = [
  { slug: "rfl", name: "RFL", w: 178, h: 161 },
  { slug: "navana-group", name: "Navana Group", w: 365, h: 123 },
  { slug: "partex-star", name: "Partex Star", w: 369, h: 121 },
  { slug: "brothers-furniture", name: "Brothers Furniture", w: 414, h: 55 },
  { slug: "athena", name: "Athena", w: 369, h: 118 },
  { slug: "legacy-furniture", name: "Legacy Furniture", w: 349, h: 142 },
  { slug: "hatim-furniture", name: "Hatim Furniture", w: 229, h: 120 },
  { slug: "allex", name: "Allex", w: 336, h: 122 },
  { slug: "isho-furniture", name: "ISHO Furniture", w: 273, h: 140 },
  { slug: "furniture-concept-interior", name: "Furniture Concept & Interior Ltd.", w: 224, h: 146 },
  { slug: "sr-furniture", name: "SR Furniture", w: 237, h: 144 },
  { slug: "hi-tech-lifestyle-furniture", name: "Hi-Tech Lifestyle & Furniture", w: 384, h: 128 },
  { slug: "hi-fashion-gallery", name: "Hi-Fashion Gallery", w: 230, h: 154 },
  { slug: "market-access-group", name: "Market Access Group", w: 205, h: 154 },
  { slug: "earth-footwear", name: "Earth Footwear Ltd.", w: 360, h: 56 },
  { slug: "apex", name: "Apex", w: 343, h: 139 },
  { slug: "bay-footwear", name: "Bay Footwear", w: 279, h: 140 },
  { slug: "panda-footwear", name: "Panda Footwear", w: 189, h: 154 },
  { slug: "lotto", name: "Lotto", w: 310, h: 100 },
  { slug: "akij-group", name: "Akij Group", w: 141, h: 161 },
  { slug: "runner", name: "Runner", w: 414, h: 53 },
  { slug: "bata", name: "Bata", w: 364, h: 84 },
  { slug: "step", name: "Step", w: 152, h: 136 },
  { slug: "catamount", name: "Catamount", w: 414, h: 39 },
  { slug: "hamko-footwear", name: "Hamko Footwear", w: 351, h: 132 },
  { slug: "pegasus", name: "Pegasus", w: 376, h: 130 },
  { slug: "aftab", name: "Aftab", w: 209, h: 161 },
  { slug: "progressive", name: "Progressive", w: 352, h: 151 },
  { slug: "mk-footwear", name: "MK Footwear", w: 190, h: 154 },
  { slug: "tk-footwear", name: "T.K Footwear Ltd.", w: 406, h: 74 },
  { slug: "pioneer-group", name: "Pioneer Group", w: 210, h: 145 },
  { slug: "leatherx-footwear", name: "Leatherx Footwear", w: 301, h: 155 },
  { slug: "royal-footwear", name: "Royal Footwear Ltd.", w: 331, h: 82 },
  { slug: "italy-footwear", name: "Italy Footwear Ltd.", w: 393, h: 134 },
  { slug: "edison-footwear", name: "Edison Footwear", w: 315, h: 133 },
  { slug: "glogo-industry", name: "Glogo Industry Ltd.", w: 173, h: 155 },
];

/** Round-robin into three rows so no strip is all footwear. */
const ROWS = 3;
const rows = Array.from({ length: ROWS }, (_, r) =>
  logos.filter((_, i) => i % ROWS === r)
);

/** Client claim for the wider partner network this strip samples. */
const CLAIMED = 100;

function LogoTile({ item }) {
  return (
    <span className="group relative mr-3 flex h-[4.75rem] shrink-0 items-center justify-center border border-ink/8 bg-white px-7 transition-colors duration-300 hover:border-brand/30 sm:h-[5.25rem] sm:px-8 lg:mr-4 lg:h-[5.75rem] lg:px-10">
      <Image
        src={`/karmo/images/partners/${item.slug}.png`}
        alt={item.name}
        width={item.w}
        height={item.h}
        sizes="220px"
        className="h-auto max-h-[40px] w-auto max-w-[140px] object-contain opacity-[0.92] transition-opacity duration-300 group-hover:opacity-100 sm:max-h-[46px] sm:max-w-[160px] lg:max-h-[52px] lg:max-w-[176px]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </span>
  );
}

function Row({ items, direction, still }) {
  if (still) {
    return (
      <div className="flex justify-center gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
        {items.map((item) => (
          <LogoTile key={item.slug} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="marquee-rows overflow-hidden">
      <div
        className={`marquee flex w-max ${
          direction === "left" ? "marquee-left-slow" : "marquee-right-slow"
        }`}
      >
        {items.map((item) => (
          <LogoTile key={item.slug} item={item} />
        ))}
        <span aria-hidden className="flex">
          {items.map((item) => (
            <LogoTile key={`${item.slug}-copy`} item={item} />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function Partners() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-[#F5F5F5] pt-4 pb-8 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12"
      aria-label="Partners and clients"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell-home-two relative text-left"
      >
        {/* Same heading setting as the divisions band above: small red eyebrow,
            one light uppercase line under it, left-aligned and nothing below
            it. The centred version with the leaf rule was the odd one out once
            the other bands lost theirs. */}
        <motion.div variants={fade}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Partners &amp; clients
          </span>
          <h2 className="display mt-1 max-sm:whitespace-normal whitespace-nowrap text-[1.05rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink sm:text-[1.15rem] lg:text-[1.3rem]">
            Trusted by <span className="font-bold text-brand">{CLAIMED}+</span>{" "}
            makers
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-3 space-y-1.5 sm:mt-3.5 lg:mt-4"
      >
        {rows.map((items, i) => (
          <Row
            key={i}
            items={items}
            direction={i % 2 === 0 ? "left" : "right"}
            still={!!reduceMotion}
          />
        ))}
      </motion.div>
    </section>
  );
}
