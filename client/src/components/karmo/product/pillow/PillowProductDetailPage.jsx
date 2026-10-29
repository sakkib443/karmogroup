"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useAppDispatch } from "@/redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { formatTaka } from "@/components/karmo/product/productDetailData";
import { PILLOW_FEELS } from "@/components/karmo/product/pillow/pillowDetailData";
import ProductPromiseStrip from "@/components/karmo/product/ProductPromiseStrip";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

const MAX_QTY = 99;
const BAND = "lg:h-[calc(100svh-32px)]";
const SHELL_L = "lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))]";
const SHELL_R = "lg:pr-[max(4rem,calc((100vw-1600px)/2+4rem))]";

const PROMISES = [
  { src: "/shared/trust/cartoon-v3/superbrand-v3.webp", scale: 0.92, title: "Quality checked", note: "Every pillow is finished and checked before it leaves" },
  { src: "/shared/trust/cartoon-v3/delivery-v2.webp", scale: 1, title: "Free delivery", note: "Doorstep delivery across Bangladesh on this range" },
  { src: "/shared/trust/cartoon-v3/trusted-v3.webp", scale: 0.92, title: "Soft fibre fill", note: "Filled to feel full in the cover, not flat in the middle" },
  { src: "/shared/trust/cartoon-v3/legacy-60-v2.webp", scale: 1, title: "Trusted since 1965", note: "Six decades of comfort from Bangladesh's first foam maker" },
];

const P = "/pages/hometex/pillow";

function feelOf(id) {
  return PILLOW_FEELS.find((f) => f.id === id) || PILLOW_FEELS[3];
}

function Heading({ light = false, kicker, line1, line2 }) {
  return (
    <>
      <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${light ? "text-white/75" : "text-brand"}`}>{kicker}</p>
      <h2 className={`display mt-3 uppercase leading-[1.05] tracking-[-0.02em] ${light ? "text-white" : "text-ink"}`} style={{ fontSize: "clamp(2rem, 1.4rem + 2vw, 3.4rem)", fontWeight: 350 }}>
        <span className="block">{line1}</span>
        <span className={`block ${light ? "text-white" : "text-brand"}`}>{line2}</span>
      </h2>
    </>
  );
}

function Buy({ product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const gallery = product.gallery;
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(gallery[0]);
  const at = Math.max(0, gallery.indexOf(shot));
  const cartId = product.slug;

  const item = () => ({
    id: cartId,
    productId: product.slug,
    name: product.name,
    price: product.price,
    mrp: product.price,
    image: product.image,
    category: "fiber_pillow",
    quantity: qty,
    size: product.size,
  });

  const onAdd = () => {
    dispatch(addToCart(item()));
    toast.success("Added to cart", { style: { borderRadius: "0", background: "var(--color-brand)", color: "#fff" } });
  };
  const onOrder = () => {
    dispatch(removeFromCart(cartId));
    dispatch(addToCart(item()));
    try { localStorage.setItem("karmogroup_selected_cart", JSON.stringify([cartId])); } catch { /* checkout reads the cart */ }
    router.push("/checkout");
  };
  const step = (dir) => setShot(gallery[(at + dir + gallery.length) % gallery.length]);

  return (
    <section className="relative overflow-x-clip border-b border-ink/8 bg-white">
      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 pb-8 pt-3 sm:px-8 md:px-10 lg:px-12 lg:pb-12 lg:pt-4">
        <nav className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/hometex" className="hover:text-brand">HomeTex</Link>
          <span className="mx-2">/</span>
          <Link href="/hometex/pillow" className="hover:text-brand">Pillow</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          <div className="h-fit lg:sticky lg:top-[128px] lg:col-span-6">
            <div className="mx-auto" style={{ width: "min(100%, calc(100svh - 14rem))", maxWidth: "100%" }}>
              <div className="group/main relative overflow-hidden bg-[#f3f1ec]">
                <div className="relative w-full" style={{ paddingTop: "100%" }}>
                  <Image src={shot} alt={product.alt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain object-center" />
                  {gallery.length > 1 && (
                    <>
                      <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-ink lg:opacity-0 lg:group-hover/main:opacity-100">
                        <FiChevronLeft size={18} />
                      </button>
                      <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-ink lg:opacity-0 lg:group-hover/main:opacity-100">
                        <FiChevronRight size={18} />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-ink/75 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">{at + 1} / {gallery.length}</span>
                    </>
                  )}
                </div>
              </div>
              {gallery.length > 1 && (
                <ul className="mt-3 flex gap-2">
                  {gallery.map((src, i) => (
                    <li key={src} className="w-[72px]">
                      <button type="button" aria-label={`Photo ${i + 1}`} aria-pressed={shot === src} onClick={() => setShot(src)} className={`relative block aspect-square w-full overflow-hidden border bg-[#f3f1ec] ${shot === src ? "border-brand" : "border-ink/10"}`}>
                        <Image src={src} alt="" fill sizes="80px" className="object-contain" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand">Karmo HomeTex · {product.line}</p>
            <h1 className="display mt-2 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2.15rem]">{product.name}</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.65] text-ink/60">{product.summary}</p>
            <p className="display mt-5 text-[2rem] font-semibold tabular-nums tracking-[-0.03em] text-ink">{formatTaka(product.price)}</p>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/40">
              {product.pieces > 1 ? `${product.pieces} pieces · ` : ""}{product.size} · in stock
            </p>

            {product.sizes.length > 1 && (
              <div className="mt-6 border-y border-ink/10 py-4">
                <p className="mb-3 text-[13px] font-semibold text-ink/70">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const on = size.slug === product.slug;
                    return (
                      <Link key={size.slug} href={`/hometex/pillow/${size.slug}`} aria-current={on ? "page" : undefined} className={`inline-flex h-11 items-center border px-4 text-[14px] font-semibold ${on ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink hover:border-ink/40"}`}>
                        {size.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-stretch gap-2.5">
              <div className="inline-flex shrink-0 overflow-hidden border border-[#e5e7eb]">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-11 items-center justify-center bg-[#f3f4f6]"><FiMinus size={14} /></button>
                <span className="flex h-12 min-w-[2.75rem] items-center justify-center text-[17px] font-bold tabular-nums">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="flex h-12 w-11 items-center justify-center bg-[#f3f4f6]"><FiPlus size={14} /></button>
              </div>
              <button type="button" onClick={onOrder} className="inline-flex h-12 flex-1 items-center justify-center bg-brand text-[15px] font-bold uppercase tracking-[0.06em] text-white hover:bg-brand-dark">Order now</button>
            </div>
            <button type="button" onClick={onAdd} className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 border border-[#d1d5db] bg-white text-[14px] font-semibold uppercase tracking-[0.08em] text-[#444] hover:border-ink/30">
              <FiShoppingCart size={15} /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Know({ product }) {
  const feel = feelOf(product.feel);
  const rows = [
    ["Size", product.size],
    ["Line", product.line],
    ["Feel", feel.label],
    ["Sold as", product.pieces > 1 ? `${product.pieces} pieces` : "1 piece"],
  ];
  return (
    <section className={`mb-1.5 grid bg-white lg:grid-cols-2 ${BAND}`} aria-label="Know your pillow">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
        <Image src={product.kind === "cushion" ? `${P}/card-02.webp` : `${P}/KARMO Plush Pillow Comfort.webp`} alt={product.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className={`relative flex items-center bg-[#f6f3ee] px-6 py-14 md:px-14 lg:py-10 lg:pl-14 xl:pl-20 ${SHELL_R}`}>
        <div className="w-full">
          <Heading kicker={product.line} line1="Know your" line2="pillow" />
          <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-ink/60 lg:text-[17px]">{product.summary}</p>
          <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-1.5">
            {rows.map(([label, value]) => (
              <div key={label} className="bg-[#0b1a33] px-4 py-5 sm:px-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">{label}</dt>
                <dd className="display mt-1 text-[1.35rem] font-bold leading-tight text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function RestBanner() {
  return (
    <section className={`relative mb-1.5 flex min-h-[78svh] items-center overflow-hidden ${BAND}`} aria-label="Made to rest">
      <Image src={`${P}/why-choose/why-choose-1.webp`} alt="A couple with Karmo Plush pillows in a bright bedroom" fill sizes="100vw" className="object-cover object-center" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className={`relative z-[1] w-full px-6 py-16 md:px-14 ${SHELL_L}`}>
        <div className="max-w-2xl">
          <Heading light kicker="HomeTex" line1="Made to" line2="rest" />
          <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-white/85 lg:text-[17px]">
            A full pillow for the head, a wider one for the side, a square insert for the sofa. The same white finish, ready to put on the bed.
          </p>
        </div>
      </div>
    </section>
  );
}

function PhotoPair() {
  const shots = [
    { src: `${P}/card-01.webp`, alt: "Side sleep on a Karmo Plush pillow", line1: "Quiet", line2: "through the night", note: "The head pillow stays put when you turn." },
    { src: `${P}/card-02.webp`, alt: "A hand pressing a Karmo pillow", line1: "Soft", line2: "then it holds", note: "Press it. It gives, then comes back." },
  ];
  return (
    <section className="mb-1.5 grid gap-1.5 md:grid-cols-2" aria-label="The pillow up close">
      {shots.map((shot) => (
        <div key={shot.src} className={`relative aspect-[4/3] overflow-hidden md:aspect-auto ${BAND}`}>
          <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">
            <h3 className="display uppercase text-white" style={{ fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem)", fontWeight: 350, lineHeight: 1.05 }}>
              <span className="block">{shot.line1}</span>
              <span className="block">{shot.line2}</span>
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-[1.6] text-white/85">{shot.note}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Softness({ product }) {
  const index = Math.max(0, PILLOW_FEELS.findIndex((f) => f.id === product.feel));
  const feel = PILLOW_FEELS[index];
  return (
    <section className={`relative mb-1.5 flex min-h-[78svh] items-end overflow-hidden ${BAND}`} aria-label="Softness">
      <Image src={`${P}/pillow-banner.webp`} alt="White Karmo pillows arranged on a sofa" fill sizes="100vw" className="object-cover object-center" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className={`relative z-[1] w-full px-6 pb-10 pt-24 md:px-14 md:pb-14 ${SHELL_L} ${SHELL_R}`}>
        <Heading light kicker="Softness scale" line1="This one sits" line2={feel.label} />
        <p className="mt-4 max-w-lg text-[16px] leading-[1.65] text-white/80">{feel.note}</p>
        <div className="mt-8 max-w-3xl">
          <div className="relative h-[3px] bg-white/35">
            <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand" style={{ left: `${(index / (PILLOW_FEELS.length - 1)) * 100}%` }} />
          </div>
          <ol className="mt-3 grid grid-cols-5">
            {PILLOW_FEELS.map((step, i) => (
              <li key={step.id} className={`text-[11px] font-semibold sm:text-[13px] ${i === index ? "text-white" : "text-white/55"} ${i === 0 ? "text-left" : i === PILLOW_FEELS.length - 1 ? "text-right" : "text-center"}`}>
                {step.label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Insert({ product }) {
  const facts = product.kind === "cushion"
    ? [["50 cm", "Insert"], ["45 cm", "Cover"], ["500 g", "PP cotton"], ["Zip", "Adjustable"]]
    : [["Full", "Through the middle"], [product.across || product.size, "Across"], [product.down || product.line, "Down"], [feelOf(product.feel).label, "Feel"]];
  const photo = product.kind === "cushion" ? product.image : `${P}/KARMO Plush Pillow Comfort.webp`;
  return (
    <section className={`mb-1.5 grid bg-white lg:grid-cols-2 ${BAND}`} aria-label="How it is filled">
      <div className={`flex items-center bg-[#0b1a33] px-6 py-14 text-white md:px-14 lg:py-10 ${SHELL_L}`}>
        <div className="w-full max-w-xl">
          <Heading light kicker={product.kind === "cushion" ? "Cushion insert" : "The fill"} line1={product.kind === "cushion" ? "Cut larger" : "Filled"} line2={product.kind === "cushion" ? "than the cover" : "to stay full"} />
          <p className="mt-5 text-[16px] leading-[1.7] text-white/75 lg:text-[17px]">
            {product.kind === "cushion"
              ? "The insert is 50 × 50 cm so it sits nicely inside a 45 × 45 cm cover. Open the zip if you want to ease the fill."
              : `${product.name} is filled so the middle stays plump. Finished size ${product.size}.`}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-1.5">
            {facts.map(([value, label]) => (
              <div key={label} className="border border-white/15 px-4 py-5">
                <dd className="display text-[1.6rem] font-semibold leading-none">{value}</dd>
                <dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
        <Image src={photo} alt={product.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className={product.kind === "cushion" ? "object-contain bg-[#f3f1ec] p-10" : "object-cover"} />
      </div>
    </section>
  );
}

function Related({ items }) {
  if (!items?.length) return null;
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">More pillows</span>
            <h2 className="display mt-2 uppercase text-ink" style={{ fontSize: "clamp(1.4rem, 1.05rem + 1.2vw, 2rem)", fontWeight: 350, lineHeight: 1.08 }}>
              Other <span className="text-brand">pieces</span>
            </h2>
          </div>
          <Link href="/hometex/pillow#pillow-offers" className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-brand">See all pillows</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/hometex/pillow/${item.slug}`} className="group block">
                <span className="relative block aspect-square overflow-hidden bg-[#f3f1ec]">
                  <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.04]" />
                </span>
                <span className="mt-3 block text-[14px] font-semibold leading-snug text-ink group-hover:text-brand">{item.name}</span>
                <span className="mt-1 block text-[14px] font-semibold tabular-nums text-ink/70">{formatTaka(item.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function PillowProductDetailPage({ product }) {
  if (!product) return null;
  return (
    <>
      <Buy product={product} />
      <ProductPromiseStrip items={PROMISES} />
      <Know product={product} />
      <RestBanner />
      <PhotoPair />
      <Softness product={product} />
      <Insert product={product} />
      <Related items={product.related} />
      <OrderAndContact />
    </>
  );
}
