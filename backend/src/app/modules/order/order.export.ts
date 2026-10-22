import ExcelJS from 'exceljs';

/**
 * The order list as an Excel (.xlsx) file — one row per order, the same columns the
 * admin's Orders table shows, plus a Summary sheet. Built from the orders the list
 * endpoint already returned (so the filters, and what each role may see, are the same).
 */

const BRAND = 'FFF85606';
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000; // Bangladesh is UTC+6, all year

const STATUS_LABEL: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    factory: 'Factory',
    challan_ready: 'Challan Ready',
    courier_entry: 'Courier Entry',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
    refunded: 'Refunded',
};
const PAYMENT_LABEL: Record<string, string> = { pending: 'Unpaid', paid: 'Paid', failed: 'Failed', refunded: 'Refunded' };
const METHOD_LABEL: Record<string, string> = {
    cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', sslcommerz: 'SSLCommerz', bank: 'Bank transfer',
};

const label = (map: Record<string, string>, v?: string) =>
    (v && map[v]) || (v ? v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');

/** A moment as Bangladesh wall-clock time. Excel has no time zone, so shift, then read as UTC. */
const dhaka = (d: Date | string) => new Date(new Date(d).getTime() + DHAKA_OFFSET_MS);
const dayText = (d: Date) => dhaka(d).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });
const timeText = (d: Date | string) => dhaka(d).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true });

const customerName = (o: any) =>
    o.shippingAddress?.fullName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest';
const customerPhone = (o: any) => o.shippingAddress?.phone || o.user?.phone || '';
const consignment = (o: any) =>
    o.consignmentId || (o.packages || []).map((p: any) => p.consignmentId).filter(Boolean).join(', ');
const pieces = (o: any) => (o.items || []).reduce((n: number, it: any) => n + (Number(it.quantity) || 0), 0);

/** What has been paid and what is still owed — the same rule the Orders table uses. */
function money(o: any) {
    const total = Number(o.total || 0);
    if (o.paymentStatus === 'paid') return { paid: total, due: 0 };
    if (o.paymentStatus === 'refunded') return { paid: 0, due: 0 };
    if (o.status === 'cancelled') return { paid: 0, due: 0 };
    return { paid: 0, due: total };
}

export interface OrdersExportInfo {
    /** What the person asked for, e.g. "Today", "Last 7 days" — shown on the Summary sheet. */
    title: string;
    from?: Date | null;
    to?: Date | null;
    /** Orders matched in all (may exceed what was exported if the safety cap was hit). */
    matched: number;
    /** Plain-language filters, e.g. ["Status: Pending"]. */
    filters: string[];
    generatedBy: string;
}

export async function buildOrdersXlsx(orders: any[], info: OrdersExportInfo): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Karmo Group';
    wb.created = new Date();

    const head = (row: ExcelJS.Row) => {
        row.height = 22;
        row.eachCell((c) => {
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
            c.alignment = { vertical: 'middle', horizontal: 'left' };
        });
    };

    /* ── Orders ── */
    const ws = wb.addWorksheet('Orders', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
        { header: 'SL', key: 'sl', width: 6 },
        { header: 'Date', key: 'date', width: 13 },
        { header: 'Time', key: 'time', width: 10 },
        { header: 'Order No', key: 'orderId', width: 16 },
        { header: 'Customer', key: 'customer', width: 24 },
        { header: 'Phone', key: 'phone', width: 14 },
        { header: 'Address', key: 'address', width: 42 },
        { header: 'Pieces', key: 'pieces', width: 8 },
        { header: 'Products', key: 'products', width: 46 },
        { header: 'Total (BDT)', key: 'total', width: 13 },
        { header: 'Paid (BDT)', key: 'paid', width: 12 },
        { header: 'Due (BDT)', key: 'due', width: 12 },
        { header: 'Payment Method', key: 'method', width: 18 },
        { header: 'Payment Status', key: 'payment', width: 14 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Consignment', key: 'consignment', width: 18 },
    ];
    head(ws.getRow(1));

    let totalSum = 0;
    let paidSum = 0;
    let dueSum = 0;
    let pieceSum = 0;
    const byStatus = new Map<string, { count: number; total: number }>();

    orders.forEach((o, i) => {
        const m = money(o);
        const a = o.shippingAddress || {};
        const total = Number(o.total || 0);
        totalSum += total;
        paidSum += m.paid;
        dueSum += m.due;
        pieceSum += pieces(o);
        const s = byStatus.get(o.status) || { count: 0, total: 0 };
        s.count += 1;
        s.total += total;
        byStatus.set(o.status, s);

        const d = dhaka(o.createdAt);
        d.setUTCHours(0, 0, 0, 0);
        const row = ws.addRow({
            sl: i + 1,
            date: d,
            time: timeText(o.createdAt),
            orderId: o.orderId || String(o._id),
            customer: customerName(o),
            phone: String(customerPhone(o)), // text, so a leading 0 stays
            address: [a.address, a.area, a.city].filter(Boolean).join(', '),
            pieces: pieces(o),
            products: (o.items || [])
                .map((it: any) => `${it.quantity} × ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(', ')})` : ''}`)
                .join('\n'),
            total,
            paid: m.paid,
            due: m.due,
            method: label(METHOD_LABEL, o.paymentMethod),
            payment: label(PAYMENT_LABEL, o.paymentStatus),
            status: label(STATUS_LABEL, o.status),
            consignment: consignment(o),
        });
        row.alignment = { vertical: 'top', wrapText: true };
    });

    ws.getColumn('date').numFmt = 'dd mmm yyyy';
    for (const k of ['total', 'paid', 'due']) ws.getColumn(k).numFmt = '#,##0';

    if (orders.length) {
        const last = orders.length + 1;
        ws.autoFilter = { from: 'A1', to: `P${last}` };
        // Totals that follow the filter: SUBTOTAL ignores rows the user hides in Excel.
        const foot = ws.addRow({ customer: 'Totals (visible rows)' });
        const sub = (col: string, result: number) => ({ formula: `SUBTOTAL(109,${col}2:${col}${last})`, result });
        foot.getCell('pieces').value = sub('H', pieceSum);
        foot.getCell('total').value = sub('J', totalSum);
        foot.getCell('paid').value = sub('K', paidSum);
        foot.getCell('due').value = sub('L', dueSum);
        foot.font = { bold: true };
        foot.eachCell((c) => { c.border = { top: { style: 'thin', color: { argb: 'FF9CA3AF' } } }; });
        for (const k of ['total', 'paid', 'due']) foot.getCell(k).numFmt = '#,##0';
    }

    /* ── Summary ── */
    const sm = wb.addWorksheet('Summary');
    sm.columns = [{ width: 26 }, { width: 22 }, { width: 18 }];
    sm.addRow(['Karmo Group — Orders']).font = { bold: true, size: 14 };
    sm.addRow(['Report', info.title]);
    const range =
        info.from && info.to ? (dayText(info.from) === dayText(info.to) ? dayText(info.from) : `${dayText(info.from)} — ${dayText(info.to)}`)
            : info.from ? `From ${dayText(info.from)}`
                : info.to ? `Up to ${dayText(info.to)}`
                    : 'All time';
    sm.addRow(['Dates', range]);
    sm.addRow(['Filters', info.filters.length ? info.filters.join(' · ') : 'None']);
    sm.addRow(['Generated', `${dayText(new Date())}, ${timeText(new Date())} (Dhaka)`]);
    sm.addRow(['Generated by', info.generatedBy]);
    sm.addRow([]);
    head(sm.addRow(['Metric', 'Value']));
    sm.addRow(['Orders', orders.length]);
    sm.addRow(['Pieces', pieceSum]);
    for (const [name, v] of [['Total value (BDT)', totalSum], ['Paid (BDT)', paidSum], ['Due (BDT)', dueSum]] as [string, number][]) {
        const r = sm.addRow([name, v]);
        r.getCell(2).numFmt = '#,##0';
    }
    if (info.matched > orders.length) {
        sm.addRow(['Note', `Only the first ${orders.length} of ${info.matched} matching orders are included — narrow the dates.`]).font = { color: { argb: 'FFB45309' } };
    }
    sm.addRow([]);
    head(sm.addRow(['Status', 'Orders', 'Value (BDT)']));
    [...byStatus.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([st, v]) => {
            const r = sm.addRow([label(STATUS_LABEL, st), v.count, v.total]);
            r.getCell(3).numFmt = '#,##0';
        });

    const arr = await wb.xlsx.writeBuffer();
    return Buffer.from(arr as ArrayBuffer);
}
