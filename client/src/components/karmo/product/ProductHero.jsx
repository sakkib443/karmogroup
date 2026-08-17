"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiChevronDown, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";

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

export default function ProductHero({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [active, setActive] = useState(0);
  const [fabric, setFabric] = useState(product.fabrics?.[0]?.id || "");
  const [color, setColor] = useState(product.colors?.[0]?.id || "");
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id || "custom");
  const [width, setWidth] = useState("72");
  const [length, setLength] = useState("36");
  const [height, setHeight] = useState("4");
  const [qty, setQty] = useState(1);

  const gallery = product.gallery || [];
  const mainSrc = gallery[active] || gallery[0];

  const selectedFabric = product.fabrics?.find((f) => f.id === fabric);
  const selectedColor = product.colors?.find((c) => c.id === color);
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
        id: `${product.slug}_${fabric}_${color}_${sizeId}_${qty}`,
        productId: product.slug,
        name: product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        image: selectedFabric?.image || mainSrc,
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
    <section className="border-b border-ink/8 bg-white">
      <div className="shell pt-3 pb-8 lg:pt-4 lg:pb-12">
        <nav className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
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

            <h1 className="display mt-2.5 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2rem]">
              {product.name}
            </h1>

            {product.description ? (
              <p className="body-copy mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-ink/55">
                {product.description}
              </p>
            ) : product.line ? (
              <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.65] text-ink/55">
                {product.line}
              </p>
            ) : null}

            <div className="mt-4 border-y border-ink/10 py-2.5">
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
                <p className="mt-1 text-[12px] text-ink/40">{product.unitNote}</p>
              ) : null}
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

              {product.sizes?.length ? (
                <OptionBlock title="Size (cm)">
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
                            onChange={(e) => set(e.target.value)}
                            className="w-full border border-ink/15 bg-white px-2 py-2 text-[12px] text-ink outline-none focus:border-brand"
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}
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
          </div>
        </div>
      </div>
    </section>
  );
}
