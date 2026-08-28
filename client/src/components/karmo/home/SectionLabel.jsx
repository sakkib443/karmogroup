/**
 * The homepage's heading setting, in one place.
 *
 * Every band on this page opens the same way: a small red eyebrow, then one
 * light uppercase line with a bold brand-coloured phrase inside it, left
 * aligned. It was copied by hand into each section, which is how the partner
 * strip ended up centred with a leaf rule under it while the others did not.
 *
 * New sections use this instead. If the setting changes, it changes here.
 */
export default function SectionLabel({ eyebrow, children, className = "" }) {
  return (
    <div className={className}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
        {eyebrow}
      </span>
      <h2 className="display section-heading mt-1 uppercase text-ink">
        {children}
      </h2>
    </div>
  );
}
