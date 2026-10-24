import { Types } from 'mongoose';
import { Order } from '../order/order.model';
import { placeMatch } from '../order/order.service';
import { dhakaDayStart, actorOf, type Viewer } from '../order/order.desk';
import AppError from '../../utils/AppError';
import config from '../../config';
import SteadfastService from './steadfast.service';
import { CourierPayout } from './payout.model';

/**
 * Courier money: what went out with the couriers, what they collected, what they charged,
 * what they paid and what they still owe. One order is one parcel. Super admin and admin.
 */

const DAY = 864e5;
const PARCEL_FIELDS = 'orderId status total shippingCost paymentMethod paymentStatus carrier consignmentId trackingNumber courierStatus courierFee courierReturnFee courierCod courierBookedAt courierPayout courierPaidAt shippingAddress.fullName shippingAddress.phone shippingAddress.city';

type Q = Record<string, unknown>;
type Parcel = any;

/** "2026-10-24" in Dhaka → that day's start. */
const dhakaDate = (ymd: string) => new Date(`${ymd}T00:00:00+06:00`);

const carrierRx = (c: unknown) => (c === 'pathao' ? /pathao/i : c === 'steadfast' ? /steadfast/i : null);

/** Booked parcels matching the page's filters. */
function parcelFilter(q: Q, withDates: boolean) {
    const and: Record<string, any>[] = [{ consignmentId: { $nin: ['', null] } }];
    const rx = carrierRx(q.carrier);
    if (rx) and.push({ carrier: rx });
    if (q.pay === 'cod') and.push({ paymentMethod: 'cod' });
    if (q.pay === 'prepaid') and.push({ paymentMethod: { $ne: 'cod' } });
    const place = placeMatch(q.places);
    if (place) and.push(place);
    if (q.search) {
        const s = new RegExp(String(q.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        and.push({ $or: [{ orderId: s }, { 'shippingAddress.fullName': s }, { 'shippingAddress.phone': s }, { consignmentId: s }, { trackingNumber: s }] });
    }
    if (withDates) {
        const when: Record<string, Date> = {};
        if (q.from) when.$gte = dhakaDate(String(q.from));
        if (q.to) when.$lt = new Date(dhakaDate(String(q.to)).getTime() + DAY);
        if (Object.keys(when).length) and.push({ courierBookedAt: when });
    }
    return { $and: and };
}

/** Cash the courier was asked to collect (older parcels: worked out from the order). */
const codOf = (o: Parcel) => (typeof o.courierCod === 'number' ? o.courierCod : o.paymentStatus === 'paid' ? 0 : Math.round(o.total || 0));

/** Where a booked parcel ended up. */
function outcome(o: Parcel): 'delivered' | 'partial' | 'returned' | 'progress' {
    const cs = String(o.courierStatus || '').toLowerCase();
    if (/partial/.test(cs)) return 'partial';
    if (o.status === 'delivered') return 'delivered';
    if (['returned', 'refunded', 'cancelled'].includes(o.status) || /cancel|return/.test(cs)) return 'returned';
    return 'progress';
}
const inReview = (o: Parcel) => outcome(o) === 'progress' && /^(|pending|in_review|pickup.*|.*approval_pending|order.?created|assigned.?for.?pickup)$/i.test(o.courierStatus || '');
const settled = (o: Parcel) => !!o.courierPayout;
const delivered = (o: Parcel) => ['delivered', 'partial'].includes(outcome(o));

const sum = (list: Parcel[], f: (o: Parcel) => number) => list.reduce((a, o) => a + (f(o) || 0), 0);

const parcelRow = (o: Parcel) => ({
    orderId: String(o._id), orderNo: o.orderId, customer: o.shippingAddress?.fullName || '', phone: o.shippingAddress?.phone || '',
    consignmentId: o.consignmentId, trackingNumber: o.trackingNumber, carrier: o.carrier, bookedAt: o.courierBookedAt,
    cod: codOf(o), status: o.status, courierStatus: o.courierStatus || '', outcome: outcome(o), paid: settled(o),
});

const setup = () => ({
    steadfast: !!(config.steadfast.api_key && config.steadfast.secret_key),
    pathao: !!(config.pathao.client_id && config.pathao.client_secret && config.pathao.username && config.pathao.password && config.pathao.store_id),
});

const PayoutService = {
    /** Everything on the Payouts & accounts page. */
    async overview(q: Q) {
        const today = dhakaDayStart();
        const since30 = new Date(today.getTime() - 29 * DAY);
        const rx = carrierRx(q.carrier);
        const carrierOnly = rx ? { consignmentId: { $nin: ['', null] }, carrier: rx } : { consignmentId: { $nin: ['', null] } };

        const [all, period, payouts, periodPayouts] = await Promise.all([
            Order.find(carrierOnly).select(PARCEL_FIELDS).lean(),
            Order.find(parcelFilter(q, true)).select(PARCEL_FIELDS).lean(),
            CourierPayout.find(rx ? { carrier: q.carrier } : {}).sort({ paidAt: -1 }).lean(),
            CourierPayout.find({
                ...(rx ? { carrier: q.carrier } : {}),
                ...((q.from || q.to) ? {
                    paidAt: {
                        ...(q.from ? { $gte: dhakaDate(String(q.from)) } : {}),
                        ...(q.to ? { $lt: new Date(dhakaDate(String(q.to)).getTime() + DAY) } : {}),
                    },
                } : {}),
            }).lean(),
        ]);

        // ── Right now ──
        const unpaidDelivered = all.filter((o) => delivered(o) && !settled(o));
        const owedOf = (list: Parcel[]) => sum(list, (o) => codOf(o) - (o.courierFee || 0));
        const rightNow = {
            inReview: all.filter(inReview).length,
            processing: all.filter((o) => outcome(o) === 'progress' && !inReview(o)).length,
            codProcessing: { n: unpaidDelivered.length, value: sum(unpaidDelivered, codOf) },
            returns30: all.filter((o) => outcome(o) === 'returned' && o.courierBookedAt >= since30).length,
        };

        // ── Last 30 days ──
        const last30 = all.filter((o) => o.courierBookedAt >= since30);
        const finished30 = last30.filter((o) => outcome(o) !== 'progress');
        const delivered30 = finished30.filter(delivered).length;
        const daily = Array.from({ length: 30 }, (_, i) => {
            const start = new Date(since30.getTime() + i * DAY);
            const end = new Date(start.getTime() + DAY);
            const day = last30.filter((o) => o.courierBookedAt >= start && o.courierBookedAt < end);
            return {
                date: new Date(start.getTime() + 6 * 3600e3).toISOString().slice(0, 10),
                delivered: day.filter((o) => outcome(o) === 'delivered').length,
                progress: day.filter((o) => outcome(o) === 'progress').length,
                partial: day.filter((o) => outcome(o) === 'partial').length,
                returned: day.filter((o) => outcome(o) === 'returned').length,
            };
        });
        const ended = {
            total: last30.length,
            delivered: last30.filter((o) => outcome(o) === 'delivered').length,
            progress: last30.filter((o) => outcome(o) === 'progress').length,
            partial: last30.filter((o) => outcome(o) === 'partial').length,
            returned: last30.filter((o) => outcome(o) === 'returned').length,
        };
        const yesterday = new Date(today.getTime() - DAY);

        // ── Accounts for the chosen dates and filters ──
        const pDelivered = period.filter(delivered);
        const pReturned = period.filter((o) => outcome(o) === 'returned');
        const pProgress = period.filter((o) => outcome(o) === 'progress');
        const pUnpaid = pDelivered.filter((o) => !settled(o));
        const courierCharges = sum(period, (o) => o.courierFee);
        const returnCharges = sum(period, (o) => o.courierReturnFee);
        const buyersPaid = sum(period, (o) => o.shippingCost);

        return {
            setup: setup(),
            rightNow,
            last30: {
                bookedToday: all.filter((o) => o.courierBookedAt >= today).length,
                bookedYesterday: all.filter((o) => o.courierBookedAt >= yesterday && o.courierBookedAt < today).length,
                booked: last30.length,
                success: { pct: finished30.length ? Math.round((delivered30 / finished30.length) * 1000) / 10 : 0, delivered: delivered30, finished: finished30.length },
                notPaid: { n: unpaidDelivered.length, value: sum(unpaidDelivered, codOf), afterCharges: owedOf(unpaidDelivered) },
            },
            daily,
            ended,
            latest: [...all].sort((a, b) => +new Date(b.courierBookedAt || 0) - +new Date(a.courierBookedAt || 0)).slice(0, 8).map(parcelRow),
            lastPayout: payouts[0] || null,
            paidAllTime: { value: sum(payouts, (p) => p.amount), n: payouts.length },
            stillToCome: { value: owedOf(unpaidDelivered), n: unpaidDelivered.length },
            accounts: {
                owes: owedOf(pUnpaid),
                chargesUnknown: period.filter((o) => !o.courierFee && !settled(o)).length,
                paid: { value: sum(periodPayouts, (p) => p.amount), n: periodPayouts.length },
                sent: { n: period.length, delivered: pDelivered.length - period.filter((o) => outcome(o) === 'partial').length, partial: period.filter((o) => outcome(o) === 'partial').length, returned: pReturned.length, onTheWay: pProgress.length },
                codAsked: sum(period, codOf),
                codCollected: sum(pDelivered, codOf),
                stillWithCourier: sum(pProgress, codOf),
                courierCharges: { value: courierCharges, unknown: period.filter((o) => !o.courierFee).length },
                returnCharges: { value: returnCharges, returned: pReturned.length },
                buyersPaid,
                deliveryDiff: buyersPaid - courierCharges - returnCharges,
            },
        };
    },

    /** The payouts list, newest first. */
    async list(q: Q) {
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
        const filter: Record<string, any> = {};
        if (q.carrier === 'pathao' || q.carrier === 'steadfast') filter.carrier = q.carrier;
        if (q.from || q.to) {
            filter.paidAt = {
                ...(q.from ? { $gte: dhakaDate(String(q.from)) } : {}),
                ...(q.to ? { $lt: new Date(dhakaDate(String(q.to)).getTime() + DAY) } : {}),
            };
        }
        const [rows, total] = await Promise.all([
            CourierPayout.find(filter).sort({ paidAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            CourierPayout.countDocuments(filter),
        ]);
        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    },

    /**
     * A payout written in by hand (Pathao, or anything the API missed). `parcels` lists the
     * consignment ids or order numbers it settled; each is marked paid.
     */
    async addManual(v: Viewer, body: Q) {
        const carrier = body.carrier === 'steadfast' ? 'steadfast' : body.carrier === 'pathao' ? 'pathao' : null;
        if (!carrier) throw new AppError(400, 'Choose the courier: Pathao or Steadfast');
        const amount = Number(body.amount);
        if (!(amount > 0)) throw new AppError(400, 'Write the amount the courier paid');
        const paidAt = body.paidAt ? dhakaDate(String(body.paidAt).slice(0, 10)) : new Date();
        if (Number.isNaN(paidAt.getTime())) throw new AppError(400, 'The payout date is not valid');

        const codes = String(body.parcels || '').split(/[\s,]+/).map((x) => x.trim()).filter(Boolean).slice(0, 500);
        const orders: any[] = codes.length
            ? await Order.find({ carrier: carrierRx(carrier)!, $or: [{ consignmentId: { $in: codes } }, { trackingNumber: { $in: codes } }, { orderId: { $in: codes } }] })
            : [];
        const already = orders.filter((o) => o.courierPayout);
        if (already.length) throw new AppError(400, `Already settled by another payout: ${already.map((o) => o.orderId).join(', ')}`);
        const missing = codes.filter((c) => !orders.some((o) => [o.consignmentId, o.trackingNumber, o.orderId].includes(c)));
        if (missing.length) throw new AppError(400, `No ${carrier === 'pathao' ? 'Pathao' : 'Steadfast'} parcel with: ${missing.slice(0, 10).join(', ')}`);

        const payout = await CourierPayout.create({
            carrier, source: 'manual', reference: String(body.reference || '').trim(), paidAt, amount,
            codTotal: sum(orders, codOf), chargeTotal: Math.max(0, sum(orders, codOf) - amount),
            parcels: orders.map((o) => ({ order: o._id, orderNo: o.orderId, consignmentId: o.consignmentId, cod: codOf(o), charge: o.courierFee || 0, status: o.status })),
            note: String(body.note || '').trim(), createdBy: actorOf(v),
        });
        await Order.updateMany({ _id: { $in: orders.map((o) => o._id) } }, { $set: { courierPayout: payout._id, courierPaidAt: paidAt } });
        return payout;
    },

    /** Remove a payout; its parcels count as unpaid again. */
    async remove(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new AppError(404, 'Payout not found');
        const payout = await CourierPayout.findById(id);
        if (!payout) throw new AppError(404, 'Payout not found');
        await Order.updateMany({ courierPayout: payout._id }, { $unset: { courierPayout: 1, courierPaidAt: 1 } });
        await payout.deleteOne();
        return { removed: true };
    },

    /** Pull new payouts from Steadfast, with each parcel's charge. */
    async syncSteadfast(v: Viewer) {
        if (!setup().steadfast) throw new AppError(503, 'Steadfast is not connected — add its API key and secret key to the server first');
        const list = await SteadfastService.getPayments();
        let added = 0;
        let parcels = 0;
        for (const p of list.slice(0, 50)) {
            const ref = String(p.id ?? p.payment_id ?? '');
            if (!ref || await CourierPayout.exists({ carrier: 'steadfast', reference: ref })) continue;
            const { consignments } = await SteadfastService.getPayment(ref);
            const cids = consignments.map((c: any) => String(c.consignment_id ?? c.cid ?? c.id ?? '')).filter(Boolean);
            const orders: any[] = cids.length ? await Order.find({ consignmentId: { $in: cids } }) : [];
            const rows = consignments.map((c: any) => {
                const cid = String(c.consignment_id ?? c.cid ?? c.id ?? '');
                const o = orders.find((x) => x.consignmentId === cid);
                const status = String(c.delivery_status ?? c.status ?? '');
                const charge = Number(c.delivery_charge ?? c.delivery_fee ?? c.charge ?? 0) || 0;
                const returnCharge = /return|cancel/i.test(status) ? Number(c.return_charge ?? charge) || 0 : Number(c.return_charge ?? 0) || 0;
                return { o, row: { order: o?._id, orderNo: o?.orderId || String(c.invoice || ''), consignmentId: cid, cod: Number(c.cod_amount ?? c.collected_amount ?? 0) || 0, charge, returnCharge, status } };
            });
            const paidAt = new Date(p.created_at || p.date || p.payment_date || Date.now());
            const amount = Number(p.amount ?? p.total_amount ?? p.paid_amount ?? p.net_amount ?? 0) || 0;
            const payout = await CourierPayout.create({
                carrier: 'steadfast', source: 'api', reference: ref, paidAt: Number.isNaN(paidAt.getTime()) ? new Date() : paidAt, amount,
                codTotal: sum(rows, (r) => r.row.cod), chargeTotal: sum(rows, (r) => r.row.charge + r.row.returnCharge),
                parcels: rows.map((r) => r.row), createdBy: actorOf(v),
            });
            for (const { o, row } of rows) {
                if (!o) continue;
                o.courierFee = row.charge;
                o.courierReturnFee = row.returnCharge;
                o.courierPayout = payout._id;
                o.courierPaidAt = payout.paidAt;
                await o.save();
                parcels += 1;
            }
            added += 1;
        }
        return { added, parcels, checked: list.length };
    },
};

export default PayoutService;
