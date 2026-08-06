"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise, VIEWPORT } from "../motion";
import HeadingThree, { Mark } from "./HeadingThree";

/**
 * The chain — the one claim this business can make that its competitors cannot,
 * and the section neither other homepage has.
 *
 * Home 01 shows the four divisions as four photographs of four rooms; Home 02's
 * header lists them as four menu entries. Both present them as a *range*. They
 * are not a range, they are a sequence: the chemistry goes into the foam, the
 * foam goes into the mattress, and the mattress is dressed in the bedding.
 * Karmo owns every step of that, which is the actual reason to buy from a group
 * rather than from four suppliers — and until this section, nowhere on the site
 * says it.
 *
 * So the order here is deliberately **not** the order of the navigation. The
 * menu leads on Foam because that is the biggest division; the rail leads on
 * Chemistry because that is where the material starts. The rail is what makes
 * the difference legible: a line the eye follows left to right rather than four
 * cards it has to be told are related.
 *
 * The connector is drawn per node rather than as one absolutely-positioned line
 * across the list. A single line would have to know the column widths and the
 * gutter to stop at the last dot instead of running off the end, and it would
 * have to know them again at every breakpoint. Each node simply reaches its own
 * neighbour, so the last one draws nothing and the geometry stays correct at
 * any width.
 *
 * The lead is the sentence the site already publishes as its own description
 * (see the metadata in the (karmo) layout), so it is approved by use rather
 * than newly written.
 */

const steps = [
  {
    index: "01",
    name: "Chemistry",
    line: "Polyols, adhesives and sodium silicate, blended in our own plant",
    href: "/chemicals",
  },
  {
    index: "02",
    name: "Foam",
    line: "Poured, cured and cut to grade — furniture, footwear, automotive",
    href: "/foam",
  },
  {
    index: "03",
    name: "Mattress",
    line: "Pocket spring, euro top, orthopaedic and memory foam",
    href: "/mattress",
  },
  {
    index: "04",
    name: "HomeTex",
    line: "Bed sheets, comforters, pillows and cushions",
    href: "/hometex",
  },
];

export default function ChainRail() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="shell">
        <HeadingThree
          index="01"
          eyebrow="One group, four plants"
          title={["Nothing here is", <Mark key="a">bought in</Mark>]}
          lead="From the foam inside a sofa to the mattress on the bed and the adhesive holding it together, it is made in our own plants."
        />

        <motion.ol
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-14 grid gap-8 md:mt-20 md:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.name}
              variants={rise}
              className="relative pl-9 md:pl-0 md:pt-7"
            >
              {/* Reaches its own neighbour and no further; the last node draws
                  nothing, which is what stops the rail overrunning the list. */}
              {i < steps.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute left-[5px] top-4 h-[calc(100%+1rem)] w-px bg-ink/12 md:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-[5px] hidden h-px w-[calc(100%+1rem)] bg-ink/12 md:block"
                  />
                </>
              )}

              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-brand bg-white"
              />

              <Link href={step.href} className="group block">
                <span className="display flex items-center gap-2 text-[11px] font-bold tabular-nums tracking-[0.1em] text-ink/30">
                  {step.index}
                  <FiArrowUpRight className="text-[13px] text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>

                <h3 className="display mt-2 text-[1.35rem] font-semibold! tracking-[-0.025em] text-ink transition-colors duration-300 group-hover:text-brand lg:text-[1.55rem]">
                  {step.name}
                </h3>

                <p className="body-copy mt-2.5 max-w-[24ch] text-[13px] leading-[1.75] text-ink/55">
                  {step.line}
                </p>
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
