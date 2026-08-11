"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";

function FieldLabel({ children, value }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
        {children}
      </p>
      {value ? (
        <span className="text-[12px] font-semibold text-ink">{value}</span>
      ) : null}
    </div>
  );
}

export default function ProductHero({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [active, setActive] = useState(0);
  const [density, setDensity] = useState(product.densities?.[0]?.id || "");
  const [color, setColor] = useState(product.colors?.[0]?.id || "");
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id || "custom");
  const [width, setWidth] = useState("72");
  const [length, setLength] = useState("36");
  const [height, setHeight] = useState("4");
  const [qty, setQty] = useState(1);

  const gallery = product.gallery || [];
  const mainSrc = gallery[active] || gallery[0];

  const selectedColor = product.colors?.find((c) => c.id === color);
  const selectedDensity = product.densities?.find((d) => d.id === density);
  const selectedSize = product.sizes?.find((s) => s.id === sizeId);
  const isCustom = sizeId === "custom";

  const sizeLabel = isCustom
    ? [width, length, height].every((v) => String(v).trim())
      ? `${width} × ${length} × ${height} cm`
      : "Custom"
    : `${selectedSize?.label || ""} cm`;

  const onAdd = () => {
    dispatch(
      addToCart({
        id: `${product.slug}_${color}_${sizeId}_${density}_${qty}`,
        productId: product.slug,
        name: product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        image: mainSrc,
        category: product.division,
        quantity: qty,
        color: selectedColor?.label,
        colorHex: selectedColor?.hex,
        size: `${selectedDensity?.label || ""} · ${sizeLabel}`.replace(/^ · /, ""),
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
    <section className="border-b border-ink/8 bg-white">
      <div className="shell py-8 lg:py-12">
        <nav className="mb-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={product.divisionHref} className="hover:text-brand">
            {product.division}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Gallery ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="flex gap-3">
              <ul className="hidden w-[76px] shrink-0 flex-col gap-2 sm:flex">
                {gallery.map((src, i) => (
                  <li key={src}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`relative block aspect-square w-full overflow-hidden border transition-colors ${
                        active === i
                          ? "border-brand"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="76px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="relative aspect-square min-h-[280px] flex-1 overflow-hidden bg-cream/50 sm:min-h-[380px] lg:min-h-[520px]">
                {mainSrc ? (
                  <Image
                    src={mainSrc}
                    alt={product.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-contain p-5"
                  />
                ) : null}
              </div>
            </div>

            <ul className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
              {gallery.map((src, i) => (
                <li key={`m-${src}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`relative block h-[68px] w-[68px] overflow-hidden border ${
                      active === i ? "border-brand" : "border-ink/10"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="68px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Buy box ────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                {product.division}
              </span>
              {product.sku ? (
                <span className="text-[11px] font-medium tracking-[0.06em] text-ink/35">
                  SKU {product.sku}
                </span>
              ) : null}
            </div>

            <h1 className="display mt-3 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2rem]">
              {product.name}
            </h1>

            {product.description ? (
              <p className="body-copy mt-3 line-clamp-2 text-[13px] leading-[1.65] text-ink/55">
                {product.description}
              </p>
            ) : product.line ? (
              <p className="mt-3 line-clamp-2 text-[13px] leading-[1.65] text-ink/55">
                {product.line}
              </p>
            ) : null}

            <div className="mt-6 border-y border-ink/10 py-5">
              <div className="flex flex-wrap items-end gap-3">
                {product.wasLabel ? (
                  <s className="text-[15px] tabular-nums text-ink/35">
                    {product.wasLabel}
                  </s>
                ) : null}
                <span className="display text-[2rem] font-bold leading-none tabular-nums tracking-tight text-brand">
                  {product.priceLabel}
                </span>
              </div>
              {product.unitNote ? (
                <p className="mt-2 text-[12px] text-ink/40">{product.unitNote}</p>
              ) : null}
            </div>

            {/* Colour swatches — small squares */}
            {product.colors?.length ? (
              <div className="mt-5">
                <FieldLabel value={selectedColor?.label}>Colour</FieldLabel>
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
              </div>
            ) : null}

            {/* Density — compact, active brand red */}
            {product.densities?.length ? (
              <div className="mt-5">
                <FieldLabel value={selectedDensity?.label}>Density</FieldLabel>
                <div className="grid grid-cols-3 gap-1.5">
                  {product.densities.map((d) => {
                    const on = density === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDensity(d.id)}
                        className={`border px-1.5 py-2 text-center transition-colors ${
                          on
                            ? "border-brand bg-brand text-white"
                            : "border-ink/15 bg-white text-ink hover:border-ink/35"
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-[0.08em]">
                          {d.label}
                        </span>
                        <span
                          className={`mt-0.5 block text-[9px] leading-tight ${
                            on ? "text-white/75" : "text-ink/40"
                          }`}
                        >
                          {d.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Size — four compact chips on one row */}
            {product.sizes?.length ? (
              <div className="mt-5">
                <FieldLabel value={sizeLabel}>Size</FieldLabel>
                <div className="grid grid-cols-4 gap-1.5">
                  {product.sizes.map((s) => {
                    const on = sizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`border px-1 py-2 text-center transition-colors ${
                          on
                            ? "border-brand bg-brand/[0.06] text-ink"
                            : "border-ink/15 text-ink hover:border-ink/35"
                        }`}
                      >
                        <span className="block text-[10px] font-bold leading-tight tracking-tight">
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isCustom ? (
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {[
                      ["W", "Width", width, setWidth],
                      ["L", "Length", length, setLength],
                      ["H", "Height", height, setHeight],
                    ].map(([short, label, value, set]) => (
                      <label key={label} className="block">
                        <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/40">
                          {short}
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={value}
                          onChange={(e) => set(e.target.value)}
                          className="w-full border border-ink/15 bg-white px-2 py-2 text-[12px] text-ink outline-none focus:border-brand"
                        />
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Quantity */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
                Quantity
              </p>
              <div className="inline-flex items-center border border-ink/15">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink/55 hover:text-ink"
                >
                  <FiMinus size={14} />
                </button>
                <span className="min-w-[2.75rem] text-center text-[15px] font-bold tabular-nums text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-ink/55 hover:text-ink"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex h-[50px] items-center justify-center gap-2 border border-ink bg-white text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-cream"
              >
                <FiShoppingCart size={15} />
                Add to cart
              </button>
              <button
                type="button"
                onClick={onOrder}
                className="inline-flex h-[50px] items-center justify-center bg-brand text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
              >
                Order now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
