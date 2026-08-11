"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Four quick ways in — phone, WhatsApp, mail, office. Values are resolved by
 * the parent from CMS + Karmo defaults so this stays a pure layout piece.
 */
export default function ContactChannels({ channels }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!channels?.length) return null;

  const icons = {
    phone: FiPhone,
    whatsapp: BsWhatsapp,
    email: FiMail,
    office: FiMapPin,
  };

  return (
    <section className="border-b border-ink/8 bg-white">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {channels.map((card) => {
          const Icon = icons[card.kind] || FiPhone;
          const inner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <Icon className="text-[18px]" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  {card.label}
                </span>
                <span className="mt-1.5 block text-[14px] font-semibold leading-snug text-ink">
                  {card.primary}
                </span>
                {card.secondary ? (
                  <span className="mt-1 block text-[12px] text-ink/45">
                    {card.secondary}
                  </span>
                ) : null}
              </span>
            </>
          );

          return (
            <motion.li key={card.label} variants={fade} className="bg-white">
              {card.href ? (
                <Link
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="group flex h-full items-start gap-3.5 px-5 py-7 transition-colors duration-300 hover:bg-cream/50 lg:px-6"
                >
                  {inner}
                </Link>
              ) : (
                <div className="group flex h-full items-start gap-3.5 px-5 py-7 lg:px-6">
                  {inner}
                </div>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
