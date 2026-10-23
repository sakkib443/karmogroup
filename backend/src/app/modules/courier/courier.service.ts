import { Order } from '../order/order.model';
import AppError from '../../utils/AppError';
import config from '../../config';
import SteadfastService from './steadfast.service';
import PathaoService from './pathao.service';
import { actorOf, type Viewer } from '../order/order.desk';
import { emitFinanceUpdate } from '../../utils/socket';

/**
 * The courier board. Every order is one parcel (its packageId is the order's own id), sent
 * with Pathao or Steadfast from Courier Entry. TAB_EXPR puts each parcel in exactly one tab,
 * and the same expression drives the list and the counts, so a tab's number always matches
 * what the tab shows.
 */

export type Carrier = 'pathao' | 'steadfast';

const IN_TRANSIT = ['shipped', 'on_the_way', 'out_for_delivery', 'delivery_attempt'];
const FINISHED = ['delivered', 'cancelled', 'returned', 'refunded'];
const BEFORE_COURIER = ['pending', 'confirmed', 'factory', 'challan_ready', 'processing'];

// Courier words, as Steadfast (snake_case) and Pathao (Title Case) write them.
const RX_SENT = '^(|pending|in_review|pickup.*|.*approval_pending|order.?created|assigned.?for.?pickup)$';
const RX_HOLD = 'hold';
const RX_BACK = 'cancel|return';

const notSent = { $in: [{ $ifNull: ['$consignmentId', ''] }, ['', null]] };
const said = (rx: string) => ({ $regexMatch: { input: { $ifNull: ['$courierStatus', ''] }, regex: rx, options: 'i' } });

/** Which tab a parcel is in — used by both the list and the counts. */
const TAB_EXPR = {
    $switch: {
        branches: [
            { case: { $in: ['$status', BEFORE_COURIER] }, then: 'new' },
            { case: { $eq: ['$status', 'courier_entry'] }, then: 'ready' },
            { case: { $eq: ['$status', 'delivered'] }, then: 'delivered' },
            { case: { $in: ['$status', ['returned', 'refunded']] }, then: 'returned' },
            { case: { $eq: ['$status', 'cancelled'] }, then: 'cancelled' },
            // With the courier, by what the courier last said.
            { case: { $and: [{ $not: [notSent] }, said(RX_BACK)] }, then: 'returned' },
            { case: { $and: [{ $not: [notSent] }, said(RX_HOLD)] }, then: 'on_hold' },
            { case: { $and: [{ $not: [notSent] }, said(RX_SENT)] }, then: 'sent' },
        ],
        default: 'in_transit',
    },
};

export const TABS = ['new', 'ready', 'sent', 'in_transit', 'on_hold', 'delivered', 'returned', 'cancelled'] as const;

const configured = {
    steadfast: () => !!(config.steadfast.api_key && config.steadfast.secret_key),
    pathao: () => {
        const p = config.pathao;
        return !!(p.client_id && p.client_secret && p.username && p.password && p.store_id);
    },
};

/** What the courier collects at the door: the order total unless it is already paid. */
const codFor = (o: any) => (o.paymentStatus === 'paid' ? 0 : Math.round(o.total || 0));

const carrierOf = (o: any): Carrier | '' => {
    const c = String(o.carrier || '').toLowerCase();
    return c.includes('pathao') ? 'pathao' : c.includes('steadfast') ? 'steadfast' : '';
};

/** A courier status → what it means for the order. */
function readCourierStatus(raw: string) {
    const v = (raw || '').toLowerCase();
    if (/^(partial[ _]?)?deliver(ed|y)$/.test(v)) return { delivered: true, back: false, hold: false };
    if (/cancel|return/.test(v)) return { delivered: false, back: true, hold: false };
    return { delivered: false, back: false, hold: /hold/.test(v) };
}

/** The parcel as the board shows it. */
function parcel(o: any) {
    const a = o.shippingAddress || {};
    const back = readCourierStatus(o.courierStatus).back;
    return {
        orderId: String(o._id),
        orderNo: o.orderId,
        packageId: String(o._id),
        tab: o.tab,
        attention: o.tab === 'returned' && back && !['returned', 'refunded'].includes(o.status) ? 'confirm_return'
            : o.tab === 'on_hold' ? 'on_hold' : null,
        status: o.status,
        subtotal: o.total || 0,
        itemCount: (o.items || []).length,
        items: (o.items || []).slice(0, 4).map((it: any) => ({ thumbnail: it.thumbnail, name: it.name, quantity: it.quantity, color: it.color, size: it.size })),
        consignmentId: o.consignmentId || '',
        trackingNumber: o.trackingNumber || '',
        courierStatus: o.courierStatus || '',
        carrier: o.carrier || '',
        booked: !!o.consignmentId,
        bookedAt: o.courierBookedAt,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        codAmount: codFor(o),
        customer: a.fullName || '',
        phone: a.phone || '',
        address: a.address || '',
        area: a.area || '',
        city: a.city || '',
        postalCode: a.postalCode || '',
        note: o.note || '',
        createdAt: o.createdAt,
    };
}

function searchMatch(search?: string) {
    if (!search) return {};
    const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return { $or: [{ orderId: rx }, { 'shippingAddress.fullName': rx }, { 'shippingAddress.phone': rx }, { trackingNumber: rx }, { consignmentId: rx }] };
}

/* ─── Booking ──────────────────────────────────────────────── */

async function bookCore(order: any, carrier: Carrier, viewer?: Viewer) {
    if (order.consignmentId) throw new AppError(400, `Already sent with ${order.carrier || 'the courier'} (${order.consignmentId})`);
    if (order.status !== 'courier_entry') throw new AppError(400, 'Move the order to Courier Entry before sending it to the courier');

    const a = order.shippingAddress || {};
    const address = [a.address, a.area, a.city, a.postalCode].filter(Boolean).join(', ');
    const cod = codFor(order);

    if (carrier === 'pathao') {
        const booked = await PathaoService.createOrder({
            merchantOrderId: order.orderId || String(order._id),
            recipientName: a.fullName,
            recipientPhone: a.phone,
            recipientAddress: address,
            amountToCollect: cod,
            itemQuantity: (order.items || []).reduce((n: number, it: any) => n + (it.quantity || 0), 0) || 1,
            itemDescription: (order.items || []).map((it: any) => `${it.quantity} x ${it.name}`).join(', '),
            specialInstruction: order.note || '',
        });
        order.carrier = 'Pathao';
        order.consignmentId = booked.consignmentId;
        order.trackingNumber = booked.consignmentId;
        order.courierStatus = booked.status;
        order.courierFee = booked.deliveryFee;
    } else {
        const c = await SteadfastService.createConsignment({
            invoice: String(order.orderId || order._id),
            recipientName: a.fullName,
            recipientPhone: String(a.phone || '').replace(/\D/g, '').slice(-11),
            recipientAddress: address,
            codAmount: cod,
            note: order.note || '',
        });
        order.carrier = 'Steadfast';
        order.consignmentId = String(c.consignment_id);
        order.trackingNumber = c.tracking_code || '';
        order.courierStatus = String(c.status || 'in_review');
    }
    order.courierBookedAt = new Date();
    order.courierCod = cod;
    order.status = 'shipped';
    order.timeline.push({
        status: 'shipped',
        note: `Sent with ${order.carrier} · ${order.trackingNumber || order.consignmentId}`,
        by: actorOf(viewer), createdAt: new Date(),
    });
    return order;
}

/* ─── Status from the courier ──────────────────────────────── */

/**
 * Apply what the courier says. Delivered is applied at once (cash on delivery is then
 * paid); a parcel coming back is only flagged — a person confirms the return on the order.
 */
function applyCourierStatus(order: any, raw: string, source: string) {
    order.courierStatus = raw;
    const s = readCourierStatus(raw);
    if (s.delivered && IN_TRANSIT.includes(order.status)) {
        order.status = 'delivered';
        if (order.paymentMethod === 'cod') order.paymentStatus = 'paid';
        order.timeline.push({ status: 'delivered', note: `${source}: ${raw}`, createdAt: new Date() });
    } else if (!s.back && !s.delivered && order.status === 'shipped' && raw && !new RegExp(RX_SENT, 'i').test(raw)) {
        order.status = 'on_the_way';
        order.timeline.push({ status: 'on_the_way', note: `${source}: ${raw}`, createdAt: new Date() });
    }
    return { courierStatus: raw, packageStatus: order.status, needsConfirmation: s.back, suggestedStatus: s.back ? 'returned' : null };
}

async function refreshCore(order: any) {
    if (!order.consignmentId) throw new AppError(400, 'This parcel has not been sent to a courier yet');
    const carrier = carrierOf(order);
    let raw = '';
    if (carrier === 'pathao') {
        raw = (await PathaoService.getStatus(order.consignmentId)).status;
    } else if (carrier === 'steadfast') {
        const d = order.trackingNumber
            ? await SteadfastService.getStatusByTrackingCode(order.trackingNumber)
            : await SteadfastService.getStatusByCid(order.consignmentId);
        raw = String(d?.delivery_status || '');
    } else {
        throw new AppError(400, `Sent with ${order.carrier || 'an unknown courier'} — its status cannot be checked from here`);
    }
    return applyCourierStatus(order, raw, order.carrier);
}

/* ─── The service ──────────────────────────────────────────── */

const CourierService = {
    /** The board: parcels of one tab (or all), newest first. */
    async listPackages(opts: { tab?: string; search?: string; page?: number; limit?: number }) {
        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(opts.limit) || 20));
        const tabMatch = opts.tab && (TABS as readonly string[]).includes(opts.tab) ? { tab: opts.tab } : {};
        // "Ready to ship" lists the longest-waiting first; everything else the newest first.
        const sort: Record<string, 1 | -1> = opts.tab === 'ready' || opts.tab === 'new' ? { createdAt: 1 } : { createdAt: -1 };
        const [out] = await Order.aggregate([
            { $match: searchMatch(opts.search) },
            { $addFields: { tab: TAB_EXPR } },
            { $match: tabMatch },
            {
                $facet: {
                    rows: [{ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit }],
                    total: [{ $count: 'n' }],
                },
            },
        ]);
        const total = out?.total?.[0]?.n || 0;
        return {
            data: (out?.rows || []).map(parcel),
            meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
        };
    },

    /** Parcels per tab, what needs a person, and which couriers are connected. */
    async counts(search?: string) {
        const rows = await Order.aggregate([
            { $match: searchMatch(search) },
            { $addFields: { tab: TAB_EXPR, back: said(RX_BACK) } },
            {
                $group: {
                    _id: '$tab', n: { $sum: 1 },
                    confirmReturn: { $sum: { $cond: [{ $and: ['$back', { $not: [{ $in: ['$status', ['returned', 'refunded']] }] }] }, 1, 0] } },
                },
            },
        ]);
        const counts: Record<string, number> = { all: 0 };
        for (const t of TABS) counts[t] = 0;
        let confirmReturn = 0;
        for (const r of rows) {
            counts[r._id] = r.n;
            counts.all += r.n;
            if (r._id === 'returned') confirmReturn += r.confirmReturn;
        }
        return {
            counts,
            attention: { confirmReturn, onHold: counts.on_hold },
            setup: {
                configured: configured.steadfast() || configured.pathao(),
                steadfast: configured.steadfast(),
                pathao: configured.pathao(),
                webhookSecured: !!config.steadfast.webhook_secret,
                autoSync: !!config.steadfast.auto_sync,
            },
        };
    },

    async book(orderId: string, carrier: Carrier, viewer?: Viewer) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        await bookCore(order, carrier, viewer);
        await order.save();
        // Shipped moves the money figures, and the customer hears about it.
        emitFinanceUpdate('order_status:shipped');
        try {
            const { NotificationService } = require('../notification/notification.service');
            NotificationService.notify({
                user: String(order.user), type: 'order_status', title: 'Order status updated',
                message: `Your order ${order.orderId} is now "Shipped".`,
                link: '/dashboard/user/orders/' + String(order._id), meta: { orderId: String(order._id), status: 'shipped' },
            }).catch(() => {});
        } catch { /* never block the booking */ }
        return order;
    },

    async bulkBook(orderIds: string[], carrier: Carrier, viewer?: Viewer) {
        const results: { orderId: string; packageId: string; ok: boolean; trackingNumber?: string; error?: string }[] = [];
        for (const orderId of orderIds || []) {
            try {
                const order = await this.book(orderId, carrier, viewer);
                results.push({ orderId, packageId: orderId, ok: true, trackingNumber: order.trackingNumber || order.consignmentId });
            } catch (e: any) {
                results.push({ orderId, packageId: orderId, ok: false, error: e?.message || 'Booking failed' });
            }
        }
        const booked = results.filter((r) => r.ok).length;
        return { total: results.length, booked, failed: results.length - booked, results };
    },

    async refreshStatus(orderId: string) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        const out = await refreshCore(order);
        await order.save();
        return out;
    },

    async bulkRefresh(orderIds: string[]) {
        const results: { orderId: string; packageId: string; ok: boolean; courierStatus?: string; needsConfirmation?: boolean; error?: string }[] = [];
        for (const orderId of orderIds || []) {
            try {
                const out = await this.refreshStatus(orderId);
                results.push({ orderId, packageId: orderId, ok: true, courierStatus: out.courierStatus, needsConfirmation: out.needsConfirmation });
            } catch (e: any) {
                results.push({ orderId, packageId: orderId, ok: false, error: e?.message || 'Refresh failed' });
            }
        }
        const ok = results.filter((r) => r.ok).length;
        return { total: results.length, ok, failed: results.length - ok, results };
    },

    /** Every parcel still with a connected courier (oldest-checked first, at most 80 at a time). */
    async syncActive() {
        const carriers = [configured.steadfast() && /steadfast/i, configured.pathao() && /pathao/i].filter(Boolean) as RegExp[];
        if (!carriers.length) return { total: 0, ok: 0, failed: 0, results: [] };
        const orders = await Order.find({ consignmentId: { $nin: [null, ''] }, status: { $in: IN_TRANSIT }, carrier: { $in: carriers } })
            .sort({ updatedAt: 1 }).limit(80).select('_id').lean();
        return this.bulkRefresh(orders.map((o: any) => String(o._id)));
    },

    /** Steadfast pushes a delivery-status change to us. */
    async applyWebhook(payload: any) {
        const cid = payload?.consignment_id ?? payload?.cid;
        const invoice: string = payload?.invoice || '';
        const raw = String(payload?.delivery_status || payload?.status || '');
        if (!cid && !invoice) throw new AppError(400, 'Webhook payload missing consignment_id / invoice.');
        const order: any = cid ? await Order.findOne({ consignmentId: String(cid) }) : await Order.findOne({ orderId: invoice });
        if (!order) return { matched: false };
        const out = applyCourierStatus(order, raw, 'Steadfast webhook');
        await order.save();
        return { matched: true, orderStatus: order.status, needsConfirmation: out.needsConfirmation };
    },

    async getBalance() {
        return SteadfastService.getBalance();
    },
};

export default CourierService;
