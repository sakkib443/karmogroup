"use client";

import { TbShieldCheck, TbFeather, TbCertificate } from "react-icons/tb";

import FoamPromise from "@/components/karmo/home/FoamPromise";

/**
 * "Sleep Well, Live Well" — the homepage's three-claim trust band (FoamPromise),
 * reused here with the mattress copy from the client's reference screenshot.
 * Same dark film background, orange leaf rule and solid middle card; only the
 * heading, subline and the three claims change.
 */
const claims = [
  {
    id: "long-lasting",
    icon: TbShieldCheck,
    badge: "bg-[#E03131]",
    title: "Long Lasting",
    body: "Built with premium-quality materials and durable non-sag filling, Karmo mattresses are designed to hold their shape and comfort over the years — real support and lasting performance for years of restful sleep.",
  },
  {
    id: "anti-allergic",
    icon: TbFeather,
    badge: "bg-[#1C7ED6]",
    title: "Anti Allergic",
    body: "Our mattresses feature anti-allergic filling and breathable cotton fabric to reduce dust and allergens, giving you a cleaner, healthier sleeping environment for you and your family.",
    /* The odd card out — solid white in the middle, like the homepage band. */
    solid: true,
  },
  {
    id: "quality-certified",
    icon: TbCertificate,
    badge: "bg-[#2F9E44]",
    title: "Quality Certified",
    body: "Experience exceptional rest built with premium cotton fabric and high-density microfibre filling. Gentle on the skin and breathable — a naturally cosy rest for a peaceful night's sleep.",
  },
];

export default function MattressPromise() {
  return (
    <FoamPromise
      heading="Sleep Well, Live Well"
      subline="Everyone Assures Quality, But Not Everyone Can Promise Experience"
      claims={claims}
      /* The client's own "Mattress 1" clip loops behind the band; the sea-beach
         still stays as the poster/fallback until the video is ready. */
      still="/karmo/images/mattress/mattress-sleep-well-bg.jpg"
      film="/karmo/videos/mattress-sleep-well.mp4"
      showFilm
    />
  );
}
