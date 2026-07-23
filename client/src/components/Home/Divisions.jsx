"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The four divisions from Karmo's own site map. Product names and counts are
 * taken from "Site Reference Final.xlsx" — the group's own listing — rather
 * than invented.
 *
 * NOTE: the chemicals card borrows a lifestyle shot because there is no
 * adhesive or factory photograph yet. It is the only card whose picture does
 * not show what it sells.
 */
const divisions = [
  {
    tag: "Foam",
    title: "Furniture & Upholstery",
    products: "Karmo Poly · Karmo HD · Karmo Signature",
    count: "9 grades",
    href: "/foam",
    image: "/SLIDE02.png",
    alt: "Living room seating built on Karmo upholstery foam",
  },
  {
    tag: "Foam",
    title: "Footwear, Auto & Acoustic",
    products: "Peeling Roll · High Density · Memory",
    count: "4 applications",
    href: "/foam",
    image: "/images/FurnitureFoam1.png",
    alt: "Stack of Karmo 180 branded foam sheets",
  },
  {
    tag: "Mattress",
    title: "EuroTop & Pocket Spring",
    products: "Karmo King · Prestige · Orthopaedic",
    count: "9 models",
    href: "/mattress",
    image: "/SLIDE01.png",
    alt: "Bedroom with a Karmo mattress and timber bed frame",
  },
  {
    tag: "HomeTex",
    title: "Pillows, Sheets & Comforters",
    products: "Relax Time · Plush · Cushion",
    count: "5 ranges",
    href: "/hometex",
    image: "/SLIDE03.png",
    alt: "Beds dressed in Karmo sheets, pillows and comforters",
  },
  {
    tag: "Chemicals",
    title: "Adhesives & Polymers",
    products: "Karmo Bond · Evergain · Sodium Silicate",
    count: "16 products",
    href: "/chemicals",
    image: "/image10.jpg",
    alt: "Interior finished with materials bonded by Karmo adhesives",
  },
];

const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const card = {
  hidden: { opacity: 0, y: 46 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: SETTLE } },
};

// Each card's picture is uncovered by its own curtain rather than fading in.
const curtain = {
  hidden: { y: "0%" },
  show: { y: "-101%", transition: { duration: 1, ease: SWEEP } },
};

export default function Divisions() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  return (
    <section className="relative overflow-hidden bg-linen py-16 md:py-20">
      {/* Wireframe drawn rather than loaded, set top-right so it does not
          collide with the line art in the section further down the page. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-10 hidden h-[560px] w-[46%] text-ink/[0.06] lg:block"
        viewBox="0 0 700 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="1">
          <path d="M90 420 L350 330 L640 420 L380 512 Z" />
          <path d="M90 420 L90 250 L350 160 L350 330" />
          <path d="M350 330 L640 420 L640 250 L350 160" />
          <path d="M380 512 L380 342" strokeDasharray="4 8" />

          <path d="M150 250 L150 400" strokeOpacity="0.6" />
          <path d="M225 224 L225 374" strokeOpacity="0.6" />
          <path d="M300 197 L300 347" strokeOpacity="0.6" />
          <path d="M430 190 L430 345" strokeOpacity="0.6" />
          <path d="M510 218 L510 372" strokeOpacity="0.6" />

          <path d="M0 120 L700 120" strokeOpacity="0.45" />
          <path d="M0 560 L700 560" strokeOpacity="0.45" />

          <circle cx="350" cy="160" r="4" />
          <circle cx="90" cy="420" r="4" />
          <circle cx="640" cy="420" r="4" />
        </g>
      </svg>

      <div className="shell relative">
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16"
        >
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
                What we make
              </motion.span>
            </span>
          </div>

          <div>
            <h2 className="display text-[1.75rem] font-bold leading-[1.14] tracking-[-0.02em] text-ink sm:text-[2.15rem] lg:text-[2.5rem]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  Four Divisions That
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block text-brand">
                  Share One Standard
                </motion.span>
              </span>
            </h2>

            <span className="mt-5 block max-w-lg overflow-hidden">
              <motion.span
                variants={line}
                className="block text-[14px] leading-[1.8] text-ink/65"
              >
                Foam for furniture, footwear and automotive use. Mattresses for
                every kind of sleep. Bedding that finishes the room. And the
                adhesives industry runs on — all made in our own plants.
              </motion.span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* The row runs nearly edge to edge rather than inside the page gutter,
          which is what gives the section its width — but it stays on screen.
          Scrolls by touch below lg. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={once}
        // pb only exists to clear the touch scrollbar, so it goes at lg.
        className="relative mt-10 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:px-14 lg:overflow-visible lg:px-6 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-5">
          {divisions.map((division, index) => (
            <motion.article
              // Title, not href — the two foam cards both link to /foam, so
              // keying on the link duplicates and React drops one.
              key={division.title}
              variants={card}
              // Alternating drop gives the row the staggered line the
              // reference has; the first card sets the low position.
              className={`w-[76vw] shrink-0 sm:w-[46vw] lg:w-auto lg:flex-1 ${
                index % 2 === 0 ? "lg:mt-10" : "lg:mt-0"
              }`}
            >
              <Link href={division.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/5">
                  <Image
                    src={division.image}
                    alt={division.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 76vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                  />

                  {/* Glass tag, exactly as in the reference. */}
                  <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors duration-500 group-hover:border-brand group-hover:bg-brand">
                    {division.tag}
                  </span>

                  {/* Arrow slides in from the corner on hover. */}
                  <span className="absolute right-4 top-4 flex h-10 w-10 translate-x-3 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
                    <FiArrowUpRight />
                  </span>

                  <motion.span
                    aria-hidden="true"
                    variants={curtain}
                    className="absolute inset-0 z-10 bg-linen"
                  />
                </div>

                <h3 className="display mt-4 text-[1.05rem] font-bold leading-tight text-ink transition-colors duration-500 group-hover:text-brand">
                  {division.title}
                </h3>

                <p className="mt-2 text-[12px] leading-relaxed text-ink/55">
                  {division.products}
                </p>
                <p className="mt-0.5 text-[12px] text-ink/40">
                  {division.count}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
