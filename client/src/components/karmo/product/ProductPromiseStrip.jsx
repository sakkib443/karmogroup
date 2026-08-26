"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Four service claims under the buy box — illustrated icons (cartoon-v3),
 * same language as the mattress trust strip / reference promise bar.
 */
const promises = [
  {
    src: "/karmo/images/trust/cartoon-v3/trusted.png",
    scale: 0.92,
    title: "No Cost EMI",
    note: "Flexible monthly plans on eligible orders",
  },
  {
    src: "/karmo/images/trust/cartoon-v3/superbrand.png",
    scale: 0.92,
    title: "30 Nights Free Trial",
    note: "Sleep on it — return within 30 nights if it is not right",
  },
  {
    src: "/karmo/images/trust/cartoon-v3/delivery.png",
    scale: 1,
    title: "Free Delivery",
    note: "Doorstep delivery across Bangladesh on this range",
  },
  {
    src: "/karmo/images/trust/cartoon-v3/legacy-60.png",
    scale: 1,
    title: "Up to 20 Years Warranty",
    note: "Covered for long-term durability and manufacturing defects",
  },
];

export default function ProductPromiseStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

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
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-16 sm:w-16">
              <img
                src={item.src}
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 m-auto h-14 w-14 object-contain sm:h-16 sm:w-16"
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
