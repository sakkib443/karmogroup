"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { FiLayers } from "react-icons/fi";

import { layersFor } from "@/components/karmo/product/mattressLayers";

/**
 * Inside the mattress — a realistic, always-open exploded view of the product's own
 * layers (mattressLayers.js, from the Karmo brochure), drawn like a studio cut-away:
 * a thin quilted fabric sheet and padding on top, the foam / spring core, and the quilted
 * border-and-base tray it sits in (spring mattresses: thick panels with a knitted border).
 * Materials carry real grain (SVG noise filters): rebonded foam chips, felt fibre, PU
 * foam air holes, pocketed coils, steel Bonnell coils.
 *
 * Desktop: names on the right with red leader lines and numbered boxes.
 * Phones: numbered pins on the drawing, the list underneath. Hover/tap lights a layer.
 */

const COS = 0.866;
const SIN = 0.5;
const A = 400; // slab length (drawing units)
const B = 250; // slab depth
const R = 20; // rounded corner radius
const GAP = 34; // space between layers
const PAD_TOP = 34;
const PAD_BOTTOM = 64;
const OX = 34 + B * COS;
const LABEL_X = 660;
const VB_W = 1000;
const COMPACT_W = 690;
const MIN_LABEL_GAP = 70;
const BRAND = "#D44348";

/* Base colour + grain for foam-type parts (filters in <Defs>). */
const FOAM = {
  soft: { fill: "#eadcb8", grain: "pores", holes: true },
  visco: { fill: "#c3d2e2", grain: "pores" },
  foam25: { fill: "#e4dccb", grain: "pores" },
  hd: { fill: "#d9ccb0", grain: "pores" },
  felt: { fill: "#77797e", grain: "felt" },
  rebond: { fill: "#9c96a0", grain: "chips" },
  pe: { fill: "#e3e4e6", grain: "fine" },
  padding: { fill: "#fbfbf9", grain: "cloud", side: "#ecebe8" },
  fibre: { fill: "#f8f7f4", grain: "cloud" },
};

const f1 = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");

/* Rounded-rectangle outline of a part, clockwise, in plan (x along A, y along B). */
function outline(inset = 0, r = R, seg = 7) {
  const x0 = inset;
  const y0 = inset;
  const x1 = A - inset;
  const y1 = B - inset;
  const corners = [
    [x1 - r, y0 + r, -90],
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, 90],
    [x0 + r, y0 + r, 180],
  ];
  const out = [];
  corners.forEach(([cx, cy, a0]) => {
    for (let s = 0; s <= seg; s += 1) {
      const a = ((a0 + (90 * s) / seg) * Math.PI) / 180;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  });
  return out;
}

/* Front (visible) and back halves of an outline, split at its left- and right-most points on screen. */
function halves(ring) {
  let iMax = 0;
  let iMin = 0;
  ring.forEach(([x, y], i) => {
    if (x - y > ring[iMax][0] - ring[iMax][1]) iMax = i;
    if (x - y < ring[iMin][0] - ring[iMin][1]) iMin = i;
  });
  return { front: ring.slice(iMax, iMin + 1), back: [...ring.slice(iMin), ...ring.slice(0, iMax + 1)] };
}

const wall = (chain, at, z0, z1) => [
  ...chain.map(([x, y]) => at(x, y, z1)),
  ...[...chain].reverse().map(([x, y]) => at(x, y, z0)),
];

function shape(at, z, t, inset = 0, r = R) {
  const ring = outline(inset, r);
  const { front, back } = halves(ring);
  return {
    top: ring.map(([x, y]) => at(x, y, z + t)),
    side: wall(front, at, z, z + t),
    backSide: wall(back, at, z, z + t),
    floor: ring.map(([x, y]) => at(x, y, z)),
    edgeTop: front.map(([x, y]) => at(x, y, z + t)),
    edgeBottom: front.map(([x, y]) => at(x, y, z)),
  };
}

function layout(layers) {
  const n = layers.length;
  const z = new Array(n);
  let h = 0;
  for (let k = n - 1; k >= 0; k -= 1) {
    z[k] = h;
    const springy = layers[k].mat === "bonnell" || layers[k].mat === "pocket" || layers[k - 1]?.mat === "bonnell" || layers[k - 1]?.mat === "pocket";
    const tray = layers[k].mat === "tray";
    h += layers[k].t + (k > 0 ? GAP * (springy ? 1.5 : tray ? 1.9 : 1) : 0);
  }
  const oy = PAD_TOP + h;
  const vbH = Math.round(oy + (A + B) * SIN + PAD_BOTTOM);
  const at = (x, y, zz) => [OX + (x - y) * COS, oy + (x + y) * SIN - zz];
  const anchors = layers.map((l, i) => at(A - R * 0.3, R * 0.3, z[i] + l.t / 2));
  const ly = anchors.map((p) => p[1]);
  for (let i = 1; i < n; i += 1) if (ly[i] - ly[i - 1] < MIN_LABEL_GAP) ly[i] = ly[i - 1] + MIN_LABEL_GAP;
  const over = ly[n - 1] - (vbH - 34);
  if (over > 0) for (let i = 0; i < n; i += 1) ly[i] -= over;
  return { z, vbH, at, anchors, ly };
}

const OPEN_DELAY = 0.6;
const OPEN_STAGGER = 0.09;
const LIFT = 0.55; // the shut mattress rises off the bed before it opens
const EASE = [0.22, 1, 0.36, 1];
const labelDelay = (i) => OPEN_DELAY + LIFT + 1.5 + i * 0.09;

/* ── Textures, light and shadow (ids unique per drawing) ───────────────────────── */
function Defs({ p, fabric }) {
  const topT = `matrix(${COS} ${SIN} ${-COS} ${SIN} 0 0)`;
  const leftX = OX + (R * 0.3 - (B - R * 0.3)) * COS;
  const rightX = OX + A * COS;
  const grain = (id, { bf, oct = 2, seed = 2, mode = "soft-light" }) => (
    <filter id={`${p}-${id}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={bf} numOctaves={oct} seed={seed} result="n" />
      <feColorMatrix in="n" type="saturate" values="0" result="g" />
      <feBlend in="g" in2="SourceGraphic" mode={mode} result="b" />
      <feComposite in="b" in2="SourceGraphic" operator="in" />
    </filter>
  );
  return (
    <defs>
      <pattern id={`${p}-fab`} patternUnits="userSpaceOnUse" width="110" height="110" patternTransform={topT}>
        <image href={fabric} width="110" height="110" preserveAspectRatio="xMidYMid slice" />
      </pattern>
      <pattern id={`${p}-fab-s`} patternUnits="userSpaceOnUse" width="110" height="110">
        <image href={fabric} width="110" height="110" preserveAspectRatio="xMidYMid slice" />
      </pattern>
      {/* Quilting: stitched diamonds, a tuft at each crossing, soft puffs between. */}
      <radialGradient id={`${p}-puff-g`}>
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.12" />
      </radialGradient>
      <pattern id={`${p}-quilt`} patternUnits="userSpaceOnUse" width="40" height="40" patternTransform={topT}>
        <circle cx="20" cy="20" r="20" fill={`url(#${p}-puff-g)`} />
        <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeDasharray="1.8 2.2" />
        <circle cx="20" cy="0" r="1.6" fill="rgba(60,40,20,0.3)" />
        <circle cx="0" cy="20" r="1.6" fill="rgba(60,40,20,0.3)" />
      </pattern>
      <pattern id={`${p}-quilt-big`} patternUnits="userSpaceOnUse" width="54" height="54" patternTransform={topT}>
        <circle cx="27" cy="27" r="27" fill={`url(#${p}-puff-g)`} />
        <circle cx="27" cy="27" r="21" fill={`url(#${p}-puff-g)`} />
        <path d="M0 27 L27 0 L54 27 L27 54 Z" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="2 2.4" />
      </pattern>
      {/* Knitted border fabric for the thick spring-mattress panels. */}
      <pattern id={`${p}-knit`} patternUnits="userSpaceOnUse" width="12" height="9">
        <path d="M0 4.5 L6 0 L12 4.5 L6 9 Z" fill="none" stroke="rgba(120,115,105,0.28)" strokeWidth="0.8" />
        <circle cx="6" cy="4.5" r="0.9" fill="rgba(120,115,105,0.25)" />
      </pattern>
      {/* PU foam air holes. */}
      <pattern id={`${p}-holes`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform={topT}>
        <circle cx="8" cy="8" r="2.1" fill="rgba(110,80,35,0.32)" />
        <circle cx="8.6" cy="8.6" r="1.2" fill="rgba(80,55,20,0.25)" />
      </pattern>

      {/* Light from the back-left; sides darken towards the right. */}
      <linearGradient id={`${p}-toplight`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.24" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.07" />
      </linearGradient>
      <linearGradient id={`${p}-sideshade`} gradientUnits="userSpaceOnUse" x1={f1(leftX)} y1="0" x2={f1(rightX)} y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.04" />
        <stop offset={A / (A + B)} stopColor="#000" stopOpacity="0.13" />
        <stop offset="1" stopColor="#000" stopOpacity="0.32" />
      </linearGradient>

      {grain("pores", { bf: 0.45, seed: 3 })}
      {grain("fine", { bf: 0.9, seed: 5 })}
      {grain("felt", { bf: "1.1 0.6", oct: 3, seed: 8, mode: "overlay" })}
      {grain("cloud", { bf: 0.05, oct: 3, seed: 11 })}
      {/* Rebonded foam: small chips of recycled foam — dark, white, purple, yellow. */}
      <filter id={`${p}-chips`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="2" seed="21" result="n" />
        <feComponentTransfer in="n" result="c">
          <feFuncR type="discrete" tableValues="0.22 0.92 0.48 0.88 0.30 0.80 0.62 0.95" />
          <feFuncG type="discrete" tableValues="0.21 0.90 0.42 0.80 0.29 0.78 0.52 0.93" />
          <feFuncB type="discrete" tableValues="0.24 0.88 0.56 0.52 0.33 0.80 0.66 0.92" />
          <feFuncA type="linear" slope="0" intercept="1" />
        </feComponentTransfer>
        <feColorMatrix in="c" type="saturate" values="0.35" result="cs" />
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="m0" />
        <feColorMatrix in="m0" type="saturate" values="0" result="m" />
        <feBlend in="m" in2="cs" mode="soft-light" result="cm" />
        <feComposite in="cm" in2="SourceGraphic" operator="in" />
      </filter>

      <linearGradient id={`${p}-cyl`} x1="0" x2="1">
        <stop offset="0" stopColor="#c9d3dc" />
        <stop offset="0.4" stopColor="#f6f8fa" />
        <stop offset="1" stopColor="#aebbc8" />
      </linearGradient>
      <filter id={`${p}-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter id={`${p}-drop`} x="-10%" y="-10%" width="120%" height="140%">
        <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#3a2a18" floodOpacity="0.16" />
      </filter>
    </defs>
  );
}

/* ── Parts ─────────────────────────────────────────────────────────────────────── */
function Finish({ p, s, rim = 0.5 }) {
  return (
    <>
      <polygon points={pts(s.side)} fill={`url(#${p}-sideshade)`} />
      <polygon points={pts(s.top)} fill={`url(#${p}-toplight)`} />
      <polyline points={pts(s.edgeTop)} fill="none" stroke={`rgba(255,255,255,${rim})`} strokeWidth="1.2" strokeLinejoin="round" />
      <polyline points={pts(s.edgeBottom)} fill="none" stroke="rgba(30,20,10,0.22)" strokeWidth="0.9" strokeLinejoin="round" />
    </>
  );
}

/* Thin quilted fabric sheet. */
function QuiltSheet({ p, at, z, layer }) {
  const s = shape(at, z, layer.t);
  return (
    <g>
      <polygon points={pts(s.side)} fill={`url(#${p}-fab-s)`} />
      <polygon points={pts(s.top)} fill={`url(#${p}-fab)`} />
      <polygon points={pts(s.top)} fill={`url(#${p}-quilt)`} />
      <Finish p={p} s={s} rim={0.8} />
    </g>
  );
}

/* Thick quilted panel with a knitted border (spring mattresses, euro / pillow top). */
function Panel({ p, at, z, layer }) {
  const pillow = layer.mat === "pillowtop";
  const s = shape(at, z, layer.t, pillow ? 10 : 0);
  return (
    <g>
      <polygon points={pts(s.side)} fill="#f1efea" />
      <polygon points={pts(s.side)} fill={`url(#${p}-knit)`} />
      <polygon points={pts(s.top)} fill={`url(#${p}-fab)`} />
      <polygon points={pts(s.top)} fill={`url(#${p}-${pillow ? "quilt-big" : "quilt"})`} />
      <Finish p={p} s={s} />
      {/* Taped edges. */}
      <polyline points={pts(s.edgeTop)} fill="none" stroke="#fbfaf6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts(s.edgeTop)} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" transform="translate(0 2)" />
      <polyline points={pts(s.edgeBottom)} fill="none" stroke="#f3f1ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/* Quilted border-and-base: an open tray the core sits in. */
function Tray({ p, at, z, layer }) {
  const h = layer.t;
  const wallT = 7;
  const outer = outline(0);
  const inner = outline(wallT, R - wallT * 0.6);
  const O = halves(outer);
  const I = halves(inner);
  const floor = inner.map(([x, y]) => at(x, y, z + 3));
  const innerBack = wall(I.back, at, z + 3, z + h);
  const outerFront = wall(O.front, at, z, z + h);
  const rimPath = `M${pts(outer.map(([x, y]) => at(x, y, z + h)))
    .split(" ")
    .join(" L")} Z M${pts([...inner].reverse().map(([x, y]) => at(x, y, z + h)))
    .split(" ")
    .join(" L")} Z`;
  const edgeTop = O.front.map(([x, y]) => at(x, y, z + h));
  const edgeBottom = O.front.map(([x, y]) => at(x, y, z));
  return (
    <g>
      <g filter={`url(#${p}-cloud)`}>
        <polygon points={pts(floor)} fill="#f7f6f2" />
      </g>
      <polygon points={pts(innerBack)} fill="#ebe8e2" />
      <polygon points={pts(innerBack)} fill="rgba(0,0,0,0.06)" />
      <polygon points={pts(outerFront)} fill={`url(#${p}-fab-s)`} />
      <polygon points={pts(outerFront)} fill={`url(#${p}-sideshade)`} />
      <path d={rimPath} fill={`url(#${p}-fab)`} fillRule="evenodd" />
      <path d={rimPath} fill="rgba(255,255,255,0.35)" fillRule="evenodd" />
      <polyline points={pts(edgeTop)} fill="none" stroke="#fbfaf6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts(edgeBottom)} fill="none" stroke="#f1eee8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function FoamSlab({ p, at, z, layer }) {
  const m = FOAM[layer.mat] || FOAM.soft;
  const s = shape(at, z, layer.t);
  return (
    <g>
      <g filter={`url(#${p}-${m.grain})`}>
        <polygon points={pts(s.side)} fill={m.side || m.fill} />
        <polygon points={pts(s.top)} fill={m.fill} />
      </g>
      {m.holes ? <polygon points={pts(s.top)} fill={`url(#${p}-holes)`} /> : null}
      <Finish p={p} s={s} />
    </g>
  );
}

function BonnellSlab({ at, z, layer }) {
  const t = layer.t;
  const nx = 7;
  const ny = 4;
  const coils = [];
  for (let i = 0; i < nx; i += 1)
    for (let j = 0; j < ny; j += 1) coils.push([(A * (i + 0.5)) / nx, (B * (j + 0.5)) / ny]);
  coils.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const wireRing = (zz) => outline(5, 10).map(([x, y]) => at(x, y, zz));
  const helix = ([cx, cy]) => {
    const steps = 72;
    const turns = 4.5;
    const out = [];
    for (let s = 0; s <= steps; s += 1) {
      const hh = s / steps;
      const th = hh * turns * Math.PI * 2;
      const rr = 19 * (0.42 + 0.58 * Math.abs(2 * hh - 1));
      out.push(at(cx + rr * Math.cos(th), cy + rr * Math.sin(th), z + 3 + hh * (t - 6)));
    }
    return pts(out);
  };
  return (
    <g>
      <polygon points={pts(wireRing(z + 2))} fill="rgba(60,64,70,0.05)" stroke="#4a5058" strokeWidth="2.6" strokeLinejoin="round" />
      {coils.map((c, i) => (
        <g key={i}>
          <polyline points={helix(c)} fill="none" stroke="#2f343a" strokeWidth="2.6" strokeLinejoin="round" />
          <polyline points={helix(c)} fill="none" stroke="#a9b0b8" strokeWidth="1.1" strokeLinejoin="round" />
        </g>
      ))}
      <polygon points={pts(wireRing(z + t - 2))} fill="none" stroke="#2f343a" strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points={pts(wireRing(z + t - 2))} fill="none" stroke="#c3c9cf" strokeWidth="0.9" strokeLinejoin="round" />
    </g>
  );
}

function PocketSlab({ p, at, z, layer }) {
  const t = layer.t;
  const s = shape(at, z, t);
  const nx = 10;
  const ny = 6;
  const m = 16;
  const cells = [];
  for (let i = 0; i < nx; i += 1)
    for (let j = 0; j < ny; j += 1)
      cells.push([m + ((A - 2 * m) * (i + 0.5)) / nx, m + ((B - 2 * m) * (j + 0.5)) / ny]);
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const rx = 14.5;
  const ry = 8.4;
  const foam = FOAM.foam25.fill;
  return (
    <g>
      <g filter={`url(#${p}-pores)`}>
        <polygon points={pts(s.floor)} fill="#ddd4c2" />
        <polygon points={pts(s.backSide)} fill={foam} />
      </g>
      <polygon points={pts(s.backSide)} fill="rgba(0,0,0,0.08)" />
      {cells.map(([cx, cy], i) => {
        const [bx, by] = at(cx, cy, z + 4);
        const [, ty] = at(cx, cy, z + t - 4);
        return (
          <g key={i}>
            <path
              d={`M${f1(bx - rx)} ${f1(ty)} V${f1(by)} A${rx} ${ry} 0 0 0 ${f1(bx + rx)} ${f1(by)} V${f1(ty)} Z`}
              fill={`url(#${p}-cyl)`}
              stroke="rgba(80,95,110,0.3)"
              strokeWidth="0.6"
            />
            <ellipse cx={f1(bx)} cy={f1(ty)} rx={rx} ry={ry} fill="#fbfcfd" stroke="rgba(80,95,110,0.35)" strokeWidth="0.6" />
            <ellipse cx={f1(bx - 2)} cy={f1(ty - 1)} rx={rx * 0.5} ry={ry * 0.42} fill="rgba(160,175,190,0.22)" />
          </g>
        );
      })}
      <polygon points={pts(s.side)} fill={foam} opacity="0.34" />
      <polygon points={pts(s.side)} fill={`url(#${p}-sideshade)`} opacity="0.6" />
      <polyline points={pts(s.edgeTop)} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />
      <polyline points={pts(s.edgeBottom)} fill="none" stroke="rgba(30,20,10,0.22)" strokeWidth="0.9" />
    </g>
  );
}

function Part(props) {
  const { mat } = props.layer;
  if (mat === "quilt") return <QuiltSheet {...props} />;
  if (mat === "panel" || mat === "pillowtop") return <Panel {...props} />;
  if (mat === "tray") return <Tray {...props} />;
  if (mat === "bonnell") return <BonnellSlab {...props} />;
  if (mat === "pocket") return <PocketSlab {...props} />;
  return <FoamSlab {...props} />;
}

/* ── The drawing ───────────────────────────────────────────────────────────────── */
function Stack({ layers, fabric, active, setActive, compact, animate = false, open = true, slug, front }) {
  if (animate) return <AssembleStack layers={layers} fabric={fabric} active={active} setActive={setActive} compact={compact} open={open} slug={slug} front={front} />;
  return <StaticStack layers={layers} fabric={fabric} active={active} setActive={setActive} compact={compact} />;
}

const BED_FRAME = "/products/mattress/bed/bed-frame.webp";
const BED_REST_SCALE = 1.22; // the bed before it opens, larger than the opened mattress
const BED_MATTRESS = "/products/mattress/bed/bed-mattress.webp";
/* Same mattress with the pillow edges taken off its top, for the lifted-off quilt layer. */
const BED_MATTRESS_TOP = "/products/mattress/bed/bed-mattress-clean.webp";
/* Each mattress in the colour of its own card photo: the same bed photo, its mattress
   re-covered in that product's fabric (client, 27 Nov 2026). The photo itself is Imperial's
   navy floral. `rim` colours the border-and-base tray's top edge. */
const BED_COVERS = {
  "imperial-eurotop": { full: BED_MATTRESS, top: BED_MATTRESS_TOP, rim: "#1f2d5c" },
  king: {
    full: "/products/mattress/bed/bed-mattress-king-v2.webp",
    top: "/products/mattress/bed/bed-mattress-king-v2-top.webp",
    rim: "#1d2f7a",
  },
  prestige: { rim: "#9a6a6e" },
  orthopedic: { rim: "#6b4a3f" },
  "bonnell-spring": { rim: "#9e3434" },
  "pillow-top-pocket-spring": { rim: "#3d7c88" },
  "euro-top-pocket-spring": { rim: "#76736b" },
  topper: { rim: "#b3a7a9" },
};
function bedCover(slug) {
  const c = BED_COVERS[slug];
  if (!c) return BED_COVERS["imperial-eurotop"];
  return {
    full: c.full || `/products/mattress/bed/bed-mattress-${slug}.webp`,
    top: c.top || `/products/mattress/bed/bed-mattress-${slug}-top.webp`,
    rim: c.rim,
  };
}

/* ── Front view, built on the client's bed photo (27 Nov 2026) ─────────────────────
   Photo box: 932 × 566 (bed-frame / bed-mattress.webp). In it the mattress top is a
   trapezoid from y 216 (x 178–752) to y 388 (x 22–908); the front band runs 388–482
   (top piping 388–404, then the border down to the base). Every layer is drawn in that
   same view, so the photo's mattress itself opens: its quilted top lifts off, its
   border-and-base stays below, and the inner parts come out between them. */
const PH_W = 932;
const PH_H = 566;
const TOP_Y = 216;
const TOP_D = 172; // depth of the top face on screen
const BAND_Y = 404; // under the top piping
const BAND_END = 482;
const LIFT_L = 0.14 * PH_H; // how far the mattress rises off the bed (photo px)
const F_GAP = 62; // desktop (phones: 56)
const LABEL_XF = 712;
const LABEL_GAP_F = 86; // names spaced well apart

const trap = (y) => [
  [178, y],
  [752, y],
  [908, y + TOP_D],
  [22, y + TOP_D],
];

/* Round the corners of a polygon (quadratic fillets), radii per corner. */
function roundCorners(list, radii, seg = 7) {
  const out = [];
  const N = list.length;
  for (let k = 0; k < N; k += 1) {
    const P = list[k];
    const A = list[(k + N - 1) % N];
    const B = list[(k + 1) % N];
    const r = radii[k];
    const ua = [A[0] - P[0], A[1] - P[1]];
    const ub = [B[0] - P[0], B[1] - P[1]];
    const la = Math.hypot(...ua);
    const lb = Math.hypot(...ub);
    const a0 = [P[0] + (ua[0] / la) * r, P[1] + (ua[1] / la) * r];
    const b0 = [P[0] + (ub[0] / lb) * r, P[1] + (ub[1] / lb) * r];
    for (let j = 0; j <= seg; j += 1) {
      const t = j / seg;
      out.push([
        (1 - t) * (1 - t) * a0[0] + 2 * (1 - t) * t * P[0] + t * t * b0[0],
        (1 - t) * (1 - t) * a0[1] + 2 * (1 - t) * t * P[1] + t * t * b0[1],
      ]);
    }
  }
  return out;
}

/* A soft slab seen from above-front: rounded top face, and a front face whose ends curve
   round with the corners. `inset` shrinks the outline (for a box's inner rim). */
const SEG = 7;
function slab(y, t, inset = 0) {
  const c = [
    [178 + inset * 0.7, y + inset * 0.55],
    [752 - inset * 0.7, y + inset * 0.55],
    [908 - inset, y + TOP_D - inset * 0.45],
    [22 + inset, y + TOP_D - inset * 0.45],
  ];
  const top = roundCorners(c, [16, 16, 26, 26], SEG);
  const per = SEG + 1;
  const curve = [...top.slice(2 * per, 4 * per)].reverse(); // left end → front edge → right end
  const front = [...curve, ...[...curve].reverse().map(([x, yy]) => [x, yy + t])];
  return { top, curve, front, bottom: curve.map(([x, yy]) => [x, yy + t]) };
}

function frontThickness(layer, i, n, front) {
  const own = front?.thickness?.[i];
  if (own) return own;
  if (i === 0 && (layer.mat === "quilt" || layer.mat === "panel" || layer.mat === "pillowtop")) return BAND_Y - TOP_Y - TOP_D;
  if (i === n - 1 && (layer.mat === "tray" || layer.mat === "panel")) return BAND_END - BAND_Y;
  // Same thickness as in the drawing above, at this view's scale (562 drawing units wide → 886 here).
  return Math.max(6, Math.round(layer.t * 1.58));
}

/* Where everything sits, in the section drawing's units (vbW × vbH). */
export function frontLayout(layers, vbW, vbH, compact, front) {
  const n = layers.length;
  const ft = layers.map((l, i) => frontThickness(l, i, n, front));
  const rel = [0];
  const gap = compact ? 56 : F_GAP;
  for (let i = 1; i < n; i += 1) rel[i] = rel[i - 1] + ft[i - 1] + (i === n - 1 && front?.baseGap ? front.baseGap : gap);
  const span = rel[n - 1] + TOP_D + ft[n - 1];
  const closedTop = TOP_Y - LIFT_L;
  const closedBase = BAND_Y - TOP_D - LIFT_L;
  const mid = (TOP_Y + BAND_END) / 2 - LIFT_L;
  const y0 = mid - span / 2;
  const openY = rel.map((r) => y0 + r);
  const closedY = openY.map((_, i) => (i === 0 ? closedTop : i === n - 1 ? closedBase : closedTop + ((closedBase - closedTop) * i) / (n - 1)));
  const k = compact ? (vbW - 20) / PH_W : 0.74;
  const X0 = compact ? 10 : 4;
  const lo = Math.min(y0, 8);
  const hi = Math.max(y0 + span, PH_H - 6);
  const Y0 = vbH / 2 - (k * (lo + hi)) / 2;
  const toX = (x) => X0 + x * k;
  const toY = (y) => Y0 + y * k;
  const sc = layers.map((_, i) => (i === 0 ? 1 : i === n - 1 ? 1.035 : 0.955));
  const anchors = openY.map((y, i) => [toX(465 + 435 * sc[i]), toY(y + TOP_D + ft[i] / 2)]);
  const ly = anchors.map((a) => a[1]);
  // A label with the cover's four parts is taller than a one-line name.
  // Each name's title sits on its leader; the four parts hang below it.
  const below = (i) => (front?.labels?.[i]?.parts ? 150 : 26);
  for (let i = 1; i < n; i += 1) {
    const need = front?.labels ? Math.max(66, below(i - 1) + 40) : LABEL_GAP_F;
    if (ly[i] - ly[i - 1] < need) ly[i] = ly[i - 1] + need;
  }
  const blockTop = ly[0] - (front?.labels ? 22 : 0);
  const blockBottom = ly[n - 1] + (front?.labels ? below(n - 1) : 0);
  const spill = (blockTop + blockBottom) / 2 - (anchors[0][1] + anchors[n - 1][1]) / 2;
  for (let i = 0; i < n; i += 1) ly[i] -= spill; // keep the list centred on the parts
  return { ft, openY, closedY, k, X0, Y0, toX, toY, anchors, ly, sc };
}

/* The border-and-base as an open box, seen from above-front: fabric walls with a white
   piped rim, pale inner walls and a white floor the other parts rise out of. */
function TrayBox({ p, y, depth = 46 }) {
  const outer = slab(y, 0).top;
  const rim = slab(y, 0, 13);
  const inn = rim.top;
  const d = depth; // how deep the floor sits below the rim, on screen
  const floor = slab(y + d, 0, 15).top;
  return (
    <g>
      {/* rim: the quilted wall's top, finished with a round white piping cord */}
      <polygon points={pts(outer)} fill="#efece6" />
      {/* inside: the walls fall away to a white floor */}
      <polygon points={pts(inn)} fill={`url(#${p}-fwall)`} />
      <polygon points={pts(floor)} fill={`url(#${p}-ffloor)`} />
      <polygon points={pts(inn)} fill="none" stroke="rgba(60,45,30,0.28)" strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points={pts(outer)} fill="none" stroke="rgba(40,30,20,0.25)" strokeWidth="7" strokeLinejoin="round" transform="translate(0 1.5)" />
      <polygon points={pts(outer)} fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinejoin="round" />
      <polygon points={pts(inn)} fill="none" stroke="#fbfaf7" strokeWidth="3.5" strokeLinejoin="round" />
    </g>
  );
}

/* Crisp rebonded-foam chips: small irregular pieces in grey, black, white and a little
   lilac, like the client's King picture. Fixed seed, so the pattern is the same every time. */
const CHIP_TILE = [150, 96];
const CHIPS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const tones = ["#0f0f10", "#1d1d1f", "#2e2e31", "#555458", "#8a888d", "#d4d2d6", "#f2f1f3", "#ffffff", "#ffffff", "#e8e6ea", "#a79bb5"];
  const out = [];
  for (let k = 0; k < 700; k += 1) {
    const cx = rnd() * CHIP_TILE[0];
    const cy = rnd() * CHIP_TILE[1];
    const r = 2.2 + rnd() * 3.6;
    const sides = 4 + Math.floor(rnd() * 3);
    const ptsList = [];
    for (let j = 0; j < sides; j += 1) {
      const a = (j / sides) * Math.PI * 2 + rnd() * 0.8;
      const rr = r * (0.6 + rnd() * 0.6);
      ptsList.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8]);
    }
    out.push({ d: ptsList.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "), fill: tones[Math.floor(rnd() * tones.length)] });
  }
  return out;
})();

/* One part, front view, at top-face y (photo px). */
function FrontPart({ p, layer, i, n, y, t, cover, chips }) {
  const S = slab(y, t);
  const top = S.top;
  const front = S.front;
  const fy = y + TOP_D;
  const photoTop = i === 0 && (layer.mat === "quilt" || layer.mat === "panel" || layer.mat === "pillowtop");
  const photoBase = i === n - 1 && (layer.mat === "tray" || layer.mat === "panel");
  if (photoTop) {
    return (
      <g transform={`translate(0 ${f1(y - TOP_Y)})`}>
        <image href={cover.top} x="0" y="0" width={PH_W} height={PH_H} clipPath={`url(#${p}-ftop)`} />
      </g>
    );
  }
  if (photoBase) {
    const tray = layer.mat === "tray";
    return (
      <g>
        {tray ? (
          <TrayBox p={p} y={y} depth={Math.round(t * 0.62)} />
        ) : (
          <g transform={`translate(0 ${f1(y - TOP_Y)})`}>
            <image href={cover.full} x="0" y="0" width={PH_W} height={PH_H} clipPath={`url(#${p}-ftrap)`} />
          </g>
        )}
        {/* The photo's border, stretched to this base's height. */}
        <g transform={`translate(0 ${f1(fy)}) scale(1 ${(t / (BAND_END - BAND_Y)).toFixed(4)}) translate(0 ${-BAND_Y})`}>
          <image href={cover.full} x="0" y="0" width={PH_W} height={PH_H} clipPath={`url(#${p}-fband)`} />
        </g>
      </g>
    );
  }
  const m = layer.mat;
  const mat = FRONT_MAT[m] || FRONT_MAT.soft;
  if (m === "rebond" && chips) {
    return (
      <g>
        <polygon points={pts(top)} fill="#c9c7cb" />
        <polygon points={pts(top)} fill={`url(#${p}-chips-side)`} />
        <polygon points={pts(front)} fill="#b9b7bb" />
        <polygon points={pts(front)} fill={`url(#${p}-chips-side)`} />
        <polygon points={pts(front)} fill="rgba(0,0,0,0.08)" />
        <polyline points={pts(S.curve)} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
        <polyline points={pts(S.bottom)} fill="none" stroke="rgba(20,12,4,0.4)" strokeWidth="1.3" />
      </g>
    );
  }
  return (
    <g>
      <g filter={`url(#${p}-${mat.grain})`}>
        <polygon points={pts(top)} fill={mat.top} />
        <polygon points={pts(front)} fill={mat.side} />
      </g>
      {mat.holes ? <polygon points={pts(top)} fill={`url(#${p}-fholes)`} /> : null}
      {m === "pocket" ? (
        <>
          <polygon points={pts(top)} fill={`url(#${p}-fpocket)`} />
          <polygon points={pts(front)} fill={`url(#${p}-fpocket-side)`} />
        </>
      ) : null}
      {m === "bonnell" ? <polygon points={pts(front)} fill={`url(#${p}-fcoil)`} /> : null}
      {/* Light from above-front: a bright top, the front face shaded downwards. */}
      <polygon points={pts(top)} fill={`url(#${p}-ftoplight)`} />
      <polygon points={pts(front)} fill={`url(#${p}-ffront)`} />
      <polyline points={pts(S.curve)} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points={pts(S.bottom)} fill="none" stroke="rgba(20,12,4,0.4)" strokeWidth="1.3" strokeLinejoin="round" />
      <polygon points={pts(top)} fill="none" stroke="rgba(20,12,4,0.14)" strokeWidth="1" strokeLinejoin="round" />
    </g>
  );
}

/* Front-view materials: richer, clearer colours than the pale drawing palette. */
const FRONT_MAT = {
  soft: { top: "#f3d998", side: "#e2c27a", grain: "pores", holes: true },
  visco: { top: "#a9c4e6", side: "#8fadd6", grain: "pores" },
  foam25: { top: "#efd9a6", side: "#dcc084", grain: "pores" },
  hd: { top: "#e3c98f", side: "#cdb070", grain: "pores" },
  felt: { top: "#5d6168", side: "#464a51", grain: "felt" },
  rebond: { top: "#9a8ea6", side: "#7f7390", grain: "chips" },
  pe: { top: "#f4f6f8", side: "#d9dee4", grain: "fine" },
  padding: { top: "#ffffff", side: "#eceae4", grain: "cloud" },
  fibre: { top: "#fdfcf8", side: "#e9e6de", grain: "cloud" },
  pocket: { top: "#ece6d8", side: "#ddd5c4", grain: "pores" },
  bonnell: { top: "#e8e3d8", side: "#d6cfc1", grain: "fine" },
  panel: { top: "#f6f3ec", side: "#e6e1d6", grain: "cloud" },
  pillowtop: { top: "#f6f3ec", side: "#e6e1d6", grain: "cloud" },
};

function FrontDefs({ p }) {
  const chipTile = (id, sy) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width={CHIP_TILE[0]} height={CHIP_TILE[1] * sy} patternTransform={`scale(1 ${sy})`}>
      {CHIPS.map((c, k) => (
        <polygon key={k} points={c.d} fill={c.fill} />
      ))}
    </pattern>
  );
  return (
    <defs>
      {chipTile(`${p}-chips`, 0.6)}
      {chipTile(`${p}-chips-side`, 1)}
      <clipPath id={`${p}-ftop`} clipPathUnits="userSpaceOnUse">
        <polygon points={pts([[176, TOP_Y - 2], [754, TOP_Y - 2], [914, 386], [914, BAND_Y + 1], [16, BAND_Y + 1], [16, 386]])} />
      </clipPath>
      <clipPath id={`${p}-ftrap`} clipPathUnits="userSpaceOnUse">
        <polygon points={pts(trap(TOP_Y))} />
      </clipPath>
      <clipPath id={`${p}-fband`} clipPathUnits="userSpaceOnUse">
        <rect x="10" y={BAND_Y - 1} width="912" height={BAND_END - BAND_Y - 3} />
      </clipPath>
      <linearGradient id={`${p}-ftoplight`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.14" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.28" />
      </linearGradient>
      <linearGradient id={`${p}-fwall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bdb7ac" />
        <stop offset="0.5" stopColor="#d6d1c8" />
        <stop offset="1" stopColor="#e9e5de" />
      </linearGradient>
      <linearGradient id={`${p}-ffloor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e4e0d8" />
        <stop offset="0.35" stopColor="#f7f5f1" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id={`${p}-ffront`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.02" />
        <stop offset="1" stopColor="#000" stopOpacity="0.26" />
      </linearGradient>
      <filter id={`${p}-fdrop`} x="-10%" y="-20%" width="120%" height="160%">
        <feDropShadow dx="0" dy="22" stdDeviation="13" floodColor="#2a1a0c" floodOpacity="0.5" />
      </filter>
      <pattern id={`${p}-fholes`} patternUnits="userSpaceOnUse" width="22" height="14">
        <ellipse cx="11" cy="7" rx="2.6" ry="1.6" fill="rgba(110,80,35,0.32)" />
      </pattern>
      <pattern id={`${p}-fpocket`} patternUnits="userSpaceOnUse" width="34" height="20">
        <ellipse cx="17" cy="10" rx="14" ry="8" fill="#fbfcfd" stroke="rgba(80,95,110,0.35)" strokeWidth="0.8" />
      </pattern>
      <pattern id={`${p}-fpocket-side`} patternUnits="userSpaceOnUse" width="34" height="400">
        <rect x="4" y="0" width="26" height="400" rx="10" fill="#f3f5f7" stroke="rgba(80,95,110,0.3)" strokeWidth="0.8" />
      </pattern>
      <pattern id={`${p}-fcoil`} patternUnits="userSpaceOnUse" width="40" height="12">
        <path d="M4 0 L36 6 L4 12" fill="none" stroke="#3a4048" strokeWidth="2.2" />
        <path d="M4 0 L36 6 L4 12" fill="none" stroke="#b9c0c8" strokeWidth="0.8" />
      </pattern>
    </defs>
  );
}

/* Animated version, front view: the bed photo, the mattress lifting off it, then that same
   mattress opening into its parts. Every part is its own GPU-moved box. */
function AssembleStack({ layers, fabric, active, setActive, compact, open, slug, front }) {
  const cover = bedCover(slug);
  const p = `ma${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const L = useMemo(() => layout(layers), [layers]);
  const vbW = compact ? COMPACT_W : VB_W;
  const F = useMemo(() => frontLayout(layers, vbW, L.vbH, compact, front), [layers, vbW, L.vbH, compact, front]);
  const n = layers.length;
  const vb = `0 0 ${vbW} ${L.vbH}`;
  const pc = (u) => `${(((u * F.k) / L.vbH) * 100).toFixed(3)}%`;
  const box = "pointer-events-none absolute inset-0 overflow-visible";
  const bedBox = {
    left: `${(F.X0 / vbW) * 100}%`,
    top: `${(F.Y0 / L.vbH) * 100}%`,
    width: `${((PH_W * F.k) / vbW) * 100}%`,
    height: `${((PH_H * F.k) / L.vbH) * 100}%`,
  };
  const g = `translate(${f1(F.X0)} ${f1(F.Y0)}) scale(${F.k.toFixed(4)})`;
  const SHOW = OPEN_DELAY + LIFT;

  return (
    <div className="relative isolate h-full w-full" role="img" aria-label="The mattress lifting off its bed and opening into its layers">
      <style>{`@keyframes mlSway{0%,100%{transform:translate3d(0,0,0) rotate(0deg)}30%{transform:translate3d(0,-1.6%,0) rotate(-0.45deg)}70%{transform:translate3d(0,0.7%,0) rotate(0.35deg)}}@keyframes mlSwaySoft{0%,100%{transform:translate3d(0,0,0) rotate(0deg)}35%{transform:translate3d(0,-0.65%,0) rotate(-0.12deg)}70%{transform:translate3d(0,0.3%,0) rotate(0.1deg)}}`}</style>
      <svg viewBox={vb} className={`${box} block h-full w-full`} aria-hidden>
        <Defs p={p} fabric={fabric} />
        <FrontDefs p={p} />
      </svg>

      {/* The bed sinks away; the mattress lifts off it — the client's photo. */}
      {/* The bed shows larger at rest, and settles to the mattress's opening size as it lifts. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ ...bedBox, transformOrigin: "50% 62%" }}
        initial={{ scale: BED_REST_SCALE }}
        animate={{ scale: open ? 1 : BED_REST_SCALE }}
        transition={open ? { duration: LIFT + 0.1, ease: "easeInOut", delay: OPEN_DELAY } : { duration: 0 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1, y: "0%" }}
          animate={{ opacity: open ? 0 : 1, y: open ? "10%" : "0%" }}
          transition={{ duration: 0.9, ease: EASE, delay: open ? OPEN_DELAY : 0 }}
        >
          <Image src={BED_FRAME} alt="" fill sizes="(min-width: 1024px) 50vw, 95vw" className="object-contain" />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1, y: "0%" }}
          animate={open ? { y: "-14%", opacity: 0 } : { opacity: 1, y: "0%" }}
          transition={
            open
              ? { y: { duration: LIFT, ease: "easeOut", delay: OPEN_DELAY }, opacity: { duration: 0.12, delay: SHOW } }
              : { duration: 0 }
          }
        >
          <Image src={cover.full} alt="" fill sizes="(min-width: 1024px) 50vw, 95vw" className="object-contain" />
        </motion.div>
      </motion.div>

      {/* The parts, bottom first so upper parts sit in front. */}
      {layers
        .map((layer, i) => ({ layer, i }))
        .reverse()
        .map(({ layer, i }) => {
          const edge = i === 0 || i === n - 1;
          const off = pc(F.closedY[i] - F.openY[i]);
          return (
            <motion.div
              key={i}
              className={box}
              style={{ willChange: "transform" }}
              initial={{ y: off, opacity: 0 }}
              animate={{ y: open ? "0%" : off, opacity: open ? 1 : 0 }}
              transition={
                open
                  ? {
                      y: { type: "spring", stiffness: 55, damping: i === 0 ? 8.5 : 15, mass: 1.1, delay: SHOW + 0.05 + i * OPEN_STAGGER },
                      opacity: { duration: edge ? 0.08 : 0.4, delay: edge ? SHOW : SHOW + 0.1 },
                    }
                  : { duration: 0 }
              }
            >
              <div
                className={box}
                style={{
                  transformOrigin: "50% 55%",
                  /* The quilted top floats and rocks; the parts inside barely breathe. */
                  animation: open
                    ? i === 0
                      ? `mlSway 3.6s ease-in-out ${(SHOW + 2.2).toFixed(2)}s infinite`
                      : `mlSwaySoft ${4 + (i % 3) * 0.5}s ease-in-out ${(SHOW + 2.4 + i * 0.3).toFixed(2)}s infinite`
                    : "none",
                }}
              >
                <svg viewBox={vb} className="absolute inset-0 block h-full w-full overflow-visible" aria-hidden>
                  <g
                    transform={`${g} translate(465 ${f1(F.openY[i] + TOP_D / 2)}) scale(${F.sc[i]}) translate(-465 ${f1(-(F.openY[i] + TOP_D / 2))})`}
                    filter={`url(#${p}-fdrop)`}
                    opacity={active !== null && active !== i ? 0.3 : 1}
                    style={{ transition: "opacity 0.3s ease", cursor: "pointer", pointerEvents: "auto" }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <FrontPart p={p} layer={layer} i={i} n={n} y={F.openY[i]} t={F.ft[i]} cover={cover} chips={front?.chips} />
                  </g>
                </svg>
              </div>
            </motion.div>
          );
        })}

      <svg viewBox={vb} className={`${box} block h-full w-full`} aria-hidden>
        {layers.map((layer, i) => {
          const [ax, ay] = F.anchors[i];
          const on = active === i;
          const fade = {
            initial: { opacity: 0 },
            animate: { opacity: open ? 1 : 0 },
            transition: { duration: 0.5, delay: open ? labelDelay(i) : 0 },
          };
          if (compact) {
            return (
              <motion.g key={`pin${i}`} {...fade}>
                <circle cx={f1(ax)} cy={f1(ay)} r="4.5" fill={BRAND} stroke="#fff" strokeWidth="1.5" />
                <line x1={f1(ax)} y1={f1(ay)} x2={f1(ax - 22)} y2={f1(ay)} stroke={BRAND} strokeWidth="2" />
                <rect x={f1(ax - 58)} y={f1(ay - 18)} width="36" height="36" fill={on ? "#1f2937" : BRAND} />
                <text x={f1(ax - 40)} y={f1(ay + 7)} textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
                  {i + 1}
                </text>
              </motion.g>
            );
          }
          return (
            <motion.g key={`lead${i}`} {...fade}>
              <path
                d={`M${f1(ax)} ${f1(ay)} H${f1(ax + 16)} L${LABEL_XF - 22} ${f1(F.ly[i])} H${LABEL_XF - 6}`}
                fill="none"
                stroke={BRAND}
                strokeWidth={on ? 2.2 : 1.4}
              />
              <circle cx={f1(ax)} cy={f1(ay)} r={on ? 6 : 4.5} fill={BRAND} stroke="#fff" strokeWidth="1.6" />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

function StaticStack({ layers, fabric, active, setActive, compact, animate = false, open = true }) {
  const p = `ml${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const L = useMemo(() => layout(layers), [layers]);
  const vbW = compact ? COMPACT_W : VB_W;
  const shut = null;

  return (
    <svg viewBox={`0 0 ${vbW} ${L.vbH}`} className="block h-full w-full overflow-visible" role="img" aria-label="Exploded view of the mattress layers">
      <Defs p={p} fabric={fabric} />
      <polygon
        points={pts([L.at(-6, 26, 0), L.at(A + 26, 26, 0), L.at(A + 26, B + 34, 0), L.at(-6, B + 34, 0)])}
        fill="rgba(60,45,30,0.3)"
        filter={`url(#${p}-blur)`}
      />
      {/* Bottom part first so upper parts sit in front. */}
      {layers
        .map((layer, i) => ({ layer, i }))
        .reverse()
        .map(({ layer, i }) => (
          <motion.g
            key={i}
            initial={shut ? { y: shut[i] } : false}
            animate={shut ? { y: open ? 0 : shut[i] } : undefined}
            transition={{ duration: 0 }}
          >
          <g
            filter={`url(#${p}-drop)`}
            opacity={active !== null && active !== i ? 0.3 : 1}
            style={{ transition: "opacity 0.3s ease", cursor: "pointer" }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <Part p={p} at={L.at} z={L.z[i]} layer={layer} />
          </g>
          </motion.g>
        ))}

      {layers.map((layer, i) => {
        const [ax, ay] = L.anchors[i];
        const on = active === i;
        const fade = animate
          ? { initial: { opacity: 0 }, animate: { opacity: open ? 1 : 0 }, transition: { duration: 0.5, delay: open ? labelDelay(i) : 0 } }
          : {};
        if (compact) {
          return (
            <motion.g key={`pin${i}`} {...fade}>
              <line x1={f1(ax)} y1={f1(ay)} x2={f1(ax + 34)} y2={f1(ay)} stroke={BRAND} strokeWidth="2" />
              <circle cx={f1(ax)} cy={f1(ay)} r="4.5" fill={BRAND} stroke="#fff" strokeWidth="1.5" />
              <rect x={f1(ax + 36)} y={f1(ay - 18)} width="36" height="36" fill={on ? "#1f2937" : BRAND} />
              <text x={f1(ax + 54)} y={f1(ay + 7)} textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
                {i + 1}
              </text>
            </motion.g>
          );
        }
        const ly = L.ly[i];
        return (
          <motion.g key={`lead${i}`} {...fade}>
            <path
              d={`M${f1(ax)} ${f1(ay)} H${f1(ax + 28)} L${LABEL_X - 26} ${f1(ly)} H${LABEL_X - 8}`}
              fill="none"
              stroke={BRAND}
              strokeWidth={on ? 2.2 : 1.4}
            />
            <circle cx={f1(ax)} cy={f1(ay)} r={on ? 6 : 4.5} fill={BRAND} stroke="#fff" strokeWidth="1.6" />
          </motion.g>
        );
      })}
    </svg>
  );
}

/* Right-hand names for the opening bed section: a numbered title, and for the cover and
   the base the four parts underneath, with the small cut-through disc the client's layer
   pictures use. */
function FrontLabel({ n, title, parts, on }) {
  return (
    <div className="min-w-0 cursor-default">
      <div className="flex items-center" style={{ gap: "1cqw" }}>
        <span
          className={`flex shrink-0 items-center justify-center font-bold text-white transition-colors ${on ? "bg-ink" : "bg-brand"}`}
          style={{ width: "3cqw", height: "3cqw", minWidth: 24, minHeight: 24, fontSize: "clamp(11px, 1.45cqw, 17px)" }}
        >
          {n}
        </span>
        <h3
          className={`whitespace-nowrap font-bold uppercase transition-colors ${on ? "text-brand" : "text-ink"}`}
          style={{ fontSize: "clamp(13px, 1.8cqw, 21px)", letterSpacing: "0.08em", lineHeight: 1.2 }}
        >
          {title}
        </h3>
      </div>
      {parts ? (
        <div className="flex items-start" style={{ gap: "0.9cqw", marginTop: "0.9cqw", paddingLeft: "0.3cqw" }}>
          <svg viewBox="0 0 40 40" className="mt-[2px] shrink-0" style={{ width: "2.8cqw", height: "2.8cqw", minWidth: 22, minHeight: 22 }} aria-hidden>
            <circle cx="20" cy="20" r="18.5" fill="#b4b4b7" />
            <path d="M20 20 L20 1.5 A18.5 18.5 0 1 1 3.9 29.1 Z" fill="#1c1c1e" />
            <path d="M20 20 L3.9 29.1 A18.5 18.5 0 0 1 1.9 23.5 Z" fill="#ffffff" />
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          </svg>
          <ul className="min-w-0 border-l border-ink/15" style={{ paddingLeft: "0.8cqw", fontSize: "clamp(12px, 1.45cqw, 17px)", lineHeight: 1.5 }}>
            {parts.map((t) => (
              <li key={t} className="flex items-start text-ink/75" style={{ gap: "0.6cqw", marginTop: "0.25cqw" }}>
                <span className="inline-block shrink-0 rounded-full bg-brand" style={{ width: 5, height: 5, marginTop: "0.62em" }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────────────── */
/* Same section, but the mattress starts closed and opens layer by layer when it scrolls
   into view, then the names come in (client, 27 Nov 2026). Always the drawing. */
export function MattressLayersAssemble({ product }) {
  return <MattressLayersExplode product={product} assemble />;
}

export default function MattressLayersExplode({ product, assemble = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const open = !assemble || seen;
  const spec = layersFor(product?.slug);
  const layers = spec.layers;
  const n = layers.length;
  const L = useMemo(() => layout(layers), [layers]);
  const F = useMemo(() => (assemble ? frontLayout(layers, VB_W, L.vbH, false, spec.front) : null), [assemble, layers, L.vbH, spec.front]);
  const name = product?.shortName || product?.name || "mattress";
  const [active, setActive] = useState(null);

  const ratio = VB_W / L.vbH;
  const compactRatio = COMPACT_W / L.vbH;

  return (
    <section
      ref={ref}
      aria-label={`Inside the Karmo ${name}`}
      className="relative isolate overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fbf7f1 0%, #f3eadf 55%, #ecdfcf 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/products/mattress/mosaic/karmo-pattern-texture.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12] mix-blend-multiply"
        />
        <span
          className="absolute left-[30%] top-[12%] h-[76%] w-[50%] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))" }}
        />
        <span
          className="display absolute -right-[2vw] bottom-[-6vw] select-none font-bold leading-none text-transparent"
          style={{ fontSize: "clamp(10rem, 30vw, 30rem)", WebkitTextStroke: "2px rgba(200,40,40,0.07)" }}
        >
          {String(n).padStart(2, "0")}
        </span>
      </div>

      <div
        className={`mx-auto grid max-w-[1560px] items-center gap-x-10 px-5 pb-10 pt-12 sm:px-8 lg:min-h-[calc(100svh-112px)] lg:px-14 lg:py-10 ${
          assemble ? "lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)]"
        }`}
      >
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">Layer by layer</p>
          {assemble ? (
            /* Two lines only: "Inside every" / "Karmo <name>" (client, 27 Nov 2026). */
            <h2
              className="display mt-3 font-light uppercase leading-[1.1] tracking-[0.01em] text-ink"
              style={{ fontSize: "clamp(1.3rem, 0.25rem + 1.6vw, 2.25rem)" }}
            >
              <span className="block whitespace-nowrap">Inside every</span>
              <span className="block whitespace-nowrap font-bold text-brand">Karmo {name}</span>
            </h2>
          ) : (
            <h2 className="display mt-3 text-[1.7rem] font-light uppercase leading-[1.05] tracking-[0.01em] text-ink sm:text-[2.1rem] lg:text-[2.6rem]">
              Inside every <span className="block font-bold text-brand">Karmo {name}</span>
            </h2>
          )}
          <p className="body-copy mt-3 max-w-xl text-[15px] leading-relaxed text-ink/65">{spec.lead}</p>
          <span className="mt-6 inline-flex items-center gap-2 border border-ink/12 bg-white/70 px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/75 backdrop-blur">
            <FiLayers className="text-brand" aria-hidden />
            {n} layers
          </span>
        </div>

        {/* The client's own layer picture (orthopedic), background cut out, in place of the
            drawing (client, 26 Nov 2026). */}
        {spec.layersImage && !assemble ? (
          <div className="mt-8 lg:mt-0">
            <div
              className="relative mx-auto w-full"
              style={{ aspectRatio: "1652 / 962", maxWidth: "calc((100svh - 190px) * 1.7173)" }}
            >
              <Image
                src={spec.layersImage}
                alt={`The layers inside the Karmo ${name}`}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
        <>
        {/* ── Desktop: drawing + red leaders to the names ── */}
        <div className="mt-6 hidden md:block lg:mt-0">
          <div
            className={`@container relative ${assemble ? "ml-auto mr-0" : "mx-auto"}`}
            style={{ width: `min(100%, calc((100svh - 150px) * ${ratio.toFixed(4)}))`, aspectRatio: `${VB_W} / ${L.vbH}` }}
          >
            <Stack layers={layers} fabric={spec.fabric} active={active} setActive={setActive} animate={assemble} open={open} slug={product?.slug} front={spec.front} />
            <ol className="absolute inset-0" aria-label={`Layers of the Karmo ${name}`}>
              {layers.map((layer, i) => (
                <motion.li
                  key={`${layer.title}-${i}`}
                  initial={assemble ? { opacity: 0, x: 18 } : false}
                  animate={assemble ? { opacity: open ? 1 : 0, x: open ? 0 : 18 } : undefined}
                  transition={{ duration: 0.55, ease: EASE, delay: open ? labelDelay(i) : 0 }}
                  className="absolute flex items-center"
                  style={{
                    left: `${((F ? LABEL_XF : LABEL_X) / VB_W) * 100}%`,
                    top: `${((F ? F.ly[i] : L.ly[i]) / L.vbH) * 100}%`,
                    width: F ? "30%" : "38%",
                    transform: F ? "translateY(-1.5cqw)" : "translateY(-50%)",
                    gap: "1.2cqw",
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {F ? (
                    <FrontLabel
                      n={i + 1}
                      title={spec.front?.labels?.[i]?.title || layer.title}
                      parts={spec.front?.labels?.[i]?.parts}
                      on={active === i}
                    />
                  ) : (
                    <>
                      <span
                        className={`flex shrink-0 items-center justify-center font-bold text-white transition-colors ${active === i ? "bg-ink" : "bg-brand"}`}
                        style={{ width: "3cqw", height: "3cqw", minWidth: 22, minHeight: 22, fontSize: "clamp(11px, 1.4cqw, 16px)" }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 cursor-default">
                        <h3
                          className={`whitespace-nowrap font-bold uppercase transition-colors ${active === i ? "text-brand" : "text-ink"}`}
                          style={{ fontSize: "clamp(12px, 1.7cqw, 19px)", letterSpacing: "0.08em", lineHeight: 1.2 }}
                        >
                          {layer.title}
                        </h3>
                        <p className="mt-0.5 text-ink/60" style={{ fontSize: "clamp(11px, 1.4cqw, 15px)", lineHeight: 1.35 }}>
                          {layer.note}
                        </p>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Phones: drawing with numbered pins, list underneath ── */}
        <div className="mt-6 md:hidden">
          <div className="relative mx-auto w-full" style={{ aspectRatio: `${COMPACT_W} / ${L.vbH}`, maxWidth: `calc(70svh * ${compactRatio.toFixed(4)})` }}>
            <Stack layers={layers} fabric={spec.fabric} active={active} setActive={setActive} compact animate={assemble} open={open} slug={product?.slug} front={spec.front} />
          </div>
          <ol className="mt-5 grid gap-2.5">
            {layers.map((layer, i) => (
              <li key={`${layer.title}-m${i}`}>
                <button
                  type="button"
                  onClick={() => setActive(active === i ? null : i)}
                  className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors ${
                    active === i ? "border-brand bg-white" : "border-ink/10 bg-white/60"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand text-[12px] font-bold text-white">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-ink">{layer.title}</span>
                    <span className="block text-[12.5px] leading-snug text-ink/60">{layer.note}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        </>
        )}
      </div>
    </section>
  );
}
