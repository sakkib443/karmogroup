"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Motion primitives for Home 02.
 *
 * The reference build leans on four separate libraries — GSAP SplitText for
 * headings, GSAP ScrollTrigger for the image wipes, WOW.js for the card
 * entrances and a parallax plugin for the hero. All four are re-cut here on
 * framer-motion, which the project already ships, so Home 02 adds no new
 * dependency and no render-blocking script.
 */

/** The curve everything settles on. Fast out, long tail. */
export const SETTLE = [0.22, 1, 0.36, 1];

/** Slightly flatter — used where an image slides rather than a card lifts. */
export const GLIDE = [0.25, 0.46, 0.45, 0.94];

/* ────────────────────────────────────────────────────────────────────────────
   FadeUp — the WOW.js `fadeInUp` replacement.
   Every card, banner and rail item in the reference carries it; here it is one
   component so the distance and curve stay identical across ~60 elements.
   ──────────────────────────────────────────────────────────────────────────── */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 42,
  duration = 0.85,
  amount = 0.2,
  ...rest
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: SETTLE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   SplitWords — SplitText `text-anime-style-1/2`.
   Each word rides up from behind its own clipping box, one after the next.
   The clip is why it reads as a typeset line lifting into place rather than a
   row of words fading in.
   ──────────────────────────────────────────────────────────────────────────── */
export function SplitWords({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.055,
  duration = 0.95,
}) {
  const reduce = useReducedMotion();
  const words = String(text).split(" ").filter(Boolean);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* The padding/negative-margin pair gives descenders somewhere to
              live; without it `overflow-hidden` shears the tails off g, y and p. */}
          <motion.span
            aria-hidden="true"
            className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "115%", opacity: 0 },
                show: { y: "0%", opacity: 1 },
              }}
              transition={{ duration, delay: delay + i * stagger, ease: SETTLE }}
            >
              {word}
            </motion.span>
          </motion.span>
          {/* A real space, not a right margin. Margins look identical on screen
              but leave no character behind: the heading then copies out as
              "ExploreKarmoCategories", and any tool reading textContent — search
              indexers, translation widgets, the browser's own find — sees one
              run-on word. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   ScrubHeading — SplitText `.text-effect`, the scrubbed one.
   Characters sit at 25% opacity and 7px left until the heading crosses the
   lower third of the viewport; from there their arrival is tied to the scroll
   position rather than to a timeline, so scrolling back up plays it backwards.
   That reversibility is the whole character of the effect.
   ──────────────────────────────────────────────────────────────────────────── */
function ScrubChar({ char, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const x = useTransform(progress, [start, end], [-7, 0]);

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block whitespace-pre"
      style={{ opacity, x }}
    >
      {char}
    </motion.span>
  );
}

export function ScrubHeading({ lines, as: Tag = "h2", className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });

  const label = lines.join(" ");
  const total = lines.reduce((n, line) => n + line.length, 0);

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  // Each character owns a 45%-wide window of the scroll range, offset by its
  // position in the heading. Overlapping windows are what makes it read as a
  // wave rather than as characters switching on one at a time.
  let cursor = 0;

  return (
    <Tag ref={ref} className={className} aria-label={label}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {[...line].map((char, ci) => {
            const start = (cursor++ / total) * 0.55;
            return (
              <ScrubChar
                key={`${li}-${ci}`}
                char={char}
                progress={scrollYProgress}
                start={start}
                end={start + 0.45}
              />
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Reveal — the GSAP `.reveal` image wipe.
   A clip opens left to right while the picture inside slides the opposite way
   at the same speed. The two motions cancel, so the image never appears to
   move — it is simply uncovered. Sliding only the clip would look like a
   curtain; sliding only the image would look like a swipe.
   ──────────────────────────────────────────────────────────────────────────── */
export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 1.05,
  from = "left",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const closed = from === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const offset = from === "left" ? "100%" : "-100%";

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: closed }}
        animate={inView ? { clipPath: "inset(0 0% 0 0%)" } : undefined}
        transition={{ duration, delay, ease: GLIDE }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ x: offset }}
          animate={inView ? { x: "0%" } : undefined}
          transition={{ duration, delay, ease: GLIDE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Counter — the counterUp replacement.
   Counts once, when the number first comes into view.
   ──────────────────────────────────────────────────────────────────────────── */
export function Counter({ to, suffix = "", duration = 2.2, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });

  // The digits are written straight to the DOM node on each frame. Counting to
  // 1,200 through state would be 130-odd renders of whatever section this sits
  // in; this way React does none of that work.
  useAnimatedNumber(ref, inView && !reduce ? to : null, duration);

  return (
    <span className={className}>
      <span ref={ref}>{reduce ? to.toLocaleString() : "0"}</span>
      {suffix}
    </span>
  );
}

function useAnimatedNumber(ref, to, duration) {
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || to === null) return;

    const started = performance.now();
    const step = (now) => {
      const t = Math.min((now - started) / (duration * 1000), 1);
      // easeOutCubic — quick off the mark, gentle landing.
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(eased * to).toLocaleString();
      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [ref, to, duration]);
}
