"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { partners } from "@/cms/pages/home";

/**
 * The client roll — who Karmo actually supplies.
 *
 * Real logos, cut from the client's own "PARTNERS & CLIENTS" sheet
 * (`logos company.jpg`). Intrinsic sizes below keep each mark's true ratio
 * under `object-contain`. The marquee is a sample of a longer list — the
 * "100+" claim is the client's figure for the wider network this strip
 * represents, not a count of files in the folder.
 */

/** Round-robin into three rows so no strip is all footwear. The logos themselves:
    Admin → Site content → Home → Partners & clients. */
const ROWS = 3;

function LogoTile({ item }) {
  const logo = item.logo || {};
  if (!logo.src) return null;
  return (
    <span className="group relative mr-3 flex h-[4.75rem] shrink-0 items-center justify-center border border-ink/8 bg-white px-7 transition-colors duration-300 hover:border-brand/30 sm:h-[5.25rem] sm:px-8 lg:mr-4 lg:h-[5.75rem] lg:px-10">
      <Image
        src={logo.src}
        alt={item.name || logo.alt || ""}
        width={logo.width || 300}
        height={logo.height || 120}
        sizes="220px"
        className="h-auto max-h-[40px] w-auto max-w-[140px] object-contain opacity-[0.92] transition-opacity duration-300 group-hover:opacity-100 sm:max-h-[46px] sm:max-w-[160px] lg:max-h-[52px] lg:max-w-[176px]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </span>
  );
}

function Row({ items, direction, still }) {
  if (still) {
    return (
      <div className="flex justify-center gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
        {items.map((item, i) => (
          <LogoTile key={`${i}-${item.name}`} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="marquee-rows overflow-hidden">
      <div
        className={`marquee flex w-max ${
          direction === "left" ? "marquee-left-slow" : "marquee-right-slow"
        }`}
      >
        {items.map((item, i) => (
          <LogoTile key={`${i}-${item.name}`} item={item} />
        ))}
        <span aria-hidden className="flex">
          {items.map((item, i) => (
            <LogoTile key={`${i}-${item.name}-copy`} item={item} />
          ))}
        </span>
      </div>
    </div>
  );
}

/** `texture={false}` drops the section texture (About puts it on the next band instead). */
export default function Partners({ texture = true }) {
  const c = useSection("partners", partners.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;
  const logos = (c.logos || []).filter((l) => l?.logo?.src);
  const rowCount = Math.max(1, Math.min(ROWS, Math.ceil(logos.length / 4)));
  const rows = Array.from({ length: rowCount }, (_, r) => logos.filter((_, i) => i % rowCount === r));

  return (
    <section
      id="partners"
      className="relative scroll-mt-[112px] overflow-hidden pt-4 pb-8 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12"
      aria-label="Partners and clients"
    >
      {texture ? <TextureSlides lighter /> : null}

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] px-4 text-center"
      >
        <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            {c.eyebrow}
          </span>
          <h2 className="display section-heading title-card-line mt-1 uppercase text-ink">
            <CmsText value={c.titleBefore} size={c.titleBeforeSize} />{" "}
            <CmsText className="text-brand" value={c.titleAccent} size={c.titleBeforeSize} />{" "}
            <CmsText value={c.titleAfter} size={c.titleBeforeSize} />
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mt-3 space-y-1.5 sm:mt-3.5 lg:mt-4"
      >
        {rows.map((items, i) => (
          <Row
            key={i}
            items={items}
            direction={i % 2 === 0 ? "left" : "right"}
            still={!!reduceMotion}
          />
        ))}
      </motion.div>
    </section>
  );
}
