"use client";

import { useEffect, useRef } from "react";

/**
 * Animated firmness scale drawn in code (client, 27 Nov 2026): the same picture as the
 * firmness video — four red kettlebells on a mattress, Soft → Extra Firm — but sharp at
 * any size. Three weights always rest still in their dips; only Soft bounces, gently,
 * non-stop, like a GIF. The mattress is the same mattress-side strip that sits above the
 * products on the Mattress page (quilted top, black band, grey knit) and that photo
 * itself sinks under the weights. Runs only while on screen.
 */

const W = 1280;
const TOPPAD = 20; // room above so the highest bounce is never cut off
const SURF = 238 + TOPPAD; // top edge of the mattress (flat)
const BORDER_H = 160; // height of the mattress strip
const H = SURF + BORDER_H;
const LABEL_Y = SURF + 142; // on the grey knit
// The strip photo itself gives under the weights (client, 27 Nov 2026): it is drawn in thin
// vertical slices; the quilted top + black band (source rows 0..SQUASH_SRC) squash, the knit stays.
const IMG_W = 2400;
const IMG_H = 380;
const SQUASH_SRC = 236;
const SLICE = 3;
const TILE_W = (IMG_W * BORDER_H) / IMG_H; // one photo repeat, in drawing units
const EXT_TILES = 8; // how many repeats the still strip runs out on each side
const EXT_TOTAL = 2 * EXT_TILES * TILE_W + W;
const CUT_L = ((EXT_TILES * TILE_W + 1) * 100) / EXT_TOTAL; // the still strip stops 1 unit inside the drawing
const CUT_R = ((EXT_TILES * TILE_W + W - 1) * 100) / EXT_TOTAL;
const EDGE = "/pages/home/sizes/mattress-border-profile.webp?v=flush4"; // 2400×380, repeats sideways
const LEVELS = [
  { label: "Soft", depth: 50, spread: 130, wobble: 4, contact: 0.72 },
  { label: "Medium Soft", depth: 36, spread: 100, wobble: 9, contact: 0.3 },
  { label: "Firm", depth: 25, spread: 84, wobble: 11, contact: 0.23 },
  { label: "Extra Firm", depth: 14, spread: 72, wobble: 13, contact: 0.17 },
];
const CX = [160, 480, 800, 1120];
const BELL_BOTTOM = 58; // body centre → flat base
const SINK = 10; // how far the base sits into the material

const G = 360; // "gravity", px/s² — low, so the bounce is slow and gentle
const airTime = (h) => 2 * Math.sqrt((2 * h) / G);
const REST = (i) => ({ lift: 0, dip: LEVELS[i].depth, shadow: 1 });

/** One weight bounces like a ball, non-stop; the other three always sit still in their dips. */
const BOUNCE_H = 72;
function statesAt(time, active) {
  const lv = LEVELS[active];
  const period = airTime(BOUNCE_H) + lv.contact;
  const s = time % period;
  let st;
  if (s < lv.contact) {
    // squashing into the mattress and pushing off again
    st = { lift: 0, dip: lv.depth * 1.4 * Math.sin((Math.PI * s) / lv.contact), shadow: 1 };
  } else {
    const u = s - lv.contact;
    const v0 = Math.sqrt(2 * G * BOUNCE_H);
    const y = v0 * u - (G * u * u) / 2;
    st = { lift: -y, dip: -lv.depth * 0.14 * Math.exp(-6 * u) * Math.sin(lv.wobble * u), shadow: 1 - Math.min(1, y / (BOUNCE_H * 1.15)) };
  }
  return LEVELS.map((_, i) => (i === active ? st : REST(i)));
}

// the dip fades to nothing near the drawing's left/right edges, so it meets the still strip
// beyond them without a step
const EDGE_FADE = 110;
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

function surfaceY(x, states, base) {
  const fade = smooth(Math.min(x, W - x) / EDGE_FADE);
  let y = base;
  for (let i = 0; i < 4; i++) {
    const d = states[i].dip;
    if (!d) continue;
    const u = (x - CX[i]) / LEVELS[i].spread;
    y += d * fade * Math.exp(-u * u * 1.6);
  }
  return y;
}

function Kettlebell({ id, highlight }) {
  return (
    <g>
      {/* handle */}
      <path
        d="M-40 -36 C-60 -94 -48 -122 0 -122 C48 -122 60 -94 40 -36"
        fill="none"
        stroke={`url(#kb-handle-${id})`}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path d="M-30 -60 C-38 -100 -26 -116 0 -117" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
      {/* body — round and stout (client, 27 Nov 2026) */}
      <path d="M-50 52 C-84 36 -86 -26 -48 -46 C-20 -60 20 -60 48 -46 C86 -26 84 36 50 52 Z" fill={`url(#kb-body-${id})`} />
      <ellipse cx="-24" cy="-26" rx="17" ry="11" fill="#fff" opacity="0.55" transform="rotate(-32 -24 -26)" />
      <ellipse cx="-14" cy="-36" rx="5" ry="3.2" fill="#fff" opacity="0.9" transform="rotate(-32 -14 -36)" />
      <path d="M-50 52 H50 L46 58 H-46 Z" fill="#7a0c0a" />
      {highlight ? <circle r="76" cy="-4" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="6 8" opacity="0.9" /> : null}
    </g>
  );
}

export default function FirmnessKettlebells({ highlight }) {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const bellRefs = useRef([]);
  const shadowRefs = useRef([]);
  const hi = LEVELS.findIndex((l) => l.label.toLowerCase() === String(highlight || "").toLowerCase());
  // only Soft bounces; the other three always sit still (client, 27 Nov 2026)
  const active = 0;

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let start = null;
    let paused = 0;

    const img = new window.Image();
    img.src = EDGE;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    const scale = 2; // canvas pixels per viewBox unit (sharp on retina)
    if (cv) {
      cv.width = W * scale;
      cv.height = H * scale;
    }
    const tileW = (IMG_W * BORDER_H) / IMG_H;
    const squashH = (SQUASH_SRC * BORDER_H) / IMG_H;

    const paintStrip = (states) => {
      if (!ctx || !img.complete || !img.naturalWidth) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, SURF - 80, W, H);
      const k = img.naturalWidth / IMG_W;
      for (let x = 0; x < W; x += SLICE) {
        const dip = surfaceY(x + SLICE / 2, states, SURF) - SURF;
        const sx = ((x % tileW) / tileW) * IMG_W;
        const sw = Math.min((SLICE / tileW) * IMG_W, IMG_W - sx);
        const dw = (sw / IMG_W) * tileW + 0.6; // tiny overlap hides seams
        // quilted top + black band: pressed down by the dip
        ctx.drawImage(img, sx * k, 0, sw * k, SQUASH_SRC * k, x, SURF + dip, dw, squashH - dip);
        // grey knit below: unchanged
        ctx.drawImage(img, sx * k, SQUASH_SRC * k, sw * k, (IMG_H - SQUASH_SRC) * k, x, SURF + squashH, dw, BORDER_H - squashH);
      }
    };

    const draw = (time) => {
      const states = statesAt(time, active);
      paintStrip(states);
      states.forEach((s, i) => {
        const sy = surfaceY(CX[i], states, SURF);
        const y = sy + SINK - BELL_BOTTOM + s.lift;
        bellRefs.current[i]?.setAttribute("transform", `translate(${CX[i]} ${y.toFixed(2)})`);
        const sh = shadowRefs.current[i];
        if (sh) {
          // on the quilted top: small and faint while the weight is high, darker and wider as it lands
          const c = s.shadow * s.shadow;
          sh.setAttribute("cy", (sy + 12).toFixed(2));
          sh.setAttribute("opacity", (0.1 + 0.45 * c).toFixed(3));
          sh.setAttribute("rx", (30 + 34 * c).toFixed(1));
          sh.setAttribute("ry", (4 + 4 * c).toFixed(1));
        }
      });
    };

    const loop = (now) => {
      if (start === null) start = now - paused * 1000;
      const t = (now - start) / 1000;
      paused = t;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    img.onload = () => draw(0);
    draw(0);
    if (reduce) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          visible = true;
          start = null;
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.15 },
    );
    if (svgRef.current) io.observe(svgRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div className="w-full overflow-hidden">
      {/* Never taller than the screen leaves room for (heading + header): on short laptop
          screens the drawing narrows a little, and the mattress strip carries on, still, out to
          both screen edges (client, 27 Nov 2026). */}
      <div className="relative mx-auto w-full" style={{ maxWidth: `calc((100svh - 300px) * ${(W / H).toFixed(4)})` }}>
      {/* the strip beyond the drawing, tile-aligned with the animated one so there is no seam */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: `${(SURF / H) * 100}%`,
          height: `${(BORDER_H / H) * 100}%`,
          left: `${-(EXT_TILES * TILE_W * 100) / W}%`,
          width: `${((2 * EXT_TILES * TILE_W + W) * 100) / W}%`,
          backgroundImage: `url("${EDGE}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: `${(TILE_W * 100) / (2 * EXT_TILES * TILE_W + W)}% 100%`,
          backgroundPosition: "0 0",
          // only beyond the drawing: under it the animated strip sinks, and nothing may show behind it
          clipPath: `polygon(0 0, ${CUT_L}% 0, ${CUT_L}% 100%, ${CUT_R}% 100%, ${CUT_R}% 0, 100% 0, 100% 100%, 0 100%)`,
        }}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label={`Firmness scale: Soft, Medium Soft, Firm, Extra Firm${hi >= 0 ? ` — this mattress is ${LEVELS[hi].label}` : ""}`}
      >
        <defs>
          {LEVELS.map((_, i) => (
            <g key={i}>
              <radialGradient id={`kb-body-${i}`} cx="0.34" cy="0.3" r="0.78">
                <stop offset="0" stopColor="#ff6b5c" />
                <stop offset="0.38" stopColor="#e8261e" />
                <stop offset="0.8" stopColor="#b3120f" />
                <stop offset="1" stopColor="#7d0907" />
              </radialGradient>
              <linearGradient id={`kb-handle-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#c5160f" />
                <stop offset="0.35" stopColor="#ff4b3e" />
                <stop offset="1" stopColor="#9d0e0b" />
              </linearGradient>
            </g>
          ))}
          <filter id="kb-shadow" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="kb-soft" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="kb-drop" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#5a0605" floodOpacity="0.28" />
          </filter>
          <filter id="kb-label" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b" />
            <feFlood floodColor="#0c1326" floodOpacity="0.75" />
            <feComposite in2="b" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* contact shadows */}
        {CX.map((x, i) => (
          <ellipse key={i} ref={(el) => (shadowRefs.current[i] = el)} cx={x} cy={SURF + 12} rx="60" ry="8" fill="#141821" opacity="0" filter="url(#kb-shadow)" />
        ))}

        {/* weights */}
        {CX.map((x, i) => (
          <g key={i} ref={(el) => (bellRefs.current[i] = el)} transform={`translate(${x} ${SURF + SINK - BELL_BOTTOM})`} filter="url(#kb-drop)">
            <Kettlebell id={i} highlight={i === hi} />
          </g>
        ))}

        {/* level names on the grey knit */}
        {CX.map((x, i) => (
          <text
            key={i}
            x={x}
            y={LABEL_Y}
            textAnchor="middle"
            fontSize="36"
            fontWeight="800"
            fill={i === hi ? "#ff6a5e" : "#ffffff"}
            filter="url(#kb-label)"
            style={{ letterSpacing: "0.01em" }}
          >
            {LEVELS[i].label}
          </text>
        ))}
      </svg>
      </div>
    </div>
  );
}
