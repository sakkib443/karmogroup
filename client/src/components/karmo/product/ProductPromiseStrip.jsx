"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Four service claims under the buy box — illustrated icons (cartoon-v3),
 * same language as the mattress trust strip / reference promise bar.
 */
const DEFAULT_PROMISES = [
  {
    src: "/shared/trust/cartoon-v3/trusted-v3.webp",
    scale: 0.92,
    title: "No Cost EMI",
    note: "Flexible monthly plans on eligible orders",
  },
  {
    src: "/shared/trust/cartoon-v3/superbrand-v3.webp",
    scale: 0.92,
    title: "Quality Checked",
    note: "Every mattress is inspected before it leaves our factory",
  },
  {
    /* Same rider as delivery-v2, with a bolt on the box instead of "FREE DELIVERY". */
    src: "/shared/trust/cartoon-v3/delivery-fast-v1.webp",
    scale: 1,
    title: "Fast Delivery",
    note: "Quick, careful doorstep delivery across Bangladesh",
  },
  {
    src: "/shared/trust/cartoon-v3/legacy-60-v2.webp",
    scale: 1,
    title: "Trusted Since 1965",
    note: "Six decades of comfort from the country's first foam maker",
  },
];

export const FOAM_PROMISES = [
  {
    src: "/shared/trust/cartoon-v3/trusted-v3.webp",
    scale: 0.92,
    title: "No Cost EMI",
    note: "Flexible monthly plans on eligible foam orders",
  },
  {
    src: "/shared/trust/cartoon-v3/superbrand-v3.webp",
    scale: 0.92,
    title: "Cut to your size",
    note: "Sheets and blocks cut clean to the inch for makers",
  },
  {
    src: "/shared/trust/cartoon-v3/delivery-v2.webp",
    scale: 1,
    title: "Free Delivery",
    note: "Doorstep delivery across Bangladesh on this range",
  },
  {
    src: "/shared/trust/cartoon-v3/legacy-60-v2.webp",
    scale: 1,
    title: "Long durability",
    note: "Rubber-grade foam built to hold for years of use",
  },
];

export default function ProductPromiseStrip({ items } = {}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const promises = items?.length ? items : DEFAULT_PROMISES;

  return (
    <section className="border-y border-ink/8 bg-white">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-4 px-6 py-4 md:grid-cols-4 md:gap-5 md:px-10 md:py-5 lg:gap-0 lg:px-16 lg:py-5"
      >
        {promises.map((item, i) => (
          <motion.li
            key={item.title}
            variants={fade}
            className={`group text-center lg:px-4 xl:px-6 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === promises.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[76px] sm:w-[76px]">
              <Image
                src={item.src}
                alt=""
                aria-hidden="true"
                width={76}
                height={76}
                className="absolute inset-0 m-auto h-16 w-16 object-contain sm:h-[76px] sm:w-[76px]"
                style={item.scale !== 1 ? { transform: `scale(${item.scale})` } : undefined}
              />
            </span>
            <h3 className="display mt-1.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {item.title}
            </h3>
            <p className="body-copy mx-auto mt-1 max-w-[11rem] text-[12px] leading-[1.5] text-ink/55 xl:text-[12.5px]">
              {item.note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
