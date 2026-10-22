import { store } from '@/redux/store';
import { API_URL } from '@/config/api';

export type OrdersExportParams = Record<string, string | number | undefined | null>;

/**
 * Download the orders the filters match — all of them, not one screenful — as an Excel
 * file. Same auth as baseApi (Bearer token from redux, else localStorage). Resolves with
 * the number of orders in the file, or 0 when nothing matched (then nothing is saved).
 * Throws on a failed request so the caller can toast.
 */
export async function downloadOrdersExcel(params: OrdersExportParams, title: string, fileLabel: string): Promise<number> {
    if (typeof window === 'undefined' || typeof document === 'undefined') return 0;

    const token = store.getState().auth.token || localStorage.getItem('token');

    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, title })) {
        if (v !== undefined && v !== null && String(v).trim() !== '') qs.set(k, String(v));
    }

    const headers: Record<string, string> = {};
    if (token) headers['authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/orders/admin/export?${qs}`, { method: 'GET', headers });
    if (!res.ok) {
        let message = `Could not prepare the file (status ${res.status})`;
        try { message = (await res.json())?.message || message; } catch { /* not JSON */ }
        throw new Error(message);
    }

    const count = Number(res.headers.get('X-Order-Count') ?? NaN);
    if (count === 0) return 0;

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Karmo-Orders-${fileLabel}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return Number.isFinite(count) ? count : -1;
}
