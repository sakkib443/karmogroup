"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";

/**
 * Homepage hero — copy follows open space.
 * Order: motion → cat → chemicals → then the rest.
 */

const HEAD_COMFORT = {
  headingLead: "We create the",
  headingAccent: "chemistry of comfort",
  kicker: "Sink in. Stay longer.",
  cta: [{ label: "Shop now", href: "/products", primary: true }],
};

const SLIDES = [
  {
    /* Was #2 → now #1 */
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
    /* Was #5 → now #2 */
    id: "home-mattress-cat",
    align: "right",
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
    /* Was last → now #3 */
    id: "home-chemicals-warehouse",
    align: "left",
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
    headingLead: "The new",
    headingAccent: "comfort range",
    kicker: "Sink in. Stay longer.",
    cta: [{ label: "Shop now", href: "/products", primary: true }],
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
    headingLead: "The new",
    headingAccent: "comfort range",
    kicker: "Sink in. Stay longer.",
    cta: [{ label: "Shop now", href: "/products", primary: true }],
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
