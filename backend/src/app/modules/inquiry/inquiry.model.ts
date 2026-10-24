import { Schema, model } from 'mongoose';

/**
 * A message from the website: the contact form above the footer, the chat bubble's
 * "Leave a message", or a product page. The desk calls the customer back and moves it
 * New (pending) → Called (replied) → Closed.
 */
const inquirySchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },   // only when asked from a product page
        name: { type: String, required: true, maxlength: 100, trim: true },
        phone: { type: String, required: true, maxlength: 100, trim: true }, // phone or email
        message: { type: String, required: true, maxlength: 2000, trim: true },
        /** Where it was sent from. */
        source: { type: String, enum: ['contact_form', 'chat', 'product'], default: 'contact_form' },
        /** The page it was sent from, e.g. "/foam" or "/contact". */
        page: { type: String, default: '', maxlength: 300 },
        status: { type: String, enum: ['pending', 'replied', 'closed'], default: 'pending' },
        /** What the desk noted after calling. */
        adminReply: { type: String, default: '' },
        handledBy: { id: { type: Schema.Types.ObjectId, ref: 'User' }, name: String, role: String },
        handledAt: { type: Date },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

inquirySchema.index({ product: 1, createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1, createdAt: -1 });

export const Inquiry = model('Inquiry', inquirySchema);
