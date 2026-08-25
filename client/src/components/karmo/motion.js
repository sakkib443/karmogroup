/**
 * One motion system for the homepage.
 *
 * IKEA-style scroll reveal: content starts clearly below its resting place,
 * then eases up with a long soft settle so the lift is obvious to the eye —
 * not a micro-fade. Hero stays excluded (load theatre, not scroll reveal).
 */

// Soft ease-out with a long settle (IKEA-like, no bounce).
export const SETTLE = [0.05, 0.7, 0.1, 1];

// Curtains, wipes and pans — eases at both ends.
export const SWEEP = [0.76, 0, 0.24, 1];

// Longer so the travel reads clearly while scrolling.
export const RISE_S = 1.15;
export const LINE_S = 1.05;
export const SLOW_S = 1.4;

// Clear hand-off between siblings.
export const STAGGER = 0.12;
export const LEAD = 0.1;

/**
 * Trigger early enough that the long lift is mid-flight when the section
 * hits the eye — not finished before you notice it.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -12% 0px",
};

/** Parent of a staggered set. Carries no visual state of its own. */
export const group = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: LEAD } },
};

/**
 * A line of type pushed up from behind its own edge. Parent must clip
 * (`overflow-hidden`) or the text slides in the open.
 */
export const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: LINE_S, ease: SETTLE } },
};

/**
 * Noticeable lift from below — ~72px so the rise is visible, not a blink.
 */
export const rise = {
  hidden: { opacity: 0, y: 72 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: RISE_S, ease: SETTLE },
  },
};

/** A photograph easing out of an over-scale as its curtain clears. */
export const zoomOut = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: SLOW_S, ease: SWEEP } },
};

/** Curtain pulled up off a picture. 101% so no seam shows at the edge. */
export const curtainUp = {
  hidden: { y: "0%" },
  show: { y: "-101%", transition: { duration: SLOW_S, ease: SWEEP } },
};

/** Curtain pulled sideways, for the panels that clear across. */
export const curtainRight = {
  hidden: { x: "0%" },
  show: { x: "101%", transition: { duration: SLOW_S, ease: SWEEP } },
};
