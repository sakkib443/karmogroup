"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

import { group, rise, VIEWPORT } from "../motion";
import HeadingThree, { Mark } from "./HeadingThree";

/**
 * The curated way in — three shelves rather than a grid of products.
 *
 * Same three destinations Home 01 offers, presented on the opposite principle.
 * There, the three sit in an unequal mosaic with their names set on the
 * photographs: the layout tells you which to look at first, and the type has to
 * survive whatever is behind it. Here they are equal thirds and the type is
 * *under* the picture, on the page rather than on the image.
 *
 * That is the difference between a shop window and a contact sheet, and it is
 * the right one for this page. Curation means the three were chosen; ranking
 * them by plate size says one was chosen harder. The reader picks.
 *
 * It also means the photographs are never asked to hold text, so the crop can
 * be whatever suits the room in it — which matters because all three of these
 * files are 1.68:1 landscape and a taller plate would have to cut a third of
 * the width out of each.
 *
 * Routes and pictures are the ones `Collections.jsx` already uses, so the two
 * designs lead to the same three pages and neither has invented a shelf the
 * catalogue does not have. The order is the only change: newest first, because
 * a curated row is about what has just landed, where a bestseller mosaic is
 * about what already sold.
 */

const shelves = [
  {
    index: "01",
    name: "New arrival",
    line: "Just added to the range",
    href: "/products/new-arrivals",
    image: "/karmo/images/collections/new-arrivals.jpg",
    alt: "A printed cotton Karmo bed sheet made up on a wooden bed",
  },
  {
    index: "02",
    name: "Best selling",
    line: "The ones that move fastest",
    href: "/products/best-selling",
    image: "/karmo/images/collections/best-selling.jpg",
    alt: "A deep-red Karmo comforter laid across a bed in a bright bedroom",
  },
  {
    index: "03",
    name: "Popular products",
    line: "What people buy most",
    href: "/products/popular",
    image: "/karmo/images/collections/popular.jpg",
    alt: "A Karmo pillow-top mattress dressed in white bedding in a sunlit bedroom",
  },
];

export default function Curation() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-linen py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <HeadingThree
            index="03"
            eyebrow="Shop the range"
            title={["Where Signature", <Mark key="a">comfort lies</Mark>]}
            lead="Three ways in: what has just landed, what moves fastest, and what the country buys most of."
          />

          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 border-b border-ink/20 pb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
          >
            Everything in the catalogue
            <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-14 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-7"
        >
          {shelves.map((shelf) => (
            <motion.article key={shelf.href} variants={rise}>
              <Link href={shelf.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={shelf.image}
                    alt={shelf.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                </div>

                {/* The hairline is the hover: it fills from the left in brand
                    red under whichever card the pointer is on, so the row
                    responds without the picture having to move much. */}
                <span className="relative mt-6 block h-px w-full bg-ink/15">
                  <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </span>

                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <span className="display block text-[11px] font-bold tabular-nums tracking-[0.1em] text-ink/30">
                      {shelf.index}
                    </span>
                    <h3 className="display mt-2 text-[1.3rem] font-semibold! tracking-[-0.025em] text-ink lg:text-[1.45rem]">
                      {shelf.name}
                    </h3>
                    <p className="body-copy mt-1.5 text-[13px] text-ink/55">
                      {shelf.line}
                    </p>
                  </div>

                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <FiArrowUpRight />
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
