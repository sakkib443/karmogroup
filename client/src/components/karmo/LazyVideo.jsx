"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

/**
 * <video> that waits its turn: pictures first, films after.
 *
 * The file is not requested until BOTH
 *   1. the page has finished loading its pictures (window "load", or 2.5 s at most), and
 *   2. the video is on screen or about to be (within ~300px).
 * Until then the poster shows. Drop-in for <video>: same props, refs still work.
 */
const LazyVideo = forwardRef(function LazyVideo({ src, autoPlay, preload, ...rest }, outerRef) {
  const inner = useRef(null);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);

  const setRef = useCallback(
    (el) => {
      inner.current = el;
      if (typeof outerRef === "function") outerRef(el);
      else if (outerRef) outerRef.current = el;
    },
    [outerRef]
  );

  useEffect(() => {
    if (document.readyState === "complete") { setReady(true); return undefined; }
    const go = () => setReady(true);
    window.addEventListener("load", go, { once: true });
    const t = setTimeout(go, 2500); // never wait longer than this
    return () => { window.removeEventListener("load", go); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const el = inner.current;
    if (!el || near) return undefined;
    if (typeof IntersectionObserver === "undefined") { setNear(true); return undefined; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const live = ready && near;

  // Autoplay films start as soon as their file is let through.
  useEffect(() => {
    const el = inner.current;
    if (live && autoPlay && el) el.play?.().catch(() => {});
  }, [live, autoPlay, src]);

  return (
    <video
      ref={setRef}
      src={live ? src : undefined}
      autoPlay={autoPlay}
      preload={live ? preload || "metadata" : "none"}
      {...rest}
    />
  );
});

export default LazyVideo;
