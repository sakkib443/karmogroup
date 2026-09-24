/**
 * Chemicals & Polymers — per-section division pages.
 *
 * Each mega-menu column (see Navbar `Chemicals & Polymers`) gets its own route
 * under `/chemicals/<key>`, mirroring how Foam splits into `/foam/furniture`,
 * `/foam/footwear`, etc. Every section reuses the shared `chemicals` template
 * and only overrides the section-specific bits (slug, banner headline, about
 * eyebrow and page <title>/description) so the layout stays in one place.
 *
 * SCAFFOLD: product lists still come from the base `chemicals` catalogue. Swap
 * in each section's real SKUs when the Karmo Adhesive Catalog is ready.
 */

import chemicals from "./chemicals";

/** Section overrides — keyed by the URL segment (`/chemicals/<key>`). */
const SECTIONS = {
  polyurethane: {
    slug: "chemicals-polyurethane",
    title: "Polyurethane / Solvent — Karmo Chemicals",
    description:
      "Karmo polyurethane and solvent range — TDI, PPG and copolymer grades for foam and industrial use. Made in Bangladesh since 1965.",
    headline: "Polyurethane & solvents",
    eyebrow: "About Karmo Polyurethane",
  },
  specialized: {
    slug: "chemicals-specialized",
    title: "Specialized Chemicals & Additives — Karmo Chemicals",
    description:
      "Karmo specialized chemicals and additives — silicone, SO, PS and pigments engineered for consistent, tested performance.",
    headline: "Specialized chemicals & additives",
    eyebrow: "About Karmo Specialized Chemicals",
  },
  "karmo-adhesive": {
    slug: "chemicals-karmo-adhesive",
    title: "Karmo Adhesive — Karmo Chemicals",
    description:
      "Karmo Adhesive range — Super, Light, Rubber Solution, PU and Bond. Industrial-strength bonding, fast cure, quality-certified batches.",
    headline: "Karmo Adhesive",
    eyebrow: "About Karmo Adhesive",
  },
  evergain: {
    slug: "chemicals-evergain",
    title: "Evergain Chemical — Karmo Chemicals",
    description:
      "Evergain chemical range — neoprene and PU shoe adhesives, primers, hardeners, cleaners and specialty glues for footwear and manufacturing.",
    headline: "Evergain Chemical",
    eyebrow: "About Evergain Chemical",
  },
  "sodium-silicate": {
    slug: "chemicals-sodium-silicate",
    title: "Sodium Silicate — Karmo Chemicals",
    description:
      "Karmo sodium silicate — industrial-grade water glass for adhesives, binders and specialty applications.",
    headline: "Sodium Silicate",
    eyebrow: "About Karmo Sodium Silicate",
  },
};

/** Build a full DivisionPage data object for one section, from the base template. */
function buildSection(section) {
  return {
    ...chemicals,
    slug: section.slug,
    banner: { ...chemicals.banner, headline: section.headline },
    about: { ...chemicals.about, eyebrow: section.eyebrow },
  };
}

/** `{ [key]: { title, description, data } }` — one entry per `/chemicals/<key>`. */
const chemicalsCategories = Object.fromEntries(
  Object.entries(SECTIONS).map(([key, section]) => [
    key,
    {
      title: section.title,
      description: section.description,
      data: buildSection(section),
    },
  ])
);

export default chemicalsCategories;
