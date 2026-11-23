import Image from "next/image";

/**
 * Four square pictures laid 2 × 2 with no gap, so the round "জীবনের সকল ক্ষেত্রে
 * রয়েছে কারমো" badge — split into quarters across the four — joins up in the middle.
 * Order: top-left, top-right, bottom-left, bottom-right.
 */
export default function QuadMosaic({ items = [] }) {
  if (items.length !== 4) return null;
  return (
    <section className="bg-white">
      <div className="grid w-full grid-cols-2">
        {items.map((it, i) => (
          <div key={it.src} className="relative aspect-square overflow-hidden">
            <Image
              src={it.src}
              alt={it.alt || ""}
              fill
              unoptimized
              sizes="50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
