import crypto from 'crypto';
import { User } from './user.model';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';
import AppError from '../../utils/AppError';
import QueryBuilder from '../../utils/QueryBuilder';
import { STAFF_ROLES, ROLE_LABEL, canAssignRole, canManageUser, type Role } from '../../constants/roles';

/** Who is doing an admin action (from req.user). */
export type Actor = { userId: string; role: string };

const NOT_DELETED = { isDeleted: { $ne: true } };
const label = (role: string) => ROLE_LABEL[role as Role] || role;
/** Only factory staff carry divisions; everyone else is cleared. */
const divisionsFor = (role: string, divisions?: string[]) => (role === 'factory' ? divisions || [] : []);

/** The account the actor wants to manage — refused when it is out of their reach. */
async function manageable(actor: Actor, id: string, opts: { selfOk?: boolean } = {}) {
    const user = await User.findById(id);
    if (!user) throw new AppError(404, 'User not found');
    if (!opts.selfOk && String(user._id) === String(actor.userId)) {
        throw new AppError(400, 'You cannot do this to your own account');
    }
    if (String(user._id) !== String(actor.userId) && !canManageUser(actor.role, user.role)) {
        throw new AppError(403, `You cannot manage a ${label(user.role)} account`);
    }
    return user;
}

/** Refuse to take away the last working super admin. */
async function keepOneSuperAdmin(user: { _id: unknown; role: string }) {
    if (user.role !== 'superadmin') return;
    const others = await User.countDocuments({ role: 'superadmin', status: 'active', _id: { $ne: user._id }, ...NOT_DELETED });
    if (!others) throw new AppError(400, 'This is the last super admin — make someone else super admin first');
}

async function assertEmailFree(email: string, exceptId?: unknown) {
    const taken = await User.exists({ email, ...(exceptId ? { _id: { $ne: exceptId } } : {}) });
    if (taken) throw new AppError(409, 'An account with this email already exists');
}

const UserService = {
    // Get all users (admin). `role=staff` = every staff role, `role=customer`/`user` = shoppers, `all`/none = everyone.
    async getAllUsers(query: Record<string, unknown>) {
        const { role, ...rest } = query;
        const where: Record<string, unknown> = {};
        if (role === 'staff') where.role = { $in: STAFF_ROLES };
        else if (role === 'customer' || role === 'user') where.role = 'user';
        else if (role && role !== 'all') where.role = role;

        const userQuery = new QueryBuilder(
            User.find(where).select('-password'),
            rest
        )
            .search(['firstName', 'lastName', 'email', 'phone'])
            .filter()
            .sort()
            .paginate();

        const found = await userQuery.modelQuery;
        const meta = await userQuery.countTotal();

        // Orders placed (not cancelled) and money from delivered orders, for this page of people.
        const ids = found.map((u: any) => u._id);
        const totals = ids.length ? await Order.aggregate([
            { $match: { user: { $in: ids } } },
            {
                $group: {
                    _id: '$user',
                    orderCount: { $sum: { $cond: [{ $ne: ['$status', 'cancelled'] }, 1, 0] } },
                    spent: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$total', 0] } },
                },
            },
        ]) : [];
        const byUser = new Map(totals.map((t: any) => [String(t._id), t]));
        const users = found.map((u: any) => {
            const t = byUser.get(String(u._id));
            return { ...u.toJSON(), orderCount: t?.orderCount || 0, spent: t?.spent || 0 };
        });
        return { users, meta };
    },

    /**
     * Buyers with their orders. Everyone who orders becomes a customer (a guest or phone
     * order makes the account from the phone number), and so does everyone who signs up —
     * this shows who ordered, how often, and who never did.
     *   orders: all | ordered | never | repeat     joined: all | order | signup
     *   sort: recent | orders | spent | last
     */
    async getCustomers(query: Record<string, unknown>) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const match: Record<string, any> = { role: 'user' };
        if (query.status && query.status !== 'all') match.status = String(query.status);
        if (query.search) {
            const rx = new RegExp(String(query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            // The whole name too ("Rahim Uddin"), not just each half.
            const fullName = { $concat: [{ $ifNull: ['$firstName', ''] }, ' ', { $ifNull: ['$lastName', ''] }] };
            match.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }, { phone: rx }, { $expr: { $regexMatch: { input: fullName, regex: rx } } }];
        }
        const after: Record<string, any> = {};
        if (query.orders === 'ordered') after.orders = { $gt: 0 };
        if (query.orders === 'never') after.orders = 0;
        if (query.orders === 'repeat') after.placed = { $gte: 2 };
        if (query.joined === 'order') after.joinedByOrder = true;
        if (query.joined === 'signup') after.joinedByOrder = false;
        const SORTS: Record<string, Record<string, 1 | -1>> = {
            recent: { createdAt: -1 }, orders: { placed: -1, spent: -1 }, spent: { spent: -1 }, last: { lastOrderAt: -1 },
        };
        const sort = SORTS[String(query.sort)] || SORTS.recent;

        const withOrders: any[] = [
            { $match: match },
            {
                $lookup: {
                    from: 'orders', localField: '_id', foreignField: 'user', as: 'o',
                    pipeline: [{ $project: { status: 1, total: 1, createdAt: 1 } }],
                },
            },
            {
                $addFields: {
                    orders: { $size: '$o' },
                    placed: { $size: { $filter: { input: '$o', cond: { $ne: ['$$this.status', 'cancelled'] } } } },
                    delivered: { $size: { $filter: { input: '$o', cond: { $eq: ['$$this.status', 'delivered'] } } } },
                    cancelled: { $size: { $filter: { input: '$o', cond: { $eq: ['$$this.status', 'cancelled'] } } } },
                    spent: { $sum: { $map: { input: { $filter: { input: '$o', cond: { $eq: ['$$this.status', 'delivered'] } } }, in: '$$this.total' } } },
                    firstOrderAt: { $min: '$o.createdAt' },
                    lastOrderAt: { $max: '$o.createdAt' },
                },
            },
            // The account was made by the first order (within ten minutes of it).
            { $addFields: { joinedByOrder: { $and: [{ $ne: ['$firstOrderAt', null] }, { $lte: [{ $subtract: ['$firstOrderAt', '$createdAt'] }, 600000] }] } } },
            { $project: { o: 0, password: 0, passwordResetToken: 0, passwordResetExpires: 0, emailVerificationToken: 0 } },
        ];
        const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
        const [r] = await User.aggregate([
            ...withOrders,
            {
                $facet: {
                    rows: [{ $match: after }, { $sort: { ...sort, _id: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }],
                    total: [{ $match: after }, { $count: 'n' }],
                    stats: [{
                        $group: {
                            _id: null, total: { $sum: 1 },
                            ordered: { $sum: { $cond: [{ $gt: ['$orders', 0] }, 1, 0] } },
                            never: { $sum: { $cond: [{ $eq: ['$orders', 0] }, 1, 0] } },
                            repeat: { $sum: { $cond: [{ $gte: ['$placed', 2] }, 1, 0] } },
                            fromOrders: { $sum: { $cond: ['$joinedByOrder', 1, 0] } },
                            newThisMonth: { $sum: { $cond: [{ $gte: ['$createdAt', monthStart] }, 1, 0] } },
                        },
                    }],
                },
            },
        ]);
        const total = r?.total?.[0]?.n || 0;
        const { _id, ...stats } = r?.stats?.[0] || { total: 0, ordered: 0, never: 0, repeat: 0, fromOrders: 0, newThisMonth: 0 };
        return { customers: r?.rows || [], meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }, stats };
    },

    // Admin stats
    async getAdminStats() {
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const [total, active, blocked, admins, byRole, staffBlocked, cTotal, cActive, cBlocked, cNew, newUsersThisMonth] = await Promise.all([
            User.countDocuments(NOT_DELETED),
            User.countDocuments({ status: 'active', ...NOT_DELETED }),
            User.countDocuments({ status: 'blocked', ...NOT_DELETED }),
            User.countDocuments({ role: 'admin', ...NOT_DELETED }),
            User.aggregate([{ $match: { role: { $in: STAFF_ROLES }, ...NOT_DELETED } }, { $group: { _id: '$role', n: { $sum: 1 } } }]),
            User.countDocuments({ role: { $in: STAFF_ROLES }, status: 'blocked', ...NOT_DELETED }),
            User.countDocuments({ role: 'user', ...NOT_DELETED }),
            User.countDocuments({ role: 'user', status: 'active', ...NOT_DELETED }),
            User.countDocuments({ role: 'user', status: 'blocked', ...NOT_DELETED }),
            User.countDocuments({ role: 'user', createdAt: { $gte: monthStart }, ...NOT_DELETED }),
            User.countDocuments({ createdAt: { $gte: monthStart }, ...NOT_DELETED }),
        ]);

        // Staff per role, for the Users page's tiles.
        const staff: Record<string, number> = { total: 0, blocked: staffBlocked };
        for (const r of STAFF_ROLES) staff[r] = 0;
        for (const r of byRole as { _id: string; n: number }[]) {
            staff[r._id] = r.n;
            staff.total += r.n;
        }

        return {
            total, active, blocked, admins, users: total - staff.total, newUsersThisMonth, staff,
            customers: { total: cTotal, active: cActive, blocked: cBlocked, newThisMonth: cNew },
        };
    },

    // The one customer on file for an exact mobile number, or null — for "New order".
    async lookupCustomer(phone: string) {
        const p = String(phone || '').trim();
        if (p.length < 6) return null;
        return await User.findOne({ phone: p, role: 'user' }).select('firstName lastName email phone shippingAddresses defaultDiscount loyaltyPoints');
    },

    /** Admin: add any account. A super admin may give any role; an admin customers and the roles below admin. */
    async adminCreateUser(actor: Actor, payload: {
        firstName: string; lastName?: string; email: string; phone?: string; password: string;
        role: Role; divisions?: string[]; status?: 'active' | 'blocked' | 'pending';
    }) {
        if (!canAssignRole(actor.role, payload.role)) {
            throw new AppError(403, `You cannot create a ${label(payload.role)} account`);
        }
        const email = payload.email.trim().toLowerCase();
        await assertEmailFree(email);

        const user = await User.create({
            firstName: payload.firstName.trim(),
            lastName: payload.lastName?.trim() || '.',
            email,
            phone: payload.phone?.trim() || '',
            password: payload.password,
            role: payload.role,
            divisions: divisionsFor(payload.role, payload.divisions),
            status: payload.status || 'active',
            isEmailVerified: true,
        });
        return await User.findById(user._id);
    },

    /** Admin: a buyer taken by phone. Without an email they get a placeholder one and a random password. */
    async adminCreateCustomer(payload: {
        firstName: string; lastName?: string; phone: string; email?: string; password?: string;
        defaultDiscount?: number; loyaltyPoints?: number;
    }) {
        const phone = payload.phone.trim();
        if (await User.exists({ phone, role: 'user' })) throw new AppError(409, 'A customer with this phone number already exists');
        const email = (payload.email?.trim() || `${phone.replace(/\D/g, '')}@phone.karmo.local`).toLowerCase();
        await assertEmailFree(email);

        const user = await User.create({
            firstName: payload.firstName.trim(),
            lastName: payload.lastName?.trim() || '.',
            email,
            phone,
            password: payload.password || crypto.randomBytes(12).toString('hex'),
            role: 'user',
            status: 'active',
            defaultDiscount: payload.defaultDiscount ?? 0,
            loyaltyPoints: payload.loyaltyPoints ?? 0,
        });
        return await User.findById(user._id);
    },

    // Get single user
    async getUserById(id: string) {
        const user = await User.findById(id);
        if (!user) throw new AppError(404, 'User not found');
        return user;
    },

    // Get my profile
    async getMyProfile(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');
        return user;
    },

    // Update my profile
    async updateMyProfile(userId: string, payload: any) {
        // If password change is requested
        if (payload.currentPassword && payload.password) {
            const user = await User.findById(userId).select('+password');
            if (!user) throw new AppError(404, 'User not found');

            const isMatch = await user.comparePassword(payload.currentPassword);
            if (!isMatch) throw new AppError(400, 'Current password is incorrect');

            user.password = payload.password;
            await user.save();
            return user;
        }

        // Normal profile update
        const allowedFields: Record<string, any> = {};
        const allowed = ['firstName', 'lastName', 'phone', 'avatar', 'coverImage', 'name'];
        for (const key of allowed) {
            if (payload[key] !== undefined) {
                // Map 'name' to firstName/lastName
                if (key === 'name' && typeof payload.name === 'string') {
                    const parts = payload.name.trim().split(' ');
                    allowedFields.firstName = parts[0];
                    allowedFields.lastName = parts.slice(1).join(' ') || '';
                } else {
                    allowedFields[key] = payload[key];
                }
            }
        }

        const user = await User.findByIdAndUpdate(userId, allowedFields, { new: true, runValidators: true });
        if (!user) throw new AppError(404, 'User not found');
        return user;
    },

    /**
     * Admin: change an account — details, status, role, divisions, password.
     * The account (its current role and any new one) must be within the actor's reach:
     * an admin never touches another admin or a super admin, nor makes anyone one.
     * Nobody changes their own role or status here (no locking yourself out).
     */
    async adminUpdateUser(actor: Actor, id: string, payload: any) {
        // A manager may correct a customer's details and set a new password — not their
        // role or status, and nobody else's account.
        if (actor.role === 'manager' && String(id) !== String(actor.userId)) {
            const target = await User.findById(id).select('role');
            if (!target) throw new AppError(404, 'User not found');
            if (target.role !== 'user') throw new AppError(403, `You cannot manage a ${label(target.role)} account`);
            if (payload.role !== undefined || payload.status !== undefined) throw new AppError(403, 'Only an admin can change a role or block an account');
        }
        const user: any = actor.role === 'manager' && String(id) !== String(actor.userId)
            ? await User.findById(id)
            : await manageable(actor, id, { selfOk: true });
        const isSelf = String(user._id) === String(actor.userId);

        for (const key of ['firstName', 'lastName', 'phone', 'isEmailVerified', 'defaultDiscount', 'loyaltyPoints']) {
            if (payload[key] !== undefined) user[key] = typeof payload[key] === 'string' ? payload[key].trim() : payload[key];
        }
        if (payload.lastName !== undefined && !String(payload.lastName).trim()) user.lastName = '.';

        if (payload.email !== undefined) {
            const email = String(payload.email).trim().toLowerCase();
            if (email !== user.email) {
                await assertEmailFree(email, user._id);
                user.email = email;
            }
        }

        if (payload.status !== undefined && payload.status !== user.status) {
            if (isSelf) throw new AppError(400, 'You cannot change the status of your own account');
            if (payload.status !== 'active') await keepOneSuperAdmin(user);
            user.status = payload.status;
        }

        if (payload.role !== undefined && payload.role !== user.role) {
            if (isSelf) throw new AppError(400, 'You cannot change your own role');
            if (!canAssignRole(actor.role, payload.role)) throw new AppError(403, `You cannot give the ${label(payload.role)} role`);
            await keepOneSuperAdmin(user);
            user.role = payload.role;
            // Permissions only mean something for admins.
            if (payload.role !== 'admin') user.permissions = [];
        }
        if (payload.role !== undefined || payload.divisions !== undefined) {
            user.divisions = divisionsFor(user.role, payload.divisions ?? user.divisions);
        }

        // A new password from an admin (the person can change it again from their profile).
        if (payload.password) user.password = payload.password;

        await user.save();
        return await User.findById(user._id);
    },

    // Get my addresses
    async getMyAddresses(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');
        return user.shippingAddresses;
    },

    // Add shipping address
    async addShippingAddress(userId: string, address: any) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');

        // If new address is default, remove default from others
        if (address.isDefault) {
            user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
        }

        // Map 'zipCode' to 'postalCode' if sent from frontend
        if (address.zipCode && !address.postalCode) {
            address.postalCode = address.zipCode;
        }

        user.shippingAddresses.push(address);
        await user.save();
        return user.shippingAddresses;
    },

    // Update shipping address
    async updateShippingAddress(userId: string, addressId: string, payload: any) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');

        const address = (user.shippingAddresses as any).id(addressId);
        if (!address) throw new AppError(404, 'Address not found');

        if (payload.isDefault) {
            user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
        }

        // Map zipCode to postalCode
        if (payload.zipCode && !payload.postalCode) {
            payload.postalCode = payload.zipCode;
        }

        Object.assign(address, payload);
        await user.save();
        return user.shippingAddresses;
    },

    // Delete shipping address
    async deleteShippingAddress(userId: string, addressId: string) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');
        user.shippingAddresses = user.shippingAddresses.filter(
            (addr: any) => addr._id?.toString() !== addressId
        );
        await user.save();
        return user.shippingAddresses;
    },

    // Get wishlist (populated with products)
    async getWishlist(userId: string) {
        const user = await User.findById(userId).populate({
            path: 'wishlist',
            // Use the real Product field names (thumbnail/originalPrice/rating/reviewCount)
            // so the wishlist page can render image, price + rating correctly.
            select: 'name slug thumbnail images price originalPrice discount stock rating reviewCount',
            match: { isDeleted: false },
        });
        if (!user) throw new AppError(404, 'User not found');
        return user.wishlist;
    },

    // Toggle wishlist
    async toggleWishlist(userId: string, productId: string) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');

        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(index, 1);
        }
        await user.save();
        return { wishlist: user.wishlist, added: index === -1 };
    },

    // Get a user's wishlist publicly (read-only share). Exposes only product data.
    async getSharedWishlist(userId: string) {
        const user = await User.findById(userId)
            .select('wishlist firstName lastName')
            .populate({
                path: 'wishlist',
                // Real Product field names (thumbnail/originalPrice/rating/reviewCount).
                select: 'name slug thumbnail images price originalPrice discount stock rating reviewCount',
                match: { isDeleted: false },
            });
        if (!user) throw new AppError(404, 'Wishlist not found');
        return user.wishlist;
    },

    // Merge a guest's local wishlist into the logged-in user's wishlist (no duplicates)
    async mergeWishlist(userId: string, productIds: string[]) {
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');

        const existing = new Set(user.wishlist.map((id) => id.toString()));
        for (const productId of productIds) {
            if (!existing.has(productId)) {
                user.wishlist.push(productId);
                existing.add(productId);
            }
        }
        await user.save();

        return await this.getWishlist(userId);
    },

    // Admin: block / unblock / mark pending
    async updateUserStatus(actor: Actor, id: string, status: 'active' | 'blocked' | 'pending') {
        const user = await manageable(actor, id);
        if (status !== 'active') await keepOneSuperAdmin(user);
        user.status = status;
        await user.save();
        return user;
    },

    /**
     * Admin: delete an account. It is soft-deleted — orders keep their customer — and its
     * email is set aside (deleted.<time>.<email>) so the same email can sign up again.
     */
    async deleteUser(actor: Actor, id: string) {
        const user = await manageable(actor, id);
        await keepOneSuperAdmin(user);
        await User.updateOne(
            { _id: user._id },
            { $set: { isDeleted: true, status: 'blocked', email: `deleted.${Date.now()}.${user.email}` } },
        );
        return { _id: user._id, email: user.email };
    },
};

export default UserService;
