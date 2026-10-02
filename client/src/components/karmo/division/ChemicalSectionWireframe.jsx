import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import ImagePlaceholder from "./ImagePlaceholder";

/**
 * Low-fidelity layout for a Chemicals & Polymers section page — built for
 * `/chemicals/polyurethane`, the first of the five mega-menu columns to get a
 * page. The other four (Specialized, Karmo Adhesive, Evergain, Sodium
 * Silicate) stay disabled in the nav until they go through the same pass, and
 * can reuse this component with their own content once they do.
 *
 * The brief was explicitly "simple": every photo becomes a bordered
 * `ImagePlaceholder` at the size and position the real one will sit at, and
 * every section gets its own border, so the structure — where an image goes,
 * where copy goes — can be reviewed and signed off before any photography or
 * final copy exists. Swapping a placeholder for a real `<Image>` later does
 * not need to touch the layout around it.
 *
 * No animation, no photo styling (overlays, crops, hover states) — those are
 * a second pass once this shape is approved.
 */
export default function ChemicalSectionWireframe({
  eyebrow,
  heading,
  subline,
  intro,
  products = [],
  features = [],
}) {
  return (
    <>
      {/* Marks the page as a wireframe wherever it's opened, so a grey box
          never gets mistaken for a missed image once this ships. Remove this
          section on the pass that adds real photography. */}
      <div className="border-b border-ink/10 bg-ink/[0.04] py-2 text-center">
        <p className="display text-[10px] font-bold uppercase tracking-[0.14em] text-ink/50">
          UX Wireframe — layout only, photography &amp; final copy pending
        </p>
      </div>

      {/* ── Hero — full-bleed, like every real division-page hero (Foam,
          Pillow, Bed & Automotive): edge to edge, not boxed inside `.shell`,
          with the heading overlaid on a dark scrim rather than sitting
          underneath it. Only the photo itself is a placeholder. */}
      <section className="relative isolate h-[calc(100vh-112px)] overflow-hidden border-b border-ink/10">
        <ImagePlaceholder label="Hero banner" fill />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="display text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                {eyebrow}
              </p>
            )}
            <h1 className="display mt-2 text-[clamp(1.6rem,1rem+2.5vw,2.6rem)] font-bold uppercase leading-[1.1] text-white">
              {heading}
            </h1>
            {subline && (
              <p className="body-copy mt-3 text-[14px] leading-[1.6] text-white/80">
                {subline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── About — image + copy split ── */}
      {intro && (
        <section className="border-b border-ink/10 bg-white">
          <div className="shell grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
            <ImagePlaceholder label="Product photo" ratio="4/3" />
            <div>
              <h2 className="display text-[20px] font-bold uppercase tracking-[0.04em] text-ink">
                {intro.heading}
              </h2>
              <p className="body-copy mt-3 text-[14px] leading-[1.7] text-ink/60">
                {intro.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Product grid — one card per grade/SKU ── */}
      {products.length > 0 && (
        <section className="border-b border-ink/10 bg-[#faf9f7]">
          <div className="shell py-10 sm:py-14">
            <h2 className="display text-center text-[20px] font-bold uppercase tracking-[0.04em] text-ink">
              Products
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="border border-ink/12 bg-white p-4">
                  <ImagePlaceholder label={p.name} ratio="1/1" />
                  <h3 className="display mt-4 text-[14px] font-bold uppercase tracking-[0.06em] text-ink">
                    {p.name}
                  </h3>
                  {p.note && (
                    <p className="body-copy mt-1.5 text-[12.5px] leading-[1.5] text-ink/55">
                      {p.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust / feature strip ── */}
      {features.length > 0 && (
        <section className="border-b border-ink/10 bg-white">
          <div className="shell py-10 sm:py-12">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-col items-center gap-3 border border-ink/12 px-4 py-6 text-center"
                >
                  <ImagePlaceholder label="Icon" ratio="1/1" className="max-w-[64px]" />
                  <span className="display text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                    {f.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <OrderAndContact />
    </>
  );
}
