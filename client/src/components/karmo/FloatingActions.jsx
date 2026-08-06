"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { SETTLE } from "./motion";

/**
 * Back to top, and nothing else.
 *
 * This was a rail of three — WhatsApp, message, back-to-top — carried over
 * from the standalone Karmo build. On this site it landed on top of the
 * storefront's own `FloatingContact`, which the root layout already mounts in
 * the same corner of every page: two stacks of circular buttons overlapping
 * each other.
 *
 * `FloatingContact` won the two channels. It is not a pair of links but a
 * small assistant — how to order, delivery, payment, track an order, contact —
 * and it reads its WhatsApp number from the CMS instead of carrying one in the
 * source, which also retires the note that used to sit here about the
 * reference build linking a number one digit off the hotline.
 *
 * What it does not have is a way back up a page that runs ten thousand pixels,
 * so that is what is left here. Positioned to sit directly above the contact
 * launcher rather than beside it, so the two read as one column.
 */

// Clears the FloatingContact launcher, which is 48px tall and sits at
// `bottom-[72px]` on small screens (above the mobile bottom nav) and
// `bottom-5` from sm up. These two numbers are the only coupling between the
// components; if that launcher moves, this has to move with it.
const RAIL = "fixed right-4 bottom-[132px] z-[999] sm:bottom-20";

export default function FloatingActions() {
  const reduceMotion = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  // The button earns its place only once there is somewhere to go back to —
  // roughly one viewport of scrolling.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Asks for the eased jump per call, so it still glides even though
  // SmoothScroll turns off the page's CSS `scroll-behavior` while it runs.
  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  const press = reduceMotion
    ? {}
    : { whileHover: { scale: 1.08 }, whileTap: { scale: 0.94 } };

  return (
    <div className={RAIL}>
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="to-top"
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 12 }
            }
            transition={{ duration: 0.35, ease: SETTLE }}
            {...press}
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-shade text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] outline-none transition-shadow duration-300 hover:shadow-[0_16px_44px_-10px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2"
          >
            <FiArrowUp className="text-[1.35rem] transition-transform duration-300 group-hover:-translate-y-0.5" />

            {/* Slides out to the left on hover. Hidden on small screens, where
                there is no hover and no room for it. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-lg bg-shade px-3 py-1.5 text-[12px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
            >
              Back to top
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-shade" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
