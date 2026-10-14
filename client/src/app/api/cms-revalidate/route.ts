import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { API_URL } from '@/config/api';

/**
 * Called by Admin → Site content right after Publish, so the live site shows the new
 * content at once instead of within the minute. Only signed-in super admins / admins.
 */
export async function POST(req: Request) {
    const auth = req.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ') || !API_URL) return NextResponse.json({ ok: false }, { status: 401 });

    const me = await fetch(`${API_URL}/users/me`, { headers: { authorization: auth }, cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    const role = me?.data?.role;
    if (role !== 'superadmin' && role !== 'admin') return NextResponse.json({ ok: false }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const page = String(body?.page || '').replace(/[^a-z0-9-]/g, '');
    // expire: 0 — the very next visit gets the new content, not one more stale copy.
    if (page) revalidateTag(`cms-${page}`, { expire: 0 });
    // Brand & contact sit in the layout of every page.
    if (page === 'global') revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, page });
}
