import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { API_URL, API_CONFIGURED } from '@/config/api';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Wrapper that handles 401 → auto logout
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    // A build with no NEXT_PUBLIC_API_URL has nowhere to send this. Fail here
    // rather than let it out of the browser: with an empty baseUrl every call
    // would go to the site's own origin and 404, and with the old
    // localhost:5000 fallback it went to the *visitor's* machine and made
    // Chrome ask each of them for permission. See src/config/api.ts.
    if (!API_CONFIGURED) {
        return { error: { status: 'CUSTOM_ERROR', error: 'No API configured (NEXT_PUBLIC_API_URL is unset)' } };
    }

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Only a session that exists can expire.
        //
        // This used to fire on *any* 401, which is not the same thing. A
        // visitor who never signed in has no session to lose, and 401 from an
        // endpoint that happens to require auth is the normal answer for them
        // — not an expiry. `FloatingContact` sits in the root layout and calls
        // `/site-content` on every page; the backend answers that call 401,
        // so every page load threw an anonymous visitor to
        // `/login?expired=true`. Opening the site went to the login page, and
        // so did clicking any menu item.
        //
        // Checking for a token first keeps the real behaviour — a stale token
        // still logs out and redirects — without inventing a session for
        // someone who never had one.
        const hadSession = Boolean(
            (api.getState() as RootState).auth.token ||
            (typeof window !== 'undefined' && localStorage.getItem('token'))
        );

        if (hadSession) {
            api.dispatch(logout());
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login')) {
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&expired=true`;
                }
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Stats', 'Orders', 'Products', 'Users', 'Analytics', 'PageContent', 'SiteContent', 'Categories', 'Payments', 'Shipping', 'Coupons', 'Reviews', 'Offers', 'Roles', 'Invoices', 'Returns', 'Notifications', 'Newsletter'],
    endpoints: () => ({}),
});
