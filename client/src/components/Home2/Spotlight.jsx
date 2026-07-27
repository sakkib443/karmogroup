"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight, FiHeart, FiLayers, FiShield, FiWind } from "react-icons/fi";
import { FadeUp, Reveal, SplitWords } from "./motion";

/**
 * The mattress deep-dive — Home 01's Spotlights row, rebuilt in Home 02's
 * card language.
 *
 * Every word here is Home 01's, and Home 01 took it from Karmo's own company
 * profile (the page reproduced in recource/Karmo Website/images as matts.png,
 * carrying the karmogroup.com footer). The quilting temperatures, the roller
 * pressure and the four roundel claims are the group's own published copy —
 * condensed, not embellished. Nothing on this page should quote different
 * figures, so if the profile is revised, revise it in both places.
 *
 * What changes from Home 01 is only the dress: the linen panel, the 12px
 * corner, the red rule-and-caps marker and the two-weight heading this page
 * uses everywhere else.
 */
const ITEM = {
  tag: "Mattress",
  title: "We test every mattress.",
  bold: "Every single one.",
  lead: "Your perfect partner for a complete bedding solution.",
  body: "Karmo mattresses are an ergonomic design that supports the contours of the body, body weight and the spine. Quilted by US machinery so air passes between you and the mattress, and edged on European automatic machines at 180–200°C under 500 tonnes of roller pressure, so the mattress never loses its thickness.",
  points: [
    { Icon: FiWind, label: "Anti dust" },
    { Icon: FiShield, label: "Quality certified" },
    { Icon: FiHeart, label: "Recommended by doctors" },
    { Icon: FiLayers, label: "Firm posture" },
  ],
  quote: "Everyone assures quality, but not everyone can promise experiences.",
  href: "/mattress",
  image: "/images/products/spotlight-mattress-cutaway.png",
  alt: "Karmo mattress cut away at one corner, showing the quilted top, comfort foam and pocketed spring base",
};

export default function Spotlight() {
  return (
    <div className="our-spotlight">
      <div className="container">
        <div className="spotlight-item">
          {/* The cut corner is the whole argument — it is the only picture on
              the page that shows what is inside the product rather than what it
              looks like made up on a bed. */}
          <Reveal className="spotlight-item-image">
            <figure>
              <Image
                src={ITEM.image}
                alt={ITEM.alt}
                width={760}
                height={570}
              />
            </figure>
            <span className="spotlight-item-edge" aria-hidden="true">
              {ITEM.tag}
            </span>
          </Reveal>

          <div className="spotlight-item-content">
            <FadeUp>
              <span className="section-sub-title">{ITEM.tag}</span>
            </FadeUp>

            <h2 className="section-heading">
              <SplitWords as="span" text={ITEM.title} className="heading-light" />{" "}
              <SplitWords
                as="span"
                text={ITEM.bold}
                className="heading-bold"
                delay={ITEM.title.split(" ").length * 0.055}
              />
            </h2>

            <FadeUp delay={0.08}>
              <p className="spotlight-lead">{ITEM.lead}</p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="spotlight-body">{ITEM.body}</p>
            </FadeUp>

            {/* Roundels, because these are the four badges Karmo prints on its
                own product pages — same claims, same shape. */}
            <ul className="spotlight-points">
              {ITEM.points.map(({ Icon, label }, i) => (
                <FadeUp key={label} delay={0.16 + i * 0.07} y={22}>
                  <li>
                    <span className="icon-box">
                      <Icon />
                    </span>
                    {label}
                  </li>
                </FadeUp>
              ))}
            </ul>

            <FadeUp delay={0.3}>
              <blockquote className="spotlight-quote">{ITEM.quote}</blockquote>
            </FadeUp>

            <FadeUp delay={0.35}>
              <Link href={ITEM.href} className="btn-outline is-ink">
                Explore {ITEM.tag}
                <span className="icon">
                  <FiArrowUpRight />
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
