"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { VideoTile } from "@/components/karmo/product/ProductBuildAside";

/**
 * Foam detail: the mattress page's "Inside every Karmo mattress" band, in foam (client, 28 Nov 2026).
 * Heading in the middle, with this grade's own foam stack (from the client's "Karmo Set Foam Sheet
 * 2025" artwork) faint on the right, then five test clips: two stacked on the left, one tall in
 * the middle, two stacked on the right. Hover a clip for its name.
 */

const SCREEN_H = "calc(100svh - 40px)";
const STACKS = "/products/foam/stacks";

/* Product slug ("poly", "combo-280", "hd" …) → the grade's stack picture. */
const STACK_FOR = {
  poly: "poly",
  280: "280",
  480: "480",
  2001: "2001",
  hd: "hd",
  "4g": "4g",
  signature: "signature",
  1965: "1965",
};

const gradeKey = (slug = "") => {
  const key = String(slug).toLowerCase().replace(/^combo-/, "");
  return STACK_FOR[key] ? key : "poly";
};

export function stackFor(slug = "") {
  return `${STACKS}/${STACK_FOR[gradeKey(slug)]}.webp`;
}

/* The first five clips, kept (client, 28 Nov 2026). Tried and dropped the same day: code-drawn
   compression / density / stretch tests, then two Pexels foam close-ups, in place of three of these. */
const LEFT_CLIPS = [
  { src: "/pages/foam/detail/foam-compression-test.mp4", label: "Compression test" },
  { src: "/pages/foam/videos/acoustic-foam-wall-pan.mp4", label: "Open cells, up close" },
];
const MIDDLE = { src: "/pages/foam/detail/foam-ball-drop.mp4", label: "Ball drop test" };
const RIGHT_CLIPS = [
  { src: "/pages/foam/detail/foam-made-for-home-10s.mp4", label: "Made for home", position: "40% center" },
  { src: "/pages/foam/furniture/videos/foam-furniture-middle-v4.mp4", label: "Breathes freely" },
];

export default function FoamTestingBand({ product }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const stack = stackFor(product?.slug);
  const LEFT = LEFT_CLIPS.map((c) => ({ key: c.src, tile: <VideoTile {...c} /> }));
  const RIGHT = RIGHT_CLIPS.map((c) => ({ key: c.src, tile: <VideoTile {...c} /> }));

  return (
    <section className="relative my-[6px] overflow-x-clip bg-white" aria-label="Inside every Karmo foam">
      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="relative z-[1]">
        <motion.div
          variants={fade}
          className="relative mx-auto flex max-w-[1600px] flex-col items-center px-6 pb-10 pt-12 text-center md:px-14 lg:px-16 lg:pb-12 lg:pt-10"
        >
          {/* A white foam-pore picture behind the heading strip, edge to edge, at full strength (client, 28 Nov 2026).
              Tried and dropped: two quilted fabrics. Before that: the same pore picture at 22% under a 62% white wash.
              The foam stack on the right stays as it was. */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <Image src="/products/foam/foam-pore-texture.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
          </span>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-white/10" />
          {/* This grade's foam stack sits behind the heading, soft and faint, like the mattress cut-away. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex w-full items-center justify-end overflow-hidden lg:w-[56%] lg:pr-[4%]"
          >
            <Image
              src={stack}
              alt=""
              width={1200}
              height={870}
              sizes="(min-width: 1024px) 26vw, 60vw"
              className="h-[88%] w-auto max-w-[62%] object-contain opacity-[0.26]"
            />
          </div>

          <div className="relative min-w-0 max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Inside every Karmo foam</p>
            <h2 className="display mt-3 text-[1.6rem] font-bold uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[1.95rem] lg:text-[2.3rem]">
              Factory tested. <span className="text-brand">Built to last.</span>
            </h2>

            <Link href="/contact" className="group mt-5 inline-flex items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
                Talk to us
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <FiArrowUpRight />
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={fade} className="w-full">
          <div
            className="grid w-full grid-cols-2 gap-1.5 lg:h-[var(--test-h)] lg:[grid-template-columns:var(--cols)] lg:grid-rows-2"
            style={{ ["--test-h"]: SCREEN_H, ["--cols"]: `1fr calc(${SCREEN_H} / 1.5 * 1.07) 1fr` }}
          >
            {LEFT.map((cell, i) => (
              <div key={cell.key} className={`relative aspect-[4/5] min-h-0 sm:aspect-video lg:col-start-1 lg:aspect-auto ${i === 0 ? "lg:row-start-1" : "lg:row-start-2"}`}>
                {cell.tile}
              </div>
            ))}
            <div className="relative col-span-2 aspect-[4/5] min-h-0 lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-auto">
              <VideoTile {...MIDDLE} />
            </div>
            {RIGHT.map((cell, i) => (
              <div key={cell.key} className={`relative aspect-[4/5] min-h-0 sm:aspect-video lg:col-start-3 lg:aspect-auto ${i === 0 ? "lg:row-start-1" : "lg:row-start-2"}`}>
                {cell.tile}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
