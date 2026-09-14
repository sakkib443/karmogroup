import JobDetail from "@/components/karmo/career/JobDetail";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = String(slug || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} — Career at Karmo Group`,
    description: `Apply for ${title} at Karmo Group. Manufacturing foam, mattress, HomeTex and chemicals in Bangladesh since 1965.`,
  };
}

/**
 * `/career/[slug]` — one posting plus its application form.
 *
 * The posting is fetched in the client component rather than here: the same
 * query powers the form's validation state (deadline, accepting-applications),
 * so fetching twice would risk the two disagreeing.
 */
export default async function JobDetailRoute({ params }) {
  const { slug } = await params;
  return <JobDetail slug={slug} />;
}
