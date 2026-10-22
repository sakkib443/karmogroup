/**
 * Layer icons for the mattress cutaway panel.
 * Drawn like the homepage hero strip: thick black outline, flat colour,
 * one pink sparkle.
 *
 * Foam wadding — cloud over stacked foam
 * Pillow top — pillow on a mattress
 * Pocket springs — three pocket coils
 */

const INK = "#1A1A1A";
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
  foam: IconFoam,
  pillow: IconPillow,
  springs: IconSprings,
};

export function FeatureIcon({ id }) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return <Icon />;
}
