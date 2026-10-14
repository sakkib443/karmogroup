import { z } from 'zod';
import { ALL_PERMISSIONS } from './role.constants';
import { ROLES, STAFF_ROLES, DIVISIONS } from '../../constants/roles';

const divisions = z.array(z.enum(DIVISIONS.map((d) => d.key) as [string, ...string[]])).optional();

export const updateUserRoleValidation = z.object({
    body: z.object({
        role: z.enum(ROLES),
        permissions: z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).optional().default([]),
        divisions,
    }),
});

export const createStaffValidation = z.object({
    body: z.object({
        firstName: z.string().trim().min(1, 'First name is required').max(50),
        lastName: z.string().trim().max(50).optional(),
        email: z.string().trim().email('Enter a valid email'),
        phone: z.string().trim().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(STAFF_ROLES as [string, ...string[]]),
        divisions,
    }),
});
