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
import ProductPromiseStrip from "@/components/karmo/product/ProductPromiseStrip";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

const MAX_QTY = 99;
const BAND = "lg:h-[calc(100svh-32px)]";
const SHELL_L = "lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))]";
const SHELL_R = "lg:pr-[max(4rem,calc((100vw-1600px)/2+4rem))]";
const H = "/pages/hometex";
const LIVE = "/pages/hometex/comforter-live";

const HIGHLIGHTS = [
  { src: "/shared/trust/cartoon-v3/feat-comfort-v2.webp", label: "Soft loft" },
  { src: "/shared/trust/cartoon-v3/feat-breathable-v2.webp", label: "All season" },
  { src: "/shared/trust/cartoon-v3/feat-durability-v2.webp", label: "Quilted through" },
  { src: "/shared/trust/cartoon-v3/delivery-v2.webp", label: "Free delivery" },
];

function Panel({ tone = "light", className = "", children }) {
  const dark = tone === "dark";
  return (
    <div className={`relative flex h-full items-center overflow-hidden ${dark ? "bg-[#0b1a33]" : "bg-[#f6f3ee]"} ${className}`}>
      {children}
    </div>
  );
}

const PROMISES = [
  { src: "/shared/trust/cartoon-v3/superbrand-v3.webp", scale: 0.92, title: "Quality checked", note: "Each comforter is finished and checked before it leaves" },
  { src: "/shared/trust/cartoon-v3/delivery-v2.webp", scale: 1, title: "Free delivery", note: "Doorstep delivery across Bangladesh on this range" },
  { src: "/shared/trust/cartoon-v3/natural-v2.webp", scale: 0.92, title: "Microfiber fill", note: "100% polyester microfiber, made for every season" },
  { src: "/shared/trust/cartoon-v3/legacy-60-v2.webp", scale: 1, title: "Trusted since 1965", note: "Six decades of comfort from Bangladesh's first foam maker" },
];

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
  const [qty, setQty] = useState(1);

  const item = () => ({
    id: product.slug,
    productId: product.slug,
    name: product.name,
    price: product.price,
    mrp: product.mrp,
    image: product.image,
    category: "hometex",
    quantity: qty,
    size: product.size,
  });

  const onAdd = () => {
    dispatch(addToCart(item()));
    toast.success("Added to cart", { style: { borderRadius: "0", background: "var(--color-brand)", color: "#fff" } });
  };
  const onOrder = () => {
    dispatch(removeFromCart(product.slug));
    dispatch(addToCart(item()));
    try { localStorage.setItem("karmogroup_selected_cart", JSON.stringify([product.slug])); } catch { /* checkout reads the cart */ }
    router.push("/checkout");
  };

  return (
    <section className="relative overflow-x-clip border-b border-ink/8 bg-white">
      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 pb-8 pt-3 sm:px-8 md:px-10 lg:px-12 lg:pb-12 lg:pt-4">
        <nav className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/hometex" className="hover:text-brand">HomeTex</Link>
          <span className="mx-2">/</span>
          <Link href="/hometex#hometex-offers" className="hover:text-brand">Comforter</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          <div className="h-fit lg:sticky lg:top-[128px] lg:col-span-6">
            <div className="relative aspect-square overflow-hidden bg-[#f3f1ec]">
              <Image src={product.image} alt={product.alt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain object-center" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand">Karmo HomeTex · {product.line}</p>
            <h1 className="display mt-2 text-[1.7rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[2.15rem]">{product.name}</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.65] text-ink/60">{product.summary}</p>

            <div className="mt-5 border border-ink/10 bg-[#f7f4ee] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">One piece · this print</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="display text-[2.15rem] font-semibold tabular-nums tracking-[-0.03em] text-ink">{formatTaka(product.price)}</span>
                <s className="text-[1.05rem] tabular-nums text-ink/35">{product.was}</s>
                <span className="bg-[#0b1a33] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Save 30%</span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink/55">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#2F9E44]" />
                In stock · {product.size} · free delivery
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 border-t border-ink/10">
              {[
                ["Print", product.print],
                ["Fill", "100% polyester"],
                ["Cloth", "Microfiber"],
                ["Quilt", "Stitched through"],
                ["Season", "All year"],
                ["Sold as", "1 piece"],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-ink/10 py-3 pr-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">{label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold leading-tight text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-4 grid grid-cols-4 gap-2" aria-label="Comforter highlights">
              {HIGHLIGHTS.map((item) => (
                <li key={item.label} className="flex min-w-0 flex-col items-center border border-ink/10 bg-white px-1 py-2.5 text-center">
                  <span className="relative flex h-9 w-9 items-center justify-center">
                    <Image src={item.src} alt="" width={36} height={36} className="h-full w-full object-contain" />
                  </span>
                  <span className="mt-1.5 text-[10px] font-semibold leading-tight text-ink/70 sm:text-[11px]">{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-stretch gap-2.5">
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
  const rows = [
    ["Print", product.print],
    ["Fill", "Microfiber"],
    ["Season", "All year"],
    ["Sold as", "1 piece"],
  ];
  return (
    <section className={`mb-1.5 grid bg-white lg:grid-cols-2 ${BAND}`} aria-label="Know your comforter">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
        <Image
          src={`${H}/hometex-first-sub/comforter-6.webp`}
          alt="Hands opening a quilted Karmo comforter to show the stitched face and the printed reverse"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <Panel tone="light" className={`px-6 py-14 md:px-14 lg:py-10 lg:pl-14 xl:pl-20 ${SHELL_R}`}>
        <div className="w-full">
          <Heading kicker={product.line} line1="Know your" line2="comforter" />
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
      </Panel>
    </section>
  );
}

function RoomBanner() {
  return (
    <section className={`relative mb-1.5 flex min-h-[78svh] items-center overflow-hidden ${BAND}`} aria-label="Dressed on the bed">
      <Image
        src={`${LIVE}/leaf-room.webp`}
        alt="A navy Karmo comforter with yellow and cream leaves on a bed against a dark wall"
        fill
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
      <div className={`relative z-[1] w-full px-6 py-16 md:px-14 ${SHELL_L}`}>
        <div className="w-[min(26rem,86vw)]">
          <Heading light kicker="From the range" line1="Dressed" line2="on the bed" />
          <p className="mt-5 text-[16px] leading-[1.7] text-white/85 lg:text-[17px]">
            The same cloth the shop shows on the bed. A quiet room, the print large enough to read from the door.
          </p>
        </div>
      </div>
    </section>
  );
}

function NightBanner() {
  return (
    <section className={`relative mb-1.5 flex min-h-[78svh] items-center overflow-hidden ${BAND}`} aria-label="Warm through the night">
      <Image
        src={`${H}/hometex-first-sub/bed.webp`}
        alt="A woman asleep under a turquoise Karmo comforter in a sunlit bedroom"
        fill
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/25 to-transparent" />
      <div className={`relative z-[1] flex w-full justify-end px-6 py-16 md:px-14 ${SHELL_R}`}>
        <div className="w-[min(22rem,78vw)] text-right">
          <Heading light kicker="HomeTex" line1="Warm" line2="all night" />
          <p className="mt-5 text-[16px] leading-[1.7] text-white/85 lg:text-[17px]">
            One piece on the bed. The quilt holds its loft, and the print stays clear from the pillow to the foot.
          </p>
        </div>
      </div>
    </section>
  );
}

function PhotoPair() {
  const shots = [
    {
      src: `${H}/comforter.webp`,
      alt: "An orange patchwork Karmo comforter dressed on a wooden bed in a bright room",
      line1: "Across",
      line2: "the bed",
      note: "The print is cut to read as one cloth, not a scatter of scraps.",
    },
    {
      src: `${LIVE}/floral-drape.webp`,
      alt: "A cream and coral floral Karmo comforter draped over the edge of a dark wood bed",
      line1: "At the",
      line2: "edge",
      note: "Quilted through, then it falls. The face and the stitch stay even.",
    },
  ];
  return (
    <section className="mb-1.5 grid gap-1.5 md:grid-cols-2" aria-label="The comforter on the bed">
      {shots.map((shot) => (
        <div key={shot.src} className={`relative aspect-[4/3] overflow-hidden md:aspect-auto ${BAND}`}>
          <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
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

function QuietBanner() {
  return (
    <section className={`relative mb-1.5 flex min-h-[78svh] items-center overflow-hidden ${BAND}`} aria-label="A quiet weight">
      <Image
        src={`${H}/comfort-6.webp`}
        alt="A woman resting under a coral floral Karmo comforter beside a sunlit wall"
        fill
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
      <div className={`relative z-[1] w-full px-6 py-16 md:px-14 ${SHELL_L}`}>
        <div className="max-w-xl">
          <Heading light kicker="The weight" line1="Light on" line2="the body" />
          <p className="mt-5 max-w-md text-[16px] leading-[1.7] text-white/85 lg:text-[17px]">
            Microfiber loft, not a heavy pile. Warm enough for a cool night, light enough to turn under.
          </p>
        </div>
      </div>
    </section>
  );
}

function Fill({ product }) {
  const facts = [
    ["100%", "Polyester"],
    ["Virgin", "Microfiber"],
    ["Quilt", "Through"],
    ["1", "Piece"],
  ];
  return (
    <section className={`mb-1.5 grid bg-white lg:grid-cols-2 ${BAND}`} aria-label="How it is filled">
      <Panel tone="dark" className={`px-6 py-14 text-white md:px-14 lg:py-10 ${SHELL_L}`}>
        <div className="w-full max-w-xl">
          <Heading light kicker={product.print} line1="Filled to" line2="stay even" />
          <p className="mt-5 text-[16px] leading-[1.7] text-white/75 lg:text-[17px]">
            {product.name} is filled with 100% polyester microfiber. The quilt keeps that fill from sliding to the corners.
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
      </Panel>
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
        <Image
          src={`${H}/hometex-slide-blue.webp`}
          alt="A blue patchwork Karmo comforter on a cane bed in a bright bedroom"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

export default function ComforterProductDetailPage({ product }) {
  if (!product) return null;
  return (
    <>
      <Buy product={product} />
      <ProductPromiseStrip items={PROMISES} />
      <Know product={product} />
      <RoomBanner />
      <NightBanner />
      <PhotoPair />
      <QuietBanner />
      <Fill product={product} />
      <OrderAndContact />
    </>
  );
}
