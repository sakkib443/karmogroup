/**
 * One demo account per role, so every dashboard can be tried straight away.
 * The password of each is its email (temporary — change them before going live).
 *
 *   node scripts/seed-demo-users.js          (uses DATABASE_URL from backend/.env)
 *
 * Safe to run again: existing accounts get their role, password and status reset.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ACCOUNTS = [
    { email: 'superadmin@gmail.com', role: 'superadmin', firstName: 'Super', lastName: 'Admin' },
    { email: 'admin@gmail.com', role: 'admin', firstName: 'Karmo', lastName: 'Admin' },
    { email: 'manager@gmail.com', role: 'manager', firstName: 'Karmo', lastName: 'Manager' },
    { email: 'salesman@gmail.com', role: 'online_sales', firstName: 'Online', lastName: 'Sales' },
    { email: 'agency@gmail.com', role: 'agency', firstName: 'Call', lastName: 'Agency' },
    { email: 'factory@gmail.com', role: 'factory', firstName: 'Factory', lastName: 'Member' },
    { email: 'customer@gmail.com', role: 'user', firstName: 'Demo', lastName: 'Customer' },
];

(async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set in backend/.env');
    await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 15000 });
    const users = mongoose.connection.collection('users');
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const now = new Date();

    for (const a of ACCOUNTS) {
        const hash = await bcrypt.hash(a.email, rounds);
        const res = await users.updateOne(
            { email: a.email },
            {
                $set: {
                    email: a.email, password: hash, role: a.role,
                    firstName: a.firstName, lastName: a.lastName,
                    status: 'active', isEmailVerified: true, isDeleted: false,
                    permissions: [], divisions: [], updatedAt: now,
                },
                $setOnInsert: { phone: '', avatar: '', shippingAddresses: [], wishlist: [], totalOrders: 0, totalSpent: 0, createdAt: now },
            },
            { upsert: true }
        );
        console.log(`${res.upsertedCount ? 'created' : 'updated'}  ${a.role.padEnd(12)} ${a.email}`);
    }
    await mongoose.disconnect();
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
