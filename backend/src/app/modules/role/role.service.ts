import { User } from '../user/user.model';
import AppError from '../../utils/AppError';
import { ALL_PERMISSIONS } from './role.constants';
import { STAFF_ROLES, ROLE_LABEL, canAssignRole, type Role } from '../../constants/roles';

// Lean fields returned for staff listings / role updates.
const STAFF_FIELDS = 'firstName lastName email phone role permissions divisions status avatar createdAt';

type Actor = { userId: string; role: string };

/** Only factory staff carry divisions; everyone else is cleared. */
const divisionsFor = (role: string, divisions?: string[]) => (role === 'factory' ? divisions || [] : []);

const RoleService = {
    // ── List every assignable permission ──
    getPermissions() {
        return ALL_PERMISSIONS;
    },

    // ── Everyone who can sign in to the admin panel ──
    async getStaff() {
        return await User.find({ role: { $in: STAFF_ROLES } })
            .select(STAFF_FIELDS)
            .sort({ createdAt: -1 });
    },

    /**
     * Add a staff account. A super admin may create any staff role; an admin only the
     * roles below it (manager, online sales, agency, factory).
     */
    async createStaff(actor: Actor, payload: {
        firstName: string; lastName?: string; email: string; phone?: string; password: string; role: Role; divisions?: string[];
    }) {
        if (!canAssignRole(actor.role, payload.role)) {
            throw new AppError(403, `You cannot create a ${ROLE_LABEL[payload.role] || payload.role} account`);
        }
        const email = payload.email.trim().toLowerCase();
        if (await User.exists({ email })) throw new AppError(409, 'An account with this email already exists');

        const user = await User.create({
            firstName: payload.firstName.trim(),
            lastName: payload.lastName?.trim() || '.',
            email,
            phone: payload.phone?.trim() || '',
            password: payload.password,
            role: payload.role,
            divisions: divisionsFor(payload.role, payload.divisions),
            status: 'active',
            isEmailVerified: true,
        });
        return await User.findById(user._id).select(STAFF_FIELDS);
    },

    // ── Change someone's role (and a factory member's divisions) ──
    async updateUserRole(
        actor: Actor,
        userId: string,
        payload: { role: string; permissions?: string[]; divisions?: string[] }
    ) {
        if (String(actor.userId) === String(userId) && actor.role !== payload.role) {
            throw new AppError(400, 'You cannot change your own role');
        }
        const user = await User.findById(userId);
        if (!user) throw new AppError(404, 'User not found');

        // Both the current role and the new one must be within the actor's reach — so an
        // admin can neither promote anyone to admin nor touch another admin.
        if (!canAssignRole(actor.role, user.role)) {
            throw new AppError(403, `You cannot change a ${ROLE_LABEL[user.role as Role] || user.role}'s account`);
        }
        if (!canAssignRole(actor.role, payload.role)) {
            throw new AppError(403, `You cannot give the ${ROLE_LABEL[payload.role as Role] || payload.role} role`);
        }
        if (user.role === 'superadmin' && payload.role !== 'superadmin') {
            const others = await User.countDocuments({ role: 'superadmin', _id: { $ne: user._id }, isDeleted: { $ne: true } });
            if (!others) throw new AppError(400, 'This is the last super admin — make someone else super admin first');
        }

        user.role = payload.role as typeof user.role;
        // Permissions only carry meaning for admins; clear them otherwise.
        user.permissions = payload.role === 'admin' ? payload.permissions || user.permissions || [] : [];
        (user as any).divisions = divisionsFor(payload.role, payload.divisions ?? (user as any).divisions);
        await user.save();

        return await User.findById(userId).select(STAFF_FIELDS);
    },
};

export default RoleService;
