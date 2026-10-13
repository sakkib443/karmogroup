/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The paperwork the order desk hands around: a plain-text summary to paste into
 * WhatsApp, the customer's cash memo, and one delivery challan per factory
 * division (foam, mattress, fiber pillow, hometex…). Papers open in a print
 * window — "Save as PDF" there is the download.
 */
import { paymentMethodLabel } from '@/lib/orderStatus';

/** Challan order and names, as the factory floor knows them. */
const DIVISIONS: { key: string; label: string; code: string }[] = [
    { key: 'foam', label: 'FOAM', code: 'F' },
    { key: 'mattress', label: 'MATTRESS', code: 'M' },
    { key: 'fiber_pillow', label: 'FIBER PILLOW', code: 'FP' },
    { key: 'hometex', label: 'HOMETEX', code: 'H' },
    { key: 'chemicals', label: 'CHEMICALS', code: 'C' },
];

const keyOf = (item: any) => {
    const k = String(item?.division || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    return k === 'pillow' ? 'fiber_pillow' : k || 'general';
};

export const divisionLabel = (key: string) =>
    DIVISIONS.find((d) => d.key === key)?.label || key.replace(/_/g, ' ').toUpperCase();

/** The divisions this order needs a challan for, in factory order. */
export function orderDivisions(order: any): string[] {
    const present = new Set<string>((order?.items || []).map(keyOf));
    const known = DIVISIONS.map((d) => d.key).filter((k) => present.has(k));
    return [...known, ...[...present].filter((k) => !known.includes(k))];
}

const taka = (n: unknown) => `৳${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const fmtDate = (d: unknown) =>
    d ? new Date(d as string).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
const addressOf = (a: any) => [a?.address, a?.area, a?.city].filter(Boolean).join(', ');
const lineSpec = (it: any) => [it?.size, it?.color].filter(Boolean).join(' · ');
const isPaid = (o: any) => o?.paymentStatus === 'paid';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/* ─── Summary (Copy Summary) ─────────────────────────────── */

export function orderSummaryText(o: any): string {
    const a = o?.shippingAddress || {};
    const lines = (o?.items || []).map((it: any, i: number) => {
        const spec = lineSpec(it);
        return `${i + 1}. ${it.name}${spec ? ` (${spec})` : ''} × ${it.quantity} — ${taka(it.total ?? it.price * it.quantity)}`;
    });
    return [
        `Karmo Group — Order ${o?.orderId || ''}`,
        `Date: ${fmtDate(o?.createdAt)}`,
        '',
        `Customer: ${a.fullName || ''}`,
        `Phone: ${a.phone || ''}`,
        `Address: ${addressOf(a)}`,
        '',
        'Items:',
        ...lines,
        '',
        `Subtotal: ${taka(o?.subtotal)}`,
        `Delivery: ${taka(o?.shippingCost)}`,
        ...(Number(o?.discount) > 0 ? [`Discount: -${taka(o.discount)}`] : []),
        `Total: ${taka(o?.total)}`,
        `Payment: ${paymentMethodLabel(o?.paymentMethod || '')} · ${isPaid(o) ? 'Paid' : `Due ${taka(o?.total)}`}`,
        ...(o?.note ? [`Note: ${o.note}`] : []),
    ].join('\n');
}

/* ─── Printed papers ─────────────────────────────────────── */

const CSS = `
@page { size: A4; margin: 14mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", "Nirmala UI", Arial, sans-serif; color: #111827; font-size: 12.5px; }
.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }
.head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 12px; }
.head img { height: 44px; }
.head .co { font-size: 11px; color: #4b5563; margin-top: 6px; }
.doc { text-align: right; }
.doc h1 { margin: 0; font-size: 20px; letter-spacing: .06em; }
.doc p { margin: 3px 0 0; color: #374151; }
.parties { display: flex; gap: 24px; margin: 16px 0; }
.parties > div { flex: 1; }
.lbl { font-size: 10.5px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; margin-bottom: 4px; }
table { width: 100%; border-collapse: collapse; }
th { background: #f3f4f6; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
th, td { border: 1px solid #d1d5db; padding: 7px 8px; vertical-align: top; }
.r { text-align: right; } .c { text-align: center; }
.spec { color: #4b5563; font-size: 11.5px; }
.totals { margin-left: auto; margin-top: 12px; width: 280px; }
.totals td { border: none; padding: 4px 8px; }
.totals .grand td { border-top: 2px solid #111827; font-weight: 700; font-size: 14px; }
.note { margin-top: 14px; padding: 8px 10px; background: #f9fafb; border: 1px solid #e5e7eb; }
.sign { display: flex; justify-content: space-between; gap: 24px; margin-top: 64px; }
.sign div { flex: 1; border-top: 1px solid #111827; padding-top: 6px; text-align: center; font-size: 11.5px; }
.foot { margin-top: 18px; font-size: 10.5px; color: #6b7280; text-align: center; }
`;

function head(origin: string, title: string, rows: [string, string][]) {
    return `<div class="head">
        <div><img src="${origin}/brand/logo-group.png" alt="Karmo Group" /><div class="co">Karmo Group · Since 1965</div></div>
        <div class="doc"><h1>${esc(title)}</h1>${rows.map(([k, v]) => `<p>${esc(k)}: <b>${esc(v)}</b></p>`).join('')}</div>
    </div>`;
}

function customer(o: any, label: string) {
    const a = o?.shippingAddress || {};
    return `<div><div class="lbl">${esc(label)}</div>
        <b>${esc(a.fullName)}</b><br/>${esc(a.phone)}${a.email && !String(a.email).includes('@guest.') ? `<br/>${esc(a.email)}` : ''}<br/>${esc(addressOf(a))}</div>`;
}

function memoPage(o: any, origin: string) {
    const rows = (o?.items || []).map((it: any, i: number) => `<tr>
        <td class="c">${i + 1}</td>
        <td>${esc(it.name)}${lineSpec(it) ? `<div class="spec">${esc(lineSpec(it))}</div>` : ''}</td>
        <td>${esc(divisionLabel(keyOf(it)))}</td>
        <td class="c">${esc(it.quantity)}</td>
        <td class="r">${taka(it.price)}</td>
        <td class="r">${taka(it.total ?? it.price * it.quantity)}</td>
    </tr>`).join('');
    const due = isPaid(o) ? 0 : Number(o?.total) || 0;
    return `<section class="page">
        ${head(origin, 'CASH MEMO', [['Memo No', o?.orderId || ''], ['Date', fmtDate(o?.createdAt)]])}
        <div class="parties">${customer(o, 'Bill to')}
            <div><div class="lbl">Payment</div>${esc(paymentMethodLabel(o?.paymentMethod || ''))}<br/>${isPaid(o) ? 'Paid' : 'Unpaid'}</div></div>
        <table><thead><tr><th class="c" style="width:36px">SL</th><th>Description</th><th style="width:110px">Division</th><th class="c" style="width:48px">Qty</th><th class="r" style="width:90px">Unit price</th><th class="r" style="width:100px">Amount</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <table class="totals"><tbody>
            <tr><td>Subtotal</td><td class="r">${taka(o?.subtotal)}</td></tr>
            <tr><td>Delivery</td><td class="r">${taka(o?.shippingCost)}</td></tr>
            ${Number(o?.discount) > 0 ? `<tr><td>Discount</td><td class="r">-${taka(o.discount)}</td></tr>` : ''}
            <tr class="grand"><td>Total</td><td class="r">${taka(o?.total)}</td></tr>
            <tr><td>Paid</td><td class="r">${taka(isPaid(o) ? o?.total : 0)}</td></tr>
            <tr><td><b>Due</b></td><td class="r"><b>${taka(due)}</b></td></tr>
        </tbody></table>
        ${o?.note ? `<div class="note"><b>Note:</b> ${esc(o.note)}</div>` : ''}
        <div class="sign"><div>Customer signature</div><div>Authorised signature</div></div>
        <div class="foot">Thank you for choosing Karmo.</div>
    </section>`;
}

function challanPage(o: any, division: string, origin: string) {
    const items = (o?.items || []).filter((it: any) => keyOf(it) === division);
    const code = DIVISIONS.find((d) => d.key === division)?.code || division.slice(0, 2).toUpperCase();
    const qty = items.reduce((n: number, it: any) => n + (Number(it.quantity) || 0), 0);
    const rows = items.map((it: any, i: number) => `<tr>
        <td class="c">${i + 1}</td>
        <td>${esc(it.name)}</td>
        <td>${esc(lineSpec(it)) || '—'}</td>
        <td class="c">${esc(it.quantity)}</td>
        <td></td>
    </tr>`).join('');
    return `<section class="page">
        ${head(origin, `CHALLAN · ${divisionLabel(division)}`, [['Challan No', `${o?.orderId || ''}-${code}`], ['Order No', o?.orderId || ''], ['Date', fmtDate(new Date())]])}
        <div class="parties">${customer(o, 'Deliver to')}
            <div><div class="lbl">Division</div><b>${esc(divisionLabel(division))}</b><br/>${items.length} line${items.length === 1 ? '' : 's'} · ${qty} piece${qty === 1 ? '' : 's'}</div></div>
        <table><thead><tr><th class="c" style="width:36px">SL</th><th>Product</th><th>Size / specification</th><th class="c" style="width:56px">Qty</th><th style="width:130px">Remarks</th></tr></thead>
        <tbody>${rows}<tr><td></td><td colspan="2" class="r"><b>Total quantity</b></td><td class="c"><b>${qty}</b></td><td></td></tr></tbody></table>
        ${o?.note ? `<div class="note"><b>Customer note:</b> ${esc(o.note)}</div>` : ''}
        <div class="sign"><div>Prepared by</div><div>Checked by (factory)</div><div>Received by</div></div>
    </section>`;
}

export type PaperKind = { kind: 'all' } | { kind: 'memo' } | { kind: 'challan'; division: string };

/**
 * Open the chosen papers in a print window. The window's title becomes the PDF's
 * file name when it is saved.
 */
export function openOrderPapers(order: any, paper: PaperKind): void {
    const origin = window.location.origin;
    const ref = order?.orderId || 'Order';
    let title = `${ref} papers`;
    let pages = '';
    if (paper.kind === 'memo') {
        title = `${ref} Memo`;
        pages = memoPage(order, origin);
    } else if (paper.kind === 'challan') {
        title = `${ref} Challan ${divisionLabel(paper.division)}`;
        pages = challanPage(order, paper.division, origin);
    } else {
        pages = memoPage(order, origin) + orderDivisions(order).map((d) => challanPage(order, d, origin)).join('');
    }
    printWindow(title, pages);
}

/** Memo + every challan for several orders, one after another, in one print window. */
export function openOrdersPapers(orders: any[], paper: 'all' | 'memo' | 'challans' = 'all'): void {
    const origin = window.location.origin;
    const pages = orders.map((o) => [
        paper !== 'challans' ? memoPage(o, origin) : '',
        paper !== 'memo' ? orderDivisions(o).map((d) => challanPage(o, d, origin)).join('') : '',
    ].join('')).join('');
    const what = paper === 'memo' ? 'Memos' : paper === 'challans' ? 'Challans' : 'Papers';
    printWindow(`${what} - ${orders.length} orders`, pages);
}

function printWindow(title: string, pages: string) {
    const w = window.open('', '_blank');
    if (!w) throw new Error('Allow pop-ups for this site to open the papers.');
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${esc(title)}</title><style>${CSS}</style></head>
<body>${pages}<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},200)});</script></body></html>`);
    w.document.close();
}
