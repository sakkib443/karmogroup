"use client";

/**
 * Karmo Foam — product hero. Built on the Matrexx buy box's frame and measures
 * (same 1760px stage, square gallery, sticky left column, bordered calculator box,
 * square corners, one quiet texture behind every product), with the foam's
 * specs and a cut-to-size calculator. Pricing is the catalogue's sales calculator.
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { formatTaka } from "@/components/karmo/product/productDetailData";
import { getFoamPricingRule } from "@/components/karmo/product/foamPricing";
import { quoteFoamUnit } from "@/components/karmo/product/catalogueQuote";

const EASE = [0.22, 1, 0.36, 1];
const MAX_QTY = 99;

function ThumbButton({ src, active, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`relative block overflow-hidden border transition-colors ${active ? "border-brand" : "border-ink/10 hover:border-ink/30"} ${className}`}
    >
      <Image src={src} alt="" fill unoptimized sizes="120px" className="object-contain bg-[#f3f1ec]" />
    </button>
  );
}

export default function FoamHero({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const reduce = useReducedMotion();

  const rule = getFoamPricingRule(product.slug);
  const fixedPrice = !rule;
  const letterGallery = product.letterGallery || [];
  const realGallery = product.realGallery?.length ? product.realGallery : product.gallery || [];
  const cover = product.cover || realGallery[0] || letterGallery[0];
  const ref = (product.sizes || []).find((s) => s.id === "queen") || (product.sizes || [])[0];
  const textureSrc = product.textureSrc || "/products/foam/foam-texture-bg.webp";
  const buyboxIcons = product.buyboxIcons || [];

  const [mainSrc, setMainSrc] = useState(cover);
  const [length, setLength] = useState(String(ref?.l || 72));
  const [width, setWidth] = useState(String(ref?.w || 48));
  const [height, setHeight] = useState(String(ref?.h || product.defaultHeight || 4));
  const [qty, setQty] = useState(1);

  // Cheap to work out on every render. The same quote the order server checks against.
  const quote = quoteFoamUnit(product, { length, width, height });

  const unitPrice = quote.total || 0;
  const mrpUnit = quote.base || unitPrice;
  const lineTotal = unitPrice * qty;
  const lineMrp = mrpUnit * qty;
  const savePct = quote.ok && mrpUnit > unitPrice ? Math.round(((mrpUnit - unitPrice) / mrpUnit) * 100) : 0;
  const sizeLabel = fixedPrice ? product.pack || "Standard" : `${length} × ${width} × ${height} inch`;
  const cft = !fixedPrice && quote.ok ? ((Number(length) * Number(width) * Number(height)) / 1728).toFixed(2) : null;
  const cartId = `${product.slug}_${fixedPrice ? "std" : `${width}x${length}x${height}`}`;

  const cartItem = () => ({
    id: cartId,
    productId: product.slug,
    name: product.name,
    price: unitPrice,
    mrp: mrpUnit || unitPrice,
    image: cover || mainSrc,
    category: product.division,
    quantity: qty,
    size: sizeLabel,
    /* The order server re-quotes the price from these (see catalogueQuote). */
    dims: fixedPrice ? undefined : { width: Number(width), length: Number(length), height: Number(height) },
  });

  const onAdd = () => {
    dispatch(addToCart(cartItem()));
    toast.success("Added to cart", { style: { borderRadius: "0", background: "var(--color-brand)", color: "#fff" } });
  };

  /* Order now: straight to checkout with just this product, in exactly this quantity. */
  const onOrder = () => {
    dispatch(removeFromCart(cartId));
    dispatch(addToCart(cartItem()));
    try { localStorage.setItem("karmogroup_selected_cart", JSON.stringify([cartId])); } catch { /* whole cart then */ }
    router.push("/checkout");
  };

  const fade = reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE } };
  const fadeIn = reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, ease: EASE } };

  const input = "w-full border border-[#d1d5db] bg-white px-2.5 py-2.5 text-[16px] font-medium tabular-nums text-[#222] outline-none focus:border-brand";

  return (
    <section className="relative overflow-x-clip border-b border-ink/8 bg-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image src={textureSrc} alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.2]" priority={false} />
        <span className="absolute inset-0 bg-white/55" />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 pt-3 pb-8 sm:px-8 md:px-10 lg:px-12 lg:pt-4 lg:pb-12">
        <motion.nav {...fade} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/foam" className="hover:text-brand">Foam</Link>
          <span className="mx-2">/</span>
          <Link href="/foam/furniture" className="hover:text-brand">Furniture</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </motion.nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          {/* 1 — Gallery (same frame as the mattress page) */}
          <div className="h-fit lg:sticky lg:top-[128px] lg:col-span-6 lg:z-[1]">
            <motion.div {...fadeIn}>
              <div className="flex items-start gap-3">
                {letterGallery.length ? (
                  <ul className="hidden w-[68px] shrink-0 flex-col gap-2 xl:flex xl:w-[76px]">
                    {letterGallery.map((src, i) => (
                      <li key={`letter-${i}`}>
                        <ThumbButton src={src} active={mainSrc === src} onClick={() => setMainSrc(src)} label={`KARMO letter view ${i + 1}`} className="aspect-square w-full" />
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="relative mx-auto overflow-hidden bg-[#f3f1ec]" style={{ width: "min(100%, calc(100svh - 14rem))", maxWidth: "100%" }}>
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
                          {mainSrc ? (
                            <Image src={mainSrc} alt={product.imageAlt || product.name} fill unoptimized priority quality={90} sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain object-center" />
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                      {savePct > 0 ? (
                        <span className="absolute left-0 top-0 bg-brand px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
                          {savePct}% off
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {realGallery.length ? (
                    <ul className="mt-3 flex justify-center gap-2 overflow-x-auto">
                      {realGallery.map((src, i) => (
                        <li key={`real-${src}`} className="w-[68px] shrink-0 xl:w-[76px]">
                          <ThumbButton src={src} active={mainSrc === src} onClick={() => setMainSrc(src)} label={i === 0 ? "Cover photo" : `Product photo ${i + 1}`} className="aspect-square w-full" />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 2 — Buy box */}
          <motion.div {...fade} className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[13px] font-semibold uppercase tracking-[0.3em] text-brand">{product.brand || "Karmo Foam"}</span>
              {product.sku ? <span className="text-[13px] font-medium tracking-[0.06em] text-ink/55">SKU {product.sku}</span> : null}
            </div>

            <h1 className="display mt-2.5 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2rem]">
              {product.name}
            </h1>

            {product.rating ? (
              <div className="mt-2 flex items-center gap-2 text-[13px] text-ink/55">
                <span className="flex items-center gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24">
                      <path d="M12 2.6 14.9 9l6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.8l1.6-6.7L2.2 9.6 9.1 9 12 2.6Z" fill={i < Math.round(product.rating) ? "#FF9A1F" : "#D6D3CE"} />
                    </svg>
                  ))}
                </span>
                <span className="font-semibold text-ink/80">{product.rating.toFixed(1)}</span>
                {product.reviews ? <span>({product.reviews} reviews)</span> : null}
              </div>
            ) : null}

            {product.description || product.line ? (
              <p className="body-copy mt-2.5 line-clamp-2 text-[15px] leading-[1.65] text-ink/65">{product.description || product.line}</p>
            ) : null}

            {buyboxIcons.length ? (
              <ul className="mt-4 grid grid-cols-4 gap-1 border border-ink/10 bg-white px-1.5 py-2 sm:gap-1.5 sm:px-2 sm:py-2" aria-label="Product highlights">
                {buyboxIcons.map((item) => (
                  <li key={item.label} className="flex min-w-0 flex-col items-center text-center">
                    <span className="relative flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
                      <Image src={item.src} alt="" width={36} height={36} className="h-full w-full object-contain" />
                    </span>
                    <span className="mt-1 text-[10px] font-semibold leading-[1.2] text-brand sm:text-[11px]">{item.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-1">
              {/* Specs */}
              {product.specs?.length ? (
                <div className="grid border-b border-ink/10 py-3" style={{ gridTemplateColumns: `repeat(${Math.min(3, product.specs.length)}, minmax(0, 1fr))` }}>
                  {product.specs.slice(0, 3).map((s, i) => (
                    <div key={s} className={`px-3 text-center ${i > 0 ? "border-l border-ink/10" : ""}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">{product.specLabels?.[i] || "Spec"}</p>
                      <p className="mt-1 text-[14px] font-semibold text-ink/85">{s}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Calculator — same box as the mattress page */}
            <div className="mt-4 border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <FiChevronDown className="shrink-0 text-[#555]" size={15} />
                  <span className="text-[16px] font-semibold text-[#444]">{fixedPrice ? "Price" : "Cut to size (inch)"}</span>
                </span>
                {cft ? <span className="text-[13px] font-medium tabular-nums text-[#555]">≈ {cft} CFT</span> : null}
              </div>

              {!fixedPrice ? (
                <>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      ["Length (inch)", length, setLength],
                      ["Width (inch)", width, setWidth],
                      ["Height (inch)", height, setHeight],
                    ].map(([label, value, setter]) => (
                      <label key={label} className="block min-w-0">
                        <span className="mb-1.5 block text-[14px] font-medium text-[#555]">{label}</span>
                        <input
                          type="number"
                          min="1"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className={input}
                        />
                      </label>
                    ))}
                  </div>
                </>
              ) : null}

              <div className={fixedPrice ? "" : "mt-4"}>
                {savePct > 0 && lineMrp > lineTotal ? <s className="block text-[16px] tabular-nums text-[#9ca3af]">{formatTaka(lineMrp)}</s> : null}
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
                  {savePct > 0 ? <span className="text-[15px] font-bold text-[#16a34a]">({savePct}% OFF)</span> : null}
                </div>
                <p className="mt-1 text-[13px] text-[#555]">
                  {quote.ok ? <>{formatTaka(unitPrice)} {fixedPrice ? "per piece" : "each"} · {sizeLabel}</> : "Enter length, width and height to see the price"}
                </p>
              </div>

              {rule?.notes?.length ? (
                <ul className="mt-3 space-y-1 border-t border-[#eee] pt-3">
                  {rule.notes.map((note) => <li key={note} className="text-[13px] leading-[1.45] text-[#333]">{note}</li>)}
                </ul>
              ) : null}

              <div className="mt-4 flex items-stretch gap-2.5">
                <div className="inline-flex shrink-0 overflow-hidden border border-[#e5e7eb]">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-10 items-center justify-center bg-[#f3f4f6] text-[#555] transition-colors hover:bg-[#e5e7eb]">
                    <FiMinus size={14} />
                  </button>
                  <span className="flex h-11 min-w-[2.75rem] items-center justify-center bg-white text-[17px] font-bold tabular-nums text-[#222]">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="flex h-11 w-10 items-center justify-center bg-[#f3f4f6] text-[#555] transition-colors hover:bg-[#e5e7eb]">
                    <FiPlus size={14} />
                  </button>
                </div>
                <button type="button" onClick={onOrder} disabled={!quote.ok}
                  className="inline-flex h-11 flex-1 items-center justify-center bg-brand text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50">
                  Order now
                </button>
              </div>

              <button type="button" onClick={onAdd} disabled={!quote.ok}
                className="mt-2.5 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#d1d5db] bg-white text-[14px] font-semibold uppercase tracking-[0.08em] text-[#444] transition-colors hover:border-ink/30 hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50">
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
