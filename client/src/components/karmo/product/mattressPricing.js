/**
 * Client sales calculator — inch-based SFT / CFT quotes per Matrexx SKU.
 * Rates and formulas come from the client's calculator screenshots.
 */

export const DISCOUNT_OPTIONS = [10, 15, 20, 25];

/** Minimum billable footprint for CFT models (inch). */
const MIN_BILL = { length: 78, width: 36 };

/** Area threshold for Pillow / Euro Top SFT rate tiers (inch). */
const SFT_TIER = { length: 78, width: 48 };

function applyMinBill(length, width) {
  if (length < MIN_BILL.length || width < MIN_BILL.width) {
    return { length: MIN_BILL.length, width: MIN_BILL.width };
  }
  return { length, width };
}

function quoteSft(length, width, rate) {
  return (length * width) / 144 * rate;
}

function quoteCft(length, width, height, rate) {
  return (length * width * height) / 1728 * rate;
}

/**
 * @typedef {object} PricingRule
 * @property {"sft"|"cft"} mode
 * @property {number} [heightFixed]
 * @property {number} [heightMin]
 * @property {number} [heightMax]
 * @property {number[]} [heightOptions]
 * @property {boolean} [minBill]
 * @property {number} [cftRate]
 * @property {(l:number,w:number,h:number)=>number} [sftRate]
 * @property {string[]} notes
 */

/** @type {Record<string, PricingRule>} */
export const PRICING_RULES = {
  "pillow-top-pocket-spring": {
    mode: "sft",
    heightFixed: 12,
    sftRate: (l, w) => (l * w <= SFT_TIER.length * SFT_TIER.width ? 1500 : 1350),
    notes: [
      "Height is fixed at 12 inch.",
      "78×48 inch or smaller — ৳1500 / SFT; larger — ৳1350 / SFT.",
      "Formula: Length × Width ÷ 144 × SFT Price",
    ],
  },
  "euro-top-pocket-spring": {
    mode: "sft",
    heightFixed: 12,
    sftRate: (l, w) => (l * w <= SFT_TIER.length * SFT_TIER.width ? 1400 : 1250),
    notes: [
      "Height is fixed at 12 inch.",
      "78×48 inch or smaller — ৳1400 / SFT; larger — ৳1250 / SFT.",
      "Formula: Length × Width ÷ 144 × SFT Price",
    ],
  },
  "bonnell-spring": {
    mode: "sft",
    heightOptions: [8, 10],
    sftRate: (_l, _w, h) => (Number(h) === 10 ? 610 : 500),
    notes: [
      "8 inch height — ৳500 / SFT; 10 inch height — ৳610 / SFT.",
      "Formula: Length × Width ÷ 144 × SFT Price",
    ],
  },
  king: {
    mode: "cft",
    heightMin: 4,
    heightMax: 12,
    cftRate: 875,
    minBill: true,
    notes: [
      "Height ranges from 4 inch to 12 inch.",
      "৳875 CFT Price.",
      "Sizes below 78×36 inch are billed as 78×36 inch.",
      "Formula: Length × Width × Height ÷ 1728 × CFT Price",
    ],
  },
  prestige: {
    mode: "cft",
    heightMin: 4,
    heightMax: 12,
    cftRate: 950,
    minBill: true,
    notes: [
      "Height ranges from 4 inch to 12 inch.",
      "৳950 CFT Price.",
      "Sizes below 78×36 inch are billed as 78×36 inch.",
      "Formula: Length × Width × Height ÷ 1728 × CFT Price",
    ],
  },
  orthopedic: {
    mode: "cft",
    heightMin: 4,
    heightMax: 12,
    cftRate: 1100,
    minBill: true,
    notes: [
      "Height ranges from 4 inch to 12 inch.",
      "৳1100 CFT Price.",
      "Sizes below 78×36 inch are billed as 78×36 inch.",
      "Formula: Length × Width × Height ÷ 1728 × CFT Price",
    ],
  },
  "imperial-eurotop": {
    mode: "cft",
    heightFixed: 5,
    cftRate: 1200,
    minBill: true,
    notes: [
      "Height is fixed at 5 inch.",
      "৳1200 CFT Price.",
      "Sizes below 78×36 inch are billed as 78×36 inch.",
      "Formula: Length × Width × Height ÷ 1728 × CFT Price",
    ],
  },
};

export function getPricingRule(slug) {
  return PRICING_RULES[slug] || null;
}

/** Default height for a SKU (inch). */
export function defaultHeightFor(slug) {
  const rule = getPricingRule(slug);
  if (!rule) return 8;
  if (rule.heightFixed != null) return rule.heightFixed;
  if (rule.heightOptions?.length) return rule.heightOptions[0];
  if (rule.heightMin != null) return rule.heightMin;
  return 8;
}

/** Inch size chips — height follows the product rule. */
export function sizePresetsFor(slug) {
  const h = defaultHeightFor(slug);

  /* Catalogue Queen base footprint for all SKUs (King list price uses 81×69). */
  return [
    { id: "single", label: "36×75", note: "Single", w: 36, l: 75, h },
    { id: "double", label: "48×75", note: "Double", w: 48, l: 75, h },
    { id: "queen", label: "69×81", note: "Queen", w: 69, l: 81, h },
    { id: "king", label: "72×80", note: "King", w: 72, l: 80, h },
    { id: "custom", label: "Custom", note: "Enter inch", w: 69, l: 81, h },
  ];
}

/**
 * Quote a mattress from the client sales formulas.
 * @returns {{ ok: boolean, base: number, total: number, discountPct: number, billL: number, billW: number, billH: number, rate: number|null, mode: string|null }}
 */
export function quoteMattressPrice(
  slug,
  { length, width, height, discountPct = 0 } = {}
) {
  const rule = getPricingRule(slug);
  let l = Math.max(0, Number(length) || 0);
  let w = Math.max(0, Number(width) || 0);
  let h = Math.max(0, Number(height) || 0);

  if (!rule || !l || !w) {
    return {
      ok: false,
      base: 0,
      total: 0,
      discountPct: 0,
      billL: l,
      billW: w,
      billH: h,
      rate: null,
      mode: rule?.mode || null,
    };
  }

  if (rule.heightFixed != null) {
    h = rule.heightFixed;
  } else if (rule.heightOptions?.length) {
    h = rule.heightOptions.reduce((best, opt) =>
      Math.abs(opt - h) < Math.abs(best - h) ? opt : best
    );
  } else {
    if (rule.heightMin != null) h = Math.max(rule.heightMin, h);
    if (rule.heightMax != null) h = Math.min(rule.heightMax, h);
  }

  if (!h) {
    return {
      ok: false,
      base: 0,
      total: 0,
      discountPct: 0,
      billL: l,
      billW: w,
      billH: h,
      rate: null,
      mode: rule.mode,
    };
  }

  if (rule.minBill) {
    ({ length: l, width: w } = applyMinBill(l, w));
  }

  let rate = null;
  let base = 0;
  if (rule.mode === "sft") {
    rate = rule.sftRate(l, w, h);
    base = quoteSft(l, w, rate);
  } else {
    rate = rule.cftRate;
    base = quoteCft(l, w, h, rate);
  }

  base = Math.round(base);
  const pct = DISCOUNT_OPTIONS.includes(Number(discountPct))
    ? Number(discountPct)
    : Math.max(0, Number(discountPct) || 0);
  const total = Math.round(base * (1 - pct / 100));

  return {
    ok: true,
    base,
    total,
    discountPct: pct,
    billL: l,
    billW: w,
    billH: h,
    rate,
    mode: rule.mode,
  };
}

/**
 * Scale a catalogue list MRP / offer price by the formula quote vs a reference size.
 * At the reference size, listMrp / listOffer show exactly (e.g. King ৳11,339 / ৳9,622).
 */
export function quoteMattressListPrice(
  slug,
  {
    length,
    width,
    height,
    discountPct = 0,
    listMrp = 0,
    listOffer = 0,
    refLength,
    refWidth,
    refHeight,
  } = {}
) {
  const raw = quoteMattressPrice(slug, {
    length,
    width,
    height,
    discountPct: 0,
  });
  if (!raw.ok) return { ...raw, discountPct: Number(discountPct) || 0 };

  const mrp = Math.round(Number(listMrp) || 0);
  const offer = Math.round(Number(listOffer) || 0);
  if (!mrp) {
    return quoteMattressPrice(slug, { length, width, height, discountPct });
  }

  const ref = quoteMattressPrice(slug, {
    length: refLength ?? length,
    width: refWidth ?? width,
    height: refHeight ?? height,
    discountPct: 0,
  });
  const scale = ref.ok && ref.base ? raw.base / ref.base : 1;
  const base = Math.round(mrp * scale);
  const pct = DISCOUNT_OPTIONS.includes(Number(discountPct))
    ? Number(discountPct)
    : Math.max(0, Number(discountPct) || 0);

  const catalogPct =
    offer && mrp > offer ? Math.round(((mrp - offer) / mrp) * 100) : null;

  let total;
  if (catalogPct != null && pct === catalogPct && offer) {
    total = Math.round(offer * scale);
  } else if (pct > 0) {
    total = Math.round(base * (1 - pct / 100));
  } else {
    total = base;
  }

  return {
    ...raw,
    ok: true,
    base,
    total,
    discountPct: pct,
  };
}
