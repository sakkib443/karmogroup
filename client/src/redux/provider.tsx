"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrateCart } from './slices/cartSlice';
import { hydrateWishlist } from './slices/wishlistSlice';
import { loginSuccess, logout, sessionRestoreFinished } from './slices/authSlice';
import { API_URL, API_CONFIGURED } from '@/config/api';

interface ReduxProviderProps {
    children: React.ReactNode;
}

/**
 * Restore the signed-in user after a refresh.
 *
 * Redux state is gone on every page load, but the access token survives in
 * localStorage — so without this the app looked logged-out on refresh and
 * bounced the user to /login. Exchange the saved token for the user once on
 * mount; if the token is stale the session is cleared properly instead.
 */
const restoreSession = async () => {
    if (typeof window === 'undefined') return;

    const token = window.localStorage.getItem('token');
    if (!token) {
        store.dispatch(sessionRestoreFinished());
        return;
    }

    if (!API_CONFIGURED) {
        store.dispatch(sessionRestoreFinished());
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Only the server saying "this token is no good" ends a session.
        //
        // This used to treat every failed response the same way and delete the
        // token — the old comment said "unreachable" out loud. So a backend
        // restart, a dropped wifi packet, a 502 from the proxy or a slow cold
        // start on the exact page load that ran this was enough to sign an
        // admin out for good, mid-session, with nothing wrong with their
        // credentials. That is the "logs out by itself after a while" the
        // client reported.
        //
        // 401/403 is the only answer that means the credential is dead.
        // Anything else is the server's problem, not the session's: keep the
        // token and let the next call try again.
        if (res.status === 401 || res.status === 403) {
            window.localStorage.removeItem('token');
            store.dispatch(logout());
            return;
        }
        if (!res.ok) {
            store.dispatch(sessionRestoreFinished());
            return;
        }

        const json = await res.json();
        const u = json?.data;
        if (!u?._id) throw new Error('malformed profile');

        store.dispatch(loginSuccess({
            user: {
                id: u._id,
                name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
                email: u.email,
                phone: u.phone || '',
                role: u.role || 'user',
                avatar: u.avatar || '',
            },
            token,
        }));
    } catch {
        // Reached only when the request never got an answer — offline, DNS,
        // CORS, a connection refused because the API was mid-restart — or when
        // the body came back malformed. None of those say anything about the
        // token, so it stays. The rejection above is the only path that clears
        // it, and it needs the server to have actually said 401 or 403.
        store.dispatch(sessionRestoreFinished());
    }
};

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
    useEffect(() => {
        store.dispatch(hydrateCart());
        store.dispatch(hydrateWishlist());
        restoreSession();
    }, []);

    return <Provider store={store}>{children}</Provider>;
};
