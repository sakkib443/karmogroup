"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";

/**
 * Homepage hero — original left / right / center placement, one-line title.
 */

const SLIDES = [
  {
    id: "home-journey-1965",
    align: "center",
    titleCard: true,
    veil: true,
    headingLead: "The Journey Since 1965",
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
    titleCard: true,
    veil: true,
    headingLead: "The Journey Since 1965",
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
    titleCard: true,
    headingLead: "Industrial chemistry built to last",
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
    titleCard: true,
    headingLead: "Moments that make a house",
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
    titleCard: true,
    veil: true,
    headingLead: "Foam crafted for living",
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
    titleCard: true,
    headingLead: "Crafted for nights that last",
    image: {
      src: "/karmo/images/mattress/hero/cooling-cat-karmo-handle-hq.jpg",
      alt: "Karmo mattress in a calm bedroom with a sleeping cat",
      unoptimized: true,
      width: 1983,
      height: 793,
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
