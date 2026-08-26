"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiCheck,
  FiChevronDown,
  FiDelete,
  FiMinus,
  FiPlus,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  KARMO_LETTER_GALLERY,
  estimateMattressPrice,
  formatTaka,
} from "@/components/karmo/product/productDetailData";

const EASE = [0.22, 1, 0.36, 1];
const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "⌫"];

function OptionBlock({ title, children }) {
  return (
    <div className="border-b border-ink/10 py-2.5">
      <div className="mb-2.5 flex items-center gap-2">
        <FiChevronDown className="shrink-0 text-ink/70" size={14} />
        <span className="text-[13px] font-semibold text-ink">{title}</span>
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

/** Compact tap calculator — empty by default; user enters W/L/H then Calculate. */
function MiniCalculator({ basePrice, baseMrp, onCalculate, productKey }) {
  const reduce = useReducedMotion();
  const [field, setField] = useState("w");
  const [draft, setDraft] = useState({ w: "", l: "", h: "" });
  const [quoted, setQuoted] = useState(null);
  const [quotedMrp, setQuotedMrp] = useState(null);

  useEffect(() => {
    setDraft({ w: "", l: "", h: "" });
    setQuoted(null);
    setQuotedMrp(null);
    setField("w");
  }, [productKey, basePrice]);

  const label = { w: "Width", l: "Length", h: "Height" }[field];
  const placeholders = { w: "Width", l: "Length", h: "Height" };

  const onKey = (key) => {
    const cur = String(draft[field] ?? "");
    if (key === "C") {
      setDraft((d) => ({ ...d, [field]: "" }));
      return;
    }
    if (key === "⌫") {
      setDraft((d) => ({ ...d, [field]: cur.slice(0, -1) }));
      return;
    }
    if (cur.length >= 3) return;
    const next = cur === "0" ? key : `${cur}${key}`;
    setDraft((d) => ({ ...d, [field]: next }));
  };

  const runCalculate = () => {
    const w = draft.w.trim();
    const l = draft.l.trim();
    const h = draft.h.trim();
    if (!w || !l || !h) {
      toast.error("Width, length ও height লিখুন");
      return;
    }
    if (!Number(w) || !Number(l) || !Number(h)) {
      toast.error("সঠিক সংখ্যা লিখুন");
      return;
    }
    const price = estimateMattressPrice(basePrice, w, l, h);
    const mrp =
      baseMrp && basePrice
        ? Math.round(price * (baseMrp / basePrice))
        : price;
    setQuoted(price);
    setQuotedMrp(mrp);
    onCalculate?.({
      width: w,
      length: l,
      height: h,
      unitPrice: price,
      mrpUnit: mrp,
    });
  };

  return (
    <div className="overflow-hidden border border-ink/12 bg-[#1a1a1a] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          Calculator
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={quoted ?? "empty"}
            initial={reduce ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold tabular-nums text-brand"
          >
            {quoted != null ? formatTaka(quoted) : "৳ —"}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-1 px-2.5 pt-2.5">
        {[
          { id: "w", label: "W", value: draft.w },
          { id: "l", label: "L", value: draft.l },
          { id: "h", label: "H", value: draft.h },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setField(f.id)}
            className={`border px-1.5 py-1.5 text-left ${
              field === f.id
                ? "border-brand bg-brand/20"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-white/40">
              {f.label}
            </span>
            <span
              className={`text-[11px] font-bold tabular-nums ${
                f.value ? "text-white" : "font-semibold text-white/30"
              }`}
            >
              {f.value || placeholders[f.id]}
            </span>
          </button>
        ))}
      </div>

      <p className="px-3 pt-2 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
        Enter {label}
      </p>
      <p
        className={`display px-3 pb-2 text-right text-[1.35rem] font-light tabular-nums leading-none ${
          draft[field] ? "text-white" : "text-white/28"
        }`}
      >
        {draft[field] || placeholders[field]}
      </p>

      <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onKey(key)}
            className={`flex h-9 items-center justify-center text-[13px] font-semibold tabular-nums transition-colors ${
              key === "C" || key === "⌫"
                ? "bg-[#2a2a2a] text-brand hover:bg-[#333]"
                : "bg-[#222] text-white hover:bg-[#2c2c2c]"
            }`}
          >
            {key === "⌫" ? <FiDelete size={14} /> : key}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={runCalculate}
        className="flex w-full items-center justify-center gap-2 bg-brand py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
      >
        Calculate
      </button>

      {quoted != null && quotedMrp != null && quotedMrp > quoted ? (
        <p className="border-t border-white/10 px-3 py-1.5 text-center text-[10px] text-white/35">
          Was <s>{formatTaka(quotedMrp)}</s>
        </p>
      ) : null}
    </div>
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

  const [mainSrc, setMainSrc] = useState(cover);
  const [fabric, setFabric] = useState(product.fabrics?.[0]?.id || "");
  const [color, setColor] = useState(product.colors?.[0]?.id || "");
  const [sizeId, setSizeId] = useState(defaultSize?.id || "queen");
  const [width, setWidth] = useState(String(defaultSize?.w || 150));
  const [length, setLength] = useState(String(defaultSize?.l || 200));
  const [height, setHeight] = useState(String(defaultSize?.h || 22));
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const next = product.sizes?.find((s) => s.id === "queen") || product.sizes?.[0];
    setMainSrc(product.cover || product.realGallery?.[0] || cover);
    setFabric(product.fabrics?.[0]?.id || "");
    setColor(product.colors?.[0]?.id || "");
    setSizeId(next?.id || "queen");
    setWidth(String(next?.w || 150));
    setLength(String(next?.l || 200));
    setHeight(String(next?.h || 22));
    setQty(1);
  }, [product.slug, product.cover, cover]);

  const selectedFabric = product.fabrics?.find((f) => f.id === fabric);
  const selectedColor = product.colors?.find((c) => c.id === color);
  const selectedSize = sizes.find((s) => s.id === sizeId);
  const isCustom = sizeId === "custom";

  const pickSize = (s) => {
    setSizeId(s.id);
    if (s.id !== "custom") {
      setWidth(String(s.w));
      setLength(String(s.l));
      setHeight(String(s.h));
    }
  };

  const onCalcSubmit = ({ width: w, length: l, height: h }) => {
    setWidth(String(w));
    setLength(String(l));
    setHeight(String(h));
    setSizeId("custom");
  };

  const unitPrice = useMemo(
    () => estimateMattressPrice(product.price, width, length, height),
    [product.price, width, length, height]
  );
  const mrpUnit = useMemo(() => {
    if (!product.mrp || !product.price) return unitPrice;
    return Math.round(unitPrice * (product.mrp / product.price));
  }, [product.mrp, product.price, unitPrice]);

  const lineTotal = unitPrice * qty;
  const sizeLabel = `${width} × ${length} × ${height} cm`;
  const savePct =
    mrpUnit > unitPrice
      ? Math.round(((mrpUnit - unitPrice) / mrpUnit) * 100)
      : 0;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: EASE },
      };

  const onAdd = () => {
    dispatch(
      addToCart({
        id: `${product.slug}_${fabric}_${color}_${sizeId}_${width}x${length}x${height}_${qty}`,
        productId: product.slug,
        name: product.name,
        price: unitPrice,
        mrp: mrpUnit || unitPrice,
        image: selectedFabric?.image || mainSrc || cover,
        category: product.division,
        quantity: qty,
        color: selectedColor?.label,
        colorHex: selectedColor?.hex,
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
    <section className="relative overflow-hidden border-b border-ink/8 bg-white">
      {/* Mattress damask — full hero band, same asset as Divisions / Order */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic-karmo-pattern.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.28]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/55" />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 pt-3 pb-8 sm:px-8 md:px-10 lg:px-12 lg:pt-4 lg:pb-12">
        <motion.nav
          {...fade}
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40"
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

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* 1 — Gallery (widest of the three) */}
          <motion.div {...fade} className="lg:col-span-6">
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

          {/* 2 — Buy box */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.06 }}
            className="lg:col-span-4"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                {product.brand || product.division}
              </span>
              {product.sku ? (
                <span className="text-[11px] font-medium tracking-[0.06em] text-ink/35">
                  SKU {product.sku}
                </span>
              ) : null}
            </div>

            <h1 className="display mt-2.5 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2rem]">
              {product.name}
            </h1>

            {product.description || product.line ? (
              <p className="body-copy mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-ink/55">
                {product.description || product.line}
              </p>
            ) : null}

            <div className="mt-4 border-y border-ink/10 py-2.5">
              <div className="flex flex-wrap items-end gap-3">
                {mrpUnit > unitPrice ? (
                  <s className="text-[15px] tabular-nums text-ink/35">
                    {formatTaka(mrpUnit * qty)}
                  </s>
                ) : null}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lineTotal}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="display text-[2rem] font-bold leading-none tabular-nums tracking-tight text-brand"
                  >
                    {formatTaka(lineTotal)}
                  </motion.span>
                </AnimatePresence>
                {savePct > 0 ? (
                  <span className="bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand">
                    Save {savePct}%
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[12px] text-ink/40">
                {formatTaka(unitPrice)} each · {sizeLabel}
              </p>
            </div>

            <div className="mt-1">
              {product.fabrics?.length ? (
                <OptionBlock title="Fabric">
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

              {product.colors?.length ? (
                <OptionBlock title="Colour">
                  <ul className="flex flex-wrap gap-2">
                    {product.colors.map((c) => {
                      const on = color === c.id;
                      return (
                        <li key={c.id}>
                          <button
                            type="button"
                            title={c.label}
                            aria-label={c.label}
                            aria-pressed={on}
                            onClick={() => setColor(c.id)}
                            className={`relative flex h-7 w-7 items-center justify-center border transition-all ${
                              on
                                ? "border-brand ring-1 ring-brand/30"
                                : "border-ink/20 hover:border-ink/40"
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {on ? (
                              <FiCheck
                                className={
                                  c.hex === "#3D3D3D" || c.hex === "#1E3A5F"
                                    ? "text-white"
                                    : "text-ink"
                                }
                                size={12}
                                strokeWidth={2.5}
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </OptionBlock>
              ) : null}

              {sizes.length ? (
                <OptionBlock title="Size (cm)">
                  <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                    {sizes.map((s) => {
                      const on = sizeId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => pickSize(s)}
                          className={`border px-1 py-2 text-center transition-colors ${
                            on
                              ? "border-brand bg-brand/[0.06] text-ink"
                              : "border-ink/15 text-ink hover:border-ink/35"
                          }`}
                        >
                          <span className="block text-[10px] font-bold leading-tight tracking-tight">
                            {s.note || s.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {isCustom ? (
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {[
                        ["Width", width, setWidth],
                        ["Length", length, setLength],
                        ["Height", height, setHeight],
                      ].map(([label, value, set]) => (
                        <label key={label} className="block">
                          <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/40">
                            {label}
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={value}
                            onChange={(e) => {
                              set(e.target.value);
                              setSizeId("custom");
                            }}
                            className="w-full border border-ink/15 bg-white px-2 py-2 text-[12px] text-ink outline-none focus:border-brand"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-ink/40">
                      {selectedSize?.label} cm
                      {selectedSize?.note ? ` · ${selectedSize.note}` : ""}
                    </p>
                  )}
                </OptionBlock>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
                Quantity
              </p>
              <div className="inline-flex items-center border border-ink/15">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-ink/55 hover:text-ink"
                >
                  <FiMinus size={14} />
                </button>
                <span className="min-w-[2.5rem] text-center text-[15px] font-bold tabular-nums text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-ink/55 hover:text-ink"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex h-[48px] items-center justify-center gap-2 border border-ink bg-white text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-cream"
              >
                <FiShoppingCart size={15} />
                Add to cart
              </button>
              <button
                type="button"
                onClick={onOrder}
                className="inline-flex h-[48px] items-center justify-center bg-brand text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
              >
                Order now
              </button>
            </div>
          </motion.div>

          {/* 3 — Calculator (narrow far-right rail) */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.1 }}
            className="lg:col-span-2 lg:sticky lg:top-[7.5rem]"
          >
            <MiniCalculator
              productKey={product.slug}
              basePrice={product.price}
              baseMrp={product.mrp}
              onCalculate={onCalcSubmit}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
