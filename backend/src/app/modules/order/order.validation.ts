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

/**
 * An order taken by hand at the desk (phone / walk-in). Lines carry the price agreed
 * with the customer; Karmo catalogue lines (mattress, foam…) arrive by slug with their
 * name, size and division, other goods as a free line.
 */
export const staffOrderValidation = z.object({
    body: z.object({
        items: z.array(z.object({
            product: z.string().trim().optional(),
            name: z.string().trim().min(1, 'Every line needs a product name'),
            quantity: z.number().int().min(1, 'Quantity must be at least 1').max(999),
            price: z.number().min(0, 'Price cannot be negative'),
            originalPrice: z.number().min(0).optional(),
            division: z.string().trim().optional(),
            size: z.string().trim().optional(),
            color: z.string().trim().optional(),
            image: z.string().optional(),
        })).min(1, 'Add at least one product'),
        shippingAddress: shippingAddressValidation,
        paymentMethod: z.enum(['cod', 'bkash', 'rocket', 'nagad']).default('cod'),
        paymentDetails: paymentDetailsValidation,
        paymentStatus: z.enum(['pending', 'paid']).optional(),
        status: z.enum(['pending', 'confirmed']).optional(),
        deliveryArea: z.enum(['inside_dhaka', 'outside_dhaka']).optional(),
        shipping: z.object({
            mode: z.enum(['auto', 'free', 'custom']),
            amount: z.number().min(0).optional(),
        }).optional(),
        discount: z.number().min(0).optional(),
        note: z.string().optional(),
        adminNote: z.string().optional(),
    }),
});

export const updateOrderStatusValidation = z.object({
    body: z.object({
        status: z.enum(ORDER_STATUSES),
        note: z.string().optional(),
        reason: z.string().optional(),   // required by the server when cancelling
    }),
});

export const scanValidation = z.object({
    body: z.object({
        code: z.string().min(1, 'Scan a barcode'),
        method: z.enum(['scan', 'manual']).optional(),
    }),
});

export const reasonValidation = z.object({
    body: z.object({
        reason: z.string().min(3, 'Say why a duplicate is needed'),
    }),
});

export const smsValidation = z.object({
    body: z.object({
        kind: z.enum(['confirmed', 'cancelled']).optional(),
    }).optional(),
});
