import CareerList from "@/components/karmo/career/CareerList";

export const metadata = {
  title: "Career — Karmo Group",
  description:
    "Join Karmo Group. Open positions across Foam, Mattress, HomeTex and Chemicals — apply online with your CV. Manufacturing in Bangladesh since 1965.",
};

/**
 * `/career` — the public vacancy list, reached from the footer.
 *
 * Candidates never sign in: they browse, open a posting and apply as guests,
 * keeping a tracking ID to check the status later. Everything below the header
 * is client-side because the filter bar drives the query.
 */
export default function CareerRoute() {
  return (
    <>
      <section className="border-b border-ink/8 bg-cream/40 py-12 lg:py-16">
        <div className="shell text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Careers at Karmo
          </span>
          <h1 className="display section-heading mt-3 uppercase text-ink">
            <span className="block">Build your career</span>
            <span className="block text-brand">with Karmo Group</span>
          </h1>
          <p className="body-copy mx-auto mt-4 max-w-2xl text-[15px] leading-[1.75] text-ink/55 lg:text-[16px]">
            Six decades of manufacturing across foam, mattress, HomeTex and
            chemicals — and a team that keeps growing. Find the role that fits
            you and apply online in minutes.
          </p>
        </div>
      </section>

      <CareerList />
    </>
  );
}
