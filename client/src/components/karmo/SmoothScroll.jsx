"use client";

import { useEffect } from "react";

/**
 * Eased wheel scrolling, so the page glides to a stop instead of jumping the
 * notch the mouse asked for. It also gives the scroll-triggered reveals a
 * moment to run: the section arrives a fraction after the wheel does, which is
 * the "animate, then scroll" feel rather than content snapping into place.
 *
 * It drives the REAL scroll position with window.scrollTo each frame. The
 * usual approach — pinning the body and translating a wrapper — would be
 * smoother still, but it destroys `position: sticky`, and the four-division
 * deck is built entirely on sticky. It would also confuse every
 * IntersectionObserver on the page, which is what all the reveals use.
 *
 * Wheel only. Touch has its own momentum that is better than anything this
 * could impose, and trackpad users get the same easing through wheel events.
 */

// Share of the remaining distance covered per frame at 60fps. The lower this
// is, the longer the page keeps drifting after the wheel stops.
//
// This was 0.07 — about a second and a half of drift after the last notch.
// That is a lovely long settle to watch and a bad one to aim with: you cannot
// stop on a section, because the page is still moving when you stop turning
// the wheel. 0.18 settles in roughly a third of a second, which still reads as
// eased rather than stepped but puts the page where the hand stopped.
const EASE = 0.18;

// How far one notch of the wheel travels, as a multiple of what the browser
// asked for. Was 1.5, then 1.15 — both sent the page further than the hand
// expected on every notch, which is the other half of not being able to aim.
// At 1 a notch travels exactly what the operating system asked for, and the
// easing alone does the smoothing.
const REACH = 1;

export default function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!fine.matches) return;

    // The storefront's globals.css sets `html { scroll-behavior: smooth }`,
    // and the two cannot both be right. This drives the real scroll position
    // with window.scrollTo once a frame, expecting each call to land instantly
    // — but with CSS smooth scrolling on, the browser animates every one of
    // them instead, so sixty easings a second pile up and fight each other and
    // the page barely moves. Turned off for as long as this is mounted, and
    // put back on the way out so the storefront's anchor links keep it.
    //
    // Anything that genuinely wants an eased jump (the back-to-top button)
    // asks for it per call with `behavior: "smooth"`, which still works.
    const root = document.documentElement;
    const inlineBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let target = window.scrollY;
    let running = false;
    let last = 0;
    let frame = 0;
    // The last position this component itself wrote. Anything that arrives at
    // a different one came from somewhere else — see `onScroll`.
    let written = null;

    const stop = () => {
      cancelAnimationFrame(frame);
      running = false;
      written = null;
      target = window.scrollY;
    };

    const limit = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    // A scroller under the pointer keeps its own wheel — the playlist strip and
    // the lightbox both rely on this. Only counts if it can still move the way
    // the wheel is pushing, so reaching its end hands the page back.
    const nestedScroller = (node, delta) => {
      // Only an Element can be measured. A wheel event can carry the document
      // or the window as its target, and getComputedStyle throws on those —
      // which would abort this handler before it ever called preventDefault,
      // silently taking the easing with it.
      let el = node instanceof Element ? node : null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = getComputedStyle(el);
        if (
          /(auto|scroll|overlay)/.test(style.overflowY) &&
          el.scrollHeight > el.clientHeight
        ) {
          const atTop = el.scrollTop <= 0;
          const atEnd =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
          if (!((delta < 0 && atTop) || (delta > 0 && atEnd))) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const tick = (now) => {
      if (!last) last = now;
      // Frames elapsed rather than a fixed step, so the easing lands the same
      // on a 144Hz screen as on a 60Hz one. Capped so a backgrounded tab does
      // not resume with one enormous jump.
      const elapsed = Math.min((now - last) / 16.667, 3);
      last = now;

      const current = window.scrollY;
      const gap = target - current;

      if (Math.abs(gap) < 0.4) {
        window.scrollTo(0, target);
        written = Math.round(target);
        running = false;
        return;
      }

      window.scrollTo(0, current + gap * (1 - Math.pow(1 - EASE, elapsed)));
      written = Math.round(window.scrollY);
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event) => {
      if (event.ctrlKey) return; // pinch zoom
      if (document.body.style.overflow === "hidden") return; // lightbox is up
      if (nestedScroller(event.target, event.deltaY)) return;

      event.preventDefault();

      // Firefox reports lines, and some setups report pages.
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;

      target = Math.max(
        0,
        Math.min(limit(), target + event.deltaY * unit * REACH),
      );

      if (!running) {
        running = true;
        last = 0;
        written = null;
        frame = requestAnimationFrame(tick);
      }
    };

    /**
     * Anything that moves the page by other means — the scrollbar, the
     * keyboard, back-to-top, an anchor — has to be handed control.
     *
     * The old version only re-seeded `target` when the loop was idle, which
     * left a hole: for as long as a wheel scroll was still easing out, a drag
     * on the scrollbar was ignored, and every frame the loop pulled the page
     * back toward the position the wheel had asked for. Dropping the thumb
     * halfway down the page put you somewhere else entirely, because the two
     * were writing `scrollY` against each other.
     *
     * So the test is not "is the loop running" but "did *this* put the page
     * here": the tick records every position it writes, and a scroll event
     * that reports something else came from the reader. That gives the page
     * straight back to them — mid-easing or not.
     */
    const onScroll = () => {
      if (running && written !== null) {
        if (Math.abs(Math.round(window.scrollY) - written) > 2) stop();
        return;
      }
      if (!running) target = window.scrollY;
    };

    // Grabbing the scrollbar, or a middle-click autoscroll, moves the page
    // without a wheel event. Stopping on the press means the easing is already
    // out of the way before the drag starts, rather than being caught by
    // `onScroll` a frame later.
    const onPointerDown = () => {
      if (running) stop();
    };

    const onResize = () => {
      target = Math.min(target, limit());
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = inlineBehavior;
    };
  }, []);

  return null;
}
