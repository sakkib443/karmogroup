/**
 * The Mattress menu's icons — three comfort grades and three bed sizes.
 *
 * The two halves have different origins, and that is worth knowing before
 * editing either:
 *
 *   comfort   drawn here. No icon set ships a mattress that changes with its
 *             firmness, so Firm, Medium and Soft are built from the shapes
 *             below.
 *   size      the client's own artwork, from `public/header icon/*.svg`,
 *             inlined rather than loaded through `<img>`. Inlining is what
 *             lets `currentColor` reach the strokes, so these answer to
 *             `text-ink/60` and to hover the way every other icon in the menu
 *             does; an `<img>` would have kept the files' baked-in #5A5A5A
 *             and gone on ignoring both. The path data is unchanged.
 *
 * Two earlier attempts at the sizes are recorded so neither is tried again:
 * Tabler's bed glyphs (`TbBedFlat`/`TbBed`), which are the same small
 * rectangle whatever size they name, and figure counts (`TbUser`/`TbUsers`/
 * `TbUsersGroup`), which counted the sleepers but threw the bed away. A drawn
 * bed — headboard, a pillow per sleeper, valance — replaced those and has now
 * itself been replaced by the client's files.
 *
 * ── The mattress construction ───────────────────────────────────────────────
 * One block seen head-on: outline, quilt seam across it, and a row of short
 * strokes filling the band below the seam. Those strokes are the channelled
 * border and they live INSIDE the outline — the drawn beds put their valance
 * outside, and confusing the two is what made the first pass miss.
 *
 * Firm fills the box and is the only one carrying tufting; medium and soft sit
 * low so the thing that qualifies them, a drop and a feather, has room above.
 *
 * ── Weights ─────────────────────────────────────────────────────────────────
 * Neither weight is Tabler's 2, which reads as a blot on drawings this dense.
 * The comfort icons are 0.85 in a 24-unit box; the client's files are 1.15 in
 * a 38-unit one, which lands at the same ~0.9px once both are drawn at menu
 * size. Change one and the other stops matching.
 *
 * Tick counts are a density judgement, not an accuracy one: eight across a
 * mattress closed into a solid comb, six leaves daylight between the strokes.
 */

const STROKE = 0.85;

function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Evenly spread vertical strokes — the mattress border, and the bed valance. */
function Ticks({ y1, y2, from, to, count }) {
  const step = (to - from) / (count - 1);
  return (
    <>
      {Array.from({ length: count }, (_, i) => from + i * step).map((x) => (
        <line key={x} x1={x} y1={y1} x2={x} y2={y2} />
      ))}
    </>
  );
}

/**
 * One mattress block: outline, quilt seam, and the channelled border filling
 * the band beneath it. `tufting` is Firm's alone — the small block under a
 * drop or a feather has no room for buttons that would not just read as dirt.
 */
function Mattress({ y, height, rx, seam, tufting = false }) {
  const bottom = y + height;
  /* Inset well past the corner radius: clearing the curve is the minimum, but
     pulling the row in from both ends is also what keeps six strokes from
     crowding the outline they sit inside. */
  const inset = rx + 3.5;

  return (
    <>
      <rect x="3" y={y} width="18" height={height} rx={rx} />
      <line x1="3" y1={seam} x2="21" y2={seam} />

      {tufting &&
        [6.5, 9.25, 12, 14.75, 17.5].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={y + (seam - y) / 2}
            r="0.45"
            fill="currentColor"
            stroke="none"
          />
        ))}

      <Ticks y1={seam} y2={bottom} from={inset} to={24 - inset} count={6} />
    </>
  );
}

/* ── Comfort ─────────────────────────────────────────────────────────────── */

export function MattressFirmIcon(props) {
  return (
    <Icon {...props}>
      <Mattress y={9} height={8} rx={2.5} seam={13.5} tufting />
    </Icon>
  );
}

export function MattressMediumIcon(props) {
  return (
    <Icon {...props}>
      {/* A drop, apex up, sitting just clear of the mattress below it. */}
      <path d="M12 2.8 C 12 2.8 8.3 7.6 8.3 9.7 A 3.7 3.7 0 0 0 15.7 9.7 C 15.7 7.6 12 2.8 12 2.8 Z" />
      <Mattress y={14} height={5} rx={2} seam={16.4} />
    </Icon>
  );
}

export function MattressSoftIcon(props) {
  return (
    <Icon {...props}>
      {/* A feather laid on the diagonal — the vein is what stops it reading as
          a second drop at a glance. */}
      <path d="M8.2 12.7 C 6.8 8.3 9.9 3.7 16.1 3.3 C 16.7 9.2 13.1 13.3 8.2 12.7 Z" />
      <line x1="8.2" y1="12.7" x2="14.6" y2="6" />
      <Mattress y={14} height={5} rx={2} seam={16.4} />
    </Icon>
  );
}

/* ── Size — the client's artwork ───────────────────────────────────────────
   Straight from `public/header icon/*.svg`, path data untouched. Only two
   things were changed on the way in, and both are about behaving like an icon
   rather than a picture:

     · `stroke="#5A5A5A"` came off every path so the parent's `currentColor`
       reaches them. The two grey `fill`s are kept — they are the pillow faces,
       and they are the one part meant to read as a filled surface.
     · The files ship at two different sizes — Single 26x34, the others 38x33 —
       which at one `1em` box would have made Single visibly larger and the
       three sit at different heights. `SizeIcon` centres each inside one
       38x34 frame instead, so the column lines up. */
const SIZE_BOX = { w: 38, h: 34 };

function SizeIcon({ width, height, children, ...props }) {
  const dx = (SIZE_BOX.w - width) / 2;
  const dy = (SIZE_BOX.h - height) / 2;

  return (
    <svg
      viewBox={`0 0 ${SIZE_BOX.w} ${SIZE_BOX.h}`}
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      /* 1.15 in a 38-unit box ≈ the comfort icons' 0.85 in a 24-unit one. */
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g transform={`translate(${dx} ${dy})`}>{children}</g>
    </svg>
  );
}

export function BedSingleIcon(props) {
  return (
    <SizeIcon width={26} height={34} {...props}>
      <path d="M17.279 1H7.66704C6.84964 1 6.18701 1.66001 6.18701 2.47418V6.89672C6.18701 7.71089 6.84964 8.3709 7.66704 8.3709H17.279C18.0963 8.3709 18.759 7.71089 18.759 6.89672V2.47418C18.759 1.66001 18.0963 1 17.279 1Z" />
      <path d="M18.7905 3.20312H21.7506" />
      <path d="M1 12.7921V4.68031C1 3.86433 1.66383 3.20312 2.48305 3.20312H6.18841" />
      <path d="M20.9873 3.20312H23.2262C24.0454 3.20312 24.7108 3.86583 24.7108 4.68181V7.64069" />
      <path d="M1 14.9946L5.45518 20.5427C6.31514 21.6051 7.81026 21.9537 9.05191 21.3662L24.7107 9.84473" fill="#D9D9D9" stroke="none" />
      <path d="M1 14.9946L5.45518 20.5427C6.31514 21.6051 7.81026 21.9537 9.05191 21.3662L24.7107 9.84473" />
      <path d="M1 14.9946L24.7107 9.84473V31.9709C24.7107 32.7944 24.0423 33.4602 23.2156 33.4602H2.49512C1.66835 33.4602 1 32.7944 1 31.9709V14.9946Z" />
    </SizeIcon>
  );
}

/* Queen and King are the same drawing: `King.svg` and `Queen.svg` are
   byte-identical in `public/header icon/`, so this is shared rather than
   duplicated. Give King its own file and it gets its own component. */
function QueenKingArtwork() {
  return (
    <>
      <path d="M20.3332 28.127V30.7936C20.3332 31.5303 19.7365 32.127 18.9998 32.127C18.2632 32.127 17.6665 31.5303 17.6665 30.7936V26.127" />
      <path d="M25.8903 28.127V30.7936C25.8903 31.5303 25.2936 32.127 24.557 32.127C23.8203 32.127 23.2236 31.5303 23.2236 30.7936V26.127" />
      <path d="M31.4435 28.127V30.7936C31.4435 31.5303 30.8469 32.127 30.1102 32.127C29.3735 32.127 28.7769 31.5303 28.7769 30.7936V26.127" />
      <path d="M20.3335 30.7936C21.1318 29.9952 22.4252 29.9952 23.2235 30.7936" />
      <path d="M25.8901 30.7936C26.6885 29.9952 27.9818 29.9952 28.7785 30.7936" />
      <path d="M31.4453 30.7936C32.2436 29.9952 33.537 29.9952 34.3336 30.7936" />
      <path d="M3.66667 28.1273V30.7939C3.66667 31.5306 3.07 32.1273 2.33333 32.1273C1.59667 32.1273 1 31.5306 1 30.7939V24.7939C1 23.6889 1.895 22.7939 3 22.7939H35C36.105 22.7939 37 23.6889 37 24.7939V30.7939C37 31.5306 36.4033 32.1273 35.6667 32.1273C34.93 32.1273 34.3333 31.5306 34.3333 30.7939V26.1273" />
      <path d="M9.22331 28.127V30.7936C9.22331 31.5303 8.62664 32.127 7.88997 32.127C7.15331 32.127 6.55664 31.5303 6.55664 30.7936V26.127" />
      <path d="M14.7765 28.127V30.7936C14.7765 31.5303 14.1799 32.127 13.4432 32.127C12.7065 32.127 12.1099 31.5303 12.1099 30.7936V26.127" />
      <path d="M3.66699 30.7936C4.46533 29.9952 5.75866 29.9952 6.55699 30.7936" />
      <path d="M9.22314 30.7936C10.0215 29.9952 11.3148 29.9952 12.1115 30.7936" />
      <path d="M14.7783 30.7936C15.5767 29.9952 16.87 29.9952 17.6667 30.7936" />
      <path d="M36.7868 18.072L32.3335 12.4736L31.1535 11.007C30.7268 10.467 30.0601 10.127 29.3201 10.127H28.4868" />
      <path d="M1.21338 18.072L5.66671 12.4736L6.84671 11.007C7.27338 10.467 7.93338 10.127 8.68005 10.127H9.51338" />
      <path d="M20.5135 10.127H17.4868" />
      <path d="M5.6665 9.80712V1.46045H32.3332V9.80878" />
      <path d="M28.6668 9.12695C28.6668 8.02195 27.7718 7.12695 26.6668 7.12695H22.3335C21.2285 7.12695 20.3335 8.02195 20.3335 9.12695V9.46029C20.3335 10.197 20.9302 10.7936 21.6668 10.7936H27.3335C28.0702 10.7936 28.6668 10.197 28.6668 9.46029V9.12695Z" fill="#D9D9D9" />
      <path d="M9.3335 9.12695C9.3335 8.02195 10.2285 7.12695 11.3335 7.12695H15.6668C16.7718 7.12695 17.6668 8.02195 17.6668 9.12695V9.46029C17.6668 10.197 17.0702 10.7936 16.3335 10.7936H10.6668C9.93016 10.7936 9.3335 10.197 9.3335 9.46029V9.12695Z" fill="#D9D9D9" />
      <path d="M4.61667 17.4604H2.33333C1.59667 17.4604 1 18.0571 1 18.7938V21.4604C1 22.1971 1.59667 22.7938 2.33333 22.7938" />
      <path d="M35.6668 22.7938C36.4035 22.7938 37.0002 22.1971 37.0002 21.4604V18.7938C37.0002 18.0571 36.4035 17.4604 35.6668 17.4604H11.8335" />
      <path d="M33.3834 13.7939H4.6167" />
    </>
  );
}

export function BedDoubleIcon(props) {
  return (
    <SizeIcon width={38} height={33} {...props}>
      <QueenKingArtwork />
    </SizeIcon>
  );
}

export function BedTripleIcon(props) {
  return (
    <SizeIcon width={38} height={33} {...props}>
      <QueenKingArtwork />
    </SizeIcon>
  );
}
