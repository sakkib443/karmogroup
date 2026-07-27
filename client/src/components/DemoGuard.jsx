"use client";

import { useEffect } from "react";

/**
 * Presentation mode.
 *
 * The site is being shown to the client before most of it exists — 36 of the 44
 * routes the navigation points at have no page behind them. A buyer clicking
 * through a demo and landing on a 404 is the thing this exists to prevent.
 *
 * So every navigation is swallowed: internal links, external links, mail and
 * phone links, and form submissions. Hover states, transitions and the cursor
 * are all untouched, so a blocked link still behaves as if it were live.
 *
 * What deliberately keeps working is everything that happens *inside* the page
 * — the video stage, the carousels, the lightbox, the mobile menu, back to top.
 * None of those can produce an error, and switching them off would make the
 * site look broken rather than finished, which is the opposite of the point.
 *
 * TURNING IT OFF FOR LAUNCH
 * Set NEXT_PUBLIC_DEMO_MODE=false in the environment, or delete the <DemoGuard/>
 * line from src/app/layout.js. It is on unless explicitly switched off, so a
 * missing variable can never quietly re-enable navigation to pages that are
 * still empty.
 */
const ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

/**
 * The exceptions. Both homepage designs are finished and both are what the
 * client is being shown, so the Home menu has to move between them — blocking
 * those two would hide half of what there is to look at.
 *
 * Add a path here only when the page behind it actually exists. Anything else
 * on an element carrying `data-demo-allow` is let through as well, for a
 * one-off that does not deserve an entry.
 */
const ALLOWED = new Set(["/", "/home-2"]);

function isAllowed(link) {
  if (link.closest("[data-demo-allow]")) return true;

  // Resolved against the document, so a relative href is judged by where it
  // would actually land rather than by the string in the markup.
  let url;
  try {
    url = new URL(link.href, location.href);
  } catch {
    return false;
  }

  if (url.origin !== location.origin) return false;

  // "/home-2/" and "/home-2" are the same page.
  const path = url.pathname.replace(/\/+$/, "") || "/";
  return ALLOWED.has(path);
}

export default function DemoGuard() {
  useEffect(() => {
    if (!ENABLED) return;

    // Capture phase, so this runs before React's own handlers. It only calls
    // preventDefault — never stopPropagation — because React attaches its
    // listeners to the root container inside document, and stopping the event
    // here would kill every onClick on the page, video controls included.
    //
    // preventDefault alone is enough for Next's <Link>: its click handler
    // returns early when e.defaultPrevented is set (next/dist/client/link.js),
    // so client-side routing is skipped along with the native navigation.
    const swallowClick = (event) => {
      const link = event.target?.closest?.("a[href], area[href]");
      if (!link) return;

      // Fragments are settled first. A bare "#" resolves against the current
      // page, so on an allowed path it would otherwise pass the check below and
      // jerk the view to the top — which is exactly what it must not do.
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        // A real in-page anchor is just scrolling, so it is left alone —
        // blocking it would break a skip link or a "back to top" written as an
        // href. A bare "#" is a placeholder for a page nobody has built.
        if (href.length > 1) return;
        event.preventDefault();
        return;
      }

      if (isAllowed(link)) return;

      event.preventDefault();
    };

    // Same rule for middle-click and ctrl/cmd-click, which open a new tab
    // through a separate event the click handler above never sees.
    const swallowAux = (event) => {
      const link = event.target?.closest?.("a[href], area[href]");
      if (link && !isAllowed(link)) event.preventDefault();
    };

    const swallowSubmit = (event) => event.preventDefault();

    document.addEventListener("click", swallowClick, true);
    document.addEventListener("auxclick", swallowAux, true);
    document.addEventListener("submit", swallowSubmit, true);

    return () => {
      document.removeEventListener("click", swallowClick, true);
      document.removeEventListener("auxclick", swallowAux, true);
      document.removeEventListener("submit", swallowSubmit, true);
    };
  }, []);

  return null;
}
