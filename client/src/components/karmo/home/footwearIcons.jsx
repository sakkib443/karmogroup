/**
 * Footwear claim icons — same cartoon language as the hero trust strip
 * (cartoon-v3): chunky black outline, flat colour, one sparkle, one leaf.
 * Transparent ground so they sit on the dark foam band.
 */

const INK = "#1C1C1C";
const PINK = "#F25C7A";
const PINK_DEEP = "#D44348";
const NAVY = "#2C4C80";
const LEAF = "#8ED44A";

function Frame({ children }) {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

function Spark({ cx, cy, r = 6.5 }) {
  cx = +cx;
  cy = +cy;
  r = +r;
  const a = r * 0.28;
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + a} ${cy - a} L${cx + r} ${cy} L${cx + a} ${cy + a} L${cx} ${cy + r} L${cx - a} ${cy + a} L${cx - r} ${cy} L${cx - a} ${cy - a} Z`}
      fill="#FF4B6A"
      stroke={INK}
      strokeWidth="1.35"
      strokeLinejoin="round"
    />
  );
}

function Leaf({ x, y, flip = false }) {
  x = +x;
  y = +y;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <path
        d="M1 12C1 5 8 1 16 1C11 7 9 11 7 16C5 12 3 12 1 12Z"
        fill={LEAF}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5 12C8 8 11 5 15 3" stroke={INK} strokeWidth="1.15" strokeLinecap="round" />
    </g>
  );
}

export function IconCushion() {
  return (
    <Frame>
      <Spark cx={78} cy={14} />
      <Leaf x={6} y={64} />
      <path d="M22 80c7-5 14-5 21 0" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M48 83c5-3.5 10-3.5 15 0" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="16" y="48" width="62" height="16" rx="5" fill={PINK} stroke={INK} strokeWidth="2.3" />
      <rect x="16" y="60" width="62" height="5" rx="1" fill={PINK_DEEP} />
      <rect x="14" y="66" width="66" height="9" rx="4.5" fill="#2A2A2A" stroke={INK} strokeWidth="2.3" />
      <rect x="20" y="42" width="54" height="8" rx="3" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <path
        d="M32 42c1-14 12-20 26-19 11 1 18 8 20 17H32z"
        fill="#F3F3F3"
        stroke={INK}
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path d="M40 30c7-2 14-1 18 2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M42 34c4 2 6 2 10 0M44 39c3.5 1.6 5.5 1.6 9 0"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function IconLoad() {
  return (
    <Frame>
      <Spark cx={80} cy={16} />
      <Leaf x={8} y={68} />
      <rect x="14" y="58" width="68" height="20" rx="5" fill={PINK} stroke={INK} strokeWidth="2.3" />
      <rect x="18" y="52" width="60" height="8" rx="3" fill="#FFD5DE" stroke={INK} strokeWidth="2.2" />
      <rect x="40" y="20" width="16" height="8" rx="3" fill={NAVY} stroke={INK} strokeWidth="2.2" />
      <circle cx="48" cy="40" r="15" fill={NAVY} stroke={INK} strokeWidth="2.3" />
      <circle cx="48" cy="40" r="5.5" fill="#fff" stroke={INK} strokeWidth="2" />
    </Frame>
  );
}

function FoamBar({ y, fill }) {
  return (
    <rect x="24" y={y} width="48" height="15" rx="4" fill={fill} stroke={INK} strokeWidth="2.4" />
  );
}

function Carton({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="26" height="24" rx="3.5" fill="#fff" stroke={INK} strokeWidth="2.3" />
      <rect x={x + 2.2} y={y + 10} width="21.6" height="3.4" fill={PINK} />
    </g>
  );
}

export function IconLight() {
  return (
    <Frame>
      <Spark cx={18} cy={16} r={5.5} />
      <Leaf x={74} y={68} flip />
      <path
        d="M48 16c10 8 16 22 14 38-2 16-8 28-14 34-6-6-12-18-14-34-2-16 4-30 14-38z"
        fill="#fff"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M48 24v52" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M48 34 39 38M48 44 37 48M48 54 37 56M48 64 39 66M48 34 57 38M48 44 59 48M48 54 59 56M48 64 57 66"
        stroke={INK}
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function IconDensity() {
  return (
    <Frame>
      <Spark cx={80} cy={14} r={5.5} />
      <Leaf x={6} y={70} />
      <FoamBar y={20} fill={NAVY} />
      <FoamBar y={40} fill="#fff" />
      <FoamBar y={60} fill={PINK} />
    </Frame>
  );
}

export function IconFormula() {
  return (
    <Frame>
      <Spark cx={18} cy={16} r={5.5} />
      <Leaf x={74} y={68} flip />
      <defs>
        <clipPath id="karmo-foam-formula">
          <ellipse cx="48" cy="58" rx="20.5" ry="16.5" />
        </clipPath>
      </defs>
      <rect x="41" y="14" width="14" height="34" rx="3" fill="#F6F7F8" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="48" cy="58" rx="22" ry="18" fill="#F6F7F8" stroke={INK} strokeWidth="2.4" />
      <g clipPath="url(#karmo-foam-formula)">
        <rect x="24" y="60" width="48" height="20" fill={PINK} />
      </g>
      <circle cx="42" cy="66" r="2.1" fill="#fff" />
      <circle cx="54" cy="70" r="1.45" fill="#fff" />
    </Frame>
  );
}

export function IconScale() {
  return (
    <Frame>
      <Spark cx={82} cy={14} r={5.5} />
      <Leaf x={6} y={72} />
      <Carton x={16} y={50} />
      <Carton x={54} y={50} />
      <Carton x={35} y={22} />
    </Frame>
  );
}
