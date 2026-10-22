import { NextResponse } from 'next/server';
import { getMattressProductDetail } from '@/components/karmo/product/productDetailData';
import { getFoamProductDetail } from '@/components/karmo/product/foamProductDetailData';
import { isFoamSet, quoteFoamSetUnit, quoteFoamUnit, quoteMattressUnit } from '@/components/karmo/product/catalogueQuote';

/**
 * The price of Karmo catalogue lines (mattress, foam), asked by the order server at
 * checkout. It runs the very function the product page shows the price with, so the
 * server never keeps a second copy of the price lists. Public and read-only: it only
 * says what the website already shows anyone.
 *
 * POST { lines: [{ slug, division, dims?: { width, length, height }, size? }] }
 *   → { lines: [{ ok, unit, mrp, name, division }] }   (same order)
 */
export const dynamic = 'force-dynamic';

type Dims = { width?: unknown; length?: unknown; height?: unknown };
type Line = { slug?: unknown; division?: unknown; dims?: Dims; size?: unknown };

const NOT_FOUND = { ok: false, unit: 0, mrp: 0, name: '', division: '' };

/** "60 × 80 × 8 inch" from a cart line saved before lines carried dims. */
function dimsFromLabel(size: unknown, order: 'wlh' | 'lwh'): Dims | null {
    const m = String(size || '').match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*inch/i);
    if (!m) return null;
    const [a, b, h] = [Number(m[1]), Number(m[2]), Number(m[3])];
    return order === 'wlh' ? { width: a, length: b, height: h } : { length: a, width: b, height: h };
}

function quoteLine(line: Line) {
    const slug = String(line?.slug || '');
    const division = String(line?.division || '').toLowerCase();
    const sized = (order: 'wlh' | 'lwh') => {
        const d = line.dims && typeof line.dims === 'object' ? line.dims : dimsFromLabel(line.size, order);
        return { width: Number(d?.width) || 0, length: Number(d?.length) || 0, height: Number(d?.height) || 0 };
    };

    if (!division || division === 'mattress') {
        const product = getMattressProductDetail(slug);
        if (product) {
            const q = quoteMattressUnit(product, sized('wlh'));
            return { ok: !!q.ok, unit: q.total || 0, mrp: q.base || q.total || 0, name: product.name, division: product.division };
        }
    }
    if (!division || division === 'foam') {
        const product = getFoamProductDetail(slug);
        if (product) {
            const q = isFoamSet(product) ? quoteFoamSetUnit(product) : quoteFoamUnit(product, sized('lwh'));
            return { ok: !!q.ok, unit: q.total || 0, mrp: q.base || q.total || 0, name: product.name, division: product.division };
        }
    }
    return NOT_FOUND;
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const lines: Line[] | null = Array.isArray(body?.lines) ? body.lines : null;
    if (!lines || lines.length > 100) {
        return NextResponse.json({ message: 'Send up to 100 lines' }, { status: 400 });
    }
    return NextResponse.json({ lines: lines.map(quoteLine) });
}
