"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiMinus, FiPhone, FiPlus } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

import { contactFaqs } from "@/components/karmo/contact/contactData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * FAQs (#faqs). At least one screen tall on a computer. Left: the heading and a
 * "still have a question?" photo card with call and WhatsApp. Right: numbered
 * questions in bordered rows, one open at a time, the open one marked with the
 * brand edge — the homepage's square cards and icon boxes throughout.
 */
export default function ContactFaqs({ phone, waNumber }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = contactFaqs;
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faqs"
      className="relative mt-1.5 flex scroll-mt-[112px] items-center bg-[#f7f5f1] py-16 lg:min-h-[calc(100svh-112px)] lg:py-14"
      aria-label="Frequently asked questions"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid w-full gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20"
      >
        <motion.div variants={fade} className="lg:col-span-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">{c.eyebrow}</span>
          <h2 className="display section-heading title-card-line mt-3 uppercase text-ink">
            {c.titleLead} <span className="text-brand">{c.titleAccent}</span>
          </h2>
          <LeafRule align="left" className="mt-4" />
          <p className="body-copy mt-5 max-w-md text-[14.5px] leading-[1.7] text-ink/60">{c.lead}</p>

          <div className="relative mt-8 overflow-hidden bg-ink">
            <div className="relative aspect-[16/10] w-full">
              <Image src={c.help.image.src} alt={c.help.image.alt} fill sizes="(min-width: 1024px) 36vw, 92vw" className="object-cover" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="display text-[1.15rem] font-semibold uppercase tracking-[0.04em] text-white">{c.help.title}</p>
                <p className="mt-1 text-[13px] text-white/75">{c.help.line}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {phone ? (
                    <Link
                      href={`tel:${phone}`}
                      className="inline-flex items-center gap-2 bg-brand px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark"
                    >
                      <FiPhone className="text-[15px]" /> Call us
                    </Link>
                  ) : null}
                  {waNumber ? (
                    <Link
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/60 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-white hover:text-ink"
                    >
                      <BsWhatsapp className="text-[15px]" /> WhatsApp
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.ul variants={fade} className="space-y-3 lg:col-span-7 lg:self-center">
          {c.items.map((f, i) => {
            const isOpen = open === i;
            const n = String(i + 1).padStart(2, "0");
            return (
              <li
                key={f.q}
                className={`border bg-white transition-[border-color,box-shadow] duration-300 ${
                  isOpen
                    ? "border-brand/30 shadow-[0_18px_40px_-26px_rgba(11,26,51,0.35)]"
                    : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-4 border-l-[3px] px-5 py-5 text-left transition-colors sm:gap-5 sm:px-6 ${
                    isOpen ? "border-brand" : "border-transparent"
                  }`}
                >
                  <span className="display w-8 shrink-0 text-[0.95rem] font-bold tabular-nums text-brand">{n}</span>
                  <span className="flex-1 text-[15px] font-semibold leading-snug text-ink sm:text-[16px]">{f.q}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors duration-300 ${
                      isOpen ? "border-brand bg-brand text-white" : "border-brand/25 text-brand"
                    }`}
                  >
                    {isOpen ? <FiMinus size={15} /> : <FiPlus size={15} />}
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="body-copy border-l-[3px] border-brand px-5 pb-5 pl-[4.25rem] text-[14px] leading-[1.75] text-ink/60 sm:px-6 sm:pl-[4.75rem]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
