"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiMessageCircle } from "react-icons/fi";
import { SETTLE } from "./motion";

/**
 * The floating action rail — WhatsApp, message and back-to-top, fixed to the
 * bottom-right. Home 01's component, in this page's palette.
 *
 * NOTE carried over from Home 01: confirm the WhatsApp line with the client.
 * The reference build linked wa.me/8801713483254, one digit off the hotline
 * the rest of the site uses (…3284). The hotline is used here so every channel
 * points at the same number.
 *
 * Back-to-top is a <button>, so the demo guard never touches it — it is the
 * one control on the page that has to actually do something. The other two are
 * links and are swallowed like the rest; see PreviewMode.
 */
const WHATSAPP_NUMBER = "8801713483284";

function Label({ children }) {
  return (
    <span className="fab-label" aria-hidden="true">
      {children}
    </span>
  );
}

export default function FloatingActions() {
  const reduce = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  // Back-to-top earns its place only once there is somewhere to go back to —
  // roughly one viewport of scrolling.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  const rise = (delay) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, scale: 0.5, x: 16 },
          animate: { opacity: 1, scale: 1, x: 0 },
          transition: { duration: 0.5, ease: SETTLE, delay },
        };

  const press = reduce
    ? {}
    : { whileHover: { scale: 1.08 }, whileTap: { scale: 0.94 } };

  return (
    <div className="fab-rail">
      {/* Mounts and unmounts with the scroll position. */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="to-top"
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="fab fab-top"
            initial={reduce ? false : { opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 12 }}
            transition={{ duration: 0.35, ease: SETTLE }}
            {...press}
          >
            <FiArrowUp />
            <Label>Back to top</Label>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href="/contact"
        aria-label="Send us a message"
        className="fab fab-message"
        {...rise(0.15)}
        {...press}
      >
        <FiMessageCircle />
        <Label>Message us</Label>
      </motion.a>

      {/* The primary channel, so it sits lowest and carries a soft pulse. */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fab fab-whatsapp"
        {...rise(0.05)}
        {...press}
      >
        {!reduce && <span className="fab-pulse" aria-hidden="true" />}
        <FaWhatsapp />
        <Label>Chat on WhatsApp</Label>
      </motion.a>
    </div>
  );
}
