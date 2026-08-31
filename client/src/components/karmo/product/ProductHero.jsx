"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiChevronDown,
  FiMinus,
  FiPlus,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  KARMO_LETTER_GALLERY,
  formatTaka,
} from "@/components/karmo/product/productDetailData";
import {
  getPricingRule,
  quoteMattressListPrice,
  quoteMattressPrice,
} from "@/components/karmo/product/mattressPricing";
import {
  getFoamPricingRule,
  quoteFoamListPrice,
  quoteFoamPrice,
} from "@/components/karmo/product/foamPricing";

const DEFAULT_BUYBOX_ICONS = [
  {
    src: "/karmo/images/product/buybox-icons/warranty-10.png",
    label: "10-years warranty",
  },
  {
    src: "/karmo/images/product/buybox-icons/dual-side.png",
    label: "Dual side usage",
  },
  {
    src: "/karmo/images/product/buybox-icons/antimicrobial.png",
    label: "Anti Microbial Fabric",
  },
  {
    src: "/karmo/images/product/buybox-icons/nights-100.png",
    label: "100 night returns",
  },
];

const EASE = [0.22, 1, 0.36, 1];

/** Fixed sales discount — not a user control. */
const OFFER_DISCOUNT_PCT = 15;

const SIZE_ICONS = {
  single: "/karmo/images/product/size-icons/single.webp",
  double: "/karmo/images/product/size-icons/double.webp",
  queen: "/karmo/images/product/size-icons/queen.webp",
  king: "/karmo/images/product/size-icons/king.webp",
  custom: "/karmo/images/product/size-icons/custom.webp",
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
      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
    </button>
  );
}

export default function ProductHero({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const reduce = useReducedMotion();

  const letterGallery = product.letterGallery?.length
    ? product.letterGallery
    : KARMO_LETTER_GALLERY;
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
  const heightLocked = pricingRule?.heightFixed != null;
  const heightChoices = pricingRule?.heightOptions || null;
  const buyboxIcons = product.buyboxIcons?.length
    ? product.buyboxIcons
    : DEFAULT_BUYBOX_ICONS;
  const fabricTitle = product.fabricTitle || "Fabric";
  const textureSrc =
    product.textureSrc ||
    "/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg";

  const [mainSrc, setMainSrc] = useState(cover);
  const [fabric, setFabric] = useState(product.fabrics?.[0]?.id || "");
  const [sizeId, setSizeId] = useState(defaultSize?.id || "queen");
  const [width, setWidth] = useState(String(defaultSize?.w || 60));
  const [length, setLength] = useState(String(defaultSize?.l || 80));
  const [height, setHeight] = useState(
    String(defaultSize?.h || product.defaultHeight || 8)
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const next = product.sizes?.find((s) => s.id === "queen") || product.sizes?.[0];
    setMainSrc(product.cover || product.realGallery?.[0] || cover);
    setFabric(product.fabrics?.[0]?.id || "");
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

  const discountPct = OFFER_DISCOUNT_PCT;

  const quote = useMemo(() => {
    const listMrp = product.mrp || 0;
    const listOffer = product.price || 0;

    if (!pricingRule) {
      const base = listMrp || listOffer;
      if (!base) return { ok: false, base: 0, total: 0, discountPct };
      const catalogPct =
        listOffer && listMrp > listOffer
          ? Math.round(((listMrp - listOffer) / listMrp) * 100)
          : null;
      let total = base;
      if (catalogPct != null && discountPct === catalogPct && listOffer) {
        total = listOffer;
      } else if (discountPct) {
        total = Math.round(base * (1 - discountPct / 100));
      }
      return { ok: true, base, total, discountPct };
    }

    /* Anchor to catalogue was/now at Queen / sofa-set base. */
    if (listMrp) {
      const listArgs = {
        length,
        width,
        height,
        discountPct,
        listMrp,
        listOffer,
        refLength: defaultSize?.l,
        refWidth: defaultSize?.w,
        refHeight: defaultSize?.h || product.defaultHeight,
      };
      return isFoam
        ? quoteFoamListPrice(product.slug, listArgs)
        : quoteMattressListPrice(product.slug, listArgs);
    }

    return isFoam
      ? quoteFoamPrice(product.slug, { length, width, height, discountPct })
      : quoteMattressPrice(product.slug, { length, width, height, discountPct });
  }, [
    isFoam,
    pricingRule,
    product.slug,
    product.price,
    product.mrp,
    product.defaultHeight,
    defaultSize?.l,
    defaultSize?.w,
    defaultSize?.h,
    length,
    width,
    height,
    discountPct,
  ]);

  const unitPrice = quote.total || 0;
  const mrpUnit = quote.base || unitPrice;
  const lineTotal = unitPrice * qty;
  const lineMrp = mrpUnit * qty;
  const sizeLabel = `${width} × ${length} × ${height} inch`;
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

  const onAdd = () => {
    dispatch(
      addToCart({
        id: `${product.slug}_${fabric}_${sizeId}_${width}x${length}x${height}_${qty}`,
        productId: product.slug,
        name: product.name,
        price: unitPrice,
        mrp: mrpUnit || unitPrice,
        image: selectedFabric?.image || mainSrc || cover,
        category: product.division,
        quantity: qty,
        size: [selectedFabric?.label, sizeLabel].filter(Boolean).join(" · "),
      })
    );
    toast.success("Added to cart", {
      style: {
        borderRadius: "0",
        background: "var(--color-brand)",
        color: "#fff",
      },
    });
  };

  const onOrder = () => {
    onAdd();
    router.push("/cart");
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
          <div className="h-fit lg:sticky lg:top-[128px] lg:col-span-7 lg:z-[1]">
            <motion.div {...fadeIn}>
              <div className="flex items-start gap-3">
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

                <div className="min-w-0 flex-1">
                  <div className="relative h-[min(72svh,680px)] w-full overflow-hidden bg-[#f3f1ec]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mainSrc}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="absolute inset-0"
                      >
                        {mainSrc ? (
                          <Image
                            src={mainSrc}
                            alt={product.name}
                            fill
                            priority
                            quality={90}
                            sizes="(min-width: 1024px) 48vw, 100vw"
                            className="object-cover object-center"
                          />
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {realGallery.length ? (
                    <ul className="mt-3 flex gap-2 overflow-x-auto">
                      {realGallery.map((src, i) => (
                        <li key={`real-${src}`} className="w-[68px] shrink-0 xl:w-[76px]">
                          <ThumbButton
                            src={src}
                            active={mainSrc === src}
                            onClick={() => setMainSrc(src)}
                            label={i === 0 ? "Cover photo" : `Product photo ${i + 1}`}
                            className="aspect-square w-full"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <ul className="mt-3 flex gap-2 overflow-x-auto xl:hidden">
                    {letterGallery.map((src, i) => (
                      <li key={`m-letter-${i}`} className="w-[64px] shrink-0">
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
                </div>
              </div>
            </motion.div>
          </div>

          {/* 2 — Buy box */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.06 }}
            className="lg:col-span-5"
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

            <div className="mt-1">
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
                            onClick={() => setFabric(f.id)}
                            className={`relative block h-9 w-9 overflow-hidden border transition-colors ${
                              on
                                ? "border-brand"
                                : "border-ink/15 hover:border-ink/35"
                            }`}
                          >
                            <Image
                              src={f.image}
                              alt=""
                              fill
                              sizes="36px"
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
                  Size (inch)
                </span>
              </div>

              {sizes.length ? (
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

              <div className="mt-4">
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
                    {formatTaka(unitPrice)} each · {sizeLabel}
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
                    onClick={() => setQty((q) => q + 1)}
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
