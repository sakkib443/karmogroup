/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The paperwork the order desk hands around: a plain-text summary to paste into
 * WhatsApp, the customer's cash memo, one delivery challan per factory division
 * (Office Copy + Factory Copy side by side), and piece labels for the factory to scan.
 * Papers open in a print window — "Save as PDF" there is the download.
 *
 * Originals are issued once, on the server (the order desk's Issue buttons). Everything
 * printed from anywhere else is a VIEW COPY, and an admin's reprint says DUPLICATE —
 * so a second "real" challan can never walk out of the factory.
 */
import { paymentMethodLabel, getStatusConfig } from '@/lib/orderStatus';
import { code128Svg, isCode128BEncodable } from '@/components/admin/print/code128';

/** Business details printed on the memo (as on Karmo's own memo). */
const BUSINESS = {
    address: '95, Motijheel C/A (4thFloor), Ibrahim Chamber, Dhaka-1000',
    phone: '01713-483284',
    phoneDigits: '01713483284',
    phoneBangla: '০১৭১৩-৪৮৩২৮৪',
    terms: 'Delivery within 5 days',
};

/** Challan order and names, as the factory floor knows them. */
const DIVISIONS: { key: string; label: string }[] = [
    { key: 'foam', label: 'FOAM' },
    { key: 'mattress', label: 'MATTRESS' },
    { key: 'fiber_pillow', label: 'FIBER PILLOW' },
    { key: 'hometex', label: 'HOMETEX' },
    { key: 'chemicals', label: 'CHEMICALS' },
];

const keyOf = (item: any) => {
    const k = String(item?.division || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    return k === 'pillow' ? 'fiber_pillow' : k || 'general';
};

export const divisionLabel = (key: string) =>
    DIVISIONS.find((d) => d.key === key)?.label || key.replace(/_/g, ' ').toUpperCase();

/** The divisions this order needs a challan for, in factory order. */
export function orderDivisions(order: any): string[] {
    if (order?.jobs?.length) return order.jobs.map((j: any) => j.division);
    const present = new Set<string>((order?.items || []).map(keyOf));
    const known = DIVISIONS.map((d) => d.key).filter((k) => present.has(k));
    return [...known, ...[...present].filter((k) => !known.includes(k))];
}

const taka = (n: unknown) => `৳${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const fmtDate = (d: unknown) =>
    d ? new Date(d as string).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
/** 11/10/26 — the short date on Karmo's paper forms. */
const shortDate = (d: unknown) => {
    const x = d ? new Date(d as string) : new Date();
    return `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${String(x.getFullYear()).slice(-2)}`;
};
const addressOf = (a: any) => [a?.address, a?.area, a?.city].filter(Boolean).join(', ');
const lineSpec = (it: any) => [it?.size, it?.color].filter(Boolean).join(' · ');
const describe = (it: any) => `${it?.name || ''}${lineSpec(it) ? ` (${lineSpec(it)})` : ''}`;
const isPaid = (o: any) => o?.paymentStatus === 'paid';

/** "81 × 69 × 4 inch" (or with x) → [81, 69, 4]. */
const DIMS = /^(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(?:inch|in|")?$/i;

/**
 * A line as Karmo's paper forms write it: King Mattress (Size: 81" x 69" x 4", Fabric: DAMASK).
 * The size is put length first (the larger of the first two numbers), whichever way the
 * product page wrote it; any other word on the size (the fabric) becomes Fabric. "Standard"
 * and "1 set" say nothing the name does not, so they are left out, as on Karmo's memo.
 */
const paperLine = (it: any) => {
    const parts = String(it?.size || '').split(/\s*·\s*/).map((x) => x.trim()).filter(Boolean);
    const dims = parts.map((x) => x.match(DIMS)).find(Boolean);
    const words = parts.filter((x) => !DIMS.test(x) && !/^(standard|1 set)$/i.test(x));
    const bits: string[] = [];
    if (dims) {
        const [a, b, h] = [Number(dims[1]), Number(dims[2]), dims[3]];
        bits.push(`Size: ${Math.max(a, b)}" x ${Math.min(a, b)}" x ${h}"`);
        if (words.length) bits.push(`Fabric: ${words.join(', ').toUpperCase()}`);
    } else if (words.length) {
        bits.push(words.join(', '));
    }
    if (it?.color) bits.push(`Color: ${it.color}`);
    return `${it?.name || ''}${bits.length ? ` (${bits.join(', ')})` : ''}`;
};

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/* ─── Numbers in words (South Asian grouping: lakh, crore) ── */

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
    'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const below100 = (n: number) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`);
const below1000 = (n: number) =>
    [n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred` : '', below100(n % 100)].filter(Boolean).join(' ');

export function inWords(value: number): string {
    let n = Math.round(Math.abs(Number(value) || 0));
    if (n === 0) return 'Zero';
    const parts: string[] = [];
    const crore = Math.floor(n / 1e7); n %= 1e7;
    const lakh = Math.floor(n / 1e5); n %= 1e5;
    const thousand = Math.floor(n / 1e3); n %= 1e3;
    if (crore) parts.push(`${inWords(crore)} Crore`);
    if (lakh) parts.push(`${below100(lakh)} Lakh`);
    if (thousand) parts.push(`${below100(thousand)} Thousand`);
    if (n) parts.push(below1000(n));
    return parts.join(' ');
}

const barcode = (value: string) => (isCode128BEncodable(value) ? code128Svg(value) : '');

/* ─── Summary (Copy Summary) ─────────────────────────────── */

export function orderSummaryText(o: any): string {
    const a = o?.shippingAddress || {};
    const money = o?.total !== undefined;
    const lines = (o?.items || []).map((it: any, i: number) => {
        const spec = lineSpec(it);
        return `${i + 1}. ${it.name}${spec ? ` (${spec})` : ''} × ${it.quantity}${money ? ` — ${taka(it.total ?? it.price * it.quantity)}` : ''}`;
    });
    return [
        `Karmo Group — Order ${o?.orderId || ''}`,
        `Date: ${fmtDate(o?.createdAt)}`,
        '',
        `Customer: ${a.fullName || ''}`,
        `Phone: ${a.phone || ''}`,
        ...(addressOf(a) ? [`Address: ${addressOf(a)}`] : []),
        '',
        'Items:',
        ...lines,
        ...(money ? [
            '',
            `Subtotal: ${taka(o?.subtotal)}`,
            `Delivery: ${taka(o?.shippingCost)}`,
            ...(Number(o?.discount) > 0 ? [`Discount: -${taka(o.discount)}`] : []),
            `Total: ${taka(o?.total)}`,
            `Payment: ${paymentMethodLabel(o?.paymentMethod || '')} · ${isPaid(o) ? 'Paid' : `Due ${taka(o?.total)}`}`,
        ] : []),
        ...(o?.note ? [`Note: ${o.note}`] : []),
    ].join('\n');
}

/* ─── Full details (Copy details) ────────────────────────── */

/**
 * Everything about one order as plain text — where it stands, the customer, the lines,
 * the money and its history — to paste wherever it is needed next.
 */
export function orderDocumentText(o: any): string {
    const a = o?.shippingAddress || {};
    const paid = isPaid(o);
    const money = o?.total !== undefined;
    const lines = (o?.items || []).map((it: any, i: number) => {
        const spec = lineSpec(it);
        return `${i + 1}. ${it.name}${spec ? ` (${spec})` : ''} × ${it.quantity}${money ? ` — ${taka(it.total ?? it.price * it.quantity)}` : ''}`;
    });
    const history = [...(o?.timeline || [])]
        .sort((x: any, y: any) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime())
        .map((t: any) => `• ${fmtDate(t.createdAt)} — ${getStatusConfig(t.status).label}${t.note ? `: ${t.note}` : ''}${t.by?.name ? ` (${t.by.name})` : ''}`);
    const courier = o?.consignmentId ? `${o.carrier || 'Courier'} · ${o.consignmentId}${o.courierStatus ? ` (${o.courierStatus})` : ''}` : '';

    return [
        `Karmo Group — Order ${o?.orderId || ''}`,
        `Placed: ${fmtDate(o?.createdAt)}`,
        `Status: ${getStatusConfig(o?.status || 'pending').label}`,
        ...(money ? [`Payment: ${paymentMethodLabel(o?.paymentMethod || '')} · ${paid ? `Paid ${taka(o?.total)}` : `Unpaid · Due ${taka(o?.total)}`}`] : []),
        ...(courier ? [`Courier: ${courier}`] : []),
        '',
        'Customer',
        `Name: ${a.fullName || ''}`,
        `Phone: ${a.phone || ''}`,
        ...(a.email && !String(a.email).includes('@guest.') ? [`Email: ${a.email}`] : []),
        ...(addressOf(a) ? [`Address: ${addressOf(a)}`] : []),
        '',
        'Items',
        ...lines,
        ...(money ? [
            '',
            `Subtotal: ${taka(o?.subtotal)}`,
            `Delivery: ${taka(o?.shippingCost)}`,
            ...(Number(o?.discount) > 0 ? [`Discount: -${taka(o.discount)}${o?.couponCode ? ` (${o.couponCode})` : ''}`] : []),
            `Total: ${taka(o?.total)}`,
        ] : []),
        ...(o?.note ? ['', `Customer note: ${o.note}`] : []),
        ...(history.length ? ['', 'History', ...history] : []),
    ].join('\n');
}

/* ─── Print modes ─────────────────────────────────────────── */

/** original = the one issued copy · view = for reading only · duplicate = an admin's reprint */
export type PaperMode = 'original' | 'view' | 'duplicate';

const stamp = (mode: PaperMode, note = '') =>
    mode === 'view'
        ? `<div class="stamp">VIEW COPY<small>Not for dispatch</small></div>`
        : mode === 'duplicate'
            ? `<div class="stamp dup">DUPLICATE<small>${esc(note || 'Reprint')}</small></div>`
            : '';

/* ─── Memo (customer copy) ───────────────────────────────── */

const MEMO_CSS = `
@page { size: A4 portrait; margin: 8mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, "Nirmala UI", "Segoe UI", sans-serif; color: #111; font-size: 14px; }
.memo { position: relative; border: 2px solid #111; padding: 8px 10px 6px; page-break-after: always; min-height: 279mm; display: flex; flex-direction: column; }
.memo:last-child { page-break-after: auto; }
.brand { text-align: center; border-bottom: 1.5px solid #111; padding: 8px 0 10px; }
.brand img { height: 44px; display: inline-block; }
.brand p { margin: 8px 0 0; font-weight: 700; font-size: 15px; }
.brand p + p { margin-top: 4px; }
.top { display: grid; grid-template-columns: 1.3fr 1fr; border: 1.5px solid #111; margin-top: 4px; }
.top .who { padding: 8px 10px; border-right: 1.5px solid #111; font-size: 15px; display: flex; flex-direction: column; gap: 4px; }
.top .who .gap { height: 18px; }
.top .meta > div { border-bottom: 1.5px solid #111; padding: 7px 8px; text-align: center; font-size: 14.5px; }
.top .meta > div:last-child { border-bottom: none; }
.top .meta .row { display: grid; grid-template-columns: 1.5fr 1fr; padding: 0; text-align: left; }
.top .meta .row > div { padding: 7px 6px; white-space: nowrap; } .top .meta .row > div + div { border-left: 1.5px solid #111; }
b { font-weight: 700; }
table { width: 100%; border-collapse: collapse; margin-top: 4px; flex: 1; }
th, td { border: 1.5px solid #111; padding: 9px 6px; vertical-align: middle; font-size: 14.5px; }
th { font-weight: 700; text-align: center; line-height: 1.6; }
.c { text-align: center; } .r { text-align: right; }
tr.fill td { height: 100%; padding: 0; }
tr.sum td { font-weight: 700; }
tr.words td.w { font-weight: 400; }
.pay { text-align: center; border: 1.5px solid #111; border-top: none; padding: 8px; font-size: 15px; }
.pay b { display: block; } .pay span { display: block; color: #e00000; font-weight: 700; margin-top: 4px; }
.divs { display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; border: 1.5px solid #111; border-top: none; margin-top: 10px; }
.divs div { display: flex; align-items: center; justify-content: center; height: 76px; padding: 8px 10px; }
.divs div + div { border-left: 1.5px solid #ccc; }
.divs img { max-height: 46px; max-width: 100%; object-fit: contain; }
.notice { text-align: center; font-weight: 700; font-size: 20px; padding: 8px 4px 2px; border-top: 1.5px solid #111; margin-top: 4px; }
.stamp { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;
  font-size: 64px; font-weight: 900; color: rgba(200,0,0,.13); transform: rotate(-24deg); letter-spacing: .08em; z-index: 5; }
.stamp small { font-size: 18px; letter-spacing: .1em; }
.stamp.dup { color: rgba(200,0,0,.18); }
.issued { font-size: 10px; color: #555; text-align: right; margin-top: 4px; }
`;

/** The four brand marks along the foot of the memo (cut from Karmo's own memo). */
const MEMO_BRANDS = ['foam', 'mattress', 'comforter', 'hometex'];

/**
 * Karmo's cash memo, laid out cell for cell as the memo the company already prints:
 * Rate and Per stay blank (the Amount carries the line), and the Sub Total is what the
 * customer pays — products less discount plus delivery — with Advanced (paid online)
 * and Due under it. An empty row stretches the table so the memo always fills the page.
 */
function memoPage(o: any, origin: string, mode: PaperMode, note = '') {
    const a = o?.shippingAddress || {};
    const items: any[] = o?.items || [];
    const rows = items.map((it: any, i: number) => `<tr>
        <td class="c">${i + 1}</td>
        <td>${esc(paperLine(it))}</td>
        <td class="c">${esc(it.quantity)}</td>
        <td></td>
        <td></td>
        <td class="r">${Math.round(Number(it.total ?? it.price * it.quantity) || 0)}</td>
    </tr>`).join('');
    const itemsTotal = Number(o?.subtotal) || items.reduce((n, it) => n + (Number(it.total) || 0), 0);
    const total = Number(o?.total) || 0;
    const advanced = isPaid(o) ? total : 0;
    const due = total - advanced;
    const issued = o?.memo?.issuedAt ? `Issued ${fmtDate(o.memo.issuedAt)}${o.memo.issuedBy?.name ? ` by ${esc(o.memo.issuedBy.name)}` : ''}` : '';
    return `<section class="memo">
        ${stamp(mode, note)}
        <div class="brand">
            <img src="${origin}/brand/logo-group.png" alt="Karmo Group" />
            <p>${esc(BUSINESS.address)}</p>
            <p>Contact: ${esc(BUSINESS.phone)}</p>
        </div>
        <div class="top">
            <div class="who">
                <div><b>Name / নাম:</b> ${esc(a.fullName)}</div>
                <div class="gap"></div>
                <div><b>Address:</b> ${esc(addressOf(a))}</div>
                <div><b>Phone:</b> ${esc(a.phone)}</div>
            </div>
            <div class="meta">
                <div class="row"><div><b>Order Number:</b> ${esc(o?.orderId)}</div><div><b>Date:</b> ${shortDate(o?.createdAt)}</div></div>
                <div><b>Delivery Note:</b> ${esc(o?.note || '')}</div>
                <div><b>Terms of delivery:</b> ${esc(BUSINESS.terms)}</div>
            </div>
        </div>
        <table>
            <thead><tr>
                <th style="width:7%">SL<br/>No.</th><th>Description of Goods</th><th style="width:9%">Quantity</th>
                <th style="width:14%">Terms of<br/>Delivery<br/>Rate</th><th style="width:9.5%">Per</th><th style="width:12%">Amount</th>
            </tr></thead>
            <tbody>
                ${rows}
                <tr class="fill"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="sum"><td colspan="5">Total</td><td class="r">${Math.round(itemsTotal)}</td></tr>
                <tr class="sum"><td colspan="5">Discount</td><td class="r">${Math.round(Number(o?.discount) || 0)}</td></tr>
                <tr class="sum"><td colspan="5">Sub Total</td><td class="r">${Math.round(total)}</td></tr>
                <tr class="words"><td class="w" colspan="4">Amount Chargeable (in words): ${esc(inWords(total))} Taka Only</td><td><b>Advanced</b></td><td class="r">${Math.round(advanced)}</td></tr>
                <tr><td colspan="4"></td><td><b>Due</b></td><td class="r">${Math.round(due)}</td></tr>
            </tbody>
        </table>
        <div class="pay"><b>Payment Method</b><span>${esc(paymentMethodLabel(o?.paymentMethod || 'cod'))}</span></div>
        <div class="divs">
            ${MEMO_BRANDS.map((b) => `<div><img src="${origin}/brand/print/karmo-${b}.png" alt="Karmo ${b}" /></div>`).join('')}
        </div>
        <div class="notice">ডেলিভারি নেওয়ার আগে অবশ্যই ${BUSINESS.phoneBangla} এই নাম্বারে ফোন করবেন।</div>
        ${issued ? `<div class="issued">${issued}</div>` : ''}
    </section>`;
}

/* ─── Challan (Office Copy + Factory Copy) ───────────────── */

const CHALLAN_CSS = `
@page { size: A4 landscape; margin: 6mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Times New Roman", Georgia, serif; color: #111; }
.sheet { display: grid; grid-template-columns: 1fr 1fr; gap: 0; page-break-after: always; height: 196mm; position: relative; }
.sheet:last-child { page-break-after: auto; }
.cut { position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1.5px dashed #888; }
.copy { position: relative; border: 2px solid #111; margin: 0 4mm; padding: 4mm 5mm 3mm; display: flex; flex-direction: column; overflow: hidden; }
.tag { position: absolute; top: 3mm; right: 4mm; border: 1.5px solid #111; padding: 1.5mm 3mm; font: 700 11px Arial, sans-serif; background: #fff; z-index: 2; }
.title { text-align: center; }
.title h1 { margin: 0; font-size: 24px; letter-spacing: .08em; font-weight: 700; }
.title .mob { font-size: 12px; font-weight: 700; margin-top: 1mm; }
.title .pill { display: inline-block; border: 1.5px solid #111; border-radius: 3mm; padding: 1mm 5mm; margin-top: 2mm; font-weight: 700; font-size: 13px; letter-spacing: .04em; }
.title .ono { font-weight: 700; font-size: 13px; margin-top: 2mm; }
.idrow { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; margin-top: 1mm; }
.idrow .no { font-size: 15px; font-weight: 700; }
.idrow .bc { text-align: center; } .idrow .bc svg { width: 46mm; height: 12mm; display: block; }
.idrow .bc span { font: 11px monospace; letter-spacing: .1em; }
.idrow .dt { text-align: right; font-weight: 700; font-size: 13px; }
.idrow .dt u { text-decoration: none; border-bottom: 1px dotted #111; font-weight: 400; }
.party { margin-top: 3mm; font-size: 13px; line-height: 1.7; }
.party > div { display: flex; align-items: baseline; gap: 2mm; }
.party b { font-weight: 700; } .party .v { flex: 0 1 86%; border-bottom: 1px dotted #555; padding-left: 1mm; }
table { width: 100%; border-collapse: collapse; margin-top: 2mm; flex: 1; }
th, td { border: 1.5px solid #111; padding: 2mm 2.5mm; font-size: 12.5px; vertical-align: top; }
th { font-weight: 700; text-align: left; }
.sl { width: 14mm; text-align: center; } .qty { width: 26mm; text-align: center; }
tr.fill td { height: 100%; }
tr.tot td { font-weight: 700; }
.words { font-size: 13px; margin-top: 2mm; display: flex; align-items: baseline; gap: 2mm; } .words .v { flex: 0 1 82%; border-bottom: 1px dotted #555; padding: 0 1mm; }
.sign { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; margin-top: auto; padding-top: 14mm; font: 700 11.5px "Times New Roman", serif; text-align: center; }
.sign div { border-top: 1.2px solid #111; padding-top: 1.5mm; }
.wm { position: absolute; inset: 0; pointer-events: none; z-index: 0; display: grid; grid-template-columns: repeat(3, 1fr); align-content: space-around; }
.wm span { transform: rotate(-22deg); color: rgba(0,0,0,.07); font: 900 22px Arial, sans-serif; text-align: center; white-space: nowrap; }
/* Everything sits over the watermark — except the corner tag, which stays absolutely placed. */
.copy > *:not(.wm):not(.tag) { position: relative; z-index: 1; }
.stamp { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;
  font: 900 64px Arial, sans-serif; color: rgba(200,0,0,.14); transform: rotate(-22deg); letter-spacing: .08em; z-index: 6; }
.stamp small { font-size: 16px; letter-spacing: .1em; }
.stamp.dup { color: rgba(200,0,0,.2); }
.issued { font: 9.5px Arial, sans-serif; color: #555; text-align: right; margin-top: 1mm; }
`;

/** The lines of one challan: from the order's job (with the reserved number) or, before confirmation, from its items. */
function challanLines(o: any, division: string, job?: any) {
    if (job?.lines?.length) return job.lines.map((l: any) => ({ name: l.name, size: l.size, color: l.color, quantity: l.quantity }));
    return (o?.items || []).filter((it: any) => keyOf(it) === division);
}

function challanCopy(o: any, division: string, job: any, which: 'Office Copy' | 'Factory Copy', origin: string) {
    const lines = challanLines(o, division, job);
    const qty = lines.reduce((n: number, l: any) => n + (Number(l.quantity) || 0), 0);
    const no = job?.challanNo || '—';
    const label = divisionLabel(division);
    const rows = lines.map((l: any, i: number) => `<tr><td class="sl">${i + 1}</td><td>${esc(paperLine(l))}</td><td class="qty">${esc(l.quantity)} Pcs</td></tr>`).join('');
    const a = o?.shippingAddress || {};
    const wm = which === 'Factory Copy'
        ? `<div class="wm">${Array.from({ length: 18 }).map(() => `<span>${esc(label)}</span>`).join('')}</div>`
        : '';
    void origin;
    return `<div class="copy">
        ${wm}
        <div class="tag">${which}</div>
        <div class="title">
            <h1>${esc(label)}</h1>
            <div class="mob">MOBILE : ${BUSINESS.phoneDigits}</div>
            <div class="pill">CHALLAN</div>
            <div class="ono">Order No: #${esc(o?.orderId)}</div>
        </div>
        <div class="idrow">
            <div class="no">No: ${esc(no)}</div>
            <div class="bc">${job?.challanNo ? barcode(job.challanNo) : ''}<span>${esc(job?.challanNo || '')}</span></div>
            <div class="dt">Date: <u>${shortDate(job?.issuedAt)}</u></div>
        </div>
        <div class="party">
            <div><b>Name:</b> <span class="v">${esc(a.fullName)}</span></div>
            <div><b>Mobile:</b> <span class="v">${esc(a.phone)}</span></div>
        </div>
        <table>
            <thead><tr><th class="sl">Sl. No</th><th>Description</th><th class="qty">Qunty/Pcs</th></tr></thead>
            <tbody>
                ${rows}
                <tr class="fill"><td class="sl"></td><td></td><td class="qty"></td></tr>
                <tr class="tot"><td colspan="2" style="text-align:right">Total Pcs.</td><td class="qty">${qty} Pcs</td></tr>
            </tbody>
        </table>
        <div class="words"><b>In Words:</b> <span class="v">${esc(inWords(qty))} Pcs Only</span></div>
        <div class="sign"><div>Receiver's</div><div>Checked by</div><div>Store Incharge</div></div>
        ${job?.issuedAt ? `<div class="issued">Issued ${fmtDate(job.issuedAt)}${job.issuedBy?.name ? ` by ${esc(job.issuedBy.name)}` : ''}</div>` : ''}
    </div>`;
}

function challanSheet(o: any, division: string, job: any, origin: string, mode: PaperMode, note = '') {
    return `<section class="sheet">
        <div class="cut"></div>
        ${challanCopy(o, division, job, 'Office Copy', origin)}
        ${challanCopy(o, division, job, 'Factory Copy', origin)}
        ${stamp(mode, note)}
    </section>`;
}

/* ─── Piece labels (stickers the factory scans) ──────────── */

const LABEL_CSS = `
@page { size: A4 portrait; margin: 8mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, "Nirmala UI", sans-serif; color: #111; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; }
.lbl { border: 1px dashed #999; padding: 2.5mm; height: 38mm; display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid; }
.lbl .top { display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; }
.lbl .name { font-size: 10px; line-height: 1.25; max-height: 2.5em; overflow: hidden; }
.lbl svg { width: 100%; height: 12mm; display: block; }
.lbl .code { text-align: center; font: 700 11px monospace; letter-spacing: .12em; }
`;

/* ─── Opening the print window ───────────────────────────── */

function printWindow(title: string, css: string, body: string) {
    const w = window.open('', '_blank');
    if (!w) throw new Error('Allow pop-ups for this site to open the papers.');
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${esc(title)}</title><style>${css}</style></head>
<body>${body}<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},250)});</script></body></html>`);
    w.document.close();
}

/** The customer's memo. `mode` decides the watermark; originals are issued by the server first. */
export function openMemo(order: any, mode: PaperMode = 'view', note = '') {
    const ref = order?.orderId || 'Order';
    printWindow(`${ref} Memo${mode === 'duplicate' ? ' (Duplicate)' : mode === 'view' ? ' (View copy)' : ''}`, MEMO_CSS, memoPage(order, window.location.origin, mode, note));
}

/** One division's challan — Office Copy and Factory Copy on one landscape page. */
export function openChallan(order: any, job: any, mode: PaperMode = 'view', note = '') {
    const ref = order?.orderId || 'Order';
    const division = job?.division || 'general';
    printWindow(
        `${ref} Challan ${job?.challanNo || divisionLabel(division)}${mode === 'duplicate' ? ' (Duplicate)' : mode === 'view' ? ' (View copy)' : ''}`,
        CHALLAN_CSS,
        challanSheet(order, division, job, window.location.origin, mode, note),
    );
}

/** Stickers with one barcode per piece, for the factory to put on each product and scan. */
export function openPieceLabels(order: any, job: any) {
    const lines: any[] = job?.lines || [];
    const byIndex = new Map<number, any>(lines.map((l: any) => [l.itemIndex, l]));
    const labels = (job?.units || []).map((u: any) => {
        const l = byIndex.get(u.itemIndex) || {};
        return `<div class="lbl">
            <div class="top"><span>KARMO · ${esc(divisionLabel(job.division))}</span><span>#${esc(order?.orderId)}</span></div>
            <div class="name">${esc(describe(l))}</div>
            ${barcode(u.code)}
            <div class="code">${esc(u.code)}</div>
        </div>`;
    }).join('');
    printWindow(`${job?.challanNo || ''} piece labels`, LABEL_CSS, `<div class="grid">${labels}</div>`);
}

/**
 * The memo pages for several orders as one complete document — for the print preview
 * ("Invoice" / "Print invoice"), which shows it in an iframe. Always a VIEW COPY: the
 * original memo is issued once from the order desk.
 */
export function memoDocumentHtml(orders: any[], origin: string): string {
    const title = orders.length === 1 ? `${orders[0]?.orderId || 'Order'} Memo (View copy)` : `Memos - ${orders.length} orders (View copy)`;
    return `<!doctype html><html><head><meta charset="utf-8"/><title>${esc(title)}</title><style>${MEMO_CSS}
@media screen { body { background: #525659; padding: 16px 0; } .memo { background: #fff; width: 210mm; margin: 0 auto 16px; } }</style></head>
<body>${orders.map((o) => memoPage(o, origin, 'view')).join('')}</body></html>`;
}

/* ─── From lists: always view copies ─────────────────────── */

export type PaperKind = { kind: 'all' } | { kind: 'memo' } | { kind: 'challan'; division: string };

const jobFor = (o: any, division: string) => (o?.jobs || []).find((j: any) => j.division === division);

/** View copies of one order's papers (memo, a challan, or everything). */
export function openOrderPapers(order: any, paper: PaperKind): void {
    const origin = window.location.origin;
    const ref = order?.orderId || 'Order';
    if (paper.kind === 'memo') return openMemo(order, 'view');
    if (paper.kind === 'challan') return openChallan(order, jobFor(order, paper.division) || { division: paper.division }, 'view');
    const challans = orderDivisions(order).map((d) => challanSheet(order, d, jobFor(order, d) || { division: d }, origin, 'view')).join('');
    printWindow(`${ref} papers (View copy)`, MEMO_CSS + CHALLAN_CSS.replace('@page { size: A4 landscape; margin: 6mm; }', ''),
        memoPage(order, origin, 'view') + challans);
}

/** View copies for several orders, one after another, in one print window. */
export function openOrdersPapers(orders: any[], paper: 'all' | 'memo' | 'challans' = 'all'): void {
    const origin = window.location.origin;
    if (paper === 'memo') {
        printWindow(`Memos - ${orders.length} orders (View copy)`, MEMO_CSS, orders.map((o) => memoPage(o, origin, 'view')).join(''));
        return;
    }
    if (paper === 'challans') {
        const body = orders.map((o) => orderDivisions(o).map((d) => challanSheet(o, d, jobFor(o, d) || { division: d }, origin, 'view')).join('')).join('');
        printWindow(`Challans - ${orders.length} orders (View copy)`, CHALLAN_CSS, body);
        return;
    }
    const body = orders.map((o) => memoPage(o, origin, 'view') + orderDivisions(o).map((d) => challanSheet(o, d, jobFor(o, d) || { division: d }, origin, 'view')).join('')).join('');
    printWindow(`Papers - ${orders.length} orders (View copy)`, MEMO_CSS + CHALLAN_CSS.replace('@page { size: A4 landscape; margin: 6mm; }', ''), body);
}
