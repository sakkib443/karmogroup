/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * One dashboard per staff role — everyone signs in to their own work first.
 *   agency        the call queue: confirm or cancel, then send the SMS
 *   factory       challans waiting to be scanned and issued
 *   online_sales  orders ready for the courier, in transit, returns
 *   admin / superadmin / manager  the whole pipeline at a glance
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useViewRole } from '@/components/admin/viewRole';
import {
    LuPhoneCall, LuCheck, LuX, LuArrowRight, LuScanBarcode, LuTruck, LuUndo2, LuClock, LuFactory,
    LuPackageCheck, LuClipboardList, LuShoppingCart, LuUsers, LuChartColumn, LuSend,
} from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { useGetAdminOrdersQuery, useGetOrderStatsQuery, useUpdateOrderStatusMutation, useGetFactoryQueueQuery } from '@/redux/api/orderApi';
import { PageHeader, Btn, StatTile, Card, Badge, taka, cx } from '@/components/admin/ui';
import { getStatusConfig, paymentMethodLabel } from '@/lib/orderStatus';
import { ROLE_LABEL, can } from '@/components/admin/access';
import { CancelOrderModal, SmsButton } from '@/components/admin/orders/OrderActions';

const ORDERS = '/dashboard/admin/orders';

const apiError = (e: unknown, fallback: string) =>
    (e as { data?: { message?: string } })?.data?.message || fallback;

function greeting() {
    const h = Number(new Date().toLocaleString('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dhaka' }));
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function ago(d?: string) {
    if (!d) return '';
    const m = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000));
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} h ago`;
    return `${Math.round(h / 24)} d ago`;
}

const n = (v: unknown) => (Number(v) || 0).toLocaleString('en-IN');
const pieces = (o: any) => (o.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
const itemsLine = (o: any) => (o.items || []).map((it: any) => `${it.quantity}× ${it.name}`).join(', ');

function Hello({ subtitle, actions }: { subtitle: React.ReactNode; actions?: React.ReactNode }) {
    const user = useSelector((s: RootState) => s.auth.user);
    const { role: viewedRole } = useViewRole();
    const first = (user?.name || '').trim().split(/\s+/)[0];
    return (
        <PageHeader
            title={`${greeting()}${first ? `, ${first}` : ''}`}
            subtitle={<>{ROLE_LABEL[viewedRole || ''] || 'Staff'} · {subtitle}</>}
            actions={actions}
        />
    );
}

/** A small order row used by several dashboards. */
function OrderRow({ o, right }: { o: any; right?: React.ReactNode }) {
    const cfg = getStatusConfig(o.status);
    return (
        <div className="flex flex-col gap-3 border-t border-gray-100 py-3.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Link href={`${ORDERS}/${o._id}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{o.orderId}</Link>
                    <span className={cx('rounded-full px-2 py-0.5 text-[11px] font-medium', cfg.badgeBg, cfg.badgeText)}>{cfg.label}</span>
                    <span className="text-xs text-gray-400">{ago(o.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-gray-700">{o.shippingAddress?.fullName} · {o.shippingAddress?.phone}</p>
                <p className="truncate text-xs text-gray-500">{itemsLine(o)}</p>
            </div>
            {right && <div className="flex shrink-0 flex-wrap items-center gap-2">{right}</div>}
        </div>
    );
}

function EmptyState({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
            <span className="mb-2 text-gray-300">{icon}</span>
            {children}
        </div>
    );
}

/* ═══ Agency — the call queue ═══════════════════════════════ */

export function AgencyDashboard() {
    const { data: statsRes } = useGetOrderStatsQuery({});
    const { data: pendingRes, isLoading } = useGetAdminOrdersQuery({ status: 'pending', limit: 50, sort: 'createdAt' });
    const { data: doneRes } = useGetAdminOrdersQuery({ status: 'confirmed', limit: 30 });
    const [updateStatus, { isLoading: isConfirming }] = useUpdateOrderStatusMutation();
    const [cancelFor, setCancelFor] = useState<any>(null);
    const [busyId, setBusyId] = useState<string | null>(null);

    const s = statsRes?.data || {};
    const pending: any[] = pendingRes?.data || [];
    const confirmedToday: any[] = doneRes?.data || [];

    const confirm = async (o: any) => {
        setBusyId(o._id);
        try {
            await updateStatus({ id: o._id, status: 'confirmed', note: 'Confirmed by phone' }).unwrap();
            toast.success(`${o.orderId} confirmed — send the SMS from "Confirmed today"`);
        } catch (e) {
            toast.error(apiError(e, 'Could not confirm'));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div>
            <Hello subtitle="Call each customer, then confirm or cancel. Oldest first." />

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatTile label="Waiting for a call" value={n(s.pending)} icon={<LuPhoneCall size={18} />} hint="Pending orders" />
                <StatTile label="Confirmed by you today" value={n(s.mine?.confirmedToday)} icon={<LuCheck size={18} />} />
                <StatTile label="Cancelled by you today" value={n(s.mine?.cancelledToday)} icon={<LuX size={18} />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <Card title="Call queue" description="New orders from the website, oldest first">
                    {isLoading ? <div className="h-40 animate-pulse rounded-xl bg-gray-100" /> : pending.length === 0 ? (
                        <EmptyState icon={<LuCheck size={30} />}>No pending orders. Well done!</EmptyState>
                    ) : pending.map((o) => (
                        <div key={o._id} className="border-t border-gray-100 py-4 first:border-t-0 first:pt-0">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Link href={`${ORDERS}/${o._id}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{o.orderId}</Link>
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400"><LuClock size={12} /> {ago(o.createdAt)}</span>
                                    </div>
                                    <p className="mt-1 text-[15px] font-medium text-gray-900">{o.shippingAddress?.fullName}</p>
                                    <a href={`tel:${o.shippingAddress?.phone}`} className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                                        <LuPhoneCall size={14} /> {o.shippingAddress?.phone}
                                    </a>
                                    <p className="mt-1 text-xs text-gray-500">{[o.shippingAddress?.address, o.shippingAddress?.area, o.shippingAddress?.city].filter(Boolean).join(', ')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">{taka(o.total)}</p>
                                    <p className="text-xs text-gray-500">{paymentMethodLabel(o.paymentMethod || '')} · {pieces(o)} pcs</p>
                                </div>
                            </div>
                            <ul className="mt-2 space-y-0.5 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                {(o.items || []).map((it: any, i: number) => (
                                    <li key={i}>{it.quantity}× {it.name}{it.size ? <span className="text-gray-500"> · {it.size}</span> : null}</li>
                                ))}
                            </ul>
                            {o.note && <p className="mt-2 text-xs text-amber-700">Customer note: {o.note}</p>}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    disabled={isConfirming && busyId === o._id}
                                    onClick={() => confirm(o)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <LuCheck size={15} /> {isConfirming && busyId === o._id ? 'Confirming…' : 'Confirm'}
                                </button>
                                <Btn variant="secondary" icon={<LuX size={15} />} onClick={() => setCancelFor(o)}>Cancel</Btn>
                                <Btn variant="ghost" href={`${ORDERS}/${o._id}`}>Open</Btn>
                            </div>
                        </div>
                    ))}
                </Card>

                <Card title="Confirmed today" description="Send the SMS so the customer knows">
                    {confirmedToday.length === 0 ? (
                        <EmptyState icon={<LuSend size={26} />}>Orders you confirm today show up here.</EmptyState>
                    ) : confirmedToday.map((o) => (
                        <OrderRow key={o._id} o={o} right={<SmsButton order={o} compact />} />
                    ))}
                </Card>
            </div>

            {cancelFor && <CancelOrderModal order={cancelFor} open={!!cancelFor} onClose={() => setCancelFor(null)} />}
        </div>
    );
}

/* ═══ Factory — the scan queue ══════════════════════════════ */

export function FactoryDashboard() {
    const { data, isLoading } = useGetFactoryQueueQuery(undefined);
    const rows: any[] = data?.data || [];
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const groups = useMemo(() => {
        const waiting = rows.filter((r) => !r.job.issuedAt && r.job.unitsScanned === 0);
        const progress = rows.filter((r) => !r.job.issuedAt && r.job.unitsScanned > 0 && r.job.unitsScanned < r.job.unitsTotal);
        const ready = rows.filter((r) => !r.job.issuedAt && r.job.unitsTotal > 0 && r.job.unitsScanned >= r.job.unitsTotal);
        const issuedToday = rows.filter((r) => r.job.issuedAt && new Date(r.job.issuedAt) >= today);
        return { waiting, progress, ready, issuedToday };
    }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

    const open = [...groups.ready, ...groups.progress, ...groups.waiting];

    return (
        <div>
            <Hello subtitle="Scan each product once, then issue its challan."
                actions={<Btn variant="primary" icon={<LuScanBarcode size={16} />} href="/dashboard/admin/factory">Open scan station</Btn>} />

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile label="Waiting" value={n(groups.waiting.length)} icon={<LuClock size={18} />} hint="Not started" />
                <StatTile label="In progress" value={n(groups.progress.length)} icon={<LuFactory size={18} />} hint="Some pieces scanned" />
                <StatTile label="Ready to issue" value={n(groups.ready.length)} icon={<LuPackageCheck size={18} />} hint="All pieces scanned" />
                <StatTile label="Issued today" value={n(groups.issuedToday.length)} icon={<LuClipboardList size={18} />} />
            </div>

            <Card title="Challans to work on" description="Ready to issue first, then the ones in progress, then the oldest waiting">
                {isLoading ? <div className="h-40 animate-pulse rounded-xl bg-gray-100" /> : open.length === 0 ? (
                    <EmptyState icon={<LuFactory size={30} />}>Nothing waiting at the factory.</EmptyState>
                ) : open.slice(0, 20).map(({ order, job }) => {
                    const pct = job.unitsTotal ? Math.round((job.unitsScanned / job.unitsTotal) * 100) : 0;
                    const ready = job.unitsScanned >= job.unitsTotal;
                    return (
                        <div key={job._id} className="flex flex-col gap-3 border-t border-gray-100 py-3.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[15px] font-semibold text-gray-900">{job.challanNo}</span>
                                    <Badge tone="purple">{job.label}</Badge>
                                    <span className="text-xs text-gray-400">#{order.orderId} · confirmed {ago(order.confirmedAt || order.createdAt)}</span>
                                </div>
                                <p className="mt-0.5 truncate text-sm text-gray-600">{order.customer?.name} · {job.lines.map((l: any) => `${l.quantity}× ${l.name}`).join(', ')}</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
                                        <div className={cx('h-full rounded-full', ready ? 'bg-emerald-500' : 'bg-violet-500')} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{job.unitsScanned}/{job.unitsTotal} pcs</span>
                                </div>
                            </div>
                            <Btn variant={ready ? 'primary' : 'secondary'} href={`/dashboard/admin/factory?challan=${job.challanNo}`}>
                                {ready ? 'Issue challan' : 'Scan'} <LuArrowRight size={14} />
                            </Btn>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
}

/* ═══ Online sales — after confirmation ═════════════════════ */

export function SalesDashboard() {
    const { data: statsRes } = useGetOrderStatsQuery({});
    const { data: readyRes } = useGetAdminOrdersQuery({ status: 'challan_ready', limit: 10, sort: 'updatedAt' });
    const { data: courierRes } = useGetAdminOrdersQuery({ status: 'courier_entry', limit: 10, sort: 'updatedAt' });
    const s = statsRes?.data || {};
    const ready: any[] = readyRes?.data || [];
    const courier: any[] = courierRes?.data || [];
    const atFactory = (s.confirmed || 0) + (s.factory || 0);

    const tile = (label: string, value: unknown, status: string, icon: React.ReactNode, hint?: string) => (
        <Link href={`${ORDERS}?status=${status}`} className="block"><StatTile label={label} value={n(value)} icon={icon} hint={hint} /></Link>
    );

    return (
        <div>
            <Hello subtitle="Challans, memos, courier and returns."
                actions={<Btn variant="primary" icon={<LuShoppingCart size={16} />} href={ORDERS}>All orders</Btn>} />

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {tile('Pending', s.pending, 'pending', <LuPhoneCall size={18} />, 'Backup to agency')}
                <StatTile label="At the factory" value={n(atFactory)} icon={<LuFactory size={18} />} hint="Confirmed + in production" />
                {tile('Challan ready', s.challan_ready, 'challan_ready', <LuPackageCheck size={18} />, 'Pack & memo')}
                {tile('Courier entry', s.courier_entry, 'courier_entry', <LuTruck size={18} />, 'Book the parcel')}
                {tile('Shipped', s.shipped, 'shipped', <LuSend size={18} />, 'In transit')}
                {tile('Returned', s.returned, 'returned', <LuUndo2 size={18} />)}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card title="Ready to pack" description="Every challan issued — issue the memo and move to courier entry"
                    actions={<Btn variant="ghost" href={`${ORDERS}?status=challan_ready`}>See all</Btn>}>
                    {ready.length === 0 ? <EmptyState icon={<LuPackageCheck size={26} />}>Nothing ready yet.</EmptyState>
                        : ready.map((o) => <OrderRow key={o._id} o={o} right={<Btn href={`${ORDERS}/${o._id}`}>Open</Btn>} />)}
                </Card>
                <Card title="Courier entry" description="Book with Pathao and they move to Shipped"
                    actions={<Btn variant="ghost" href={`${ORDERS}?status=courier_entry`}>See all</Btn>}>
                    {courier.length === 0 ? <EmptyState icon={<LuTruck size={26} />}>No parcels waiting for the courier.</EmptyState>
                        : courier.map((o) => <OrderRow key={o._id} o={o} right={<Btn variant="primary" href={`${ORDERS}/${o._id}`}>Send</Btn>} />)}
                </Card>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/dashboard/admin/returns" className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50">
                    <span className="inline-flex items-center gap-2"><LuUndo2 size={17} className="text-gray-500" /> Returns from the courier</span><LuArrowRight size={15} />
                </Link>
                <Link href="/dashboard/admin/courier" className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50">
                    <span className="inline-flex items-center gap-2"><LuTruck size={17} className="text-gray-500" /> Courier parcels</span><LuArrowRight size={15} />
                </Link>
            </div>
        </div>
    );
}

/* ═══ Admin / manager — the whole pipeline ══════════════════ */

const PIPELINE: { key: string; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'factory', label: 'Factory' },
    { key: 'challan_ready', label: 'Challan ready' },
    { key: 'courier_entry', label: 'Courier entry' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
];

export function OverviewDashboard() {
    const { role } = useViewRole();
    const { data: statsRes, isLoading } = useGetOrderStatsQuery({});
    const { data: pendingRes } = useGetAdminOrdersQuery({ status: 'pending', limit: 6, sort: 'createdAt' });
    const { data: readyRes } = useGetAdminOrdersQuery({ status: 'challan_ready', limit: 6, sort: 'updatedAt' });
    const s = statsRes?.data || {};
    const pending: any[] = pendingRes?.data || [];
    const ready: any[] = readyRes?.data || [];
    const inFlow = (s.pending || 0) + (s.confirmed || 0) + (s.factory || 0) + (s.challan_ready || 0) + (s.courier_entry || 0);

    return (
        <div>
            <Hello subtitle="The order desk at a glance."
                actions={<>
                    <Btn icon={<LuShoppingCart size={15} />} href={ORDERS}>Orders</Btn>
                    {role !== 'manager' && <Btn icon={<LuScanBarcode size={15} />} href="/dashboard/admin/factory">Factory scan</Btn>}
                    <Btn variant="primary" icon={<LuChartColumn size={15} />} href="/dashboard/admin/analytics">Sales reports</Btn>
                </>} />

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatTile label="All orders" value={isLoading ? '…' : n(s.total)} icon={<LuShoppingCart size={18} />} />
                <StatTile label="In the pipeline" value={isLoading ? '…' : n(inFlow)} icon={<LuFactory size={18} />} hint="Pending to courier entry" />
                <StatTile label="Delivered revenue" value={s.totalRevenue !== undefined ? taka(s.totalRevenue) : '—'} icon={<LuChartColumn size={18} />} />
            </div>

            <Card title="Order pipeline" description="Click a step to open those orders" className="mb-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                    {PIPELINE.map((p) => {
                        const cfg = getStatusConfig(p.key);
                        return (
                            <Link key={p.key} href={`${ORDERS}?status=${p.key}`}
                                className="group rounded-xl border border-gray-200 px-3 py-3 transition hover:border-gray-300 hover:bg-gray-50">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <span className={cx('h-2 w-2 rounded-full', cfg.dot)} /> {p.label}
                                </span>
                                <span className="mt-1 block text-2xl font-semibold tracking-tight text-gray-900">{n(s[p.key])}</span>
                            </Link>
                        );
                    })}
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card title="Waiting for a call" description="Pending orders, oldest first — the agency's queue"
                    actions={<Btn variant="ghost" href={`${ORDERS}?status=pending`}>See all</Btn>}>
                    {pending.length === 0 ? <EmptyState icon={<LuPhoneCall size={26} />}>No pending orders.</EmptyState>
                        : pending.map((o) => <OrderRow key={o._id} o={o} right={<span className="text-sm font-semibold text-gray-900">{taka(o.total)}</span>} />)}
                </Card>
                <Card title="Ready for the courier" description="Every challan issued"
                    actions={<Btn variant="ghost" href={`${ORDERS}?status=challan_ready`}>See all</Btn>}>
                    {ready.length === 0 ? <EmptyState icon={<LuPackageCheck size={26} />}>Nothing ready yet.</EmptyState>
                        : ready.map((o) => <OrderRow key={o._id} o={o} right={<span className="text-sm font-semibold text-gray-900">{taka(o.total)}</span>} />)}
                </Card>
            </div>

            {can(role, 'createOrder') && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                        { href: '/dashboard/admin/customers', icon: <LuUsers size={17} />, label: 'Customers' },
                        { href: '/dashboard/admin/returns', icon: <LuUndo2 size={17} />, label: 'Returns' },
                        { href: '/dashboard/admin/sms', icon: <LuSend size={17} />, label: 'SMS log' },
                    ].map((l) => (
                        <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50">
                            <span className="inline-flex items-center gap-2 text-gray-800"><span className="text-gray-500">{l.icon}</span>{l.label}</span>
                            <LuArrowRight size={15} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

/** The right dashboard for whoever is signed in. Nothing renders until the role is known. */
export default function RoleDashboard() {
    const { role } = useViewRole();
    if (!role) return null;
    if (role === 'agency') return <AgencyDashboard />;
    if (role === 'factory') return <FactoryDashboard />;
    if (role === 'online_sales') return <SalesDashboard />;
    return <OverviewDashboard />;
}
