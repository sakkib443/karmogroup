"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCalendar } from "react-icons/fi";

const posts = [
  {
    title: "How foam density actually decides how long a mattress lasts",
    href: "/blog/foam-density",
    image: "/SLIDE01.png",
    alt: "Bedroom with a Karmo mattress and timber bed frame",
    date: "12 June 2026",
    author: "Karmo Desk",
    excerpt:
      "Density is not firmness. The number on the label tells you how much material is packed into every cubic foot — and that is what decides whether a mattress holds its shape after five years.",
  },
  {
    title: "Choosing bedding that survives a Dhaka summer",
    href: "/blog/summer-bedding",
    image: "/SLIDE02.png",
    alt: "Living room seating built on Karmo upholstery foam",
    date: "28 May 2026",
    author: "Karmo Desk",
    excerpt:
      "Thread count gets all the attention, but weave and fibre matter more once humidity climbs. Here is what we look for when we build a HomeTex range for this climate.",
  },
  {
    title: "Inside the plant: what a batch test looks like",
    href: "/blog/batch-testing",
    image: "/SLIDE01.png",
    alt: "Bedroom with a Karmo mattress and timber bed frame",
    date: "09 May 2026",
    author: "Karmo Desk",
    excerpt:
      "Every pour is sampled before it becomes a product. We walk through the density, resilience and compression checks that a batch has to clear before it leaves the floor.",
  },
  {
    title: "Adhesives, quietly holding your furniture together",
    href: "/blog/adhesives",
    image: "/SLIDE02.png",
    alt: "Living room seating built on Karmo upholstery foam",
    date: "21 April 2026",
    author: "Karmo Desk",
    excerpt:
      "The least visible division of the group is in almost every room it touches. A short look at where polymers and bonding agents do their work in a finished piece.",
  },
];

// Same curves the rest of the page moves on.
const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

// Slide geometry lives here because both the basis and the transform have to
// agree on it — change the gap in one place only.
const GAP_REM = 1.25;
const AUTOPLAY_MS = 5000;

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

export default function Journal() {
  const reduceMotion = useReducedMotion();
  const [perView, setPerView] = useState(1);
  const [rawIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Two cards from md up, one below it. Starts at one so the server render and
  // the first client render agree; the effect corrects it before paint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setPerView(query.matches ? 2 : 1);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // The last valid position leaves no gap at the tail of the track.
  const lastIndex = Math.max(0, posts.length - perView);

  // Dropping to a narrower viewport can strand the stored index past the new
  // end. Clamped on read rather than corrected in an effect — writing state
  // from an effect costs an extra render pass and trips the lint rule.
  const index = Math.min(rawIndex, lastIndex);

  const go = useCallback(
    (step) =>
      setIndex((current) => {
        // Step from the clamped position, in case the stored one is stale
        // after a resize.
        const next = Math.min(current, lastIndex) + step;
        if (next < 0) return lastIndex;
        if (next > lastIndex) return 0;
        return next;
      }),
    [lastIndex],
  );

  useEffect(() => {
    if (reduceMotion || paused || lastIndex === 0) return;

    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, lastIndex, paused, reduceMotion]);

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.2 };

  // A slide is an even share of the viewport once the gaps are taken out, and
  // one step moves the track by exactly one slide plus one gap.
  const slide = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})`;
  const shift = `calc(-${index} * (${slide} + ${GAP_REM}rem))`;

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Pulled in tighter than the rest of the page. The sections above run
          the full shell width; this one sits on a narrower measure so the
          reading column stays comfortable and the block reads as a quieter
          footnote rather than another full-bleed statement. */}
      <div className="shell">
        <div className="mx-auto grid w-full max-w-[1180px] gap-9 lg:grid-cols-3 lg:gap-10 lg:px-10">
        {/* Carousel — two cards in view, advancing one at a time. */}
        <div
          className="lg:col-span-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div
            variants={group}
            {...reveal}
            viewport={once}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <span className="block overflow-hidden">
                <motion.span
                  variants={line}
                  className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
                >
                  <span className="h-px w-10 bg-brand" />
                  Our blog
                </motion.span>
              </span>

              <h2 className="display mt-5 text-[1.6rem] font-light leading-[1.15] text-ink sm:text-[2rem]">
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span variants={line} className="block">
                    Follow the
                    <span className="font-bold"> latest news</span>
                  </motion.span>
                </span>
              </h2>
            </div>

            <motion.div variants={fade} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous posts"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
              >
                <FiArrowLeft className="text-[15px]" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next posts"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
              >
                <FiArrowRight className="text-[15px]" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fade}
            {...reveal}
            viewport={once}
            className="mt-9 overflow-hidden"
          >
            <div
              className="flex"
              style={{
                gap: `${GAP_REM}rem`,
                transform: `translateX(${shift})`,
                transition: reduceMotion
                  ? "none"
                  : `transform 900ms cubic-bezier(${SWEEP.join(",")})`,
              }}
            >
              {posts.map((post, position) => {
                // Cards scrolled out of view stay in the DOM, so they are taken
                // off the tab order rather than being focusable off-screen.
                const visible =
                  position >= index && position < index + perView;

                return (
                  <article
                    key={post.href}
                    aria-hidden={!visible}
                    className="shrink-0"
                    style={{ flexBasis: slide }}
                  >
                    <Link
                      href={post.href}
                      tabIndex={visible ? undefined : -1}
                      className="group block"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.alt}
                          fill
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 42vw, 100vw"
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                        />
                      </div>

                      <h3 className="display mt-5 text-[1rem] font-semibold leading-snug text-ink transition-colors duration-500 group-hover:text-brand">
                        {post.title}
                      </h3>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/55">
                        <span className="flex items-center gap-2">
                          <FiCalendar className="text-brand" />
                          {post.date}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-ink/25" />
                        <span>
                          By{" "}
                          <span className="font-semibold text-ink/75">
                            {post.author}
                          </span>
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-[13.5px] leading-[1.75] text-ink/60">
                        {post.excerpt}
                      </p>

                      <span className="mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                        Read more
                        <span className="mt-1 block h-px w-full bg-ink/30">
                          <span className="block h-px w-0 bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                        </span>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Static panel — the carousel moves beside it, this stays put. */}
        <motion.aside
          {...reveal}
          viewport={once}
          className="relative min-h-[320px] overflow-hidden lg:min-h-full"
        >
          <motion.div
            variants={{
              hidden: { scale: 1.16 },
              show: { scale: 1, transition: { duration: 1.5, ease: SWEEP } },
            }}
            className="absolute inset-0"
          >
            <Image
              src="/SLIDE03.png"
              alt="Bedroom finished with Karmo mattress and bedding"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Weighted to the bottom, where the copy sits. */}
          <div className="absolute inset-0 bg-gradient-to-t from-shade-deep via-shade-deep/45 to-shade-deep/10" />

          <div className="relative flex h-full flex-col justify-end p-6">
            <h3 className="display text-[1.3rem] font-bold leading-[1.2] text-white sm:text-[1.45rem]">
              Design your comfort
              <br />
              with Karmo experts
            </h3>

            <Link
              href="/contact"
              className="group mt-5 inline-flex w-fit flex-col text-[10px] font-bold uppercase tracking-[0.16em] text-white"
            >
              Let&rsquo;s get started
              <span className="mt-1 block h-px w-full bg-white/45">
                <span className="block h-px w-0 bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </span>
            </Link>
          </div>

          <motion.span
            aria-hidden="true"
            variants={{
              hidden: { y: "0%" },
              show: { y: "-101%", transition: { duration: 1.15, ease: SWEEP } },
            }}
            className="absolute inset-0 z-10 bg-white"
          />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
