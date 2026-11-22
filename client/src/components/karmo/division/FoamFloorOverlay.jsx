"use client";

import { useEffect, useState } from "react";
import { ProductCycler } from "@/components/karmo/division/DivisionVideoHero";

/**
 * Laid over a full-width photo band: a white diagonal floor wedge, the band's own light
 * shade carried over it (so the white sits in the same light as the photo), and foam stacks
 * taking turns on that floor with a glossy shadow — the same build as slide 2 of the
 * furniture hero, here mirrored to the right (client, 23 Nov 2026).
 */
export default function FoamFloorOverlay({ clip, shade, place, mobilePlace, products = [] }) {
  /* Phones get their own (larger) placement. */
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setIsPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const where = (isPhone && mobilePlace) || place;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {clip ? <div className="absolute inset-0" style={{ clipPath: clip, background: "linear-gradient(180deg, #ffffff 0%, #f6f4f1 100%)" }} /> : null}
      {clip && shade ? <div className="absolute inset-0" style={{ clipPath: clip, background: shade }} /> : null}
      {products.length ? <ProductCycler items={products} place={where} active /> : null}
    </div>
  );
}
