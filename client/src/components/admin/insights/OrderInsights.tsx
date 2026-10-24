"use client";

/**
 * Order insights — who orders and how often, from where, what, when, how they pay and
 * how orders end, for the running 7 / 30 / 90 / 365 days or all time. Everything comes
 * from GET /orders/admin/insights; places arrive as typed (city + area) and are matched
 * to Bangladesh's districts and divisions here (lib/bdGeo). Super admin, admin, manager.
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    LuShoppingCart, LuWallet, LuUsers, LuRepeat, LuBan, LuUndo2, LuSearch, LuArrowUpRight,
} from 'react-icons/lu';
import { useGetOrderInsightsQuery } from '@/redux/api/orderApi';
import { useGetZonesQuery } from '@/redux/api/shippingApi';
import { PageHeader, SelectPill as Select, taka, cx, fmtDate } from '@/components/admin/ui';
import { DailyChart, Toggle } from '@/components/admin/dashboards/OrdersOverview';
import { getStatusConfig, paymentMethodLabel } from '@/lib/orderStatus';
import { BD_DIVISIONS, BD_DISTRICTS, findDistrict, getDivision, getDistrict, districtTerms, divisionTerms, zoneTerms } from '@/lib/bdGeo';

const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');
const ORDERS = '/dashboard/admin/orders';

const PERIODS = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' },
    { value: 'all', label: 'All time' },
];

const DIVISION_NAME: Record<string, string> = {
    mattress: 'Mattress', foam: 'Foam', fiber_pillow: 'Fiber pillow', hometex: 'HomeTex', chemicals: 'Chemicals', general: 'Other',
};
const DIVISION_COLOR: Record<string, string> = {
    mattress: '#d44348', foam: '#f59e0b', fiber_pillow: '#8b5cf6', hometex: '#10b981', chemicals: '#0ea5e9', general: '#9ca3af',
};
const PLACE_TABS = [
    { value: 'zone', label: 'Zone', plural: 'zones' },
    { value: 'division', label: 'Division', plural: 'divisions' },
    { value: 'district', label: 'District', plural: 'districts' },
    { value: 'area', label: 'Area', plural: 'areas' },
] as const;
type PlaceBy = (typeof PLACE_TABS)[number]['value'];

/* ─── Small pieces ───────────────────────────────────────── */

function Panel({ title, hint, children, className, actions }: {
    title: string; hint?: string; children: React.ReactNode; className?: string; actions?: React.ReactNode;
}) {
    return (
        <section className={cx('min-w-0 rounded-2xl border border-gray-200 bg-white p-5', className)}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
                    {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
                </div>
                {actions}
            </div>
            {children}
        </section>
    );
}

function Kpi({ label, value, hint, icon, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: React.ReactNode; tone: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">{label}</p>
                <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white', tone)}>{icon}</span>
            </div>
            <p className="-mt-1 text-[24px] font-semibold leading-none tracking-tight text-gray-900">{value}</p>
            {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

/** Horizontal bars: label, orders, value and share of the largest. */
function Bars({ rows, empty = 'Nothing in this period.', money = true }: {
    rows: { key: string; label: React.ReactNode; n: number; value?: number; color?: string; sub?: React.ReactNode; href?: string; onClick?: () => void; active?: boolean }[];
    empty?: string; money?: boolean;
}) {
    if (!rows.length) return <p className="py-8 text-center text-sm text-gray-400">{empty}</p>;
    const max = Math.max(...rows.map((r) => (money && r.value !== undefined ? r.value : r.n)), 1);
    const total = rows.reduce((a, r) => a + (money && r.value !== undefined ? r.value : r.n), 0) || 1;
    return (
        <ul className="space-y-3">
            {rows.map((r) => {
                const v = money && r.value !== undefined ? r.value : r.n;
                const body = (
                    <>
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate font-medium text-gray-800">{r.label}{r.sub && <span className="ml-1.5 text-xs font-normal text-gray-400">{r.sub}</span>}</span>
                            <span className="shrink-0 tabular-nums text-gray-600">
                                <b className="font-semibold text-gray-900">{n(r.n)}</b> {r.n === 1 ? 'order' : 'orders'}
                                {money && r.value !== undefined && <> · {taka(r.value)}</>}
                                <span className="ml-1.5 text-xs text-gray-400">{Math.round((v / total) * 100)}%</span>
                            </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(2, (v / max) * 100)}%`, background: r.color || '#d44348' }} />
                        </div>
                    </>
                );
                return (
                    <li key={r.key}>
                        {r.href ? <Link href={r.href} className="block rounded-lg hover:bg-gray-50">{body}</Link>
                            : r.onClick ? (
                                <button type="button" onClick={r.onClick} aria-pressed={!!r.active}
                                    className={cx('block w-full rounded-lg px-1.5 py-1 text-left transition hover:bg-gray-50', r.active && 'bg-sky-50 ring-1 ring-sky-200')}>
                                    {body}
                                </button>
                            ) : body}
                    </li>
                );
            })}
        </ul>
    );
}

/** Small column chart (hours of the day, days of the week). */
function Columns({ values, labels, every = 1 }: { values: number[]; labels: string[]; every?: number }) {
    const max = Math.max(...values, 1);
    const peak = values.indexOf(Math.max(...values));
    return (
        <div>
            <div className="flex h-36 items-end gap-[3px]">
                {values.map((v, i) => (
                    <div key={i} className="group relative flex h-full flex-1 items-end">
                        <div className={cx('w-full rounded-t transition-colors', i === peak && v ? 'bg-[#d44348]' : 'bg-[#d44348]/30 group-hover:bg-[#d44348]/60')}
                            style={{ height: `${v ? Math.max(4, (v / max) * 100) : 0}%` }} />
                        <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                            {labels[i]}: {n(v)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-1.5 flex gap-[3px] text-[10px] text-gray-400">
                {labels.map((l, i) => <span key={i} className="flex-1 text-center">{i % every === 0 ? l : ''}</span>)}
            </div>
        </div>
    );
}

type Zone = { _id: string; name: string; regions: string[] };

/**
 * Until zones are set up in Shipping → Zones, the courier's usual three: Dhaka city,
 * the two districts around it, and the rest of the country.
 */
const DEFAULT_ZONES: Zone[] = [
    { _id: 'inside-dhaka', name: 'Inside Dhaka', regions: ['Dhaka'] },
    { _id: 'dhaka-suburbs', name: 'Dhaka suburbs', regions: ['Gazipur', 'Narayanganj'] },
    { _id: 'outside-dhaka', name: 'Outside Dhaka', regions: BD_DISTRICTS.map((x) => x.name).filter((x) => !['Dhaka', 'Gazipur', 'Narayanganj'].includes(x)) },
];

const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-zঀ-৿]/g, '');

/** The district of an address as typed — the whole city / area, or any comma-separated part ("Badda, Dhaka"). */
const placeDistrict = (city: string, area: string) => {
    for (const text of [city, area, ...`${city},${area}`.split(',')]) {
        const hit = findDistrict(text.trim());
        if (hit) return hit;
    }
    return undefined;
};

const hourLabel = (h: number) => (h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`);

/* ─── The page ───────────────────────────────────────────── */

export default function OrderInsights() {
    const [days, setDays] = useState('30');
    const [metric, setMetric] = useState<'orders' | 'revenue'>('orders');
    const [phoneQuery, setPhoneQuery] = useState('');
    // Top (best first) / bottom (worst first) — every list on the page, and the server's customer and product lists.
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');
    // The results-by-place table: which level, ranked by order count or by sales.
    const [placeBy, setPlaceBy] = useState<PlaceBy>('district');
    const [rankBy, setRankBy] = useState<'orders' | 'value'>('orders');
    // Filters that narrow the whole page.
    const [zoneId, setZoneId] = useState('all');
    const [geoDivision, setGeoDivision] = useState('all');
    const [geoDistrict, setGeoDistrict] = useState('all');
    const [division, setDivision] = useState('all');
    const [method, setMethod] = useState('all');
    const [source, setSource] = useState('all');

    const { data: zonesData } = useGetZonesQuery(undefined);
    const zones: Zone[] = useMemo(() => {
        const list = (zonesData as { data?: Zone[] } | undefined)?.data ?? zonesData;
        return Array.isArray(list) && list.length ? list : DEFAULT_ZONES;
    }, [zonesData]);
    const usingDefaultZones = zones === DEFAULT_ZONES;

    const places = useMemo(() => {
        const dist = geoDistrict !== 'all' ? getDistrict(geoDistrict) : undefined;
        const div = !dist && geoDivision !== 'all' ? getDivision(geoDivision) : undefined;
        const terms = dist ? districtTerms(dist) : div ? divisionTerms(div) : [];
        return terms.length ? terms.join('|') : undefined;
    }, [geoDivision, geoDistrict]);
    const zonePlaces = useMemo(() => {
        const z = zoneId !== 'all' ? zones.find((x) => x._id === zoneId) : undefined;
        return z ? zoneTerms(z).join('|') : undefined;
    }, [zoneId, zones]);

    const { data, isLoading, isFetching, isError } = useGetOrderInsightsQuery({
        days,
        order,
        places,
        zonePlaces,
        division: division !== 'all' ? division : undefined,
        paymentMethod: method !== 'all' ? method : undefined,
        source: source !== 'all' ? source : undefined,
    });
    const d = data?.data;
    const t = d?.totals || {};
    const filtersOn = [zoneId, geoDivision, geoDistrict, division, method, source].some((x) => x !== 'all');
    const clearFilters = () => { setZoneId('all'); setGeoDivision('all'); setGeoDistrict('all'); setDivision('all'); setMethod('all'); setSource('all'); };
    /** Top (best first) or bottom (worst first), by orders then value. */
    const ranked = <T extends { n: number; value?: number }>(rows: T[]) =>
        [...rows].sort((a, b) => (order === 'asc' ? 1 : -1) * ((a.n - b.n) || ((a.value || 0) - (b.value || 0))));

    // Places as typed → districts → divisions.
    const geo = useMemo(() => {
        const byDivision = new Map<string, { n: number; value: number }>();
        const byDistrict = new Map<string, { name: string; division: string; n: number; value: number }>();
        const byArea = new Map<string, { area: string; district: string; n: number; value: number }>();
        const byZone = new Map<string, { n: number; value: number }>();
        const zoneSets = zones.map((z) => ({ z, terms: new Set(zoneTerms(z).map(norm)) }));
        let unmatched = { n: 0, value: 0 };
        for (const p of (d?.places || []) as { city: string; area: string; n: number; value: number }[]) {
            const dist = placeDistrict(p.city, p.area);
            // The first zone that names the district, or the city / area as written.
            const hit = zoneSets.find(({ terms }) =>
                (dist && districtTerms(dist).some((x) => terms.has(norm(x)))) || terms.has(norm(p.city)) || terms.has(norm(p.area)));
            const zk = hit?.z._id || 'none';
            const zv = byZone.get(zk) || { n: 0, value: 0 };
            zv.n += p.n; zv.value += p.value; byZone.set(zk, zv);
            if (dist) {
                const dv = byDivision.get(dist.division) || { n: 0, value: 0 };
                dv.n += p.n; dv.value += p.value; byDivision.set(dist.division, dv);
                const ds = byDistrict.get(dist.key) || { name: dist.name, division: dist.division, n: 0, value: 0 };
                ds.n += p.n; ds.value += p.value; byDistrict.set(dist.key, ds);
            } else {
                unmatched = { n: unmatched.n + p.n, value: unmatched.value + p.value };
            }
            // An area is kept unless it only repeats the district's own name ("Dhaka", "ঢাকা");
            // areas the matcher also knows (Mirpur, Agrabad…) are real areas and stay.
            const areaName = (p.area || '').trim();
            const sameAsDistrict = dist && [dist.name, dist.bn].some((x) => x.toLowerCase() === areaName.toLowerCase());
            if (areaName && !sameAsDistrict) {
                const k = `${areaName.toLowerCase()}|${dist?.key || ''}`;
                const a = byArea.get(k) || { area: areaName, district: dist?.name || p.city || '', n: 0, value: 0 };
                a.n += p.n; a.value += p.value; byArea.set(k, a);
            }
        }
        return {
            zones: [...byZone.entries()].map(([k, v]) => ({ key: k, name: zones.find((z) => z._id === k)?.name || 'No zone', ...v })),
            divisions: [...byDivision.entries()].map(([k, v]) => ({ key: k, name: getDivision(k)?.name || k, ...v })),
            districts: [...byDistrict.entries()].map(([k, v]) => ({ key: k, ...v })),
            areas: [...byArea.values()],
            unmatched,
        };
    }, [d, zones]);

    type PlaceRow = { key: string; label: string; sub?: string; n: number; value: number; onClick?: () => void; active?: boolean };
    const placeRows = useMemo(() => {
        const all: PlaceRow[] =
            placeBy === 'zone' ? geo.zones.map((x) => ({
                key: x.key, label: x.name, n: x.n, value: x.value,
                onClick: x.key !== 'none' ? () => setZoneId((z) => (z === x.key ? 'all' : x.key)) : undefined, active: zoneId === x.key,
            }))
            : placeBy === 'division' ? geo.divisions.map((x) => ({
                key: x.key, label: x.name, n: x.n, value: x.value,
                onClick: () => { setGeoDivision((v) => (v === x.key ? 'all' : x.key)); setGeoDistrict('all'); }, active: geoDivision === x.key,
            }))
            : placeBy === 'district' ? geo.districts.map((x) => ({
                key: x.key, label: x.name, sub: getDivision(x.division)?.name, n: x.n, value: x.value,
                onClick: () => setGeoDistrict((v) => (v === x.key ? 'all' : x.key)), active: geoDistrict === x.key,
            }))
            : geo.areas.map((x) => ({ key: `${x.area}|${x.district}`, label: x.area, sub: x.district, n: x.n, value: x.value }));
        const metricOf = (r: PlaceRow) => (rankBy === 'value' ? r.value : r.n);
        const dir = order === 'asc' ? 1 : -1;
        const sorted = [...all].sort((a, b) => dir * ((metricOf(a) - metricOf(b)) || (rankBy === 'value' ? a.n - b.n : a.value - b.value)));
        const rows = sorted.slice(0, 20).map((r) => ({ ...r, share: metricOf(r) }));
        return {
            rows,
            more: sorted.length - rows.length,
            max: Math.max(...all.map(metricOf), 1),
            total: all.reduce((a, r) => a + metricOf(r), 0) || 1,
        };
    }, [geo, placeBy, rankBy, order, zoneId, geoDivision, geoDistrict]);

    const customers = useMemo(() => {
        const list = (d?.customers || []) as { phone: string; name: string; orders: number; value: number; first: string; last: string }[];
        const q = phoneQuery.replace(/[\s-]/g, '').toLowerCase();
        return q ? list.filter((c) => c.phone.includes(q) || c.name.toLowerCase().includes(q)) : list.slice(0, 25);
    }, [d, phoneQuery]);

    const periodLabel = PERIODS.find((p) => p.value === days)?.label || '';

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader
                title="Order insights"
                subtitle="Who orders, how often, from where and what — and when the orders come in."
                actions={<Toggle value={days} onChange={setDays} options={PERIODS} />}
            />

            {/* Filters — every section below shows only the orders that match */}
            <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3 lg:flex-row lg:flex-wrap lg:items-center">
                <Toggle value={order} onChange={setOrder} options={[{ value: 'desc', label: 'Top · best first' }, { value: 'asc', label: 'Bottom · worst first' }]} />
                <span className="hidden h-6 w-px bg-gray-200 lg:block" />
                <Select ariaLabel="Zone" className="lg:w-44" value={zoneId} onChange={setZoneId}
                    options={[{ value: 'all', label: 'All zones' }, ...zones.map((z) => ({ value: z._id, label: z.name }))]} />
                <Select ariaLabel="Division" className="lg:w-44" value={geoDivision} onChange={(v: string) => { setGeoDivision(v); setGeoDistrict('all'); }}
                    options={[{ value: 'all', label: 'All divisions' }, ...BD_DIVISIONS.map((v) => ({ value: v.key, label: `${v.name} · ${v.bn}` }))]} />
                <Select ariaLabel="District" className="lg:w-48" value={geoDistrict} onChange={setGeoDistrict}
                    options={[{ value: 'all', label: geoDivision !== 'all' ? `All districts of ${getDivision(geoDivision)?.name}` : 'All districts' },
                        ...(geoDivision !== 'all' ? BD_DISTRICTS.filter((x) => x.division === geoDivision) : BD_DISTRICTS).map((x) => ({ value: x.key, label: `${x.name} · ${x.bn}` }))]} />
                <Select ariaLabel="Product" className="lg:w-40" value={division} onChange={setDivision}
                    options={[{ value: 'all', label: 'All products' }, ...Object.entries(DIVISION_NAME).map(([k, v]) => ({ value: k, label: v }))]} />
                <Select ariaLabel="Payment" className="lg:w-40" value={method} onChange={setMethod}
                    options={[{ value: 'all', label: 'All payments' }, ...['cod', 'bkash', 'nagad', 'rocket', 'sslcommerz'].map((m) => ({ value: m, label: paymentMethodLabel(m) }))]} />
                <Select ariaLabel="Source" className="lg:w-40" value={source} onChange={setSource}
                    options={[{ value: 'all', label: 'All sources' }, { value: 'website', label: 'Website' }, { value: 'manual', label: 'Phone / walk-in' }]} />
                {filtersOn && <button type="button" onClick={clearFilters} className="text-sm font-semibold text-[#d44348] hover:underline lg:ml-1">Clear filters</button>}
                {usingDefaultZones && <p className="text-xs text-gray-400 lg:ml-auto">Zones: Inside Dhaka / Dhaka suburbs / Outside Dhaka until you set them in Shipping → Zones.</p>}
            </div>

            {isError && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Could not load the insights. Try again in a moment.</p>}

            {/* Summary */}
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
                <Kpi label="Orders" value={isLoading ? '…' : n(t.orders)} hint={`${n(t.delivered)} delivered · ${periodLabel}`} icon={<LuShoppingCart size={17} />} tone="bg-[#d44348]" />
                <Kpi label="Sales" value={isLoading ? '…' : taka(t.sold)} hint={`Average order ${taka(t.average)}`} icon={<LuWallet size={17} />} tone="bg-emerald-500" />
                <Kpi label="Customers" value={isLoading ? '…' : n(t.customers)} hint="Different phone numbers" icon={<LuUsers size={17} />} tone="bg-sky-500" />
                <Kpi label="Repeat customers" value={isLoading ? '…' : n(t.repeatCustomers)} hint={`${t.repeatPct ?? 0}% ordered more than once`} icon={<LuRepeat size={17} />} tone="bg-violet-500" />
                <Kpi label="Cancelled" value={isLoading ? '…' : n(t.cancelled)} hint={`${t.cancelPct ?? 0}% of orders`} icon={<LuBan size={17} />} tone="bg-gray-500" />
                <Kpi label="Returned" value={isLoading ? '…' : n(t.returned)} hint={`${t.returnPct ?? 0}% of orders`} icon={<LuUndo2 size={17} />} tone="bg-amber-500" />
            </div>

            {/* Trend + product divisions */}
            <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <Panel title={d?.trendBy === 'month' ? 'Orders by month' : 'Orders by day'} hint={periodLabel}
                    actions={<Toggle value={metric} onChange={setMetric} options={[{ value: 'orders', label: 'Orders' }, { value: 'revenue', label: 'Revenue' }]} />}>
                    {isLoading ? <div className="h-[280px] animate-pulse rounded-xl bg-gray-50" />
                        : (d?.trend || []).length ? <DailyChart daily={d.trend} metric={metric} by={d.trendBy === 'month' ? 'month' : 'day'} />
                            : <p className="py-24 text-center text-sm text-gray-400">No orders in this period.</p>}
                </Panel>
                <Panel title="What sells" hint="By product division — orders that still stand">
                    <Bars rows={ranked(((d?.divisions || []) as { division: string; orders: number; pieces: number; value: number }[]).map((x) => ({
                        key: x.division, label: DIVISION_NAME[x.division] || x.division, n: x.orders, value: x.value,
                        sub: `${n(x.pieces)} pcs`, color: DIVISION_COLOR[x.division],
                    })))} />
                </Panel>
            </div>

            {/* Results by place — one ranked table; Top / Bottom decides which end comes first */}
            <Panel className="mb-4" title={`${order === 'asc' ? 'Weakest' : 'Best'} ${PLACE_TABS.find((x) => x.value === placeBy)?.plural}`}
                hint={geo.unmatched.n ? `${n(geo.unmatched.n)} ${geo.unmatched.n === 1 ? 'order' : 'orders'} had an address we could not place` : placeBy === 'area' ? 'Thana / area as customers wrote it' : 'Click a row to filter the whole page by it'}
                actions={<div className="flex flex-wrap items-center gap-2">
                    <Toggle value={placeBy} onChange={setPlaceBy} options={[...PLACE_TABS]} />
                    <Toggle value={rankBy} onChange={setRankBy} options={[{ value: 'orders', label: 'By orders' }, { value: 'value', label: 'By sales' }]} />
                </div>}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
                                <th className="py-2 pr-3">#</th><th className="py-2 pr-3">{PLACE_TABS.find((x) => x.value === placeBy)?.label}</th>
                                <th className="py-2 pr-3 text-right">Orders</th><th className="py-2 pr-3 text-right">Sales</th>
                                <th className="w-[30%] py-2">Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placeRows.rows.map((r, i) => (
                                <tr key={r.key} onClick={r.onClick}
                                    className={cx('border-b border-gray-50 last:border-0', r.onClick && 'cursor-pointer hover:bg-gray-50', r.active && 'bg-sky-50')}>
                                    <td className="py-2.5 pr-3 text-gray-400">{i + 1}</td>
                                    <td className="py-2.5 pr-3 font-medium text-gray-900">
                                        {r.label}{r.sub && <span className="ml-1.5 text-xs font-normal text-gray-400">{r.sub}</span>}
                                    </td>
                                    <td className="py-2.5 pr-3 text-right tabular-nums">{n(r.n)}</td>
                                    <td className="py-2.5 pr-3 text-right tabular-nums text-gray-900">{taka(r.value)}</td>
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                <div className="h-full rounded-full bg-[#0ea5e9]" style={{ width: `${Math.max(2, (r.share / placeRows.max) * 100)}%` }} />
                                            </div>
                                            <span className="w-9 text-right text-xs tabular-nums text-gray-500">{Math.round((r.share / placeRows.total) * 100)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!placeRows.rows.length && <p className="py-8 text-center text-sm text-gray-400">No orders in this period.</p>}
                    {placeRows.more > 0 && <p className="mt-3 text-xs text-gray-400">Showing {placeRows.rows.length} of {n(placeRows.rows.length + placeRows.more)}.</p>}
                </div>
            </Panel>

            {/* Customers */}
            <Panel className="mb-4" title="Customers by phone" hint={order === 'asc' ? 'Who ordered least — open a number to see every order from it' : 'Who ordered most often — open a number to see every order from it'}
                actions={
                    <label className="relative block w-full sm:w-72">
                        <LuSearch size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input value={phoneQuery} onChange={(e) => setPhoneQuery(e.target.value)} placeholder="Find a phone or name"
                            className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-gray-400" />
                    </label>
                }>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
                                <th className="py-2 pr-3">#</th><th className="py-2 pr-3">Phone</th><th className="py-2 pr-3">Name</th>
                                <th className="py-2 pr-3 text-right">Orders</th><th className="py-2 pr-3 text-right">Spent</th>
                                <th className="py-2 pr-3">First order</th><th className="py-2 pr-3">Last order</th><th />
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, i) => (
                                <tr key={c.phone} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                    <td className="py-2.5 pr-3 text-gray-400">{i + 1}</td>
                                    <td className="py-2.5 pr-3 font-medium tabular-nums text-gray-900">{c.phone}</td>
                                    <td className="py-2.5 pr-3 text-gray-700">{c.name || '—'}</td>
                                    <td className="py-2.5 pr-3 text-right">
                                        <span className={cx('inline-flex min-w-7 justify-center rounded-full px-2 py-0.5 text-xs font-semibold',
                                            c.orders >= 2 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600')}>{c.orders}</span>
                                    </td>
                                    <td className="py-2.5 pr-3 text-right tabular-nums text-gray-900">{taka(c.value)}</td>
                                    <td className="py-2.5 pr-3 text-gray-500">{fmtDate(c.first)}</td>
                                    <td className="py-2.5 pr-3 text-gray-500">{fmtDate(c.last)}</td>
                                    <td className="py-2.5 text-right">
                                        <Link href={`${ORDERS}?search=${encodeURIComponent(c.phone)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#d44348] hover:underline">
                                            Orders <LuArrowUpRight size={13} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!customers.length && <p className="py-8 text-center text-sm text-gray-400">{phoneQuery ? 'No customer matches that.' : 'No customers in this period.'}</p>}
                    {!phoneQuery && (d?.customers || []).length > 25 && <p className="mt-3 text-xs text-gray-400">Showing the top 25 — search to find any of the top {n((d?.customers || []).length)}.</p>}
                </div>
            </Panel>

            {/* Products */}
            <Panel className="mb-4" title={order === 'asc' ? 'Slowest-selling products' : 'Best-selling products'} hint="By pieces sold">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
                                <th className="py-2 pr-3">Product</th><th className="py-2 pr-3">Division</th>
                                <th className="py-2 pr-3 text-right">Pieces</th><th className="py-2 pr-3 text-right">Orders</th><th className="py-2 text-right">Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {((d?.products || []) as { name: string; division: string; pieces: number; orders: number; value: number }[]).map((p) => (
                                <tr key={p.name} className="border-b border-gray-50 last:border-0">
                                    <td className="py-2.5 pr-3 font-medium text-gray-900">{p.name}</td>
                                    <td className="py-2.5 pr-3">
                                        <span className="inline-flex items-center gap-1.5 text-gray-600">
                                            <span className="h-2 w-2 rounded-full" style={{ background: DIVISION_COLOR[p.division] || '#9ca3af' }} />
                                            {DIVISION_NAME[p.division] || p.division}
                                        </span>
                                    </td>
                                    <td className="py-2.5 pr-3 text-right tabular-nums">{n(p.pieces)}</td>
                                    <td className="py-2.5 pr-3 text-right tabular-nums">{n(p.orders)}</td>
                                    <td className="py-2.5 text-right tabular-nums text-gray-900">{taka(p.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!(d?.products || []).length && <p className="py-8 text-center text-sm text-gray-400">Nothing sold in this period.</p>}
                </div>
            </Panel>

            {/* When orders come in, and how they end */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Panel title="Orders by hour" hint="Dhaka time — when to have people on the phones">
                    <Columns values={d?.hours || Array(24).fill(0)} labels={Array.from({ length: 24 }, (_, h) => hourLabel(h))} every={3} />
                </Panel>
                <Panel title="Where orders stand">
                    <Bars money={false} rows={ranked(((d?.byStatus || []) as { status: string; n: number }[]).map((x) => ({
                        key: x.status, label: getStatusConfig(x.status).label, n: x.n, color: '#6b7280', href: `${ORDERS}?status=${x.status}`,
                    })))} />
                </Panel>
                <Panel title="Why orders are cancelled">
                    <Bars money={false} empty="No cancellations in this period." rows={ranked(((d?.cancelReasons || []) as { reason: string; n: number }[]).map((x) => ({ key: x.reason, label: x.reason, n: x.n, color: '#9ca3af' })))} />
                </Panel>
            </div>
        </div>
    );
}
