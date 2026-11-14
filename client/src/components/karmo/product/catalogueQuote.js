/**
 * The one price of a Karmo catalogue line (mattress, foam). The product pages show
 * it, and /api/catalogue-quote gives the same answer to the order server, which
 * refuses a checkout whose price differs. So the page and the order can never disagree.
 * Pure: no React, no data lookups — safe in the browser and on the server.
 */
import { getPricingRule, quoteMattressListPrice, quoteMattressPrice } from "./mattressPricing";
import { getFoamPricingRule, quoteFoamListPrice, quoteFoamPrice } from "./foamPricing";

/** The website's standing sales discount. */
export const OFFER_PCT = 15;

/** The size the catalogue was/now prices are quoted at (Queen, else the first preset). */
const refSizeOf = (product) => (product.sizes || []).find((s) => s.id === "queen") || (product.sizes || [])[0];

/** Every furniture foam — Poly included — is sold cut-to-size through the
 *  FoamHero buy box, so no SKU is treated as a fixed poster set any more. */
export const isFoamSet = () => false;

/**
 * The mattress buy box (ProductHero). A product with no sales-calculator rule is sold
 * by the piece at the catalogue price; the rest are priced by size, anchored to the
 * catalogue was/now at the Queen size.
 */
export function quoteMattressUnit(product, { width, length, height } = {}) {
  const discountPct = OFFER_PCT;
  const isFoam = product.pricingFamily === "foam";
  const rule = isFoam ? getFoamPricingRule(product.slug) : getPricingRule(product.slug);
  const listMrp = product.mrp || 0;
  const listOffer = product.price || 0;

  if (!rule) {
    const base = listMrp || listOffer;
    if (!base) return { ok: false, base: 0, total: 0, discountPct };
    const catalogPct =
      listOffer && listMrp > listOffer ? Math.round(((listMrp - listOffer) / listMrp) * 100) : null;
    let total = base;
    if (catalogPct != null && discountPct === catalogPct && listOffer) {
      total = listOffer;
    } else if (discountPct) {
      total = Math.round(base * (1 - discountPct / 100));
    }
    return { ok: true, base, total, discountPct };
  }

  if (listMrp) {
    const ref = refSizeOf(product);
    const listArgs = {
      length,
      width,
      height,
      discountPct,
      listMrp,
      listOffer,
      refLength: ref?.l,
      refWidth: ref?.w,
      refHeight: ref?.h || product.defaultHeight,
    };
    return isFoam ? quoteFoamListPrice(product.slug, listArgs) : quoteMattressListPrice(product.slug, listArgs);
  }

  return isFoam
    ? quoteFoamPrice(product.slug, { length, width, height, discountPct })
    : quoteMattressPrice(product.slug, { length, width, height, discountPct });
}

/** The foam buy box (FoamHero): cut to size, or by the piece when there is no rule. */
export function quoteFoamUnit(product, { width, length, height } = {}) {
  const listMrp = product.mrp || 0;
  const listOffer = product.price || 0;
  if (!getFoamPricingRule(product.slug)) {
    const base = listMrp || listOffer;
    if (!base) return { ok: false, total: 0, base: 0 };
    const total = listOffer && listMrp > listOffer ? listOffer : Math.round(base * (1 - OFFER_PCT / 100));
    return { ok: true, total, base };
  }
  const ref = refSizeOf(product);
  return listMrp
    ? quoteFoamListPrice(product.slug, {
        length, width, height, discountPct: OFFER_PCT, listMrp, listOffer,
        refLength: ref?.l, refWidth: ref?.w, refHeight: ref?.h || product.defaultHeight,
      })
    : quoteFoamPrice(product.slug, { length, width, height, discountPct: OFFER_PCT });
}

/** A foam combo set, as the catalogue lists it. */
export const FOAM_SET_PARTS = {
  sit: { label: "Only Sit Foam", pieces: 5, length: 22, width: 22, height: 4 },
  back: { label: "Only Back Foam", pieces: 5, length: 22, width: 18, height: 3 },
};

const cftOf = ({ length, width, height, pieces = 1 }) => (pieces * length * width * height) / 1728;
const SET_CFT = cftOf(FOAM_SET_PARTS.sit) + cftOf(FOAM_SET_PARTS.back);

/** Sold as five sit and five back pieces, so either half can be bought alone. */
export const hasFoamParts = (product) => Boolean(getFoamPricingRule(product?.slug)) && (product?.specs || []).includes("5 sit + 5 back");

/** Only the sit or back half: the grade's set price, shared out by foam volume. */
export function quoteFoamPart(product, option) {
  const part = FOAM_SET_PARTS[option];
  const ref = refSizeOf(product);
  if (!part || !hasFoamParts(product) || !ref) return { ok: false, total: 0, base: 0 };
  const set = quoteFoamUnit(product, { length: ref.l, width: ref.w, height: ref.h || product.defaultHeight });
  const share = cftOf(part) / SET_CFT;
  return { ok: !!set.ok, total: Math.round(set.total * share), base: Math.round(set.base * share) };
}

const KG_PER_CFT_AT_1_DENSITY = 0.0283168;
/** Signature has no published density; Sit and Back pieces have none of their own. */
const FALLBACK_DENSITY = { rule: 50, piece: 30 };

/** Shipping weight of one foam line: density × volume. */
export function foamWeightKg(product, { option, width, length, height } = {}) {
  const hasRule = Boolean(getFoamPricingRule(product?.slug));
  const density = parseFloat(product?.catalogue?.technical?.[0]?.value) || FALLBACK_DENSITY[hasRule ? "rule" : "piece"];
  const perCft = density * KG_PER_CFT_AT_1_DENSITY;

  if (FOAM_SET_PARTS[option]) return cftOf(FOAM_SET_PARTS[option]) * perCft;
  if (!hasRule) {
    const [l, w, h] = String(product?.catalogue?.piece || "").match(/\d+(\.\d+)?/g)?.map(Number) || [];
    return l && w && h ? cftOf({ length: l, width: w, height: h }) * perCft : 1;
  }
  /* The quoted size stands for the whole set, which holds more foam than that sheet. */
  const ref = refSizeOf(product);
  const isSet = hasFoamParts(product) && Number(length) === ref?.l && Number(width) === ref?.w && Number(height) === ref?.h;
  return (isSet ? SET_CFT : cftOf({ length: Number(length) || 0, width: Number(width) || 0, height: Number(height) || 0 })) * perCft;
}

/** The foam set poster page (FoamStaticDetail): one set at the catalogue price. */
export function quoteFoamSetUnit(product) {
  const total = product.price || 0;
  return { ok: total > 0, total, base: product.mrp || total };
}
