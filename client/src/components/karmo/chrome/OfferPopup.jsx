"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

import { OFFER_POPUP as O } from "@/data/offerPopup";

/**
 * A large offer card that opens once, the first time someone visits the site
 * (client, 28 Nov 2026). Closing it (×, the dark backdrop, Esc or the button)
 * remembers the offer's `version` in this browser, so it does not come back until
 * the offer changes. Content: src/data/offerPopup.js.
 */
const KEY = "karmo-offer-seen";

export default function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!O.enabled) return undefined;
    let seen = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {
      /* private mode: just show it */
    }
    if (seen === O.version) return undefined;
    const t = setTimeout(() => setOpen(true), O.delayMs || 0);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, O.version);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;
  // Rendered straight into <body> so it sits above the fixed header and every other layer.
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="offer"
          className="fixed inset-0 z-[20000] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${O.titleLead} ${O.titleAccent}`}
          data-lenis-prevent
        >
          <button type="button" aria-label="Close offer" onClick={close} className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-[3px]" />

          <motion.div
            className="relative z-10 grid w-full max-w-[920px] overflow-hidden rounded-[6px] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] md:grid-cols-[1.05fr_1fr]"
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close offer"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-brand hover:text-white"
            >
              <FiX className="text-[20px]" />
            </button>

            <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[480px]">
              <Image src={O.image} alt={O.imageAlt} fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" priority />
              <span className="absolute left-4 top-4 bg-brand px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {O.eyebrow}
              </span>
            </div>

            <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">Karmo</p>
              <h2 className="display mt-2 text-[2rem] font-light uppercase leading-[1.05] text-ink sm:text-[2.5rem]">
                {O.titleLead} <span className="block font-bold text-brand">{O.titleAccent}</span>
              </h2>
              <p className="body-copy mt-4 text-[15px] leading-relaxed text-ink/70">{O.text}</p>
              {O.points?.length ? (
                <ul className="mt-5 grid gap-2">
                  {O.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-[14px] font-medium text-ink/80">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <FiCheck className="text-[12px]" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href={O.ctaHref}
                  onClick={close}
                  className="inline-flex items-center justify-center bg-brand px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-ink"
                >
                  {O.ctaLabel}
                </Link>
                <button type="button" onClick={close} className="text-[13px] font-semibold text-ink/55 underline-offset-4 hover:text-ink hover:underline">
                  Maybe later
                </button>
              </div>
              {O.note ? <p className="mt-5 text-[11.5px] text-ink/45">{O.note}</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
