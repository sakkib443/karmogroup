"use client";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";

/**
 * Homepage hero — original left / right / center placement, one-line title.
 */

const SLIDES = [
  // TRIAL (4 Oct): "1.mp4" — a 3.3s clip of an empty room furnishing itself.
  // Plays once at normal speed, then rests on the finished room before the
  // next slide.
  {
    id: "home-video-assemble",
    align: "center",
    titleCard: true,
    headingLead: "The Journey Since 1965",
    holdMs: 6000,
    video: {
      src: "/karmo/videos/home/hero-video-1.mp4",
      poster: "/karmo/videos/home/hero-video-1-poster.webp",
    },
  },
  // TRIAL (4 Oct): two stock interior clips (4K originals cut to 1080p web
  // MP4s) as the first two slides; each holds for its own clip length.
  {
    id: "home-video-living",
    align: "center",
    titleCard: true,
    headingLead: "Foam crafted for living",
    holdMs: 14800, // 18.5s clip at 1.25x
    video: {
      src: "/karmo/videos/home/hero-video-a.mp4",
      rate: 1.25,
      poster: "/karmo/videos/home/hero-video-a-poster.webp",
      // Framed a little lower in the clip so the picture sits higher on screen.
      position: "object-[50%_68%]",
    },
  },
  {
    id: "home-video-dining",
    align: "center",
    titleCard: true,
    headingLead: "Moments that make a house",
    holdMs: 10400, // 13s clip at 1.25x
    video: {
      src: "/karmo/videos/home/hero-video-b.mp4",
      rate: 1.25,
      poster: "/karmo/videos/home/hero-video-b-poster.webp",
    },
  },
  {
    id: "home-video-lounge",
    align: "center",
    titleCard: true,
    headingLead: "The Journey Since 1965",
    holdMs: 12200, // 15.2s clip at 1.25x
    video: {
      src: "/karmo/videos/home/hero-video-c.mp4",
      rate: 1.25,
      poster: "/karmo/videos/home/hero-video-c-poster.webp",
    },
  },
  // TRIAL (4 Oct): Gemini room-tour clip as the opening slide. Holds for the
  // 10s clip, then the photo slides follow. Remove this entry to drop it.
  {
    id: "home-room-tour-trial",
    align: "center",
    titleCard: true,
    headingLead: "The Journey Since 1965",
    holdMs: 10000,
    video: { src: "/karmo/videos/home/hero-room-tour-trial.mp4" },
  },
  {
    id: "home-journey-1965",
    align: "center",
    titleCard: true,
    veil: true,
    headingLead: "The Journey Since 1965",
    image: {
      src: "/karmo/images/home-02/hero/home-hero-slide-01-mustard-room-hq.webp",
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
      src: "/karmo/images/home-02/hero/home-hero-slide-living-scandi-v3-hq.webp",
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
      src: "/karmo/images/home-02/hero/home-hero-slide-chemicals-hero-hq.webp",
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
      src: "/karmo/images/home-02/hero/home-hero-slide-hometex-quilts-v2-hq.webp",
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
      src: "/karmo/images/home-02/hero/home-hero-slide-foam-real-v23-hq.webp",
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
      src: "/karmo/images/mattress/hero/cooling-cat-karmo-handle-hq.webp",
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
