"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LazyVideo from "@/components/karmo/LazyVideo";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * A full-viewport video banner for the top of a division page — the video
 * counterpart to `DivisionAbout`'s `asHero` overlay and `BedAutomotiveHero`.
 * Built for `/foam/furniture`'s new acoustic-foam-wall clip, but left generic
 * (video/heading/playbackRate as props) so any division can swap its static
 * `about` hero for one without a new component.
 *
 * The old `about` hero is not deleted when this is used — `DivisionPage` just
 * skips it while `data.videoHero` is set, so restoring the static banner
 * later is a one-line removal in the division's data file, not a rebuild.
 *
 * ── The loop ────────────────────────────────────────────────────────────
 * Two stacked copies of one clip, cross-faded at the seam — `FoamPromise`'s
 * loop rig, copied rather than imported (that component is a whole section
 * with its own heading and claims; there is nothing to import without taking
 * all of it). A plain `<LazyVideo loop>` restarts on a hard cut, which is exactly
 * what the client asked to smooth over: when the playing copy is within
 * `CROSSFADE` of its end, the other starts from zero and the two swap
 * opacity, so the seam reads as a dissolve instead of a jump.
 */
const CROSSFADE = 0.8;

export default function DivisionVideoHero({
  video,
  poster,
  /* A still picture instead of the clip. When set it wins over `video`, so
     switching back is removing this one field. */
  image,
  imageAlt = "",
  /* Where the still is anchored when the screen crops it (CSS object-position). */
  imagePosition = "75% center",
  /* Extra style for the still (e.g. a slight zoom and lift). */
  imageStyle,
  /* More stills after the first, crossfading in turn: [{ image, alt, position, style }].
     They are shown as they are — no dark shade, no heading (those belong to slide 1). */
  moreSlides = [],
  slideMs = 5500,
  /* Leave slide 1 out for now (only the extra slides show). */
  firstSlideOff = false,
  /* Show the extra slides first and slide 1 after them. */
  extraFirst = false,
  /* How long each foam stack stays on a slide that cycles stacks (ms). */
  productMs = 3600,
  heading,
  /* "center" (the video default) or "left" — over a picture with an empty
     dark left side, the heading sits there. */
  align = "center",
  /* Client asked for the clip "a little slow" — under 1 plays it back at that
     fraction of native speed. Applied on the element itself rather than to
     the video file, so the source stays untouched. */
  playbackRate = 0.65,
  /* Optional cut-out product laid over the picture, tilted and enlarged:
     { src, alt, w, h, width: "38vw", rotate: -10, right: "6vw", bottom: "8%" }. */
  product,
}) {
  const reduceMotion = useReducedMotion();
  const layerA = useRef(null);
  const layerB = useRef(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);
  const skipFirst = Boolean(firstSlideOff && image && moreSlides.length);
  const slideCount = image ? 1 + moreSlides.length : 1;
  /* The slides that take turns, in play order (slide 1 left out while it is switched off;
     the extra slides first when `extraFirst`). */
  const base = Array.from({ length: slideCount }, (_, i) => i).filter((i) => !(skipFirst && i === 0));
  const order = extraFirst ? [...base.filter((i) => i !== 0), ...base.filter((i) => i === 0)] : base;
  const [slide, setSlide] = useState(order[0] ?? 0);
  /* A slide that cycles foam stacks stays up until every stack has had its turn. */
  const holdFor = (i) => {
    const sl = i > 0 ? moreSlides[i - 1] : null;
    const n = sl?.products?.length || 0;
    return n > 1 ? n * productMs : slideMs;
  };
  useEffect(() => {
    if (order.length < 2 || reduceMotion) return undefined;
    const id = window.setTimeout(
      () => setSlide((cur) => order[(order.indexOf(cur) + 1) % order.length]),
      holdFor(slide)
    );
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, order.length, slideMs, productMs, reduceMotion]);
  const step = (dir) => setSlide((cur) => order[(order.indexOf(cur) + dir + order.length) % order.length]);
  const onFirst = slide === 0;

  const relay = useCallback(
    (which) => (event) => {
      if (which !== front) return;
      const el = event.currentTarget;
      const remaining = el.duration - el.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE) return;

      const other = which === 0 ? layerB.current : layerA.current;
      if (!other) return;
      other.currentTime = 0;
      other.playbackRate = playbackRate;
      // Autoplay can still be refused — a power-saving tab, an OS setting.
      // Swallowing it leaves the outgoing layer showing rather than throwing.
      other.play().catch(() => {});
      setFront(which === 0 ? 1 : 0);
    },
    [front, playbackRate]
  );

  const park = (event) => {
    const el = event.currentTarget;
    el.pause();
    el.currentTime = 0;
  };

  useEffect(() => {
    for (const el of [layerA.current, layerB.current]) {
      if (el) el.playbackRate = playbackRate;
    }
    if (layerA.current?.readyState >= 2) setReady(true);
  }, [playbackRate]);

  const layerProps = (which) => ({
    ref: which === 0 ? layerA : layerB,
    src: video,
    poster,
    /* `hero-breathe` is the slow brightness rise-and-fall the client asked
       for, on both layers so it reads as continuous through the crossfade
       rather than resetting each loop. */
    className:
      "hero-breathe absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear",
    style: { opacity: ready && front === which ? 1 : 0 },
    muted: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    tabIndex: -1,
    onLoadedData: (event) => {
      event.currentTarget.playbackRate = playbackRate;
      setReady(true);
    },
    onTimeUpdate: relay(which),
    onEnded: park,
  });

  return (
    <section
      aria-label={heading}
      className={`relative isolate h-[calc(100vh-112px)] overflow-hidden text-white ${
        image ? "bg-black" : "bg-[#f7f8f8]"
      }`}
    >
      {product?.cover && product?.src ? (
        /* The product itself as the full-bleed background: tilted and enlarged until it
           fills the width (client, 23 Nov 2026). */
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#2b2d30]">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: product.width || "130vw",
              transform: `translate(-50%, -50%) rotate(${product.rotate ?? -16}deg)`,
            }}
          >
            <Image
              src={product.src}
              alt={product.alt || ""}
              width={product.w}
              height={product.h}
              priority
              sizes="140vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      ) : image ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            /* load first only when this is the slide that shows first */
            priority={!extraFirst}
            sizes="100vw"
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{ objectPosition: imagePosition, ...(imageStyle || {}), opacity: onFirst ? 1 : 0 }}
          />
          {moreSlides.map((sl, i) => [
            /* Fill behind a slide that is shifted (no black band where it moved off). */
            sl.bg ? (
              <div
                key={`${sl.image}-bg`}
                aria-hidden
                className="absolute inset-0 z-[1] transition-opacity duration-1000 ease-in-out"
                style={{ background: sl.bg, opacity: slide === i + 1 ? 1 : 0 }}
              />
            ) : null,
            <Image
              key={sl.image}
              src={sl.image}
              alt={sl.alt || ""}
              fill
              priority={extraFirst && i === 0}
              sizes="100vw"
              className="z-[1] object-cover transition-opacity duration-1000 ease-in-out"
              style={{ objectPosition: sl.position || "center", ...(sl.style || {}), opacity: slide === i + 1 ? 1 : 0 }}
            />,
            /* Optional white floor wedge and a product standing on it (glossy shadow + mirror). */
            sl.floor || sl.product || sl.products || sl.shade ? (
              <div
                key={`${sl.image}-stage`}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-1000 ease-in-out"
                style={{ opacity: slide === i + 1 ? 1 : 0 }}
              >
                {sl.floor ? (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: sl.floor.clip,
                        background: "linear-gradient(180deg, #ffffff 0%, #f6f4f1 100%)",
                      }}
                    />
                  </>
                ) : null}
                {/* a light dark veil over the whole picture, the white floor included — only the
                    foam stays clear of it */}
                {sl.shade ? <div className="absolute inset-0" style={{ background: sl.shade }} /> : null}
                {sl.products?.length || sl.product ? (
                  <ProductCycler items={sl.products || [sl.product]} place={sl.productPlace || sl.product} active={slide === i + 1} every={productMs} />
                ) : null}
              </div>
            ) : null,
          ])}
        </>
      ) : reduceMotion ? (
        poster && (
          <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
        )
      ) : (
        <>
          <LazyVideo {...layerProps(0)} autoPlay />
          <LazyVideo {...layerProps(1)} />
        </>
      )}
      {/* Footage, or a still with the heading centred: the same flat dark
          scrim every other hero on the site uses for white text (separate
          from `hero-breathe`, which dims/lifts the footage itself). A still
          with a left heading keeps its own light — it only gets a left-side
          shade, so the heading still reads where a narrow screen crops the
          picture's dark side away. */}
      {image && align === "left" ? (
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent lg:from-black/40 lg:via-transparent"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: onFirst ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {product?.src && !product.cover ? (
        <div
          className="pointer-events-none absolute z-[1]"
          style={{
            width: product.width || "38vw",
            right: product.right ?? "6vw",
            bottom: product.bottom ?? "8%",
            left: product.left,
            top: product.top,
            transform: `rotate(${product.rotate ?? -10}deg)`,
            transformOrigin: "50% 60%",
          }}
        >
          <Image
            src={product.src}
            alt={product.alt || ""}
            width={product.w}
            height={product.h}
            priority
            sizes="45vw"
            className="block h-auto w-full"
            style={{ filter: "drop-shadow(0 28px 30px rgba(0,0,0,0.45))" }}
          />
        </div>
      ) : null}

      {heading && (
        <div
          style={{ opacity: onFirst ? 1 : 0, transition: "opacity 1000ms ease-in-out" }}
          className={`absolute inset-0 z-[2] flex flex-col justify-center px-4 sm:px-8 lg:px-14 xl:px-20 ${
            align === "left"
              ? "items-start text-left lg:pl-[max(3.5rem,calc((100vw-1600px)/2+4rem))]"
              : "items-center text-center"
          }`}
        >
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            /* Matches the Home / HomeTex / Bed & Automotive hero headings —
               the one weight and size this site's video banners now share.
               Dead-centre both axes, at the client's ask — was right-aligned,
               vertically centred only. */
            className="display whitespace-nowrap uppercase text-white"
            style={{
              fontSize: "clamp(1.12rem, 0.92rem + 1.45vw, 2.4rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              letterSpacing: "0.12em",
              lineHeight: 1.1,
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}
          >
            {heading}
          </motion.h1>
        </div>
      )}
      {order.length > 1 ? (
        /* Arrows at the bottom: step back / forward through the slides. */
        <div className="absolute bottom-5 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <FiChevronLeft className="text-[18px]" />
          </button>
          <span className="flex gap-1.5" aria-hidden>
            {order.map((i) => (
              <span key={i} className={`h-[3px] rounded-full transition-all duration-500 ${slide === i ? "w-7 bg-white" : "w-3 bg-white/55"}`} />
            ))}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <FiChevronRight className="text-[18px]" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

/* Foam stacks standing on the white floor, taking turns: each glides in from the right and
   fades up while the one before glides out to the left. Every stack keeps its own glossy
   shadow and mirror. */
export function ProductCycler({ items, place, active, every = 3600 }) {
  /* place.shadow: 1 = the hero's shadow; higher = a deeper one. */
  const k = place.shadow || 1;
  const [cur, setCur] = useState(0);
  /* Each time its slide comes up, start again from the first stack. */
  useEffect(() => {
    if (active) setCur(0);
  }, [active]);
  useEffect(() => {
    if (!active || items.length < 2) return undefined;
    const id = window.setInterval(() => setCur((c) => (c + 1) % items.length), every);
    return () => window.clearInterval(id);
  }, [active, items.length, every]);
  return (
    <div className="absolute" style={{ left: place.left, right: place.right, bottom: place.bottom, width: place.width }}>
      {/* sizer so the box has the first stack's height */}
      <div style={{ aspectRatio: `${items[0].w} / ${items[0].h}` }} />
      {items.map((it, idx) => {
        /* (the index is `idx` — `k` is the shadow strength above) */
        const on = idx === cur;
        const before = (idx - cur + items.length) % items.length === items.length - 1;
        return (
          <div
            key={it.src}
            className="absolute inset-x-0 bottom-0"
            style={{
              opacity: on ? 1 : 0,
              transform: `translateX(${on ? 0 : before ? -14 : 14}%)`,
              transition: "opacity 900ms ease-in-out, transform 1100ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Image
              src={it.src}
              alt=""
              width={it.w}
              height={it.h}
              sizes="30vw"
              priority={Boolean(place.eager) && idx === 0}
              className="relative z-[1] block h-auto w-full"
              style={{ filter: `drop-shadow(0 ${10 * k}px ${10 * k}px rgba(0,0,0,${Math.min(0.5, 0.25 * k)}))` }}
            />
            <div
              className="absolute inset-x-[-4%] bottom-[-4%]"
              style={{
                height: `${9 * k}%`,
                background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${Math.min(0.7, 0.35 * k)}) 0%, rgba(0,0,0,${Math.min(0.25, 0.1 * k)}) 55%, rgba(0,0,0,0) 100%)`,
              }}
            />
            {/* Glossy floor mirror. The outer box sits right under the stack and squashes from
                its top edge (place.mirror < 1 keeps it inside a band whose bottom edge is close);
                the picture inside is flipped in place. */}
            <div
              className="pointer-events-none absolute left-0 top-full w-full"
              style={{
                transform: `scaleY(${place.mirror || 1})`,
                transformOrigin: "50% 0%",
                opacity: Math.min(0.6, 0.35 * k),
                WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent ${place.mirror ? 85 : Math.min(60, 35 * k)}%)`,
                maskImage: `linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent ${place.mirror ? 85 : Math.min(60, 35 * k)}%)`,
              }}
            >
              <Image
                src={it.src}
                alt=""
                width={it.w}
                height={it.h}
                sizes="30vw"
                className="block h-auto w-full"
                style={{ transform: "scaleY(-1)" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
