"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiMessageCircle, FiArrowUp } from "react-icons/fi";
import { SETTLE } from "./motion";

/**
 * The floating action rail — WhatsApp, message and a back-to-top button, fixed
 * to the bottom-right.
 *
 * NOTE: confirm the WhatsApp line with the client. The reference build linked
 * wa.me/8801713483254, one digit off the hotline the rest of the site uses
 * (…3284). The hotline is used here so every channel points at the same
 * number; swap it if the client keeps a separate WhatsApp line.
 */
const WHATSAPP_NUMBER = "8801713483284";

// One pill of shared styling. Colour is added per button.
const BTN =
  "group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] outline-none transition-shadow duration-300 hover:shadow-[0_16px_44px_-10px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 md:h-[3.25rem] md:w-[3.25rem]";

// A label that slides out to the left on hover. Hidden on small screens, where
// there is no hover and no room for it.
function Label({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-lg bg-shade px-3 py-1.5 text-[12px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
    >
      {children}
      <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-shade" />
    </span>
  );
}

export default function FloatingActions() {
  const reduceMotion = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  // The back-to-top button earns its place only once there is somewhere to go
  // back to — roughly one viewport of scrolling.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  const rise = (delay) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, scale: 0.5, x: 16 },
          animate: { opacity: 1, scale: 1, x: 0 },
          transition: { duration: 0.5, ease: SETTLE, delay },
        };

  const press = reduceMotion
    ? {}
    : { whileHover: { scale: 1.08 }, whileTap: { scale: 0.94 } };

  return (
    <div className="fixed bottom-6 right-5 z-[1000] flex flex-col items-end gap-3 md:bottom-8 md:right-7">
      {/* Back to top — mounts and unmounts with the scroll position. */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="to-top"
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 12 }}
            transition={{ duration: 0.35, ease: SETTLE }}
            {...press}
            className={`${BTN} bg-shade`}
          >
            <FiArrowUp className="text-[1.35rem] transition-transform duration-300 group-hover:-translate-y-0.5" />
            <Label>Back to top</Label>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message */}
      <motion.a
        href="/contact"
        aria-label="Send us a message"
        {...rise(0.15)}
        {...press}
        className={`${BTN} bg-brand`}
      >
        <FiMessageCircle className="text-[1.35rem]" />
        <Label>Message us</Label>
      </motion.a>

      {/* WhatsApp — the primary channel, so it sits lowest and carries a soft
          pulse to catch the eye. */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        {...rise(0.05)}
        {...press}
        className={`${BTN} bg-[#25D366]`}
      >
        {!reduceMotion && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-60"
            style={{ animationDuration: "2.4s" }}
          />
        )}
        <FaWhatsapp className="text-[1.5rem]" />
        <Label>Chat on WhatsApp</Label>
      </motion.a>
    </div>
  );
}
