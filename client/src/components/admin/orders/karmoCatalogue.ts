/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Karmo's own catalogue (mattress, foam) for "Add order", priced exactly as the
 * product page prices it: by size (inch) from the sales calculator, anchored to the
 * catalogue's Queen / sofa-set price, with the standing 15% offer. Keep in step with
 * components/karmo/product/ProductHero.jsx.
 */
import { getMattressProductSlugs, getMattressProductDetail } from '@/components/karmo/product/productDetailData';
import { getFoamProductSlugs, getFoamProductDetail } from '@/components/karmo/product/foamProductDetailData';
import { getPricingRule, quoteMattressListPrice, quoteMattressPrice } from '@/components/karmo/product/mattressPricing';
import { getFoamPricingRule, quoteFoamListPrice, quoteFoamPrice } from '@/components/karmo/product/foamPricing';

/** The website's fixed sales discount (ProductHero OFFER_DISCOUNT_PCT). */
const OFFER_DISCOUNT_PCT = 15;

export type SizePreset = { id: string; label: string; note: string; w: number; l: number; h: number };
export type Option = { id: string; label: string };

export interface CatalogueItem {
    key: string;
    slug: string;
    name: string;
    division: 'mattress' | 'foam';
    image: string;
    sizes: SizePreset[];
    options: Option[];
    optionTitle: string;
    price: number;
    mrp: number;
    defaultHeight: number;
    isFoam: boolean;
    rule: any;
}

function build(detail: any, isFoam: boolean): CatalogueItem | null {
    if (!detail) return null;
    return {
        key: `${isFoam ? 'foam' : 'mattress'}:${detail.slug}`,
        slug: detail.slug,
        name: detail.name,
        division: isFoam ? 'foam' : 'mattress',
        image: detail.cover || '',
        sizes: detail.sizes || [],
        options: (detail.fabrics || []).map((f: any) => ({ id: f.id, label: f.label })),
        optionTitle: isFoam ? 'Colour' : 'Fabric',
        price: detail.price || 0,
        mrp: detail.mrp || 0,
        defaultHeight: detail.defaultHeight || (isFoam ? 4 : 8),
        isFoam,
        rule: isFoam ? getFoamPricingRule(detail.slug) : getPricingRule(detail.slug),
    };
}

let cache: CatalogueItem[] | null = null;

/** Every mattress and foam product on the website. */
export function karmoCatalogue(): CatalogueItem[] {
    if (cache) return cache;
    const mattress = (getMattressProductSlugs() as string[]).map((s) => build(getMattressProductDetail(s), false));
    const foam = (getFoamProductSlugs() as string[]).map((s) => build(getFoamProductDetail(s), true));
    cache = [...mattress, ...foam].filter(Boolean) as CatalogueItem[];
    return cache;
}

/** The Queen (mattress) / sofa-set (foam) size the catalogue price is quoted at. */
export const referenceSize = (p: CatalogueItem) => p.sizes.find((s) => s.id === 'queen') || p.sizes[0];

/** Height rule for the line's height control. */
export function heightRule(p: CatalogueItem): { fixed?: number; options?: number[]; min?: number; max?: number } {
    const r = p.rule || {};
    if (r.heightFixed != null) return { fixed: r.heightFixed };
    if (r.heightOptions?.length) return { options: r.heightOptions };
    return { min: r.heightMin, max: r.heightMax };
}

/** Unit price and list price for a size (inch), as the website quotes it. */
export function quoteItem(p: CatalogueItem, w: number, l: number, h: number): { ok: boolean; unit: number; mrp: number } {
    const discountPct = OFFER_DISCOUNT_PCT;
    const listMrp = p.mrp || 0;
    const listOffer = p.price || 0;
    let q: any;
    if (!p.rule) {
        const base = listMrp || listOffer;
        if (!base) return { ok: false, unit: 0, mrp: 0 };
        const catalogPct = listOffer && listMrp > listOffer ? Math.round(((listMrp - listOffer) / listMrp) * 100) : null;
        const total = catalogPct != null && discountPct === catalogPct && listOffer ? listOffer : Math.round(base * (1 - discountPct / 100));
        return { ok: true, unit: total, mrp: base };
    }
    const ref = referenceSize(p);
    if (listMrp) {
        const args = {
            length: l, width: w, height: h, discountPct, listMrp, listOffer,
            refLength: ref?.l, refWidth: ref?.w, refHeight: ref?.h || p.defaultHeight,
        };
        q = p.isFoam ? quoteFoamListPrice(p.slug, args) : quoteMattressListPrice(p.slug, args);
    } else {
        // The pricing modules are plain JS; their option types are inferred too narrowly.
        const quote = (p.isFoam ? quoteFoamPrice : quoteMattressPrice) as (slug: string, o: any) => any;
        q = quote(p.slug, { length: l, width: w, height: h, discountPct });
    }
    return { ok: !!q?.ok, unit: q?.total || 0, mrp: q?.base || q?.total || 0 };
}
