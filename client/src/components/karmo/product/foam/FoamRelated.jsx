"use client";

/** More Karmo foam — the rest of the catalogue, as small cards. */
import Image from "next/image";
import Link from "next/link";
import { getFoamProductDetail, getFoamProductSlugs } from "@/components/karmo/product/foamProductDetailData";

const taka = (n) => `৳${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

export default function FoamRelated({ current }) {
  const others = getFoamProductSlugs()
    .filter((s) => s !== current)
    .map((s) => getFoamProductDetail(s))
    .filter(Boolean)
    .slice(0, 4);
  if (!others.length) return null;

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">More foam</span>
            <h2 className="display title-card-line mt-2 uppercase text-ink" style={{ fontSize: "clamp(1.4rem, 1.05rem + 1.2vw, 2rem)", fontWeight: 350, lineHeight: 1.08 }}>
              Other <span className="text-brand">grades</span>
            </h2>
          </div>
          <Link href="/foam/furniture#foam-offers" className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-brand">
            See all foam
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/foam/${p.slug}`} className="group block">
                <span className="relative block aspect-square overflow-hidden bg-[#f3f1ec]">
                  {p.cover ? (
                    <Image src={p.cover} alt={p.imageAlt || p.name} fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  ) : null}
                  {p.mrp > p.price ? (
                    <span className="absolute left-0 top-0 bg-brand px-2 py-1 text-[10px] font-bold text-white">−{Math.round(((p.mrp - p.price) / p.mrp) * 100)}%</span>
                  ) : null}
                </span>
                <span className="mt-3 block text-[13px] font-semibold uppercase leading-snug tracking-[0.03em] text-ink transition-colors group-hover:text-brand">{p.name}</span>
                <span className="mt-1 block text-sm">
                  <span className="font-bold text-brand">{taka(p.price)}</span>
                  {p.mrp > p.price ? <s className="ml-2 text-xs text-ink/35">{taka(p.mrp)}</s> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
