"use client";

import Image from "next/image";

/**
 * Pictures side by side across the full screen width, each shown whole (they
 * carry their own text, so nothing is cropped). From tablet up they share one
 * height: each takes a slice of the width in proportion to its own shape
 * (flex-grow = width / height), so a square and a wide picture line up edge
 * to edge. Stacks on phones. Same 6px rhythm as the bands around it.
 */
export default function DivisionImagePair({ id, label, images = [], split, cellAspect }) {
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
              cellAspect ? "md:aspect-[var(--cell)]" : i > 0 ? "md:aspect-auto" : ""
            }`}
            style={{ ["--nat"]: `${img.width} / ${img.height}`, ["--cell"]: cellAspect }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={`(min-width: 768px) ${split[i]}vw, 100vw`}
              className="object-cover"
              style={{ objectPosition: img.position || "center" }}
            />
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
