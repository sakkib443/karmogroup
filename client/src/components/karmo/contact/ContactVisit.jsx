"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiClock, FiMapPin } from "react-icons/fi";

import { contactVisit } from "@/components/karmo/contact/contactData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Visit us (#address). The head office on a Google map, edge to edge and one
 * screen tall under the 112px header. On a computer the address and hours sit
 * on a white card over the map's left side; on a phone the card follows the map.
 */
export default function ContactVisit({ office, hours = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = contactVisit;
  if (!office) return null;
  const q = encodeURIComponent(office);

  return (
    <section
      id="address"
      className="relative mt-1.5 scroll-mt-[112px] bg-[#e9edf2] lg:h-[calc(100svh-112px)]"
      aria-label="Head office address and map"
    >
      <div className="relative h-[min(110vw,520px)] w-full lg:absolute lg:inset-0 lg:h-full">
        <iframe
          title="Karmo head office on Google Maps"
          src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <div className="lg:pointer-events-none lg:absolute lg:inset-0 lg:flex lg:items-center">
        {/* The page gutter (.shell) from a computer up; full width under the map on a phone. */}
        <div className="lg:mx-auto lg:w-full lg:max-w-[1600px] lg:px-20">
          <motion.div
            variants={fade}
            {...reveal}
            viewport={VIEWPORT}
            className="bg-white px-6 py-10 sm:px-10 lg:pointer-events-auto lg:w-[min(30rem,40vw)] lg:px-10 lg:py-10 lg:shadow-[0_30px_70px_-30px_rgba(11,26,51,0.45)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">{c.eyebrow}</span>
            <h2 className="display section-heading title-card-line mt-3 uppercase text-ink">
              {c.titleLead} <span className="text-brand">{c.titleAccent}</span>
            </h2>
            <LeafRule align="left" className="mt-4" />

            <div className="mt-7 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand">
                <FiMapPin className="text-[18px]" />
              </span>
              <p className="body-copy text-[14.5px] leading-[1.65] text-ink/70">{office}</p>
            </div>

            {hours.length ? (
              <div className="mt-5 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand">
                  <FiClock className="text-[18px]" />
                </span>
                <ul className="w-full divide-y divide-ink/8">
                  {hours.map((h, i) => (
                    <li key={`${h.day}-${i}`} className="flex items-center justify-between gap-4 py-2 first:pt-0.5">
                      <span className="text-[13.5px] font-medium text-ink/70">{h.day}</span>
                      <span
                        className={`text-[12px] font-bold uppercase tracking-[0.08em] ${
                          String(h.time).toLowerCase() === "closed" ? "text-ink/35" : "text-brand"
                        }`}
                      >
                        {h.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href={`https://maps.google.com/?q=${q}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 bg-brand px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-brand-dark"
            >
              Get directions <FiArrowRight className="text-[15px]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
