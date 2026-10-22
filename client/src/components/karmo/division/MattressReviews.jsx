/**
 * Read-only guest notes. People, their photo, and the stars they gave.
 * Nothing to submit — the notes live in division data.
 */

import Image from "next/image";

const STAR = "#FF9A1F";
const EMPTY = "#E4E0DA";

function Stars({ value = 5, size = 16 }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rounded} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
          <path
            d="M12 2.6 14.9 9l6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.8l1.6-6.7L2.2 9.6 9.1 9 12 2.6Z"
            fill={i < rounded ? STAR : EMPTY}
          />
        </svg>
      ))}
    </span>
  );
}

export default function MattressReviews({
  eyebrow = "Guest notes",
  headingLead = "Rated by",
  headingAccent = "families",
  note = "A few notes from homes already sleeping on Karmo.",
  items = [],
}) {
  if (!items.length) return null;

  const total = items.length;
  const average = items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total;
  const score = average.toFixed(1);
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: items.filter((item) => Math.round(Number(item.rating) || 0) === star).length,
  }));

  return (
    <section aria-label="Mattress reviews" className="bg-[#faf8f5] pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="shell">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
          {eyebrow}
        </p>
        <h2 className="display section-heading title-card-line mt-3 uppercase text-ink">
          {headingLead} <span className="text-brand">{headingAccent}</span>
        </h2>
        {note ? (
          <p className="body-copy mt-3 max-w-lg text-[14px] leading-[1.65] text-ink/60">
            {note}
          </p>
        ) : null}

        <div className="mt-8 grid items-center gap-8 border-y border-ink/10 py-8 sm:grid-cols-[auto_minmax(0,22rem)] sm:gap-12 lg:mt-10">
          <div className="flex items-center gap-5">
            <p className="display text-[4.25rem] font-light leading-none tabular-nums text-ink">
              {score}
            </p>
            <div>
              <Stars value={average} size={18} />
              <p className="mt-2 text-[13px] text-ink/50">
                {total} {total === 1 ? "rating" : "ratings"}
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-2" aria-label="Rating breakdown">
            {counts.map(({ star, count }) => {
              const share = total ? Math.round((count / total) * 100) : 0;
              return (
                <li key={star} className="grid grid-cols-[2.25rem_1fr_1.5rem] items-center gap-3">
                  <span className="text-[12px] font-semibold tabular-nums text-ink/70">
                    {star} star
                  </span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <span
                      className="block h-full rounded-full bg-[#FF9A1F]"
                      style={{ width: `${share}%` }}
                    />
                  </span>
                  <span className="text-right text-[12px] tabular-nums text-ink/45">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:mt-10 lg:gap-y-10">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4">
              {item.image ? (
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#efeae4] sm:h-16 sm:w-16">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="text-[15px] font-semibold text-ink">{item.name}</p>
                  <Stars value={item.rating} size={14} />
                </div>
                {item.city ? (
                  <p className="mt-0.5 text-[12px] text-ink/45">{item.city}</p>
                ) : null}
                <p className="body-copy mt-2.5 text-[14.5px] leading-[1.65] text-ink/75">
                  {item.quote}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
