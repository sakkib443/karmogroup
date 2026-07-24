"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { FiArrowUpRight, FiPhoneCall } from "react-icons/fi";

/**
 * Figures are the four verifiable ones: the founding year, the division count
 * and the product count from "Site Reference Final.xlsx", and the years since
 * 1965. No dealer, client or award count — none has been supplied. These are
 * the same numbers the old About section carried before it was removed.
 */
const figures = [
  { from: 1900, to: 1965, suffix: "", label: "Manufacturing since" },
  { from: 0, to: 4, suffix: "", label: "Divisions in the group" },
  { from: 0, to: 47, suffix: "", label: "Products across the range" },
  { from: 0, to: 60, suffix: "+", label: "Years on the floor" },
];

const SETTLE = [0.22, 1, 0.36, 1];

function Counter({ from, to, suffix }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  // Rests on the real figure, not on the count-up's starting value. Server
  // render, reduced motion and any browser that never runs the animation all
  // show "4 divisions" rather than "0 divisions" — a decorative counter must
  // not be able to publish a wrong number.
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    // No need to seed the start value here — the first frame below lands on
    // t = 0, which is `from` by definition.
    let frame;
    let start;
    const span = 1400;

    const tick = (now) => {
      start ??= now;
      const t = Math.min(1, (now - start) / span);
      // Same easing as the rest of the page, so the number settles on the
      // curve everything else moves on rather than running linearly.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, from, to]);

  return (
    <span ref={ref} className="display block text-[2.75rem] font-light leading-none text-white lg:text-[3.5rem]">
      {value}
      {suffix}
    </span>
  );
}

function Magnetic({ children, className }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 220, damping: 18, mass: 0.5 });
  const y = useSpring(py, { stiffness: 220, damping: 18, mass: 0.5 });

  // Pulls toward the cursor by a third of the distance from its own centre,
  // capped by the element's size. Enough to feel alive, not enough to make the
  // target move out from under the click.
  const follow = (event) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    px.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.32);
    py.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.32);
  };

  const release = () => {
    px.set(0);
    py.set(0);
  };

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={follow}
      onMouseLeave={release}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Closing() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } };
  const once = { once: true, amount: 0.3 };

  return (
    <section className="relative overflow-hidden bg-shade-deep">
      {/* Figures */}
      <div className="shell border-b border-white/10 py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {figures.map((figure) => (
            <motion.div
              key={figure.label}
              {...reveal}
              viewport={once}
              transition={{ duration: 0.7, ease: SETTLE }}
            >
              <dt>
                <Counter from={figure.from} to={figure.to} suffix={figure.suffix} />
              </dt>
              <dd className="body-copy mt-3 text-[12.5px] text-white/45">
                {figure.label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      {/* Closing call to action */}
      <div className="shell relative py-24 text-center md:py-32">
        {/* A single soft bloom behind the headline. Pure CSS, no asset, and it
            keeps the panel from reading as a flat black box. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]"
        />

        <motion.div {...reveal} viewport={once} transition={{ duration: 0.8, ease: SETTLE }}>
          {/* Deliberately not the footer's line. The footer closes every page
              with "Bring Karmo comfort into your home", and this panel sits
              directly above it — the two would otherwise say the same sentence
              twice in a row. */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand">
            Where to buy
          </span>

          <h2 className="display mx-auto mt-7 max-w-3xl text-[2.25rem] font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-[3.25rem] lg:text-[4rem]">
            Karmo is closer
            <span className="font-bold"> than you think</span>
          </h2>

          <p className="body-copy mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
            Stockists and showrooms across Bangladesh, and a dealership
            programme for partners who want to carry Karmo in their district.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Magnetic>
              <Link
                href="/find-store"
                className="btn-primary group inline-flex items-center gap-3 rounded-full bg-brand px-9 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
              >
                Find a store
                <FiArrowUpRight className="text-base transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>

            <a
              href="tel:+8801713483284"
              className="inline-flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
            >
              <FiPhoneCall className="text-xl text-brand" />
              <span className="text-[13px] font-semibold tracking-wide">
                +88 01713483284
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
