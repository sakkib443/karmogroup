"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The trailing cursor, built on the two-layer idea from Home 02 — a hard dot on
 * the pointer and a ring chasing it — with three things added:
 *
 *   Magnetic pull. Over a button or a link the ring eases towards the middle of
 *   that element instead of the pointer, so hit targets pick the ring up as it
 *   passes. Only for targets under 260px; on a wide banner link the pull would
 *   drag the ring somewhere the pointer plainly is not.
 *
 *   Weight. The ring stretches along its direction of travel and settles back
 *   when it stops, which is what makes it read as a physical object rather than
 *   a shape being redrawn.
 *
 *   Press. It contracts under a click, so the page answers the mouse down as
 *   well as the mouse up.
 *
 * Only mounts for devices with a fine pointer and no reduced-motion request —
 * on touch there is no cursor to decorate and the listeners are pure overhead.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    // Read on the next frame rather than synchronously in the effect body — the
    // cursor is decorative, so a frame costs nothing and the mount does not
    // cascade an extra render.
    const raf = requestAnimationFrame(() => setEnabled(fine.matches));

    const onChange = (event) => setEnabled(event.matches);
    fine.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      fine.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Positions live in refs and are written straight to `transform`. Routing
    // 60fps of pointer movement through React state would re-render the page on
    // every mouse move.
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const eased = { ...pointer };
    const pull = { x: pointer.x, y: pointer.y };

    let frame = 0;
    let hovering = false;
    let pressed = false;
    let shown = false;

    // The native arrow is only taken away once this is confirmed running, so a
    // script that never starts can never leave the page with no cursor at all.
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!shown) {
        shown = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }

      // `closest` rather than a tag check: the pointer is usually over a span or
      // an icon inside the link, not the link element itself.
      const hit = event.target?.closest?.(
        'a, button, input, select, textarea, [role="button"]',
      );

      hovering = Boolean(hit);
      pull.x = pointer.x;
      pull.y = pointer.y;

      if (hit) {
        const box = hit.getBoundingClientRect();
        if (box.width < 260 && box.height < 260) {
          // Two fifths of the way to the middle: enough to feel picked up,
          // little enough that the ring never leaves the pointer behind.
          pull.x += (box.left + box.width / 2 - pointer.x) * 0.4;
          pull.y += (box.top + box.height / 2 - pointer.y) * 0.4;
        }
      }
    };

    const hide = () => {
      shown = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };

    const down = () => (pressed = true);
    const up = () => (pressed = false);

    const tick = () => {
      // Exponential ease — the ring covers a share of the remaining gap each
      // frame, which reads as weight rather than as a fixed delay.
      eased.x += (pull.x - eased.x) * 0.16;
      eased.y += (pull.y - eased.y) * 0.16;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${pressed ? 0.6 : 1})`;
      }

      if (ring.current) {
        const vx = pull.x - eased.x;
        const vy = pull.y - eased.y;
        const speed = Math.hypot(vx, vy);

        // Stretch along the direction of travel, capped so a fast flick across
        // the page does not smear the ring into a line.
        const stretch = Math.min(speed / 90, 0.32) * (hovering ? 0.4 : 1);
        const angle = speed > 0.1 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0;
        const base = hovering ? 2.1 : 1;
        const press = pressed ? 0.78 : 1;

        ring.current.style.transform =
          `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)` +
          ` rotate(${angle}deg) scale(${base * press * (1 + stretch)}, ${base * press * (1 - stretch * 0.65)})`;
        ring.current.style.backgroundColor = hovering
          ? "rgba(230, 0, 0, 0.12)"
          : "transparent";
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", hide);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", hide);
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10060] h-1.5 w-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300"
      />
      <div
        ref={ring}
        aria-hidden="true"
        // Only opacity and colour are transitioned. The transform is rewritten
        // every frame by the loop above, and a transition on it would fight the
        // easing already applied there.
        className="pointer-events-none fixed left-0 top-0 z-[10060] h-9 w-9 rounded-full border border-brand/70 opacity-0 transition-[opacity,background-color] duration-300 ease-out"
      />
    </>
  );
}
