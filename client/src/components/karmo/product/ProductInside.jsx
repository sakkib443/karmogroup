"use client";

import Image from "next/image";

/**
 * Inside the mattress — the exploded cross-section picture as a full-width
 * backdrop, one straight line per layer running to a numbered label.
 * The picture has no text; copy lives in productDetailData.js (INSIDE_BUILD),
 * the same on every mattress page.
 *
 * Height follows the screen: the band is one screen tall (100svh), a little more
 * on a very wide screen where the whole picture needs it, and never taller than
 * 1.3 × the picture on a tall one. The picture itself is always shown whole at
 * the page width — never zoomed or cropped. Spare height above and below is
 * filled with the picture's own soft, extended edges (imageTall).
 *
 * Desktop: labels sit on the empty right wall, sized in container units (cqw) so
 * the lines keep pointing at the same layer at any width. Below `lg` the wall is
 * too narrow for text: numbered pins on the picture, the list underneath.
 */

/** Right edge of each layer in the picture (x %, y %), top layer first. */
const PINS = [
  [53.4, 33.4],
  [53.8, 41.0],
  [53.6, 47.6],
  [53.8, 54.8],
  [52.6, 62.4],
  [53.6, 73.0],
];
const LABEL_X = 62; // % from the left where the number badges start

export default function ProductInside({ product }) {
  const build = product?.build;
  if (!build?.image) return null;
  const layers = build.layers || [];
  const ratio = build.width / build.height; // 2
  const vbH = 1000 / ratio;
  const ext = build.extend || 0;

  const heading = (
    <h2
      className="display uppercase text-ink"
      style={{ fontSize: "clamp(1.05rem, 2.1cqw, 2.3rem)", fontWeight: 350, lineHeight: 1.05, letterSpacing: "-0.01em" }}
    >
      <span className="block">{build.title}</span>
      <span className="mt-[0.12em] block text-brand">{build.accent}</span>
    </h2>
  );

  return (
    <section aria-label="Inside the mattress" className="relative w-full overflow-hidden bg-[#dcbb9c]">
      {/* ── Desktop: one screen tall, lines and labels over the picture ── */}
      <div className="@container hidden w-full lg:block">
        <div className="relative w-full" style={{ height: "max(calc(100cqw / 2), min(100svh, calc(100cqw / 2 * 1.3)))" }}>
          {/* The stage is exactly the picture's size, centred in the band. */}
          <div className="absolute left-0 w-full" style={{ top: "50%", transform: "translateY(-50%)", aspectRatio: ratio }}>
            {/* Reaches `ext`% above and below the stage; the stage itself is the picture. */}
            <div className="absolute left-0 w-full" style={{ top: `-${ext}%`, height: `${100 + 2 * ext}%` }}>
              <Image src={build.imageTall || build.image} alt={build.alt} fill sizes="100vw" className="object-fill" />
            </div>

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 1000 ${vbH}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              {PINS.map(([x, y], i) => {
                const cy = (y / 100) * vbH;
                return (
                  <g key={i}>
                    <line
                      x1={x * 10}
                      y1={cy}
                      x2={LABEL_X * 10 - 2}
                      y2={cy}
                      className="stroke-brand"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx={x * 10} cy={cy} r="3.6" className="fill-brand stroke-white" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}
            </svg>

            {/* Sits in the open wall above the first callout, aligned with the
                number column — not up in the corner or running off the right edge. */}
            <div className="absolute" style={{ left: `${LABEL_X}%`, top: "15%", width: "26%" }}>
              {heading}
            </div>

            {layers.map((layer, i) => (
              <div
                key={layer.title}
                className="absolute flex items-center"
                style={{ left: `${LABEL_X}%`, top: `${PINS[i][1]}%`, width: "33%", transform: "translateY(-50%)", gap: "0.8cqw" }}
              >
                <span
                  className="flex shrink-0 items-center justify-center bg-brand font-bold text-white"
                  style={{ width: "2cqw", height: "2cqw", minWidth: 18, minHeight: 18, fontSize: "clamp(10px, 0.95cqw, 16px)" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold uppercase text-ink" style={{ fontSize: "clamp(10px, 0.95cqw, 17px)", letterSpacing: "0.08em", lineHeight: 1.2 }}>
                    {layer.title}
                  </h3>
                  <p className="text-ink/60" style={{ fontSize: "clamp(9.5px, 0.85cqw, 15px)", lineHeight: 1.3 }}>
                    {layer.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phones and tablets: picture with numbered pins, list below ── */}
      <div className="@container lg:hidden" style={{ backgroundColor: "#f7eee6" }}>
        <div className="px-5 pb-4 pt-7 sm:px-8">{heading}</div>
        <div className="relative w-full" style={{ aspectRatio: ratio }}>
          <Image src={build.image} alt={build.alt} fill sizes="100vw" className="object-fill" />
          {PINS.map(([x, y], i) => (
            <span
              key={i}
              aria-hidden
              className="absolute flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white bg-brand text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] sm:h-6 sm:w-6 sm:text-[12px]"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <ol className="grid gap-x-6 gap-y-3 px-5 pb-7 pt-5 sm:grid-cols-2 sm:px-8">
          {layers.map((layer, i) => (
            <li key={layer.title} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink">{layer.title}</h3>
                <p className="text-[12.5px] leading-snug text-ink/60">{layer.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
