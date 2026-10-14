/**
 * Karmo's roles. Staff roles open the admin panel; `user` is a shopper.
 * What each one may do is written up in docs/USER-ROLES.md — keep the two in step.
 *
 *   superadmin    owner — everything
 *   admin         runs the shop; no staff/roles, no money pages
 *   manager       operations lead; orders, products (no delete), customers, reports
 *   online_sales  after confirmation: challans, memo, courier, returns
 *   agency        call centre: confirms or cancels pending orders, sends the SMS
 *   factory       scans the products out and issues each challan once
 *   user          customer
 */
export const ROLES = ['superadmin', 'admin', 'manager', 'online_sales', 'agency', 'factory', 'user'] as const;
export type Role = (typeof ROLES)[number];

export const STAFF_ROLES: Role[] = ['superadmin', 'admin', 'manager', 'online_sales', 'agency', 'factory'];

export const ROLE_LABEL: Record<Role, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    online_sales: 'Online Sales',
    agency: 'Agency',
    factory: 'Factory',
    user: 'Customer',
};

export const isStaffRole = (role?: string): boolean => STAFF_ROLES.includes(role as Role);

/** Staff roles an admin may hand out. A super admin may hand out every staff role. */
export const ADMIN_ASSIGNABLE: Role[] = ['manager', 'online_sales', 'agency', 'factory'];

/** May `actor` give (or take away) `role`? */
export const canAssignRole = (actor: string | undefined, role: string): boolean => {
    if (actor === 'superadmin') return ROLES.includes(role as Role);
    if (actor === 'admin') return ADMIN_ASSIGNABLE.includes(role as Role) || role === 'user';
    return false;
};

/**
 * May `actor` manage (edit, reset the password of, block, delete) someone who has
 * `targetRole`? The super admin manages everyone; an admin manages customers and the
 * staff below admin — never another admin or a super admin.
 */
export const canManageUser = (actor: string | undefined, targetRole: string): boolean =>
    canAssignRole(actor, targetRole);

/**
 * Route groups for authorizeRoles(). The super admin always passes, so it is never listed.
 */
export const R = {
    admin: ['admin'] as Role[],
    ops: ['admin', 'manager'] as Role[],
    orderDesk: ['admin', 'manager', 'online_sales'] as Role[],
    confirmers: ['admin', 'manager', 'online_sales', 'agency'] as Role[],
    orderViewers: ['admin', 'manager', 'online_sales', 'agency', 'factory'] as Role[],
    scanners: ['admin', 'factory'] as Role[],
    challanIssuers: ['admin', 'online_sales', 'factory'] as Role[],
};

/**
 * The factory divisions and their challan prefixes (M1000, H1000…). Product lines carry
 * a division key; a factory member may be limited to some of them.
 */
export const DIVISIONS: { key: string; label: string; prefix: string }[] = [
    { key: 'foam', label: 'FOAM', prefix: 'F' },
    { key: 'mattress', label: 'MATTRESS', prefix: 'M' },
    { key: 'fiber_pillow', label: 'FIBER PILLOW', prefix: 'P' },
    { key: 'hometex', label: 'HOMETEX', prefix: 'H' },
    { key: 'chemicals', label: 'CHEMICALS', prefix: 'C' },
];
export const GENERAL_DIVISION = { key: 'general', label: 'GENERAL', prefix: 'G' };

/** "Fiber Pillow" / "pillow" → "fiber_pillow"; blank → "general". */
export const divisionOf = (v: unknown): string => {
    const k = String(v || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (k === 'pillow') return 'fiber_pillow';
    return k || GENERAL_DIVISION.key;
};

export const divisionMeta = (key: string) =>
    DIVISIONS.find((d) => d.key === key) || { ...GENERAL_DIVISION, key };
