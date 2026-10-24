"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlay,
  FiPlus,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { formatTaka } from "@/components/karmo/product/productDetailData";
import { getPricingRule } from "@/components/karmo/product/mattressPricing";
import { getFoamPricingRule } from "@/components/karmo/product/foamPricing";
import { OFFER_PCT, quoteMattressUnit } from "@/components/karmo/product/catalogueQuote";

const DEFAULT_BUYBOX_ICONS = [
  {
    src: "/products/common/buybox-icons/warranty-10.webp",
    label: "10-years warranty",
  },
  {
    src: "/products/common/buybox-icons/dual-side.webp",
    label: "Dual side usage",
  },
  {
    src: "/products/common/buybox-icons/antimicrobial.webp",
    label: "Anti Microbial Fabric",
  },
  {
    src: "/products/common/buybox-icons/nights-100.webp",
    label: "100 night returns",
  },
];

const EASE = [0.22, 1, 0.36, 1];

const SIZE_ICONS = {
  single: "/products/common/size-icons/single.webp",
  double: "/products/common/size-icons/double.webp",
  queen: "/products/common/size-icons/queen.webp",
  king: "/products/common/size-icons/king.webp",
  custom: "/products/common/size-icons/custom.webp",
};

function OptionBlock({ title, children }) {
  return (
    <div className="border-b border-ink/10 py-2.5">
      <div className="mb-2.5 flex items-center gap-2">
        <FiChevronDown className="shrink-0 text-ink/65" size={14} />
        <span className="text-[15px] font-semibold text-ink/85">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ThumbButton({ src, active, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`relative block overflow-hidden border transition-colors ${
        active ? "border-brand" : "border-ink/10 hover:border-ink/30"
      } ${className}`}
    >
      <Image src={src} alt="" fill unoptimized sizes="120px" className="object-contain bg-[#f3f1ec]" />
    </button>
  );
}

/**
 * Thumbnails under the main picture, starting at the picture's left edge.
 * When there are more than fit, the row scrolls sideways (swipe or wheel) and
 * a square arrow shows at whichever end still has pictures to reveal.
 */
/** `fill`: a fixed short set (the five K-A-R-M-O letters) — equal tiles that share the full width, no scrolling. */
function ThumbStrip({ items, mainSrc, onPick, labelFor, film, className = "", itemClassName = "w-[68px] xl:w-[76px]", fill = false }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () =>
      setEdges({
        prev: el.scrollLeft > 2,
        next: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    el.addEventListener("scroll", update, { passive: true });
    // Fires once on observe, then on every resize — covers the first measure too.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items.length]);

  const go = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={`relative mt-3 ${className}`}>
      <ul
        ref={ref}
        className={fill ? "grid gap-2" : "scrollbar-hide flex snap-x gap-2 overflow-x-auto"}
        style={fill ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}
      >
        {film ? (
          <li className={`shrink-0 snap-start ${itemClassName}`}>
            <button
              type="button"
              onClick={() => onPick(film.src)}
              aria-label="Play product video"
              aria-pressed={mainSrc === film.src}
              className={`relative block aspect-square w-full overflow-hidden border transition-colors ${
                mainSrc === film.src ? "border-brand" : "border-ink/10 hover:border-ink/30"
              }`}
            >
              <Image src={film.poster} alt="" fill unoptimized sizes="120px" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="flex h-7 w-7 items-center justify-center bg-white/95 text-brand">
                  <FiPlay className="ml-0.5 text-[14px]" aria-hidden />
                </span>
              </span>
            </button>
          </li>
        ) : null}
        {items.map((src, i) => (
          <li key={`${src}-${i}`} className={`shrink-0 snap-start ${itemClassName}`}>
            <ThumbButton
              src={src}
              active={mainSrc === src}
              onClick={() => onPick(src)}
              label={labelFor(i)}
              className="aspect-square w-full"
            />
          </li>
        ))}
      </ul>
      {edges.prev ? <StripArrow dir={-1} onClick={() => go(-1)} /> : null}
      {edges.next ? <StripArrow dir={1} onClick={() => go(1)} /> : null}
    </div>
  );
}

function StripArrow({ dir, onClick }) {
  const Icon = dir < 0 ? FiChevronLeft : FiChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Previous photos" : "More photos"}
      className={`absolute top-1/2 z-[2] flex h-9 w-8 -translate-y-1/2 items-center justify-center border border-ink/15 bg-white/95 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:border-brand hover:text-brand ${
        dir < 0 ? "left-0" : "right-0"
      }`}
    >
      <Icon className="text-[18px]" aria-hidden />
    </button>
  );
}

export default function ProductHero({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const reduce = useReducedMotion();

  const letterGallery = product.letterGallery?.length
    ? product.letterGallery
    : [];
  const realGallery = product.realGallery?.length
    ? product.realGallery
    : product.gallery || [];
  const cover = product.cover || realGallery[0] || letterGallery[0];
  const sizes = product.sizes || [];
  const defaultSize = sizes.find((s) => s.id === "queen") || sizes[0];
  const isFoam = product.pricingFamily === "foam";
  const pricingRule = isFoam
    ? getFoamPricingRule(product.slug)
    : getPricingRule(product.slug);
  /* No sales-calculator rule (e.g. Foam Sit / Back): sold by the piece at the
     catalogue price, so there is no size to choose. */
  const fixedPrice = !pricingRule;
  const heightLocked = pricingRule?.heightFixed != null;
  const heightChoices = pricingRule?.heightOptions || null;
  const buyboxIcons = isFoam
    ? product.buyboxIcons?.length
      ? product.buyboxIcons
      : DEFAULT_BUYBOX_ICONS
    : product.buyboxIcons || [];
  const fabricTitle = product.fabricTitle || "Fabric";
  const textureSrc =
    product.textureSrc ||
    "/products/mattress/mosaic/karmo-pattern-texture.webp";

  const openingFabric =
    product.fabrics?.find((f) => f.scene === cover)?.id || product.fabrics?.[0]?.id || "";
  const [mainSrc, setMainSrc] = useState(cover);
  const [fabric, setFabric] = useState(openingFabric);
  const [sizeId, setSizeId] = useState(defaultSize?.id || "queen");
  const [width, setWidth] = useState(String(defaultSize?.w || 60));
  const [length, setLength] = useState(String(defaultSize?.l || 80));
  const [height, setHeight] = useState(
    String(defaultSize?.h || product.defaultHeight || 8)
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const next = product.sizes?.find((s) => s.id === "queen") || product.sizes?.[0];
    const nextCover = product.cover || product.realGallery?.[0] || cover;
    setMainSrc(nextCover);
    setFabric(
      product.fabrics?.find((f) => f.scene === nextCover)?.id || product.fabrics?.[0]?.id || ""
    );
    setSizeId(next?.id || "queen");
    setWidth(String(next?.w || 60));
    setLength(String(next?.l || 80));
    setHeight(String(next?.h || product.defaultHeight || 8));
    setQty(1);
  }, [product.slug, product.cover, product.defaultHeight, cover]);

  const selectedFabric = product.fabrics?.find((f) => f.id === fabric);

  const pickSize = (s) => {
    setSizeId(s.id);
    if (s.id !== "custom") {
      setWidth(String(s.w));
      setLength(String(s.l));
      setHeight(String(s.h));
    }
  };

  // Open on the size passed from a listing card (/mattress/king?size=king),
  // overriding the Queen default. Runs after the slug reset above.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wanted = new URLSearchParams(window.location.search).get("size");
    if (!wanted) return;
    const match = product.sizes?.find((s) => s.id === wanted);
    if (match) pickSize(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  /* Fixed sales discount — not a user control. */
  const discountPct = OFFER_PCT;

  /* The same quote the order server checks the checkout against (catalogueQuote). */
  const quote = useMemo(
    () => quoteMattressUnit(product, { width, length, height }),
    [product, width, length, height]
  );

  const unitPrice = quote.total || 0;
  const mrpUnit = quote.base || unitPrice;
  const lineTotal = unitPrice * qty;
  const lineMrp = mrpUnit * qty;
  const sizeLabel = fixedPrice
    ? product.pack || "Standard"
    : `${width} × ${length} × ${height} inch`;
  const savePct = quote.ok ? discountPct : 0;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: EASE },
      };

  /* Opacity only — any transform on the sticky column breaks position:sticky. */
  const fadeIn = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease: EASE },
      };

  /* One cart line per product + option + size: adding the same thing again only
     raises its quantity (the quantity used to be part of this key, which split
     one product into several lines). */
  const cartId = `${product.slug}_${fabric || "std"}_${fixedPrice ? "std" : `${width}x${length}x${height}`}`;

  const cartItem = () => ({
    id: cartId,
    productId: product.slug,
    name: product.name,
    price: unitPrice,
    mrp: mrpUnit || unitPrice,
    image: selectedFabric?.image || (product.film && mainSrc === product.film.src ? cover : mainSrc) || cover,
    category: product.division,
    quantity: qty,
    size: [selectedFabric?.label, sizeLabel].filter(Boolean).join(" · "),
    /* The order server re-quotes the price from these (see catalogueQuote). */
    dims: fixedPrice ? undefined : { width: Number(width), length: Number(length), height: Number(height) },
  });

  const onAdd = () => {
    dispatch(addToCart(cartItem()));
    toast.success("Added to cart", {
      style: {
        borderRadius: "0",
        background: "var(--color-brand)",
        color: "#fff",
      },
    });
  };

  /* Order now: straight to checkout with just this product, in exactly the
     quantity shown (an earlier cart line for it is replaced, not added to). */
  const onOrder = () => {
    dispatch(removeFromCart(cartId));
    dispatch(addToCart(cartItem()));
    try {
      localStorage.setItem("karmogroup_selected_cart", JSON.stringify([cartId]));
    } catch {
      /* checkout then takes the whole cart */
    }
    router.push("/checkout");
  };

  return (
    <section className="relative overflow-x-clip border-b border-ink/8 bg-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src={textureSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.2]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/55" />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 pt-3 pb-8 sm:px-8 md:px-10 lg:px-12 lg:pt-4 lg:pb-12">
        <motion.nav
          {...fade}
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55"
        >
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={product.divisionHref} className="hover:text-brand">
            {product.division}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </motion.nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          {/* Sticky shell must be a plain div — Framer transform kills sticky. */}
          <div className="h-fit lg:sticky lg:top-[128px] lg:col-span-6 lg:z-[1]">
            <motion.div {...fadeIn}>
              <div className="flex items-start gap-3">
                {letterGallery.length ? (
                <ul className="hidden w-[68px] shrink-0 flex-col gap-2 xl:flex xl:w-[76px]">
                  {letterGallery.map((src, i) => (
                    <li key={`letter-${i}`}>
                      <ThumbButton
                        src={src}
                        active={mainSrc === src}
                        onClick={() => setMainSrc(src)}
                        label={`KARMO letter view ${i + 1}`}
                        className="aspect-square w-full"
                      />
                    </li>
                  ))}
                </ul>
                ) : null}

                <div className="min-w-0 flex-1">
                  {/* Picture and its thumbnails share one width, so the row starts at the picture's left edge. */}
                  {/* On a phone the rows under the picture run: fabrics, K-A-R-M-O, product photos
                      (order-*). From lg up the fabrics live in the buy box and the old order returns. */}
                  <div
                    className="mx-auto flex flex-col"
                    style={{
                      width: "min(100%, calc(100svh - 14rem))",
                      maxWidth: "100%",
                    }}
                  >
                  <div className="relative overflow-hidden bg-[#f3f1ec]">
                  <div className="relative w-full" style={{ paddingTop: "100%" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mainSrc}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="absolute inset-0"
                      >
                        {product.film && mainSrc === product.film.src ? (
                          <video
                            src={product.film.src}
                            poster={product.film.poster}
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-label={`${product.name} video`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : mainSrc ? (
                          <Image
                            src={mainSrc}
                            alt={product.name}
                            fill
                            unoptimized
                            priority
                            quality={90}
                            sizes="(min-width: 1024px) 48vw, 100vw"
                            className="object-contain object-center"
                          />
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  </div>

                  {product.fabrics?.length ? (
                    <ul
                      className="order-1 mt-3 grid gap-2 lg:hidden"
                      style={{ gridTemplateColumns: `repeat(${product.fabrics.length}, minmax(0, 1fr))` }}
                      aria-label={fabricTitle}
                    >
                      {product.fabrics.map((f) => {
                        const on = fabric === f.id;
                        return (
                          <li key={f.id}>
                            <button
                              type="button"
                              title={f.label}
                              aria-label={f.label}
                              aria-pressed={on}
                              onClick={() => {
                                setFabric(f.id);
                                if (f.scene) setMainSrc(f.scene);
                              }}
                              className={`relative block aspect-square w-full overflow-hidden border transition-colors ${
                                on ? "border-brand" : "border-ink/15 hover:border-ink/35"
                              }`}
                            >
                              <Image src={f.image} alt="" fill sizes="(min-width: 640px) 12vw, 16vw" className="object-cover" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {realGallery.length ? (
                    <ThumbStrip
                      items={realGallery}
                      film={product.film}
                      mainSrc={mainSrc}
                      onPick={setMainSrc}
                      labelFor={(i) => (i === 0 ? "Cover photo" : `Product photo ${i + 1}`)}
                      className="order-3 lg:order-2"
                    />
                  ) : null}

                  {letterGallery.length ? (
                    <ThumbStrip
                      items={letterGallery}
                      mainSrc={mainSrc}
                      onPick={setMainSrc}
                      labelFor={(i) => `KARMO letter view ${i + 1}`}
                      className="order-2 lg:order-3 xl:hidden"
                      fill
                      itemClassName="w-full"
                    />
                  ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 2 — Buy box */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.06 }}
            className="lg:col-span-6"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[13px] font-semibold uppercase tracking-[0.3em] text-brand">
                {product.brand || product.division}
              </span>
              {product.sku ? (
                <span className="text-[13px] font-medium tracking-[0.06em] text-ink/55">
                  SKU {product.sku}
                </span>
              ) : null}
            </div>

            <h1 className="display mt-2.5 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2rem]">
              {product.name}
            </h1>

            {product.description || product.line ? (
              <p className="body-copy mt-2.5 line-clamp-2 text-[15px] leading-[1.65] text-ink/65">
                {product.description || product.line}
              </p>
            ) : null}

            {buyboxIcons.length ? (
              <ul
                className="mt-4 grid grid-cols-4 gap-1 border border-ink/10 bg-white px-1.5 py-2 sm:gap-1.5 sm:px-2 sm:py-2"
                aria-label="Product highlights"
              >
                {buyboxIcons.map((item) => (
                  <li
                    key={item.label}
                    className="flex min-w-0 flex-col items-center text-center"
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
                      <Image
                        src={item.src}
                        alt=""
                        width={36}
                        height={36}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="mt-1 text-[10px] font-semibold leading-[1.2] text-brand sm:text-[11px]">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-1 hidden lg:block">
              {product.fabrics?.length ? (
                <OptionBlock title={fabricTitle}>
                  <ul className="flex flex-wrap gap-1.5">
                    {product.fabrics.map((f) => {
                      const on = fabric === f.id;
                      return (
                        <li key={f.id}>
                          <button
                            type="button"
                            title={f.label}
                            aria-label={f.label}
                            aria-pressed={on}
                            onClick={() => {
                              setFabric(f.id);
                              if (f.scene) setMainSrc(f.scene);
                            }}
                            className={`relative block h-12 w-12 overflow-hidden border transition-colors sm:h-14 sm:w-14 ${
                              on
                                ? "border-brand"
                                : "border-ink/15 hover:border-ink/35"
                            }`}
                          >
                            <Image
                              src={f.image}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </OptionBlock>
              ) : null}
            </div>

            {/* Sales calculator — client SFT / CFT formulas */}
            <div className="mt-4 border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-5">
              <div className="mb-3 flex items-center gap-1.5">
                <FiChevronDown className="shrink-0 text-[#555]" size={15} />
                <span className="text-[16px] font-semibold text-[#444]">
                  {fixedPrice ? "Price" : "Size (inch)"}
                </span>
              </div>

              {!fixedPrice && sizes.length ? (
                <div className="mb-3 grid grid-cols-5 gap-1.5">
                  {sizes.map((s) => {
                    const on = sizeId === s.id;
                    const icon = SIZE_ICONS[s.id];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickSize(s)}
                        title={s.note || s.label}
                        aria-label={s.note || s.label}
                        aria-pressed={on}
                        className={`flex flex-col items-center gap-1 border px-1 py-1.5 transition-colors ${
                          on
                            ? "border-brand bg-brand/[0.07]"
                            : "border-[#e5e7eb] hover:border-[#c7c9cc]"
                        }`}
                      >
                        {icon ? (
                          <span className="relative block h-10 w-10 sm:h-11 sm:w-11">
                            <Image
                              src={icon}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-contain"
                            />
                          </span>
                        ) : null}
                        <span
                          className={`text-[10px] font-bold leading-none ${
                            on ? "text-ink" : "text-[#555]"
                          }`}
                        >
                          {s.note || s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {fixedPrice ? null : (
              <div className="grid grid-cols-3 gap-2.5">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[14px] font-medium text-[#555]">
                    Length (inch)
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={length}
                    onChange={(e) => {
                      setLength(e.target.value);
                      setSizeId("custom");
                    }}
                    className="w-full border border-[#d1d5db] bg-white px-2.5 py-2.5 text-[16px] font-medium tabular-nums text-[#222] outline-none focus:border-brand"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[14px] font-medium text-[#555]">
                    Width (inch)
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => {
                      setWidth(e.target.value);
                      setSizeId("custom");
                    }}
                    className="w-full border border-[#d1d5db] bg-white px-2.5 py-2.5 text-[16px] font-medium tabular-nums text-[#222] outline-none focus:border-brand"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[14px] font-medium text-[#555]">
                    Height (inch)
                  </span>
                  {heightChoices ? (
                    <select
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        setSizeId("custom");
                      }}
                      className="w-full border border-[#d1d5db] bg-white px-2.5 py-2.5 text-[16px] font-medium tabular-nums text-[#222] outline-none focus:border-brand"
                    >
                      {heightChoices.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={pricingRule?.heightMin || 1}
                      max={pricingRule?.heightMax || undefined}
                      value={height}
                      readOnly={heightLocked}
                      onChange={(e) => {
                        if (heightLocked) return;
                        setHeight(e.target.value);
                        setSizeId("custom");
                      }}
                      className={`w-full border border-[#d1d5db] bg-white px-2.5 py-2.5 text-[16px] font-medium tabular-nums text-[#222] outline-none focus:border-brand ${
                        heightLocked ? "cursor-not-allowed bg-[#f3f4f6]" : ""
                      }`}
                    />
                  )}
                </label>
              </div>
              )}

              <div className={fixedPrice ? "" : "mt-4"}>
                {savePct > 0 && lineMrp > lineTotal ? (
                  <s className="block text-[16px] tabular-nums text-[#9ca3af]">
                    {formatTaka(lineMrp)}
                  </s>
                ) : null}
                <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={lineTotal}
                      initial={reduce ? false : { opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[1.65rem] font-bold leading-none tabular-nums tracking-tight text-brand sm:text-[1.85rem]"
                    >
                      {quote.ok ? formatTaka(lineTotal) : "৳ —"}
                    </motion.span>
                  </AnimatePresence>
                  {savePct > 0 ? (
                    <span className="text-[15px] font-bold text-[#16a34a]">
                      ({savePct}% OFF)
                    </span>
                  ) : null}
                </div>
                {quote.ok ? (
                  <p className="mt-1 text-[13px] text-[#555]">
                    {formatTaka(unitPrice)} {fixedPrice ? "per piece" : "each"} · {sizeLabel}
                    {pricingRule?.mode
                      ? ` · ${String(pricingRule.mode).toUpperCase()}`
                      : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-[13px] text-[#555]">
                    Enter length and width to see price
                  </p>
                )}
              </div>

              {pricingRule?.notes?.length ? (
                <ul className="mt-3 space-y-1 border-t border-[#eee] pt-3">
                  {pricingRule.notes.map((note) => (
                    <li key={note} className="text-[13px] leading-[1.45] text-[#333]">
                      {note}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 flex items-stretch gap-2.5">
                <div className="inline-flex shrink-0 overflow-hidden border border-[#e5e7eb]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-10 items-center justify-center bg-[#f3f4f6] text-[#555] transition-colors hover:bg-[#e5e7eb]"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="flex h-11 min-w-[2.75rem] items-center justify-center bg-white text-[17px] font-bold tabular-nums text-[#222]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="flex h-11 w-10 items-center justify-center bg-[#f3f4f6] text-[#555] transition-colors hover:bg-[#e5e7eb]"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onOrder}
                  disabled={!quote.ok}
                  className="inline-flex h-11 flex-1 items-center justify-center bg-brand text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Order now
                </button>
              </div>

              <button
                type="button"
                onClick={onAdd}
                disabled={!quote.ok}
                className="mt-2.5 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#d1d5db] bg-white text-[14px] font-semibold uppercase tracking-[0.08em] text-[#444] transition-colors hover:border-ink/30 hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart size={14} />
                Add to cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
