"use client";

/**
 * The super admin / admin / manager dashboard's numbers, from GET /orders/admin/overview:
 *   TodayCards   — today at a glance (Dhaka day, midnight to midnight)
 *   OrdersTrend  — orders or sales per day for the running 7 or 30 days, a smooth area
 *                  chart, with that period's totals in the panel beside it
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { LuShoppingCart, LuPhoneCall, LuFactory, LuPackageCheck } from 'react-icons/lu';
import { useGetOrderOverviewQuery } from '@/redux/api/orderApi';
import { taka, cx } from '@/components/admin/ui';

const ORDERS = '/dashboard/admin/orders';
const BRAND = '#d44348';
const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');

/* ─── Today ──────────────────────────────────────────────── */

function TodayCard({ label, value, hint, icon, tone, href }: {
    label: string; value: React.ReactNode; hint?: React.ReactNode; icon: React.ReactNode; tone: string; href?: string;
}) {
    const body = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">{label}</p>
                <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white', tone)}>{icon}</span>
            </div>
            <p className="-mt-2 text-[28px] font-semibold leading-none tracking-tight text-gray-900">{value}</p>
            {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
        </>
    );
    const cls = 'block rounded-2xl border border-gray-200 bg-white p-4 transition';
    return href
        ? <Link href={href} className={cx(cls, 'hover:border-gray-300 hover:shadow-sm')}>{body}</Link>
        : <div className={cls}>{body}</div>;
}

export function TodayCards() {
    const { data, isLoading } = useGetOrderOverviewQuery(30);
    const t = data?.data?.today || {};
    const v = (x: unknown) => (isLoading ? '…' : n(x));
    return (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TodayCard
                label="Today's orders" value={v(t.placed)} tone="bg-[#d44348]" icon={<LuShoppingCart size={18} />}
                hint={isLoading ? ' ' : <>{taka(t.placedValue)} placed today{t.cancelled ? ` · ${n(t.cancelled)} cancelled` : ''}</>}
                href={ORDERS}
            />
            <TodayCard
                label="Awaiting confirmation" value={v(t.pending)} tone="bg-amber-500" icon={<LuPhoneCall size={18} />}
                hint="Waiting for the call" href={`${ORDERS}?status=pending`}
            />
            <TodayCard
                label="In process" value={v(t.inProcess)} tone="bg-violet-500" icon={<LuFactory size={18} />}
                hint={isLoading ? ' ' : `Confirmed to courier · ${n(t.onTheWay)} on the way`} href={ORDERS}
            />
            <TodayCard
                label="Delivered today" value={v(t.delivered)} tone="bg-emerald-500" icon={<LuPackageCheck size={18} />}
                hint={isLoading ? ' ' : `${taka(t.deliveredValue)} delivered`} href={`${ORDERS}?status=delivered`}
            />
        </div>
    );
}

/* ─── The chart ──────────────────────────────────────────── */

/** Smooth line through the points that never overshoots a value (monotone cubic, like d3's curveMonotoneX). */
function monotonePath(pts: { x: number; y: number }[]) {
    const len = pts.length;
    if (!len) return '';
    if (len === 1) return `M${pts[0].x},${pts[0].y}`;
    const m: number[] = [];
    for (let i = 0; i < len - 1; i++) m[i] = (pts[i + 1].y - pts[i].y) / (pts[i + 1].x - pts[i].x);
    const t: number[] = new Array(len);
    t[0] = m[0];
    t[len - 1] = m[len - 2];
    for (let i = 1; i < len - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < len - 1; i++) {
        if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
        const a = t[i] / m[i];
        const b = t[i + 1] / m[i];
        const s = a * a + b * b;
        if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < len - 1; i++) {
        const h = (pts[i + 1].x - pts[i].x) / 3;
        d += ` C${pts[i].x + h},${pts[i].y + t[i] * h} ${pts[i + 1].x - h},${pts[i + 1].y - t[i + 1] * h} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return d;
}

/** A round top for the y axis: 0, step, 2·step… with 4 steps. */
function niceTicks(max: number, floor: number) {
    const top = Math.max(max, floor);
    const raw = top / 4;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * p).find((s) => s >= raw) || 10 * p;
    return [0, 1, 2, 3, 4].map((i) => i * step);
}

const compactTaka = (v: number) =>
    v >= 100000 ? `৳${+(v / 100000).toFixed(1)}L` : v >= 1000 ? `৳${+(v / 1000).toFixed(1)}k` : `৳${v}`;

const dayLabel = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
/** "2026-10" → "Oct 26" (Order insights' long ranges are drawn month by month). */
const monthLabel = (ym: string) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

/** Orders or sales per day (or per month with `by="month"`), as a smooth area chart. */
export function DailyChart({ daily, metric, by = 'day' }: {
    daily: { date: string; orders: number; revenue: number }[]; metric: 'orders' | 'revenue'; by?: 'day' | 'month';
}) {
    const wrap = useRef<HTMLDivElement>(null);
    const [w, setW] = useState(720);
    const [hover, setHover] = useState<number | null>(null);

    useEffect(() => {
        const el = wrap.current;
        if (!el) return undefined;
        const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const H = 280;
    const pad = { l: 52, r: 14, t: 14, b: 30 };
    const values = daily.map((d) => d[metric]);
    const ticks = niceTicks(Math.max(0, ...values), metric === 'orders' ? 4 : 1000);
    const top = ticks[ticks.length - 1];
    const innerW = w - pad.l - pad.r;
    const innerH = H - pad.t - pad.b;
    const x = (i: number) => pad.l + (daily.length > 1 ? (i / (daily.length - 1)) * innerW : innerW / 2);
    const y = (v: number) => pad.t + innerH - (v / top) * innerH;
    const pts = daily.map((d, i) => ({ x: x(i), y: y(d[metric]) }));
    const line = monotonePath(pts);
    const area = pts.length ? `${line} L${pts[pts.length - 1].x},${y(0)} L${pts[0].x},${y(0)} Z` : '';
    /* As many date labels as fit (~58px each, at most 8), so they never run into each other on a phone. */
    const fit = Math.max(2, Math.min(8, Math.floor(innerW / 58)));
    const every = Math.max(1, Math.ceil(daily.length / fit));
    const fmt = metric === 'orders' ? (v: number) => n(v) : compactTaka;
    const allZero = values.every((v) => !v);

    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - r.left;
        const i = Math.round(((px - pad.l) / innerW) * (daily.length - 1));
        setHover(Math.min(daily.length - 1, Math.max(0, i)));
    };

    const h = hover != null ? daily[hover] : null;

    return (
        <div ref={wrap} className="relative w-full min-w-0 overflow-hidden">
            <svg width={w} height={H} className="block" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img"
                aria-label={`${metric === 'orders' ? 'Orders' : 'Sales'} per day`}>
                <defs>
                    <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BRAND} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                {ticks.map((tv) => (
                    <g key={tv}>
                        <line x1={pad.l} x2={w - pad.r} y1={y(tv)} y2={y(tv)} stroke="#eef0f3" strokeDasharray={tv ? '4 4' : undefined} />
                        <text x={pad.l - 10} y={y(tv) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">{fmt(tv)}</text>
                    </g>
                ))}
                {daily.map((d, i) => (i % every === 0 || i === daily.length - 1) && (i === daily.length - 1 || daily.length - 1 - i >= every / 2) ? (
                    <text key={d.date} x={x(i)} y={H - 8} textAnchor={i === daily.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'} fontSize="11" fill="#9ca3af">
                        {by === 'month' ? monthLabel(d.date) : i === daily.length - 1 ? 'Today' : dayLabel(d.date)}
                    </text>
                ) : null)}
                <path d={area} fill="url(#dash-area)" />
                <path d={line} fill="none" stroke={BRAND} strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
                {h && hover != null && (
                    <g>
                        <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="#d1d5db" strokeDasharray="3 3" />
                        <circle cx={x(hover)} cy={y(h[metric])} r={4.5} fill="#fff" stroke={BRAND} strokeWidth={2} />
                    </g>
                )}
            </svg>

            {allZero && (
                <p className="pointer-events-none absolute inset-x-0 top-[42%] text-center text-sm text-gray-400">No orders in these days yet.</p>
            )}

            {h && hover != null && (
                <div
                    className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
                    style={{ left: Math.min(Math.max(x(hover) - 75, 0), w - 160) }}
                >
                    <p className="font-semibold text-gray-900">{by === 'month'
                        ? new Date(`${h.date}-01T00:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                        : new Date(`${h.date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="mt-1 flex justify-between gap-4 text-gray-600"><span>Orders</span><span className="font-semibold text-gray-900">{n(h.orders)}</span></p>
                    <p className="flex justify-between gap-4 text-gray-600"><span>Sales</span><span className="font-semibold text-gray-900">{taka(h.revenue)}</span></p>
                </div>
            )}
        </div>
    );
}

/* ─── Chart card + the period's totals ───────────────────── */

export function Toggle<T extends string | number>({ value, options, onChange }: {
    value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
    return (
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-0.5">
            {options.map((o) => (
                <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
                    className={cx('whitespace-nowrap rounded-[10px] px-3 py-1.5 text-xs font-semibold transition',
                        value === o.value ? 'bg-[#d44348] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50')}>
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function Row({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5 text-sm last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className={cx('font-semibold tabular-nums', tone || 'text-gray-900')}>{value}</span>
        </div>
    );
}

export function OrdersTrend() {
    const [days, setDays] = useState<7 | 30>(30);
    const [metric, setMetric] = useState<'orders' | 'revenue'>('orders');
    const { data, isLoading, isFetching, isError } = useGetOrderOverviewQuery(days);
    const o = data?.data;
    const daily = useMemo(() => o?.daily || [], [o]);
    const p = o?.period || {};
    const range = o ? `${dayLabel(p.from)} → ${dayLabel(p.to)}` : '';

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
            {/* grid-cols-1 = minmax(0,1fr): the column follows the screen, not the chart's width. */}
            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900">Daily orders</h2>
                        <p className="mt-0.5 text-sm text-gray-500">{range ? `${range} · last ${days} days` : 'Loading…'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Toggle value={days} onChange={setDays} options={[{ value: 7, label: '7 days' }, { value: 30, label: '30 days' }]} />
                        <Toggle value={metric} onChange={setMetric} options={[{ value: 'orders', label: 'Orders' }, { value: 'revenue', label: 'Revenue' }]} />
                    </div>
                </div>
                <div className={cx('transition-opacity', isFetching && 'opacity-60')}>
                    {isError ? <p className="py-24 text-center text-sm text-red-600">Could not load the chart.</p>
                        : isLoading || !daily.length ? <div className="h-[280px] animate-pulse rounded-xl bg-gray-50" />
                            : <DailyChart daily={daily} metric={metric} />}
                </div>
            </section>

            <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Last {days} days</p>
                <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-[30px] font-semibold leading-none tracking-tight text-gray-900">{isLoading ? '…' : n(p.orders)}</span>
                    <span className="text-sm text-gray-500">{p.orders === 1 ? 'order' : 'orders'} · {n(p.pieces)} {p.pieces === 1 ? 'piece' : 'pieces'}</span>
                </p>
                <div className="mt-4">
                    <Row label="Sold" value={taka(p.sold)} />
                    <Row label="Earned" value={taka(p.earned)} tone="text-emerald-600" />
                    <Row label="Still to collect" value={taka(p.toCollect)} tone="text-amber-600" />
                    <Row label="Delivery charge" value={taka(p.delivery)} />
                    <Row label="Average order" value={taka(p.average)} />
                    <Row label="Cancelled / returned" value={n(p.cancelled)} tone="text-gray-500" />
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-600">Collected</span>
                        <span className="font-semibold text-gray-900">{n(p.collectedPct)}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${Math.min(100, Number(p.collectedPct || 0))}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-gray-400">Earned = delivered or paid online. Cancelled, returned and refunded orders are left out.</p>
                </div>
            </section>
        </div>
    );
}
