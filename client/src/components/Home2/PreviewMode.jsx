"use client";

import { useEffect } from "react";

/**
 * Demo guard — stops every link on this page from navigating.
 *
 * Home 02 is a design presentation. Almost none of the routes it points at
 * exist yet (/foam/acoustic, /blog/foam-density, /career …), so a buyer
 * clicking around would land on a 404 and stop looking at the design.
 *
 * Done as one capture-phase listener rather than by editing ~90 hrefs across
 * fourteen components: the hrefs stay correct and meaningful, so when the real
 * routes are built this file is simply deleted and the whole page becomes live
 * at once — there is nothing to put back.
 *
 * What still works, deliberately:
 *   • Home 01 and Home 02 — the two pages that exist. Switching between them
 *     from the Home menu is the one journey the demo has to support.
 *   • Buttons — the film lightbox, the reels, the mobile drawer, the slider.
 *     Those are what there is to demonstrate.
 *   • Hover, focus and every transition. Links must still *look* live.
 *   • In-page jumps (#categories). They cannot 404, and a hero CTA that
 *     scrolls to the section it names demos far better than a dead one.
 *     Set ALLOW_IN_PAGE_JUMPS to false to kill those too.
 */
const ALLOW_IN_PAGE_JUMPS = true;

/**
 * The two routes that are actually built. They stay live so the buyer can
 * switch between the homepages from the Home menu — the one journey the demo
 * has to support. Everything else on the page points at a route that does not
 * exist yet and is swallowed.
 *
 * Matched exactly, not by prefix: "/" as a prefix would match every link on
 * the site.
 */
const LIVE_ROUTES = ["/", "/home-2"];

export default function PreviewMode() {
  useEffect(() => {
    const swallow = (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;

      // Scoped to this page's wrapper. A document-level listener that did not
      // check would also disable the site once someone navigated away.
      if (!link.closest(".lv")) return;

      const href = link.getAttribute("href") || "";
      if (ALLOW_IN_PAGE_JUMPS && href.startsWith("#")) return;
      if (LIVE_ROUTES.includes(href)) return;

      event.preventDefault();
      // Stopped in the capture phase so Next's router never sees it — without
      // this the client-side navigation still runs and the page changes.
      event.stopPropagation();
    };

    // `auxclick` covers middle-click, which opens a new tab and is not a
    // `click` at all — preventing only `click` leaves that route open.
    document.addEventListener("click", swallow, true);
    document.addEventListener("auxclick", swallow, true);

    return () => {
      document.removeEventListener("click", swallow, true);
      document.removeEventListener("auxclick", swallow, true);
    };
  }, []);

  return null;
}
