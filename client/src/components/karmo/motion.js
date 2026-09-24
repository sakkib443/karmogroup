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
 * Trigger when the block's own top edge crosses ~86% of the viewport — the
 * point where it is just appearing from below, so the lift is still running
 * while you read it.
 *
 * This used to be `amount: 0.12` with a -12% bottom margin, which asked for
 * 12% of the *element* to be visible. On a section a full viewport tall that
 * is 12vh, so a screen-height band fired the moment it peeked over the fold —
 * and the 1.15s rise had finished long before the section was actually in
 * front of the reader. The animation was running correctly and nobody could
 * ever see it, which is exactly the "it isn't happening" this fixes.
 *
 * `amount: 0` removes the element-size dependency: tall bands and short cards
 * now trigger at the same place on screen, which is what makes the cascade
 * read as one system rather than per-section guesswork.
 */
export const VIEWPORT = {
  once: true,
  amount: 0,
  margin: "0px 0px -14% 0px",
};

/**
 * Spread onto a child that should reveal on its own arrival rather than with
 * its parent's stagger.
 *
 * Sections used to animate as one slab: the parent held `group`, every block
 * inside carried `rise`, and all of them fired together on the parent's
 * trigger. Scrolling into a section therefore showed nothing moving, because
 * the whole thing had already resolved on the way in. Blocks that carry this
 * are independent — each lifts as it reaches the trigger line, so content
 * keeps arriving the whole way down the section.
 *
 * Grid items (anything rendered from a `map` with a `key`) deliberately do NOT
 * take this: they sit side by side at the same height, so an independent
 * trigger would fire them all at once and lose the stagger that reads as a
 * hand-off along the row.
 */
export const SELF = {
  initial: "hidden",
  whileInView: "show",
  viewport: VIEWPORT,
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
