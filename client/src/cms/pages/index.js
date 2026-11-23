/**
 * Every page that can be edited in Admin → Site content.
 *   id       the page's key in the database (page-content/<id>)
 *   path     where the page lives on the site — the editor previews it
 *   sections in page order; each is { key, label, description, fields, defaults }
 */
import { HOME_SECTIONS } from "./home";
import { GLOBAL_SECTIONS } from "./global";
import { FOAM_FURNITURE_SECTIONS } from "./foamFurniture";

export const CMS_PAGES = [
  {
    id: "home",
    label: "Home",
    path: "/",
    description: "The front page — hero slider, divisions, films, partners and more.",
    sections: HOME_SECTIONS,
  },
  {
    id: "foam-furniture",
    label: "Foam — Furniture",
    path: "/foam/furniture",
    description: "The furniture & upholstery foam page — hero, room photos, large photos, the video and the banner.",
    sections: FOAM_FURNITURE_SECTIONS,
  },
  {
    id: "global",
    label: "Brand & contact",
    path: "/",
    description: "Logos, phone, email, address, social links and the bands every page shares.",
    sections: GLOBAL_SECTIONS,
  },
];

export const cmsPage = (id) => CMS_PAGES.find((p) => p.id === id);
