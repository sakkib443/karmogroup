"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const ICONS = { phone: FiPhone, whatsapp: BsWhatsapp, email: FiMail, office: FiMapPin };

/* Karmo Group's own gate and building — dark-washed so the cards read on it. */
const BACKDROP = "/pages/about/park-unit1-demra-gate.webp";

/**
 * The contact page's main band: a full-height dark section over a photo of
 * the Karmo Group building, the heading on top and the four ways in — call,
 * WhatsApp, mail, visit — as large glass cards. Values are resolved by the
 * parent from site content + Karmo defaults.
 */
export default function ContactChannels({ channels }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!channels?.length) return null;

  return (
    <section
      id="contact"
      aria-label="Ways to reach Karmo"
      className="relative isolate mt-1.5 flex scroll-mt-[112px] items-center overflow-hidden bg-[#08101f] py-16 sm:py-20 lg:min-h-[calc(100svh-112px)] lg:py-24"
    >
      <Image
        src={BACKDROP}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[center_38%]"
      />
      {/* Deep navy wash, a touch lighter in the middle where the cards sit. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(8,16,31,0.72) 0%, rgba(8,16,31,0.86) 60%, rgba(8,16,31,0.94) 100%)",
        }}
      />

      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="shell w-full">
        {/* Heading */}
        <motion.div variants={fade} className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Contact Karmo
            </span>
            <span className="h-px w-10 bg-brand" />
          </p>
          <h2 className="display section-heading title-card-line mt-4 uppercase text-white">
            <span className="block">We&apos;re here</span>
            <span className="block text-brand">to help you</span>
          </h2>
          <p className="body-copy mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-white/65 sm:text-[16px]">
            Foam, mattress, HomeTex or chemicals — call, WhatsApp or mail us, or
            walk into our Motijheel head office. A real person answers.
          </p>
        </motion.div>

        {/* The four ways in */}
        <motion.ul
          variants={group}
          className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-4"
        >
          {channels.map((card) => {
            const Icon = ICONS[card.kind] || FiPhone;
            return (
              <motion.li key={card.label} variants={fade} className="min-w-0">
                <Link
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="group relative flex h-full flex-col rounded-md border border-white/12 bg-white/[0.06] p-6 backdrop-blur-md transition-colors duration-300 hover:border-brand/60 hover:bg-white/[0.1] sm:p-7"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                      <Icon className="text-[20px]" />
                    </span>
                    <FiArrowUpRight className="text-[18px] text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </span>
                  <span className="mt-6 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                    {card.label}
                  </span>
                  <span className="mt-1.5 block break-words text-[17px] font-semibold leading-snug text-white sm:text-[18px]">
                    {card.primary}
                  </span>
                  {card.secondary ? (
                    <span className="mt-auto block pt-4 text-[12.5px] leading-snug text-white/50">
                      {card.secondary}
                    </span>
                  ) : null}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
