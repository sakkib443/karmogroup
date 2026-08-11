"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Instagram Shop — left copy + right masonry (the layout the client kept),
 * with Home 02 borders / type / brand colour rather than the reference’s
 * pill button and soft rounded tiles.
 */

const INSTAGRAM_URL = "https://www.instagram.com/karmogroup/";
const HANDLE = "@karmogroup";

const columns = [
  [
    {
      id: "green-bedroom",
      src: "/karmo/images/home-02/gallery/03-engineered-green-bedroom.webp",
      alt: "A couple reading together in a green-walled bedroom with a tan buttoned bed",
      ratio: "aspect-[3/4]",
    },
    {
      id: "breathable",
      src: "/karmo/images/home-02/gallery/02-breathable-bedroom.webp",
      alt: "A made bed in warm neutral linen beside a ribbed oak nightstand",
      ratio: "aspect-[4/5]",
    },
  ],
  [
    {
      id: "living-room",
      src: "/karmo/images/home-02/certified/bg-living-room.jpg",
      alt: "A bright living room with soft seating and warm daylight",
      ratio: "aspect-[5/4]",
    },
    {
      id: "bedding-room",
      src: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
      alt: "A styled bedroom with Karmo HomeTex bedding",
      ratio: "aspect-[3/5]",
    },
  ],
  [
    {
      id: "foam-sofa",
      src: "/karmo/images/home-02/divisions/foam-karmo-sofa-lavender-blocks.jpeg",
      alt: "A lavender sofa scene with Karmo foam blocks in the studio",
      ratio: "aspect-[3/4]",
    },
    {
      id: "comforter",
      src: "/karmo/images/home-02/gallery/04-better-tomorrow-sleeping-comforter.webp",
      alt: "Someone asleep under a Karmo comforter printed with gold palm fronds",
      ratio: "aspect-[4/5]",
    },
  ],
];

function Shot({ shot }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open Instagram — ${shot.alt}`}
      className={`group relative block w-full overflow-hidden border border-ink/8 ${shot.ratio}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(min-width: 1024px) 18vw, (min-width: 768px) 28vw, 42vw"
        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <span
        aria-hidden
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
      >
        <FaInstagram className="text-[15px] sm:text-base" />
      </span>
    </a>
  );
}

export default function InstagramShop() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="shell">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-12 xl:gap-16"
        >
          <motion.div variants={fade} className="min-w-0 max-w-md lg:max-w-none">
            <h2 className="display text-[1.85rem] font-bold! leading-[1.1]! tracking-[-0.02em] text-ink sm:text-[2.15rem] lg:text-[2.45rem]">
              Instagram Shop
            </h2>
            <p className="body-copy mt-4 max-w-[22rem] text-[15px] leading-[1.7] text-ink/55 lg:text-[16px]">
              Tag {HANDLE} in your Instagram photos for a chance to be featured
              here.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-[50px] items-center justify-center border border-ink/12 px-8 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
            >
              Visit Our Instagram
            </a>
          </motion.div>

          <motion.div
            variants={fade}
            className="grid grid-cols-2 gap-3 md:grid-cols-3"
          >
            {columns.map((col, i) => (
              <div key={`ig-col-${i}`} className="flex flex-col gap-3">
                {col.map((shot) => (
                  <Shot key={shot.id} shot={shot} />
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
