"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import SectionTitle from "./SectionTitle";
import { FadeUp, Stagger, StaggerItem } from "./motion";

/**
 * Popular products — the same section Home 01 runs, rebuilt in Home 02's card
 * language.
 *
 * Product names, prices and photography are Home 01's, not re-invented here:
 * the names come from "Site Reference Final.xlsx" and the taka figures are the
 * ones printed on Karmo's own campaign posters. The two foam grades carry no
 * price because foam is quoted by specification rather than sold at a shelf
 * price. If a price changes on Home 01, mirror it here.
 *
 * Each card carries two photographs — a plain cut-out and a room scene — and
 * swaps between them on hover. That pairing is the whole reason the section
 * works, so a product without a scene shot is marked and falls back to a zoom
 * rather than pretending to have one.
 */
const TOP_ROW = [
  {
    name: "Pillow Top Pocket Spring",
    category: "Mattress",
    href: "/mattress",
    image: "/images/products/pillow-top-pocket-plain.png",
    scene: "/images/products/pillow-top-pocket-scene.png",
    alt: "Karmo Pillow Top Pocket Spring mattress",
    price: "৳41,919",
    was: "৳52,398",
    badge: "sale",
  },
  {
    name: "Karmo King Mattress",
    category: "Mattress",
    href: "/mattress",
    image: "/images/products/king-plain.png",
    scene: "/images/products/king-scene.png",
    alt: "Karmo King mattress",
    price: "৳9,058",
    was: "৳11,322",
    badge: "sale",
  },
  {
    name: "Karmo 280",
    category: "Foam",
    href: "/foam",
    image: "/images/products/karmo-280-plain-v2.png",
    scene: "/images/products/karmo-280-scene.png",
    alt: "Stack of rose-red Karmo 280 upholstery foam blocks",
    price: "৳4,629",
    was: "৳5,787",
  },
  {
    name: "Red Stripe Comforter",
    category: "HomeTex",
    href: "/hometex",
    image: "/images/products/comforter-red-plain-v2.jpg",
    scene: "/images/products/comforter-red-scene.png",
    alt: "Karmo Red Stripe comforter, rolled and tied",
    price: "৳2,100",
    was: "৳2,900",
    badge: "new",
  },
];

/* The two that sit beside the promo tile on the lower row. */
const BOTTOM_ROW = [
  {
    name: "Karmo Poly",
    category: "Foam",
    href: "/foam",
    image: "/images/products/karmo-poly-plain.png",
    scene: "/images/products/karmo-poly-scene.png",
    alt: "Stack of pale cream Karmo Poly upholstery foam sheets",
    note: "Cut to specification",
  },
  {
    name: "Bed Sheet — Alpona",
    category: "HomeTex",
    href: "/hometex",
    image: "/images/products/bedsheet-alpona-plain.png",
    scene: "/images/products/bedsheet-alpona-scene.png",
    alt: "Folded Karmo Alpona bed sheet in printed off-white cotton",
    note: "Printed cotton",
  },
];

/* A banner, not a seventh product — which is why its picture fills the tile
   instead of floating in it like the cut-outs beside it. */
const PROMO = {
  eyebrow: "Furniture & upholstery",
  title: ["Karmo", "Foam"],
  price: "৳4,629",
  href: "/foam",
  image: "/images/products/banner-foam.png",
  alt: "Living-room corner with a linen sofa built on Karmo upholstery foam",
};

const SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw";

function ProductCard({ item }) {
  return (
    <StaggerItem className={`product-item${item.scene ? " has-scene" : ""}`}>
      <Link href={item.href}>
        <div className="product-item-media">
          {item.scene && (
            <Image
              src={item.scene}
              alt=""
              aria-hidden="true"
              fill
              sizes={SIZES}
              className="product-item-scene"
            />
          )}

          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes={SIZES}
            className="product-item-plain"
          />

          {item.badge && (
            <span
              className={`product-item-badge${
                item.badge === "new" ? " is-new" : ""
              }`}
            >
              {item.badge === "new" ? "New" : "Sale"}
            </span>
          )}
        </div>

        <div className="product-item-body">
          <h3 className="product-item-title">{item.name}</h3>
          <p className="product-item-cat">{item.category}</p>

          <div className="product-item-price">
            {item.was && <span className="was">{item.was}</span>}
            {item.price ? (
              <span className="now">{item.price}</span>
            ) : (
              <span className="note">{item.note}</span>
            )}
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}

export default function Products() {
  return (
    <div className="our-products">
      <div className="container">
        <SectionTitle
          sub="Popular products"
          title="What people"
          bold="buy most"
        />

        <Stagger className="product-item-list">
          {TOP_ROW.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}

          {/* Two columns wide, sitting at the left of the lower row. */}
          <StaggerItem className="product-promo">
            <Link href={PROMO.href}>
              <Image
                src={PROMO.image}
                alt={PROMO.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
              />
              <span className="product-promo-veil" aria-hidden="true" />

              <div className="product-promo-content">
                <span className="product-promo-eyebrow">{PROMO.eyebrow}</span>
                <h3>
                  {PROMO.title.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </h3>
                <span className="product-promo-btn">
                  From {PROMO.price}
                  <i>
                    <FiArrowRight />
                  </i>
                </span>
              </div>
            </Link>
          </StaggerItem>

          {BOTTOM_ROW.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </Stagger>

        <FadeUp className="section-footer-text">
          <p>
            <span>10-Year Warranty</span>
            On every Karmo mattress.{" "}
            <Link href="/shop">View our all products.</Link>
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
