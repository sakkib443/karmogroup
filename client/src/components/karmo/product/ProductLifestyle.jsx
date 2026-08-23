"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Lifestyle band — shows the foam inside real furniture, not a pasted ad strip.
 */
const scenes = [
  {
    src: "/karmo/images/home-02/divisions/foam-karmo-zuti-sofa-olive.webp",
    alt: "Olive Karmo foam sofa in a styled room",
    caption: "Seating that holds its shape",
  },
  {
    src: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
    alt: "Blue velvet sofa with Karmo foam core",
    caption: "Comfort you can sink into",
  },
  {
    src: "/karmo/images/home-02/divisions/foam-karmo-sofa-lavender-blocks.jpeg",
    alt: "Stacked Karmo foam blocks beside seating",
    caption: "The grade inside every cushion",
  },
];

export default function ProductLifestyle() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-white py-8 md:py-10 lg:py-12">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell"
      >
        <motion.div variants={fade} className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            In the home
          </span>
          <h2 className="display mt-3 text-[1.65rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.1rem]">
            Comfort without{" "}
            <span className="font-bold text-brand">compromise</span>
          </h2>
          <LeafRule />
          <p className="body-copy mt-5 text-[14px] leading-relaxed text-ink/55">
            The sofa you see is only half the story. Inside every cushion is
            Karmo foam — poured for density, cut for the frame, built to last
            through years of everyday sitting.
          </p>
        </motion.div>

        <motion.ul
          variants={group}
          className="mt-10 grid gap-3 sm:grid-cols-3 lg:mt-14"
        >
          {scenes.map((scene) => (
            <motion.li key={scene.src} variants={fade} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                <Image
                  src={scene.src}
                  alt={scene.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-shade-deep/75 to-transparent"
                />
                <span className="absolute bottom-4 left-4 right-4 text-[12px] font-bold uppercase tracking-[0.1em] text-white">
                  {scene.caption}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
