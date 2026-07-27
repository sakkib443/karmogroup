"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The four divisions, dealt as a deck. Each card sticks a little lower than
 * the one before it, so they gather into a stack as the page moves instead of
 * scrolling away — the top edge of every card you have already passed stays on
 * screen as a tab.
 *
 * Shared by both homepages — it began as Home 02's divisions block and now
 * carries Home 01's too, which is why it lives here and not under Home2/.
 * Edit once; it changes in both places. If the two treatments ever need to
 * diverge, fork it then, not before.
 *
 * Counts come from "Site Reference Final.xlsx"; the copy is condensed from the
 * division wording the site already used.
 *
 * All four pictures now show what their card sells — the chemicals card carried
 * a plain interior shot for a long time, which was the one place on the page
 * where the image and the label disagreed.
 */
const divisions = [
  {
    index: "01",
    name: "Foam",
    count: "18 grades",
    line: "Furniture, footwear, automotive and acoustic",
    body: "Poured, cured and cut in our own plants. Sheet sizes, densities and grades are cut to the specification you send us — by the piece or by the container.",
    href: "/foam",
    image: "/images/divisions/foam-workshop.png",
    alt: "Stacked upholstery foam blocks beside a Karmo linen cushion on an upholstery workbench",
  },
  {
    index: "02",
    name: "Mattress",
    count: "9 models",
    line: "Bonnell, pocket spring, euro top and orthopaedic",
    body: "Quilted on US machinery and edged on European automatic lines, so the mattress holds its thickness. Every batch is sampled before it leaves the floor.",
    href: "/mattress",
    image: "/images/divisions/mattress-euro-top.png",
    alt: "Karmo euro-top mattress with its brand label, dressed on a bed",
  },
  {
    index: "03",
    name: "HomeTex",
    count: "5 ranges",
    line: "Pillows, cushions, bed sheets and comforters",
    body: "Classic cotton twills through to sateen weaves, and the country's largest comforter range by distribution. Bedding that finishes the room the foam started.",
    href: "/hometex",
    image: "/images/divisions/hometex-bedding.png",
    alt: "Layered Karmo bedding — quilted comforter, floral bed sheet and pillows",
  },
  {
    index: "04",
    name: "Chemicals",
    count: "16 products",
    line: "Adhesives, polymers and sodium silicate",
    body: "The least visible division and the one in almost every room it touches — shoe adhesives, contact adhesives, sealants and the polymers industry runs on.",
    href: "/chemicals",
    image: "/images/divisions/chemicals-insoles.png",
    alt: "Moulded polyurethane insoles beside a cut foam block showing its cell structure",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

/**
 * Two palettes, one layout. Home 02 is dark the whole way down; Home 01 is
 * editorial and light, and a slate panel dropped into it reads as a section
 * borrowed from another site.
 *
 * Every value here is a complete utility name on purpose — Tailwind scans this
 * file for literal strings, so a class assembled from fragments at runtime
 * would never make it into the stylesheet.
 */
const TONES = {
  dark: {
    section: "bg-shade",
    heading: "text-white",
    card: "border-white/10 bg-shade-deep",
    meta: "text-white/40",
    name: "text-white",
    body: "text-white/55",
    button: "btn-secondary border-white/20 text-white",
    // The edge mark sits on the card itself now, not over the photograph, so
    // it is toned against the card surface rather than the image.
    edgeMark: "text-white/30",
  },
  light: {
    section: "bg-linen",
    heading: "text-ink",
    card: "border-ink/10 bg-white",
    meta: "text-ink/40",
    name: "text-ink",
    body: "text-ink/60",
    // No btn-secondary here: its hover fills white and turns the border white
    // too, which on a white card leaves nothing to see.
    button: "border-ink/15 text-ink hover:border-brand hover:text-brand",
    edgeMark: "text-ink/30",
  },
};

export default function DivisionStack({ tone = "dark", heading }) {
  const reduceMotion = useReducedMotion();
  const t = TONES[tone] ?? TONES.dark;

  return (
    <section className={`${t.section} py-20 md:py-28`}>
      {/* Home 03 passes a unified SectionHeading; both homepages otherwise keep
          this block's own line-and-caps header. */}
      {heading ? (
        <div className="shell">{heading}</div>
      ) : (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: SETTLE }}
          className="shell"
        >
          <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-10 bg-brand" />
            Four divisions
          </span>
          <h2 className={`display mt-5 max-w-2xl text-[1.9rem] font-light leading-[1.1] sm:text-[2.6rem] ${t.heading}`}>
            One group, one standard,
            <span className="font-bold"> four things to sell</span>
          </h2>
        </motion.div>
      )}

      {/* Each card is its own sticky context. The top offset grows with the
          index so the cards land staggered rather than perfectly on top of one
          another, leaving a strip of every previous card visible. */}
      <div className="shell mt-14">
        {divisions.map((division, index) => (
          <div
            key={division.name}
            className="sticky mb-8 last:mb-0"
            style={{ top: `${7 + index * 1.6}rem` }}
          >
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: SETTLE }}
              className={`overflow-hidden rounded-3xl border ${t.card}`}
            >
              <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
                <div className="order-2 flex flex-col justify-between gap-8 p-7 sm:p-10 lg:order-1">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="display text-[11px] font-bold tracking-[0.2em] text-brand">
                        {division.index}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${t.meta}`}>
                        {division.count}
                      </span>
                    </div>

                    <h3 className={`display mt-5 text-[2.25rem] font-bold uppercase leading-none tracking-[-0.02em] sm:text-[3rem] ${t.name}`}>
                      {division.name}
                    </h3>

                    <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.1em] text-brand">
                      {division.line}
                    </p>

                    <p className={`body-copy mt-6 max-w-md text-[14px] leading-[1.9] ${t.body}`}>
                      {division.body}
                    </p>
                  </div>

                  <Link
                    href={division.href}
                    className={`group inline-flex w-fit items-center gap-4 rounded-full border py-2 pl-7 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${t.button}`}
                  >
                    Explore {division.name}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                      <FiArrowUpRight />
                    </span>
                  </Link>
                </div>

                {/* The photograph is left completely alone — no wash, no
                    gradient over it. Instead it sits inset in the card as a
                    framed plate, with the division name running down a slim
                    strip of card beside it. That keeps Karmo's own edge-marking
                    device from the company profile without putting anything on
                    top of the picture. */}
                <div className="order-1 flex lg:order-2 lg:min-h-[26rem] lg:p-3">
                  <span
                    aria-hidden="true"
                    className={`hidden shrink-0 items-center justify-center pr-1 lg:flex ${t.edgeMark}`}
                  >
                    <span
                      className="display select-none whitespace-nowrap text-[0.68rem] font-bold uppercase tracking-[0.32em]"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {division.name}
                    </span>
                  </span>

                  <div className="group/pic relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:rounded-2xl">
                    <Image
                      src={division.image}
                      alt={division.alt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pic:scale-[1.04]"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        ))}
      </div>
    </section>
  );
}
