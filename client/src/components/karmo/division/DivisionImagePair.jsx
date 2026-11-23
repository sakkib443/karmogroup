"use client";

import Image from "next/image";

/**
 * Pictures side by side across the full screen width, each shown whole (they
 * carry their own text, so nothing is cropped). From tablet up they share one
 * height: each takes a slice of the width in proportion to its own shape
 * (flex-grow = width / height), so a square and a wide picture line up edge
 * to edge. Stacks on phones. Same 6px rhythm as the bands around it.
 */
export default function DivisionImagePair({ id, label, images = [], split, cellAspect, screenTall = false, overlay }) {
  if (!images.length) return null;

  /* Fixed shares (e.g. split: [50, 50]). Without `cellAspect` the first
     picture is shown whole and sets the row's height, and the others fill it.
     With `cellAspect` (width / height) every cell takes that shape. Either way
     pictures fill their cell with object-cover (aim with `position`), so pick
     a shape that only trims plain background. Phones stack every picture whole. */
  if (split?.length === images.length) {
    return (
      <section
        id={id}
        aria-label={label}
        className="mb-1.5 grid w-full grid-cols-1 gap-1.5 md:[grid-template-columns:var(--cols)]"
        style={{ ["--cols"]: split.map((n) => `${n}fr`).join(" ") }}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`relative aspect-[var(--nat)] w-full overflow-hidden ${
              screenTall
                ? "md:aspect-auto md:h-[var(--tall)]"
                : cellAspect ? "md:aspect-[var(--cell)]" : i > 0 ? "md:aspect-auto" : ""
            }`}
            style={{
              ["--nat"]: `${img.width} / ${img.height}`,
              ["--cell"]: cellAspect,
              /* Screen height (a little more than the view under the header), capped on very wide screens. */
              ["--tall"]: "min(calc(100svh - 40px), 56vw)",
            }}
          >
            {img.zoomOut ? (
              /* Close-cropped picture shown smaller (zoomOut = 0.8 → 80%) on a soft,
                 blurred copy of itself, so the cell stays filled. */
              <>
                <Image
                  src={img.src}
                  alt=""
                  aria-hidden
                  fill
                  sizes="10vw"
                  className="scale-110 object-cover blur-xl"
                />

                {/* Edges fade into the blurred copy — strongest left and right — so
                    there is no frame line, just the picture melting into its room. */}
                <span
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${img.zoomOut})`,
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                    maskImage: "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                  }}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 4%, #000 96%, transparent 100%)",
                      maskImage: "linear-gradient(to bottom, transparent 0%, #000 4%, #000 96%, transparent 100%)",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={`(min-width: 768px) ${split[i]}vw, 100vw`}
                      className="object-contain"
                    />
                  </span>
                </span>
              </>
            ) : (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={`(min-width: 768px) ${split[i]}vw, 100vw`}
                className="object-cover"
                /* `nudge` moves the picture inside its cell (e.g. "translateX(-4%) scale(1.08)");
                   the scale keeps the edges covered while it shifts. */
                style={{ objectPosition: img.position || "center", transform: img.nudge }}
              />
            )}
            {/* Optional soft shade over every picture (e.g. "rgba(0,0,0,.14)"). */}
            {overlay ? <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: overlay }} /> : null}
          </div>
        ))}
      </section>
    );
  }

  const ratios = images.map((img) => img.width / img.height);
  const total = ratios.reduce((sum, r) => sum + r, 0);

  return (
    <section
      id={id}
      aria-label={label}
      className="mb-1.5 flex w-full flex-col gap-1.5 md:flex-row"
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className="min-w-0 md:[flex:var(--ar)_1_0%]"
          style={{ ["--ar"]: ratios[i] }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes={`(min-width: 768px) ${Math.round((ratios[i] / total) * 100)}vw, 100vw`}
            className="block h-auto w-full"
          />
        </div>
      ))}
    </section>
  );
}
