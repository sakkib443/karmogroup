"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { formatTaka } from "@/components/karmo/product/productDetailData";
import { quoteFoamSetUnit } from "@/components/karmo/product/catalogueQuote";

const MAX_QTY = 99;

/**
 * One static foam page. The poster carries the picture.
 * The type is the site's heading and body faces. The price is the combo price.
 */
export default function FoamStaticDetail({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  /* The same quote the order server checks against. */
  const { total: unit, base: mrp } = quoteFoamSetUnit(product);
  const save = mrp > unit ? Math.round(((mrp - unit) / mrp) * 100) : 0;
  const cartId = `${product.slug}_set`;

  const item = () => ({
    id: cartId,
    productId: product.slug,
    name: product.name,
    price: unit,
    mrp,
    image: product.cover,
    category: product.division,
    quantity: qty,
    size: "1 set",
  });

  const onAdd = () => {
    dispatch(addToCart(item()));
    toast.success("Added to cart", { style: { borderRadius: "0", background: "var(--color-brand)", color: "#fff" } });
  };

  const onOrder = () => {
    dispatch(removeFromCart(cartId));
    dispatch(addToCart(item()));
    try { localStorage.setItem("karmogroup_selected_cart", JSON.stringify([cartId])); } catch { /* whole cart then */ }
    router.push("/checkout");
  };

  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="mx-auto grid min-h-[calc(100svh-112px)] w-full max-w-[1760px] lg:grid-cols-2">
        <div className="relative min-h-[68svh] bg-[#141414] lg:min-h-0">
          {product.cover ? (
            <Image
              src={product.cover}
              alt={product.imageAlt || product.name}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain object-center"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <nav className="body-copy text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/foam/furniture" className="hover:text-brand">Furniture</Link>
            <span className="mx-2">/</span>
            <span className="text-ink/70">Poly</span>
          </nav>

          <p className="body-copy mt-8 text-[12px] font-bold uppercase tracking-[0.28em] text-brand">Karmo Foam</p>
          <h1 className="display mt-3 text-[3.4rem] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-ink sm:text-[4.6rem]">
            Poly
          </h1>
          <p className="display mt-3 text-[1.35rem] font-medium uppercase tracking-[0.08em] text-ink/70">
            Standard grade
          </p>

          <ul className="mt-8 grid grid-cols-3 border-y border-ink/10">
            {(product.specs || []).slice(0, 3).map((spec, i) => (
              <li key={spec} className={`px-2 py-4 text-center ${i > 0 ? "border-l border-ink/10" : ""}`}>
                <p className="body-copy text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">
                  {product.specLabels?.[i] || "Spec"}
                </p>
                <p className="display mt-1.5 text-[1.05rem] font-semibold text-ink">{spec}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-1">
            {save > 0 ? <s className="body-copy text-[1.15rem] text-ink/35">{formatTaka(mrp)}</s> : null}
            <p className="display text-[2.6rem] font-bold leading-none text-brand">{formatTaka(unit)}</p>
            {save > 0 ? <span className="body-copy mb-1 text-[14px] font-bold text-[#16a34a]">{save}% off</span> : null}
          </div>
          <p className="body-copy mt-2 text-[14px] text-ink/55">1 set · 5 sit + 5 back</p>

          {product.buyboxIcons?.length ? (
            <ul className="mt-8 grid grid-cols-4 gap-2">
              {product.buyboxIcons.map((icon) => (
                <li key={icon.label} className="text-center">
                  <span className="relative mx-auto flex h-10 w-10 items-center justify-center">
                    <Image src={icon.src} alt="" width={40} height={40} className="h-full w-full object-contain" />
                  </span>
                  <span className="body-copy mt-1.5 block text-[11px] font-semibold leading-tight text-brand">{icon.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex items-stretch gap-2.5">
            <div className="inline-flex shrink-0 overflow-hidden border border-ink/15">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-11 items-center justify-center text-ink/70">
                <FiMinus size={14} />
              </button>
              <span className="display flex h-12 min-w-[2.75rem] items-center justify-center text-[17px] font-bold">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="flex h-12 w-11 items-center justify-center text-ink/70">
                <FiPlus size={14} />
              </button>
            </div>
            <button type="button" onClick={onOrder} className="body-copy inline-flex h-12 flex-1 items-center justify-center bg-brand text-[14px] font-bold uppercase tracking-[0.08em] text-white hover:bg-brand-dark">
              Order now
            </button>
          </div>
          <button type="button" onClick={onAdd} className="body-copy mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 border border-ink/15 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/80 hover:border-ink/30">
            <FiShoppingCart size={14} />
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
