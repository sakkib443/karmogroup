"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import SectionLabel from "./SectionLabel";

/**
 * Shop by mattress size — five sizes, drawn from above.
 *
 * The client sent a reference with five illustrated cards and asked for the
 * same, "cartoonized". The illustrations are drawn here in SVG rather than
 * generated: five near-identical beds at different widths is exactly the job a
 * vector does better than a photograph, and it keeps every card in register —
 * same sheet, same pillows, same shadow, only the frame changes.
 *
 * ── The sizes ──────────────────────────────────────────────────────────────
 * The figures are the ones on the client's reference and are NOT yet confirmed
 * as Karmo's own. They are the first thing to check before this goes to the
 * client — a mattress page with someone else's dimensions on it is worse than
 * no page. `CLIENT-FEEDBACK.md` carries the question.
 */

/** Rendered at a common width so the five read as one set at a glance. */
const SLEEPERS = {
  one: [{ x: 50 }],
  two: [{ x: 34 }, { x: 66 }],
  three: [{ x: 30 }, { x: 50, small: true }, { x: 70 }],
  none: [],
};

const sizes = [
  {
    id: "single",
    name: "Single Bed Mattress",
    dims: "200L × 90W × 20H cm",
    href: "/mattress",
    /** Bed width as a share of the card, so the row reads as a size ladder. */
    bed: 46,
    sleepers: SLEEPERS.one,
  },
  {
    id: "twin",
    name: "Twin Bed Mattress",
    dims: "200L × 120W × 20H cm",
    href: "/mattress",
    bed: 58,
    sleepers: SLEEPERS.one,
  },
  {
    id: "queen",
    name: "Queen Size Mattress",
    dims: "200L × 150W × 20H cm",
    href: "/mattress",
    bed: 70,
    sleepers: SLEEPERS.two,
  },
  {
    id: "king",
    name: "King Size Mattress",
    dims: "200L × 180W × 20H cm",
    href: "/mattress",
    bed: 82,
    sleepers: SLEEPERS.three,
  },
  {
    id: "super-king",
    name: "Super King Size Mattress",
    dims: "200L × 200W × 25H cm",
    href: "/mattress",
    bed: 92,
    sleepers: SLEEPERS.none,
  },
];

const C = {
  sheet: "#EDF1F6",
  sheetDeep: "#DCE4EE",
  duvet: "#BFD2E8",
  duvetDeep: "#A8C0DC",
  frame: "#8B5E3C",
  frameDeep: "#6F4930",
  pillow: "#FFFFFF",
  skin: "#F0C9A8",
  hair: "#33302E",
  wear: "#3A322C",
};

/** One bed, seen from above. `w` is the bed's width in viewBox units. */
function BedPlan({ w, sleepers }) {
  const x = (100 - w) / 2;
  return (
    <svg viewBox="0 0 100 132" fill="none" className="h-full w-full">
      {/* Headboard */}
      <rect x={x - 2} y="8" width={w + 4} height="7" rx="2.5" fill={C.frameDeep} />
      <rect x={x - 2} y="8" width={w + 4} height="5" rx="2.5" fill={C.frame} />

      {/* Mattress */}
      <rect x={x} y="15" width={w} height="104" rx="4" fill={C.sheetDeep} />
      <rect x={x} y="15" width={w} height="101" rx="4" fill={C.sheet} />

      {/* Pillows — one per sleeper, or two when the bed is made up empty. */}
      {(sleepers.length ? sleepers : [{ x: 38 }, { x: 62 }]).map((s, i) => (
        <rect
          key={i}
          x={x + (w * (s.x - (s.small ? 7 : 11))) / 100}
          y="21"
          width={(w * (s.small ? 14 : 22)) / 100}
          height="14"
          rx="4"
          fill={C.pillow}
        />
      ))}

      {/* Duvet, turned down */}
      <rect x={x} y="56" width={w} height="60" rx="4" fill={C.duvetDeep} />
      <rect x={x} y="56" width={w} height="56" rx="4" fill={C.duvet} />
      <rect x={x} y="56" width={w} height="5" rx="2.5" fill={C.pillow} />

      {sleepers.map((s, i) => {
        const cx = x + (w * s.x) / 100;
        const r = s.small ? 4.4 : 6;
        return (
          <g key={i}>
            {/* Head */}
            <circle cx={cx} cy={r + 32} r={r} fill={C.hair} />
            <circle cx={cx} cy={r + 33.5} r={r - 1.5} fill={C.skin} />
            {/* Shoulders above the duvet line */}
            <rect
              x={cx - r * 1.5}
              y={r + 39}
              width={r * 3}
              height="10"
              rx={r}
              fill={C.wear}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function ShopBySize() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pt-4 pb-8 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell-home-two"
      >
        <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
          <SectionLabel eyebrow="Perfect fit, perfect sleep">
            Shop by <span className="font-bold text-brand">mattress size</span>
          </SectionLabel>
        </motion.div>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-3 grid grid-cols-2 gap-1 px-1 sm:grid-cols-3 md:mt-3.5 md:gap-1.5 md:px-1.5 lg:grid-cols-5"
      >
        {sizes.map((size) => (
          <motion.div key={size.id} variants={fade} className="min-w-0">
            <Link href={size.href} className="group block">
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#F7F8FA] p-5 transition-colors duration-500 group-hover:bg-[#F0F3F7] sm:p-6">
                <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                  <BedPlan w={size.bed} sleepers={size.sleepers} />
                </div>
              </div>

              <p className="display mt-2.5 text-center text-[13px] font-semibold uppercase leading-tight text-ink/80 transition-colors duration-300 group-hover:text-brand lg:mt-3 lg:text-[14px]">
                {size.name}
              </p>
              <p className="mt-0.5 text-center text-[11px] text-ink/45 lg:text-[12px]">
                {size.dims}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
