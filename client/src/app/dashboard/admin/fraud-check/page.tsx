"use client";

/**
 * Fraud check — look up any phone number, and see every customer who refused a parcel or
 * cancelled; "Order open now" are the ones to call before confirming. Worked out live from
 * the orders (GET /api/fraud). Super admin, admin, manager, online sales.
 * Links in: ?q=<phone> opens that number's history (the order page's warning uses it).
 */
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LuSearch, LuShieldAlert, LuPackageX, LuBan, LuClock, LuArrowUpRight, LuX } from 'react-icons/lu';
import PageGuide from '@/components/admin/PageGuide';
import { PageHeader, Segmented, Badge, Pager, taka, cx, fmtDate, type Tone } from '@/components/admin/ui';
import { getStatusConfig } from '@/lib/orderStatus';
import { useGetFraudCustomersQuery, useLookupFraudHistoryQuery, type FraudRisk, type FraudTab, type IFraudCustomer } from '@/redux/api/fraudApi';

const ORDERS = '/dashboard/admin/orders';
const RISK: Record<FraudRisk, { label: string; tone: Tone }> = {
    high: { label: 'High risk', tone: 'red' },
    medium: { label: 'Medium', tone: 'amber' },
    low: { label: 'Low', tone: 'gray' },
    none: { label: 'Safe', tone: 'green' },
};
const TABS: { value: FraudTab; label: string }[] = [
    { value: 'open', label: 'Order open now' },
    { value: 'high', label: 'High risk' },
    { value: 'refused', label: 'Not taken' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'all', label: 'All' },
];
const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');

function Kpi({ label, value, icon, tone, onClick, active }: { label: string; value: React.ReactNode; icon: React.ReactNode; tone: string; onClick: () => void; active: boolean }) {
    return (
        <button type="button" onClick={onClick}
            className={cx('flex items-center gap-3 rounded-2xl border bg-white p-4 text-left transition',
                active ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.12)]' : 'border-gray-200 hover:border-gray-300')}>
            <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}>{icon}</span>
            <span>
                <span className="block text-2xl font-semibold leading-none tabular-nums text-gray-900">{value}</span>
                <span className="mt-1 block text-xs text-gray-500">{label}</span>
            </span>
        </button>
    );
}

/** Delivered / not taken / cancelled as one small bar. */
function Track({ c }: { c: Pick<IFraudCustomer, 'delivered' | 'refused' | 'cancelled'> }) {
    const total = Math.max(1, c.delivered + c.refused + c.cancelled);
    return (
        <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
            <div className="bg-emerald-500" style={{ width: `${(c.delivered / total) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(c.refused / total) * 100}%` }} />
            <div className="bg-gray-400" style={{ width: `${(c.cancelled / total) * 100}%` }} />
        </div>
    );
}

/** One number's history, under the search box. */
function Lookup({ q, onClose }: { q: string; onClose: () => void }) {
    const { data, isFetching, isError, error } = useLookupFraudHistoryQuery(q);
    const h = data?.data;
    const msg = (error as { data?: { message?: string } })?.data?.message;
    return (
        <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="font-mono text-sm text-gray-500">{q}</p>
                    <h2 className="text-lg font-semibold text-gray-900">{isFetching ? 'Checking…' : h ? (h.name || 'Customer') : isError ? (msg || 'Could not check') : 'No orders from this number'}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {h && <Badge tone={RISK[h.risk].tone}>{RISK[h.risk].label}</Badge>}
                    <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"><LuX size={16} /></button>
                </div>
            </div>
            {h && (
                <>
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {[
                            ['Orders', h.orders, 'text-gray-900'],
                            ['Delivered', h.delivered, 'text-emerald-600'],
                            ['Not taken', h.refused, 'text-red-600'],
                            ['Cancelled', h.cancelled, 'text-gray-600'],
                            ['Success', h.success === null ? '—' : `${h.success}%`, 'text-gray-900'],
                        ].map(([label, v, tone]) => (
                            <div key={label as string} className="rounded-xl bg-gray-50 px-3 py-2.5">
                                <p className={cx('text-xl font-semibold tabular-nums', tone as string)}>{v}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {h.recent.map((o) => {
                            const st = getStatusConfig(o.status);
                            return (
                                <li key={o._id} className="flex items-center gap-3 py-2 text-sm">
                                    <Link href={`${ORDERS}/${o._id}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{o.orderId}</Link>
                                    <span className="text-xs text-gray-400">{fmtDate(o.createdAt)}</span>
                                    <span className="min-w-0 flex-1 truncate text-xs text-gray-500">{o.reason}</span>
                                    {o.refused ? <Badge tone="red">Not taken</Badge> : <span className={cx('rounded-full px-2 py-0.5 text-xs font-semibold', st.badgeBg, st.badgeText)}>{st.label}</span>}
                                    <span className="w-20 text-right tabular-nums text-gray-700">{taka(o.total)}</span>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </section>
    );
}

export default function FraudCheckPage() {
    return (
        <Suspense fallback={null}>
            <FraudCheck />
        </Suspense>
    );
}

function FraudCheck() {
    const params = useSearchParams();
    const [lookup, setLookup] = useState(params.get('q') || '');
    const [typed, setTyped] = useState(params.get('q') || '');
    const [tab, setTab] = useState<FraudTab>('open');
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useGetFraudCustomersQuery({ tab, page, limit: 20 });
    const list = data?.data?.list || [];
    const s = data?.data?.summary;
    const meta = data?.meta || { total: 0, totalPages: 1 };
    const pick = (t: FraudTab) => { setTab(t); setPage(1); };

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader title="Fraud check" subtitle="Who didn't take the parcel or cancelled — check before you confirm." actions={<PageGuide page="fraud" />} />

            {/* Look up a number */}
            <form onSubmit={(e) => { e.preventDefault(); setLookup(typed.trim()); }} className="mb-5 flex gap-2">
                <label className="relative flex-1">
                    <LuSearch size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Phone number — 01XXXXXXXXX" inputMode="tel"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-[15px] outline-none focus:border-[var(--color-primary)]" />
                </label>
                <button type="submit" className="h-12 rounded-2xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]">Check</button>
            </form>
            {lookup && <Lookup key={lookup} q={lookup} onClose={() => { setLookup(''); setTyped(''); }} />}

            {/* Counts — click to filter */}
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Kpi label="Order open now" value={isLoading ? '…' : n(s?.open)} icon={<LuClock size={18} />} tone="bg-amber-50 text-amber-600" onClick={() => pick('open')} active={tab === 'open'} />
                <Kpi label="High risk" value={isLoading ? '…' : n(s?.high)} icon={<LuShieldAlert size={18} />} tone="bg-red-50 text-red-600" onClick={() => pick('high')} active={tab === 'high'} />
                <Kpi label="Didn't take the parcel" value={isLoading ? '…' : n(s?.refused)} icon={<LuPackageX size={18} />} tone="bg-rose-50 text-rose-600" onClick={() => pick('refused')} active={tab === 'refused'} />
                <Kpi label="Cancelled" value={isLoading ? '…' : n(s?.cancelled)} icon={<LuBan size={18} />} tone="bg-gray-100 text-gray-600" onClick={() => pick('cancelled')} active={tab === 'cancelled'} />
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                    <Segmented value={tab} onChange={pick} options={TABS} />
                    <span className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Delivered</span>
                        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Not taken</span>
                        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-400" />Cancelled</span>
                    </span>
                </div>
                {!list.length ? (
                    <p className="px-5 py-12 text-center text-sm text-gray-500">{isLoading ? 'Loading…' : tab === 'open' ? 'No open order from a risky customer.' : 'Nobody here.'}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500">
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-3 py-3">History</th>
                                    <th className="px-3 py-3">Risk</th>
                                    <th className="px-3 py-3">Last problem</th>
                                    <th className="px-3 py-3">Open order</th>
                                    <th className="px-3 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((c) => (
                                    <tr key={c.phone} className="border-t border-gray-100 align-middle hover:bg-gray-50/60">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">{c.name || '—'}</p>
                                            <p className="font-mono text-xs text-gray-500">{c.phone}</p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <Track c={c} />
                                            <p className="mt-1 text-xs tabular-nums text-gray-500">
                                                {c.orders} orders · <span className="text-emerald-600">{c.delivered}</span> · <span className="text-red-600">{c.refused}</span> · {c.cancelled}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3"><Badge tone={RISK[c.risk].tone}>{RISK[c.risk].label}</Badge></td>
                                        <td className="px-3 py-3">
                                            {c.lastProblem ? (
                                                <Link href={`${ORDERS}/${c.lastProblem._id}`} className="block max-w-[220px]">
                                                    <span className="text-xs font-semibold text-gray-800">{c.lastProblem.orderId}</span>
                                                    <span className="ml-1.5 text-xs text-gray-500">{c.lastProblem.kind === 'refused' ? 'not taken' : 'cancelled'}</span>
                                                    {c.lastProblem.reason && <span className="block truncate text-[11px] text-gray-400">{c.lastProblem.reason}</span>}
                                                </Link>
                                            ) : '—'}
                                        </td>
                                        <td className="px-3 py-3">
                                            {c.openOrders.length ? c.openOrders.slice(0, 2).map((o) => (
                                                <Link key={o._id} href={`${ORDERS}/${o._id}`} className="mr-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                                                    {o.orderId} · {getStatusConfig(o.status).label}
                                                </Link>
                                            )) : <span className="text-xs text-gray-300">—</span>}
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            <button type="button" onClick={() => { setLookup(c.phone); setTyped(c.phone); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline">
                                                History <LuArrowUpRight size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {meta.totalPages > 1 && <div className="border-t border-gray-100 px-4 py-3"><Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={20} count={list.length} onPage={setPage} noun="customers" /></div>}
            </section>
        </div>
    );
}
