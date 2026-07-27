"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { FadeUp } from "./motion";

/**
 * The gallery mosaic — Home 01's block, in this page's dress.
 *
 * A tall tile at each end with a wide-then-narrow row sitting over a
 * narrow-then-wide one, so the vertical seams never line up. Both rows add to
 * exactly twelve columns and the tall tiles span both, which is what makes the
 * block a solid rectangle with no empty cell.
 *
 * The two tall slots take hero photographs — they are the only frames with
 * enough happening in the centre to survive a portrait crop. The event
 * photography is all landscape at roughly 3:2 and would be cropped to slivers
 * in a tall tile, so it takes the wide and narrow slots.
 *
 * `span` holds complete class strings rather than assembled ones: Tailwind
 * scans this file for literals, so `lg:col-span-${n}` would never reach the
 * stylesheet.
 */
const TILES = [
  {
    src: "/images/hero/slide-1-hometex-couple.png",
    alt: "Couple reading together in a bedroom dressed with Karmo bedding",
    span: "lg:col-span-3 lg:row-span-2",
  },
  {
    src: "/images/gallery/award-ceremony.jpg",
    alt: "Karmo Group team at an award ceremony",
    span: "lg:col-span-4",
  },
  {
    src: "/images/gallery/mou-meeting.jpg",
    alt: "Karmo Group meeting around the boardroom table",
    span: "lg:col-span-2",
  },
  {
    src: "/images/hero/slide-2-mattress-suite.png",
    alt: "Karmo mattress dressed in a sunlit bedroom suite",
    span: "lg:col-span-3 lg:row-span-2",
  },
  {
    src: "/images/gallery/jute-bag-handover.jpg",
    alt: "A Karmo Group eco-friendly jute bag being handed over",
    span: "lg:col-span-2",
  },
  {
    src: "/images/gallery/agreement-signing.jpg",
    alt: "Karmo Group representatives at an agreement signing",
    span: "lg:col-span-4",
  },
  {
    src: "/images/divisions/foam-workshop.png",
    alt: "Foam blocks and a Karmo cushion on an upholstery workbench",
    span: "lg:col-span-3",
  },
  {
    src: "/images/products/banner-foam.png",
    alt: "Living-room corner with a sofa built on Karmo upholstery foam",
    span: "lg:col-span-6",
  },
  {
    src: "/images/products/whykarmo-family.jpg",
    alt: "A Bangladeshi family together on a sofa built on Karmo foam",
    span: "lg:col-span-3",
  },
];

export default function Gallery() {
  return (
    <div className="our-gallery">
      {/* Oversized word behind the mosaic, the way Home 01 sets it. */}
      <span className="gallery-watermark" aria-hidden="true">
        gallery
      </span>

      <div className="container">
        <SectionTitle sub="Gallery" title="The group" bold="at work" />
      </div>

      {/* Full bleed on purpose: the heading above keeps the page gutter, the
          pictures deliberately do not. */}
      <FadeUp className="gallery-grid" amount={0.08}>
        {TILES.map((tile) => (
          <div key={tile.src} className={`gallery-tile ${tile.span}`}>
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        ))}
      </FadeUp>
    </div>
  );
}
