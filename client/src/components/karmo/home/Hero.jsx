"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";

/**
 * Homepage hero — copy follows open space.
 * Each slide keeps the classic Bangladesh’s [NO.1 badge] … Brand line
 * exactly as DivisionBanner / the old hero used it.
 */

const BADGE = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

const LINE = {
  foam: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "Foam Brand",
    badge: BADGE,
  },
  mattress: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "Mattress Brand",
    badge: BADGE,
  },
  chemicals: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "Adhesive Brand",
    badge: BADGE,
  },
};

const SLIDES = [
  {
    id: "home-sofa-motion",
    align: "left",
    breeze: true,
    ...LINE.foam,
    headingLead: "We create the",
    headingAccent: "chemistry of comfort",
    kicker: "Sink in. Stay longer.",
    cta: [{ label: "Shop now", href: "/products", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-motion-hq.jpg",
      alt: "A woman reclining on a terracotta motion sofa with a soft cool air glow",
      width: 1536,
      height: 1024,
    },
  },
  {
    id: "home-mattress-cat",
    align: "right",
    ...LINE.mattress,
    headingLead: "Crafted for nights",
    headingAccent: "that last",
    kicker: "Every Karmo mattress is tested, one by one",
    cta: [{ label: "Find a store", href: "/find-store", primary: true }],
    image: {
      src: "/karmo/images/mattress/hero/cooling-cat-snowy-window-hq.jpg",
      alt: "Karmo mattress in a calm bedroom with a sleeping cat",
      width: 2560,
      height: 1096,
    },
  },
  {
    id: "home-chemicals-warehouse",
    align: "left",
    ...LINE.chemicals,
    headingLead: "Industrial chemistry",
    headingAccent: "built to last",
    kicker: "We test every batch, every single drum",
    cta: [{ label: "Explore Chemicals", href: "/chemicals", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-chemicals-hero-hq.jpg",
      alt: "Organized Karmo chemicals warehouse with blue drums in cinematic light",
      width: 1536,
      height: 1024,
      position: "object-center",
    },
  },
  {
    id: "home-mattress-summer-cool-real",
    align: "left",
    breeze: true,
    ...LINE.mattress,
    headingLead: "The mattress",
    headingAccent: "your summer needs",
    kicker: "Powered by advanced cooling technology",
    cta: [{ label: "Explore mattress", href: "/mattress", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-mattress-summer-cool-hq.jpg",
      alt: "A woman sleeping under a floral Karmo comforter with a cool glow along the mattress",
      width: 1536,
      height: 1024,
      position: "object-center",
    },
  },
];

export default function Hero() {
  return (
    <OverlayHeroSlider
      slides={SLIDES}
      asHero
      size="viewport"
      firstSlideMs={2600}
      autoplayMs={4500}
      fadeDuration={1.25}
      className="mb-0"
    />
  );
}
