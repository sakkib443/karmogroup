import { z } from 'zod';
import { ORDER_STATUSES } from './order.model';

const orderItemValidation = z.object({
    // A product _id, or the slug of a Karmo catalogue item (then name, price and division come with it).
    product: z.string().min(1, 'Product ID required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    name: z.string().optional(),
    price: z.number().optional(),
    image: z.string().optional(),
    division: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
});

const shippingAddressValidation = z.object({
    fullName: z.string().min(1, 'Full name required'),
    phone: z.string().min(1, 'Phone required'),
    email: z.string().optional(),
    address: z.string().min(1, 'Address required'),
    area: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
});

const paymentDetailsValidation = z.object({
    senderNumber: z.string().optional(),
    transactionId: z.string().optional(),
    paymentTime: z.string().optional(),
}).optional();

export const createOrderValidation = z.object({
    body: z.object({
        items: z.array(orderItemValidation).min(1, 'At least one item required'),
        shippingAddress: shippingAddressValidation,
        paymentMethod: z.enum(['cod', 'bkash', 'rocket', 'nagad', 'sslcommerz']).default('bkash'),
        paymentDetails: paymentDetailsValidation,
        couponCode: z.string().optional(),
        couponCodes: z.array(z.string()).optional(), // multiple stacked coupons
        note: z.string().optional(),
    }),
});

export const updateOrderStatusValidation = z.object({
    body: z.object({
        status: z.enum(ORDER_STATUSES),
        note: z.string().optional(),
    }),
});
