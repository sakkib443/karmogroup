import { Order } from '../order/order.model';
import AppError from '../../utils/AppError';

/**
 * Fraud check, worked out live from the orders (nothing is stored): every phone number's
 * history — how many orders it placed, took, refused at the door and cancelled. A customer
 * who refused a parcel or cancelled shows up here; one with an order still open is the one
 * to look at before confirming. Super admin, admin, manager, online sales.
 */

export type Risk = 'none' | 'low' | 'medium' | 'high';

const OPEN = ['pending', 'confirmed', 'factory', 'challan_ready', 'courier_entry', 'processing'];
const DONE_BACK = ['returned', 'refunded'];

// "+880 1712-345 678" → "01712345678" (same as Order insights).
const PHONE = {
    $let: {
        vars: { p: { $replaceAll: { input: { $replaceAll: { input: { $ifNull: ['$shippingAddress.phone', ''] }, find: ' ', replacement: '' } }, find: '-', replacement: '' } } },
        in: {
            $cond: [{ $eq: [{ $substrCP: ['$$p', 0, 3] }, '+88'] }, { $substrCP: ['$$p', 3, 20] },
                { $cond: [{ $and: [{ $eq: [{ $substrCP: ['$$p', 0, 2] }, '88'] }, { $eq: [{ $strLenCP: '$$p' }, 13] }] }, { $substrCP: ['$$p', 2, 20] }, '$$p'] }],
        },
    },
};
const normPhone = (raw: string) => {
    const d = String(raw || '').replace(/\D/g, '');
    return d.startsWith('880') ? d.slice(2) : d.startsWith('88') && d.length === 13 ? d.slice(2) : d;
};

/** What happened to each order, for counting. */
const ORDER_FLAGS = {
    phone: PHONE,
    wasDelivered: { $in: ['delivered', { $ifNull: ['$timeline.status', []] }] },
};
const REFUSED = {
    $or: [
        { $and: [{ $in: ['$status', DONE_BACK] }, { $not: ['$wasDelivered'] }] },
        { $and: [{ $ne: ['$status', 'delivered'] }, { $gt: [{ $strLenCP: { $ifNull: ['$consignmentId', ''] } }, 0] }, { $regexMatch: { input: { $ifNull: ['$courierStatus', ''] }, regex: 'cancel|return', options: 'i' } }] },
    ],
};

const GROUP = {
    _id: '$phone',
    name: { $last: '$shippingAddress.fullName' },
    orders: { $sum: 1 },
    delivered: { $sum: { $cond: [{ $or: [{ $eq: ['$status', 'delivered'] }, { $and: [{ $in: ['$status', DONE_BACK] }, '$wasDelivered'] }] }, 1, 0] } },
    refused: { $sum: { $cond: [REFUSED, 1, 0] } },
    cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
    returnedLater: { $sum: { $cond: [{ $and: [{ $in: ['$status', DONE_BACK] }, '$wasDelivered'] }, 1, 0] } },
    open: { $sum: { $cond: [{ $in: ['$status', OPEN] }, 1, 0] } },
    spent: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$total', 0] } },
    lastAt: { $max: '$createdAt' },
    openOrders: { $push: { $cond: [{ $in: ['$status', OPEN] }, { _id: '$_id', orderId: '$orderId', status: '$status', total: '$total' }, '$$REMOVE'] } },
    problems: {
        $push: {
            $cond: [{ $or: [REFUSED, { $eq: ['$status', 'cancelled'] }] },
                { orderId: '$orderId', _id: '$_id', kind: { $cond: [{ $eq: ['$status', 'cancelled'] }, 'cancelled', 'refused'] }, reason: { $ifNull: ['$cancelReason', ''] }, at: '$updatedAt' },
                '$$REMOVE'],
        },
    },
};

/** How careful to be with this number. */
export function riskOf(c: { delivered: number; refused: number; cancelled: number }): Risk {
    const bad = c.refused + c.cancelled;
    const finished = c.delivered + bad;
    if (c.refused >= 2 || (bad >= 2 && finished >= 2 && bad / finished >= 0.5)) return 'high';
    if (c.refused >= 1 || c.cancelled >= 2) return 'medium';
    if (c.cancelled >= 1) return 'low';
    return 'none';
}
const RISK_RANK: Record<Risk, number> = { high: 3, medium: 2, low: 1, none: 0 };

const shape = (g: any) => {
    const problems = (g.problems || []).sort((a: any, b: any) => +new Date(b.at) - +new Date(a.at));
    const finished = g.delivered + g.refused + g.cancelled;
    return {
        phone: g._id, name: g.name || '', orders: g.orders, delivered: g.delivered, refused: g.refused, cancelled: g.cancelled,
        returnedLater: g.returnedLater, open: g.open, spent: g.spent, lastAt: g.lastAt,
        success: finished ? Math.round((g.delivered / finished) * 100) : null,
        risk: riskOf(g), openOrders: g.openOrders || [], lastProblem: problems[0] || null, problems: problems.slice(0, 5),
    };
};

const FraudService = {
    /** Customers who refused a parcel or cancelled — with counts for the tabs. */
    async customers(q: Record<string, unknown>) {
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
        const rows = await Order.aggregate([
            { $addFields: ORDER_FLAGS },
            { $match: { phone: { $ne: '' } } },
            { $group: GROUP },
            { $match: { $or: [{ refused: { $gt: 0 } }, { cancelled: { $gt: 0 } }] } },
        ]);
        let list = rows.map(shape);
        const summary = {
            risky: list.length,
            high: list.filter((c) => c.risk === 'high').length,
            open: list.filter((c) => c.open > 0).length,
            refused: list.filter((c) => c.refused > 0).length,
            cancelled: list.filter((c) => c.cancelled > 0).length,
        };
        const tab = String(q.tab || 'open');
        if (tab === 'open') list = list.filter((c) => c.open > 0);
        if (tab === 'refused') list = list.filter((c) => c.refused > 0);
        if (tab === 'cancelled') list = list.filter((c) => c.cancelled > 0);
        if (tab === 'high') list = list.filter((c) => c.risk === 'high');
        if (q.search) {
            const s = String(q.search).toLowerCase().trim();
            const d = normPhone(s);
            list = list.filter((c) => c.name.toLowerCase().includes(s) || (d && c.phone.includes(d)));
        }
        list.sort((a, b) => (RISK_RANK[b.risk] - RISK_RANK[a.risk]) || (b.open - a.open) || (+new Date(b.lastAt) - +new Date(a.lastAt)));
        const total = list.length;
        return {
            data: list.slice((page - 1) * limit, page * limit),
            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
            summary,
        };
    },

    /** One phone number's whole history. */
    async lookup(raw: string, exceptOrder?: string) {
        const phone = normPhone(raw);
        if (phone.length < 10) throw new AppError(400, 'Type a full mobile number');
        const tail = phone.slice(-10);
        const docs = await Order.find({ 'shippingAddress.phone': new RegExp(tail.split('').join('[\\s-]*') + '$') })
            .select('orderId status total createdAt updatedAt shippingAddress.fullName shippingAddress.phone cancelReason consignmentId courierStatus timeline.status')
            .sort({ createdAt: -1 }).lean();
        const others = docs.filter((o: any) => String(o._id) !== String(exceptOrder || ''));
        if (!others.length) return null;
        const [g] = await Order.aggregate([
            { $match: { _id: { $in: others.map((o: any) => o._id) } } },
            { $addFields: ORDER_FLAGS },
            { $addFields: { phone } },
            { $group: GROUP },
        ]);
        const c = shape(g);
        return {
            ...c,
            recent: others.slice(0, 8).map((o: any) => {
                const wasDelivered = (o.timeline || []).some((t: any) => t.status === 'delivered');
                const refused = (DONE_BACK.includes(o.status) && !wasDelivered) || (o.status !== 'delivered' && !!o.consignmentId && /cancel|return/i.test(o.courierStatus || ''));
                return { _id: o._id, orderId: o.orderId, status: o.status, total: o.total, createdAt: o.createdAt, refused, reason: o.cancelReason || '' };
            }),
        };
    },

    /** The warning on an order page: this customer's other orders, if any went wrong. */
    async forOrder(orderId: string) {
        const order: any = await Order.findById(orderId).select('shippingAddress.phone').lean();
        if (!order) throw new AppError(404, 'Order not found');
        const h = order.shippingAddress?.phone ? await this.lookup(order.shippingAddress.phone, orderId).catch(() => null) : null;
        return h && h.risk !== 'none' ? h : null;
    },
};

export default FraudService;
