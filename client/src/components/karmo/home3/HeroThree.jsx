"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { group, line as lineReveal, rise, SETTLE } from "../motion";

/**
 * The Home 03 hero — the photograph and the words never touch.
 *
 * ── Why it is built this way ────────────────────────────────────────────────
 * Both other heroes set their copy *on* the picture and pay for it. Home 01
 * needs a two-gradient scrim (`.hero-veil`) and a text-shadow under every
 * headline. Home 02 goes further and constrains the photography itself: its
 * docblock states that any third slide must have its left 45% bare wall, or the
 * copy lands on furniture and the arrangement has to be rethought.
 *
 * That is a design telling the photographer what to shoot. Here the copy sits
 * on a solid slate card that overlaps the bottom of the picture, so there is
 * no scrim, no shadow, no rule about what may be in frame, and the contrast is
 * fixed at whatever the card is — about 15:1 — regardless of the photograph.
 * Any future image drops in unchanged. The overlap is what stops the two
 * halves reading as two stacked blocks.
 *
 * ── Why it is a division switcher, not a slideshow ──────────────────────────
 * Both other heroes run a timer at the visitor. Home 01 changes its headline
 * every seven seconds whether or not anyone is reading it; Home 02 changes only
 * the room behind one fixed claim.
 *
 * This one is the site's own navigation. Each state is a division — its
 * photograph, its tagline, its own "Explore" button — so the row underneath is
 * a way into the four sections of the business rather than four dots. It still
 * advances on its own, because a visitor who never touches it should still
 * learn there are four; but the first time anyone chooses a division the timer
 * stops for good, and what they chose stays on screen. Reduced motion never
 * starts it.
 *
 * ── The copy ────────────────────────────────────────────────────────────────
 * All four headlines are client taglines from `docs/copy/taglines.md`, each in
 * the place that file itself proposes for it — Generic 19 and Mattress 5 are
 * listed there as hero candidates, Generic 12 against HomeTex and Generic 9
 * against Chemicals. They are set **exactly as supplied**, including the
 * client's own inconsistent casing ("Where Comfort meets Elegance"), because
 * this design is mixed-case throughout and so, unlike Home 01 and Home 02, it
 * does not have to re-case them to fit. Nothing in this file is invented; the
 * supporting lines are the division descriptions already used in the nav.
 *
 * ── The pictures ────────────────────────────────────────────────────────────
 * Three come from `images/divisions`, which is the only set in the library with
 * one photograph per division. Foam takes the Home 01 hero slide instead: its
 * division file is 905x452, which upscales visibly across a band this wide.
 * A purpose-shot foam picture at 2400px or more is the one asset this design
 * still wants — see IMAGE-PROMPTS.md.
 */

const divisions = [
  {
    id: "foam",
    index: "01",
    name: "Foam",
    // Generic 19.
    title: ["Redefining", "Everyday Comfort"],
    lead: "Furniture and upholstery, footwear, automotive and acoustic grades — poured, cured and cut in Karmo's own plants.",
    href: "/foam",
    image: "/karmo/images/hero/slide-3-foam-livingroom.png",
    alt: "Sunlit living-room corner with a cream bouclé sofa built on Karmo upholstery foam",
    line: "Furniture, footwear, automotive",
  },
  {
    id: "mattress",
    index: "02",
    name: "Mattress",
    // Mattress 5.
    title: ["Sleep Well,", "Live Well"],
    lead: "Pocket spring, euro top, orthopaedic and memory foam — built on foam we make ourselves rather than buy in.",
    href: "/mattress",
    image: "/karmo/images/divisions/mattress-platform-bed.jpg",
    alt: "A quilted pocket-spring mattress on a low walnut platform bed beside a lit bedside lamp",
    line: "Pocket spring, euro top, orthopaedic",
  },
  {
    id: "hometex",
    index: "03",
    name: "HomeTex",
    // Generic 12.
    title: ["Where Comfort", "meets Elegance"],
    lead: "Bed sheets, comforters, pillows and cushions — the layers that finish a bedroom.",
    href: "/hometex",
    image: "/karmo/images/divisions/hometex-bed-linen.jpg",
    alt: "A bed made up in cream sateen bedding with stacked linen pillows and a wheat-yellow throw",
    line: "Sheets, comforters, pillows, cushions",
  },
  {
    id: "chemicals",
    index: "04",
    name: "Chemicals",
    // Generic 9.
    title: ["We Create The", "Chemistry Of Comfort"],
    lead: "Adhesives, polymers and sodium silicate — the chemistry the other three divisions are built on.",
    href: "/chemicals",
    image: "/karmo/images/divisions/chemicals-bench.jpg",
    alt: "Polyurethane foam sheets, a beaker of resin, sample tins and a moulded insole on an oak bench",
    line: "Adhesives, polymers, sodium silicate",
  },
];

/* Long enough to read a two-line headline and its supporting sentence without
   hurrying, which is the shortest this may be — the copy changes with the
   picture here, unlike Home 02 where only the room does. */
const DWELL_MS = 7500;
const FADE_MS = 900;

export default function HeroThree() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Latches on the first click and never clears. The timer is there to show a
  // passive visitor that there are four divisions; once someone has said which
  // one they want, moving it off them is just taking it away again.
  const [steered, setSteered] = useState(false);

  const choose = useCallback((next) => {
    setSteered(true);
    setIndex(next);
  }, []);

  useEffect(() => {
    if (reduceMotion || steered) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % divisions.length),
      DWELL_MS
    );
    return () => clearInterval(timer);
  }, [reduceMotion, steered]);

  const active = divisions[index];

  return (
    <section className="bg-linen">
      {/* ── The picture ──────────────────────────────────────────────
          Nothing is ever drawn on it. Every slide is mounted and only
          opacity moves, so a change costs no layout and the incoming
          picture is already decoded when it is needed. Four is still
          cheap; a longer list would want mounting on demand. */}
      <div className="relative h-[40svh] min-h-[260px] w-full overflow-hidden bg-shade-deep sm:h-[46svh] lg:h-[56svh] lg:min-h-[360px]">
        {divisions.map((d, i) => (
          <Image
            key={d.id}
            src={d.image}
            alt={i === index ? d.alt : ""}
            aria-hidden={i !== index}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover transition-opacity ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          />
        ))}
      </div>

      <div className="shell">
        {/* The negative margin lifts the whole row over the picture; the
            switcher column pushes itself back down by exactly the same amount,
            so it starts on the picture's bottom edge while the card breaks
            through it. Keep the two numbers in step. */}
        <div className="relative -mt-16 flex flex-col gap-8 pb-16 lg:-mt-36 lg:flex-row lg:gap-0 lg:pb-24">
          <div className="bg-shade-deep px-7 py-9 shadow-[0_30px_60px_-30px_rgba(22,28,36,0.55)] sm:px-10 sm:py-11 lg:w-[58%] lg:min-h-[25rem] lg:px-12 lg:py-14">
            {/* The frame line. Constant across all four states, so the group
                is never off the screen even when the headline is a division's
                rather than the brand's. */}
            <div className="flex items-center justify-between gap-6 border-b border-white/12 pb-5">
              <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Karmo Group
                <span className="h-3.5 w-px rotate-[18deg] bg-white/25" />
                Since 1965
              </span>
              <span className="display shrink-0 text-[11px] font-bold tabular-nums tracking-[0.1em] text-white/40">
                <span className="text-brand">{active.index}</span> /{" "}
                {String(divisions.length).padStart(2, "0")}
              </span>
            </div>

            {/* Keyed on the division so the lines replay each time one is
                chosen. `animate` rather than `whileInView` — this block is
                above the fold on load and then changes in place, so a viewport
                trigger would fire once and never again. */}
            <motion.div
              key={active.id}
              variants={group}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              <h1 className="display mt-7 text-[2.05rem] font-light! leading-[1.06] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.4rem]">
                {active.title.map((ln, i) => (
                  <span key={i} className="block overflow-hidden pb-[0.06em]">
                    <motion.span
                      variants={lineReveal}
                      className={i === 1 ? "block font-semibold! text-brand" : "block"}
                    >
                      {ln}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                variants={rise}
                className="body-copy mt-6 max-w-md text-[14.5px] leading-[1.85] text-white/65"
              >
                {active.lead}
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Link
                  href={active.href}
                  className="btn-primary group inline-flex h-12 items-center gap-3 bg-brand px-7 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white"
                >
                  Explore {active.name}
                  <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/find-store"
                  className="inline-flex h-12 items-center gap-2.5 border border-white/25 px-6 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
                >
                  <FiMapPin className="text-base" />
                  Find a store
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ── The switcher ───────────────────────────────────────────
              Four real destinations, not four dots. Buttons rather than links
              because they change what is on the screen; the link to each
              division is the button in the card. */}
          <div className="lg:w-[42%] lg:pt-36 lg:pl-12">
            <span className="block text-[10.5px] font-semibold uppercase tracking-[0.26em] text-ink/40">
              Four divisions
            </span>

            <div className="mt-4 border-t border-ink/12">
              {divisions.map((d, i) => {
                const on = i === index;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => choose(i)}
                    aria-current={on}
                    className="group flex w-full items-center gap-4 border-b border-ink/12 py-4 text-left"
                  >
                    <span
                      className={`display w-6 shrink-0 text-[11px] font-bold tabular-nums transition-colors duration-300 ${
                        on ? "text-brand" : "text-ink/30"
                      }`}
                    >
                      {d.index}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`display block text-[15px] font-semibold! tracking-[-0.01em] transition-colors duration-300 ${
                          on ? "text-ink" : "text-ink/55 group-hover:text-ink"
                        }`}
                      >
                        {d.name}
                      </span>
                      <span className="body-copy mt-0.5 block truncate text-[11.5px] text-ink/45">
                        {d.line}
                      </span>
                    </span>

                    <motion.span
                      aria-hidden="true"
                      className="h-px shrink-0 bg-brand"
                      initial={false}
                      animate={{ width: on ? 44 : 12, opacity: on ? 1 : 0.3 }}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.45, ease: SETTLE }
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
