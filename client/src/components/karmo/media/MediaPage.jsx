"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import MediaAdsGrid from "@/components/karmo/media/MediaAdsGrid";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { mediaNav } from "@/data/media";

/**
 * Shared Media Center page — hero + sibling tabs + cards or reels.
 */

const VIEW_H = "h-[calc(100svh-112px)] min-h-[calc(100svh-112px)]";

export default function MediaPage({ page }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <>
      <section
        className={`relative w-full overflow-hidden bg-[#1a1a1a] ${VIEW_H}`}
        aria-label={page.title}
      >
        <Image
          src={page.hero.src}
          alt={page.hero.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/40 to-[#1a1a1a]/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.15)_0%,rgba(26,26,26,0.55)_70%)]"
        />

        <div className="shell-home-two relative z-20 flex h-full flex-col items-center justify-center px-4 pb-10 pt-8 text-center sm:pb-14 lg:pb-16">
          <motion.div
            variants={fade}
            {...reveal}
            viewport={VIEWPORT}
            className="mx-auto flex w-full max-w-[44rem] flex-col items-center"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-7 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                {page.eyebrow}
              </span>
              <span className="h-px w-7 bg-brand" />
            </div>
            <h1 className="display section-heading mt-3 whitespace-nowrap text-center uppercase text-white">
              {page.title}
            </h1>
            <p className="body-copy mx-auto mt-4 max-w-[42ch] text-center text-[14px] leading-[1.65] text-white/70 sm:text-[15px]">
              {page.lead}
            </p>
          </motion.div>
        </div>
      </section>

      <nav
        aria-label="Media Center sections"
        className="border-b border-ink/8 bg-[#f6f3ee]"
      >
        <div className="shell-home-two flex flex-wrap justify-center gap-1 py-3 sm:gap-2 sm:py-4">
          {mediaNav.map((item) => {
            const active = item.href === page.path;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors sm:px-4 sm:text-[12px] ${
                  active
                    ? "bg-ink text-white"
                    : "bg-white/70 text-ink/60 hover:bg-white hover:text-ink"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {page.layout === "reels" ? (
        <MediaAdsGrid />
      ) : (
        <section className="bg-[#f6f3ee]">
          <div className="shell-home-two py-10 sm:py-12 lg:py-14">
            <motion.ul
              variants={group}
              {...reveal}
              viewport={VIEWPORT}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
              {page.items.map((item) => (
                <motion.li key={item.id} variants={fade}>
                  <article className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe6de]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={86}
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col border border-t-0 border-ink/8 bg-[#fffefb] px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                          {item.tag}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-ink/35">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="display mt-2 text-[1.05rem] font-bold uppercase leading-[1.2] tracking-[0.02em] text-ink sm:text-[1.15rem]">
                        {item.title}
                      </h3>
                      <p className="body-copy mt-2 flex-1 text-[13px] leading-[1.6] text-ink/55">
                        {item.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors group-hover:decoration-brand">
                        Open
                        <FiArrowRight className="text-[13px] transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
      )}

      <OrderAndContact />
    </>
  );
}
