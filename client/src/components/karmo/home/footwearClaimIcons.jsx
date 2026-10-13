/**
 * Footwear claim + service icons — professional, colourful, matching the
 * client spec-sheet mockup (not the cartoon-v3 language).
 */

function Circle({ fill, children }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <circle cx="32" cy="32" r="31" fill={fill} />
      {children}
    </svg>
  );
}

/** Cushioning — layered foam pad. */
export function IconClaimCushion() {
  return (
    <Circle fill="#FF5A7A">
      <rect x="14" y="28" width="36" height="14" rx="7" fill="#fff" />
      <rect x="18" y="22" width="28" height="10" rx="5" fill="#FFE4EA" />
      <path d="M22 22c2-8 18-8 20 0" fill="#fff" />
      <path d="M20 42c6 4 18 4 24 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </Circle>
  );
}

/** Load performance — shield. */
export function IconClaimLoad() {
  return (
    <Circle fill="#F5A623">
      <path
        d="M32 12 48 18v14c0 10.5-7.2 18.8-16 22-8.8-3.2-16-11.5-16-22V18L32 12Z"
        fill="#fff"
      />
      <path
        d="M26 32.5 30.2 37 40 26"
        stroke="#F5A623"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Circle>
  );
}

/** Lightweight — feather. */
export function IconClaimLight() {
  return (
    <Circle fill="#2EC4B6">
      <path
        d="M20 44c8-2 16-10 22-22 1.2 8-2 18-10 24-6 4.5-12 3.5-12-2Z"
        fill="#fff"
      />
      <path
        d="M24 40c6-4 12-12 16-20M28 36c4-1.5 8-5 11-10M31 33c3-1 6-3.5 8-7"
        stroke="#2EC4B6"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </Circle>
  );
}

function LineIcon({ children }) {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 text-[#FF7A3D]" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

/** Consistent density — stacked layers. */
export function IconServiceDensity() {
  return (
    <LineIcon>
      <rect x="8" y="8" width="24" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="8" y="17" width="24" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="8" y="26" width="24" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </LineIcon>
  );
}

/** Custom formulation — flask. */
export function IconServiceFormula() {
  return (
    <LineIcon>
      <path
        d="M16 8h8M18 8v8l-6 12a6 6 0 0 0 5.2 9h5.6A6 6 0 0 0 28 28L22 16V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 26h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </LineIcon>
  );
}

/** Lightweight construction — feather line. */
export function IconServiceLight() {
  return (
    <LineIcon>
      <path
        d="M12 28c8-3 16-12 20-22-8 2-16 10-20 18-2 4 0 6 0 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 26c6-4 12-12 16-20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </LineIcon>
  );
}

/** Production scale — stacked cartons. */
export function IconServiceScale() {
  return (
    <LineIcon>
      <rect x="7" y="20" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="21" y="20" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="7" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    </LineIcon>
  );
}
