"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Dedicated two-banner showcase for the Pillow page.
 * Matches the edge-to-edge layout seen on HomeTex (/hometex) with zero
 * side padding/margins, a subtle gap between images, and responsive scaling.
 */
export default function PillowTwoBanners({
  className = "mb-1.5",
  leftImage = "/pages/hometex/pillow/banner-02.webp",
  leftAlt = "Karmo Relax Time Sleeping Pill pillows",
  rightImage = "/pages/hometex/pillow/KARMO Plush Pillow Comfort.webp",
  rightAlt = "Karmo Plush pillows with plush fiber fill on cozy bed",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative z-[1] w-full">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid w-full grid-cols-1 gap-[6px] md:h-[min(49svh,535px)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
        >
          {/* Left Banner: Karmo Sleeping Pill Artwork */}
          <motion.article
            variants={fade}
            className="group relative h-full min-h-[260px] sm:min-h-[340px] md:min-h-0 overflow-hidden bg-[#b91c1c]"
          >
            <Image
              src={leftImage}
              alt={leftAlt}
              fill
              sizes="(min-width: 768px) 65vw, 100vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              priority={false}
            />
          </motion.article>

          {/* Right Banner: Plush Pillow Texture / Hand Test */}
          <motion.article
            variants={fade}
            className="group relative h-full min-h-[220px] sm:min-h-[280px] md:min-h-0 overflow-hidden bg-[#efe9e3]"
          >
            <Image
              src={rightImage}
              alt={rightAlt}
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              priority={false}
            />
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
