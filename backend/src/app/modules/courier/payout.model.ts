import { Schema, model } from 'mongoose';

/**
 * Money a courier paid Karmo: the cash it collected on delivered parcels, less its charges.
 * Steadfast payouts are pulled from its API ("Sync payouts"); Pathao payouts are written
 * in by hand from Pathao's statement. Each settled parcel points back here
 * (order.courierPayout), so "still owed" never counts a parcel twice.
 */
const payoutParcelSchema = new Schema(
    {
        order: { type: Schema.Types.ObjectId, ref: 'Order' },
        orderNo: { type: String, default: '' },
        consignmentId: { type: String, default: '' },
        cod: { type: Number, default: 0 },
        charge: { type: Number, default: 0 },
        returnCharge: { type: Number, default: 0 },
        status: { type: String, default: '' },
    },
    { _id: false },
);

const courierPayoutSchema = new Schema(
    {
        carrier: { type: String, enum: ['pathao', 'steadfast'], required: true },
        source: { type: String, enum: ['api', 'manual'], default: 'manual' },
        /** The courier's own id for the payout (Steadfast payment id, Pathao invoice no). */
        reference: { type: String, default: '' },
        paidAt: { type: Date, required: true },
        /** What reached the bank / bKash — net of charges. */
        amount: { type: Number, required: true, min: 0 },
        codTotal: { type: Number, default: 0 },
        chargeTotal: { type: Number, default: 0 },
        parcels: { type: [payoutParcelSchema], default: [] },
        note: { type: String, default: '' },
        createdBy: { id: { type: Schema.Types.ObjectId, ref: 'User' }, name: String, role: String },
    },
    { timestamps: true },
);

courierPayoutSchema.index({ carrier: 1, reference: 1 });
courierPayoutSchema.index({ paidAt: -1 });

export const CourierPayout = model('CourierPayout', courierPayoutSchema);
