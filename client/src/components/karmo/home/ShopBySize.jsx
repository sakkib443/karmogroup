"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { sizes as section } from "@/cms/pages/home";

/**
 * Mattress sizes — four khats, same beds, mixed natural sleep poses.
 * Two looks (colour cartoon, pencil sketch) toggled by the right arrow.
 * Content: Admin → Site content → Home → Shop by mattress size.
 */

const LOOKS = ["image", "sketch"];

export default function ShopBySize() {
  const c = useSection("sizes", section.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [look, setLook] = useState(0);
  if (c.hidden) return null;
  const items = c.sizes || [];
  const hasSketch = items.some((s) => s.sketch?.src);

  return (
    <section
      aria-label="Shop by mattress size"
      className="relative overflow-hidden bg-white py-8 md:py-10 lg:py-12"
    >
      <TextureSlides lighter />

      <div className="relative z-[1] px-6 md:px-10 lg:px-16">
        <h2 className="display section-heading title-card-line text-center uppercase text-ink">
          <CmsText value={c.title} size={c.titleSize} />{" "}
          <CmsText className="text-brand" value={c.titleAccent} size={c.titleSize} />
        </h2>
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mx-auto mt-6 grid lg:w-[88%] grid-cols-2 gap-x-2 gap-y-6 px-3 sm:mt-7 sm:gap-x-3 sm:px-4 md:mt-8 md:grid-cols-4 md:gap-x-1.5 md:gap-y-0 md:px-3 lg:-mt-6 lg:gap-0 lg:px-2 xl:px-0"
      >
        {items.map((size, idx) => (
          <motion.div key={`${idx}-${size.name}`} variants={fade} className="min-w-0">
            <Link href={size.href || "#"} className="group block">
              <div
                className="relative h-[min(34svh,280px)] w-full sm:h-[min(40svh,340px)] md:h-[min(46svh,400px)] lg:h-[min(56svh,520px)]"
              >
                {LOOKS.map((key, i) => {
                  const pic = size[key];
                  if (!pic?.src) return null;
                  return (
                    <span
                      key={key}
                      className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
                        i === look ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={pic.src}
                        alt={i === look ? pic.alt || "" : ""}
                        aria-hidden={i !== look}
                        fill
                        sizes="25vw"
                        unoptimized
                        className="object-contain"
                        style={imageStyle(pic)}
                      />
                    </span>
                  );
                })}
              </div>
              <p className="display mt-2 text-center text-sm font-semibold lg:-mt-9 uppercase tracking-[0.06em] text-ink/80 transition-colors duration-300 group-hover:text-brand sm:mt-2.5 sm:text-base lg:text-lg">
                {size.name}
              </p>
              <p className="mt-0.5 text-center text-xs leading-snug text-ink/45 sm:text-sm">
                {size.dims}
                {size.dims && size.fits ? <span className="text-ink/25"> · </span> : null}
                {size.fits}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {hasSketch ? (
        <button
          type="button"
          onClick={() => setLook((l) => (l + 1) % LOOKS.length)}
          aria-label={look === 0 ? "Show sketch version" : "Show colour version"}
          className="absolute top-1/2 right-2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
        >
          <FiChevronRight className="text-[20px]" aria-hidden />
        </button>
      ) : null}
    </section>
  );
}
