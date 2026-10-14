import { z } from 'zod';
import { ROLES, DIVISIONS } from '../../constants/roles';

const divisions = z.array(z.enum(DIVISIONS.map((d) => d.key) as [string, ...string[]])).optional();
const statusEnum = z.enum(['active', 'blocked', 'pending']);

/** Admin: add any account — a customer or staff. Who may give which role is checked in the service. */
export const adminCreateUserValidation = z.object({
    body: z.object({
        firstName: z.string().trim().min(1, 'First name is required').max(50),
        lastName: z.string().trim().max(50).optional(),
        email: z.string().trim().email('Enter a valid email'),
        phone: z.string().trim().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(ROLES),
        divisions,
        status: statusEnum.optional(),
    }),
});

/** Admin: add a buyer by hand (phone orders, walk-ins). Email and password are optional. */
export const adminCreateCustomerValidation = z.object({
    body: z.object({
        firstName: z.string().trim().min(1, 'First name is required').max(50),
        lastName: z.string().trim().max(50).optional(),
        phone: z.string().trim().min(6, 'Phone is required'),
        email: z.string().trim().email('Enter a valid email').optional(),
        password: z.string().min(6, 'Password must be at least 6 characters').optional(),
        defaultDiscount: z.number().min(0).max(100).optional(),
        loyaltyPoints: z.number().int().min(0).optional(),
    }),
});

/** Admin: change anything about an account, including its role and password. */
export const adminUpdateUserValidation = z.object({
    body: z.object({
        firstName: z.string().trim().min(1).max(50).optional(),
        lastName: z.string().trim().max(50).optional(),
        email: z.string().trim().email('Enter a valid email').optional(),
        phone: z.string().trim().optional(),
        status: statusEnum.optional(),
        isEmailVerified: z.boolean().optional(),
        role: z.enum(ROLES).optional(),
        divisions,
        password: z.string().min(6, 'Password must be at least 6 characters').optional(),
        defaultDiscount: z.number().min(0).max(100).optional(),
        loyaltyPoints: z.number().int().min(0).optional(),
    }),
});

export const updateUserValidation = z.object({
    body: z.object({
        firstName: z.string().min(1).max(50).optional(),
        lastName: z.string().min(1).max(50).optional(),
        phone: z.string().optional(),
        avatar: z.string().url().optional(),
    }),
});

export const addAddressValidation = z.object({
    body: z.object({
        label: z.string().default('Home'),
        fullName: z.string().min(1, 'Full name is required'),
        phone: z.string().min(1, 'Phone is required'),
        address: z.string().min(1, 'Address is required'),
        area: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().optional(),
        isDefault: z.boolean().default(false),
    }),
});

export const updateAddressValidation = z.object({
    body: z.object({
        label: z.string().optional(),
        fullName: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        area: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        isDefault: z.boolean().optional(),
    }),
});

export const updateStatusValidation = z.object({
    body: z.object({
        status: z.enum(['active', 'blocked', 'pending']),
    }),
});
