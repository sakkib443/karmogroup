"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The trailing cursor from the reference build (`magiccursor.js`), rewritten
 * without jQuery.
 *
 * Two layers: a hard dot that tracks the pointer exactly, and a ring that
 * chases it with a bit of lag. The ring swells over anything interactive, so
 * hit targets announce themselves before the click.
 *
 * Only mounts for devices that actually have a fine pointer — on touch there
 * is no cursor to decorate, and the listeners would be pure overhead.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    // Read on the next frame rather than synchronously in the effect body —
    // the cursor is decorative, so a frame's delay costs nothing, and it keeps
    // the mount from cascading an extra render.
    const raf = requestAnimationFrame(() => setEnabled(fine.matches));

    const onChange = (e) => setEnabled(e.matches);
    fine.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      fine.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Positions live in refs and are written straight to `transform`. Routing
    // 60fps of pointer movement through React state would re-render the whole
    // page on every mouse move.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { ...target };
    let frame = 0;
    let visible = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }

      // `closest` rather than a tag check: the pointer is usually over a span
      // or an icon inside the link, not the link itself.
      const interactive = e.target?.closest?.(
        'a, button, input, select, textarea, [role="button"]'
      );
      ring.current?.classList.toggle("scale-[2.2]", Boolean(interactive));
      ring.current?.classList.toggle("bg-luxe-gold/15", Boolean(interactive));
    };

    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };

    const tick = () => {
      // Exponential ease — the ring covers 18% of the remaining gap each frame,
      // which reads as weight rather than as a fixed delay.
      eased.x += (target.x - eased.x) * 0.18;
      eased.y += (target.y - eased.y) * 0.18;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-1.5 w-1.5 rounded-full bg-luxe-gold opacity-0 transition-opacity duration-300"
      />
      <div
        ref={ring}
        aria-hidden="true"
        // `scale` is transitioned, not `transform` — the transform is rewritten
        // every frame by the tracking loop, and transitioning it would fight
        // the easing already applied there.
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-luxe-gold/60 opacity-0 transition-[opacity,scale,background-color] duration-300 ease-out"
      />
    </>
  );
}
