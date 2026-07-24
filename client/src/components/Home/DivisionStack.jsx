"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The four divisions, dealt as a deck. Each card sticks a little lower than
 * the one before it, so they gather into a stack as the page moves instead of
 * scrolling away — the top edge of every card you have already passed stays on
 * screen as a tab.
 *
 * Shared by both homepages — it began as Home 02's divisions block and now
 * carries Home 01's too, which is why it lives here and not under Home2/.
 * Edit once; it changes in both places. If the two treatments ever need to
 * diverge, fork it then, not before.
 *
 * Counts come from "Site Reference Final.xlsx"; the copy is condensed from the
 * division wording the site already used.
 */
const divisions = [
  {
    index: "01",
    name: "Foam",
    count: "18 grades",
    line: "Furniture, footwear, automotive and acoustic",
    body: "Poured, cured and cut in our own plants. Sheet sizes, densities and grades are cut to the specification you send us — by the piece or by the container.",
    href: "/foam",
    image: "/images/foam-sofa-1965.jpg",
    alt: "Sofa beside a stack of Karmo 1965 foam blocks",
  },
  {
    index: "02",
    name: "Mattress",
    count: "9 models",
    line: "Bonnell, pocket spring, euro top and orthopaedic",
    body: "Quilted on US machinery and edged on European automatic lines, so the mattress holds its thickness. Every batch is sampled before it leaves the floor.",
    href: "/mattress",
    image: "/images/mattress-prestige.jpg",
    alt: "Karmo Prestige mattress on a low timber platform bed",
  },
  {
    index: "03",
    name: "HomeTex",
    count: "5 ranges",
    line: "Pillows, cushions, bed sheets and comforters",
    body: "Classic cotton twills through to sateen weaves, and the country's largest comforter range by distribution. Bedding that finishes the room the foam started.",
    href: "/hometex",
    image: "/images/comforter-red-stripe.jpg",
    alt: "Karmo Red Stripe comforter, rolled",
  },
  {
    index: "04",
    name: "Chemicals",
    count: "16 products",
    line: "Adhesives, polymers and sodium silicate",
    body: "The least visible division and the one in almost every room it touches — shoe adhesives, contact adhesives, sealants and the polymers industry runs on.",
    href: "/chemicals",
    image: "/image10.jpg",
    alt: "Interior finished with materials bonded by Karmo adhesives",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

/**
 * Two palettes, one layout. Home 02 is dark the whole way down; Home 01 is
 * editorial and light, and a slate panel dropped into it reads as a section
 * borrowed from another site.
 *
 * Every value here is a complete utility name on purpose — Tailwind scans this
 * file for literal strings, so a class assembled from fragments at runtime
 * would never make it into the stylesheet.
 */
const TONES = {
  dark: {
    section: "bg-shade",
    heading: "text-white",
    card: "border-white/10 bg-shade-deep",
    meta: "text-white/40",
    name: "text-white",
    body: "text-white/55",
    button: "btn-secondary border-white/20 text-white",
    scrimY: "from-shade-deep/70",
    scrimX: "lg:from-shade-deep lg:via-shade-deep/20",
  },
  light: {
    section: "bg-linen",
    heading: "text-ink",
    card: "border-ink/10 bg-white",
    meta: "text-ink/40",
    name: "text-ink",
    body: "text-ink/60",
    // No btn-secondary here: its hover fills white and turns the border white
    // too, which on a white card leaves nothing to see.
    button: "border-ink/15 text-ink hover:border-brand hover:text-brand",
    scrimY: "from-white/75",
    scrimX: "lg:from-white lg:via-white/25",
  },
};

export default function DivisionStack({ tone = "dark" }) {
  const reduceMotion = useReducedMotion();
  const t = TONES[tone] ?? TONES.dark;

  return (
    <section className={`${t.section} py-20 md:py-28`}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: SETTLE }}
        className="shell"
      >
        <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          <span className="h-px w-10 bg-brand" />
          Four divisions
        </span>
        <h2 className={`display mt-5 max-w-2xl text-[1.9rem] font-light leading-[1.1] sm:text-[2.6rem] ${t.heading}`}>
          One group, one standard,
          <span className="font-bold"> four things to sell</span>
        </h2>
      </motion.div>

      {/* Each card is its own sticky context. The top offset grows with the
          index so the cards land staggered rather than perfectly on top of one
          another, leaving a strip of every previous card visible. */}
      <div className="shell mt-14">
        {divisions.map((division, index) => (
          <div
            key={division.name}
            className="sticky mb-8 last:mb-0"
            style={{ top: `${7 + index * 1.6}rem` }}
          >
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: SETTLE }}
              className={`overflow-hidden rounded-3xl border ${t.card}`}
            >
              <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
                <div className="order-2 flex flex-col justify-between gap-8 p-7 sm:p-10 lg:order-1">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="display text-[11px] font-bold tracking-[0.2em] text-brand">
                        {division.index}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${t.meta}`}>
                        {division.count}
                      </span>
                    </div>

                    <h3 className={`display mt-5 text-[2.25rem] font-bold uppercase leading-none tracking-[-0.02em] sm:text-[3rem] ${t.name}`}>
                      {division.name}
                    </h3>

                    <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.1em] text-brand">
                      {division.line}
                    </p>

                    <p className={`body-copy mt-6 max-w-md text-[14px] leading-[1.9] ${t.body}`}>
                      {division.body}
                    </p>
                  </div>

                  <Link
                    href={division.href}
                    className={`group inline-flex w-fit items-center gap-4 rounded-full border py-2 pl-7 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${t.button}`}
                  >
                    Explore {division.name}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                      <FiArrowUpRight />
                    </span>
                  </Link>
                </div>

                <div className="relative order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto lg:min-h-[26rem]">
                  <Image
                    src={division.image}
                    alt={division.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                  {/* Ties the photograph back into the card on the side it
                      meets the copy, so the two halves read as one panel. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r lg:to-transparent ${t.scrimY} ${t.scrimX}`}
                  />
                </div>
              </div>
            </motion.article>
          </div>
        ))}
      </div>
    </section>
  );
}
