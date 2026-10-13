/**
 * Five feature icons, each a different object.
 * Drawn like the homepage hero strip: thick black outline, flat colour,
 * one pink sparkle. Not five mattresses.
 *
 * Premium materials — award medal
 * Superior comfort — pillow
 * Long-lasting durability — shield
 * Breathable design — wind
 * Healthier sleep — leaf and moon
 */

const INK = "#1A1A1A";
const LEAF = "#8FCB45";
const LEAF_HI = "#C6E86A";
const RED = "#E23B3B";
const NAVY = "#243E6E";
const CREAM = "#F6E6BE";
const SKY = "#7EC8F0";
const SW = 5;

function Frame({ children }) {
  return (
    <svg viewBox="0 0 128 128" className="h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

function Shadow() {
  return <ellipse cx="64" cy="116" rx="42" ry="6" fill="#000" opacity="0.1" />;
}

function Spark({ cx, cy, r = 9 }) {
  cx = +cx;
  cy = +cy;
  r = +r;
  const a = r * 0.32;
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + a} ${cy - a} L${cx + r} ${cy} L${cx + a} ${cy + a} L${cx} ${cy + r} L${cx - a} ${cy + a} L${cx - r} ${cy} L${cx - a} ${cy - a} Z`}
      fill="#FF4D6A"
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

function IconMaterials() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={104} cy={22} r={8} />
      <Spark cx={22} cy={34} r={6} />
      <path d="M40 78 h48 l8 22 H32 Z" fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M64 78 v22" stroke={INK} strokeWidth="3" />
      <circle cx="64" cy="58" r="34" fill={CREAM} stroke={INK} strokeWidth={SW} />
      <circle cx="64" cy="58" r="24" fill="none" stroke={INK} strokeWidth="3" />
      <path
        d="M64 40 l5 12 h13 l-10 8 4 13 -12 -8 -12 8 4 -13 -10 -8 h13 Z"
        fill={RED}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function IconComfort() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={106} cy={24} r={8} />
      <ellipse cx="30" cy="96" rx="14" ry="8" fill="#fff" stroke={INK} strokeWidth="4" />
      <ellipse cx="48" cy="104" rx="9" ry="6" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <rect x="22" y="36" width="84" height="52" rx="24" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="36" y="50" width="56" height="24" rx="12" fill="none" stroke={RED} strokeWidth="3.5" />
      <ellipse cx="48" cy="50" rx="16" ry="6" fill="#F4F4F4" />
    </Frame>
  );
}

function IconDurability() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={104} cy={22} r={8} />
      <path
        d="M64 16 L108 34 V70 C108 96 64 114 64 114 C64 114 20 96 20 70 V34 Z"
        fill={NAVY}
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path
        d="M42 64 l14 14 30 -34"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function IconBreathable() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={108} cy={20} r={8} />
      <rect x="14" y="28" width="58" height="14" rx="7" fill={SKY} stroke={INK} strokeWidth="4" />
      <rect x="22" y="50" width="46" height="14" rx="7" fill={SKY} stroke={INK} strokeWidth="4" />
      <rect x="30" y="72" width="34" height="14" rx="7" fill={SKY} stroke={INK} strokeWidth="4" />
      <path
        d="M78 34c16 4 26 16 26 30 0 16-12 28-28 30 6-8 8-16 6-26-2-8-2-18-4-34z"
        fill="#fff"
        stroke={INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function IconHealthier() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={24} cy={28} r={7} />
      <path
        d="M92 18 a20 20 0 1 0 18 34 a14 14 0 1 1 -18 -34 z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <g transform="translate(52 78) rotate(-28)">
        <ellipse cx="0" cy="-8" rx="26" ry="40" fill={LEAF} stroke={INK} strokeWidth="4.5" />
        <ellipse cx="-6" cy="-18" rx="12" ry="18" fill={LEAF_HI} />
        <path d="M0 28 C2 6 0 -22 0 -44" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M0 4 C-12 0 -16 -8 -20 -14 M0 -8 C12 -12 16 -20 20 -26" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

function IconFoam() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={106} cy={22} r={8} />
      <rect x="22" y="80" width="84" height="22" rx="8" fill={NAVY} stroke={INK} strokeWidth={SW} />
      <rect x="26" y="60" width="76" height="24" rx="8" fill={CREAM} stroke={INK} strokeWidth={SW} />
      <path
        d="M30 62c0-16 14-28 34-26 8-12 30-8 32 8 12 0 18 12 8 20H34c-6 0-6-6-4-2z"
        fill="#fff"
        stroke={INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function IconPillow() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={104} cy={24} r={8} />
      <rect x="18" y="76" width="92" height="26" rx="10" fill={NAVY} stroke={INK} strokeWidth={SW} />
      <rect x="24" y="28" width="80" height="50" rx="22" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="38" y="42" width="52" height="22" rx="11" fill="none" stroke={RED} strokeWidth="3" />
    </Frame>
  );
}

function IconSprings() {
  return (
    <Frame>
      <Shadow />
      <Spark cx={106} cy={20} r={8} />
      <rect x="16" y="30" width="96" height="72" rx="14" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="16" y="30" width="96" height="20" rx="14" fill={CREAM} stroke={INK} strokeWidth={SW} />
      <path d="M16 50 h96" stroke={INK} strokeWidth="4" />
      {[30, 56, 82].map((x) => (
        <g key={x}>
          <rect x={x} y="58" width="18" height="34" rx="9" fill={SKY} stroke={INK} strokeWidth="3.5" />
          <path d={`M${x + 4} 70 h10 M${x + 4} 80 h10`} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

const ICONS = {
  materials: IconMaterials,
  comfort: IconComfort,
  durability: IconDurability,
  breathable: IconBreathable,
  healthier: IconHealthier,
  foam: IconFoam,
  pillow: IconPillow,
  springs: IconSprings,
};

export function FeatureIcon({ id }) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return <Icon />;
}
