"use client";

import { useId, useMemo, useState } from "react";
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
function Stack({ layers, fabric, active, setActive, compact }) {
  const p = `ml${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const L = useMemo(() => layout(layers), [layers]);
  const vbW = compact ? COMPACT_W : VB_W;

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
          <g
            key={i}
            filter={`url(#${p}-drop)`}
            opacity={active !== null && active !== i ? 0.3 : 1}
            style={{ transition: "opacity 0.3s ease", cursor: "pointer" }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <Part p={p} at={L.at} z={L.z[i]} layer={layer} />
          </g>
        ))}

      {layers.map((layer, i) => {
        const [ax, ay] = L.anchors[i];
        const on = active === i;
        if (compact) {
          return (
            <g key={`pin${i}`}>
              <line x1={f1(ax)} y1={f1(ay)} x2={f1(ax + 34)} y2={f1(ay)} stroke={BRAND} strokeWidth="2" />
              <circle cx={f1(ax)} cy={f1(ay)} r="4.5" fill={BRAND} stroke="#fff" strokeWidth="1.5" />
              <rect x={f1(ax + 36)} y={f1(ay - 18)} width="36" height="36" fill={on ? "#1f2937" : BRAND} />
              <text x={f1(ax + 54)} y={f1(ay + 7)} textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
                {i + 1}
              </text>
            </g>
          );
        }
        const ly = L.ly[i];
        return (
          <g key={`lead${i}`}>
            <path
              d={`M${f1(ax)} ${f1(ay)} H${f1(ax + 28)} L${LABEL_X - 26} ${f1(ly)} H${LABEL_X - 8}`}
              fill="none"
              stroke={BRAND}
              strokeWidth={on ? 2.2 : 1.4}
            />
            <circle cx={f1(ax)} cy={f1(ay)} r={on ? 6 : 4.5} fill={BRAND} stroke="#fff" strokeWidth="1.6" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Section ───────────────────────────────────────────────────────────────────── */
export default function MattressLayersExplode({ product }) {
  const spec = layersFor(product?.slug);
  const layers = spec.layers;
  const n = layers.length;
  const L = useMemo(() => layout(layers), [layers]);
  const name = product?.shortName || product?.name || "mattress";
  const [active, setActive] = useState(null);

  const ratio = VB_W / L.vbH;
  const compactRatio = COMPACT_W / L.vbH;

  return (
    <section
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

      <div className="mx-auto grid max-w-[1560px] items-center gap-x-10 px-5 pb-10 pt-12 sm:px-8 lg:min-h-[calc(100svh-112px)] lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:px-14 lg:py-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">Layer by layer</p>
          <h2 className="display mt-3 text-[1.7rem] font-light uppercase leading-[1.05] tracking-[0.01em] text-ink sm:text-[2.1rem] lg:text-[2.6rem]">
            Inside every <span className="block font-bold text-brand">Karmo {name}</span>
          </h2>
          <p className="body-copy mt-3 max-w-xl text-[15px] leading-relaxed text-ink/65">{spec.lead}</p>
          <span className="mt-6 inline-flex items-center gap-2 border border-ink/12 bg-white/70 px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/75 backdrop-blur">
            <FiLayers className="text-brand" aria-hidden />
            {n} layers
          </span>
        </div>

        {/* ── Desktop: drawing + red leaders to the names ── */}
        <div className="mt-6 hidden md:block lg:mt-0">
          <div
            className="@container relative mx-auto"
            style={{ width: `min(100%, calc((100svh - 150px) * ${ratio.toFixed(4)}))`, aspectRatio: `${VB_W} / ${L.vbH}` }}
          >
            <Stack layers={layers} fabric={spec.fabric} active={active} setActive={setActive} />
            <ol className="absolute inset-0" aria-label={`Layers of the Karmo ${name}`}>
              {layers.map((layer, i) => (
                <li
                  key={`${layer.title}-${i}`}
                  className="absolute flex items-center"
                  style={{ left: `${(LABEL_X / VB_W) * 100}%`, top: `${(L.ly[i] / L.vbH) * 100}%`, width: "38%", transform: "translateY(-50%)", gap: "1.2cqw" }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
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
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Phones: drawing with numbered pins, list underneath ── */}
        <div className="mt-6 md:hidden">
          <div className="relative mx-auto w-full" style={{ aspectRatio: `${COMPACT_W} / ${L.vbH}`, maxWidth: `calc(70svh * ${compactRatio.toFixed(4)})` }}>
            <Stack layers={layers} fabric={spec.fabric} active={active} setActive={setActive} compact />
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
      </div>
    </section>
  );
}
