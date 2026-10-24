import Image from "next/image";
import Link from "next/link";

/**
 * One full-screen banner — the whole of each Chemicals section page for now.
 * Same height as the division heroes (screen less the header), photo edge to
 * edge, copy on the left over a navy wash, set like the homepage's photo titles.
 */
export default function ChemicalBanner({ src, alt, line1, line2, body, items = [], position = "object-center" }) {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#0b1a33] text-white h-[calc(100svh-112px)]">
      <Image src={src} alt={alt} fill priority unoptimized sizes="100vw" className={`object-cover ${position}`} />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b1a33]/90 via-[#0b1a33]/55 to-transparent" />

      <div className="relative z-[1] w-full px-6 md:px-14 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))]">
        <div className="max-w-xl">
          <nav className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>Karmo Chemicals</span>
          </nav>

          <h1
            className="display title-card-line mt-5 uppercase"
            style={{
              fontSize: "clamp(2.2rem, 1.4rem + 3vw, 4.2rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
            }}
          >
            <span className="block">{line1}</span>
            {line2 ? <span className="block text-brand">{line2}</span> : null}
          </h1>

          <span className="mt-5 block h-px w-12 bg-brand" aria-hidden />

          {body ? <p className="body-copy mt-5 text-[16px] leading-[1.7] text-white/85 lg:text-[17px]">{body}</p> : null}

          {items.length ? (
            <ul className="mt-7 flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className="border border-white/30 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/90">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
