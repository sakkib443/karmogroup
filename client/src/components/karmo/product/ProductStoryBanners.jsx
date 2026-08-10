"use client";

import Image from "next/image";

/**
 * Full-bleed story strips from the reference product HTML
 * (`fq0`, lifestyle, gif, claim panels). One job each: atmosphere.
 */
export default function ProductStoryBanners({ banners = [] }) {
  if (!banners.length) return null;

  return (
    <div className="bg-white">
      {banners.map((band) => (
        <section
          key={band.src}
          className="relative w-full overflow-hidden border-b border-ink/6"
        >
          <div className="relative aspect-[21/7] min-h-[160px] w-full sm:min-h-[200px] lg:aspect-[24/7]">
            <Image
              src={band.src}
              alt={band.alt || ""}
              fill
              sizes="100vw"
              unoptimized={band.src.endsWith(".gif")}
              className="object-cover object-center"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
