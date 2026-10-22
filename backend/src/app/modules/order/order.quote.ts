import config from '../../config';
import AppError from '../../utils/AppError';

/** The website's price of one Karmo catalogue line, per unit. */
export type CatalogueQuote = { ok: boolean; unit: number; mrp: number; name: string; division: string };

export type CatalogueQuoteLine = {
    slug: string;
    division?: string;
    dims?: { width?: number; length?: number; height?: number };
    size?: string;
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
