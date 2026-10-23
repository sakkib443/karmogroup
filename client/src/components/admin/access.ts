// Who may open which admin page, and which order actions each role gets. The server
// enforces the same rules (backend constants/roles.ts + modules/order/order.desk.ts);
// this keeps the menu, the pages and the buttons in step with it.
// The plain-language version is docs/USER-ROLES.md.
//
//   superadmin    owner — everything
//   admin         runs the shop; no money pages (Accounts, Courier payouts), no Roles
//   manager       operations lead: orders, products (no delete), customers, reports
//   online_sales  after confirmation: challans, memo, courier, returns
//   agency        call centre: confirms / cancels pending orders, sends the SMS
//   factory       scans products out of the factory, issues each challan once

export type StaffRole = 'superadmin' | 'admin' | 'manager' | 'online_sales' | 'agency' | 'factory';

export const STAFF_ROLES: StaffRole[] = ['superadmin', 'admin', 'manager', 'online_sales', 'agency', 'factory'];

export const ADMIN_ROOT = '/dashboard/admin';

export const ROLE_LABEL: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    online_sales: 'Online Sales',
    agency: 'Agency',
    factory: 'Factory',
    user: 'Customer',
};

/** One line per role, for staff screens. */
export const ROLE_HINT: Record<StaffRole, string> = {
    superadmin: 'Everything, including money, roles, adding super admins and deleting users.',
    admin: 'Runs the shop; adds, edits, blocks and deletes customers and staff below admin. No money pages, no roles.',
    manager: 'Operations lead: the whole order flow, products (no delete), customers, reviews and reports.',
    online_sales: 'After an order is confirmed: challans and memo, courier booking, returns.',
    agency: 'Calls new customers: confirms or cancels pending orders and sends the SMS. Nothing else.',
    factory: 'Scans confirmed orders out of the factory and issues each challan once. Sees no prices.',
};

/** What each role can do, as a short list for the Roles page. */
export const ROLE_ACCESS: Record<StaffRole, string[]> = {
    superadmin: [
        'Everything in the admin panel',
        'Money: Accounts overview, Courier payouts',
        'Users: add, edit, reset the password of, block and delete anyone (other super admins too)',
        'Roles & permissions',
        'Duplicate challans and memos',
    ],
    admin: [
        'The whole order flow, products (with delete), approvals, coupons, customers',
        'Payments and refunds, store and shipping settings, site content, career',
        'Users: add, edit, reset the password of, block and delete customers, managers, online sales, agency and factory members',
        'Duplicate challans and memos, with a reason',
        'Not: Accounts overview, Courier payouts, Roles; cannot touch other admins or super admins',
    ],
    manager: [
        'Orders: add by hand (phone / walk-in), confirm, cancel, the whole flow to delivery, returns, courier, SMS',
        'Products: add and edit (no delete), reviews, inquiries, fraud check',
        'Customers, sales reports, staff activity',
        'Not: settings, coupons, payments, refunds, staff, money pages',
    ],
    online_sales: [
        'Every order (with prices); confirm or cancel pending ones as a backup to the agency',
        'Add orders by hand (phone / walk-in) and confirm them',
        'View every challan and memo; issue the memo once',
        'Courier: book with Pathao / Steadfast, follow parcels, receive returns',
        'Inquiries, fraud check, SMS',
        'Not: products, customers list, payments, reports, settings',
    ],
    agency: [
        'Pending orders only: call the customer, then Confirm or Cancel (with a reason)',
        'Send SMS to the customer in one click',
        'Their own confirmations and cancellations for today',
        'Nothing else — no other menu, no exports',
    ],
    factory: [
        'Confirmed orders of their divisions — names, sizes and quantities, no prices',
        'Factory scan station: scan each product once',
        'Issue each challan once, after every piece is scanned',
        'Not: pending orders, money, courier, any other menu, duplicates',
    ],
};

/* ─── Pages ──────────────────────────────────────────────── */

/** Pages only the super admin opens. */
const SUPERADMIN_ONLY = ['/accounts', '/investors', '/suppliers', '/purchases', '/marketing', '/roles'];

/** Everything each role below admin may open (and nothing else). '/' is the Dashboard. */
const ROLE_PAGES: Record<string, string[]> = {
    manager: ['/', '/orders', '/order-insights', '/returns', '/courier', '/fraud-check', '/sms', '/products', '/reviews', '/customers', '/inquiries', '/analytics', '/staff-activity', '/payments', '/notifications', '/profile'],
    online_sales: ['/', '/orders', '/returns', '/courier', '/fraud-check', '/sms', '/inquiries', '/notifications', '/profile'],
    agency: ['/', '/orders', '/sms', '/notifications', '/profile'],
    factory: ['/', '/orders', '/factory', '/notifications', '/profile'],
};
/** …except these, inside their pages. */
const ROLE_BLOCKED: Record<string, string[]> = {
    manager: ['/products/moderation'],
    agency: ['/orders/new'],
    factory: ['/orders/new'],
};

/** Works in the admin panel (as opposed to a shopper). */
export const isStaffRole = (role?: string): boolean => STAFF_ROLES.includes(role as StaffRole);

/** Where each role lands in the admin panel: the Dashboard, which differs by role. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const homeFor = (_role?: string): string => ADMIN_ROOT;

const under = (path: string, prefixes: string[]) =>
    prefixes.some((p) => (p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`)));

/** May this role open this admin path? (path = full pathname, e.g. /dashboard/admin/orders/123) */
export function canOpen(role: string | undefined, pathname: string): boolean {
    if (role === 'superadmin') return true;
    if (!pathname.startsWith(ADMIN_ROOT)) return true;
    const rel = pathname.slice(ADMIN_ROOT.length) || '/';
    if (role === 'admin') return !under(rel, SUPERADMIN_ONLY);
    const pages = role ? ROLE_PAGES[role] : undefined;
    if (!pages) return false;
    return under(rel, pages) && !under(rel, ROLE_BLOCKED[role!] || []);
}

/* ─── Managing accounts ──────────────────────────────────── */

/** Every role an account can have, staff first, then the customer. */
export const ALL_ROLES = [...STAFF_ROLES, 'user'] as const;

/**
 * Roles `me` may give — and so the accounts `me` may manage (edit, reset the password,
 * block, delete). The super admin: everyone. An admin: customers and the staff below
 * admin. Mirrors backend constants/roles.ts (canAssignRole / canManageUser).
 */
export const assignableRoles = (me?: string): string[] =>
    me === 'superadmin' ? [...ALL_ROLES]
        : me === 'admin' ? ['manager', 'online_sales', 'agency', 'factory', 'user']
            : [];

export const canManageUser = (me: string | undefined, targetRole?: string): boolean =>
    !!targetRole && assignableRoles(me).includes(targetRole);

/* ─── Order actions ──────────────────────────────────────── */

const ACTIONS = {
    confirm: ['superadmin', 'admin', 'manager', 'online_sales', 'agency'],
    sms: ['superadmin', 'admin', 'manager', 'online_sales', 'agency'],
    note: ['superadmin', 'admin', 'manager', 'online_sales', 'agency', 'factory'],
    editOrder: ['superadmin', 'admin', 'manager'],
    createOrder: ['superadmin', 'admin', 'manager', 'online_sales'],
    scan: ['superadmin', 'admin', 'factory'],
    issueChallan: ['superadmin', 'admin', 'online_sales', 'factory'],
    issueMemo: ['superadmin', 'admin', 'manager', 'online_sales'],
    viewPapers: ['superadmin', 'admin', 'manager', 'online_sales', 'factory'],
    reprint: ['superadmin', 'admin'],
    courier: ['superadmin', 'admin', 'manager', 'online_sales'],
    payment: ['superadmin', 'admin'],
    export: ['superadmin', 'admin', 'manager'],
    seeMoney: ['superadmin', 'admin', 'manager', 'online_sales', 'agency'],
    seeCost: ['superadmin', 'admin'],
    bulkStatus: ['superadmin', 'admin', 'manager'],
} as const;

export type OrderAction = keyof typeof ACTIONS;

/** May this role do this to orders? Mirrors the server. */
export const can = (role: string | undefined, action: OrderAction): boolean =>
    !!role && (ACTIONS[action] as readonly string[]).includes(role);

const STEPS: Record<string, Record<string, string[]>> = {
    agency: { pending: ['confirmed', 'cancelled'] },
    online_sales: {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['pending', 'cancelled'],
        challan_ready: ['courier_entry'],
        courier_entry: ['challan_ready', 'shipped'],
        shipped: ['delivered', 'returned'],
    },
};

/** The statuses this role may move an order to from `from` (the server checks again). */
export function nextStatuses(role: string | undefined, from: string, all: string[]): string[] {
    if (!role) return [];
    if (role === 'superadmin' || role === 'admin') return all.filter((s) => s !== from);
    if (role === 'manager') return all.filter((s) => s !== from && s !== 'refunded');
    return STEPS[role]?.[from] || [];
}
