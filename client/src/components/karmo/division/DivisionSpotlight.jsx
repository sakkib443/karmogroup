"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import {
  TbShieldCheck,
  TbFeather,
  TbCertificate,
  TbDropletOff,
  TbArrowBigDownLines,
} from "react-icons/tb";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Split under the About band. `#ECE5DE` fill so the block reads as its own
 * section, with a 6px white seam above and below.
 */

const ICONS = {
  shield: TbShieldCheck,
  feather: TbFeather,
  certificate: TbCertificate,
  droplet: TbDropletOff,
  "arrow-down": TbArrowBigDownLines,
};

export default function DivisionSpotlight({
  claims = [],
  film,
  still,
  heading = "Sleep Well, Live Well",
  cta = { label: "Shop Now", href: "#mattress-offers" },
}) {
  const reduce = useReducedMotion();
  const reveal = reduce ? {} : { initial: "hidden", whileInView: "show" };
  const videoRef = useRef(null);
  const inView = useInView(videoRef, { amount: 0.2 });

  const resolved = claims.map((c) => ({
    ...c,
    icon: typeof c.icon === "string" ? ICONS[c.icon] ?? TbShieldCheck : c.icon,
  }));

  const [headingLead, headingAccent] = splitHeading(heading);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduce) return undefined;
    node.muted = true;
    const play = () => node.play().catch(() => {});
    if (inView) play();
    else node.pause();
    return undefined;
  }, [inView, reduce, film]);

  if (!resolved.length) return null;

  return (
    <section id="mattress-spotlight" className="mb-[6px] bg-[#ECE5DE]">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid min-h-[420px] items-stretch sm:min-h-[480px] lg:min-h-[560px] lg:grid-cols-2"
      >
        <motion.div
          variants={fade}
          className="flex flex-col justify-center px-6 py-16 md:px-14 lg:px-20 lg:py-24 xl:pl-[max(5rem,calc((100vw-1600px)/2+5rem))] xl:pr-12"
        >
          <h2 className="display text-[1.75rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.15rem]">
            {headingLead}{" "}
            <span className="font-bold text-brand">{headingAccent}</span>
          </h2>

          <ul className="mt-7 space-y-4">
            {resolved.map((claim) => {
              const Icon = claim.icon;
              return (
                <li key={claim.id} className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${claim.badge}`}
                  >
                    <Icon className="text-[22px]" aria-hidden />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <p className="display text-[15px] font-bold uppercase tracking-[0.04em] text-ink">
                      {claim.title}
                    </p>
                    {claim.body && (
                      <p className="body-copy mt-1 line-clamp-2 text-[13px] leading-[1.55] text-ink/55">
                        {claim.body}
                      </p>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-flex h-[48px] w-fit items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
            >
              {cta.label}
              <FiArrowRight className="text-[15px]" />
            </Link>
          )}
        </motion.div>

        <motion.div
          variants={fade}
          className="relative h-full min-h-[360px] overflow-hidden bg-ink sm:min-h-[460px]"
        >
          {reduce ? (
            still && (
              <img
                src={still}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )
          ) : (
            <video
              ref={videoRef}
              src={film}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
            />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

function splitHeading(heading) {
  const comma = heading.indexOf(",");
  if (comma === -1) {
    const parts = heading.trim().split(/\s+/);
    if (parts.length < 2) return [heading, ""];
    return [parts.slice(0, -2).join(" ") || parts[0], parts.slice(-2).join(" ")];
  }
  return [heading.slice(0, comma).trim(), heading.slice(comma + 1).trim()];
}
