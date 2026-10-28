import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import config from '../../config';

/**
 * The Coolify database is only reachable inside that server, so these two
 * accounts are created on startup from the app's own DATABASE_URL.
 * The password is the email, at the owner's request. An account that already
 * exists is left untouched, so a later password change is not overwritten.
 */
const ACCOUNTS = [
    { email: 'admin@gmail.com', role: 'admin', firstName: 'Karmo', lastName: 'Admin' },
    { email: 'superadmin@gmail.com', role: 'superadmin', firstName: 'Super', lastName: 'Admin' },
] as const;

export async function ensureStaffAccounts(): Promise<void> {
    const users = mongoose.connection.collection('users');
    const now = new Date();

    for (const account of ACCOUNTS) {
        const existing = await users.findOne({ email: account.email }, { projection: { _id: 1 } });
        if (existing) continue;

        const password = await bcrypt.hash(account.email, config.bcrypt_salt_rounds);
        await users.insertOne({
            email: account.email,
            password,
            role: account.role,
            firstName: account.firstName,
            lastName: account.lastName,
            phone: '',
            avatar: '',
            status: 'active',
            isEmailVerified: true,
            isDeleted: false,
            permissions: [],
            divisions: [],
            shippingAddresses: [],
            wishlist: [],
            totalOrders: 0,
            totalSpent: 0,
            createdAt: now,
            updatedAt: now,
        });
        console.log(`✅ Staff account created: ${account.role} ${account.email}`);
    }
}
