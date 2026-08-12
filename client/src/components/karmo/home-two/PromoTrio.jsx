"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — promo trio.
 *
 * Full viewport height under the header. Images removed for now — three
 * flat panels keep the copy. Light gutters between the shapes.
 */

const VIEW_H = "h-[calc(100svh-80px)] min-h-[calc(100svh-80px)]";
const GAP = "gap-2 md:gap-2.5";

const feature = {
  eyebrow: "New arrival",
  title: "Foam seating collection",
  href: "/foam",
};

const side = [
  {
    id: "mattress",
    title: "Mattress range",
    href: "/mattress",
    tone: "bg-[#ececec]",
  },
  {
    id: "hometex",
    title: "HomeTex bedding",
    href: "/hometex",
    tone: "bg-[#e2e2e2]",
  },
];

function SideCard({ item }) {
  return (
    <Link
      href={item.href}
      className={`group relative flex h-full min-h-[50vh] flex-col justify-center px-5 py-6 sm:px-6 lg:min-h-0 lg:px-7 ${item.tone}`}
    >
      <h3 className="display text-[1.15rem] font-bold uppercase leading-[1.15] tracking-[0.01em] text-ink sm:text-[1.25rem] lg:text-[1.35rem]">
        {item.title}
      </h3>
      <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/35 underline-offset-[5px] transition-colors group-hover:decoration-brand">
        Shop now
      </span>
    </Link>
  );
}

export default function PromoTrio() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="w-full max-w-none bg-white">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid w-full grid-cols-1 bg-white lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] ${GAP} ${VIEW_H}`}
      >
        {/* Left — large feature panel (no image) */}
        <motion.div
          variants={fade}
          className="relative min-h-[50vh] w-full bg-[#f3f3f3] lg:min-h-0 lg:h-full"
        >
          <Link
            href={feature.href}
            className="group flex h-full flex-col justify-center px-6 py-8 sm:px-8 lg:px-10 xl:px-12"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              {feature.eyebrow}
            </span>
            <h2 className="display mt-3 max-w-[14rem] text-[1.55rem] font-bold uppercase leading-[1.12] tracking-[0.01em] text-ink sm:max-w-[16rem] sm:text-[1.85rem] lg:text-[2.1rem] xl:text-[2.25rem]">
              {feature.title}
            </h2>
            <span className="mt-6 inline-flex h-11 w-fit items-center bg-ink px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 group-hover:bg-brand sm:h-12 sm:px-7 sm:text-[12px]">
              Shop now
            </span>
          </Link>
        </motion.div>

        {/* Right — two stacked panels with the same light gutter */}
        <motion.div
          variants={fade}
          className={`grid min-h-0 w-full grid-rows-2 ${GAP}`}
        >
          {side.map((item) => (
            <SideCard key={item.id} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
