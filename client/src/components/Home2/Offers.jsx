"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "./motion";

/**
 * The two offer banners.
 *
 * Deliberately NOT percentage discounts. The figures that were here — "Save up
 * to 40%", "Extra 15% off" — came from the reference template, not from Karmo,
 * and a manufacturer advertising a sale it is not running is a claim it cannot
 * honour at the till.
 *
 * So each banner carries something the group can actually stand behind, and the
 * two are pitched at different buyers: one at the household walking into a
 * showroom, one at the contractor buying by the container. Both link to routes
 * the site already has.
 *
 * If real campaign figures arrive, drop them into `kicker` — the layout takes a
 * discount line just as happily.
 */
const BANNERS = [
  {
    kicker: "Across all 64 districts",
    title: "Find a Karmo Showroom Near You",
    cta: "Find a Store",
    href: "/find-store",
    src: "/livora/offer-item-image-1.jpg",
    alt: "A furnished living room in warm daylight",
  },
  {
    kicker: "Quoted in two working days",
    title: "Bulk Supply, Cut to Your Specification",
    cta: "Request a Quote",
    href: "/contact/bulk-order",
    src: "/livora/offer-item-image-2.jpg",
    alt: "A furnished interior with layered seating and soft lighting",
  },
];

export default function Offers() {
  return (
    <div className="our-offers">
      <div className="container">
        <div className="offer-item-list">
          {BANNERS.map((banner, i) => (
            <FadeUp key={banner.title} delay={i * 0.12} className="offer-item">
              <div className="offer-item-image">
                <figure>
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </figure>
              </div>

              <div className="offer-item-content-box">
                <div className="offer-item-content">
                  <p>{banner.kicker}</p>
                  <h3>{banner.title}</h3>
                </div>

                <div className="offer-item-readmore-btn">
                  <Link href={banner.href} className="readmore-btn">
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
