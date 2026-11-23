import { Schema, model, Document } from 'mongoose';

export interface ICounter extends Document {
    title: string;
    value: number;
    prefix: string;
    suffix: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const counterSchema = new Schema<ICounter>(
    {
        title: { type: String, required: true, trim: true },
        value: { type: Number, required: true, default: 0 },
        prefix: { type: String, default: '', trim: true },
        suffix: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },
        icon: { type: String, default: 'award', trim: true },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

counterSchema.index({ order: 1, isActive: 1 });

// Its own model and collection: 'Counter' / 'counters' already hold the order-number sequence (order.model.ts).
export const Counter = model<ICounter>('HomeCounter', counterSchema, 'homecounters');
