import { Schema, model } from 'mongoose';

/**
 * Karmo's order desk, in the order an order moves through it: placed on the site,
 * confirmed by phone, sent to the factory, challans printed, entered with the
 * courier, and handed over (shipped).
 */
export const ORDER_FLOW = ['pending', 'confirmed', 'factory', 'challan_ready', 'courier_entry', 'shipped'] as const;

/** Every status an order can hold: the flow, what happens after it, and the older courier steps kept for existing data. */
export const ORDER_STATUSES = [
    ...ORDER_FLOW,
    'delivered', 'cancelled', 'returned', 'refunded',
    'processing', 'on_the_way', 'out_for_delivery', 'delivery_attempt',
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed', factory: 'Factory', challan_ready: 'Challan Ready',
    courier_entry: 'Courier Entry', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
    returned: 'Returned', refunded: 'Refunded', processing: 'Processing', on_the_way: 'On the way',
    out_for_delivery: 'Out for delivery', delivery_attempt: 'Delivery attempt',
};

const orderItemSchema = new Schema({
    // A product from the products collection. Empty for Karmo catalogue lines
    // (mattress, foam, pillows…), which live in the website's data and arrive by slug.
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    slug: { type: String, default: '' },
    // Which factory makes it — one challan per division (mattress, foam, fiber_pillow, hometex…).
    division: { type: String, default: '' },
    name: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    price: { type: Number, required: true },
    // The list ("was") price, when the line sold below it — shown struck through.
    originalPrice: { type: Number, default: 0 },
    // Unit cost (buying price) snapshotted at purchase time — powers COGS / net-profit.
    // Kept internal; never surfaced to the customer.
    cost: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
}, { _id: true });

/** Who did something — kept as a snapshot so the log still reads right if the account changes. */
const actorSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: '' },
    role: { type: String, default: '' },
}, { _id: false });

const timelineSchema = new Schema({
    status: { type: String },
    note: { type: String, default: '' },
    by: { type: actorSchema, default: undefined },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

/** One SMS sent to the customer from the order desk. */
const smsSchema = new Schema({
    kind: { type: String, default: 'confirmed' },          // confirmed | cancelled
    to: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['sent', 'failed', 'not_configured'], default: 'sent' },
    providerRef: { type: String, default: '' },
    error: { type: String, default: '' },
    by: { type: actorSchema },
    at: { type: Date, default: Date.now },
});

/** One product leaving the factory: each piece is scanned out exactly once. */
const unitSchema = new Schema({
    code: { type: String, required: true },               // M1000-1
    itemIndex: { type: Number, required: true },           // index into order.items
    scannedAt: { type: Date },
    scannedBy: { type: actorSchema },
    method: { type: String, enum: ['scan', 'manual'] },
}, { _id: false });

/** A duplicate printed after the original — who allowed it and why. */
const reprintSchema = new Schema({
    at: { type: Date, default: Date.now },
    by: { type: actorSchema },
    reason: { type: String, default: '' },
}, { _id: false });

/**
 * One challan: the products of a single division on this order. Its number is reserved
 * when the order is confirmed; the original is issued once, after every piece is scanned.
 */
const jobSchema = new Schema({
    division: { type: String, required: true },
    challanNo: { type: String, required: true },          // M1000
    units: { type: [unitSchema], default: [] },
    issuedAt: { type: Date },
    issuedBy: { type: actorSchema },
    reprints: { type: [reprintSchema], default: [] },
});

const shippingAddressSchema = new Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
}, { _id: false });

const orderSchema = new Schema(
    {
        orderId: { type: String, unique: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [orderItemSchema], required: true },
        shippingAddress: { type: shippingAddressSchema, required: true },

        // Pricing
        subtotal: { type: Number, required: true },
        shippingCost: { type: Number, default: 0 },
        shippingFreeReason: { type: String, default: '' }, // '' | product | coupon | threshold | quantity
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        couponCode: { type: String, default: '' },        // primary/first applied coupon (kept for display + back-compat)
        couponCodes: { type: [String], default: [] },     // all applied coupons when several are stacked on one order

        // Status
        status: {
            type: String,
            enum: ORDER_STATUSES,
            default: 'pending',
        },
        cancelReason: { type: String, default: '' },
        confirmedAt: { type: Date },
        confirmedBy: { type: actorSchema },
        cancelledAt: { type: Date },
        cancelledBy: { type: actorSchema },
        paymentMethod: {
            type: String,
            enum: ['cod', 'bkash', 'rocket', 'nagad', 'sslcommerz'],
            default: 'bkash',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        transactionId: { type: String, default: '' },
        paymentDetails: {
            senderNumber: { type: String, default: '' },
            transactionId: { type: String, default: '' },
            paymentTime: { type: String, default: '' },
        },
        trackingNumber: { type: String, default: '' },
        carrier: { type: String, default: '' },
        consignmentId: { type: String, default: '' },   // courier consignment id (Pathao or Steadfast)
        courierStatus: { type: String, default: '' },   // raw courier status as the courier reports it
        courierFee: { type: Number, default: 0 },        // what the courier charges Karmo for this parcel
        courierBookedAt: { type: Date },

        note: { type: String, default: '' },
        adminNote: { type: String, default: '' }, // internal note shown/editable on the admin order detail
        // Where the order came from: the website, or taken by hand at the desk (phone / walk-in).
        source: { type: String, enum: ['website', 'manual'], default: 'website' },
        createdBy: { type: actorSchema },
        timeline: { type: [timelineSchema], default: [] },

        // ── Order desk paperwork ──
        sms: { type: [smsSchema], default: [] },
        jobs: { type: [jobSchema], default: [] },          // one challan per division
        memo: {
            issuedAt: { type: Date },
            issuedBy: { type: actorSchema },
            reprints: { type: [reprintSchema], default: [] },
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

// Auto-generate order ID
orderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        const count = await (this.constructor as any).countDocuments();
        this.orderId = `KRM-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'jobs.challanNo': 1 });
orderSchema.index({ 'jobs.units.code': 1 });

export const Order = model('Order', orderSchema);

/** Running numbers (challan series per division). */
const counterSchema = new Schema({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } }, { versionKey: false });
export const Counter = model('Counter', counterSchema);

/** The next number in a series that starts at `start` (M1000, M1001…). Atomic. */
export async function nextInSeries(key: string, start: number): Promise<number> {
    const c: any = await Counter.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, new: true });
    return start - 1 + c.seq;
}
