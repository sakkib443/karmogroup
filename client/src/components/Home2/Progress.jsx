"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * A hairline that fills as the page is read. It sits under the navbar rather
 * than at the very top of the viewport, so it never collides with the browser
 * chrome on mobile.
 */
export default function Progress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // The raw progress value jumps with every wheel tick. The spring turns that
  // into a line that runs rather than stutters.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-20 z-[900] h-px origin-left bg-brand"
    />
  );
}
