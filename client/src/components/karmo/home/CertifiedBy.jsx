"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useGlobal, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { certified } from "@/cms/pages/global";

/**
 * Awards & trust — above the footer on every karmo-2 page.
 * Gold marks on the dark band: number one plus the certification badges
 * (transparent, no plate). Content: Admin → Site content → Brand & contact →
 * Certifications.
 */
export default function CertifiedBy() {
  const c = useGlobal("certified", certified.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;
  const pillars = c.pillars || [];

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a] pt-12 pb-12 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16"
      aria-label="Awards and certifications"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(212,67,72,0.12),transparent_48%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/70"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mx-auto w-full max-w-[1840px] px-5 md:px-8 lg:px-10 xl:px-12"
      >
        <motion.header
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="display section-heading title-card-line uppercase text-white">
            <CmsText value={c.heading} size={c.headingSize} />
          </h2>
          {c.intro ? (
            <p className="mt-4 text-[13px] leading-relaxed text-white/55 sm:text-[14px]" style={{ whiteSpace: "pre-line" }}>
              {c.intro}
            </p>
          ) : null}
        </motion.header>

        <motion.ul
          variants={group}
          className={`mt-12 grid grid-cols-1 sm:mt-14 md:mt-16 md:grid-cols-2 ${
            pillars.length === 3 ? "lg:grid-cols-3" : pillars.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
          }`}
        >
          {pillars.map(({ image, title, body }, i) => (
            <motion.li
              key={`${i}-${title}`}
              variants={fade}
              className={`relative flex flex-col items-center px-5 py-8 text-center md:px-8 md:py-10 lg:px-10 lg:py-2 xl:px-12 ${
                i < pillars.length - 1 ? "border-b border-white/20" : ""
              } ${i < 2 ? "md:border-b md:border-white/20" : "md:border-b-0"} lg:border-b-0`}
            >
              {i % 2 === 0 || i < pillars.length - 1 ? (
                <span
                  aria-hidden
                  className={`pointer-events-none absolute top-1/2 right-0 hidden h-[58%] w-px -translate-y-1/2 bg-white/20 ${
                    i % 2 === 0 ? "md:block" : ""
                  } ${i < pillars.length - 1 ? "lg:block" : "lg:hidden"}`}
                />
              ) : null}
              <div className="relative flex h-[13.5rem] w-[13.5rem] items-center justify-center sm:h-[15.5rem] sm:w-[15.5rem] lg:h-[17rem] lg:w-[17rem]">
                {image?.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt || title || ""}
                    width={2048}
                    height={2048}
                    sizes="(min-width: 1024px) 272px, 248px"
                    unoptimized
                    className="h-full w-full object-contain"
                    style={imageStyle(image)}
                  />
                ) : null}
              </div>
              <h3 className="display mt-5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white sm:mt-6">
                {title}
              </h3>
              <p className="body-copy mt-2.5 max-w-[18rem] text-[13px] leading-[1.65] text-white/70 sm:text-[14px]">
                {body}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {c.footnote ? (
          <motion.p
            variants={fade}
            {...reveal}
            viewport={VIEWPORT}
            className="mx-auto mt-10 max-w-4xl text-center text-[10px] leading-relaxed tracking-[0.02em] text-white/35 sm:mt-12 sm:text-[11px]"
          >
            {c.footnote}
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}
