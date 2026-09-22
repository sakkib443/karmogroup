import { redirect } from "next/navigation";

/**
 * Legacy URL — forwards to `/mattress/[slug]`.
 * Prefer the division URL going forward.
 */
export default async function LegacyProductDetailPage({ searchParams }) {
  const params = await searchParams;
  const slug = params?.p || "euro-top-pocket-spring";
  redirect(`/mattress/${slug}`);
}
