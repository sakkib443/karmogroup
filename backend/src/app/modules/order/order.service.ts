import { Types } from 'mongoose';
import { Order, ORDER_STATUSES, ORDER_STATUS_LABEL } from './order.model';
import CourierService from '../courier/courier.service';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { Coupon } from '../coupon/coupon.model';
import { getEligibleAmount, computeCouponDiscount } from '../coupon/coupon.service';
import AppError from '../../utils/AppError';
import QueryBuilder from '../../utils/QueryBuilder';
import { notifyOrderToWhatsApp } from '../../utils/whatsappNotify';
import { emitFinanceUpdate } from '../../utils/socket';
import { computeShippingCost } from '../shipping/shipping.service';
import { type Viewer, actorOf, scopeFor, present, assertVisible, assertTransition, ensureJobs, dhakaDayStart } from './order.desk';
import { divisionOf } from '../../constants/roles';
import { type CatalogueQuote, quoteCatalogueLines } from './order.quote';

/**
 * Tell the customer their payment status changed. Shared by the admin's manual
 * "mark as paid" and by the payment-gateway callback, so money moving through
 * either path notifies identically. Fire-and-forget — a notification failure
 * must never break a payment.
 */
export const notifyOrderPayment = (order: any, paymentStatus: string): void => {
    const COPY: Record<string, { title: string; message: (ref: string, total: number) => string }> = {
        paid: {
            title: 'Payment received',
            message: (ref, total) => `We have received your ৳${total} payment for order ${ref}. Thank you!`,
        },
        failed: {
            title: 'Payment failed',
            message: (ref) => `Your payment for order ${ref} did not go through. You can retry it from My Orders.`,
        },
        refunded: {
            title: 'Payment refunded',
            message: (ref, total) => `৳${total} for order ${ref} has been refunded.`,
        },
    };
    const copy = COPY[paymentStatus];
    if (!copy || !order?.user) return;

    try {
        const { NotificationService } = require('../notification/notification.service');
        const orderIdStr = order._id.toString();
        NotificationService.notify({
            user: order.user,
            type: 'payment_' + paymentStatus,
            title: copy.title,
            message: copy.message(order.orderId || orderIdStr, order.total || 0),
            link: '/dashboard/user/orders/' + orderIdStr,
            meta: { orderId: orderIdStr, paymentStatus, total: order.total },
        }).catch(() => {});
    } catch {
        // never block the payment flow on a notification failure
    }
};

/** Tell the customer their order moved. Fire-and-forget — never blocks the status change. */
const notifyOrderStatus = (order: any, status: string): void => {
    try {
        const { NotificationService } = require('../notification/notification.service');
        const orderIdStr = order._id.toString();
        NotificationService.notify({
            user: order.user.toString(),
            type: 'order_status',
            title: 'Order status updated',
            message: `Your order ${order.orderId || orderIdStr} is now "${ORDER_STATUS_LABEL[status] || status}".`,
            link: '/dashboard/user/orders/' + orderIdStr,
            meta: { orderId: orderIdStr, status },
        }).catch(() => {});
    } catch {
        // never block status update
    }
};

/** A Mongo _id. Slugs are never 24 hex characters, so this tells the two kinds of line apart. */
const isProductId = (v: unknown) => /^[a-f0-9]{24}$/i.test(String(v || ''));

/* Dashboard groups. The older courier steps (processing, on_the_way…) still sit on some orders. */
const DAY_MS = 24 * 3600e3;
const NOT_SOLD = ['cancelled', 'returned', 'refunded'];
const IN_PROCESS = ['confirmed', 'factory', 'challan_ready', 'courier_entry', 'processing'];
const ON_THE_WAY = ['shipped', 'on_the_way', 'out_for_delivery', 'delivery_attempt'];

/**
 * Every day (or month) of the range, zero when nothing was ordered — so the chart's
 * line runs through the quiet days instead of skipping them. For "all time" the months
 * start at the first order.
 */
const fillTrend = (rows: { _id: string; orders: number; revenue: number }[], by: 'day' | 'month', days: number) => {
    const have = new Map(rows.map((x) => [x._id, x]));
    const today = new Date(dhakaDayStart().getTime() + 6 * 3600e3); // Dhaka midnight, read as UTC
    const keys: string[] = [];
    if (by === 'day') {
        for (let i = days - 1; i >= 0; i--) keys.push(new Date(today.getTime() - i * DAY_MS).toISOString().slice(0, 10));
    } else {
        const first = days ? new Date(today.getTime() - (days - 1) * DAY_MS) : rows.length ? new Date(`${rows[0]._id}-01T00:00:00Z`) : today;
        const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1));
        while (d <= today) { keys.push(d.toISOString().slice(0, 7)); d.setUTCMonth(d.getUTCMonth() + 1); }
    }
    return keys.map((k) => ({ date: k, orders: have.get(k)?.orders || 0, revenue: have.get(k)?.revenue || 0 }));
};

/**
 * Division / district / delivery-zone filters: the admin sends every way the place is
 * written, '|'-separated; any one of them as a whole word in the city, area or address is
 * a match. The word edge is built from real Bangla characters (not escapes) so MongoDB's
 * regex engine reads it. Used by the order list and by Order insights.
 */
export const placeMatch = (list: unknown) => {
    const terms = String(list || '').split('|').map((t) => t.trim()).filter(Boolean).slice(0, 400);
    if (!terms.length) return null;
    const escapeRx = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const EDGE = `[^a-z${'ঀ'}-${'৿'}]`;
    const alts = terms.map((t) => escapeRx(t).replace(/\s+/g, '\\s*')).join('|');
    const rx = new RegExp(`(?:^|${EDGE})(?:${alts})(?:$|${EDGE})`, 'i');
    return { $or: [{ 'shippingAddress.city': rx }, { 'shippingAddress.area': rx }, { 'shippingAddress.address': rx }] };
};

/** Old lines spell a division several ways ("Mattress", "pillow", blank): add them up under one key. */
const mergeDivisions = (rows: { _id: string; orders: number; pieces: number; value: number }[]) => {
    const by = new Map<string, { division: string; orders: number; pieces: number; value: number }>();
    for (const x of rows) {
        const k = divisionOf(x._id);
        const cur = by.get(k) || { division: k, orders: 0, pieces: 0, value: 0 };
        cur.orders += x.orders; cur.pieces += x.pieces; cur.value += x.value;
        by.set(k, cur);
    }
    return [...by.values()].sort((a, b) => b.value - a.value);
};

/** "Fiber Pillow" → "fiber_pillow" — the key the factory challans are grouped by. */
const divisionKey = (v: unknown) => String(v || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

/**
 * A line for Karmo's own catalogue. Mattresses and foam are priced by size on the product
 * page and are not in the products collection, so the line arrives by slug with its size.
 * The price is the website's own quote for that size (order.quote.ts), never the one in
 * the request: a line whose price differs from it by more than ৳1 is refused, so a
 * tampered checkout cannot buy a King Mattress for ৳1.
 */
function catalogueLine(item: any, quote: CatalogueQuote | undefined) {
    const label = String(item.name || item.product || 'this item').trim();
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) throw new AppError(400, `Invalid quantity for: ${label}`);
    if (!quote?.name) throw new AppError(400, `${label} isn't sold online. Please call us to order it.`);
    if (!quote.ok || !(quote.unit > 0)) {
        throw new AppError(400, `${quote.name} can't be ordered online at this size. Please call us to order it.`);
    }
    const price = Math.round(quote.unit);
    const sent = Number(item.price);
    if (item.price != null && !(Math.abs(sent - price) <= 1)) {
        throw new AppError(400, `The price of ${quote.name || label} has changed. Please open the product again and add it to your cart afresh.`);
    }
    return {
        slug: String(item.product),
        division: divisionKey(quote.division || item.division),
        name: quote.name || label,
        thumbnail: item.image || '',
        price,
        cost: 0,
        quantity,
        total: price * quantity,
        color: item.color || '',
        size: item.size || '',
    };
}

const OrderService = {
    async getAllOrders(query: Record<string, unknown>, viewer: Viewer) {
        // The order desk's own filters are pulled out here; everything else (status,
        // paymentStatus, paymentMethod, items.product…) goes to QueryBuilder.filter() as is.
        const { search, searchTerm, dateFrom, dateTo, minTotal, maxTotal, courier, division, places, zonePlaces, ...rest } = query;
        const where: Record<string, any> = {};
        const and: Record<string, any>[] = [];
        const escapeRx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // One box for order no, customer name, phone and courier consignment.
        const term = String(searchTerm || search || '').trim();
        if (term) {
            const rx = new RegExp(escapeRx(term), 'i');
            and.push({ $or: [
                { orderId: rx },
                { 'shippingAddress.fullName': rx },
                { 'shippingAddress.phone': rx },
                { consignmentId: rx },
                { trackingNumber: rx },
            ] });
        }

        // Division / district (`places`) and delivery zone (`zonePlaces`) — see placeMatch.
        for (const list of [places, zonePlaces]) {
            const m = placeMatch(list);
            if (m) and.push(m);
        }
        // What this viewer may see at all (agency: pending; factory: its divisions…).
        const scope = scopeFor(viewer);
        if (Object.keys(scope).length) and.push(scope);
        if (and.length) where.$and = and;

        // Placed between two moments — the browser sends the start / end of its local days.
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.$gte = new Date(String(dateFrom));
            if (dateTo) where.createdAt.$lte = new Date(String(dateTo));
        }

        if (minTotal || maxTotal) {
            where.total = {};
            if (minTotal) where.total.$gte = Number(minTotal);
            if (maxTotal) where.total.$lte = Number(maxTotal);
        }

        if (courier === 'booked') where.consignmentId = { $nin: ['', null] };
        else if (courier === 'unbooked') where.consignmentId = { $in: ['', null] };

        // Older pillow lines were filed as plain "pillow".
        if (division) {
            const d = divisionKey(division);
            where['items.division'] = { $in: d === 'fiber_pillow' ? ['fiber_pillow', 'pillow'] : [d] };
        }

        const orderQuery = new QueryBuilder(
            Order.find(where).populate('user', 'firstName lastName email phone').populate('items.product', 'name thumbnail'),
            rest
        )
            .filter()              // status tabs (?status=shipped, etc.)
            .sort()
            .paginate();

        const orders = (await orderQuery.modelQuery).map((o: any) => present(o, viewer));
        const meta = await orderQuery.countTotal();
        return { orders, meta };
    },

    /** One order for the admin panel, as this staff member may see it. */
    async getOrderForStaff(id: string, viewer: Viewer) {
        await assertVisible(id, viewer);
        const order: any = await Order.findById(id)
            .populate('user', 'firstName lastName email phone')
            .populate('items.product', 'name thumbnail slug price');
        if (!order) throw new AppError(404, 'Order not found');
        if (!order.jobs?.length && !['pending', 'cancelled'].includes(order.status) && await ensureJobs(order)) await order.save();
        return present(order, viewer);
    },

    async getMyOrders(userId: string, query: Record<string, unknown>) {
        // The client sends `search` for order-number lookups, but QueryBuilder.search()
        // reads `searchTerm` — normalise so the "Search by order number" box works.
        const normalizedQuery = { ...query };
        if (normalizedQuery.search && !normalizedQuery.searchTerm) {
            normalizedQuery.searchTerm = normalizedQuery.search;
        }

        const orderQuery = new QueryBuilder(
            Order.find({ user: userId }).populate('items.product', 'name thumbnail slug'),
            normalizedQuery
        )
            .search(['orderId'])   // enable "My Orders" search by human order id (ABM-XXXX)
            .filter()              // enable the status tabs (?status=shipped, etc.)
            .sort()
            .paginate();

        const orders = await orderQuery.modelQuery;
        const meta = await orderQuery.countTotal();
        return { orders, meta };
    },

    async getOrderById(id: string, userId?: string) {
        const filter: any = { _id: id };
        if (userId) filter.user = userId; // non-admin can only see their own

        const order = await Order.findOne(filter)
            .populate('user', 'firstName lastName email phone')
            .populate('items.product', 'name thumbnail slug price');
        if (!order) throw new AppError(404, 'Order not found');
        return order;
    },

    async createOrder(userId: string, payload: any) {
        const { items, shippingAddress, paymentMethod, paymentDetails, couponCode, couponCodes, note } = payload;

        // Guard: an order must contain at least one item (defense-in-depth —
        // the guest-checkout route also validates, but any caller is protected here).
        if (!Array.isArray(items) || items.length === 0) {
            throw new AppError(400, 'Your order must contain at least one item');
        }

        // Get product details and calculate totals
        let subtotal = 0;
        const orderItems: any[] = [];
        const stagedItems: any[] = [];

        // Resolve the price a customer actually pays RIGHT NOW, honouring the offer
        // validity window. `price` is the offer price; outside the window the regular
        // (original) price applies. Server-authoritative — never trust a client price.
        const resolveEffectivePrice = (product: any): number => {
            const now = new Date();
            const start = product.offerStartDate ? new Date(product.offerStartDate) : null;
            const end = product.offerEndDate ? new Date(product.offerEndDate) : null;
            const afterStart = !start || isNaN(start.getTime()) || now.getTime() >= start.getTime();
            const beforeEnd = !end || isNaN(end.getTime()) || now.getTime() <= end.getTime();
            const offerActive = afterStart && beforeEnd;
            if (offerActive) return product.price;
            return product.originalPrice && product.originalPrice > 0 ? product.originalPrice : product.price;
        };

        // Every catalogue line is priced in one round trip to the website.
        const catalogueItems = items.filter((item: any) => !isProductId(item.product));
        const quotes = await quoteCatalogueLines(catalogueItems.map((item: any) => ({
            slug: String(item.product),
            division: item.division,
            dims: item.dims,
            size: item.size,
        })));

        for (const item of items) {
            if (!isProductId(item.product)) {
                const line = catalogueLine(item, quotes[catalogueItems.indexOf(item)]);
                subtotal += line.total;
                orderItems.push(line);
                stagedItems.push({ product: null });
                continue;
            }

            const product = await Product.findOne({ _id: item.product, isDeleted: false, status: 'active' });
            if (!product) throw new AppError(404, `Product not found: ${item.product}`);
            if (product.stock < item.quantity) throw new AppError(400, `Insufficient stock for: ${product.name}`);

            const unitPrice = resolveEffectivePrice(product);
            const itemTotal = unitPrice * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                thumbnail: product.thumbnail,
                price: unitPrice,
                cost: product.costPrice || 0,   // snapshot buying price for COGS/profit
                quantity: item.quantity,
                total: itemTotal,
                color: item.color || '',
                size: item.size || '',
                division: divisionKey(item.division),
            });
            stagedItems.push({ product });
        }

        // ── Apply coupons (percentage / fixed / free_shipping) — supports stacking ──
        // Accepts either couponCodes[] (multiple, stacked) or a single couponCode
        // (legacy). Each coupon is independently validated (active, not expired,
        // usage limit, min-order, scope) and its discount summed; at most one
        // free-shipping coupon takes effect; the total is capped at the subtotal.
        let discount = 0;
        let couponFreeShipping = false;
        const appliedCoupons: any[] = [];
        const appliedCodes: string[] = [];

        const rawCodes: string[] = Array.isArray(couponCodes) && couponCodes.length
            ? couponCodes
            : (couponCode ? [couponCode] : []);
        const codes = Array.from(
            new Set(rawCodes.map((c: string) => String(c || '').toUpperCase().trim()).filter(Boolean)),
        ).slice(0, 5); // hard cap: never stack more than 5 on one order

        if (codes.length > 0) {
            // Scope-aware line items (built once, reused for every coupon).
            const couponLineItems = orderItems.map((oi: any, idx: number) => ({
                productId: String(oi.product),
                categoryId: stagedItems[idx]?.product?.category ? String(stagedItems[idx].product.category) : null,
                lineTotal: oi.total,
            }));

            for (const code of codes) {
                const coupon = await Coupon.findOne({ code, isActive: true });
                const usable = coupon && coupon.expiresAt > new Date()
                    && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
                    && subtotal >= (coupon.minOrderAmount || 0);
                if (!usable || !coupon) continue;

                const eligibleAmount = getEligibleAmount(coupon, couponLineItems);
                // Skip a scoped coupon that covers none of this order's items.
                if (coupon.applicableTo !== 'all' && eligibleAmount <= 0) continue;

                if (coupon.discountType === 'free_shipping') {
                    couponFreeShipping = true;
                } else {
                    discount += computeCouponDiscount(coupon, eligibleAmount);
                }
                appliedCoupons.push(coupon);
                appliedCodes.push(coupon.code);
            }
        }

        // Authoritative server-side shipping charge (never trust a client-sent value).
        // Free shipping resolves via: all-items-free-delivery → coupon → subtotal
        // threshold → quantity → zone rate.
        const { shippingCost, freeReason } = await computeShippingCost({
            city: shippingAddress?.city || '',
            subtotal,
            items: stagedItems.map((s: any) => ({ freeShipping: Boolean(s.product?.shippingConfig?.freeShipping) })),
            totalQuantity: orderItems.reduce((n: number, oi: any) => n + (oi.quantity || 0), 0),
            couponFreeShipping,
        });
        // Guard: a fixed/large coupon can't discount more than the order subtotal
        discount = Math.min(discount, subtotal);
        const total = subtotal - discount + shippingCost;

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCost,
            shippingFreeReason: freeReason || '',
            discount,
            total,
            couponCode: appliedCodes[0] || '',
            couponCodes: appliedCodes,
            paymentMethod,
            paymentDetails: paymentDetails || {},
            transactionId: paymentDetails?.transactionId || '',
            note: note || '',
            timeline: [{ status: 'pending', note: 'Order placed successfully' }],
        });

        // Count usage for every applied coupon (so each usageLimit is enforced).
        if (appliedCoupons.length > 0) {
            await Coupon.updateMany(
                { _id: { $in: appliedCoupons.map((c) => c._id) } },
                { $inc: { usedCount: 1 } },
            );
        }

        // Update stock and product sold count (catalogue lines have no stock record)
        for (const item of orderItems) {
            if (!item.product) continue;
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, totalSold: item.quantity },
            });
        }

        // Update user stats
        await User.findByIdAndUpdate(userId, { $inc: { totalOrders: 1, totalSpent: total } });

        // Live-refresh admin dashboards (new order affects order counts + pipeline).
        emitFinanceUpdate('order_placed');

        // Send WhatsApp notification to admin (fire & forget)
        const user = await User.findById(userId);
        notifyOrderToWhatsApp({
            orderNumber: order.orderId || order._id.toString(),
            customerName: shippingAddress.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
            customerPhone: shippingAddress.phone || user?.phone || '',
            address: shippingAddress.address || '',
            items: orderItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, color: i.color, size: i.size })),
            total,
            note: note || '',
        }).catch(() => {}); // never block order flow

        // Auto-send invoice email (fire & forget; lazy require avoids circular import)
        try {
            const { default: InvoiceService } = require('../invoice/invoice.service');
            InvoiceService.emailInvoiceToCustomer(order._id.toString()).catch(() => {});
        } catch {
            // never block order flow
        }

        // ── In-app notifications: customer + all admins ──
        // Fire-and-forget: any failure here must NEVER break order placement.
        try {
            const { NotificationService } = require('../notification/notification.service');
            const orderIdStr = order._id.toString();

            const fanOut = async () => {
                // 1) Customer — order placed confirmation
                await NotificationService.notify({
                    user: userId,
                    type: 'order_placed',
                    title: 'Order placed',
                    message: `Your order ${order.orderId || orderIdStr} has been placed successfully.`,
                    link: '/dashboard/user/orders/' + orderIdStr,
                    meta: { orderId: orderIdStr, total },
                });

                // 2) Everyone who handles new orders: admins, managers and the agency
                //    that confirms them by phone.
                await NotificationService.notifyRoles(['superadmin', 'admin', 'manager', 'agency'], {
                    type: 'new_order',
                    title: 'New order placed',
                    message: `A new order ${order.orderId || orderIdStr} was placed (৳${total}).`,
                    link: '/dashboard/admin/orders/' + orderIdStr,
                    meta: { orderId: orderIdStr, total },
                });
            };

            fanOut().catch(() => {});
        } catch {
            // never block order flow
        }

        return order;
    },

    // ── Guest checkout: auto-create user + place order ────────────────
    async createGuestOrder(payload: any) {
        const { shippingAddress, password } = payload;
        const { fullName, email, phone } = shippingAddress;

        if (!phone || !fullName) {
            throw new AppError(400, 'Full name and phone number are required for checkout');
        }

        const cleanPhone = String(phone).replace(/[\s-]/g, '');
        const placeholderEmail = `${cleanPhone}@guest.karmogroup.com`;
        const typedEmail = String(email || '').trim().toLowerCase();

        // SECURITY: a guest is only ever matched to a shopper account, and only a NEW
        // account is signed in here. Typing someone else's phone or email (a customer's,
        // or a staff member's) must never hand out a login for that account — the order
        // is still saved to the customer, who signs in with their own password to see it.
        let user = await User.findOne({
            role: 'user',
            $or: [{ phone: cleanPhone }, ...(typedEmail ? [{ email: typedEmail }] : [])],
        });
        let isNewUser = false;

        if (!user) {
            // Auto-create account: phone number as password
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0] || 'Customer';
            const lastName = nameParts.slice(1).join(' ') || '.';
            // An email that already belongs to another account (e.g. staff) is not reused.
            const emailFree = typedEmail && !(await User.exists({ email: typedEmail }));

            user = await User.create({
                email: emailFree ? typedEmail : placeholderEmail,
                password: password || cleanPhone,   // matches the "your phone number is your password" message
                firstName,
                lastName,
                phone: cleanPhone,
                role: 'user',
                status: 'active',
                isEmailVerified: false,
            });
            isNewUser = true;
        } else if (user.status === 'blocked') {
            throw new AppError(403, 'We could not place this order. Please call us to order.');
        }

        // Now create order using the existing createOrder method
        const order = await this.createOrder(user._id!.toString(), payload);

        // Only the account just created is signed in (see the SECURITY note above).
        if (!isNewUser) return { order, isNewUser };

        const jwt = require('jsonwebtoken');
        const appConfig = require('../../config').default;
        const accessToken = jwt.sign(
            { userId: user._id!.toString(), email: user.email, role: user.role },
            appConfig.jwt.access_secret,
            { expiresIn: appConfig.jwt.access_expires_in }
        );

        return {
            order,
            user: {
                _id: user._id!.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone: user.phone,
            },
            accessToken,
            isNewUser,
        };
    },

    /**
     * An order taken by hand at the desk — by phone or for a walk-in customer. Staff set
     * the price agreed with the customer on each line. The customer is found by phone, or
     * added (their phone number is their password, as at guest checkout). Created as
     * Pending, or straight away Confirmed when the call already confirmed it.
     */
    async createStaffOrder(viewer: Viewer, payload: any) {
        const { items, shippingAddress, paymentMethod, paymentDetails, note, adminNote } = payload;
        const by = actorOf(viewer);
        const now = new Date();
        const isTop = viewer.role === 'superadmin' || viewer.role === 'admin';

        // ── The customer ──
        const phone = String(shippingAddress.phone || '').replace(/[\s-]/g, '');
        if (!/^01\d{9}$/.test(phone)) throw new AppError(400, 'Enter an 11-digit mobile number starting with 01');
        const fullName = String(shippingAddress.fullName || '').trim();
        let customer: any = await User.findOne({ phone, role: 'user' });
        if (!customer) {
            const email = String(shippingAddress.email || '').trim().toLowerCase();
            const emailFree = email && !(await User.exists({ email }));
            const parts = fullName.split(/\s+/);
            customer = await User.create({
                email: emailFree ? email : `${phone}@guest.karmogroup.com`,
                password: phone,
                firstName: parts[0] || 'Customer',
                lastName: parts.slice(1).join(' ') || '.',
                phone,
                role: 'user',
                status: 'active',
                isEmailVerified: false,
            });
        } else if (customer.status === 'blocked') {
            throw new AppError(400, 'This customer is blocked — unblock them in Users first');
        }

        // ── The lines ──
        let subtotal = 0;
        const orderItems: any[] = [];
        const fromStock: { id: any; qty: number }[] = [];
        for (const item of items) {
            const quantity = Math.floor(Number(item.quantity));
            const price = Math.round(Number(item.price));
            const original = Math.round(Number(item.originalPrice) || 0);
            let line: any = {
                slug: isProductId(item.product) ? '' : String(item.product || ''),
                division: divisionKey(item.division),
                name: String(item.name).trim(),
                thumbnail: item.image || '',
                price,
                originalPrice: original > price ? original : 0,
                cost: 0,
                quantity,
                total: price * quantity,
                color: item.color || '',
                size: item.size || '',
            };
            if (isProductId(item.product)) {
                const product: any = await Product.findOne({ _id: item.product, isDeleted: false });
                if (!product) throw new AppError(404, `Product not found: ${item.name}`);
                if (product.stock < quantity) throw new AppError(400, `Only ${product.stock} of ${product.name} in stock`);
                line = { ...line, product: product._id, name: line.name || product.name, thumbnail: line.thumbnail || product.thumbnail, cost: product.costPrice || 0 };
                fromStock.push({ id: product._id, qty: quantity });
            }
            subtotal += line.total;
            orderItems.push(line);
        }

        // ── Delivery and discount ──
        const mode = payload.shipping?.mode || 'auto';
        let shippingCost = 0;
        let freeReason = '';
        if (mode === 'custom') {
            shippingCost = Math.round(Number(payload.shipping?.amount) || 0);
        } else if (mode === 'auto') {
            const area = payload.deliveryArea;
            const city = area === 'inside_dhaka' ? 'dhaka'
                : area === 'outside_dhaka' ? (/dhaka/i.test(shippingAddress.city || '') ? '' : shippingAddress.city || '')
                    : shippingAddress.city || '';
            const quote = await computeShippingCost({
                city,
                subtotal,
                items: orderItems.map(() => ({ freeShipping: false })),
                totalQuantity: orderItems.reduce((n, oi) => n + oi.quantity, 0),
            });
            shippingCost = quote.shippingCost;
            freeReason = quote.freeReason || '';
        } else {
            freeReason = 'staff';
        }
        const discount = Math.min(Math.round(Number(payload.discount) || 0), subtotal);
        const total = subtotal - discount + shippingCost;

        // ── The order ──
        const confirmed = payload.status === 'confirmed';
        const paid = isTop && payload.paymentStatus === 'paid';
        const order: any = new Order({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName: fullName || `${customer.firstName} ${customer.lastName}`.replace(/\s\.$/, ''),
                phone,
                email: shippingAddress.email || '',
                address: shippingAddress.address,
                area: shippingAddress.area || '',
                city: shippingAddress.city || '',
                postalCode: shippingAddress.postalCode || '',
            },
            subtotal,
            shippingCost,
            shippingFreeReason: freeReason,
            discount,
            total,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paid ? 'paid' : 'pending',
            paymentDetails: paymentDetails || {},
            transactionId: paymentDetails?.transactionId || '',
            note: note || '',
            adminNote: adminNote || '',
            source: 'manual',
            createdBy: by,
            status: confirmed ? 'confirmed' : 'pending',
            timeline: [
                { status: 'pending', note: `Order taken by ${viewer.name || 'staff'} (phone / walk-in)`, by, createdAt: now },
                ...(confirmed ? [{ status: 'confirmed', note: 'Confirmed with the customer when the order was taken', by, createdAt: now }] : []),
            ],
            ...(confirmed ? { confirmedAt: now, confirmedBy: by } : {}),
        });
        if (confirmed) await ensureJobs(order);   // reserve the challans (M1000…) for the factory
        await order.save();

        for (const s of fromStock) {
            await Product.findByIdAndUpdate(s.id, { $inc: { stock: -s.qty, totalSold: s.qty } });
        }
        await User.findByIdAndUpdate(customer._id, { $inc: { totalOrders: 1, totalSpent: total } });
        emitFinanceUpdate('order_placed');

        try {
            const { NotificationService } = require('../notification/notification.service');
            const ref = order.orderId || order._id.toString();
            NotificationService.notifyRoles(confirmed ? ['superadmin', 'admin', 'manager'] : ['superadmin', 'admin', 'manager', 'agency'], {
                type: 'new_order',
                title: confirmed ? 'New confirmed order' : 'New order taken by phone',
                message: `${viewer.name || 'Staff'} added order ${ref} (৳${total}).`,
                link: '/dashboard/admin/orders/' + order._id.toString(),
                meta: { orderId: order._id.toString(), total },
            }).catch(() => {});
        } catch {
            // never block the order on a notification
        }

        return present(order, viewer);
    },

    async updateOrderStatus(id: string, status: string, note: string | undefined, viewer: Viewer) {
        await assertVisible(id, viewer);
        const order: any = await Order.findById(id);
        if (!order) throw new AppError(404, 'Order not found');
        assertTransition(viewer, order, status);

        const by = actorOf(viewer);
        const now = new Date();
        if (status === 'cancelled') {
            const reason = String(note || '').trim();
            if (reason.length < 3) throw new AppError(400, 'Say why the order is cancelled');
            order.cancelReason = reason;
            order.cancelledAt = now;
            order.cancelledBy = by;
            // Products from the catalogue collection go back on the shelf.
            for (const item of order.items) {
                if (item.product) await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, totalSold: -item.quantity } });
            }
        }
        if (status === 'confirmed' && order.status === 'pending') {
            order.confirmedAt = now;
            order.confirmedBy = by;
            await ensureJobs(order);   // reserve the challans (M1000…) for the factory
        }

        order.status = status as any;
        order.timeline.push({ status, note: note || '', by, createdAt: now } as any);

        // Update payment status when delivered (COD collected on delivery)
        if (status === 'delivered' && order.paymentMethod === 'cod') {
            order.paymentStatus = 'paid';
        }
        // Refund flips the payment status to refunded
        if (status === 'refunded') {
            order.paymentStatus = 'refunded';
        }

        await order.save();
        // Status/payment change can move revenue & net profit — refresh admins live.
        emitFinanceUpdate('order_status:' + status);
        notifyOrderStatus(order, status);

        return present(order, viewer);
    },

    /**
     * Book the parcel with Pathao and mark the order shipped. Only from Courier Entry,
     * and only once — a second booking would be a second parcel.
     */
    async sendWithPathao(id: string, viewer: Viewer) {
        const order = await CourierService.book(id, 'pathao', viewer);
        return present(order, viewer);
    },

    async cancelOrder(id: string, userId: string) {
        const order: any = await Order.findOne({ _id: id, user: userId });
        if (!order) throw new AppError(404, 'Order not found');
        // Once the desk has confirmed it by phone, the factory may already be making it —
        // the customer calls instead.
        if (order.status !== 'pending') {
            throw new AppError(400, 'This order is already confirmed. Please call us to cancel it.');
        }

        order.status = 'cancelled';
        order.cancelReason = 'Cancelled by the customer';
        order.cancelledAt = new Date();
        order.timeline.push({ status: 'cancelled', note: 'Cancelled by the customer', createdAt: new Date() } as any);

        await order.save();

        // Restore stock (catalogue lines have none)
        for (const item of order.items) {
            if (!item.product) continue;
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }

        // Tell the admins straight away — otherwise they keep packing an order
        // the customer has already cancelled. Fire-and-forget.
        try {
            const { NotificationService } = require('../notification/notification.service');
            const orderIdStr = order._id.toString();
            NotificationService.notifyAdmins({
                type: 'order_cancelled',
                title: 'Order cancelled by customer',
                message: `Order ${order.orderId || orderIdStr} was cancelled by the customer (৳${order.total}).`,
                link: '/dashboard/admin/orders/' + orderIdStr,
                meta: { orderId: orderIdStr, total: order.total },
            }).catch(() => {});
        } catch {
            // never block the cancellation
        }
        emitFinanceUpdate('order_cancelled');

        return order;
    },

    async updatePaymentStatus(id: string, paymentStatus: string, viewer?: Viewer) {
        const order = await Order.findById(id);
        if (!order) throw new AppError(404, 'Order not found');

        order.paymentStatus = paymentStatus as any;
        if (paymentStatus === 'paid') {
            order.transactionId = order.transactionId || `PAY-${Date.now()}`;
        }
        order.timeline.push({ status: `payment_${paymentStatus}`, note: `Payment marked as ${paymentStatus}`, by: actorOf(viewer), createdAt: new Date() } as any);
        await order.save();
        emitFinanceUpdate('payment_status:' + paymentStatus);

        // Tell the customer — their money moved, they should hear about it.
        notifyOrderPayment(order, paymentStatus);
        return order;
    },

    async addAdminNote(id: string, note: string, viewer: Viewer) {
        await assertVisible(id, viewer);
        const order = await Order.findById(id);
        if (!order) throw new AppError(404, 'Order not found');

        // Persist the current note so the admin detail page can read it back
        // (order.adminNote), and keep a timeline trail of every note added.
        order.adminNote = note;
        order.timeline.push({ status: 'admin_note', note, by: actorOf(viewer), createdAt: new Date() } as any);
        await order.save();
        return present(order, viewer);
    },

    /** Counts per status within what the viewer may see, plus their own work today. */
    async getOrderStats(viewer: Viewer) {
        const scope = scopeFor(viewer);
        const today = dhakaDayStart();
        const seesMoney = ['superadmin', 'admin', 'manager'].includes(viewer.role);
        const [counts, revenueData, confirmedToday, cancelledToday] = await Promise.all([
            Order.aggregate([{ $match: scope }, { $group: { _id: '$status', n: { $sum: 1 } } }]),
            seesMoney
                ? Order.aggregate([
                    { $match: { status: 'delivered' } },
                    { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
                ])
                : Promise.resolve([]),
            Order.countDocuments({ 'confirmedBy.id': viewer.userId, confirmedAt: { $gte: today } }),
            Order.countDocuments({ 'cancelledBy.id': viewer.userId, cancelledAt: { $gte: today } }),
        ]);

        // One count per status (zero when none), plus the total.
        const stats: Record<string, number> = { total: 0 };
        for (const s of ORDER_STATUSES) stats[s] = 0;
        for (const c of counts as any[]) {
            stats[c._id] = c.n;
            stats.total += c.n;
        }
        return {
            ...stats,
            ...(seesMoney ? { totalRevenue: (revenueData as any[])[0]?.totalRevenue || 0 } : {}),
            mine: { confirmedToday, cancelledToday },
        };
    },

    /**
     * The admin / manager dashboard: today at a glance, and the running 7 or 30 days
     * day by day with their totals. Days are Dhaka calendar days (midnight to
     * midnight). Money is the order total (products + delivery − discount); cancelled,
     * returned and refunded orders are never counted as sold.
     *   sold      = value of the period's orders that still stand
     *   earned    = the part of it delivered or paid online
     *   toCollect = sold − earned (still on its way to being paid)
     */
    async getOrderOverview(viewer: Viewer, daysParam?: unknown) {
        const days = Number(daysParam) === 7 ? 7 : 30;
        const scope = scopeFor(viewer);
        const today = dhakaDayStart();
        const from = new Date(today.getTime() - (days - 1) * DAY_MS);

        const unsold = { $in: ['$status', NOT_SOLD] };
        const soldValue = (field: string) => ({ $sum: { $cond: [unsold, 0, field] } });

        const [placedToday, statusCounts, deliveredToday, cancelledToday, daily, period] = await Promise.all([
            Order.aggregate([
                { $match: { ...scope, createdAt: { $gte: today } } },
                { $group: { _id: null, n: { $sum: 1 }, value: soldValue('$total') } },
            ]),
            Order.aggregate([{ $match: scope }, { $group: { _id: '$status', n: { $sum: 1 } } }]),
            Order.aggregate([
                { $match: { ...scope, status: 'delivered', timeline: { $elemMatch: { status: 'delivered', createdAt: { $gte: today } } } } },
                { $group: { _id: null, n: { $sum: 1 }, value: { $sum: '$total' } } },
            ]),
            Order.countDocuments({ ...scope, cancelledAt: { $gte: today } }),
            Order.aggregate([
                { $match: { ...scope, createdAt: { $gte: from } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dhaka' } },
                        orders: { $sum: 1 },
                        revenue: soldValue('$total'),
                    },
                },
            ]),
            Order.aggregate([
                { $match: { ...scope, createdAt: { $gte: from } } },
                {
                    $group: {
                        _id: null,
                        placed: { $sum: 1 },
                        unsold: { $sum: { $cond: [unsold, 1, 0] } },
                        sold: soldValue('$total'),
                        earned: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $not: [unsold] }, { $or: [{ $eq: ['$status', 'delivered'] }, { $eq: ['$paymentStatus', 'paid'] }] }] },
                                    '$total',
                                    0,
                                ],
                            },
                        },
                        delivery: soldValue('$shippingCost'),
                        pieces: { $sum: { $cond: [unsold, 0, { $sum: '$items.quantity' }] } },
                    },
                },
            ]),
        ]);

        const count: Record<string, number> = {};
        for (const c of statusCounts as any[]) count[c._id] = c.n;
        const sum = (keys: string[]) => keys.reduce((n, k) => n + (count[k] || 0), 0);

        // Every day of the range, zero when nothing was placed that day.
        const byDay = new Map((daily as any[]).map((d) => [d._id, d]));
        const dayKey = (t: number) => new Date(t + 6 * 3600e3).toISOString().slice(0, 10);
        const series = Array.from({ length: days }, (_, i) => {
            const date = dayKey(from.getTime() + i * DAY_MS);
            const d = byDay.get(date);
            return { date, orders: d?.orders || 0, revenue: d?.revenue || 0 };
        });

        const p = (period as any[])[0] || { placed: 0, unsold: 0, sold: 0, earned: 0, delivery: 0, pieces: 0 };
        const t = (placedToday as any[])[0] || { n: 0, value: 0 };
        const dl = (deliveredToday as any[])[0] || { n: 0, value: 0 };
        const soldOrders = p.placed - p.unsold;

        return {
            days,
            today: {
                placed: t.n,
                placedValue: t.value,
                cancelled: cancelledToday,
                pending: count.pending || 0,
                inProcess: sum(IN_PROCESS),
                onTheWay: sum(ON_THE_WAY),
                delivered: dl.n,
                deliveredValue: dl.value,
            },
            daily: series,
            period: {
                from: series[0].date,
                to: series[series.length - 1].date,
                orders: soldOrders,
                cancelled: p.unsold,
                pieces: p.pieces,
                sold: p.sold,
                earned: p.earned,
                toCollect: p.sold - p.earned,
                delivery: p.delivery,
                average: soldOrders ? Math.round(p.sold / soldOrders) : 0,
                collectedPct: p.sold ? Math.round((p.earned / p.sold) * 100) : 0,
            },
        };
    },

    /**
     * Order insights (GET /admin/insights?days=7|30|90|365|all): who orders and how
     * often (by phone), from where (city/area as typed — the page maps them to
     * districts and divisions), what (product division, top products), when (hour,
     * weekday, a trend line), how they pay, where orders come from, how they end, why
     * they are cancelled and which coupons are used. Money counts only orders that
     * stand (not cancelled, returned or refunded). Dhaka time throughout.
     */
    async getOrderInsights(viewer: Viewer, query: Record<string, unknown> = {}) {
        const choice = String(query.days || '30');
        const days = ['7', '30', '90', '365'].includes(choice) ? Number(choice) : choice === 'all' ? 0 : 30;
        const least = query.order === 'asc';
        const dir = least ? 1 : -1;
        // Filters: place (division / district terms), delivery zone terms, product division,
        // payment method and where the order came from.
        const and: Record<string, any>[] = [scopeFor(viewer)];
        for (const list of [query.places, query.zonePlaces]) {
            const m = placeMatch(list);
            if (m) and.push(m);
        }
        if (query.division) {
            const dv = divisionOf(query.division);
            and.push({ 'items.division': { $in: dv === 'fiber_pillow' ? ['fiber_pillow', 'pillow'] : dv === 'general' ? ['general', '', null] : [dv] } });
        }
        if (query.paymentMethod) and.push({ paymentMethod: String(query.paymentMethod) });
        if (query.source) and.push(query.source === 'website' ? { source: { $in: ['website', null] } } : { source: String(query.source) });
        const match: Record<string, any> = { $and: and };
        if (days) match.createdAt = { $gte: new Date(dhakaDayStart().getTime() - (days - 1) * DAY_MS) };

        const TZ = 'Asia/Dhaka';
        const unsold = { $in: ['$status', NOT_SOLD] };
        const soldValue = (field: string) => ({ $sum: { $cond: [unsold, 0, field] } });
        // "+880 1712-345 678" → "01712345678"
        const phone = {
            $let: {
                vars: { p: { $replaceAll: { input: { $replaceAll: { input: { $ifNull: ['$shippingAddress.phone', ''] }, find: ' ', replacement: '' } }, find: '-', replacement: '' } } },
                in: {
                    $cond: [{ $eq: [{ $substrCP: ['$$p', 0, 3] }, '+88'] }, { $substrCP: ['$$p', 3, 20] },
                        { $cond: [{ $and: [{ $eq: [{ $substrCP: ['$$p', 0, 2] }, '88'] }, { $eq: [{ $strLenCP: '$$p' }, 13] }] }, { $substrCP: ['$$p', 2, 20] }, '$$p'] }],
                },
            },
        };
        const trendFormat = days && days <= 90 ? '%Y-%m-%d' : '%Y-%m';

        const [r] = await Order.aggregate([
            { $match: match },
            {
                $facet: {
                    totals: [{
                        $group: {
                            _id: null, orders: { $sum: 1 }, unsold: { $sum: { $cond: [unsold, 1, 0] } }, sold: soldValue('$total'),
                            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                            returned: { $sum: { $cond: [{ $in: ['$status', ['returned', 'refunded']] }, 1, 0] } },
                            delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
                        },
                    }],
                    byStatus: [{ $group: { _id: '$status', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
                    byPayment: [{ $group: { _id: '$paymentMethod', n: { $sum: 1 }, value: soldValue('$total') } }, { $sort: { n: -1 } }],
                    bySource: [{ $group: { _id: { $ifNull: ['$source', 'website'] }, n: { $sum: 1 }, value: soldValue('$total') } }, { $sort: { n: -1 } }],
                    byHour: [{ $group: { _id: { $hour: { date: '$createdAt', timezone: TZ } }, n: { $sum: 1 } } }],
                    byWeekday: [{ $group: { _id: { $dayOfWeek: { date: '$createdAt', timezone: TZ } }, n: { $sum: 1 } } }],
                    trend: [
                        { $group: { _id: { $dateToString: { format: trendFormat, date: '$createdAt', timezone: TZ } }, orders: { $sum: 1 }, revenue: soldValue('$total') } },
                        { $sort: { _id: 1 } },
                    ],
                    places: [
                        { $group: { _id: { city: { $trim: { input: { $ifNull: ['$shippingAddress.city', ''] } } }, area: { $trim: { input: { $ifNull: ['$shippingAddress.area', ''] } } } }, n: { $sum: 1 }, value: soldValue('$total') } },
                        { $sort: { n: -1 } }, { $limit: 1000 },
                    ],
                    customers: [
                        { $group: { _id: phone, n: { $sum: 1 }, value: soldValue('$total'), name: { $last: '$shippingAddress.fullName' }, first: { $min: '$createdAt' }, last: { $max: '$createdAt' } } },
                        { $match: { _id: { $ne: '' } } },
                        { $sort: { n: dir, value: dir } },
                        { $limit: 200 },
                    ],
                    customerCounts: [
                        { $group: { _id: phone, n: { $sum: 1 } } },
                        { $match: { _id: { $ne: '' } } },
                        { $group: { _id: null, unique: { $sum: 1 }, repeat: { $sum: { $cond: [{ $gte: ['$n', 2] }, 1, 0] } } } },
                    ],
                    cancelReasons: [
                        { $match: { status: 'cancelled' } },
                        { $group: { _id: { $trim: { input: { $ifNull: ['$cancelReason', ''] } } }, n: { $sum: 1 } } },
                        { $sort: { n: -1 } }, { $limit: 10 },
                    ],
                    coupons: [
                        { $unwind: '$couponCodes' },
                        { $group: { _id: { $toUpper: '$couponCodes' }, n: { $sum: 1 } } },
                        { $sort: { n: -1 } }, { $limit: 10 },
                    ],
                    divisions: [
                        { $match: { status: { $nin: NOT_SOLD } } },
                        { $unwind: '$items' },
                        { $group: { _id: { $ifNull: ['$items.division', ''] }, orders: { $addToSet: '$_id' }, pieces: { $sum: '$items.quantity' }, value: { $sum: '$items.total' } } },
                        { $project: { orders: { $size: '$orders' }, pieces: 1, value: 1 } },
                        { $sort: { value: -1 } },
                    ],
                    products: [
                        { $match: { status: { $nin: NOT_SOLD } } },
                        { $unwind: '$items' },
                        { $group: { _id: '$items.name', division: { $first: '$items.division' }, pieces: { $sum: '$items.quantity' }, value: { $sum: '$items.total' }, orders: { $addToSet: '$_id' } } },
                        { $project: { division: 1, pieces: 1, value: 1, orders: { $size: '$orders' } } },
                        { $sort: { pieces: dir, value: dir } }, { $limit: 15 },
                    ],
                },
            },
        ]);

        const t = r.totals[0] || { orders: 0, unsold: 0, sold: 0, cancelled: 0, returned: 0, delivered: 0 };
        const soldOrders = t.orders - t.unsold;
        const cc = r.customerCounts[0] || { unique: 0, repeat: 0 };
        const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
        const hours = Array.from({ length: 24 }, (_, h) => (r.byHour as any[]).find((x) => x._id === h)?.n || 0);
        // Mongo's weekday: 1 = Sunday … 7 = Saturday. Shown Saturday first, as the Bangladesh week runs.
        const weekdays = [7, 1, 2, 3, 4, 5, 6].map((d) => (r.byWeekday as any[]).find((x) => x._id === d)?.n || 0);

        return {
            days: days || 'all',
            order: least ? 'asc' : 'desc',
            trendBy: trendFormat === '%Y-%m' ? 'month' : 'day',
            totals: {
                orders: t.orders, soldOrders, sold: t.sold, average: soldOrders ? Math.round(t.sold / soldOrders) : 0,
                customers: cc.unique, repeatCustomers: cc.repeat, repeatPct: pct(cc.repeat, cc.unique),
                cancelled: t.cancelled, cancelPct: pct(t.cancelled, t.orders),
                returned: t.returned, returnPct: pct(t.returned, t.orders),
                delivered: t.delivered,
            },
            trend: fillTrend(r.trend as any[], trendFormat === '%Y-%m' ? 'month' : 'day', days),
            byStatus: (r.byStatus as any[]).map((x) => ({ status: x._id, n: x.n })),
            byPayment: (r.byPayment as any[]).map((x) => ({ method: x._id || 'unknown', n: x.n, value: x.value })),
            bySource: (r.bySource as any[]).map((x) => ({ source: x._id, n: x.n, value: x.value })),
            hours,
            weekdays,
            places: (r.places as any[]).map((x) => ({ city: x._id.city, area: x._id.area, n: x.n, value: x.value })),
            customers: (r.customers as any[]).map((x) => ({ phone: x._id, name: x.name || '', orders: x.n, value: x.value, first: x.first, last: x.last })),
            cancelReasons: (r.cancelReasons as any[]).map((x) => ({ reason: x._id || 'No reason given', n: x.n })),
            coupons: (r.coupons as any[]).map((x) => ({ code: x._id, n: x.n })),
            divisions: mergeDivisions(r.divisions as any[]),
            products: (r.products as any[]).map((x) => ({ name: x._id, division: divisionOf(x.division), orders: x.orders, pieces: x.pieces, value: x.value })),
        };
    },

    /**
     * The orders behind "Print invoice" and "Print label" (POST /admin/print), in the
     * order asked for, shaped as the print documents read them (client
     * components/admin/print/printDocs.ts → PrintOrder). At most 100 at a time; ids that
     * are not valid, not found or outside the viewer's scope are left out.
     */
    async getPrintData(viewer: Viewer, idsParam: unknown) {
        const ids = (Array.isArray(idsParam) ? idsParam : [])
            .map((v) => String(v || ''))
            .filter((v) => isProductId(v))
            .slice(0, 100);
        if (!ids.length) throw new AppError(400, 'Pick at least one order to print');

        const orders = await Order.find({ ...scopeFor(viewer), _id: { $in: ids } })
            .populate('user', 'firstName lastName email phone')
            .lean();
        const byId = new Map(orders.map((o: any) => [String(o._id), o]));

        return ids.map((id) => byId.get(id)).filter(Boolean).map((o: any) => {
            const a = o.shippingAddress || {};
            const u = o.user || {};
            const total = Number(o.total) || 0;
            const paid = o.paymentStatus === 'paid' ? total : 0;
            return {
                _id: String(o._id),
                orderId: o.orderId,
                createdAt: o.createdAt,
                status: o.status,
                paymentMethod: o.paymentMethod,
                paymentStatus: o.paymentStatus,
                customer: {
                    name: a.fullName || [u.firstName, u.lastName].filter(Boolean).join(' '),
                    phone: a.phone || u.phone || '',
                    email: a.email || u.email || '',
                },
                shippingAddress: {
                    fullName: a.fullName || '', phone: a.phone || '', address: a.address || '',
                    area: a.area || '', city: a.city || '', postalCode: a.postalCode || '',
                },
                items: (o.items || []).map((it: any) => ({
                    name: it.name || '',
                    sku: it.slug || '',
                    color: it.color || '',
                    size: it.size || '',
                    quantity: Number(it.quantity) || 0,
                    price: Number(it.price) || 0,
                    discount: 0,
                    total: Number(it.total) || 0,
                })),
                subtotal: Number(o.subtotal) || 0,
                discount: Number(o.discount) || 0,
                shippingCost: Number(o.shippingCost) || 0,
                total,
                paid,
                due: total - paid,
                refunded: o.paymentStatus === 'refunded',
                note: o.note || '',
                consignmentId: o.consignmentId || '',
                consignmentIds: o.consignmentId ? [o.consignmentId] : [],
            };
        });
    },

    // ════════════════════════════════════════════════════════════
    //  RETURN / REFUND (called from the return module)
    // ════════════════════════════════════════════════════════════

    // Mark an order as returned, then set order status.
    async markOrderReturned(orderId: any, note?: string) {
        const order = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');

        if (order.status !== 'returned' && order.status !== 'refunded') {
            order.status = 'returned' as any;
            order.timeline.push({ status: 'returned', note: note || 'Return approved', createdAt: new Date() } as any);
            await order.save();
        }
        return order;
    },

    // Mark an order as refunded + flip payment status.
    async markOrderRefunded(orderId: any, note?: string) {
        const order = await Order.findById(orderId);
        if (!order) throw new AppError(404, 'Order not found');

        order.paymentStatus = 'refunded';
        if (order.status !== 'refunded') {
            order.status = 'refunded' as any;
            order.timeline.push({ status: 'refunded', note: note || 'Refund processed', createdAt: new Date() } as any);
        }
        await order.save();
        return order;
    },

    // ════════════════════════════════════════════════════════════
    //  TRACKING (admin set) + PUBLIC TRACK
    // ════════════════════════════════════════════════════════════

    // Admin sets the order tracking number + carrier
    async updateOrderTracking(id: string, trackingNumber: string, carrier: string, viewer?: Viewer) {
        const order = await Order.findById(id);
        if (!order) throw new AppError(404, 'Order not found');

        order.trackingNumber = trackingNumber;
        order.carrier = carrier;
        order.timeline.push({
            status: 'tracking_updated',
            note: `Tracking: ${trackingNumber} via ${carrier}`,
            by: actorOf(viewer),
            createdAt: new Date(),
        } as any);

        await order.save();
        return order;
    },

    // Public order tracking — matches human orderId (case-insensitive) OR Mongo _id
    async trackOrder(orderId: string): Promise<any> {
        const escaped = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const or: any[] = [{ orderId: new RegExp('^' + escaped + '$', 'i') }];
        if (Types.ObjectId.isValid(orderId)) or.push({ _id: orderId });

        const order = await Order.findOne({ $or: or });
        if (!order) throw new AppError(404, 'Order not found');

        const o: any = order;
        const itemsCount = (o.items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
        const customerName = (o.shippingAddress?.fullName || '').trim().split(/\s+/)[0] || '';

        return {
            orderId: o.orderId,
            status: o.status,
            paymentStatus: o.paymentStatus,
            paymentMethod: o.paymentMethod,
            createdAt: o.createdAt,
            customerName,
            itemsCount,
            trackingNumber: o.trackingNumber || '',
            carrier: o.carrier || '',
            courierStatus: o.courierStatus || '',   // raw courier state (e.g. hub transit) for the tracker
            timeline: (o.timeline || []).map((t: any) => ({ status: t.status, note: t.note, createdAt: t.createdAt })),
        };
    },
};

export default OrderService;
