"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as card, VIEWPORT } from "./motion";

/**
 * The trust strip — four reasons to stay, read on the way past the hero.
 *
 * It was six icon cards on a self-advancing rail. It is now four picture tiles
 * with the claim set over the photograph, which is the layout the client sent
 * as reference. Four fixed tiles need no carousel, so the rail, its autoplay,
 * the doubled track and the position markers all went with it.
 *
 * The claims the layout the client originally sent were lifted from an Indian
 * mattress site, so they were that company's, not Karmo's: "5k+ Stores Pan
 * India", "Million families worldwide", "Recognised Super Brand". Those were
 * rewritten to what Karmo can stand behind; the ones still unconfirmed are
 * flagged in HOMEPAGE-STATUS.md §6.8. Two more — Natural & sustainable, and
 * Free delivery — were dropped when this came down to four. Free delivery is
 * one of the two claims that is actually confirmed (Karmo's own campaign
 * posters advertise it), so it is the first candidate if a fifth is ever
 * wanted back.
 *
 * On the pictures: every tile wants a photograph with a quiet half for the
 * type to sit in. Most of Karmo's library is campaign posters with headlines
 * already burned into them, which cannot take a second layer of text, so these
 * four are the clean ones the rest of this page is not already using. They are
 * scenes rather than the flat-field product shots of the reference — see the
 * note in IMAGE-PROMPTS.md for what to generate to match it properly.
 */
const trustPoints = [
  {
    index: "01",
    title: "A legacy of 60 years",
    note: "Of comfort since 1965",
    image: "/karmo/images/hero/legacy-slide-3-bedding.png",
    alt: "Three generations of a family together on a bed dressed in Karmo bedding",
  },
  {
    index: "02",
    title: "Trusted by families",
    note: "Across Bangladesh",
    image: "/karmo/images/hero/legacy-slide-1-bedroom.png",
    alt: "A couple reading together on the floor beside a Karmo mattress",
  },
  {
    index: "03",
    title: "Market leader in foam",
    note: "By volume, nationwide",
    image: "/karmo/images/hero/legacy-slide-2-livingroom.png",
    alt: "A living room of upholstered sofas built on Karmo foam",
  },
  {
    index: "04",
    title: "Stockists nationwide",
    note: "In cities across the country",
    image: "/karmo/images/mattress/suite-interior.jpg",
    alt: "A Karmo mattress dressed on a bed in a lamplit showroom suite",
  },
];

/**
 * One tile. The claim sits on the photograph, bottom right, over a scrim that
 * only covers the lower half — enough to hold white type without dimming the
 * picture into a grey rectangle.
 */
function TrustTile({ item }) {
  return (
    <article className="group relative aspect-[4/3] overflow-hidden">
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-shade-deep/85 via-shade-deep/30 to-transparent"
      />

      {/* Corner index, the same numbering the section headings use. */}
      <span
        aria-hidden="true"
        className="display absolute right-5 top-5 text-[11px] font-bold tabular-nums tracking-[0.1em] text-white/50"
      >
        {item.index}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 text-right lg:p-7">
        <h3 className="display text-[0.95rem] font-bold uppercase leading-tight tracking-[0.16em] text-white lg:text-[1.05rem]">
          {item.title}
        </h3>
        <p className="mt-2 text-[11.5px] italic text-white/70 underline decoration-white/30 underline-offset-4 transition-colors duration-500 group-hover:decoration-brand">
          {item.note}
        </p>
      </div>
    </article>
  );
}

export default function Capabilities({ heading }) {
  const reduceMotion = useReducedMotion();

  return (
    // A shade lighter than the linen panel, and on the same cool hue, so the
    // three light tones on the page step white → this → linen rather than
    // mixing a warm off-white in with cool ones.
    <section className="relative overflow-hidden bg-[#f7f8fa] py-16 md:py-24">
      {/* Heading is optional, and Home 01 runs this section without one —
          bare, straight under the hero, where a numbered header would be a
          second headline competing with the hero above it. It stays in the
          shell when there is one; the tiles below never do. */}
      {heading && <div className="shell relative">{heading}</div>}

      {/* Full bleed, like the product grid and the division wall: the tiles run
          to both screen edges rather than stopping at the page gutter, so on a
          1920 monitor they get the whole width instead of the shell's 1440. */}
      <motion.div
        variants={group}
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={VIEWPORT}
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ${
          heading ? "mt-14" : ""
        }`}
      >
        {trustPoints.map((item) => (
          <motion.div key={item.title} variants={card}>
            <TrustTile item={item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
