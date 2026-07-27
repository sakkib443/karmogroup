"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import SectionTitle from "./SectionTitle";
import { FadeUp } from "./motion";

/**
 * The four divisions — the only product categories the site actually has.
 *
 * Names, counts, links and images are taken from Home 01's DivisionStack
 * rather than written again here, so the two homepages cannot drift apart and
 * quote different numbers for the same business. If a count changes, it
 * changes there and is mirrored here.
 */
const CATEGORIES = [
  {
    name: "Foam",
    count: "18 grades",
    line: "Furniture, footwear, automotive and acoustic",
    src: "/images/divisions/foam-workshop.png",
    alt: "Stacked upholstery foam blocks beside a Karmo linen cushion on an upholstery workbench",
    href: "/foam",
  },
  {
    name: "Mattress",
    count: "9 models",
    line: "Bonnell, pocket spring, euro top and orthopaedic",
    src: "/images/divisions/mattress-euro-top.png",
    alt: "Karmo euro-top mattress with its brand label, dressed on a bed",
    href: "/mattress",
  },
  {
    name: "HomeTex",
    count: "5 ranges",
    line: "Pillows, cushions, bed sheets and comforters",
    src: "/images/divisions/hometex-bedding.png",
    alt: "Layered Karmo bedding — quilted comforter, floral bed sheet and pillows",
    href: "/hometex",
  },
  {
    name: "Chemicals",
    count: "16 products",
    line: "Adhesives, polymers and sodium silicate",
    src: "/images/divisions/chemicals-insoles.png",
    alt: "Moulded polyurethane insoles beside a cut foam block showing its cell structure",
    href: "/chemicals",
  },
];

export default function Categories() {
  return (
    <div className="our-categories" id="categories">
      <div className="container">
        <SectionTitle
          center
          sub="Shop by category"
          title="One group,"
          bold="four divisions"
        />

        <div className="category-item-list">
          {CATEGORIES.map((cat, i) => (
            <FadeUp key={cat.name} delay={i * 0.09} className="category-item">
              <Link href={cat.href}>
                <div className="category-item-image">
                  <Image
                    src={cat.src}
                    alt={cat.alt}
                    width={420}
                    height={420}
                  />
                  <span className="category-item-count">{cat.count}</span>
                  <span className="category-item-arrow" aria-hidden="true">
                    <FiArrowUpRight />
                  </span>
                </div>

                <div className="category-item-content">
                  <div className="category-item-head">
                    <span className="category-item-index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{cat.name}</h3>
                  </div>
                  <p>{cat.line}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
