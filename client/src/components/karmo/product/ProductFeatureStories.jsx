"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Helix-style feature story bands under the lifestyle slider —
 * one job each: image + short comfort claim.
 */

const bands = [
  {
    id: "cool",
    eyebrow: "Cooler nights",
    title: "Air that moves with you",
    body: "Breathable covers and open foam structure keep heat from building — so rest stays dry and easy through the night.",
    src: "/karmo/images/mattress/why/why-sweaty-v5.jpg",
    alt: "Cool, breathable sleep on a Karmo mattress",
    imageLeft: true,
  },
  {
    id: "support",
    eyebrow: "Lasting support",
    title: "Aligned from head to heel",
    body: "Layered foam and spring support hold posture without a hard edge — pressure eased where you need it most.",
    src: "/karmo/images/mattress/why/why-posture-v5.jpg",
    alt: "Supportive sleep posture on a Karmo mattress",
    imageLeft: false,
  },
  {
    id: "craft",
    eyebrow: "Made to last",
    title: "Tested, one by one",
    body: "Every Karmo mattress is checked for feel and finish before it leaves — craft you can feel on the first night.",
    src: "/karmo/images/mattress/products/orthopedic-room.jpg",
    alt: "Karmo Orthopedic mattress in a calm bedroom",
    imageLeft: true,
  },
];

export default function ProductFeatureStories() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <div className="bg-white">
      {bands.map((band) => (
        <section
          key={band.id}
          className="mt-[6px] overflow-hidden bg-[#F7F6F4]"
        >
          <motion.div
            variants={group}
            {...reveal}
            viewport={VIEWPORT}
            className={`grid min-h-[min(56svh,480px)] lg:min-h-[min(62svh,560px)] lg:grid-cols-2 ${
              band.imageLeft ? "" : "lg:[&>*:first-child]:order-2"
            }`}
          >
            <motion.div variants={fade} className="relative min-h-[min(42svh,320px)] lg:min-h-0">
              <Image
                src={band.src}
                alt={band.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </motion.div>

            <motion.div
              variants={fade}
              className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
                {band.eyebrow}
              </p>
              <h2 className="display mt-3 max-w-[16ch] text-[1.55rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.85rem] lg:text-[2.1rem]">
                {band.title}
              </h2>
              <p className="body-copy mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
                {band.body}
              </p>
            </motion.div>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
