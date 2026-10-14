/**
 * Server-side: the published content of a page, for <CmsScope>. Cached for a minute
 * and refreshed at once when staff publish (POST /api/cms-revalidate). If the API
 * cannot be reached the page simply shows its designed defaults.
 */
import { API_URL } from "@/config/api";

export async function getPageContent(page) {
  if (!API_URL) return {};
  try {
    const res = await fetch(`${API_URL}/page-content/${page}`, {
      next: { revalidate: 60, tags: [`cms-${page}`] },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json?.data?.content || {};
  } catch {
    return {};
  }
}

/** A zero-height marker the editor's preview scrolls to when a section is opened. */
export function CmsAnchor({ section }) {
  return <div data-cms-section={section} aria-hidden="true" style={{ height: 0 }} />;
}
