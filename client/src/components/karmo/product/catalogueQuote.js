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

/** The foam set poster page (FoamStaticDetail): one set at the catalogue price. */
export function quoteFoamSetUnit(product) {
  const total = product.price || 0;
  return { ok: total > 0, total, base: product.mrp || total };
}
