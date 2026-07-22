"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The four divisions from Karmo's own site map — not invented categories.
 *
 * NOTE: the chemicals card borrows a lifestyle shot because there is no
 * adhesive or factory photograph yet. Swap `image` once one exists; it is the
 * only card here whose picture does not show what it sells.
 */
const divisions = [
  {
    title: "Foam",
    href: "/foam",
    image: "/SLIDE02.png",
    alt: "Living room seating built on Karmo upholstery foam",
  },
  {
    title: "Mattress",
    href: "/mattress",
    image: "/SLIDE01.png",
    alt: "Bedroom with a Karmo mattress and timber bed frame",
  },
  {
    title: "HomeTex / Bedding",
    href: "/hometex",
    image: "/SLIDE03.png",
    alt: "Beds dressed in Karmo sheets, pillows and comforters",
  },
  {
    title: "Chemicals & Polymers",
    href: "/chemicals",
    image: "/image10.jpg",
    alt: "Interior finished with materials bonded by Karmo adhesives",
  },
];

// The two curves used across the site, so this grid moves like everything else.
const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

// Each card's picture is uncovered by its own curtain rather than fading in.
const curtain = {
  hidden: { y: "0%" },
  show: { y: "-101%", transition: { duration: 1, ease: SWEEP } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

export default function Divisions() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.2 };

  return (
    <section className="blueprint relative overflow-hidden bg-linen py-20 md:py-28">
      <div className="shell relative">
        <motion.div variants={grid} {...reveal} viewport={once}>
          <span className="block overflow-hidden">
            <motion.span
              variants={line}
              className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
            >
              <span className="h-px w-10 bg-brand" />
              What we make
            </motion.span>
          </span>

          <h2 className="display mt-6 max-w-2xl text-[2rem] font-light leading-[1.15] text-ink sm:text-[2.5rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                Four divisions, one
                <span className="font-bold"> standard of comfort</span>
              </motion.span>
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={grid}
          {...reveal}
          viewport={once}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {divisions.map((division) => (
            <motion.article key={division.href} variants={card}>
              <Link href={division.href} className="group block">
                {/* Nothing sits over the photograph — no scrim, no tint. The
                    only thing on it is the glass chip, which is small enough
                    to read as a control rather than a layer. */}
                <div className="relative aspect-[5/7] overflow-hidden">
                  <Image
                    src={division.image}
                    alt={division.alt}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />

                  <motion.span
                    aria-hidden="true"
                    variants={curtain}
                    className="absolute inset-0 z-10 bg-linen"
                  />
                </div>

                {/* Name and link share one line under the picture, so neither
                    has to fight the photograph for contrast. */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="display text-[0.95rem] font-semibold leading-tight text-ink">
                    {division.title}
                  </h3>

                  {/* Outlined in brand red and left unfilled — hover only
                      firms up the border and lays a faint tint behind it, so
                      the row never turns into a block of colour. */}
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand transition-colors duration-500 group-hover:border-brand group-hover:bg-brand/10">
                    Read more
                    <FiArrowUpRight className="text-sm transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
