/**
 * The order desk's role rules — who sees which orders, who may move them where, and
 * the once-only factory paperwork. docs/USER-ROLES.md is the plain-language version.
 *
 *   agency        pending orders (+ the ones they handled today); confirm / cancel / SMS
 *   factory       confirmed orders of their divisions, no money; scan pieces out, issue challan
 *   online_sales  everything after confirmation; memo, courier, returns
 *   manager       the whole flow except refunds and payments
 *   admin / superadmin  everything
 */
import { Order, nextInSeries, ORDER_STATUS_LABEL } from './order.model';
import AppError from '../../utils/AppError';
import config from '../../config';
import { ROLE_LABEL, divisionOf, divisionMeta, DIVISIONS, type Role } from '../../constants/roles';
import { sendSms, intlPhone } from '../../utils/sms';

export type Viewer = { userId: string; role: Role; name?: string; divisions?: string[] };

export const actorOf = (v?: Viewer) =>
    v ? { id: v.userId, name: v.name || '', role: v.role } : undefined;

const isTop = (v: Viewer) => v.role === 'superadmin' || v.role === 'admin';

/** Midnight in Dhaka (UTC+6), as a Date — "today" for the desk's counters. */
export const dhakaDayStart = () => {
    const d = new Date(Date.now() + 6 * 3600e3);
    d.setUTCHours(0, 0, 0, 0);
    return new Date(d.getTime() - 6 * 3600e3);
};

/** A factory member's divisions as stored on order lines (older pillow lines say "pillow"). */
const lineDivisions = (divs: string[]) =>
    divs.flatMap((d) => (d === 'fiber_pillow' ? ['fiber_pillow', 'pillow'] : [d]));

const mayFactorySee = (v: Viewer, division: string) =>
    !v.divisions?.length || v.divisions.map(divisionOf).includes(divisionOf(division));

/* ─── What a viewer may see ───────────────────────────────── */

/** Query conditions limiting the orders a viewer may see (empty = all). */
export function scopeFor(v: Viewer): Record<string, any> {
    if (v.role === 'agency') {
        const today = dhakaDayStart();
        return {
            $or: [
                { status: 'pending' },
                { 'confirmedBy.id': v.userId, confirmedAt: { $gte: today } },
                { 'cancelledBy.id': v.userId, cancelledAt: { $gte: today } },
            ],
        };
    }
    if (v.role === 'factory') {
        const c: Record<string, any> = { status: { $in: ['confirmed', 'factory', 'challan_ready'] } };
        if (v.divisions?.length) c['items.division'] = { $in: lineDivisions(v.divisions) };
        return c;
    }
    return {};
}

/** 404 unless the viewer may see this order — never reveals that it exists. */
export async function assertVisible(orderId: string, v: Viewer) {
    const scope = scopeFor(v);
    if (!Object.keys(scope).length) return;
    const ok = await Order.exists({ $and: [{ _id: orderId }, scope] });
    if (!ok) throw new AppError(404, 'Order not found');
}

/** A challan as the desk shows it: its lines with how many pieces are scanned. */
function presentJob(job: any, items: any[]) {
    const byItem = new Map<number, { total: number; scanned: number }>();
    for (const u of job.units || []) {
        const e = byItem.get(u.itemIndex) || { total: 0, scanned: 0 };
        e.total += 1;
        if (u.scannedAt) e.scanned += 1;
        byItem.set(u.itemIndex, e);
    }
    const lines = [...byItem.entries()].map(([itemIndex, c]) => {
        const it = items[itemIndex] || {};
        return { itemIndex, name: it.name || '', size: it.size || '', color: it.color || '', quantity: c.total, scanned: c.scanned };
    });
    const unitsTotal = (job.units || []).length;
    const unitsScanned = (job.units || []).filter((u: any) => u.scannedAt).length;
    return {
        _id: job._id,
        division: job.division,
        label: divisionMeta(job.division).label,
        challanNo: job.challanNo,
        units: (job.units || []).map((u: any) => ({ code: u.code, itemIndex: u.itemIndex, scannedAt: u.scannedAt, scannedBy: u.scannedBy, method: u.method })),
        lines,
        unitsTotal,
        unitsScanned,
        issuedAt: job.issuedAt,
        issuedBy: job.issuedBy,
        reprints: job.reprints || [],
    };
}

/** The order as this viewer may see it: no buying prices below admin, no money at all for the factory. */
export function present(order: any, v: Viewer) {
    const o: any = typeof order?.toObject === 'function' ? order.toObject({ virtuals: true }) : { ...order };
    const items: any[] = o.items || [];
    o.jobs = (o.jobs || []).map((j: any) => presentJob(j, items));

    if (!isTop(v)) o.items = items.map(({ cost, ...it }: any) => it);

    if (v.role === 'factory') {
        o.items = o.items
            .map((it: any, i: number) => ({ ...it, _index: i }))
            .filter((it: any) => mayFactorySee(v, it.division));
        o.items.forEach((it: any) => { delete it.price; delete it.total; });
        o.jobs = o.jobs.filter((j: any) => mayFactorySee(v, j.division));
        for (const k of ['subtotal', 'shippingCost', 'discount', 'total', 'couponCode', 'couponCodes', 'paymentDetails',
            'transactionId', 'paymentStatus', 'paymentMethod', 'shippingFreeReason', 'courierFee', 'sms', 'memo']) delete o[k];
        const a = o.shippingAddress || {};
        o.shippingAddress = { fullName: a.fullName, phone: a.phone };
        if (o.user && typeof o.user === 'object') o.user = { _id: o.user._id, firstName: o.user.firstName, lastName: o.user.lastName };
    }
    return o;
}

/* ─── Who may move an order where ─────────────────────────── */

const STEPS: Record<string, Record<string, string[]>> = {
    agency: {
        pending: ['confirmed', 'cancelled'],
    },
    online_sales: {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['pending', 'cancelled'],
        challan_ready: ['courier_entry'],
        courier_entry: ['challan_ready', 'shipped'],
        shipped: ['delivered', 'returned'],
    },
};

const label = (s: string) => ORDER_STATUS_LABEL[s] || s;

export function assertTransition(v: Viewer, order: any, to: string) {
    const from = order.status;
    if (from === to) throw new AppError(400, `The order is already ${label(to)}`);
    if (isTop(v)) return;

    const anyScanned = (order.jobs || []).some((j: any) => (j.units || []).some((u: any) => u.scannedAt));
    if (to === 'cancelled' && anyScanned) {
        throw new AppError(403, 'Products have already left the factory for this order — only an admin can cancel it now');
    }
    if (v.role === 'manager') {
        if (to === 'refunded') throw new AppError(403, 'Refunds are for an admin');
        return;
    }
    if (!STEPS[v.role]?.[from]?.includes(to)) {
        throw new AppError(403, `${ROLE_LABEL[v.role] || v.role} cannot move an order from ${label(from)} to ${label(to)}`);
    }
}

/* ─── Factory challans ────────────────────────────────────── */

/**
 * Reserve one challan per division and one code per piece (M1000-1, M1000-2…).
 * Runs when the order is confirmed; harmless to call again.
 */
export async function ensureJobs(order: any): Promise<boolean> {
    if (order.jobs?.length) return false;
    const groups = new Map<string, number[]>();
    (order.items || []).forEach((it: any, i: number) => {
        const d = divisionOf(it.division);
        groups.set(d, [...(groups.get(d) || []), i]);
    });
    const ordered = [...DIVISIONS.map((d) => d.key), ...[...groups.keys()].filter((k) => !DIVISIONS.some((d) => d.key === k))];
    for (const key of ordered) {
        const idx = groups.get(key);
        if (!idx) continue;
        const prefix = divisionMeta(key).prefix;
        const challanNo = `${prefix}${await nextInSeries(`challan-${prefix}`, 1000)}`;
        const units: any[] = [];
        for (const i of idx) {
            const qty = Math.max(1, Number(order.items[i].quantity) || 1);
            for (let q = 0; q < qty; q++) units.push({ code: `${challanNo}-${units.length + 1}`, itemIndex: i });
        }
        order.jobs.push({ division: key, challanNo, units });
    }
    return true;
}

/** Tell the admins about something that looks wrong. Never blocks the desk. */
function alertAdmins(title: string, message: string, orderId: string) {
    try {
        const { NotificationService } = require('../notification/notification.service');
        NotificationService.notifyAdmins({
            type: 'scan_alert', title, message, link: '/dashboard/admin/orders/' + orderId, meta: { orderId },
        }).catch(() => {});
    } catch { /* ignore */ }
}

const when = (d?: Date) => (d ? new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');

export const OrderDesk = {
    /** Factory queue: every challan the viewer may work on, oldest confirmed first. */
    async factoryQueue(v: Viewer) {
        const where: Record<string, any> = { status: { $in: ['confirmed', 'factory', 'challan_ready'] } };
        if (v.role === 'factory' && v.divisions?.length) where['items.division'] = { $in: lineDivisions(v.divisions) };
        // Issued challans stay listed for three days, so the factory can see what left.
        where.$or = [{ status: { $in: ['confirmed', 'factory'] } }, { updatedAt: { $gte: new Date(Date.now() - 3 * 864e5) } }];

        const orders = await Order.find(where).sort({ confirmedAt: 1, createdAt: 1 }).limit(300);
        const out: any[] = [];
        for (const order of orders as any[]) {
            if (!order.jobs?.length && await ensureJobs(order)) await order.save();
            const items = order.items || [];
            for (const job of order.jobs || []) {
                if (v.role === 'factory' && !mayFactorySee(v, job.division)) continue;
                out.push({
                    order: {
                        _id: order._id, orderId: order.orderId, status: order.status,
                        createdAt: order.createdAt, confirmedAt: order.confirmedAt,
                        customer: { name: order.shippingAddress?.fullName || '', phone: order.shippingAddress?.phone || '' },
                        note: order.note || '',
                    },
                    job: presentJob(job, items),
                });
            }
        }
        return out;
    },

    /**
     * Scan one piece out. A piece code (M1000-2) scans that piece; a challan code (M1000)
     * scans the next piece still waiting. Each piece counts once — a repeat is refused,
     * written to the order's log and reported to the admins.
     */
    async scan(v: Viewer, rawCode: string, method: 'scan' | 'manual' = 'scan') {
        const code = String(rawCode || '').trim().toUpperCase();
        if (!code) throw new AppError(400, 'Scan a barcode');
        const unitMatch = /^([A-Z]\d+)-(\d+)$/.exec(code);
        const challanNo = unitMatch ? unitMatch[1] : code;

        const order: any = await Order.findOne({ 'jobs.challanNo': challanNo });
        if (!order) throw new AppError(404, `No challan with the code ${code}`);
        const job = order.jobs.find((j: any) => j.challanNo === challanNo);
        if (v.role === 'factory' && !mayFactorySee(v, job.division)) throw new AppError(403, `${challanNo} is not one of your divisions`);

        const refuse = async (message: string) => {
            order.timeline.push({ status: 'scan_alert', note: `${code}: ${message}`, by: actorOf(v), createdAt: new Date() });
            await order.save();
            alertAdmins('Repeat scan', `${v.name || v.role} scanned ${code} again on ${order.orderId}: ${message}`, String(order._id));
            throw new AppError(409, message);
        };

        if (job.issuedAt) await refuse(`Challan ${challanNo} was already issued (${when(job.issuedAt)}, ${job.issuedBy?.name || ''})`);
        if (!['confirmed', 'factory'].includes(order.status)) throw new AppError(400, `Order ${order.orderId} is ${label(order.status)} — nothing to scan`);

        let unit: any;
        if (unitMatch) {
            unit = job.units.find((u: any) => u.code === code);
            if (!unit) throw new AppError(404, `No piece ${code} on challan ${challanNo}`);
            if (unit.scannedAt) await refuse(`Piece ${code} was already scanned (${when(unit.scannedAt)}, ${unit.scannedBy?.name || ''})`);
        } else {
            unit = job.units.find((u: any) => !u.scannedAt);
            if (!unit) await refuse(`Every piece on challan ${challanNo} is already scanned`);
        }

        unit.scannedAt = new Date();
        unit.scannedBy = actorOf(v);
        unit.method = method === 'manual' ? 'manual' : 'scan';

        if (order.status === 'confirmed') {
            order.status = 'factory';
            order.timeline.push({ status: 'factory', note: `Factory started — challan ${challanNo}`, by: actorOf(v), createdAt: new Date() });
        }
        await order.save();

        const presented = presentJob(job, order.items);
        const item = order.items[unit.itemIndex];
        return {
            code: unit.code,
            itemName: item?.name || '',
            orderId: order.orderId,
            orderObjectId: order._id,
            remaining: presented.unitsTotal - presented.unitsScanned,
            job: presented,
        };
    },

    /** Issue a challan's original — once. Every piece must be scanned first (an admin may override). */
    async issueChallan(v: Viewer, orderId: string, jobId: string) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        const job = order.jobs.id(jobId);
        if (!job) throw new AppError(404, 'Challan not found');
        if (v.role === 'factory' && !mayFactorySee(v, job.division)) throw new AppError(403, 'Not one of your divisions');
        if (job.issuedAt) {
            throw new AppError(409, `Challan ${job.challanNo} was already issued on ${when(job.issuedAt)} by ${job.issuedBy?.name || 'someone'}. Ask an admin for a duplicate.`);
        }
        if (!['confirmed', 'factory'].includes(order.status)) throw new AppError(400, `Order is ${label(order.status)}`);

        const waiting = job.units.filter((u: any) => !u.scannedAt).length;
        if (waiting && !isTop(v)) throw new AppError(400, `${waiting} piece${waiting === 1 ? '' : 's'} on ${job.challanNo} not scanned yet`);

        job.issuedAt = new Date();
        job.issuedBy = actorOf(v);
        if (order.status === 'confirmed') order.status = 'factory';
        order.timeline.push({
            status: 'challan_issued',
            note: `Challan ${job.challanNo} issued${waiting ? ` without scanning ${waiting} piece(s)` : ''}`,
            by: actorOf(v), createdAt: new Date(),
        });
        let ready = false;
        if (order.jobs.every((j: any) => j.issuedAt)) {
            order.status = 'challan_ready';
            order.timeline.push({ status: 'challan_ready', note: 'Every challan issued', by: actorOf(v), createdAt: new Date() });
            ready = true;
        }
        await order.save();
        return { order, ready };
    },

    /** A duplicate of an issued challan — admin only, with a reason, marked DUPLICATE on paper. */
    async reprintChallan(v: Viewer, orderId: string, jobId: string, reason: string) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        const job = order.jobs.id(jobId);
        if (!job) throw new AppError(404, 'Challan not found');
        if (!job.issuedAt) throw new AppError(400, 'This challan has not been issued yet — issue the original first');
        job.reprints.push({ at: new Date(), by: actorOf(v), reason });
        order.timeline.push({ status: 'challan_reprint', note: `Duplicate of ${job.challanNo}: ${reason}`, by: actorOf(v), createdAt: new Date() });
        await order.save();
        return order;
    },

    /** Issue the customer's memo — once. */
    async issueMemo(v: Viewer, orderId: string) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        if (['pending', 'cancelled'].includes(order.status)) throw new AppError(400, `Order is ${label(order.status)} — confirm it first`);
        if (order.memo?.issuedAt) {
            throw new AppError(409, `The memo was already issued on ${when(order.memo.issuedAt)} by ${order.memo.issuedBy?.name || 'someone'}. Ask an admin for a duplicate.`);
        }
        order.memo = { ...(order.memo?.toObject?.() || {}), issuedAt: new Date(), issuedBy: actorOf(v), reprints: order.memo?.reprints || [] };
        order.timeline.push({ status: 'memo_issued', note: 'Memo issued', by: actorOf(v), createdAt: new Date() });
        await order.save();
        return order;
    },

    async reprintMemo(v: Viewer, orderId: string, reason: string) {
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        if (!order.memo?.issuedAt) throw new AppError(400, 'The memo has not been issued yet');
        order.memo.reprints.push({ at: new Date(), by: actorOf(v), reason });
        order.timeline.push({ status: 'memo_reprint', note: `Duplicate memo: ${reason}`, by: actorOf(v), createdAt: new Date() });
        await order.save();
        return order;
    },

    /** One-click SMS to the customer. Recorded on the order whatever the gateway says. */
    async sendSms(v: Viewer, orderId: string, kind?: string) {
        await assertVisible(orderId, v);
        const order: any = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');
        const k = kind === 'cancelled' || order.status === 'cancelled' ? 'cancelled' : 'confirmed';
        if (k === 'confirmed' && order.status === 'pending') throw new AppError(400, 'Confirm the order before sending the SMS');

        const a = order.shippingAddress || {};
        const name = String(a.fullName || '').split(/\s+/)[0] || 'গ্রাহক';
        const { name: brand, phone } = config.business;
        const message = k === 'cancelled'
            ? `প্রিয় ${name}, আপনার ${brand} অর্ডার #${order.orderId} বাতিল করা হয়েছে। কোনো প্রশ্ন থাকলে কল করুন: ${phone}`
            : `প্রিয় ${name}, আপনার ${brand} অর্ডার #${order.orderId} কনফার্ম হয়েছে। মোট ৳${Math.round(order.total || 0)}। শীঘ্রই ডেলিভারি দেওয়া হবে। প্রয়োজনে কল করুন: ${phone}`;

        const res = await sendSms(a.phone, message);
        const entry = {
            kind: k, to: intlPhone(a.phone), message, status: res.status,
            providerRef: res.ref || '', error: res.error || '', by: actorOf(v), at: new Date(),
        };
        order.sms.push(entry);
        order.timeline.push({
            status: 'sms',
            note: res.status === 'sent' ? `SMS sent (${k})` : res.status === 'not_configured' ? `SMS not sent — gateway not set up` : `SMS failed: ${res.error || ''}`,
            by: actorOf(v), createdAt: new Date(),
        });
        await order.save();
        return { order, sms: entry };
    },

    /** Every SMS the desk has sent, newest first. Agency staff see their own. */
    async smsLog(v: Viewer, query: Record<string, unknown>) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 25));
        const match: Record<string, any> = { 'sms.0': { $exists: true } };
        const after: Record<string, any> = {};
        if (v.role === 'agency') after['sms.by.id'] = new (require('mongoose').Types.ObjectId)(v.userId);
        if (query.status) after['sms.status'] = String(query.status);

        const base: any[] = [{ $match: match }, { $unwind: '$sms' }, { $match: after }];
        const [rows, count] = await Promise.all([
            Order.aggregate([
                ...base,
                { $sort: { 'sms.at': -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                { $project: { orderObjectId: '$_id', orderId: 1, status: 1, customer: '$shippingAddress.fullName', sms: 1, _id: 0 } },
            ]),
            Order.aggregate([...base, { $count: 'n' }]),
        ]);
        const total = count[0]?.n || 0;
        return { rows, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    },
};
