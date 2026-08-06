/**
 * One motion system for the homepage.
 *
 * Every section grew its own reveal as it was built, and they drifted: five
 * different trigger points (0.12 through 0.5), seven travel distances (14px to
 * 60px), eight durations. No single one of those looks wrong on its own, but
 * scrolling the page end to end, each section arrives with a slightly different
 * weight and timing — which is what reads as unfinished.
 *
 * These are the shared values. Sections import them rather than declaring their
 * own, so the whole page moves on one rhythm and a change here is a change
 * everywhere. The hero is deliberately excluded: it is a stage-setting
 * animation on load, not a scroll reveal, and it keeps its own slower timing.
 */

// Arrive and stop. Fast out of the gate, long settle, no bounce.
export const SETTLE = [0.22, 1, 0.36, 1];

// Curtains, wipes and pans — eases at both ends, for things that travel a
// long way across the frame.
export const SWEEP = [0.76, 0, 0.24, 1];

// Durations, in seconds.
export const RISE_S = 0.72; // fade-and-lift
export const LINE_S = 0.82; // a line uncovering itself
export const SLOW_S = 1.3; // curtains and photograph scale

// How a group hands off to its children.
export const STAGGER = 0.07;
export const LEAD = 0.05;

/**
 * The single trigger point.
 *
 * A fifth of the element has to be showing. That is early enough that a block
 * is already moving as it rises into the frame — with the eased scrolling it
 * settles about when the eye reaches it — and late enough that something barely
 * peeking over the fold does not fire and finish unseen.
 */
export const VIEWPORT = { once: true, amount: 0.2 };

/** Parent of a staggered set. Carries no visual state of its own. */
export const group = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: LEAD } },
};

/**
 * A line of type pushed up from behind its own edge. The parent has to clip
 * (`overflow-hidden`) or the text simply starts low and slides up in the open.
 */
export const line = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: LINE_S, ease: SETTLE } },
};

/**
 * The workhorse: fade and lift. 22px, because a long throw reads as the block
 * being dragged into place rather than settling into it — the old 60px version
 * on the divisions deck was the clearest example.
 */
export const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: RISE_S, ease: SETTLE } },
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
