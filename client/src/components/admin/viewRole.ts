'use client';

// "View as" — lets a super admin or an admin open the panel the way another role sees it
// (menu, dashboard, order buttons), without signing out or touching anyone's account.
//
// It changes what the screens SHOW, nothing else. Every request still goes out with the
// signed-in person's own token, so the server keeps applying their real permissions.
// The choice lives in sessionStorage: it belongs to this browser tab and is gone when the
// tab closes or the person logs out.

import { useCallback, useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { STAFF_ROLES } from './access';

const KEY = 'karmo-view-as';
const EVENT = 'karmo-view-as-change';

/**
 * The dashboards `real` may switch to. A super admin opens every one; an admin opens all
 * but the super admin's — that one carries money pages and role editing the admin does not
 * have, so it is not offered. 'user' is the shopper's own dashboard (a separate area).
 */
export function switchableRoles(real?: string): string[] {
    if (real === 'superadmin') return [...STAFF_ROLES, 'user'];
    if (real === 'admin') return ['admin', 'manager', 'online_sales', 'agency', 'factory', 'user'];
    return [];
}

export const canSwitch = (real?: string): boolean => switchableRoles(real).length > 0;

function read(): string | null {
    try { return sessionStorage.getItem(KEY); } catch { return null; }
}

function subscribe(onChange: () => void) {
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
        window.removeEventListener(EVENT, onChange);
        window.removeEventListener('storage', onChange);
    };
}

/** Switch to a staff role's view, or pass null to go back to your own. */
export function setViewAs(role: string | null) {
    try {
        if (role) sessionStorage.setItem(KEY, role);
        else sessionStorage.removeItem(KEY);
    } catch { /* storage unavailable — the switch simply does not stick */ }
    window.dispatchEvent(new Event(EVENT));
}

/**
 * The role the screens should act as. `role` is the viewed role (your own unless you
 * switched); `realRole` is who you are signed in as. Use `role` for what to show and
 * `realRole` for what you are actually allowed to manage.
 */
export function useViewRole() {
    const realRole = useSelector((s: RootState) => s.auth.user?.role);
    const stored = useSyncExternalStore(subscribe, read, () => null);

    const viewing = !!stored && stored !== realRole && stored !== 'user' && switchableRoles(realRole).includes(stored);
    const role = viewing ? (stored as string) : realRole;

    const reset = useCallback(() => setViewAs(null), []);
    return { realRole, role, viewing, setViewAs, reset };
}
