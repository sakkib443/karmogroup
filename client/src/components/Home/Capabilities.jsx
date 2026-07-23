"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FiTool,
  FiCheckSquare,
  FiTruck,
  FiMapPin,
} from "react-icons/fi";

/**
 * How Karmo works, not what it sells — the Divisions grid above already
 * covers the product lines. Everything here is drawn from the group's own
 * structure: own plants, batch testing, trade supply, dealer network.
 */
const capabilities = [
  {
    icon: FiTool,
    title: ["In-house", "Manufacturing"],
    body: "Foam is poured, cured and cut in our own plants, then finished into mattresses and bedding under the same roof — no third party between the raw material and the product.",
  },
  {
    icon: FiCheckSquare,
    title: ["Quality &", "Testing"],
    body: "Every batch is sampled before it leaves the floor. Density, resilience and compression are checked against the grade on the label, so what you buy performs like it should.",
  },
  {
    icon: FiTruck,
    title: ["Bulk & Trade", "Supply"],
    body: "Furniture makers, footwear factories and project buyers order by the container. Sheet sizes, densities and adhesive grades are cut to the specification you send us.",
  },
  {
    icon: FiMapPin,
    title: ["Nationwide", "Distribution"],
    body: "Stockists and showrooms across Bangladesh keep the range within reach, backed by a dealership programme for partners who want to carry Karmo in their district.",
  },
];

// The two curves the rest of the page moves on.
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const card = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

export default function Capabilities() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  return (
    <section className="relative overflow-hidden bg-[#f7f6f4] py-20 md:py-28">
      {/* Technical line drawing, drawn rather than loaded — a faint wireframe
          of stacked slabs, which is what the group actually makes. Sits at a
          low opacity so it reads as paper texture, never as an illustration
          competing with the cards. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-full w-[70%] text-ink/[0.07]"
        viewBox="0 0 900 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="1">
          {/* Stacked slabs in perspective */}
          <path d="M120 470 L470 380 L780 470 L430 565 Z" />
          <path d="M120 470 L120 520 L430 615 L430 565" />
          <path d="M430 565 L780 470 L780 520 L430 615" />

          <path d="M170 360 L470 280 L730 360 L430 445 Z" />
          <path d="M170 360 L170 402 L430 487 L430 445" />
          <path d="M430 445 L730 360 L730 402 L430 487" />

          <path d="M215 262 L470 192 L688 262 L432 335 Z" />
          <path d="M215 262 L215 298 L432 371 L432 335" />
          <path d="M432 335 L688 262 L688 298 L432 371" />

          {/* Measurement lines */}
          <path d="M60 470 L60 700" strokeDasharray="5 7" />
          <path d="M40 470 L80 470" />
          <path d="M40 700 L80 700" />
          <path d="M120 700 L840 700" strokeDasharray="5 7" />

          {/* Section grid */}
          <path d="M0 150 L900 150" strokeOpacity="0.5" />
          <path d="M0 640 L900 640" strokeOpacity="0.5" />
          <path d="M330 0 L330 800" strokeOpacity="0.5" />
          <path d="M600 0 L600 800" strokeOpacity="0.5" />

          <circle cx="470" cy="192" r="4" />
          <circle cx="120" cy="470" r="4" />
          <circle cx="780" cy="470" r="4" />
        </g>
      </svg>

      <div className="shell relative">
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16"
        >
          {/* Badge sits opposite the headline, with the crosshair rule from
              the reference marking the corner. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 right-0 hidden h-24 w-40 lg:block"
            >
              <span className="absolute right-0 top-0 block h-px w-full bg-ink/15" />
              <span className="absolute right-10 top-0 block h-24 w-px bg-ink/15" />
            </span>

            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Who we are
              </motion.span>
            </span>
          </div>

          <div>
            <h2 className="display text-[2rem] font-bold leading-[1.14] tracking-[-0.02em] text-ink sm:text-[2.6rem] lg:text-[3rem]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  Built On Six Decades
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block text-brand">
                  Of Making Comfort
                </motion.span>
              </span>
            </h2>

            <span className="mt-7 block max-w-lg overflow-hidden">
              <motion.span
                variants={line}
                className="block text-[15px] leading-[1.9] text-ink/65"
              >
                Karmo has manufactured in Bangladesh since 1965. From the foam
                inside a sofa to the mattress on the bed and the adhesive
                holding it together, it is made in our own plants — and held to
                one standard.
              </motion.span>
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {capabilities.map((item) => (
            <motion.article
              key={item.title.join(" ")}
              variants={card}
              className="group rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(34,34,34,0.04),0_12px_32px_-16px_rgba(34,34,34,0.12)] transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(34,34,34,0.05),0_22px_44px_-18px_rgba(34,34,34,0.2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="display text-[1.15rem] font-bold leading-[1.3] text-ink">
                  {item.title[0]}
                  <br />
                  {item.title[1]}
                </h3>

                <item.icon className="mt-1 shrink-0 text-[26px] text-brand transition-transform duration-500 group-hover:-translate-y-0.5" />
              </div>

              {/* Rule fills with brand colour as the card is picked out. */}
              <span className="mt-8 block h-px w-full bg-ink/10">
                <span className="block h-px w-0 bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </span>

              <p className="mt-6 text-[13.5px] leading-[1.85] text-ink/60">
                {item.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
