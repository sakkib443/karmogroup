"use client";

import DivisionPage from "@/components/karmo/division/DivisionPage";
import { useSection } from "@/cms/CmsProvider";
import { FOAM_FURNITURE_SECTIONS } from "@/cms/pages/foamFurniture";
import foamFurniture from "@/data/divisions/foamFurniture";

/**
 * A division page whose pictures come from Admin → Site content. The page's data is
 * the design (src/data/divisions/…); each CMS section lays its published (or, in the
 * editor's preview, unsaved) pictures over it. Wrap in <CmsScope page="…">.
 */
const PAGES = {
  "foam-furniture": { data: foamFurniture, sections: FOAM_FURNITURE_SECTIONS },
};

function useEdited(sections) {
  // One useSection per section, always in the same order (the list is fixed).
  return sections.map((s) => [s, useSection(s.key, s.defaults)]);
}

export default function CmsDivisionPage({ page }) {
  const { data, sections } = PAGES[page];
  const edited = useEdited(sections);
  const merged = edited.reduce((acc, [s, value]) => s.apply(acc, value), data);
  return <DivisionPage data={merged} />;
}
