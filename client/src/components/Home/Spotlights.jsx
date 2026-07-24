"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowUpRight,
  FiShield,
  FiWind,
  FiHeart,
  FiLayers,
  FiFeather,
  FiDroplet,
  FiThermometer,
  FiBox,
} from "react-icons/fi";

/**
 * Headlines, copy and claims below are taken from Karmo's own company profile
 * — the pages reproduced in korbo group/Karmo Website/images as matts.png
 * (p06), homms.png (p08-09) and Polly.png (p05), each carrying the
 * karmogroup.com footer. Nothing here is invented; the wording is condensed,
 * not embellished.
 */
const spotlights = [
  {
    index: "01",
    tag: "Mattress",
    title: "We test every mattress.",
    titleAccent: "Every single one.",
    lead: "Your perfect partner for a complete bedding solution.",
    body: "Karmo mattresses are an ergonomic design that supports the contours of the body, body weight and the spine. Quilted by US machinery so air passes between you and the mattress, and edged on European automatic machines at 180–200°C under 500 tonnes of roller pressure, so the mattress never loses its thickness.",
    points: [
      { icon: FiWind, label: "Anti dust" },
      { icon: FiShield, label: "Quality certified" },
      { icon: FiHeart, label: "Recommended by doctors" },
      { icon: FiLayers, label: "Firm posture" },
    ],
    quote: "Everyone assures quality, but not everyone can promise experiences.",
    href: "/mattress",
    image: "/images/mattress-detail.jpg",
    alt: "A hand pressing into the quilted top of a Karmo mattress",
  },
  {
    index: "02",
    tag: "HomeTex",
    title: "Where comfort",
    titleAccent: "meets elegance.",
    lead: "Nearly two decades in homes across the nation.",
    body: "Premium bedsheets from classic cotton twills to silky sateen weaves and Egyptian cotton. The country's largest manufacturer of comforters and duvets by revenue and distribution — and an extensive range of pillows, from hollow conjugate fibre to feather-touch microfibre and memory foam contour.",
    points: [
      { icon: FiLayers, label: "Bed sheets" },
      { icon: FiBox, label: "Comforters" },
      { icon: FiFeather, label: "Pillows" },
      { icon: FiHeart, label: "Cushions" },
    ],
    quote: "Blending tradition with innovation to redefine home comfort.",
    href: "/hometex",
    image: "/images/comforter-red-stripe.jpg",
    alt: "Karmo Red Stripe comforter, rolled",
  },
  {
    index: "03",
    tag: "Chemicals & Polymers",
    title: "The world of",
    titleAccent: "polyurethane.",
    lead: "Footbeds, insoles and the chemistry behind them.",
    body: "Karmo has operated in Bangladesh since 1965 and became the market leader in the foaming industry by volume, as the largest manufacturer. From foam and mattresses to pillows, the group expanded into chemicals and polymers — with every imported raw material coming from world-class suppliers.",
    points: [
      { icon: FiDroplet, label: "Adhesives" },
      { icon: FiThermometer, label: "Polyurethane" },
      { icon: FiBox, label: "Sodium silicate" },
      { icon: FiShield, label: "Footbeds & insole" },
    ],
    quote:
      "Fifty years outlasting competing brands on recognition and quality.",
    href: "/chemicals",
    image: "/images/foam-karmo-hd.jpg",
    alt: "Stack of green Karmo HD polyurethane foam blocks",
  },
];

const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: SETTLE } },
};

const curtain = {
  hidden: { y: "0%" },
  show: { y: "-101%", transition: { duration: 1.05, ease: SWEEP } },
};

function Spotlight({ item, flipped, reveal, once, curtainColour }) {
  return (
    <motion.article
      variants={group}
      {...reveal}
      viewport={once}
      className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      {/* Picture. On wide screens every other row puts it on the right, so the
          three rows read as a rhythm rather than a list. */}
      <div className={flipped ? "lg:order-2" : ""}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5">
          <motion.div
            variants={{
              hidden: { scale: 1.14 },
              show: { scale: 1, transition: { duration: 1.5, ease: SWEEP } },
            }}
            className="absolute inset-0"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.span
            aria-hidden="true"
            variants={curtain}
            className={`absolute inset-0 z-10 ${curtainColour}`}
          />

          {/* Index sits on the picture, the way a chapter number would. */}
          <span className="display absolute bottom-5 left-5 z-20 text-[2.5rem] font-bold leading-none text-white/85 mix-blend-difference">
            {item.index}
          </span>
        </div>
      </div>

      <div className={flipped ? "lg:order-1" : ""}>
        <span className="block overflow-hidden">
          <motion.span
            variants={line}
            className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
          >
            <span className="h-px w-10 bg-brand" />
            {item.tag}
          </motion.span>
        </span>

        <h3 className="display mt-5 text-[1.7rem] font-light leading-[1.15] text-ink sm:text-[2.1rem]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block">
              {item.title}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block font-bold">
              {item.titleAccent}
            </motion.span>
          </span>
        </h3>

        <span className="mt-5 block overflow-hidden">
          <motion.span
            variants={line}
            className="block text-[15px] font-medium text-ink/75"
          >
            {item.lead}
          </motion.span>
        </span>

        <motion.p
          variants={fade}
          className="mt-4 max-w-xl text-[14px] leading-[1.9] text-ink/60"
        >
          {item.body}
        </motion.p>

        <motion.ul
          variants={group}
          className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2"
        >
          {item.points.map((point) => (
            <motion.li
              key={point.label}
              variants={fade}
              className="flex items-center gap-3 text-[13px] font-semibold text-ink"
            >
              <point.icon className="shrink-0 text-base text-brand" />
              {point.label}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={fade}
          className="mt-7 border-l-2 border-brand/40 pl-4 text-[13px] italic leading-relaxed text-ink/55"
        >
          {item.quote}
        </motion.p>

        <motion.div variants={fade}>
          <Link
            href={item.href}
            className="btn-secondary group mt-8 inline-flex items-center gap-4 rounded-full border border-ink/20 py-2 pl-7 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
          >
            Explore {item.tag}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Spotlights() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.2 };

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="space-y-20 md:space-y-28">
        {spotlights.map((item, index) => (
          <Spotlight
            key={item.tag}
            item={item}
            flipped={index % 2 === 1}
            reveal={reveal}
            once={once}
            curtainColour="bg-white"
          />
        ))}
      </div>
    </section>
  );
}
