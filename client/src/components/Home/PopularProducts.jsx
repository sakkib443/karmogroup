"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

/**
 * Popular products — a retail grid rather than another editorial band.
 *
 * Four cards across the top, then a wide promo tile beside two more, which is
 * the layout the client supplied as reference.
 *
 * Every product name comes from "Site Reference Final.xlsx". Prices come from
 * Karmo's own campaign posters (the taka figures printed on them), so they are
 * the group's real advertised prices — but campaign prices go stale, so they
 * are flagged in HOMEPAGE-STATUS.md for confirmation before launch. The two
 * foam grades carry no price because foam is quoted by specification, not sold
 * at a shelf price.
 */
const products = [
  {
    name: "Pillow Top Pocket Spring",
    category: "Mattress",
    href: "/mattress",
    image: "/images/products/pillow-top-pocket-plain.png",
    scene: "/images/products/pillow-top-pocket-scene.png",
    alt: "Karmo Pillow Top Pocket Spring mattress",
    price: "৳41,919",
    was: "৳52,398",
    badge: "sale",
  },
  {
    name: "Karmo King Mattress",
    category: "Mattress",
    href: "/mattress",
    image: "/images/products/king-plain.png",
    scene: "/images/products/king-scene.png",
    alt: "Karmo King mattress",
    price: "৳9,058",
    was: "৳11,322",
    badge: "sale",
  },
  {
    name: "Karmo 280",
    category: "Foam",
    href: "/foam",
    image: "/images/products/karmo-280-plain-v2.png",
    scene: "/images/products/karmo-280-scene.png",
    alt: "Stack of rose-red Karmo 280 upholstery foam blocks",
    price: "৳4,629",
    was: "৳5,787",
  },
  {
    name: "Red Stripe Comforter",
    category: "HomeTex",
    href: "/hometex",
    image: "/images/products/comforter-red-plain-v2.jpg",
    scene: "/images/products/comforter-red-scene.png",
    alt: "Karmo Red Stripe comforter, rolled and tied",
    price: "৳2,100",
    was: "৳2,900",
    badge: "new",
  },
];

// The two that sit beside the promo tile on the lower row.
const secondary = [
  {
    name: "Karmo Poly",
    category: "Foam",
    href: "/foam",
    image: "/images/products/karmo-poly-plain.png",
    scene: "/images/products/karmo-poly-scene.png",
    alt: "Stack of pale cream Karmo Poly upholstery foam sheets",
    note: "Cut to specification",
  },
  {
    name: "Bed Sheet — Alpona",
    category: "HomeTex",
    href: "/hometex",
    image: "/images/products/bedsheet-alpona-plain.png",
    scene: "/images/products/bedsheet-alpona-scene.png",
    alt: "Folded Karmo Alpona bed sheet in printed off-white cotton",
    note: "Printed cotton",
  },
];

// The wide tile is a banner, not a seventh product — a room scene with the
// copy laid over it, which is why its picture fills the tile rather than
// floating in it like the product cut-outs do.
const promo = {
  eyebrow: "Furniture & upholstery",
  title: ["Karmo", "Foam"],
  price: "৳4,629",
  href: "/foam",
  image: "/images/products/banner-foam.png",
  alt: "Living-room corner with a linen sofa built on Karmo upholstery foam",
};

const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SETTLE } },
};

function Badge({ kind }) {
  if (!kind) return null;
  const isSale = kind === "sale";
  return (
    <span
      className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-[0.08em] text-white ${
        isSale ? "bg-brand" : "bg-emerald-500"
      }`}
    >
      {isSale ? "Sale" : "New"}
    </span>
  );
}

function ProductCard({ item }) {
  return (
    <motion.div variants={card} className="h-full">
      <Link
        href={item.href}
        className="group relative flex h-full flex-col overflow-hidden bg-[#f5f4f2] transition-colors duration-500 hover:bg-[#efedea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <Badge kind={item.badge} />

        {/* The picture runs the full width of the tile, edge to edge. Two shots
            are stacked: the plain cut-out on top, the room scene underneath.
            Hover cross-fades to the scene, so the product is understood on its
            own first and then seen in use. Cards without a `scene` just scale
            their single image instead. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {item.scene && (
            <Image
              src={item.scene}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100"
            />
          )}

          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              item.scene
                ? "group-hover:opacity-0"
                : "group-hover:scale-[1.05]"
            }`}
          />
        </div>

        {/* Caption strip. Deliberately quiet — the picture is doing the work. */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <h3 className="display text-[0.9rem] font-bold leading-tight text-ink">
            {item.name}
          </h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">
            {item.category}
          </p>

          <div className="mt-auto flex items-baseline gap-2.5 pt-3">
            {item.was && (
              <span className="text-[12px] text-ink/35 line-through">
                {item.was}
              </span>
            )}
            {item.price ? (
              <span className="text-[13.5px] font-semibold text-ink">
                {item.price}
              </span>
            ) : (
              <span className="text-[12px] font-medium text-ink/55">
                {item.note}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PopularProducts({ heading }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="shell">
        {heading ?? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: SETTLE }}
          >
            <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              <span className="h-px w-10 bg-brand" />
              Popular products
            </span>
            <h2 className="display mt-5 max-w-xl text-[1.9rem] font-light leading-[1.1] text-ink sm:text-[2.5rem]">
              What people
              <span className="font-bold"> buy most</span>
            </h2>
          </motion.div>
        )}

        {/* Four across the top; below it a promo tile two columns wide with two
            more products beside it. One grid so every gutter lines up. */}
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}

          {/* Promo tile */}
          <motion.div variants={card} className="sm:col-span-2">
            <Link
              href={promo.href}
              className="group relative flex h-full min-h-[19rem] flex-col justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {/* Full-bleed room scene. The banner's picture fills the tile —
                  it is a scene the copy sits on, not a product floating in a
                  frame like the cards beside it. */}
              <Image
                src={promo.image}
                alt={promo.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />

              {/* Keeps the type legible over whatever the photograph is doing.
                  Kept deliberately light — enough contrast under the headline,
                  but the wall and the sofa still read as a photograph rather
                  than something behind frosted glass. The button below carries
                  its own backdrop, so the wash does not have to do that job. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent"
              />

              <div className="relative z-10 max-w-[62%] p-8 sm:p-10">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                  {promo.eyebrow}
                </span>
                <h3 className="display mt-3 text-[2rem] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                  {promo.title.map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </h3>

                <span className="mt-7 inline-flex w-fit items-center gap-3 border border-ink/25 bg-white/80 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-colors duration-500 group-hover:border-brand group-hover:text-brand">
                  From {promo.price}
                  <FiArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          {secondary.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
