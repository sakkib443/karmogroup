import config from '../../config';
import AppError from '../../utils/AppError';
import { Product } from '../product/product.model';
import type { Parcel } from '../shipping/shipping.service';

/** The website's price of one Karmo catalogue line, per unit. */
export type CatalogueQuote = {
    ok: boolean;
    unit: number;
    mrp: number;
    name: string;
    division: string;
    /** Shipping weight of one unit, kg. */
    weightKg?: number;
    /** Goes at the flat mattress delivery rate instead of by weight. */
    mattress?: boolean;
};

export type CatalogueQuoteLine = {
    slug: string;
    division?: string;
    dims?: { width?: number; length?: number; height?: number };
    size?: string;
    /** Foam set: 'sit' or 'back' when only that half is bought. */
    option?: string;
};

const QUOTE_PATH = '/api/catalogue-quote';

/**
 * Where to ask. Locally the website may run on 3001 or 3000 whatever FRONTEND_URL
 * says, so outside production both are tried after the configured one.
 */
const endpoints = (): string[] => {
    const list = [config.catalogue_quote_url || `${config.frontend_url.replace(/\/+$/, '')}${QUOTE_PATH}`];
    if (config.env !== 'production') list.push(`http://localhost:3001${QUOTE_PATH}`, `http://localhost:3000${QUOTE_PATH}`);
    return [...new Set(list)];
};

/**
 * Mattress and foam are priced by size on the website (client catalogueQuote.js), not
 * in the products collection. Ask the website for each line's price with the very
 * function its product page uses, so the server never keeps a second copy of the price
 * lists. When the website can't be reached the order is refused, never priced from the
 * request.
 */
export async function quoteCatalogueLines(lines: CatalogueQuoteLine[]): Promise<CatalogueQuote[]> {
    if (!lines.length) return [];
    const body = JSON.stringify({ lines });
    for (const url of endpoints()) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body,
                signal: AbortSignal.timeout(8000),
            });
            if (!res.ok) continue;
            const data: any = await res.json();
            if (Array.isArray(data?.lines) && data.lines.length === lines.length) return data.lines;
        } catch {
            // not reachable here — try the next address
        }
    }
    console.error(`[orders] catalogue price check could not reach the website (${endpoints().join(', ')})`);
    throw new AppError(503, 'We could not confirm the price just now. Please try again in a minute, or call us to order.');
}

/** Goods nobody has weighed yet count as this much per piece. */
const DEFAULT_WEIGHT_KG = 1;

export const isProductId = (v: unknown) => /^[a-f0-9]{24}$/i.test(String(v || ''));

/** "500 g", "1.5 kg" or a bare number of kilos. */
const productWeightKg = (product: any): number => {
    const m = String(product?.weight || '').match(/(\d+(?:\.\d+)?)\s*(kg|g)?/i);
    const n = m ? Number(m[1]) : 0;
    if (!n) return DEFAULT_WEIGHT_KG;
    return m?.[2]?.toLowerCase() === 'g' ? n / 1000 : n;
};

/** Add `quantity` of one line to a parcel. */
export function addToParcel(parcel: Parcel, quote: Pick<CatalogueQuote, 'weightKg' | 'mattress'> | undefined, quantity: number): void {
    if (quote?.mattress) parcel.mattresses += quantity;
    else parcel.weightKg += (quote?.weightKg || DEFAULT_WEIGHT_KG) * quantity;
}

export function addProductToParcel(parcel: Parcel, product: any, quantity: number): void {
    addToParcel(parcel, { weightKg: productWeightKg(product) }, quantity);
}

export type ParcelLine = CatalogueQuoteLine & { product?: string; quantity?: number };

/**
 * What a cart weighs, for a delivery quote before the order exists. Catalogue lines
 * are weighed by the website, so a saved cart needs nothing stored on it.
 */
export async function parcelOfLines(lines: ParcelLine[]): Promise<{ parcel: Parcel; items: { freeShipping: boolean }[] }> {
    const parcel: Parcel = { weightKg: 0, mattresses: 0 };
    const items: { freeShipping: boolean }[] = [];
    const catalogue = lines.filter((l) => !isProductId(l.product));
    const quotes = await quoteCatalogueLines(catalogue.map((l) => ({
        slug: String(l.product || ''),
        division: l.division,
        dims: l.dims,
        size: l.size,
        option: l.option,
    })));
    for (const line of lines) {
        const quantity = Math.max(1, Math.floor(Number(line.quantity)) || 1);
        if (isProductId(line.product)) {
            const product: any = await Product.findById(line.product);
            addProductToParcel(parcel, product, quantity);
            items.push({ freeShipping: Boolean(product?.shippingConfig?.freeShipping) });
        } else {
            addToParcel(parcel, quotes[catalogue.indexOf(line)], quantity);
            items.push({ freeShipping: false });
        }
    }
    return { parcel, items };
}
