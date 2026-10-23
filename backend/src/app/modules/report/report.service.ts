import { Types } from 'mongoose';
import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import { Inquiry } from '../inquiry/inquiry.model';
import { divisionOf, STAFF_ROLES } from '../../constants/roles';
import { placeMatch } from '../order/order.service';

/**
 * Sales reports and staff activity, worked out from the orders for a date range (Dhaka
 * days). Sales = order money only; who-buys-from-where lives in Order insights.
 * Super admin, admin, manager.
 */

const DAY = 864e5;
const TZ = 'Asia/Dhaka';
const NOT_SOLD = ['cancelled', 'returned', 'refunded'];

/** "2026-10-24" (Dhaka) → that day's start; a range of at most two years. */
export function rangeOf(q: Record<string, unknown>) {
    const day = (s: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? new Date(`${s}T00:00:00+06:00`) : null);
    const todayStart = new Date(Math.floor((Date.now() + 6 * 3600e3) / DAY) * DAY - 6 * 3600e3);
    const to = day(q.to) || todayStart;
    let from = day(q.from) || new Date(to.getTime() - 29 * DAY);
    if (from > to) from = to;
    if (to.getTime() - from.getTime() > 730 * DAY) from = new Date(to.getTime() - 730 * DAY);
    return { from, end: new Date(to.getTime() + DAY), days: Math.round((to.getTime() - from.getTime()) / DAY) + 1 };
}

const ymd = (d: Date) => new Date(d.getTime() + 6 * 3600e3).toISOString().slice(0, 10);

/** Analytics filters: product division, channel, payment method, place (division / district terms). */
function salesFilter(q: Record<string, unknown>) {
    const and: Record<string, any>[] = [];
    if (q.division && q.division !== 'all') {
        const dv = divisionOf(q.division);
        and.push({ 'items.division': { $in: dv === 'fiber_pillow' ? ['fiber_pillow', 'pillow'] : dv === 'general' ? ['general', '', null] : [dv] } });
    }
    if (q.source && q.source !== 'all') and.push(q.source === 'website' ? { source: { $in: ['website', null] } } : { source: String(q.source) });
    if (q.paymentMethod && q.paymentMethod !== 'all') and.push({ paymentMethod: String(q.paymentMethod) });
    const place = placeMatch(q.places);
    if (place) and.push(place);
    return and;
}

const ReportService = {
    async sales(q: Record<string, unknown>) {
        const { from, end, days } = rangeOf(q);
        const filters = salesFilter(q);
        const sold = { $not: [{ $in: ['$status', NOT_SOLD] }] };
        const money = (cond: unknown, field: unknown = '$total') => ({ $sum: { $cond: [cond, field, 0] } });
        const count = (cond: unknown) => ({ $sum: { $cond: [cond, 1, 0] } });

        const [r] = await Order.aggregate([
            { $match: { createdAt: { $gte: from, $lt: end }, ...(filters.length ? { $and: filters } : {}) } },
            {
                $facet: {
                    totals: [{
                        $group: {
                            _id: null,
                            orders: { $sum: 1 },
                            sold: count(sold), soldValue: money(sold),
                            delivered: count({ $eq: ['$status', 'delivered'] }), deliveredValue: money({ $eq: ['$status', 'delivered'] }),
                            cancelled: count({ $eq: ['$status', 'cancelled'] }), cancelledValue: money({ $eq: ['$status', 'cancelled'] }),
                            returned: count({ $in: ['$status', ['returned', 'refunded']] }), returnedValue: money({ $in: ['$status', ['returned', 'refunded']] }),
                            discount: money(sold, { $ifNull: ['$discount', 0] }),
                            shipping: money(sold, { $ifNull: ['$shippingCost', 0] }),
                        },
                    }],
                    daily: [{
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
                            orders: { $sum: 1 }, sold: count(sold), revenue: money(sold),
                            delivered: count({ $eq: ['$status', 'delivered'] }), cancelled: count({ $eq: ['$status', 'cancelled'] }),
                        },
                    }],
                    divisions: [
                        { $match: { $expr: sold } },
                        { $unwind: '$items' },
                        { $group: { _id: { $ifNull: ['$items.division', 'general'] }, pieces: { $sum: '$items.quantity' }, value: { $sum: { $ifNull: ['$items.total', { $multiply: ['$items.price', '$items.quantity'] }] } } } },
                    ],
                    products: [
                        { $match: { $expr: sold } },
                        { $unwind: '$items' },
                        { $group: { _id: '$items.name', pieces: { $sum: '$items.quantity' }, value: { $sum: { $ifNull: ['$items.total', { $multiply: ['$items.price', '$items.quantity'] }] } } } },
                        { $sort: { value: -1 } }, { $limit: 10 },
                    ],
                    sources: [{ $group: { _id: { $ifNull: ['$source', 'website'] }, orders: { $sum: 1 }, value: money(sold) } }],
                    payments: [{ $group: { _id: '$paymentMethod', orders: { $sum: 1 }, value: money(sold) } }],
                    // Who brought the sale in: orders taken by phone (createdBy) and orders confirmed (confirmedBy).
                    taken: [
                        { $match: { source: 'manual', 'createdBy.id': { $exists: true } } },
                        { $group: { _id: '$createdBy.id', name: { $last: '$createdBy.name' }, role: { $last: '$createdBy.role' }, orders: { $sum: 1 }, value: money(sold), delivered: count({ $eq: ['$status', 'delivered'] }) } },
                    ],
                    confirmed: [
                        { $match: { 'confirmedBy.id': { $exists: true } } },
                        { $group: { _id: '$confirmedBy.id', name: { $last: '$confirmedBy.name' }, role: { $last: '$confirmedBy.role' }, orders: { $sum: 1 }, value: money(sold), delivered: count({ $eq: ['$status', 'delivered'] }) } },
                    ],
                },
            },
        ]);

        const t = r.totals[0] || { orders: 0, sold: 0, soldValue: 0, delivered: 0, deliveredValue: 0, cancelled: 0, cancelledValue: 0, returned: 0, returnedValue: 0, discount: 0, shipping: 0 };

        // The same length of time just before, with the same filters — for the ▲ / ▼ on each number.
        const prevFrom = new Date(from.getTime() - days * DAY);
        const [p] = await Order.aggregate([
            { $match: { createdAt: { $gte: prevFrom, $lt: from }, ...(filters.length ? { $and: filters } : {}) } },
            {
                $group: {
                    _id: null, orders: { $sum: 1 }, sold: count(sold), soldValue: money(sold),
                    delivered: count({ $eq: ['$status', 'delivered'] }), deliveredValue: money({ $eq: ['$status', 'delivered'] }),
                    cancelled: count({ $eq: ['$status', 'cancelled'] }), returned: count({ $in: ['$status', ['returned', 'refunded']] }),
                },
            },
        ]);
        const previous = p ? { ...p, _id: undefined, average: p.sold ? Math.round(p.soldValue / p.sold) : 0 } : { orders: 0, sold: 0, soldValue: 0, delivered: 0, deliveredValue: 0, cancelled: 0, returned: 0, average: 0 };
        delete t._id;
        const byDay = new Map(r.daily.map((d: any) => [d._id, d]));
        const daily = Array.from({ length: days }, (_, i) => {
            const date = ymd(new Date(from.getTime() + i * DAY));
            const d: any = byDay.get(date) || {};
            return { date, orders: d.orders || 0, sold: d.sold || 0, revenue: d.revenue || 0, delivered: d.delivered || 0, cancelled: d.cancelled || 0 };
        });

        // One row per staff member: what they took by phone and what they confirmed.
        const staff = new Map<string, any>();
        const row = (x: any) => {
            const id = String(x._id);
            if (!staff.has(id)) staff.set(id, { id, name: x.name || '', role: x.role || '', taken: 0, takenValue: 0, confirmed: 0, confirmedValue: 0, delivered: 0 });
            return staff.get(id);
        };
        for (const x of r.taken) { const s = row(x); s.taken = x.orders; s.takenValue = x.value; s.delivered += x.delivered; }
        for (const x of r.confirmed) { const s = row(x); s.confirmed = x.orders; s.confirmedValue = x.value; s.delivered = Math.max(s.delivered, x.delivered); }

        const divMap = new Map<string, { pieces: number; value: number }>();
        for (const d of r.divisions) {
            const k = divisionOf(d._id);
            const v = divMap.get(k) || { pieces: 0, value: 0 };
            v.pieces += d.pieces; v.value += d.value; divMap.set(k, v);
        }

        return {
            from: ymd(from), to: ymd(new Date(end.getTime() - DAY)), days,
            totals: { ...t, average: t.sold ? Math.round(t.soldValue / t.sold) : 0 },
            previous: { from: ymd(prevFrom), to: ymd(new Date(from.getTime() - DAY)), ...previous },
            daily,
            divisions: [...divMap.entries()].map(([division, v]) => ({ division, ...v })).sort((a, b) => b.value - a.value),
            products: r.products.map((p: any) => ({ name: p._id, pieces: p.pieces, value: p.value })),
            sources: r.sources.map((s: any) => ({ source: s._id, orders: s.orders, value: s.value })),
            payments: r.payments.map((s: any) => ({ method: s._id || 'cod', orders: s.orders, value: s.value })),
            staff: [...staff.values()].sort((a, b) => (b.takenValue + b.confirmedValue) - (a.takenValue + a.confirmedValue)),
        };
    },

    /**
     * Money received from customers in the range: every paid order, dated by when the money
     * came — the delivery day for cash on delivery, the order day for bKash / Nagad / card.
     */
    async payments(q: Record<string, unknown>) {
        const { from, end } = rangeOf(q);
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(q.limit) || 30));
        const method = q.method && q.method !== 'all' ? String(q.method) : '';
        const search = String(q.search || '').trim();
        const rx = search ? new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;

        const base: any[] = [
            { $match: { paymentStatus: { $in: ['paid', 'refunded'] }, ...(method ? { paymentMethod: method } : {}), ...(rx ? { $or: [{ orderId: rx }, { 'shippingAddress.fullName': rx }, { 'shippingAddress.phone': rx }] } : {}) } },
            {
                $addFields: {
                    paidAt: {
                        $cond: [
                            { $eq: ['$paymentMethod', 'cod'] },
                            { $ifNull: [{ $first: { $map: { input: { $filter: { input: '$timeline', cond: { $eq: ['$$this.status', 'delivered'] } } }, in: '$$this.createdAt' } } }, '$updatedAt'] },
                            '$createdAt',
                        ],
                    },
                },
            },
            { $match: { paidAt: { $gte: from, $lt: end } } },
        ];
        const [r] = await Order.aggregate([
            ...base,
            {
                $facet: {
                    rows: [
                        { $sort: { paidAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit },
                        { $project: { _id: 1, orderId: 1, total: 1, paymentMethod: 1, paymentStatus: 1, status: 1, paidAt: 1, transactionId: 1, customer: '$shippingAddress.fullName', phone: '$shippingAddress.phone' } },
                    ],
                    total: [{ $count: 'n' }],
                    methods: [{ $group: { _id: '$paymentMethod', n: { $sum: 1 }, value: { $sum: '$total' } } }],
                    refunded: [{ $match: { paymentStatus: 'refunded' } }, { $group: { _id: null, n: { $sum: 1 }, value: { $sum: '$total' } } }],
                    customers: [
                        { $match: { paymentStatus: 'paid' } },
                        { $group: { _id: '$shippingAddress.phone', name: { $last: '$shippingAddress.fullName' }, n: { $sum: 1 }, value: { $sum: '$total' }, last: { $max: '$paidAt' } } },
                        { $sort: { value: -1 } }, { $limit: 10 },
                    ],
                },
            },
        ]);
        // Still to be paid: orders that stand (not cancelled / returned) and are not paid yet.
        const [due] = await Order.aggregate([
            { $match: { paymentStatus: { $nin: ['paid', 'refunded'] }, status: { $nin: ['cancelled', 'returned', 'refunded'] } } },
            { $group: { _id: null, n: { $sum: 1 }, value: { $sum: '$total' } } },
        ]);
        const methods = (r.methods || []).map((m: any) => ({ method: m._id || 'cod', orders: m.n, value: m.value })).sort((a: any, b: any) => b.value - a.value);
        const refunded = r.refunded?.[0] || { n: 0, value: 0 };
        const received = methods.reduce((a: number, m: any) => a + m.value, 0) - refunded.value;
        const total = r.total?.[0]?.n || 0;
        return {
            from: ymd(from), to: ymd(new Date(end.getTime() - DAY)),
            summary: {
                received, orders: total - refunded.n,
                cod: methods.filter((m: any) => m.method === 'cod').reduce((a: number, m: any) => a + m.value, 0),
                online: methods.filter((m: any) => m.method !== 'cod').reduce((a: number, m: any) => a + m.value, 0),
                refunded: { n: refunded.n, value: refunded.value },
                due: { n: due?.n || 0, value: due?.value || 0 },
            },
            methods,
            customers: (r.customers || []).map((c: any) => ({ phone: c._id, name: c.name, orders: c.n, value: c.value, last: c.last })),
            rows: r.rows || [],
            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
        };
    },

    /** What each staff member did in the range. */
    async staff(q: Record<string, unknown>) {
        const { from, end } = rangeOf(q);
        const inRange = { $gte: from, $lt: end };
        const per = (rows: any[]) => new Map(rows.map((x: any) => [String(x._id), x.n]));

        const [taken, confirmed, cancelled, shipped, sms, scans, challans, inquiries, users] = await Promise.all([
            Order.aggregate([{ $match: { source: 'manual', createdAt: inRange, 'createdBy.id': { $exists: true } } }, { $group: { _id: '$createdBy.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { confirmedAt: inRange, 'confirmedBy.id': { $exists: true } } }, { $group: { _id: '$confirmedBy.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { cancelledAt: inRange, 'cancelledBy.id': { $exists: true } } }, { $group: { _id: '$cancelledBy.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { 'timeline.status': 'shipped', updatedAt: { $gte: from } } }, { $unwind: '$timeline' }, { $match: { 'timeline.status': 'shipped', 'timeline.createdAt': inRange, 'timeline.by.id': { $exists: true } } }, { $group: { _id: '$timeline.by.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { 'sms.at': inRange } }, { $unwind: '$sms' }, { $match: { 'sms.at': inRange, 'sms.by.id': { $exists: true } } }, { $group: { _id: '$sms.by.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { 'jobs.units.scannedAt': inRange } }, { $unwind: '$jobs' }, { $unwind: '$jobs.units' }, { $match: { 'jobs.units.scannedAt': inRange } }, { $group: { _id: '$jobs.units.scannedBy.id', n: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { 'jobs.issuedAt': inRange } }, { $unwind: '$jobs' }, { $match: { 'jobs.issuedAt': inRange } }, { $group: { _id: '$jobs.issuedBy.id', n: { $sum: 1 } } }]),
            Inquiry.aggregate([{ $match: { handledAt: inRange, 'handledBy.id': { $exists: true } } }, { $group: { _id: '$handledBy.id', n: { $sum: 1 } } }]),
            User.find({ role: { $in: STAFF_ROLES } }).select('firstName lastName role status').lean(),
        ]);
        const m = { taken: per(taken), confirmed: per(confirmed), cancelled: per(cancelled), shipped: per(shipped), sms: per(sms), scans: per(scans), challans: per(challans), inquiries: per(inquiries) };
        const rows = users.map((u: any) => {
            const id = String(u._id);
            const counts = Object.fromEntries(Object.entries(m).map(([k, map]) => [k, map.get(id) || 0])) as Record<keyof typeof m, number>;
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            return { id, name: [u.firstName, u.lastName].filter((x: string) => x && x !== '.').join(' '), role: u.role, status: u.status, ...counts, total };
        }).sort((a: any, b: any) => b.total - a.total || a.name.localeCompare(b.name));
        const totals = Object.fromEntries(Object.keys(m).map((k) => [k, rows.reduce((a: number, r: any) => a + r[k], 0)]));
        return { from: ymd(from), to: ymd(new Date(end.getTime() - DAY)), rows, totals };
    },

    /** One staff member's own numbers and latest actions (My profile). */
    async mine(userId: string, q: Record<string, unknown>) {
        const all = await this.staff(q);
        const row = all.rows.find((r: any) => r.id === String(userId)) || null;
        const log = await this.log({ ...q, actor: userId, limit: 8 });
        return { from: all.from, to: all.to, counts: row, recent: log.data };
    },

    /** Everything staff did to orders in the range, newest first (optionally one person). */
    async log(q: Record<string, unknown>) {
        const { from, end } = rangeOf(q);
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(q.limit) || 30));
        const actor = q.actor && Types.ObjectId.isValid(String(q.actor)) ? new Types.ObjectId(String(q.actor)) : null;
        const [r] = await Order.aggregate([
            { $match: { updatedAt: { $gte: from } } },
            { $unwind: '$timeline' },
            { $match: { 'timeline.createdAt': { $gte: from, $lt: end }, 'timeline.by.id': actor || { $exists: true } } },
            { $sort: { 'timeline.createdAt': -1 } },
            {
                $facet: {
                    rows: [{ $skip: (page - 1) * limit }, { $limit: limit }, { $project: { _id: 0, orderObjectId: '$_id', orderId: 1, status: '$timeline.status', note: '$timeline.note', by: '$timeline.by', at: '$timeline.createdAt' } }],
                    total: [{ $count: 'n' }],
                },
            },
        ]);
        const total = r?.total?.[0]?.n || 0;
        return { data: r?.rows || [], meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    },
};

export default ReportService;
