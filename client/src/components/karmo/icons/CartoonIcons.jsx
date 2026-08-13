/**
 * Karmo's cartoon icon set.
 *
 * The client asked for "cartoonized" graphics four separate times, so this is
 * the shared language rather than four one-off drawings: get the rules right
 * here and every icon added later matches without anyone having to remember
 * what was decided.
 *
 * ── The rules ──────────────────────────────────────────────────────────────
 *   · 48x48 box, artwork inside 4-44 so nothing touches the edge.
 *   · Flat fills only. No gradients, no strokes doing the drawing — depth
 *     comes from a darker tone of the same colour, never from a shadow blur.
 *   · Everything rounded. `rx` of 2-4 on rectangles, round line caps.
 *   · Five colours, below, and no others. A sixth invented per icon is what
 *     makes a set look assembled rather than drawn.
 *   · A soft ground ellipse under each subject, so the pieces sit rather than
 *     float.
 *
 * ── Why these are not react-icons ──────────────────────────────────────────
 * The set they replace was Feather — one hairline weight, one colour, drawn to
 * disappear. That is the opposite of what was asked for. Feather stays for
 * arrows and chevrons, which are punctuation and should disappear; these are
 * for the places where an icon is carrying meaning on its own.
 *
 * ── Colour and the container ───────────────────────────────────────────────
 * These are full-colour, so they cannot invert to white on a red hover the way
 * a single-colour glyph could. The tile they sit in keeps a soft tint and
 * grows slightly instead — see `StandardStrip`.
 */

/** The whole palette. Add to it deliberately or not at all. */
export const CARTOON = {
  red: "#E60000",
  redDeep: "#B31212",
  gold: "#F5B93F",
  goldDeep: "#DC9A1E",
  cream: "#FBEEE0",
  creamDeep: "#EBD8C3",
  ink: "#3A322C",
  ground: "#3A322C14",
};

/** Shared shell — one place for the box, the ground shadow and sizing. */
function Icon({ children, title }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className="h-full w-full"
    >
      {/* Ground. Drawn first so the subject always sits on top of it. */}
      <ellipse cx="24" cy="41.5" rx="13" ry="2.4" fill={CARTOON.ground} />
      {children}
    </svg>
  );
}

/** 60 Years Strong — an award rosette with two ribbon tails. */
export function IconHeritage({ title }) {
  return (
    <Icon title={title}>
      {/* Tails first, so the medal overlaps them where they meet it. */}
      <path
        d="M17 25.5 12.5 40l5.6-2.6L21 42l4.2-13.5-8.2-3Z"
        fill={CARTOON.redDeep}
      />
      <path
        d="M31 25.5 35.5 40l-5.6-2.6L27 42l-4.2-13.5 8.2-3Z"
        fill={CARTOON.red}
      />
      <circle cx="24" cy="19" r="13" fill={CARTOON.goldDeep} />
      <circle cx="24" cy="17.7" r="11.4" fill={CARTOON.gold} />
      <circle cx="24" cy="17.7" r="7.6" fill={CARTOON.cream} />
      {/* A star, not a "60" — numerals at this size turn to mush, and the
          figure is already spelled out in the heading beside it. */}
      <path
        d="M24 11.4l1.85 3.9 4.15.6-3 3 .7 4.3L24 21.2l-3.7 2-.7-4.3-3-3 4.15-.6L24 11.4Z"
        fill={CARTOON.red}
      />
    </Icon>
  );
}

/** Market Leader in Foam — three foam slabs, stacked. */
export function IconFoamStack({ title }) {
  return (
    <Icon title={title}>
      {/* Bottom slab */}
      <rect x="7" y="30" width="34" height="9" rx="3" fill={CARTOON.redDeep} />
      <rect x="7" y="30" width="34" height="6.4" rx="3" fill={CARTOON.red} />
      {/* Middle slab */}
      <rect x="9.5" y="21" width="29" height="9" rx="3" fill={CARTOON.goldDeep} />
      <rect x="9.5" y="21" width="29" height="6.4" rx="3" fill={CARTOON.gold} />
      {/* Top slab */}
      <rect x="12" y="12" width="24" height="9" rx="3" fill={CARTOON.creamDeep} />
      <rect x="12" y="12" width="24" height="6.4" rx="3" fill={CARTOON.cream} />
      {/* Two pores, so the top slab reads as foam and not as a box. */}
      <circle cx="19" cy="15.2" r="1.15" fill={CARTOON.creamDeep} />
      <circle cx="26.5" cy="16" r="0.9" fill={CARTOON.creamDeep} />
    </Icon>
  );
}

/** Stockists Nationwide — a map pin. */
export function IconStockists({ title }) {
  return (
    <Icon title={title}>
      <path
        d="M24 6c-6.6 0-12 5.2-12 11.7 0 8.4 9.9 18.3 11.2 19.6a1.1 1.1 0 0 0 1.6 0C26.1 36 36 26.1 36 17.7 36 11.2 30.6 6 24 6Z"
        fill={CARTOON.redDeep}
      />
      <path
        d="M24 6c-6.6 0-12 5.2-12 11.7 0 6.6 6.1 14.1 9.5 17.8L24 6Z"
        fill={CARTOON.red}
      />
      <circle cx="24" cy="17.4" r="6" fill={CARTOON.cream} />
      <circle cx="24" cy="17.4" r="2.8" fill={CARTOON.gold} />
    </Icon>
  );
}

/** Safe Delivery — a box truck. */
export function IconDelivery({ title }) {
  return (
    <Icon title={title}>
      {/* Cargo body */}
      <rect x="5" y="15" width="23" height="17" rx="3.2" fill={CARTOON.creamDeep} />
      <rect x="5" y="15" width="23" height="12" rx="3.2" fill={CARTOON.cream} />
      {/* Strap, so the box reads as cargo. */}
      <rect x="14.5" y="15" width="4" height="17" fill={CARTOON.goldDeep} opacity="0.55" />
      {/* Cab */}
      <path
        d="M28 20h6.4a3 3 0 0 1 2.5 1.35l4.1 6.2a3 3 0 0 1 .5 1.65V32H28V20Z"
        fill={CARTOON.redDeep}
      />
      <path d="M28 20h6.4a3 3 0 0 1 2.5 1.35L39 24H28v-4Z" fill={CARTOON.red} />
      {/* Window */}
      <path
        d="M30.5 22h3.6a1 1 0 0 1 .84.46l1.9 2.9c.22.33-.02.77-.42.77H30.5a.9.9 0 0 1-.9-.9v-2.33c0-.5.4-.9.9-.9Z"
        fill={CARTOON.cream}
      />
      {/* Wheels */}
      <circle cx="14" cy="34" r="4.6" fill={CARTOON.ink} />
      <circle cx="14" cy="34" r="1.9" fill={CARTOON.cream} />
      <circle cx="34" cy="34" r="4.6" fill={CARTOON.ink} />
      <circle cx="34" cy="34" r="1.9" fill={CARTOON.cream} />
    </Icon>
  );
}
