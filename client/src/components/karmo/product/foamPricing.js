/**
 * Foam sales calculator — inch-based CFT quotes per Karmo Foam combo SKU.
 * Placeholder rates for catalogue; confirm with sales before launch.
 */

export const FOAM_DISCOUNT_OPTIONS = [10, 15, 20, 25];

const MIN_BILL = { length: 36, width: 24 };

function applyMinBill(length, width) {
  if (length < MIN_BILL.length || width < MIN_BILL.width) {
    return { length: MIN_BILL.length, width: MIN_BILL.width };
  }
  return { length, width };
}

function quoteCft(length, width, height, rate) {
  return ((length * width * height) / 1728) * rate;
}

/** @type {Record<string, { mode: "cft", heightMin: number, heightMax: number, cftRate: number, minBill: boolean, notes: string[] }>} */
export const FOAM_PRICING_RULES = {
  "combo-280": {
    mode: "cft",
    heightMin: 2,
    heightMax: 8,
    cftRate: 720,
    minBill: true,
    notes: ["Firm rubber-grade. Height 2–8 inch. ৳720 / CFT."],
  },
  "combo-2001": {
    mode: "cft",
    heightMin: 2,
    heightMax: 8,
    cftRate: 680,
    minBill: true,
    notes: ["Balanced furniture grade. Height 2–8 inch. ৳680 / CFT."],
  },
  "combo-4g": {
    mode: "cft",
    heightMin: 2,
    heightMax: 6,
    cftRate: 700,
    minBill: true,
    notes: ["Fast-rebound maker grade. Height 2–6 inch. ৳700 / CFT."],
  },
  "combo-1965": {
    mode: "cft",
    heightMin: 2,
    heightMax: 8,
    cftRate: 780,
    minBill: true,
    notes: ["Heritage pure rubber. Height 2–8 inch. ৳780 / CFT."],
  },
  "combo-signature": {
    mode: "cft",
    heightMin: 2,
    heightMax: 8,
    cftRate: 920,
    minBill: true,
    notes: ["Premium density. Height 2–8 inch. ৳920 / CFT."],
  },
  "rebonded-set": {
    mode: "cft",
    heightMin: 2,
    heightMax: 6,
    cftRate: 540,
    minBill: true,
    notes: ["Rebonded firm base. Height 2–6 inch. ৳540 / CFT."],
  },
};

export function getFoamPricingRule(slug) {
  return FOAM_PRICING_RULES[slug] || null;
}

export function defaultFoamHeightFor(slug) {
  const rule = getFoamPricingRule(slug);
  if (!rule) return 4;
  return rule.heightMin ?? 4;
}

/** Sheet / cushion size chips — height follows the grade rule. */
export function foamSizePresetsFor(slug) {
  const h = defaultFoamHeightFor(slug);
  return [
    { id: "single", label: "24×36", note: "Cushion", w: 24, l: 36, h },
    { id: "double", label: "36×48", note: "Seat", w: 36, l: 48, h },
    { id: "queen", label: "48×72", note: "Sofa set", w: 48, l: 72, h },
    { id: "king", label: "60×80", note: "Full sheet", w: 60, l: 80, h },
    { id: "custom", label: "Custom", note: "Enter inch", w: 48, l: 72, h },
  ];
}

export function quoteFoamPrice(
  slug,
  { length, width, height, discountPct = 0 } = {}
) {
  const rule = getFoamPricingRule(slug);
  let l = Math.max(0, Number(length) || 0);
  let w = Math.max(0, Number(width) || 0);
  let h = Math.max(0, Number(height) || 0);

  if (!rule || !l || !w || !h) {
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

  if (rule.heightMin != null) h = Math.max(rule.heightMin, h);
  if (rule.heightMax != null) h = Math.min(rule.heightMax, h);
  if (rule.minBill) ({ length: l, width: w } = applyMinBill(l, w));

  const rate = rule.cftRate;
  const base = Math.round(quoteCft(l, w, h, rate));
  const pct = Math.max(0, Number(discountPct) || 0);
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
    mode: "cft",
  };
}

/** Scale catalogue list MRP/offer with size vs Queen reference. */
export function quoteFoamListPrice(
  slug,
  {
    length,
    width,
    height,
    discountPct = 15,
    listMrp,
    listOffer,
    refLength = 48,
    refWidth = 72,
    refHeight,
  } = {}
) {
  const rule = getFoamPricingRule(slug);
  const hRef = refHeight || defaultFoamHeightFor(slug);
  const bare = quoteFoamPrice(slug, {
    length,
    width,
    height,
    discountPct: 0,
  });
  const refBare = quoteFoamPrice(slug, {
    length: refLength,
    width: refWidth,
    height: hRef,
    discountPct: 0,
  });

  if (!bare.ok || !refBare.ok || !refBare.base || !listMrp) {
    return quoteFoamPrice(slug, { length, width, height, discountPct });
  }

  const scale = bare.base / refBare.base;
  const base = Math.round(Number(listMrp) * scale);
  const catalogOffer = listOffer ? Math.round(Number(listOffer) * scale) : null;
  const pct = Math.max(0, Number(discountPct) || 0);
  let total = Math.round(base * (1 - pct / 100));
  if (catalogOffer != null && pct === 15) total = catalogOffer;

  return {
    ok: true,
    base,
    total,
    discountPct: pct,
    billL: bare.billL,
    billW: bare.billW,
    billH: bare.billH,
    rate: rule?.cftRate ?? null,
    mode: "cft",
  };
}
