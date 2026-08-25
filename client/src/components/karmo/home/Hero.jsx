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
  hometex: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "HomeTex Brand",
    badge: BADGE,
  },
  chemicals: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "Adhesive Brand",
    badge: BADGE,
  },
};

const HEAD_COMFORT = {
  ...LINE.foam,
  headingLead: "We create the",
  headingAccent: "chemistry of comfort",
  kicker: "Sink in. Stay longer.",
  cta: [{ label: "Shop now", href: "/products", primary: true }],
};

const SLIDES = [
  {
    id: "home-sofa-motion",
    align: "left",
    breeze: true,
    ...HEAD_COMFORT,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-motion.jpg",
      alt: "A woman reclining on a terracotta motion sofa with a soft cool air glow",
      width: 1920,
      height: 1080,
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
      src: "/karmo/images/mattress/Gemini_Generated_Image_iyl84kiyl84kiyl8.jpg",
      alt: "Karmo mattress in a calm bedroom with a sleeping cat",
      width: 3140,
      height: 1344,
    },
  },
  {
    id: "home-mattress-coastal",
    align: "right",
    tone: "light",
    ...LINE.mattress,
    headingLead: "Rest that feels",
    headingAccent: "like open air",
    kicker: "Sunlit comfort, crafted for deeper nights",
    cta: [{ label: "Explore mattress", href: "/mattress", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-mattress-coastal-v1.jpg",
      alt: "A plush mattress on a wooden bed overlooking a sunny coastal patio",
      width: 1920,
      height: 1080,
      position: "object-center",
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
      src: "/karmo/images/home-02/hero/home-hero-slide-chemicals-hero.jpg",
      alt: "Organized Karmo chemicals warehouse with blue drums in cinematic light",
      width: 1920,
      height: 1080,
      position: "object-center",
    },
  },
  {
    id: "home-sofa-cool",
    align: "left",
    breeze: true,
    ...HEAD_COMFORT,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-karmo-cool.jpg",
      alt: "A woman resting on a Karmo-style foam sofa with lavender cushions",
      width: 1920,
      height: 1080,
    },
  },
  {
    id: "home-sofa-yellow",
    align: "left",
    tone: "light",
    ...HEAD_COMFORT,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-yellow-clean.jpg",
      alt: "A woman resting on a cream sofa against a sunny yellow wall",
      width: 1920,
      height: 1080,
      position: "object-[center_55%]",
    },
  },
  {
    id: "home-mattress-lifestyle",
    align: "left",
    ...LINE.mattress,
    headingLead: "Moments that make a house",
    headingAccent: "feel like home",
    kicker: "We test every mattress, every single one",
    cta: [{ label: "Explore mattress", href: "/mattress", primary: true }],
    image: {
      src: "/karmo/images/mattress/chatgpt-about-hero.png",
      alt: "A Karmo mattress styled in a calm bedroom",
      width: 1916,
      height: 821,
    },
  },
  {
    id: "home-hometex-pillows",
    align: "left",
    ...LINE.hometex,
    headingLead: "Where comfort",
    headingAccent: "meets elegance",
    kicker: "Pillows and linen made for the softest sink-in",
    cta: [{ label: "Explore HomeTex", href: "/hometex", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-hometex-pillows.jpg",
      alt: "A woman resting among soft HomeTex pillows in morning light",
      width: 1920,
      height: 1080,
    },
  },
  {
    id: "home-hometex-luxe",
    align: "right",
    ...LINE.hometex,
    headingLead: "Soft layers for",
    headingAccent: "deeper rest",
    kicker: "Pillows, quilts and throws — HomeTex comfort",
    cta: [{ label: "Shop HomeTex", href: "/hometex", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-hometex-luxe-v6.jpg",
      alt: "A woman resting under a Karmo Ivory Flower comforter in a bright navy bedroom",
      width: 1920,
      height: 1080,
    },
  },
];

export default function Hero() {
  return (
    <OverlayHeroSlider
      slides={SLIDES}
      asHero
      size="viewport"
      className="mb-0"
    />
  );
}
