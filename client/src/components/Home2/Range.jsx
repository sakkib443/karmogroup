"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * A read-first index of the range: names as a list, with the product only
 * appearing under the cursor on the row you are actually on. It is the
 * opposite of the picture-led rails above it, which is the point — the page
 * needs somewhere to slow down and just name things.
 *
 * Every entry is a real product from "Site Reference Final.xlsx".
 */
const rows = [
  {
    name: "Karmo Signature",
    division: "Foam",
    href: "/foam",
    image: "/images/FurnitureFoam4.png",
    alt: "Stack of Karmo Poly foam sheets",
  },
  {
    name: "Karmo Prestige Mattress",
    division: "Mattress",
    href: "/mattress",
    image: "/images/mattress-prestige.jpg",
    alt: "Karmo Prestige mattress on a low timber platform bed",
  },
  {
    name: "Karmo Bed Sheet",
    division: "HomeTex",
    href: "/hometex",
    image: "/images/fabric-alpona.jpg",
    alt: "Alpona printed cotton bed sheet fabric",
  },
  {
    name: "Karmo Pillow Top Pocket Spring",
    division: "Mattress",
    href: "/mattress",
    image: "/images/mattress-pillow-top-pocket.jpg",
    alt: "Karmo Pillow Top Pocket Spring mattress on a cane bed",
  },
  {
    name: "Karmo 280",
    division: "Foam",
    href: "/foam",
    image: "/images/foam-karmo-280.jpg",
    alt: "Stack of red Karmo 280 foam blocks",
  },
  {
    name: "Karmo Comforter",
    division: "HomeTex",
    href: "/hometex",
    image: "/images/comforter-red-stripe.jpg",
    alt: "Karmo Red Stripe comforter, rolled",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

export default function Range() {
  const reduceMotion = useReducedMotion();
  const listRef = useRef(null);
  const [active, setActive] = useState(null);

  // Raw pointer position, then a spring on top. Without the spring the preview
  // is welded to the cursor and reads as a tooltip; with it, the picture trails
  // slightly and reads as a thing being dragged along.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.6 });

  const track = (event) => {
    const bounds = listRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
  };

  return (
    <section className="bg-shade-deep py-20 md:py-28">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: SETTLE }}
        className="shell flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-10 bg-brand" />
            Index
          </span>
          <h2 className="display mt-5 max-w-lg text-[1.9rem] font-light leading-[1.1] text-white sm:text-[2.6rem]">
            Forty-seven products.
            <span className="font-bold"> Six to start.</span>
          </h2>
        </div>

        <p className="body-copy hidden max-w-xs text-[13px] leading-relaxed text-white/45 md:block">
          Hover a line to see it.
        </p>
      </motion.div>

      <div
        ref={listRef}
        onMouseMove={reduceMotion ? undefined : track}
        onMouseLeave={() => setActive(null)}
        className="shell relative mt-12"
      >
        <ul className="border-t border-white/10">
          {rows.map((row, index) => (
            <li key={row.name} className="border-b border-white/10">
              <Link
                href={row.href}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                className="group/row flex items-center justify-between gap-6 py-6 focus-visible:outline-none md:py-8"
              >
                {/* The row slides right on hover. Because the preview trails
                    the cursor from the left, the two motions read as the line
                    making room for the picture. */}
                <span
                  className={`flex min-w-0 items-baseline gap-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:gap-8 ${
                    reduceMotion ? "" : "group-hover/row:translate-x-3 group-focus-visible/row:translate-x-3"
                  }`}
                >
                  <span className="display shrink-0 text-[11px] font-bold tracking-[0.2em] text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`display truncate text-[1.35rem] font-light leading-tight transition-colors duration-500 sm:text-[2rem] ${
                      active === index ? "text-white" : "text-white/55"
                    }`}
                  >
                    {row.name}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-5">
                  <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:block">
                    {row.division}
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                      active === index
                        ? "border-brand bg-brand text-white"
                        : "border-white/15 text-white/50"
                    }`}
                  >
                    <FiArrowUpRight />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Preview. Pointer-events off so it can never sit between the cursor
            and the row that is driving it. Hidden below md and under reduced
            motion — on a touch screen there is no hover to follow. */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            style={{ x, y }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
          >
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  key={rows[active].name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: SETTLE }}
                  className="relative -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative h-56 w-44 overflow-hidden rounded-xl ring-1 ring-white/15 lg:h-72 lg:w-56">
                    <Image
                      src={rows[active].image}
                      alt=""
                      fill
                      sizes="14rem"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
