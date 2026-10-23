"use client";

/**
 * Analytics — order money for any dates and filters (division, channel, payment, place):
 * sales each day, what sold, which channel, which staff member brought it in, and how each
 * number moved against the same length of time before. Who buys and from where is Order
 * insights. Super admin, admin, manager. Data: GET /api/reports/sales.
 */
import React, { useMemo, useState } from 'react';
import { LuShoppingCart, LuWallet, LuTruck, LuBan, LuUndo2, LuDownload, LuReceipt, LuTrendingUp, LuTrendingDown, LuX, LuSlidersHorizontal } from 'react-icons/lu';
import { SelectPill } from '@/components/admin/ui';
import { BD_DIVISIONS, BD_DISTRICTS, getDistrict, getDivision, districtTerms, divisionTerms } from '@/lib/bdGeo';
import PageGuide from '@/components/admin/PageGuide';
import { PageHeader, Btn, Card, Badge, taka, cx, fmtDate } from '@/components/admin/ui';
import { DailyChart, Toggle } from '@/components/admin/dashboards/OrdersOverview';
import { ROLE_LABEL } from '@/components/admin/access';
import { paymentMethodLabel } from '@/lib/orderStatus';
import { useGetSalesQuery } from '@/redux/api/reportApi';
import RangeBar, { startRange } from './_components/RangeBar';
import { fmtPeriod } from './_components/period';

const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');
const DIVISION_NAME: Record<string, string> = { mattress: 'Mattress', foam: 'Foam', fiber_pillow: 'Fiber pillow', hometex: 'HomeTex', chemicals: 'Chemicals', general: 'Other' };
const DIVISION_COLOR: Record<string, string> = { mattress: '#d44348', foam: '#f59e0b', fiber_pillow: '#8b5cf6', hometex: '#10b981', chemicals: '#0ea5e9', general: '#9ca3af' };
const SOURCE_NAME: Record<string, string> = { website: 'Website', manual: 'Phone / walk-in' };

/** ▲ 12% / ▼ 8% against the period before; `goodWhenDown` for cancels and returns. */
function Delta({ now, before, goodWhenDown = false }: { now?: number; before?: number; goodWhenDown?: boolean }) {
    if (now === undefined || before === undefined) return null;
    if (!before) return now ? <span className={cx('text-[11px] font-semibold', goodWhenDown ? 'text-red-600' : 'text-emerald-600')}>New</span> : <span className="text-[11px] text-gray-400">—</span>;
    const pct = Math.round(((now - before) / before) * 100);
    if (pct === 0) return <span className="text-[11px] text-gray-400">No change</span>;
    const up = pct > 0;
    const good = goodWhenDown ? !up : up;
    return (
        <span className={cx('inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold', good ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
            {up ? <LuTrendingUp size={11} /> : <LuTrendingDown size={11} />}{Math.abs(pct)}%
        </span>
    );
}

function Kpi({ label, value, hint, icon, tone, delta }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: React.ReactNode; tone: string; delta?: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">{label}</p>
                <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg text-white', tone)}>{icon}</span>
            </div>
            <p className="-mt-0.5 text-[22px] font-semibold leading-none tracking-tight text-gray-900">{value}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">{delta}{hint && <span>{hint}</span>}</div>
        </div>
    );
}

/** Share bars, value first. */
function Shares({ rows }: { rows: { key: string; label: string; value: number; sub?: string; color?: string }[] }) {
    const total = rows.reduce((a, r) => a + r.value, 0) || 1;
    if (!rows.length) return <p className="py-6 text-center text-sm text-gray-400">No sales in this period.</p>;
    return (
        <ul className="space-y-3">
            {rows.map((r) => (
                <li key={r.key}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-gray-800">{r.label}{r.sub && <span className="ml-1.5 text-xs font-normal text-gray-400">{r.sub}</span>}</span>
                        <span className="shrink-0 tabular-nums text-gray-900">{taka(r.value)} <span className="text-xs text-gray-400">{Math.round((r.value / total) * 100)}%</span></span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full" style={{ width: `${Math.max(2, (r.value / total) * 100)}%`, background: r.color || '#d44348' }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

/** The day-by-day table as a CSV Excel opens. */
function downloadCsv(name: string, rows: (string | number)[][]) {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
}

const EMPTY_FILTERS = { division: 'all', source: 'all', paymentMethod: 'all', geoDivision: 'all', district: 'all' };

export default function AnalyticsPage() {
    const [range, setRange] = useState(startRange('30d'));
    const [metric, setMetric] = useState<'orders' | 'revenue'>('revenue');
    const [f, setF] = useState(EMPTY_FILTERS);
    const set = (patch: Partial<typeof EMPTY_FILTERS>) => setF((v) => ({ ...v, ...patch }));
    const places = useMemo(() => {
        const d = f.district !== 'all' ? getDistrict(f.district) : undefined;
        const v = !d && f.geoDivision !== 'all' ? getDivision(f.geoDivision) : undefined;
        const terms = d ? districtTerms(d) : v ? divisionTerms(v) : [];
        return terms.length ? terms.join('|') : undefined;
    }, [f.geoDivision, f.district]);
    const filtersOn = JSON.stringify(f) !== JSON.stringify(EMPTY_FILTERS);
    const { data, isLoading, isFetching } = useGetSalesQuery({
        from: range.from, to: range.to, places,
        division: f.division !== 'all' ? f.division : undefined,
        source: f.source !== 'all' ? f.source : undefined,
        paymentMethod: f.paymentMethod !== 'all' ? f.paymentMethod : undefined,
    });
    const r = data?.data;
    const t = r?.totals;
    const pv = r?.previous;
    const dash = isLoading ? '…' : undefined;

    const exportDaily = () => {
        if (!r) return;
        downloadCsv(`karmo-sales-${r.from}-to-${r.to}.csv`, [
            ['Date', 'Orders', 'Sold orders', 'Sales (BDT)', 'Delivered', 'Cancelled'],
            ...r.daily.map((d) => [d.date, d.orders, d.sold, d.revenue, d.delivered, d.cancelled]),
            [],
            ['Total', t?.orders ?? 0, t?.sold ?? 0, t?.soldValue ?? 0, t?.delivered ?? 0, t?.cancelled ?? 0],
        ]);
    };

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader title="Analytics" subtitle={r ? `Order sales · ${fmtPeriod(r.from, r.to)} · compared with ${fmtPeriod(r.previous.from, r.previous.to)}` : 'Order sales'}
                actions={<>
                    <Btn icon={<LuDownload size={15} />} onClick={exportDaily} disabled={!r}>Excel (CSV)</Btn>
                    <PageGuide page="sales" />
                </>} />

            {/* Dates, then what to look at */}
            <div className="mb-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-3">
                <RangeBar value={range} onChange={setRange} />
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 lg:flex-row lg:flex-wrap lg:items-center">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><LuSlidersHorizontal size={14} /> Filter</span>
                    <SelectPill ariaLabel="Product division" value={f.division} onChange={(v) => set({ division: v })} className="lg:w-40"
                        options={[{ value: 'all', label: 'All products' }, ...Object.entries(DIVISION_NAME).map(([value, label]) => ({ value, label }))]} />
                    <SelectPill ariaLabel="Channel" value={f.source} onChange={(v) => set({ source: v })} className="lg:w-44"
                        options={[{ value: 'all', label: 'All channels' }, { value: 'website', label: 'Website' }, { value: 'manual', label: 'Phone / walk-in' }]} />
                    <SelectPill ariaLabel="Payment" value={f.paymentMethod} onChange={(v) => set({ paymentMethod: v })} className="lg:w-40"
                        options={[{ value: 'all', label: 'All payments' }, ...['cod', 'bkash', 'nagad', 'rocket', 'sslcommerz'].map((m) => ({ value: m, label: paymentMethodLabel(m) }))]} />
                    <SelectPill ariaLabel="Division" value={f.geoDivision} onChange={(v) => set({ geoDivision: v, district: 'all' })} className="lg:w-44"
                        options={[{ value: 'all', label: 'All divisions' }, ...BD_DIVISIONS.map((v) => ({ value: v.key, label: `${v.name} · ${v.bn}` }))]} />
                    <SelectPill ariaLabel="District" value={f.district} onChange={(v) => set({ district: v })} className="lg:w-48"
                        options={[{ value: 'all', label: 'All districts' }, ...(f.geoDivision !== 'all' ? BD_DISTRICTS.filter((x) => x.division === f.geoDivision) : BD_DISTRICTS).map((x) => ({ value: x.key, label: `${x.name} · ${x.bn}` }))]} />
                    {filtersOn && (
                        <button type="button" onClick={() => setF(EMPTY_FILTERS)} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline">
                            <LuX size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
                <Kpi label="Sales" value={dash ?? taka(t?.soldValue)} delta={<Delta now={t?.soldValue} before={pv?.soldValue} />} hint={`${n(t?.sold)} orders`} icon={<LuWallet size={16} />} tone="bg-emerald-500" />
                <Kpi label="Orders" value={dash ?? n(t?.orders)} delta={<Delta now={t?.orders} before={pv?.orders} />} hint={`was ${n(pv?.orders)}`} icon={<LuShoppingCart size={16} />} tone="bg-[#d44348]" />
                <Kpi label="Average order" value={dash ?? taka(t?.average)} delta={<Delta now={t?.average} before={pv?.average} />} hint={`was ${taka(pv?.average)}`} icon={<LuReceipt size={16} />} tone="bg-violet-500" />
                <Kpi label="Delivered" value={dash ?? taka(t?.deliveredValue)} delta={<Delta now={t?.deliveredValue} before={pv?.deliveredValue} />} hint={`${n(t?.delivered)} orders`} icon={<LuTruck size={16} />} tone="bg-sky-500" />
                <Kpi label="Cancelled" value={dash ?? n(t?.cancelled)} delta={<Delta now={t?.cancelled} before={pv?.cancelled} goodWhenDown />} hint={taka(t?.cancelledValue)} icon={<LuBan size={16} />} tone="bg-gray-500" />
                <Kpi label="Returned" value={dash ?? n(t?.returned)} delta={<Delta now={t?.returned} before={pv?.returned} goodWhenDown />} hint={taka(t?.returnedValue)} icon={<LuUndo2 size={16} />} tone="bg-amber-500" />
            </div>

            <Card className="mb-4" title="Sales by day" description="Cancelled and returned orders are not counted as sales."
                actions={<Toggle value={metric} onChange={setMetric} options={[{ value: 'revenue', label: 'Sales ৳' }, { value: 'orders', label: 'Orders' }]} />}>
                {r ? <DailyChart daily={r.daily.map((d) => ({ date: d.date, orders: d.sold, revenue: d.revenue }))} metric={metric} />
                    : <div className="h-[260px] animate-pulse rounded-xl bg-gray-50" />}
            </Card>

            <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card title="By division">
                    <Shares rows={(r?.divisions || []).map((d) => ({ key: d.division, label: DIVISION_NAME[d.division] || d.division, value: d.value, sub: `${n(d.pieces)} pcs`, color: DIVISION_COLOR[d.division] }))} />
                </Card>
                <Card title="Channel">
                    <Shares rows={(r?.sources || []).map((s) => ({ key: s.source, label: SOURCE_NAME[s.source] || s.source, value: s.value, sub: `${n(s.orders)} orders`, color: '#0ea5e9' }))} />
                </Card>
                <Card title="Payment">
                    <Shares rows={(r?.payments || []).map((s) => ({ key: s.method, label: paymentMethodLabel(s.method), value: s.value, sub: `${n(s.orders)} orders`, color: '#8b5cf6' }))} />
                </Card>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <Card title="Sales by staff" description="Orders each person took by phone, and orders they confirmed.">
                    {!(r?.staff || []).length ? <p className="py-6 text-center text-sm text-gray-400">No staff sales in this period.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-sm">
                                <thead><tr className="text-left text-xs font-semibold text-gray-500">
                                    <th className="py-2 pr-3">Staff</th><th className="py-2 pr-3 text-right">Taken</th><th className="py-2 pr-3 text-right">Confirmed</th><th className="py-2 pr-3 text-right">Delivered</th><th className="py-2 text-right">Sales</th>
                                </tr></thead>
                                <tbody>{r!.staff.map((s) => (
                                    <tr key={s.id} className="border-t border-gray-100">
                                        <td className="py-2.5 pr-3"><span className="font-medium text-gray-900">{s.name || '—'}</span> <Badge className="ml-1">{ROLE_LABEL[s.role as keyof typeof ROLE_LABEL] || s.role}</Badge></td>
                                        <td className="py-2.5 pr-3 text-right tabular-nums">{n(s.taken)}</td>
                                        <td className="py-2.5 pr-3 text-right tabular-nums">{n(s.confirmed)}</td>
                                        <td className="py-2.5 pr-3 text-right tabular-nums">{n(s.delivered)}</td>
                                        <td className="py-2.5 text-right font-semibold tabular-nums text-gray-900">{taka(s.takenValue + s.confirmedValue)}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                </Card>
                <Card title="Top products">
                    {!(r?.products || []).length ? <p className="py-6 text-center text-sm text-gray-400">Nothing sold in this period.</p> : (
                        <ol className="divide-y divide-gray-100 text-sm">
                            {r!.products.map((p, i) => (
                                <li key={p.name} className="flex items-center gap-3 py-2">
                                    <span className="w-5 text-xs text-gray-400">{i + 1}</span>
                                    <span className="min-w-0 flex-1 truncate text-gray-800">{p.name}</span>
                                    <span className="text-xs text-gray-400">{n(p.pieces)} pcs</span>
                                    <span className="w-24 text-right font-medium tabular-nums text-gray-900">{taka(p.value)}</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </Card>
            </div>

            <Card title="Day by day">
                <div className="max-h-[420px] overflow-auto">
                    <table className="w-full min-w-[560px] text-sm">
                        <thead className="sticky top-0 bg-white"><tr className="text-left text-xs font-semibold text-gray-500">
                            <th className="py-2 pr-3">Date</th><th className="py-2 pr-3 text-right">Orders</th><th className="py-2 pr-3 text-right">Sold</th><th className="py-2 pr-3 text-right">Delivered</th><th className="py-2 pr-3 text-right">Cancelled</th><th className="py-2 text-right">Sales</th>
                        </tr></thead>
                        <tbody>{[...(r?.daily || [])].reverse().map((d) => (
                            <tr key={d.date} className={cx('border-t border-gray-100', !d.orders && 'text-gray-400')}>
                                <td className="py-2 pr-3">{fmtDate(d.date)}</td>
                                <td className="py-2 pr-3 text-right tabular-nums">{d.orders}</td>
                                <td className="py-2 pr-3 text-right tabular-nums">{d.sold}</td>
                                <td className="py-2 pr-3 text-right tabular-nums">{d.delivered}</td>
                                <td className="py-2 pr-3 text-right tabular-nums">{d.cancelled}</td>
                                <td className="py-2 text-right font-medium tabular-nums">{taka(d.revenue)}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
