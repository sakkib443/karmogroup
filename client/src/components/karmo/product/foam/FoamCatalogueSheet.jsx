/**
 * Catalogue facts for one furniture foam. Measurements sit in plates,
 * technical numbers in a single row, features as a numbered strip.
 */
function splitMeasure(line) {
  const [measure, caption] = String(line).split(" — ");
  return { measure, caption: caption || "" };
}

function Plate({ kicker, measure, caption }) {
  return (
    <div className="flex min-h-[7.5rem] flex-col justify-between border border-ink/10 bg-white px-4 py-4">
      {kicker ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">{kicker}</p>
      ) : (
        <span />
      )}
      <p className="mt-3 text-[1.15rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.3rem]">
        {measure}
      </p>
      {caption ? <p className="mt-1.5 text-[13px] text-ink/55">{caption}</p> : null}
    </div>
  );
}

export default function FoamCatalogueSheet({ catalogue }) {
  if (!catalogue) return null;

  const technical = catalogue.technical || [];
  const features = catalogue.features || [];
  const setSizes = (catalogue.setSizes || []).filter((size) => size.includes("×"));
  const bedSizes = (catalogue.bedSizes || []).filter((size) => size !== "Any size on request");
  const customBed = (catalogue.bedSizes || []).includes("Any size on request");

  return (
    <section className="border-b border-ink/10 bg-[#f7f5f2]" aria-label="Catalogue details">
      <div className="shell py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Karmo Foam Catalogue</p>
            <h2 className="mt-2 text-[1.7rem] font-bold uppercase leading-none tracking-[0.02em] text-ink sm:text-[2.1rem]">
              {catalogue.grade}
            </h2>
          </div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55">
            {[catalogue.color, catalogue.noFiller ? "No filler used" : "", catalogue.piece || ""].filter(Boolean).join("  ·  ")}
          </p>
        </div>

        {catalogue.note ? (
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-ink/70">{catalogue.note}</p>
        ) : null}

        {technical.length ? (
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-6">
            {technical.map((row) => (
              <li key={row.label} className="bg-white px-4 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">{row.label}</p>
                <p className="mt-2 text-[1.05rem] font-semibold leading-tight text-ink sm:text-[1.15rem]">{row.value}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {catalogue.piece ? (
          <div className="mt-8 max-w-sm">
            <Plate kicker="Piece" measure={catalogue.piece} caption="Sold as 1 piece" />
          </div>
        ) : null}

        {setSizes.length || bedSizes.length ? (
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {setSizes.length ? (
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/45">Set size</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {setSizes.map((size) => {
                    const { measure, caption } = splitMeasure(size);
                    return <Plate key={size} kicker="Set" measure={measure} caption={caption} />;
                  })}
                </div>
              </div>
            ) : null}
            {bedSizes.length ? (
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/45">Bed size</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {bedSizes.map((size) => (
                    <Plate key={size} kicker="Bed" measure={size} />
                  ))}
                </div>
                {customBed ? (
                  <p className="mt-3 text-[13px] text-ink/55">Or any size the customer needs.</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {features.length ? (
          <ol className="mt-10 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <li key={feature} className="flex items-baseline gap-3 bg-white px-4 py-4">
                <span className="text-[12px] font-bold tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-[14px] font-medium text-ink/80">{feature}</span>
              </li>
            ))}
          </ol>
        ) : null}

        {catalogue.use ? (
          <p className="mt-8 max-w-3xl text-[15px] leading-[1.75] text-ink/65">
            <span className="font-semibold uppercase tracking-[0.12em] text-ink">Use </span>
            {catalogue.use}
          </p>
        ) : null}
      </div>
    </section>
  );
}
