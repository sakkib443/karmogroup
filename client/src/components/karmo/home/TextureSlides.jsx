"use client";

import { useGlobal } from "@/cms/CmsProvider";
import { overlayStyle } from "@/cms/core";
import { texture } from "@/cms/pages/global";

/**
 * The soft pattern behind the light homepage sections. Parent section must be
 * `relative`. Pattern, strength and white wash come from Admin → Site content →
 * Brand & contact → Section background texture.
 *
 * `lighter` keeps the stronger white wash those sections were designed with; without
 * it the wash is a little thinner (the original "slides" look).
 */
export default function TextureSlides({ lighter = false }) {
  const t = useGlobal("texture", texture.defaults);
  const strength = Math.min(100, Math.max(0, Number(t.strength ?? 50))) / 100;
  const wash = lighter ? t.wash : { ...t.wash, opacity: Math.max(0, Number(t.wash?.opacity ?? 70) - 25) };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" aria-hidden />
      {t.image?.src ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${t.image.src})`,
              backgroundSize: "cover",
              backgroundPosition: `${t.image.x ?? 50}% ${t.image.y ?? 50}%`,
              backgroundRepeat: "no-repeat",
              opacity: strength,
            }}
          />
          <div className="absolute inset-0" style={overlayStyle(wash)} />
        </div>
      ) : null}
    </>
  );
}
