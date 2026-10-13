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
    // Unit cost (buying price) snapshotted at purchase time — powers COGS / net-profit.
    // Kept internal; never surfaced to the customer.
    cost: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
}, { _id: true });

const timelineSchema = new Schema({
    status: { type: String },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

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
        timeline: { type: [timelineSchema], default: [] },
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

export const Order = model('Order', orderSchema);
