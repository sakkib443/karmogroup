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
  hometex: {
    eyebrowStart: "Bangladesh’s",
    eyebrowEnd: "HomeTex Brand",
    badge: BADGE,
  },
};

const SLIDES = [
  {
    id: "home-journey-1965",
    align: "center",
    /* Site tagline — same line as Iconic brands / About */
    headingLead: "The Journey Since 1965",
    headingAccent: "",
    veil: true,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-mustard-room-hq.png",
      alt: "Mustard sofa in a blue-walled living room with plants and wood shelves",
      width: 1979,
      height: 795,
      position: "object-center",
    },
  },
  {
    id: "home-living-scandi",
    align: "center",
    headingLead: "The Journey Since 1965",
    headingAccent: "",
    veil: true,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-living-scandi-v3-hq.png",
      alt: "Warm living room with a cream sofa, wood shelves and round coffee table",
      width: 1978,
      height: 795,
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
      src: "/karmo/images/home-02/hero/home-hero-slide-chemicals-hero-hq.jpg",
      alt: "Organized Karmo chemicals warehouse with blue drums in cinematic light",
      width: 1536,
      height: 1024,
      position: "object-center",
    },
  },
  {
    id: "home-hometex-quilts",
    align: "left",
    ...LINE.hometex,
    headingLead: "Moments that make a house",
    headingAccent: "feel like home",
    kicker: "We finish every set, every single stitch",
    cta: [{ label: "Explore HomeTex", href: "/hometex", primary: true }],
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-hometex-quilts-v2-hq.jpg",
      alt: "Stacked Karmo HomeTex floral quilts on a sunlit bed",
      width: 2560,
      height: 1019,
      position: "object-center",
    },
  },
  {
    id: "home-foam-room",
    align: "center",
    headingLead: "Foam crafted for living",
    headingAccent: "",
    veil: true,
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-foam-real-v23-hq.jpg",
      alt: "KARMO HD and KARMO 280 foam stacks in a sunlit mustard living room",
      width: 2560,
      height: 1017,
      position: "object-left",
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
];

export default function Hero() {
  return (
    <OverlayHeroSlider
      slides={SLIDES}
      asHero
      size="viewport"
      firstSlideMs={5200}
      autoplayMs={4500}
      fadeDuration={1.25}
      className="mb-0"
    />
  );
}
