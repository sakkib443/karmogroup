"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

/**
 * Hero — the reference's composition, Home 01's voice.
 *
 * Kept from the reference: one full-bleed photograph, everything centred, a
 * single headline large enough to carry the whole frame.
 *
 * Taken from Home 01: the two-register headline (a light lead-in over an
 * extra-bold statement), the rule-and-caps eyebrow in Karmo red, and the
 * button pair — a solid red pill beside an outlined one with a red disc that
 * turns 45° on hover. Every line arrives by sliding up out of its own clipping
 * sleeve, which is Home 01's signature reveal; nothing here simply fades.
 */

/* ── TRIAL ────────────────────────────────────────────────────────────────
   Home 01's three hero photographs, cycling behind fixed copy.

   Home 01 changes its headline with each slide; this does not — the request
   was for the backgrounds, and rotating the words as well would mean writing
   three headlines to test one picture. Only the image moves.

   To drop it and go back to a single still: delete SLIDES, restore the single
   <Image> in the background layer, and remove the `slide` state. Nothing else
   in the component depends on it. */
const SLIDES = [
  {
    src: "/images/hero/slide-1-hometex-couple.png",
    alt: "Couple reading together on a jute rug beside a bed dressed in Karmo HomeTex bedding",
  },
  {
    src: "/images/hero/slide-2-mattress-suite.png",
    alt: "Quilted Karmo euro-top mattress on a low walnut bed frame in a sunlit bedroom",
  },
  {
    src: "/images/hero/slide-3-foam-livingroom.png",
    alt: "Sunlit living-room corner with a cream bouclé sofa built on Karmo upholstery foam",
  },
];

const SLIDE_MS = 6000;

// power4.inOut — slow to leave, quick through the middle, long to settle.
// The same curve Home 01 uses, so the two heroes feel like one hand.
const POWER4 = [0.76, 0, 0.24, 1];

const lineRise = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.4, ease: POWER4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
};

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(0);

  // Held still for anyone who has asked for less motion — a hero that changes
  // underneath you is exactly what that setting is for.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setSlide((i) => (i + 1) % SLIDES.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, [reduce]);

  // Stands in for the reference's parallax plugin: the photograph travels
  // slower than the page, so the copy appears to lift off it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  // With motion turned down the copy is simply present — no sleeves, no rise.
  const motionProps = reduce
    ? {}
    : { variants: stagger, initial: "hidden", animate: "show" };
  const line = reduce ? {} : { variants: lineRise };

  return (
    <div ref={ref} className="hero dark-section">
      <motion.div className="hero-bg" style={reduce ? undefined : { y }}>
        {SLIDES.map((item, i) => (
          <Image
            key={item.src}
            src={item.src}
            // Only the slide on screen is described; the other two would be
            // read out as duplicate descriptions of a picture nobody can see.
            alt={i === slide ? item.alt : ""}
            aria-hidden={i === slide ? undefined : true}
            fill
            // The first frame is what the visitor waits on, so only it is
            // prioritised; the rest load in the background before their turn.
            priority={i === 0}
            sizes="100vw"
            className="hero-slide"
            style={{ objectFit: "cover", opacity: i === slide ? 1 : 0 }}
          />
        ))}
      </motion.div>

      <div className="container">
        <motion.div className="hero-content-box" {...motionProps}>
          <span className="block overflow-hidden">
            <motion.span {...line} className="hero-eyebrow">
              Comfort, engineered since 1965
            </motion.span>
          </span>

          <h1 className="hero-title">
            {/* Each register gets its own sleeve so the two lines arrive one
                after the other rather than as a block. The padding/negative
                margin pair gives descenders room the clip would otherwise
                shear off. */}
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span {...line} className="title-light">
                Crafted comfort for
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span {...line} className="title-bold">
                every Bangladeshi home
              </motion.span>
            </span>
          </h1>

          <span className="block overflow-hidden">
            <motion.span {...line} className="hero-lead body-copy block">
              Foam, mattresses, HomeTex bedding and polymers — manufactured in
              Dhaka since 1965 and delivered to all 64 districts.
            </motion.span>
          </span>

          <span className="block overflow-hidden">
            <motion.span {...line} className="hero-actions">
              <Link href="#categories" className="btn-default">
                Explore Products
              </Link>

              <Link href="/find-store" className="btn-outline">
                Find a store
                <span className="icon">
                  <FiArrowUpRight />
                </span>
              </Link>
            </motion.span>
          </span>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.3 }}
      >
        <span>Scroll</span>
        <motion.i
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown />
        </motion.i>
      </motion.div>
    </div>
  );
}
