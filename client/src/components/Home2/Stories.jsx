"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FiPlay } from "react-icons/fi";
import { useReducedMotion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import Lightbox from "./Lightbox";
import { FadeUp } from "./motion";

/**
 * The reels row — Home 01's videos, this page's dress.
 *
 * Titles, tags and blurbs are Home 01's, which took them from Karmo's own
 * reference build (index.html names the two TVCs, product-Foam.html captions
 * the four short clips). Lengths are read off the files.
 *
 * Behaviour follows Home 01 exactly: hovering a card plays it silently and
 * rewinds on the way out, so every tile always starts on its opening frame;
 * clicking opens it full size with sound.
 *
 * The frames are 4:3 rather than Home 01's 9:16. The footage is landscape —
 * the reels are 1536×1152 and the mattress TVC is 1280×720 — so a portrait
 * frame would crop away most of each shot.
 */
const REELS = [
  {
    src: "/videos/tvc-mattress.mp4",
    title: "Karmo Mattress TVC",
    tag: "Mattress",
    blurb: "The full commercial, start to finish.",
    length: "1:02",
  },
  {
    src: "/videos/reel-4.mp4",
    title: "High-grade spring system",
    tag: "Inside the product",
    blurb: "Pocket springs that answer to each sleeper.",
    length: "0:06",
  },
  {
    src: "/videos/reel-3.mp4",
    title: "Motion isolation",
    tag: "Inside the product",
    blurb: "One side moves, the other stays still.",
    length: "0:06",
  },
  {
    src: "/videos/reel-1.mp4",
    title: "Certiguard protection",
    tag: "Inside the product",
    blurb: "An antimicrobial layer, worked into the build.",
    length: "0:04",
  },
  {
    src: "/videos/reel-2.mp4",
    title: "Lab tested",
    tag: "Quality",
    blurb: "Compression and wear, measured every batch.",
    length: "0:04",
  },
  {
    src: "/videos/tvc-foam.mp4",
    title: "Karmo Foam TVC",
    tag: "Foam",
    blurb: "Where the group started, on film.",
    length: "0:20",
  },
];

function ReelCard({ reel, onOpen, openerRef, reduce, delay }) {
  const videoRef = useRef(null);

  // Silent preview on hover, rewound on the way out.
  const preview = (playing) => {
    const video = videoRef.current;
    if (!video || reduce) return;
    if (playing) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <FadeUp delay={delay} className="story-item">
      <button
        type="button"
        ref={openerRef}
        onClick={onOpen}
        onMouseEnter={() => preview(true)}
        onMouseLeave={() => preview(false)}
        onFocus={() => preview(true)}
        onBlur={() => preview(false)}
        aria-label={`Play ${reel.title}`}
      >
        <video
          ref={videoRef}
          src={reel.src}
          muted
          loop
          playsInline
          // Only the opening frame is fetched up front; the rest streams when
          // a card is actually hovered or opened. Six autoplaying videos would
          // otherwise cost tens of megabytes before anyone asks for one.
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />

        <span className="story-item-veil" aria-hidden="true" />

        <span className="story-item-meta">
          <span className="story-item-tag">{reel.tag}</span>
          <span className="story-item-length">{reel.length}</span>
        </span>

        {/* Swells and hands over to the running preview. */}
        <span className="story-item-play" aria-hidden="true">
          <FiPlay />
        </span>

        <span className="story-item-caption">
          <span className="story-item-title">{reel.title}</span>
          {/* Folded away until the card is picked out — grid-rows animates the
              height without needing a fixed value for it. */}
          <span className="story-item-blurb">
            <span>{reel.blurb}</span>
          </span>
          <span className="story-item-rule" />
        </span>
      </button>
    </FadeUp>
  );
}

export default function Stories() {
  const [active, setActive] = useState(null);
  const openers = useRef([]);
  const reduce = useReducedMotion();

  const close = () => {
    const index = active;
    setActive(null);
    // Focus returns to the card that opened it, not the top of the document.
    openers.current[index]?.focus();
  };

  return (
    <div className="our-stories">
      <div className="container">
        <SectionTitle
          center
          sub="Design stories"
          title="Karmo on"
          bold="film"
        />

        <div className="story-item-list">
          {REELS.map((reel, i) => (
            <ReelCard
              key={reel.src}
              reel={reel}
              delay={(i % 3) * 0.09}
              reduce={reduce}
              openerRef={(el) => (openers.current[i] = el)}
              onOpen={() => setActive(i)}
            />
          ))}
        </div>

        <FadeUp className="section-footer-text">
          <p>
            <span>Free</span>
            Fitting out a hotel, hospital or housing project?{" "}
            <Link href="/contact/bulk-order">Get a free quote.</Link>
          </p>
        </FadeUp>
      </div>

      {active !== null && (
        <Lightbox
          src={REELS[active].src}
          label={REELS[active].title}
          onClose={close}
        />
      )}
    </div>
  );
}
