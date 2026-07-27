"use client";

import { useEffect, useState } from "react";

/**
 * The opening curtain.
 *
 * Deliberately *not* driven by React state or framer-motion. This element
 * covers the whole viewport at z-index 9999, so anything that stops the client
 * bundle from running — a hydration mismatch, a blocked script, a bad dev
 * server — would leave a JS-driven curtain welded shut over the page. So the
 * fade lives in CSS (`lv-preloader-out`, see livora.css) and runs whether or
 * not React ever wakes up.
 *
 * This component's only job afterwards is housekeeping: once the animation has
 * finished, drop the node so a full-screen div is not left in the tree. If that
 * never happens, the CSS has already made it invisible and non-interactive.
 */
const CURTAIN_MS = 1100 + 600;

export default function Preloader() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setCleared(true), CURTAIN_MS + 100);
    return () => clearTimeout(id);
  }, []);

  if (cleared) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div style={{ textAlign: "center" }}>
        <p className="preloader-mark">Karmo</p>
        <span className="preloader-rule" />
        <p className="preloader-note">Comfort since 1965</p>
      </div>
    </div>
  );
}
