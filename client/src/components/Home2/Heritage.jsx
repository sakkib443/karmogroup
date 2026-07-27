"use client";

import Link from "next/link";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { FadeUp, Reveal } from "./motion";

/**
 * The heritage band — the reference's flat-discount block, kept shape for
 * shape and given something true to say.
 *
 * What was here counted down to 31 December 2026 under the headline "Amazing
 * Flat Discounts On Every Mattress", promising free delivery, free old-mattress
 * removal and a 100-night exchange. None of that came from Karmo; it was the
 * template's copy with the group's name dropped in, and a countdown to a sale
 * that does not exist is a promise the showroom cannot keep.
 *
 * The four figures below are Home 01's published numbers — the division counts
 * from DivisionStack and the 1965 founding date it states as "a legacy of 60
 * years". Nothing here is rounded up or invented. If a count changes there, it
 * changes here.
 */
const FIGURES = [
  { value: "60", label: "Years since 1965" },
  { value: "4", label: "Divisions" },
  { value: "18", label: "Foam grades" },
  { value: "9", label: "Mattress models" },
];

export default function Heritage() {
  return (
    <div className="our-heritage dark-section">
      <div className="container">
        <div className="heritage-row">
          <div className="heritage-content">
            <SectionTitle
              sub="Since 1965"
              title="Sixty years of comfort,"
              bold="engineered in Dhaka"
              text="Four divisions under one roof — foam, mattresses, HomeTex bedding and polymers. Everything is manufactured in-house on our own lines, density-tested before it leaves the floor, and carried by stockists nationwide."
            />

            <div className="heritage-body">
              <FadeUp>
                <div className="heritage-figures">
                  {FIGURES.map((figure) => (
                    <div className="figure-box" key={figure.label}>
                      <span>{figure.value}</span>
                      <p>{figure.label}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            <FadeUp className="heritage-btn">
              <Link href="/about/history" className="btn-default btn-highlighted">
                Read Our Story
              </Link>
            </FadeUp>
          </div>

          <Reveal from="right" className="heritage-image">
            <figure>
              <Image
                src="/images/foam/karmo-1965-sofa.jpg"
                alt="A sofa built on Karmo upholstery foam, the product the group started with in 1965"
                width={620}
                height={597}
              />
            </figure>

            <div className="heritage-badge">
              <strong>1965</strong>
              <span>Established</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
