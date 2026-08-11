"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The client roll — who Karmo actually supplies.
 *
 * Real logos, cut from the client's own "PARTNERS & CLIENTS" sheet
 * (`logos company.jpg`, A4 at 300dpi). The cards on that sheet were found by
 * their orange borders rather than by measuring a grid off a screenshot, then
 * each logo was cropped from the box above its caption rule and trimmed to its
 * own bounding box — see `cut-logos.mjs`. Nothing here is redrawn, retyped or
 * approximated.
 *
 * ── Why the intrinsic size of every file is recorded below ─────────────────
 * The logos are wildly different shapes: Akij is 141x161, Catamount is
 * 414x39 — a ten-to-one difference in aspect. `next/image` needs real width
 * and height to reserve the right box, and with `object-contain` those numbers
 * are also what stops a wide wordmark being stretched to the height of a tall
 * roundel. They are the trimmed sizes, so they are the artwork's true
 * proportions rather than the card's.
 *
 * Height is what is held constant on screen, not width. Logos read as "the
 * same size" when their type is the same size, and matching widths would make
 * Catamount's thin line of text tower over Akij's compact badge.
 *
 * ── Two mismatches on the client's sheet ───────────────────────────────────
 * Worth knowing before anyone reports them as bugs here: the sheet captions
 * one card "Allex" over a NADIA Furniture Limited logo, and another "Earth
 * Footwear Ltd" over a BION logo. The captions match the names in the foam
 * catalogue, so the captions are used — but one of the two is wrong on the
 * client's artwork and they should say which.
 *
 * ── Why a marquee and not a grid ───────────────────────────────────────────
 * Thirty-six logos in a static grid is a wall that nobody reads and a lot of
 * page to scroll past. A moving row reads as "more than we can show you",
 * which is the actual claim, and it costs a fixed three rows of height however
 * many logos get added later.
 *
 * It reuses the marquee already in `globals.css` — the same rig `Reels` runs
 * on — so the edge fade, the hover-pause and the two speeds are the page's
 * existing behaviour rather than a second implementation of it. Each row's
 * track is rendered twice and travels -50%, which is what makes the loop
 * seamless; the duplicate is `aria-hidden` so the list is announced once.
 */

/* Trimmed intrinsic sizes, straight from the cutting script's manifest. If the
   sheet is ever re-cut these have to be regenerated with it — a stale pair
   silently letterboxes or stretches the artwork rather than failing. */
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

/**
 * Deal into three rows round-robin rather than in slabs, so no row ends up
 * being all footwear — a row of nothing but shoe brands reads as "supplies
 * footwear", which is the opposite of what the section is for.
 */
const ROWS = 3;
const rows = Array.from({ length: ROWS }, (_, r) =>
  logos.filter((_, i) => i % ROWS === r)
);

/** Rounded down to a ten, so the claim can never outrun the list. */
const CLAIMED = Math.floor(logos.length / 10) * 10;

/**
 * One logo.
 *
 * The box is a fixed height and `w-auto`, so each logo keeps its own width and
 * the row spaces itself by how wide the artwork actually is. Greyed back and
 * lifted to full colour on hover: thirty-six full-colour logos at once is a
 * fruit salad that competes with everything else on the page, and the greyscale
 * is what makes them read as one set.
 */
function Logo({ item }) {
  return (
    <span className="mr-3 flex h-[86px] shrink-0 items-center justify-center border border-ink/10 bg-white px-8 transition-colors duration-300 hover:border-brand/35 lg:mr-4 lg:h-[100px] lg:px-10">
      <Image
        src={`/karmo/images/partners/${item.slug}.png`}
        alt={item.name}
        width={item.w}
        height={item.h}
        sizes="240px"
        className="h-auto max-h-[46px] w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 lg:max-h-[54px] lg:max-w-[180px]"
      />
    </span>
  );
}

function Row({ items, direction }) {
  return (
    <div className="marquee-rows overflow-hidden">
      <div
        className={`marquee flex w-max ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
      >
        {items.map((item) => (
          <Logo key={item.slug} item={item} />
        ))}
        {/* The duplicate that makes the loop seamless. Hidden from assistive
            tech so the list is announced once, not twice. */}
        <span aria-hidden className="flex">
          {items.map((item) => (
            <Logo key={`${item.slug}-copy`} item={item} />
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
    <section className="bg-cream/60 py-20 lg:py-28">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            Partners &amp; Clients
          </span>
          <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Trusted by <span className="font-bold text-brand">{CLAIMED}+</span> names
            <br />
            you already know
          </h2>
          <p className="body-copy mx-auto mt-5 max-w-[46rem] text-[14.5px] leading-[1.75] text-ink/55">
            Furniture makers, footwear manufacturers, retail chains, hotels and
            hospitals across Bangladesh build on Karmo foam — many of them since
            long before the brands became household names.
          </p>
        </motion.div>
      </motion.div>

      {/* Full-bleed, unlike the heading above it. The rows are meant to run off
          both edges — that is what says the list continues past the frame — so
          they sit outside `.shell` and the edge fade in `.marquee-rows` does
          the rest. */}
      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-12 space-y-3 lg:mt-14 lg:space-y-4"
      >
        {rows.map((items, i) => (
          <Row key={i} items={items} direction={i % 2 === 0 ? "left" : "right"} />
        ))}
      </motion.div>
    </section>
  );
}
