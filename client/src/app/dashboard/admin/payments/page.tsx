"use client";

/**
 * Payments — money received from customers in a date range: who paid how much, when and
 * how. Cash on delivery counts on the delivery day; bKash / Nagad / card on the order day.
 * Super admin, admin, manager. Data: GET /api/reports/payments.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { LuWallet, LuTruck, LuSmartphone, LuUndo2, LuClock } from 'react-icons/lu';
import PageGuide from '@/components/admin/PageGuide';
import { PageHeader, Card, Badge, Pager, SearchInput, SelectPill, taka, cx, fmtDateTime, fmtDate } from '@/components/admin/ui';
import { paymentMethodLabel } from '@/lib/orderStatus';
import { useGetPaymentsQuery } from '@/redux/api/reportApi';
import RangeBar, { startRange } from '../analytics/_components/RangeBar';
import { fmtPeriod } from '../analytics/_components/period';

const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');
const orders = (k: number | undefined) => `${n(k)} order${k === 1 ? '' : 's'}`;
const METHODS = ['cod', 'bkash', 'nagad', 'rocket', 'sslcommerz'];

function Kpi({ label, value, hint, icon, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: React.ReactNode; tone: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">{label}</p>
                <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg text-white', tone)}>{icon}</span>
            </div>
            <p className="-mt-0.5 text-[22px] font-semibold leading-none tracking-tight text-gray-900">{value}</p>
            {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

export default function PaymentsPage() {
    const [range, setRange] = useState(startRange('30d'));
    const [method, setMethod] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useGetPaymentsQuery({
        from: range.from, to: range.to, method: method !== 'all' ? method : undefined, search: search.trim() || undefined, page,
    });
    const r = data?.data;
    const s = r?.summary;
    const dash = isLoading ? '…' : undefined;
    const reset = () => setPage(1);

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader title="Payments" subtitle={r ? `Money received from customers · ${fmtPeriod(r.from, r.to)}` : 'Money received from customers'} actions={<PageGuide page="payments" />} />

            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3"><RangeBar value={range} onChange={(v) => { setRange(v); reset(); }} /></div>

            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
                <Kpi label="Received" value={dash ?? taka(s?.received)} hint={`${n(s?.orders)} paid order${s?.orders === 1 ? '' : 's'}`} icon={<LuWallet size={16} />} tone="bg-emerald-500" />
                <Kpi label="Cash on delivery" value={dash ?? taka(s?.cod)} hint="Collected at the door" icon={<LuTruck size={16} />} tone="bg-sky-500" />
                <Kpi label="Online" value={dash ?? taka(s?.online)} hint="bKash · Nagad · card" icon={<LuSmartphone size={16} />} tone="bg-violet-500" />
                <Kpi label="Refunded" value={dash ?? taka(s?.refunded.value)} hint={orders(s?.refunded.n)} icon={<LuUndo2 size={16} />} tone="bg-amber-500" />
                <Kpi label="Still to be paid" value={dash ?? taka(s?.due.value)} hint={`${n(s?.due.n)} open order${s?.due.n === 1 ? '' : 's'}, any date`} icon={<LuClock size={16} />} tone="bg-gray-500" />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card title="By method">
                    {!(r?.methods || []).length ? <p className="py-6 text-center text-sm text-gray-400">No payments in this period.</p> : (
                        <ul className="space-y-3">
                            {r!.methods.map((m) => {
                                const total = r!.methods.reduce((a, x) => a + x.value, 0) || 1;
                                return (
                                    <li key={m.method}>
                                        <div className="flex items-baseline justify-between text-sm">
                                            <span className="font-medium text-gray-800">{paymentMethodLabel(m.method)}<span className="ml-1.5 text-xs text-gray-400">{orders(m.orders)}</span></span>
                                            <span className="tabular-nums text-gray-900">{taka(m.value)} <span className="text-xs text-gray-400">{Math.round((m.value / total) * 100)}%</span></span>
                                        </div>
                                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(2, (m.value / total) * 100)}%` }} /></div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Card>
                <Card title="Top paying customers">
                    {!(r?.customers || []).length ? <p className="py-6 text-center text-sm text-gray-400">No payments in this period.</p> : (
                        <ol className="divide-y divide-gray-100 text-sm">
                            {r!.customers.map((c, i) => (
                                <li key={c.phone} className="flex items-center gap-3 py-2">
                                    <span className="w-5 text-xs text-gray-400">{i + 1}</span>
                                    <span className="min-w-0 flex-1"><span className="block truncate font-medium text-gray-900">{c.name || '—'}</span><span className="text-xs text-gray-400">{c.phone} · last {fmtDate(c.last)}</span></span>
                                    <span className="text-xs text-gray-400">{orders(c.orders)}</span>
                                    <span className="w-24 text-right font-semibold tabular-nums text-gray-900">{taka(c.value)}</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </Card>
            </div>

            <Card title="Every payment" description="Who paid, how much, when and how."
                actions={<div className="flex flex-wrap gap-2">
                    <SearchInput value={search} onChange={(v) => { setSearch(v); reset(); }} placeholder="Order, name or phone…" className="sm:w-56" />
                    <SelectPill ariaLabel="Method" value={method} onChange={(v) => { setMethod(v); reset(); }} className="sm:w-40"
                        options={[{ value: 'all', label: 'All methods' }, ...METHODS.map((m) => ({ value: m, label: paymentMethodLabel(m) }))]} />
                </div>}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead><tr className="text-left text-xs font-semibold text-gray-500">
                            <th className="py-2 pr-3">Paid</th><th className="py-2 pr-3">Customer</th><th className="py-2 pr-3">Order</th><th className="py-2 pr-3">Method</th><th className="py-2 text-right">Amount</th>
                        </tr></thead>
                        <tbody>{(r?.rows || []).map((p) => (
                            <tr key={p._id} className="border-t border-gray-100">
                                <td className="whitespace-nowrap py-2.5 pr-3 text-gray-500">{fmtDateTime(p.paidAt)}</td>
                                <td className="py-2.5 pr-3"><span className="font-medium text-gray-900">{p.customer || '—'}</span><span className="block text-xs text-gray-400">{p.phone}</span></td>
                                <td className="py-2.5 pr-3"><Link href={`/dashboard/admin/orders/${p._id}`} className="font-semibold text-gray-700 hover:text-[var(--color-primary)]">{p.orderId}</Link></td>
                                <td className="py-2.5 pr-3">{paymentMethodLabel(p.paymentMethod)}{p.paymentStatus === 'refunded' && <Badge tone="amber" className="ml-1.5">Refunded</Badge>}</td>
                                <td className={cx('py-2.5 text-right font-semibold tabular-nums', p.paymentStatus === 'refunded' ? 'text-amber-600 line-through' : 'text-gray-900')}>{taka(p.total)}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                    {!(r?.rows || []).length && <p className="py-8 text-center text-sm text-gray-400">{isLoading ? 'Loading…' : 'No payments match.'}</p>}
                </div>
                {r && r.meta.totalPages > 1 && <div className="mt-3 border-t border-gray-100 pt-3"><Pager page={page} totalPages={r.meta.totalPages} total={r.meta.total} pageSize={r.meta.limit} count={r.rows.length} onPage={setPage} noun="payments" /></div>}
            </Card>
        </div>
    );
}
