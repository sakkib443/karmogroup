"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Theme Control — a preview panel for the homepage only.
 *
 * The client could not settle on a typeface from description ("need better font
 * and size"), so this puts the choice in their hands: pick a face for each of
 * the three roles, nudge the scale, look at the real page. It replaces the
 * two-option switcher that was here.
 *
 * ── The four roles ─────────────────────────────────────────────────────────
 *   Hero Section Heading   `.hero-heading`   the hero slide line
 *   Section Heading        `.section-heading` + h1/h2/h3 elsewhere
 *   Sub-heading            h4, h5, h6        card titles and small labels
 *   Description            everything else   body copy, buttons, captions
 *
 * They are separate variables rather than one, because the pairing is the
 * decision — a display face that works over a photograph is usually the wrong
 * thing to read a paragraph in.
 *
 * Hero and Section split out of a single "Heading" role at the client's ask.
 * The hero line sits over a photograph and is read at a glance; the section
 * titles label the bands below it and are read in sequence, so a scale that
 * suits one overshoots the other. Each now carries its own face, scale, weight
 * and width. The section titles themselves were levelled at the same time —
 * every band's `h2` shares one `.section-heading` rule in `globals.css`
 * instead of the eleven different sizes and weights they had grown.
 *
 * ── Why the scale moves the root font size ─────────────────────────────────
 * Not a `zoom` on the wrapper: that would scale the photographs and the layout
 * with the type, which is not what "font size" means. Setting the root size
 * moves every `rem` on the page and leaves everything else where it is.
 * Anything written in px is deliberately fixed and stays fixed — the small
 * tracked labels, mostly.
 *
 * ── Homepage only ──────────────────────────────────────────────────────────
 * Mounted from this route group's layout, and the root font size is put back
 * on unmount, so leaving the homepage leaves no trace on the rest of the site.
 *
 * The choice is remembered in localStorage so a reload does not lose it. When
 * the client settles, write the winner into `src/config/brand.ts` and this
 * whole panel can go.
 */

const STORAGE_KEY = "karmo-theme-control";

/** Twenty-six faces — workhorses only, nothing script or novelty. */
export const FONT_IDS = [
  "manrope",
  "josefin",
  "inter",
  "jakarta",
  "dmsans",
  "outfit",
  "poppins",
  "montserrat",
  "worksans",
  "sora",
  "urbanist",
  "figtree",
  "lexend",
  "spacegrotesk",
  "playfair",
  "lora",
  "opensans",
  "roboto",
  "sourcesans",
  "ibmplex",
  "publicsans",
  "librefranklin",
  "mulish",
  "raleway",
  "karla",
  "barlow",
];

const LABELS = {
  manrope: "Manrope",
  josefin: "Josefin Sans",
  inter: "Inter",
  jakarta: "Plus Jakarta Sans",
  dmsans: "DM Sans",
  outfit: "Outfit",
  poppins: "Poppins",
  montserrat: "Montserrat",
  worksans: "Work Sans",
  sora: "Sora",
  urbanist: "Urbanist",
  figtree: "Figtree",
  lexend: "Lexend",
  spacegrotesk: "Space Grotesk",
  playfair: "Playfair Display",
  lora: "Lora",
  opensans: "Open Sans",
  roboto: "Roboto",
  sourcesans: "Source Sans 3",
  ibmplex: "IBM Plex Sans",
  publicsans: "Public Sans",
  librefranklin: "Libre Franklin",
  mulish: "Mulish",
  raleway: "Raleway",
  karla: "Karla",
  barlow: "Barlow",
};

/** A short note on what each one is for, so the choice is not blind. */
const NOTES = {
  manrope: "Neutral, modern",
  josefin: "Geometric, tall",
  inter: "Screen-first, plain",
  jakarta: "Warm geometric",
  dmsans: "Soft, low contrast",
  outfit: "Wide geometric",
  poppins: "Round geometric",
  montserrat: "Broad, urban",
  worksans: "Sturdy, neutral",
  sora: "Premium, technical",
  urbanist: "Clean, refined",
  figtree: "Friendly, corporate",
  lexend: "Open, very legible",
  spacegrotesk: "Sharp, contemporary",
  playfair: "Editorial serif",
  lora: "Warm reading serif",
  opensans: "Classic, clear",
  roboto: "System, familiar",
  sourcesans: "Adobe, precise",
  ibmplex: "Corporate, solid",
  publicsans: "Government, plain",
  librefranklin: "News, sturdy",
  mulish: "Quiet, readable",
  raleway: "Elegant sans",
  karla: "Soft humanist",
  barlow: "Condensed, strong",
};

/**
 * Heading weight, and "auto" is the default for a reason.
 *
 * The headings on this page are not one weight — several set a light face
 * against a bold phrase in the same line ("One group, **four crafts**"). An
 * override has to be `!important` to beat Tailwind's `font-bold!`, which means
 * it flattens that contrast wherever it applies. So it applies only once the
 * client picks a number; left alone, the page keeps the weights it was drawn
 * with.
 */
const WEIGHTS = [
  { value: "auto", label: "Auto (as designed)" },
  { value: "300", label: "300 · Light" },
  { value: "400", label: "400 · Regular" },
  { value: "500", label: "500 · Medium" },
  { value: "600", label: "600 · Semibold" },
  { value: "700", label: "700 · Bold" },
];

const SCALES = [0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3, 1.4];

/** Max-width for a heading block — caps the measure so a long line wraps
 *  where the client wants it, rather than running the width of the column.
 *  "Full" removes the cap, which is how every heading was drawn. */
const WIDTHS = [
  { value: "none", label: "Full width" },
  { value: "38rem", label: "Wide · 38rem" },
  { value: "30rem", label: "Medium · 30rem" },
  { value: "24rem", label: "Narrow · 24rem" },
  { value: "18rem", label: "Tight · 18rem" },
];

/**
 * The four roles, in the order they read down the panel.
 *
 * Hero and Section were one "Heading" role until the client asked to size them
 * apart: the hero line sits over a photograph and is read at a glance, the
 * section titles label the bands below and are read in sequence, so a scale
 * that suits one usually overshoots the other. They are now separate faces,
 * separate scales, separate weights and separate widths.
 */
const ROLES = [
  { key: "hero", label: "Hero Section Heading", hint: "the hero slide line" },
  { key: "heading", label: "Section Heading", hint: "every section title" },
  { key: "sub", label: "Sub-heading", hint: "h4 · h5 · h6" },
  { key: "body", label: "Description", hint: "body, buttons, captions" },
];

const DEFAULTS = {
  hero: "josefin",
  heading: "josefin",
  sub: "josefin",
  body: "manrope",
  sizeHero: 1,
  sizeHeading: 1,
  sizeSub: 1,
  sizeBody: 1,
  weightHero: "auto",
  weightHeading: "auto",
  widthHero: "none",
  widthHeading: "none",
};

const SIZE_KEY = {
  hero: "sizeHero",
  heading: "sizeHeading",
  sub: "sizeSub",
  body: "sizeBody",
};
const WEIGHT_KEY = { hero: "weightHero", heading: "weightHeading" };
const WIDTH_KEY = { hero: "widthHero", heading: "widthHeading" };

export default function ThemeControl({ children, families, classNames }) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState(DEFAULTS);
  const rootRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        const face = (v, d) => (FONT_IDS.includes(v) ? v : d);
        const size = (v, d) => (SCALES.includes(v) ? v : d);
        const weight = (v, d) =>
          WEIGHTS.some((w) => w.value === v) ? v : d;
        const width = (v, d) => (WIDTHS.some((w) => w.value === v) ? v : d);
        setCfg({
          hero: face(saved.hero, DEFAULTS.hero),
          heading: face(saved.heading, DEFAULTS.heading),
          sub: face(saved.sub, DEFAULTS.sub),
          body: face(saved.body, DEFAULTS.body),
          sizeHero: size(saved.sizeHero, DEFAULTS.sizeHero),
          sizeHeading: size(saved.sizeHeading, DEFAULTS.sizeHeading),
          sizeSub: size(saved.sizeSub, DEFAULTS.sizeSub),
          sizeBody: size(saved.sizeBody, DEFAULTS.sizeBody),
          weightHero: weight(saved.weightHero, DEFAULTS.weightHero),
          weightHeading: weight(saved.weightHeading, DEFAULTS.weightHeading),
          widthHero: width(saved.widthHero, DEFAULTS.widthHero),
          widthHeading: width(saved.widthHeading, DEFAULTS.widthHeading),
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Heading weight, written inline.
   *
   * A rule in globals.css cannot do this: Tailwind emits `font-bold!` as an
   * `!important` declaration inside `@layer utilities`, and for `!important`
   * the cascade reverses layer order — a layered `!important` beats an
   * unlayered one no matter how specific the selector. Inline sits above all
   * layers, so this is the only place the override actually lands.
   *
   * Reapplied whenever the weight changes, and cleared on "auto" so the
   * drawn weights come straight back.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    // The hero line carries `.hero-heading`; everything else is a section
    // title. Split so the two weights can differ.
    const all = [...root.querySelectorAll("h1, h2, h3, h1 *, h2 *, h3 *")];
    const isHero = (n) => n.closest(".hero-heading");
    const groups = [
      [all.filter(isHero), cfg.weightHero],
      [all.filter((n) => !isHero(n)), cfg.weightHeading],
    ];

    for (const [nodes, weight] of groups) {
      for (const node of nodes) {
        if (weight === "auto") node.style.removeProperty("font-weight");
        else node.style.setProperty("font-weight", weight, "important");
      }
    }

    return () => {
      for (const node of all) node.style.removeProperty("font-weight");
    };
  }, [
    cfg.weightHero,
    cfg.weightHeading,
    cfg.hero,
    cfg.heading,
    cfg.sizeHero,
    cfg.sizeHeading,
  ]);

  const set = (patch) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const stack = (id) => `${families[id]}, "Hind Siliguri", sans-serif`;

  const style = {
    "--font-family": stack(cfg.body),
    "--font-hero": stack(cfg.hero),
    "--font-heading": stack(cfg.heading),
    "--font-subheading": stack(cfg.sub),
    "--type-zoom-hero": cfg.sizeHero,
    "--type-zoom-heading": cfg.sizeHeading,
    "--type-zoom-sub": cfg.sizeSub,
    "--type-zoom-body": cfg.sizeBody,
    "--hero-heading-max": cfg.widthHero,
    "--section-heading-max": cfg.widthHeading,
  };

  const step = (role, dir) => {
    const key = SIZE_KEY[role];
    const at = SCALES.indexOf(cfg[key]);
    const next = SCALES[Math.min(SCALES.length - 1, Math.max(0, at + dir))];
    if (next !== cfg[key]) set({ [key]: next });
  };

  return (
    <div ref={rootRef} className={`home-two-type ${classNames}`} style={style}>
      {children}

      {/* Fixed to the right, under the header, where the old switcher sat. */}
      <div className="fixed right-3 top-[128px] z-[1000] sm:right-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded border border-ink/15 bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-brand hover:text-brand sm:text-[11px]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h10M4 17h7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Theme Control
        </button>

        {open ? (
          <div className="mt-1.5 w-[15.5rem] rounded border border-ink/15 bg-white p-3 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.45)]">
            {ROLES.map(({ key, label, hint }, i) => {
              const size = cfg[SIZE_KEY[key]];
              const at = SCALES.indexOf(size);
              return (
                <div
                  key={key}
                  className={i > 0 ? "mt-3 border-t border-ink/10 pt-3" : ""}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45">
                    {label}
                    <span className="ml-1.5 font-medium normal-case tracking-normal text-ink/30">
                      {hint}
                    </span>
                  </p>

                  <select
                    value={cfg[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                    aria-label={`${label} font`}
                    className="mt-1.5 w-full cursor-pointer rounded border border-ink/15 bg-white px-2 py-1.5 text-[11px] text-ink outline-none focus:border-brand"
                  >
                    {FONT_IDS.map((id) => (
                      <option key={id} value={id}>
                        {LABELS[id]} — {NOTES[id]}
                      </option>
                    ))}
                  </select>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Step
                      onClick={() => step(key, -1)}
                      disabled={at <= 0}
                      label={`${label} smaller`}
                    >
                      &minus;
                    </Step>
                    <span className="flex-1 text-center text-[11px] font-semibold tabular-nums text-ink">
                      {Math.round(size * 100)}%
                    </span>
                    <Step
                      onClick={() => step(key, 1)}
                      disabled={at >= SCALES.length - 1}
                      label={`${label} larger`}
                    >
                      +
                    </Step>
                  </div>

                  {/* Weight and width, headings only — see the note by
                      WEIGHTS. Hero and Section each carry their own pair. */}
                  {WEIGHT_KEY[key] ? (
                    <>
                      <select
                        value={cfg[WEIGHT_KEY[key]]}
                        onChange={(e) =>
                          set({ [WEIGHT_KEY[key]]: e.target.value })
                        }
                        aria-label={`${label} weight`}
                        className="mt-1.5 w-full cursor-pointer rounded border border-ink/15 bg-white px-2 py-1.5 text-[11px] text-ink outline-none focus:border-brand"
                      >
                        {WEIGHTS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>

                      <select
                        value={cfg[WIDTH_KEY[key]]}
                        onChange={(e) =>
                          set({ [WIDTH_KEY[key]]: e.target.value })
                        }
                        aria-label={`${label} width`}
                        className="mt-1.5 w-full cursor-pointer rounded border border-ink/15 bg-white px-2 py-1.5 text-[11px] text-ink outline-none focus:border-brand"
                      >
                        {WIDTHS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => set(DEFAULTS)}
              className="mt-3 w-full rounded border border-ink/15 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/60 transition-colors hover:border-brand hover:text-brand"
            >
              Reset
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Step({ children, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded border border-ink/15 text-[13px] font-bold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
