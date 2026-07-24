"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The page's centrepiece: the section pins, and scrolling down drives the rail
 * sideways. Products are Karmo's own, named off the artwork in each shot.
 */
const panels = [
  {
    index: "01",
    name: "Euro Top Pocket Spring",
    division: "Mattress",
    note: "Twelve inches, pocket sprung, quilted euro top.",
    href: "/mattress",
    image: "/images/mattress-euro-top-pocket.jpg",
    alt: "Karmo Euro Top Pocket Spring mattress on a cane bed",
  },
  {
    index: "02",
    name: "Karmo 280",
    division: "Foam",
    note: "Furniture and upholstery grade, cut to your sheet size.",
    href: "/foam",
    image: "/images/foam-karmo-280.jpg",
    alt: "Stack of red Karmo 280 foam blocks",
  },
  {
    index: "03",
    name: "Red Stripe Comforter",
    division: "HomeTex",
    note: "Microfibre fill under a printed sateen shell.",
    href: "/hometex",
    image: "/images/comforter-red-stripe.jpg",
    alt: "Karmo Red Stripe comforter, rolled",
  },
  {
    index: "04",
    name: "Karmo King",
    division: "Mattress",
    note: "Four inches, eighty-one by sixty-nine.",
    href: "/mattress",
    image: "/images/mattress-king.jpg",
    alt: "Karmo King mattress in a sunlit bedroom",
  },
  {
    index: "05",
    name: "Karmo 1965",
    division: "Foam",
    note: "The grade the group was built on.",
    href: "/foam",
    image: "/images/foam-sofa-1965.jpg",
    alt: "Sofa beside a stack of Karmo 1965 foam blocks",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

export default function Showcase() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  // Measured rather than guessed. A hard-coded "-70%" would leave a gap or
  // clip the last panel the moment a breakpoint, a font or the panel count
  // changes; this always ends with the last panel flush to the right edge.
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [measure, reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring the travel, not the scroll position: the rail keeps moving for a
  // beat after the wheel stops, which is what makes it read as weight rather
  // than as a value being scrubbed.
  const eased = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });
  const x = useTransform(eased, [0, 1], [0, -distance]);
  const barScale = useTransform(eased, [0, 1], [0.08, 1]);

  // Reduced motion gets the same content as an ordinary horizontal scroller —
  // no pinning, no hijacked scroll, nothing that moves on its own.
  if (reduceMotion) {
    return (
      <section className="bg-shade-deep py-20">
        <Header />
        <ul className="mt-12 flex snap-x gap-6 overflow-x-auto px-6 pb-4 md:px-14 lg:px-20">
          {panels.map((panel) => (
            <li key={panel.index} className="w-[80vw] shrink-0 snap-start sm:w-[52vw] lg:w-[38vw]">
              <Panel panel={panel} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-shade-deep"
      // Height is what buys the horizontal travel: the taller the section, the
      // more vertical scroll each panel costs. ~72vh per panel keeps it brisk
      // without the rail feeling like it is being yanked.
      style={{ height: `${panels.length * 72 + 60}vh` }}
    >
      {/* min-h matters on a phone held sideways: at 100svh alone the header,
          the rail and the progress bar have nowhere to go and the panels get
          crushed. */}
      <div className="sticky top-0 flex h-[100svh] min-h-[34rem] flex-col justify-center overflow-hidden">
        <Header />

        <div ref={viewportRef} className="mt-10 w-full overflow-hidden">
          <motion.ul
            ref={trackRef}
            style={{ x }}
            className="flex w-max gap-6 px-6 md:px-14 lg:px-20"
          >
            {panels.map((panel) => (
              <li
                key={panel.index}
                className="w-[78vw] shrink-0 sm:w-[50vw] lg:w-[34vw] xl:w-[26vw]"
              >
                <Panel panel={panel} />
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Rail progress. Mirrors the horizontal travel so there is always a
            reading of how much is left. */}
        <div className="shell mt-8">
          <div className="h-px w-full max-w-xs bg-white/15">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-px origin-left bg-brand"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: SETTLE }}
      className="shell flex flex-wrap items-end justify-between gap-6"
    >
      <div>
        <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          <span className="h-px w-10 bg-brand" />
          The range
        </span>
        <h2 className="display mt-5 max-w-lg text-[1.9rem] font-light leading-[1.1] text-white sm:text-[2.6rem]">
          Five things we
          <span className="font-bold"> make well</span>
        </h2>
      </div>

      <p className="body-copy max-w-xs text-[13px] leading-relaxed text-white/50">
        Keep scrolling — the rail moves sideways.
      </p>
    </motion.div>
  );
}

function Panel({ panel }) {
  return (
    <Link
      href={panel.href}
      className="group/panel block focus-visible:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition-all duration-500 group-focus-visible/panel:ring-2 group-focus-visible/panel:ring-brand">
        <Image
          src={panel.image}
          alt={panel.alt}
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 34vw, (min-width: 640px) 50vw, 78vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/panel:scale-[1.06]"
        />

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-shade-deep via-shade-deep/50 to-transparent"
        />

        <span className="display absolute left-5 top-5 text-[11px] font-bold tracking-[0.2em] text-white/70">
          {panel.index}
        </span>

        <span className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          {panel.division}
        </span>

        <div className="absolute inset-x-5 bottom-5">
          <h3 className="display text-lg font-bold leading-tight text-white">
            {panel.name}
          </h3>
          <p className="body-copy mt-1.5 text-[12.5px] leading-relaxed text-white/60">
            {panel.note}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            Explore
            <FiArrowUpRight className="transition-transform duration-500 group-hover/panel:translate-x-0.5 group-hover/panel:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
