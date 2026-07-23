"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Who Karmo supplies.
 *
 * These are the trade sectors listed in the group's own site map (foam for
 * furniture, footwear, automotive and acoustic use, plus mattress and bedding
 * retail) — not named companies. The reference build showed four US retailers
 * here (Bedzzz Express, Boll & Branch, BrandsMart USA, City Furniture), all
 * lifted from a competitor's page; naming them would claim client
 * relationships Karmo does not have.
 *
 * To show real clients: give an entry a `logo` path and it renders the image
 * instead of the wordmark. Nothing else needs to change.
 */
const clients = [
  { name: "Furniture Makers", note: "Upholstery foam", logo: null },
  { name: "Footwear Factories", note: "Peeling roll foam", logo: null },
  { name: "Automotive", note: "Contour-cut foam", logo: null },
  { name: "Studios & Acoustics", note: "Acoustic foam", logo: null },
  { name: "Bedding Retail", note: "Mattress & HomeTex", logo: null },
  { name: "Hospitality", note: "Contract supply", logo: null },
  { name: "Export Buyers", note: "Bulk orders", logo: null },
  { name: "Project Contractors", note: "Adhesives & polymers", logo: null },
];

const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

function Plate({ client, hidden }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="group/plate flex h-28 w-[clamp(190px,20vw,250px)] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-ink/10 bg-white px-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_36px_-22px_rgba(34,34,34,0.45)]"
    >
      {client.logo ? (
        <Image
          src={client.logo}
          alt={hidden ? "" : client.name}
          width={160}
          height={48}
          // Grey at rest, colour on hover — the usual treatment that keeps a
          // logo wall from turning into a patchwork.
          className="h-10 w-auto object-contain opacity-60 grayscale transition-all duration-500 group-hover/plate:opacity-100 group-hover/plate:grayscale-0"
        />
      ) : (
        <>
          <span className="display text-center text-[13px] font-bold uppercase tracking-[0.1em] text-ink/70 transition-colors duration-500 group-hover/plate:text-ink">
            {client.name}
          </span>
          <span className="text-[11px] text-ink/40 transition-colors duration-500 group-hover/plate:text-brand">
            {client.note}
          </span>
        </>
      )}
    </div>
  );
}

export default function Clients() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.2 };

  // Rendered twice so the track can travel exactly half its width and loop
  // without a seam.
  const doubled = [...clients, ...clients];

  return (
    <section className="relative overflow-hidden bg-linen py-16 md:py-20">
      <div className="shell relative">
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
              >
                <span className="h-px w-10 bg-brand" />
                Who we supply
              </motion.span>
            </span>

            <h2 className="display mt-5 max-w-xl text-[1.75rem] font-light leading-[1.15] text-ink sm:text-[2.15rem]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  Trusted across
                  <span className="font-bold"> the trade</span>
                </motion.span>
              </span>
            </h2>
          </div>

          <span className="block max-w-xs overflow-hidden">
            <motion.span
              variants={line}
              className="block text-[13px] leading-relaxed text-ink/55"
            >
              From single-container orders to standing contracts, the same
              grades leave the same floor.
            </motion.span>
          </span>
        </motion.div>
      </div>

      <div className="marquee-rows relative mt-12 overflow-hidden">
        <div className={reduceMotion ? "flex gap-4 overflow-x-auto px-6" : "marquee marquee-left"}>
          <div className="flex w-max gap-4">
            {doubled.map((client, index) => (
              <Plate
                key={`${client.name}-${index}`}
                client={client}
                hidden={index >= clients.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
