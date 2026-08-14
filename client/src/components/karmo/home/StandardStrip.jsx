"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two trust strip — six pillars in one full row.
 */
const pillars = [
  {
    src: "/karmo/images/trust/legacy-60-years.jpg?v=final",
    title: "A legacy of 60 years",
    note: "of healthy sleep",
  },
  {
    src: "/karmo/images/trust/trusted-families.png?v=Group1686551880",
    title: "Trusted By Million",
    note: "families worldwide.",
  },
  {
    src: "/karmo/images/trust/recognised-super-brand.png?v=orig",
    title: "Recognised By",
    note: "Super Brand",
  },
  {
    src: "/karmo/images/trust/stores-nationwide.png?v=SyP66",
    title: "5k+ Stores",
    note: "Pan Bangladesh",
  },
  {
    src: "/karmo/images/trust/sustainable-products.png",
    title: "Natural and",
    note: "Sustainable Products",
  },
  {
    src: "/karmo/images/trust/free-delivery.png",
    title: "Free Delivery",
    note: "Available",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  // The 6px seam below. Every other band on this page is separated from the
  // next by it — `DivisionEditorials` opens with the same `mt-1 md:mt-1.5`,
  // and the picture rows below carry it between tiles. This strip was the one
  // section still butted straight against its neighbour at 0.
  //
  // A margin, not padding: padding would extend the cream, and the gap has to
  // be the page showing through for it to match the others.
  return (
    <section className="mb-1 bg-white md:mb-1.5">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12"
      >
        {pillars.map(({ src, title, note, plate }, i) => (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-3 xl:px-4 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === pillars.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span
              className={`mx-auto flex h-20 w-20 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem] ${
                plate ? "rounded-2xl bg-[#F2F2F2]" : ""
              }`}
            >
              <img
                src={src}
                alt=""
                aria-hidden="true"
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
              />
            </span>
            <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {title}
            </h3>
            <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
              {note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
