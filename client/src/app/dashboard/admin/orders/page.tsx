/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    LuPlus, LuDownload, LuEye, LuExternalLink, LuStickyNote, LuX, LuPackage, LuBarcode, LuReceiptText, LuRepeat,
    LuCheck, LuCopy, LuZap, LuFileText, LuTruck, LuArrowRight, LuSlidersHorizontal, LuColumns3, LuArrowUp,
    LuArrowDown, LuChevronsUpDown, LuChevronDown, LuBan, LuWallet, LuMapPin,
} from 'react-icons/lu';
import {
    useGetAdminOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useGetOrderStatsQuery,
    useAddAdminNoteMutation,
    useSendWithPathaoMutation,
} from '@/redux/api/orderApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetZonesQuery } from '@/redux/api/shippingApi';
import { BD_DIVISIONS, BD_DISTRICTS, getDivision, getDistrict, districtTerms, divisionTerms, zoneTerms } from '@/lib/bdGeo';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS_CONFIG, ORDER_DESK_STEPS, getStatusConfig, paymentMethodLabel, statusColor } from '@/lib/orderStatus';
import {
    PageHeader, Btn, SearchInput, SelectPill, Segmented, TableCard, TR, EmptyRow, SkeletonRows, RowMenu, Modal,
    TEXTAREA, taka, cx,
} from '@/components/admin/ui';
import { Dropdown, MenuItem, MenuLabel, MenuDivider, PillSelect, type PillOption } from '@/components/admin/orders/OrderListUi';
import { orderSummaryText, orderDivisions, divisionLabel, openOrderPapers, openOrdersPapers, type PaperKind } from '@/components/admin/orders/orderPapers';
import PrintOrdersModal, { type PrintJob, type PrintKind } from '@/components/admin/print/PrintOrdersModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/* ─── Options ────────────────────────────────────────────── */

const CLOSED = ['delivered', 'cancelled', 'returned', 'refunded'];

/** Status pills: the order desk's steps first, in order, then the closing states. */
const STATUS_PILLS: PillOption[] = [
    ...ORDER_DESK_STEPS.map((s) => ({ value: s, label: getStatusConfig(s).label, color: statusColor(s), group: 'Order desk' })),
    ...CLOSED.map((s) => ({ value: s, label: getStatusConfig(s).label, color: statusColor(s), group: 'Closed' })),
];

const PAYMENT: Record<string, { label: string; color: string }> = {
    pending: { label: 'Unpaid', color: '#DC2626' },
    paid: { label: 'Paid', color: '#059669' },
    failed: { label: 'Failed', color: '#B91C1C' },
    refunded: { label: 'Refunded', color: '#7C3AED' },
};
const PAYMENT_PILLS: PillOption[] = Object.entries(PAYMENT).map(([value, p]) => ({ value, ...p }));

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_CONFIG).map(([value, cfg]) => ({ value, label: cfg.label }));
const PAYMENT_OPTIONS = Object.entries(PAYMENT).map(([value, p]) => ({ value, label: p.label }));
const METHOD_OPTIONS = ['cod', 'bkash', 'nagad', 'rocket', 'sslcommerz'].map((m) => ({ value: m, label: paymentMethodLabel(m) }));
const DIVISION_OPTIONS = ['foam', 'mattress', 'fiber_pillow', 'hometex', 'chemicals'].map((d) => ({ value: d, label: divisionLabel(d) }));
const COURIER_OPTIONS = [{ value: 'unbooked', label: 'Not booked yet' }, { value: 'booked', label: 'Booked with courier' }];

const DATE_PRESETS = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
    { value: 'custom', label: 'Custom range…' },
];

const SORTS = [
    { value: '-createdAt', label: 'Newest first' },
    { value: 'createdAt', label: 'Oldest first' },
    { value: '-total', label: 'Amount: high to low' },
    { value: 'total', label: 'Amount: low to high' },
    { value: 'shippingAddress.fullName', label: 'Customer: A to Z' },
    { value: '-orderId', label: 'Order no: high to low' },
    { value: 'orderId', label: 'Order no: low to high' },
];

/** The table's columns, in the order the desk reads them. # and the checkbox always show. */
const COLUMNS = [
    { key: 'date', label: 'Date' },
    { key: 'order', label: 'Order No' },
    { key: 'customer', label: 'Customer' },
    { key: 'payment', label: 'Payment' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'next', label: 'Next step' },
] as const;
type ColKey = (typeof COLUMNS)[number]['key'];

const TILES = ['all', ...ORDER_DESK_STEPS, 'delivered', 'cancelled', 'returned'];

// Column choice, row height and page size are remembered per browser.
const VIEW_KEY = 'karmo.admin.orders.view';
const PAGE_SIZES = [25, 50, 100];

/* ─── Helpers ────────────────────────────────────────────── */

const customerName = (o: any) =>
    o.shippingAddress?.fullName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest';
const customerPhone = (o: any) => o.shippingAddress?.phone || o.user?.phone || '';
const customerPlace = (o: any) => [o.shippingAddress?.area, o.shippingAddress?.city].filter(Boolean).join(', ');
const consignment = (o: any) =>
    o.consignmentId || (o.packages || []).map((p: any) => p.consignmentId).filter(Boolean).join(', ');
const pieces = (o: any) => (o.items || []).reduce((n: number, it: any) => n + (Number(it.quantity) || 0), 0);

/** What has been paid and what is still owed on an order. */
function money(o: any) {
    const total = Number(o.total || 0);
    if (o.paymentStatus === 'paid') return { paid: total, due: 0 };
    if (o.paymentStatus === 'refunded') return { paid: 0, due: 0, refunded: true };
    // A cancelled order is owed nothing.
    if (o.status === 'cancelled') return { paid: 0, due: 0 };
    return { paid: 0, due: total };
}

const fmtDay = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (d?: string) => d ? new Date(d).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
const isToday = (d?: string) => !!d && new Date(d).toDateString() === new Date().toDateString();

/** A date preset → the start and end of those local days, as ISO moments for the server. */
function dateRange(preset: string, from: string, to: string): { from?: string; to?: string } {
    const sod = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
    const eod = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };
    const now = new Date();
    const ago = (n: number) => { const x = new Date(now); x.setDate(x.getDate() - n); return x; };
    let a: Date | undefined;
    let b: Date | undefined;
    switch (preset) {
        case 'today': a = sod(now); b = eod(now); break;
        case 'yesterday': a = sod(ago(1)); b = eod(ago(1)); break;
        case '7d': a = sod(ago(6)); b = eod(now); break;
        case '30d': a = sod(ago(29)); b = eod(now); break;
        case 'this_month': a = new Date(now.getFullYear(), now.getMonth(), 1); b = eod(now); break;
        case 'last_month': a = new Date(now.getFullYear(), now.getMonth() - 1, 1); b = eod(new Date(now.getFullYear(), now.getMonth(), 0)); break;
        case 'custom':
            if (from) a = sod(new Date(`${from}T00:00:00`));
            if (to) b = eod(new Date(`${to}T00:00:00`));
            break;
    }
    return { from: a?.toISOString(), to: b?.toISOString() };
}

function useDebounced<T>(value: T, ms = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
    return v;
}

const apiError = (e: unknown, fallback: string) => (e as { data?: { message?: string } })?.data?.message || fallback;

/* ─── Small pieces ───────────────────────────────────────── */

/**
 * Same phone, same day. Two parcels to one customer are paid for twice at the courier
 * and are often one order placed again by mistake, so the row links straight to the
 * other order. The server works this out (repeatToday on each order).
 */
function RepeatTodayChip({ info }: { info?: { count: number; position: number; other: { _id: string; orderId: string } } | null }) {
    if (!info?.other?._id) return null;
    const nth = (n: number) => (n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`);
    const label = info.position > 1 ? `${nth(info.position)} order today` : `1st of ${info.count} today`;
    return (
        <Link
            href={`/dashboard/admin/orders/${info.other._id}`}
            title={`Same phone ordered ${info.count} times today — open ${info.other.orderId}`}
            className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
        >
            <LuRepeat size={11} /> {label}
        </Link>
    );
}

const ACTION = 'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-semibold transition disabled:opacity-50';

/** A filled action button in a status's colour (Confirm, Copy Summary…). */
function SolidAction({ color, icon, onClick, disabled, children }: {
    color: string; icon?: React.ReactNode; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={cx(ACTION, 'text-white shadow-sm hover:brightness-95')} style={{ background: color }}>
            {icon}{children}
        </button>
    );
}

/** The small arrow that moves an order on to its next desk step. */
function NextArrow({ to, onClick, disabled }: { to: string; onClick: () => void; disabled?: boolean }) {
    const color = statusColor(to);
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={`Move to ${getStatusConfig(to).label}`}
            aria-label={`Move to ${getStatusConfig(to).label}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border transition hover:brightness-95 disabled:opacity-50"
            style={{ borderColor: `${color}55`, color, background: `${color}0F` }}
        >
            <LuArrowRight size={14} />
        </button>
    );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-xs font-medium text-gray-500">{label}</p>
            {children}
        </div>
    );
}

const PILL_INPUT = 'h-9 w-full rounded-full border border-transparent bg-gray-100 px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary-border)] focus:bg-white';
const DARK_BTN = 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20';

/* ─── Page ───────────────────────────────────────────────── */

// useSearchParams needs a Suspense boundary (Next.js falls back to client rendering up to it).
export default function OrdersPage() {
    return (
        <Suspense fallback={null}>
            <OrdersPageInner />
        </Suspense>
    );
}

function OrdersPageInner() {
    // ?status=pending (the Dashboard's links) pre-selects the status filter.
    const statusParam = useSearchParams().get('status');

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(
        statusParam && Object.prototype.hasOwnProperty.call(ORDER_STATUS_CONFIG, statusParam) ? statusParam : 'all',
    );
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [productFilter, setProductFilter] = useState('all');
    const [divisionFilter, setDivisionFilter] = useState('all');
    const [courierFilter, setCourierFilter] = useState('all');
    const [datePreset, setDatePreset] = useState('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [minTotal, setMinTotal] = useState('');
    const [maxTotal, setMaxTotal] = useState('');
    const [geoDivision, setGeoDivision] = useState('all');
    const [geoDistrict, setGeoDistrict] = useState('all');
    const [zoneFilter, setZoneFilter] = useState('all');
    const [sort, setSort] = useState('-createdAt');
    const [showFilters, setShowFilters] = useState(false);

    // View (remembered)
    const [hidden, setHidden] = useState<Set<ColKey>>(new Set());
    const [dense, setDense] = useState(false);
    const [pageSize, setPageSize] = useState(50);
    const [visible, setVisible] = useState(50);
    const viewLoaded = useRef(false);

    // Work
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [busyId, setBusyId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [noteFor, setNoteFor] = useState<any>(null);
    const [noteText, setNoteText] = useState('');
    const [printJob, setPrintJob] = useState<PrintJob | null>(null);

    const q = useDebounced(search);
    const minQ = useDebounced(minTotal, 500);
    const maxQ = useDebounced(maxTotal, 500);
    const range = useMemo(() => dateRange(datePreset, customFrom, customTo), [datePreset, customFrom, customTo]);

    // Delivery zones are kept in Shipping → Zones (a name + the districts it covers).
    const { data: zonesData } = useGetZonesQuery(undefined);
    const zones: any[] = useMemo(() => {
        const list = (zonesData as any)?.data ?? zonesData;
        return Array.isArray(list) ? list : [];
    }, [zonesData]);

    // Location → every spelling of the place, for the server to match in the address.
    const places = useMemo(() => {
        const dist = geoDistrict !== 'all' ? getDistrict(geoDistrict) : undefined;
        const div = !dist && geoDivision !== 'all' ? getDivision(geoDivision) : undefined;
        const terms = dist ? districtTerms(dist) : div ? divisionTerms(div) : [];
        return terms.length ? terms.join('|') : undefined;
    }, [geoDivision, geoDistrict]);
    const zonePlaces = useMemo(() => {
        const z = zoneFilter !== 'all' ? zones.find((zz) => zz._id === zoneFilter) : undefined;
        return z ? zoneTerms(z).join('|') : undefined;
    }, [zoneFilter, zones]);
    const districtOptions = useMemo(() => {
        const list = geoDivision !== 'all' ? BD_DISTRICTS.filter((x) => x.division === geoDivision) : BD_DISTRICTS;
        return list.map((x) => ({ value: x.key, label: `${x.name} · ${x.bn}` }));
    }, [geoDivision]);

    useEffect(() => {
        try {
            const v = JSON.parse(localStorage.getItem(VIEW_KEY) || '{}');
            if (Array.isArray(v.hidden)) setHidden(new Set(v.hidden));
            if (typeof v.dense === 'boolean') setDense(v.dense);
            if (PAGE_SIZES.includes(v.pageSize)) { setPageSize(v.pageSize); setVisible(v.pageSize); }
        } catch { /* private window — defaults are fine */ }
        viewLoaded.current = true;
    }, []);
    useEffect(() => {
        if (!viewLoaded.current) return;
        try { localStorage.setItem(VIEW_KEY, JSON.stringify({ hidden: Array.from(hidden), dense, pageSize })); } catch { /* ignore */ }
    }, [hidden, dense, pageSize]);

    const { data: ordersData, isLoading, isFetching } = useGetAdminOrdersQuery({
        page: 1,
        limit: visible,
        sort,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
        paymentMethod: methodFilter !== 'all' ? methodFilter : undefined,
        'items.product': productFilter !== 'all' ? productFilter : undefined,
        division: divisionFilter !== 'all' ? divisionFilter : undefined,
        courier: courierFilter !== 'all' ? courierFilter : undefined,
        searchTerm: q.trim() || undefined,
        dateFrom: range.from,
        dateTo: range.to,
        minTotal: minQ || undefined,
        maxTotal: maxQ || undefined,
        places,
        zonePlaces,
    });
    const { data: statsData } = useGetOrderStatsQuery({});
    const { data: productsData } = useGetProductsQuery({ limit: 200, sort: 'name', fields: 'name' });
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [updatePayment] = useUpdatePaymentStatusMutation();
    const [sendWithPathao] = useSendWithPathaoMutation();
    const [addNote, { isLoading: isSavingNote }] = useAddAdminNoteMutation();
    // Editors confirm orders and print; payments are for admins.
    const isEditor = useSelector((s: RootState) => s.auth.user?.role) === 'editor';

    const orders: any[] = ordersData?.data || [];
    const meta = ordersData?.meta || { total: 0, totalPages: 1 };
    const stats = statsData?.data || {};
    const products: any[] = productsData?.data || [];
    const hasMore = orders.length < (meta.total || 0);
    const show = (k: ColKey) => !hidden.has(k);
    const colCount = 3 + COLUMNS.filter((c) => show(c.key)).length;

    // Any change of filter goes back to the first page and starts a fresh selection.
    const resetPage = () => { setVisible(pageSize); setSelected(new Set()); };
    const withReset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); resetPage(); };

    const shownTotals = useMemo(() => orders.reduce((acc, o) => {
        const m = money(o);
        if (o.status !== 'cancelled') acc.value += Number(o.total || 0);
        acc.due += m.due;
        return acc;
    }, { value: 0, due: 0 }), [orders]);

    /* ── Single-order actions ── */

    const move = async (o: any, to: string) => {
        if (to === 'cancelled' && !window.confirm(`Cancel order ${o.orderId}?`)) return;
        setBusyId(o._id);
        try {
            await updateStatus({ id: o._id, status: to }).unwrap();
            toast.success(`${o.orderId} → ${getStatusConfig(to).label}`);
        } catch (err) {
            toast.error(apiError(err, 'Failed to update status'));
        } finally {
            setBusyId(null);
        }
    };

    const setPayment = async (o: any, to: string) => {
        try {
            await updatePayment({ id: o._id, paymentStatus: to }).unwrap();
            toast.success(`${o.orderId} marked ${PAYMENT[to]?.label || to}`);
        } catch (err) {
            toast.error(apiError(err, 'Failed to update payment'));
        }
    };

    const copySummary = async (o: any) => {
        try {
            await navigator.clipboard.writeText(orderSummaryText(o));
            setCopiedId(o._id);
            toast.success(`${o.orderId} summary copied`);
            setTimeout(() => setCopiedId((id) => (id === o._id ? null : id)), 2000);
        } catch {
            toast.error('Could not copy — your browser blocked the clipboard');
        }
    };

    const papers = (o: any, paper: PaperKind) => {
        try { openOrderPapers(o, paper); } catch (e) { toast.error((e as Error).message || 'Could not open the papers'); }
    };

    const pathao = async (o: any) => {
        setBusyId(o._id);
        try {
            const res = await sendWithPathao(o._id).unwrap();
            const cid = (res?.data as any)?.consignmentId;
            toast.success(cid ? `${o.orderId} sent with Pathao — ${cid}` : `${o.orderId} sent with Pathao`);
        } catch (e) {
            toast.error(apiError(e, 'Pathao did not take the parcel'), { duration: 7000 });
        } finally {
            setBusyId(null);
        }
    };

    const exportOrdersCsv = (list: any[], suffix: string) => {
        if (!list.length) { toast.error('No orders to export'); return; }
        const headers = ['SL', 'Date', 'Time', 'Order No', 'Customer', 'Phone', 'Address', 'Pieces', 'Products', 'Total', 'Paid', 'Due', 'Payment Method', 'Payment Status', 'Status', 'Consignment'];
        const escapeCell = (val: any) => {
            const s = String(val ?? '');
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const rows = list.map((o: any, i: number) => {
            const m = money(o);
            const a = o.shippingAddress || {};
            return [
                i + 1, fmtDay(o.createdAt), fmtTime(o.createdAt), o.orderId || o._id, customerName(o), customerPhone(o),
                [a.address, a.area, a.city].filter(Boolean).join(', '), pieces(o),
                (o.items || []).map((it: any) => `${it.quantity} x ${it.name}`).join('; '),
                o.total ?? 0, m.paid, m.due,
                o.paymentMethod ? paymentMethodLabel(o.paymentMethod) : '',
                PAYMENT[o.paymentStatus]?.label || o.paymentStatus || '',
                getStatusConfig(o.status).label, consignment(o),
            ];
        });
        const csv = [headers, ...rows].map((r) => r.map(escapeCell).join(',')).join('\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${list.length} orders`);
    };

    /* ── Bulk selection ── */

    const allSelected = orders.length > 0 && orders.every((o: any) => selected.has(o._id));
    const someSelected = selected.size > 0 && !allSelected;
    const selectedOrders = orders.filter((o: any) => selected.has(o._id));

    const toggleOne = (id: string) => setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
    const toggleAll = () => setSelected((prev) => {
        const next = new Set(prev);
        if (orders.every((o: any) => next.has(o._id))) orders.forEach((o: any) => next.delete(o._id));
        else orders.forEach((o: any) => next.add(o._id));
        return next;
    });
    const clearSelection = () => setSelected(new Set());

    // Labels / invoices for the selected orders, in the order the table shows them.
    const printSelected = (kind: PrintKind) => {
        const shown = selectedOrders.map((o: any) => o._id as string);
        const others = Array.from(selected).filter((id) => !shown.includes(id));
        setPrintJob({ kind, ids: [...shown, ...others] });
    };

    const runBulk = async (label: string, fn: (id: string) => Promise<unknown>) => {
        const ids = Array.from(selected);
        if (!ids.length) return;
        const tId = toast.loading(`Updating ${ids.length} order${ids.length > 1 ? 's' : ''}…`);
        const results = await Promise.allSettled(ids.map(fn));
        const ok = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.length - ok;
        if (ok > 0) toast.success(`${ok} order${ok > 1 ? 's' : ''} ${label}${failed ? ` · ${failed} failed` : ''}`, { id: tId });
        else toast.error('Could not update the selected orders', { id: tId });
        clearSelection();
    };

    const bulkStatus = (to: string) => {
        if (to === 'cancelled' && !window.confirm(`Cancel ${selected.size} order${selected.size > 1 ? 's' : ''}?`)) return;
        runBulk(`moved to ${getStatusConfig(to).label}`, (id) => updateStatus({ id, status: to }).unwrap());
    };
    const bulkPayment = (to: string) =>
        runBulk(`marked ${PAYMENT[to]?.label || to}`, (id) => updatePayment({ id, paymentStatus: to }).unwrap());

    const bulkCopy = async () => {
        try {
            await navigator.clipboard.writeText(selectedOrders.map(orderSummaryText).join('\n\n────────────\n\n'));
            toast.success(`${selectedOrders.length} summaries copied`);
        } catch {
            toast.error('Could not copy — your browser blocked the clipboard');
        }
    };
    const bulkPapers = (paper: 'all' | 'memo' | 'challans') => {
        try { openOrdersPapers(selectedOrders, paper); } catch (e) { toast.error((e as Error).message || 'Could not open the papers'); }
    };

    const saveNote = async () => {
        if (!noteText.trim()) { toast.error('Write a note first'); return; }
        try {
            await addNote({ id: noteFor._id, note: noteText.trim() }).unwrap();
            toast.success('Note added to the order timeline');
            setNoteFor(null);
            setNoteText('');
        } catch (err) {
            toast.error(apiError(err, 'Failed to add note'));
        }
    };

    /* ── Filter chips ── */

    const label = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label || v;
    const chips = [
        statusFilter !== 'all' && { key: 'status', text: `Status: ${getStatusConfig(statusFilter).label}`, clear: () => setStatusFilter('all') },
        datePreset !== 'all' && {
            key: 'date',
            text: datePreset === 'custom' ? `Date: ${customFrom || '…'} → ${customTo || '…'}` : `Date: ${label(DATE_PRESETS, datePreset)}`,
            clear: () => { setDatePreset('all'); setCustomFrom(''); setCustomTo(''); },
        },
        paymentFilter !== 'all' && { key: 'payment', text: `Payment: ${PAYMENT[paymentFilter]?.label}`, clear: () => setPaymentFilter('all') },
        methodFilter !== 'all' && { key: 'method', text: `Method: ${paymentMethodLabel(methodFilter)}`, clear: () => setMethodFilter('all') },
        productFilter !== 'all' && { key: 'product', text: `Product: ${products.find((p) => p._id === productFilter)?.name || '…'}`, clear: () => setProductFilter('all') },
        geoDivision !== 'all' && { key: 'geoDivision', text: `Division: ${getDivision(geoDivision)?.name}`, clear: () => { setGeoDivision('all'); setGeoDistrict('all'); } },
        geoDistrict !== 'all' && { key: 'geoDistrict', text: `District: ${getDistrict(geoDistrict)?.name}`, clear: () => setGeoDistrict('all') },
        zoneFilter !== 'all' && { key: 'zone', text: `Zone: ${zones.find((z) => z._id === zoneFilter)?.name || '…'}`, clear: () => setZoneFilter('all') },
        divisionFilter !== 'all' && { key: 'division', text: `Product division: ${divisionLabel(divisionFilter)}`, clear: () => setDivisionFilter('all') },
        courierFilter !== 'all' && { key: 'courier', text: `Courier: ${label(COURIER_OPTIONS, courierFilter)}`, clear: () => setCourierFilter('all') },
        (minTotal || maxTotal) && { key: 'amount', text: `Amount: ${minTotal ? taka(Number(minTotal)) : '৳0'} – ${maxTotal ? taka(Number(maxTotal)) : 'any'}`, clear: () => { setMinTotal(''); setMaxTotal(''); } },
        search.trim() && { key: 'search', text: `“${search.trim()}”`, clear: () => setSearch('') },
    ].filter(Boolean) as { key: string; text: string; clear: () => void }[];
    const advancedCount = [methodFilter, productFilter, divisionFilter, courierFilter, geoDivision, geoDistrict, zoneFilter]
        .filter((v) => v !== 'all').length + (minTotal || maxTotal ? 1 : 0);

    const clearAll = () => {
        setStatusFilter('all'); setPaymentFilter('all'); setMethodFilter('all'); setProductFilter('all');
        setDivisionFilter('all'); setCourierFilter('all'); setDatePreset('all'); setCustomFrom(''); setCustomTo('');
        setMinTotal(''); setMaxTotal(''); setSearch('');
        setGeoDivision('all'); setGeoDistrict('all'); setZoneFilter('all');
        resetPage();
    };

    // A district belongs to one division: picking it sets the division; a new division drops a district outside it.
    const pickDivision = (v: string) => {
        setGeoDivision(v);
        if (v !== 'all' && geoDistrict !== 'all' && getDistrict(geoDistrict)?.division !== v) setGeoDistrict('all');
        resetPage();
    };
    const pickDistrict = (v: string) => {
        setGeoDistrict(v);
        if (v !== 'all') setGeoDivision(getDistrict(v)?.division || 'all');
        resetPage();
    };

    /* ── Columns / sorting ── */

    const toggleCol = (k: ColKey) => setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(k)) next.delete(k); else next.add(k);
        return next;
    });

    const th = 'px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap';
    const td = cx('px-3 text-sm text-gray-700 align-middle', dense ? 'py-2' : 'py-3.5');

    /** A header that sorts by its column; clicking again flips the direction. */
    const sortTh = (text: string, field: string, { right = false, firstDesc = false } = {}) => {
        const dir = sort === field ? 'asc' : sort === `-${field}` ? 'desc' : null;
        const nextSort = dir === 'asc' ? `-${field}` : dir === 'desc' ? field : firstDesc ? `-${field}` : field;
        return (
            <th className={cx(th, right && 'text-right')}>
                <button type="button" onClick={() => { setSort(nextSort); resetPage(); }}
                    className={cx('inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-gray-900', dir && 'text-gray-900')}>
                    {text}
                    {dir === 'asc' ? <LuArrowUp size={12} /> : dir === 'desc' ? <LuArrowDown size={12} /> : <LuChevronsUpDown size={12} className="opacity-40" />}
                </button>
            </th>
        );
    };

    /* ── Row pieces ── */

    const papersMenu = (o: any) => (
        <Dropdown
            ariaLabel="Papers"
            width={220}
            buttonClassName={cx(ACTION, 'bg-[#2373B5] text-white shadow-sm hover:bg-[#1d6199]')}
            button={<><LuFileText size={13} /> Papers <LuChevronDown size={12} className="opacity-80" /></>}
        >
            {(close) => <>
                <MenuItem icon={<LuZap size={14} className="text-amber-500" />} onClick={() => { close(); papers(o, { kind: 'all' }); }}>Download All</MenuItem>
                <MenuItem icon={<LuReceiptText size={14} />} onClick={() => { close(); papers(o, { kind: 'memo' }); }}>Download Memo</MenuItem>
                {orderDivisions(o).length > 0 && <><MenuDivider /><MenuLabel>Challans</MenuLabel></>}
                {orderDivisions(o).map((d) => (
                    <MenuItem key={d} icon={<LuFileText size={14} />} onClick={() => { close(); papers(o, { kind: 'challan', division: d }); }}>
                        Challan: {divisionLabel(d)}
                    </MenuItem>
                ))}
            </>}
        </Dropdown>
    );

    /** The one thing to do next at the order desk, by status — as on the desk sheet. */
    const nextStep = (o: any) => {
        const busy = busyId === o._id;
        switch (o.status) {
            case 'pending':
                return <SolidAction color={statusColor('confirmed')} icon={<LuCheck size={13} />} disabled={busy} onClick={() => move(o, 'confirmed')}>Confirm</SolidAction>;
            case 'confirmed':
                return (
                    <div className="flex items-center gap-1.5">
                        <SolidAction color="#2373B5" icon={copiedId === o._id ? <LuCheck size={13} /> : <LuCopy size={13} />} onClick={() => copySummary(o)}>Copy Summary</SolidAction>
                        <NextArrow to="factory" disabled={busy} onClick={() => move(o, 'factory')} />
                    </div>
                );
            case 'factory':
                return (
                    <div className="flex items-center gap-1.5">
                        {papersMenu(o)}
                        <NextArrow to="challan_ready" disabled={busy} onClick={() => move(o, 'challan_ready')} />
                    </div>
                );
            case 'challan_ready':
                return (
                    <button type="button" disabled={busy} onClick={() => move(o, 'courier_entry')}
                        className={cx(ACTION, 'border hover:brightness-95')}
                        style={{ borderColor: `${statusColor('courier_entry')}66`, color: '#238A00', background: `${statusColor('courier_entry')}12` }}>
                        Courier entry <LuArrowRight size={13} />
                    </button>
                );
            case 'courier_entry':
                return (
                    <button type="button" disabled={busy} onClick={() => pathao(o)}
                        className={cx(ACTION, 'border border-gray-400 bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200')}>
                        <LuTruck size={13} /> {busy ? 'Sending…' : 'Send with Pathao'}
                    </button>
                );
            case 'shipped':
            case 'delivered': {
                const cid = consignment(o);
                return cid ? (
                    <div className="text-xs leading-tight">
                        <p className="font-medium text-gray-700">{o.carrier || 'Courier'} · {cid}</p>
                        {o.courierStatus && <p className="mt-0.5 text-gray-400">{o.courierStatus}</p>}
                    </div>
                ) : <span className="text-xs text-gray-400">Handed to courier</span>;
            }
            default:
                return <span className="text-xs text-gray-300">—</span>;
        }
    };

    const rowMenu = (o: any) => (
        <RowMenu items={[
            { label: 'Open full page', icon: <LuExternalLink size={15} />, href: `/dashboard/admin/orders/${o._id}` },
            { label: 'Add note', icon: <LuStickyNote size={15} />, onClick: () => { setNoteFor(o); setNoteText(''); } },
            { label: 'Copy summary', icon: <LuCopy size={15} />, onClick: () => copySummary(o) },
            { label: 'Memo & challans', icon: <LuFileText size={15} />, onClick: () => papers(o, { kind: 'all' }) },
            { label: 'Print invoice', icon: <LuReceiptText size={15} />, onClick: () => setPrintJob({ kind: 'invoices', ids: [o._id] }) },
            { label: 'Print label', icon: <LuBarcode size={15} />, onClick: () => setPrintJob({ kind: 'labels', ids: [o._id] }) },
            { label: 'Cancel order', icon: <LuBan size={15} />, danger: true, hidden: CLOSED.includes(o.status) || o.status === 'shipped', onClick: () => move(o, 'cancelled') },
        ]} />
    );

    const itemsLine = (o: any) => {
        const items = o.items || [];
        if (!items.length) return null;
        const more = items.length - 1;
        return (
            <p className="mt-0.5 max-w-[230px] truncate text-xs text-gray-500" title={items.map((it: any) => `${it.quantity} × ${it.name}`).join('\n')}>
                {pieces(o)} pc{pieces(o) === 1 ? '' : 's'} · {items[0].name}{more > 0 ? ` +${more}` : ''}
            </p>
        );
    };

    const statusPill = (o: any) => (
        <PillSelect ariaLabel="Order status" value={o.status || 'pending'} options={STATUS_PILLS}
            fallbackLabel={getStatusConfig(o.status).label} onChange={(v) => move(o, v)} />
    );
    const paymentPill = (o: any) => (
        <PillSelect ariaLabel="Payment status" variant="soft" value={o.paymentStatus || 'pending'} options={PAYMENT_PILLS}
            disabled={isEditor} onChange={(v) => setPayment(o, v)} />
    );

    /* ── Render ── */

    return (
        <div>
            <PageHeader
                title="Orders"
                subtitle="Every sales order — from the store and taken by phone — from first call to the courier."
                actions={<>
                    <Btn icon={<LuDownload size={15} />} onClick={() => exportOrdersCsv(orders, 'orders')}>Export</Btn>
                    <Btn variant="primary" icon={<LuPlus size={16} />} href="/dashboard/admin/orders/new">New order</Btn>
                </>}
            />

            {/* Status tiles — one per step, in the desk's colours */}
            <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5 2xl:grid-cols-10">
                {TILES.map((key) => {
                    const active = statusFilter === key;
                    const color = key === 'all' ? '#111827' : statusColor(key);
                    const value = key === 'all' ? stats.total : stats[key];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { setStatusFilter(active && key !== 'all' ? 'all' : key); resetPage(); }}
                            className={cx('relative overflow-hidden rounded-xl border bg-white px-3.5 pb-3 pt-3.5 text-left transition', !active && 'border-gray-200 hover:border-gray-300')}
                            style={active ? { borderColor: color, boxShadow: `0 0 0 3px ${color}1F`, background: `${color}08` } : undefined}
                        >
                            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: color }} />
                            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-gray-500">
                                {key !== 'all' && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />}
                                {key === 'all' ? 'All orders' : getStatusConfig(key).label}
                            </p>
                            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-gray-900">{Number(value || 0).toLocaleString('en-IN')}</p>
                        </button>
                    );
                })}
            </div>

            {/* Main filters */}
            <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
                <SearchInput className="lg:w-80" value={search} onChange={withReset(setSearch)} placeholder="Order no, customer, phone, consignment…" />
                <SelectPill ariaLabel="Date" className="lg:w-40" value={datePreset} onChange={withReset(setDatePreset)} options={DATE_PRESETS} />
                {datePreset === 'custom' && (
                    <div className="flex items-center gap-1.5">
                        <input type="date" aria-label="From date" className={cx(PILL_INPUT, 'lg:w-40')} value={customFrom} max={customTo || undefined}
                            onChange={(e) => { setCustomFrom(e.target.value); resetPage(); }} />
                        <span className="text-gray-400">–</span>
                        <input type="date" aria-label="To date" className={cx(PILL_INPUT, 'lg:w-40')} value={customTo} min={customFrom || undefined}
                            onChange={(e) => { setCustomTo(e.target.value); resetPage(); }} />
                    </div>
                )}
                <SelectPill ariaLabel="Payment status" className="lg:w-40" value={paymentFilter} onChange={withReset(setPaymentFilter)}
                    options={[{ value: 'all', label: 'All payments' }, ...PAYMENT_OPTIONS]} />
                <SelectPill ariaLabel="Sort" className="lg:w-52" value={sort} onChange={withReset(setSort)} options={SORTS} />

                <div className="flex items-center gap-2 lg:ml-auto">
                    <Btn
                        icon={<LuSlidersHorizontal size={15} />}
                        onClick={() => setShowFilters((s) => !s)}
                        className={cx(showFilters && 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800')}
                    >
                        Filters
                        {advancedCount > 0 && (
                            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[11px] text-white">{advancedCount}</span>
                        )}
                    </Btn>
                    <Dropdown
                        ariaLabel="Customize columns"
                        width={240}
                        align="right"
                        buttonClassName="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        button={<><LuColumns3 size={15} /> Columns</>}
                    >
                        {() => <>
                            <MenuLabel>Show columns</MenuLabel>
                            {COLUMNS.map((c) => (
                                <label key={c.key} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <input type="checkbox" checked={show(c.key)} onChange={() => toggleCol(c.key)}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]" />
                                    {c.label}
                                </label>
                            ))}
                            <MenuDivider />
                            <MenuLabel>Row height</MenuLabel>
                            <div className="px-2 pb-2">
                                <Segmented value={dense ? 'compact' : 'comfortable'} onChange={(v) => setDense(v === 'compact')}
                                    options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} />
                            </div>
                            <MenuDivider />
                            <MenuItem onClick={() => { setHidden(new Set()); setDense(false); }}>Reset view</MenuItem>
                        </>}
                    </Dropdown>
                </div>
            </div>

            {/* More filters */}
            {showFilters && (
                <div className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        <LuMapPin size={13} /> Location
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <FilterField label="Division · বিভাগ">
                            <SelectPill ariaLabel="Division" value={geoDivision} onChange={pickDivision}
                                options={[{ value: 'all', label: 'All divisions' }, ...BD_DIVISIONS.map((v) => ({ value: v.key, label: `${v.name} · ${v.bn}` }))]} />
                        </FilterField>
                        <FilterField label="District · জেলা">
                            <SelectPill ariaLabel="District" value={geoDistrict} onChange={pickDistrict}
                                options={[{ value: 'all', label: geoDivision !== 'all' ? `All districts of ${getDivision(geoDivision)?.name}` : 'All districts' }, ...districtOptions]} />
                        </FilterField>
                        <FilterField label="Zone · জোন">
                            {zones.length > 0 ? (
                                <SelectPill ariaLabel="Zone" value={zoneFilter} onChange={withReset(setZoneFilter)}
                                    options={[{ value: 'all', label: 'All zones' }, ...zones.map((z) => ({
                                        value: z._id,
                                        label: `${z.name}${z.regions?.length ? ` (${z.regions.length} district${z.regions.length > 1 ? 's' : ''})` : ''}`,
                                    }))]} />
                            ) : (
                                <Link href="/dashboard/admin/shipping" className="flex h-9 items-center rounded-full border border-dashed border-gray-300 px-4 text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-800">
                                    No zones yet — add them in Shipping
                                </Link>
                            )}
                        </FilterField>
                    </div>
                    {zoneFilter !== 'all' && (() => {
                        const z = zones.find((zz) => zz._id === zoneFilter);
                        return z?.regions?.length ? (
                            <p className="mt-2 text-xs text-gray-400">{z.name} covers: {z.regions.join(', ')}</p>
                        ) : null;
                    })()}

                    <div className="my-4 h-px bg-gray-100" />
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Order</p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <FilterField label="Order status">
                        <SelectPill ariaLabel="Order status" value={statusFilter} onChange={withReset(setStatusFilter)}
                            options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
                    </FilterField>
                    <FilterField label="Payment method">
                        <SelectPill ariaLabel="Payment method" value={methodFilter} onChange={withReset(setMethodFilter)}
                            options={[{ value: 'all', label: 'All methods' }, ...METHOD_OPTIONS]} />
                    </FilterField>
                    <FilterField label="Product">
                        <SelectPill ariaLabel="Product" value={productFilter} onChange={withReset(setProductFilter)}
                            options={[{ value: 'all', label: 'All products' }, ...products.map((p) => ({ value: p._id, label: p.name }))]} />
                    </FilterField>
                    <FilterField label="Product division">
                        <SelectPill ariaLabel="Product division" value={divisionFilter} onChange={withReset(setDivisionFilter)}
                            options={[{ value: 'all', label: 'Foam, mattress, all…' }, ...DIVISION_OPTIONS]} />
                    </FilterField>
                    <FilterField label="Courier">
                        <SelectPill ariaLabel="Courier" value={courierFilter} onChange={withReset(setCourierFilter)}
                            options={[{ value: 'all', label: 'Any' }, ...COURIER_OPTIONS]} />
                    </FilterField>
                    <FilterField label="Amount (৳)">
                        <div className="flex items-center gap-1.5">
                            <input type="number" min={0} inputMode="numeric" placeholder="Min" aria-label="Minimum amount" className={PILL_INPUT}
                                value={minTotal} onChange={(e) => { setMinTotal(e.target.value); resetPage(); }} />
                            <span className="text-gray-400">–</span>
                            <input type="number" min={0} inputMode="numeric" placeholder="Max" aria-label="Maximum amount" className={PILL_INPUT}
                                value={maxTotal} onChange={(e) => { setMaxTotal(e.target.value); resetPage(); }} />
                        </div>
                    </FilterField>
                    </div>
                </div>
            )}

            {/* Active filters */}
            {chips.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {chips.map((c) => (
                        <span key={c.key} className="inline-flex h-7 items-center gap-1 rounded-full border border-gray-200 bg-white pl-3 pr-1 text-xs text-gray-700">
                            {c.text}
                            <button type="button" aria-label={`Remove ${c.text}`} onClick={() => { c.clear(); resetPage(); }}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <LuX size={12} />
                            </button>
                        </span>
                    ))}
                    <button type="button" onClick={clearAll} className="px-1 text-xs font-semibold text-[var(--color-primary)] hover:underline">Clear all</button>
                </div>
            )}

            {/* Bulk actions — appear once orders are ticked */}
            {selected.size > 0 && (
                <div className="sticky top-0 z-30 mb-4 flex flex-col gap-3 rounded-2xl bg-gray-900 px-4 py-3 text-white shadow-lg lg:flex-row lg:items-center">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-gray-900">{selected.size}</span>
                        order{selected.size > 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
                        <Dropdown ariaLabel="Change status" width={210} buttonClassName={DARK_BTN}
                            button={<>Change status <LuChevronDown size={13} /></>}>
                            {(close) => STATUS_PILLS.map((o, i) => (
                                <React.Fragment key={o.value}>
                                    {o.group !== STATUS_PILLS[i - 1]?.group && <>{i > 0 && <MenuDivider />}<MenuLabel>{o.group}</MenuLabel></>}
                                    <MenuItem color={o.color} onClick={() => { close(); bulkStatus(o.value); }}>{o.label}</MenuItem>
                                </React.Fragment>
                            ))}
                        </Dropdown>
                        {!isEditor && (
                            <Dropdown ariaLabel="Payment" width={180} buttonClassName={DARK_BTN}
                                button={<><LuWallet size={14} /> Payment <LuChevronDown size={13} /></>}>
                                {(close) => PAYMENT_PILLS.map((o) => (
                                    <MenuItem key={o.value} color={o.color} onClick={() => { close(); bulkPayment(o.value); }}>Mark {o.label.toLowerCase()}</MenuItem>
                                ))}
                            </Dropdown>
                        )}
                        <button type="button" className={DARK_BTN} onClick={bulkCopy}><LuCopy size={14} /> Copy summaries</button>
                        <Dropdown ariaLabel="Papers" width={200} buttonClassName={DARK_BTN}
                            button={<><LuFileText size={14} /> Papers <LuChevronDown size={13} /></>}>
                            {(close) => <>
                                <MenuItem icon={<LuZap size={14} className="text-amber-500" />} onClick={() => { close(); bulkPapers('all'); }}>Memo + challans</MenuItem>
                                <MenuItem icon={<LuReceiptText size={14} />} onClick={() => { close(); bulkPapers('memo'); }}>Memos only</MenuItem>
                                <MenuItem icon={<LuFileText size={14} />} onClick={() => { close(); bulkPapers('challans'); }}>Challans only</MenuItem>
                            </>}
                        </Dropdown>
                        <button type="button" className={DARK_BTN} onClick={() => printSelected('invoices')}><LuReceiptText size={14} /> Invoices</button>
                        <button type="button" className={DARK_BTN} onClick={() => printSelected('labels')}><LuBarcode size={14} /> Labels</button>
                        <button type="button" className={DARK_BTN} onClick={() => exportOrdersCsv(selectedOrders, 'selected')}><LuDownload size={14} /> Export</button>
                        <button type="button" aria-label="Clear selection" onClick={clearSelection}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                            <LuX size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop: table */}
            <TableCard className="hidden lg:block" footer={null}>
                <table className={cx('w-full', isFetching && !isLoading && 'opacity-60')}>
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className={`${th} w-10 pl-4`}>
                                <input
                                    type="checkbox"
                                    aria-label="Select all orders shown"
                                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]"
                                />
                            </th>
                            <th className={`${th} w-10`}>#</th>
                            {show('date') && sortTh('Date', 'createdAt', { firstDesc: true })}
                            {show('order') && sortTh('Order No', 'orderId', { firstDesc: true })}
                            {show('customer') && sortTh('Customer', 'shippingAddress.fullName')}
                            {show('payment') && <th className={th}>Payment</th>}
                            {show('amount') && sortTh('Amount', 'total', { right: true, firstDesc: true })}
                            {show('status') && <th className={th}>Status</th>}
                            {show('next') && <th className={th}>Next step</th>}
                            <th className={`${th} w-20`} />
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <SkeletonRows cols={colCount} /> : orders.length === 0 ? (
                            <EmptyRow colSpan={colCount}>
                                <LuPackage size={28} className="mx-auto mb-2 text-gray-300" />
                                No orders match these filters.
                                {chips.length > 0 && (
                                    <button type="button" onClick={clearAll} className="mt-2 block w-full text-sm font-semibold text-[var(--color-primary)] hover:underline">Clear filters</button>
                                )}
                            </EmptyRow>
                        ) : orders.map((o, i) => {
                            const m = money(o);
                            const isSel = selected.has(o._id);
                            return (
                                <tr key={o._id} className={cx(TR, isSel && 'bg-[var(--color-primary-lightest)] hover:bg-[var(--color-primary-lightest)]')}>
                                    <td className={cx(td, 'pl-4')}>
                                        <input
                                            type="checkbox"
                                            aria-label={`Select ${o.orderId}`}
                                            checked={isSel}
                                            onChange={() => toggleOne(o._id)}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]"
                                        />
                                    </td>
                                    <td className={cx(td, 'tabular-nums text-gray-400')}>{i + 1}</td>
                                    {show('date') && (
                                        <td className={cx(td, 'whitespace-nowrap')}>
                                            <p className="font-medium text-gray-900">{fmtDay(o.createdAt)}</p>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {fmtTime(o.createdAt)}
                                                {isToday(o.createdAt) && <span className="ml-1.5 font-medium text-emerald-600">· Today</span>}
                                            </p>
                                        </td>
                                    )}
                                    {show('order') && (
                                        <td className={td}>
                                            <Link href={`/dashboard/admin/orders/${o._id}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{o.orderId}</Link>
                                            {!dense && itemsLine(o)}
                                            <RepeatTodayChip info={o.repeatToday} />
                                        </td>
                                    )}
                                    {show('customer') && (
                                        <td className={td}>
                                            <p className="max-w-[200px] truncate font-medium text-gray-900">{customerName(o)}</p>
                                            {customerPhone(o) && (
                                                <a href={`tel:${customerPhone(o)}`} className="mt-0.5 block text-xs text-gray-500 hover:text-[var(--color-primary)]">{customerPhone(o)}</a>
                                            )}
                                            {!dense && customerPlace(o) && <p className="max-w-[200px] truncate text-xs text-gray-400">{customerPlace(o)}</p>}
                                        </td>
                                    )}
                                    {show('payment') && (
                                        <td className={td}>
                                            {paymentPill(o)}
                                            <p className="mt-1 text-xs text-gray-400">{o.paymentMethod ? paymentMethodLabel(o.paymentMethod) : '—'}</p>
                                        </td>
                                    )}
                                    {show('amount') && (
                                        <td className={cx(td, 'whitespace-nowrap text-right')}>
                                            <p className="font-semibold tabular-nums text-gray-900">{taka(o.total)}</p>
                                            <p className="mt-0.5 text-xs">
                                                {m.refunded ? <span className="text-gray-400">Refunded</span>
                                                    : m.due > 0 ? <span className="text-amber-600">Due {taka(m.due)}</span>
                                                        : <span className="text-emerald-600">Settled</span>}
                                            </p>
                                        </td>
                                    )}
                                    {show('status') && <td className={td}>{statusPill(o)}</td>}
                                    {show('next') && <td className={td}>{nextStep(o)}</td>}
                                    <td className={cx(td, 'whitespace-nowrap pr-3 text-right')}>
                                        <Link href={`/dashboard/admin/orders/${o._id}`} aria-label="View order" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                                            <LuEye size={16} />
                                        </Link>
                                        {rowMenu(o)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </TableCard>

            {/* Phones & tablets: cards */}
            <div className="space-y-3 lg:hidden">
                {orders.length > 0 && (
                    <label className="flex items-center gap-2.5 px-1 text-sm text-gray-600">
                        <input type="checkbox" checked={allSelected} onChange={toggleAll}
                            ref={(el) => { if (el) el.indeterminate = someSelected; }}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]" />
                        Select all shown
                    </label>
                )}
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)
                    : orders.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 px-4 py-12 text-center text-sm text-gray-500">No orders match these filters.</div>
                    ) : orders.map((o, i) => {
                        const m = money(o);
                        const isSel = selected.has(o._id);
                        return (
                            <div key={o._id} className={cx('relative overflow-hidden rounded-2xl border bg-white p-4 pl-5', isSel ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-lightest)]' : 'border-gray-200')}>
                                <span className="absolute inset-y-0 left-0 w-1" style={{ background: statusColor(o.status) }} />
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-2.5">
                                        <input type="checkbox" aria-label={`Select ${o.orderId}`} checked={isSel} onChange={() => toggleOne(o._id)}
                                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-400">#{i + 1} · {fmtDay(o.createdAt)}, {fmtTime(o.createdAt)}</p>
                                            <Link href={`/dashboard/admin/orders/${o._id}`} className="font-semibold text-gray-900">{o.orderId}</Link>
                                            {itemsLine(o)}
                                            <RepeatTodayChip info={o.repeatToday} />
                                        </div>
                                    </div>
                                    {rowMenu(o)}
                                </div>
                                <div className="mt-3 flex items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{customerName(o)}</p>
                                        <p className="truncate text-xs text-gray-400">
                                            {customerPhone(o) && <a href={`tel:${customerPhone(o)}`} className="text-gray-500">{customerPhone(o)}</a>}
                                            {customerPlace(o) && ` · ${customerPlace(o)}`}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="font-semibold text-gray-900">{taka(o.total)}</p>
                                        {!m.refunded && <p className={cx('text-xs', m.due > 0 ? 'text-amber-600' : 'text-emerald-600')}>{m.due > 0 ? `Due ${taka(m.due)}` : 'Settled'}</p>}
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                                    {statusPill(o)}
                                    {paymentPill(o)}
                                    <span className="text-xs text-gray-400">{o.paymentMethod ? paymentMethodLabel(o.paymentMethod) : ''}</span>
                                    <div className="ml-auto">{nextStep(o)}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-gray-500">
                    {meta.total === 0 ? 'No orders' : (<>
                        Showing <b className="font-semibold text-gray-800">{orders.length}</b> of <b className="font-semibold text-gray-800">{(meta.total || 0).toLocaleString('en-IN')}</b> orders
                        <span className="mx-2 text-gray-300">|</span>Value <b className="font-semibold text-gray-800">{taka(shownTotals.value)}</b>
                        <span className="mx-2 text-gray-300">|</span>Due <b className="font-semibold text-amber-600">{taka(shownTotals.due)}</b>
                    </>)}
                </p>
                <div className="flex items-center gap-2">
                    <SelectPill ariaLabel="Orders per load" className="w-32" value={String(pageSize)}
                        onChange={(v) => { setPageSize(Number(v)); setVisible(Number(v)); setSelected(new Set()); }}
                        options={PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} per load` }))} />
                    {hasMore && (
                        <Btn onClick={() => setVisible((n) => n + pageSize)} disabled={isFetching}>
                            {isFetching ? 'Loading…' : `See more (${Math.min(pageSize, (meta.total || 0) - orders.length)})`}
                        </Btn>
                    )}
                </div>
            </div>

            <Modal
                open={!!noteFor}
                onClose={() => setNoteFor(null)}
                title="Add note"
                subtitle={noteFor ? `${noteFor.orderId} · ${customerName(noteFor)}` : ''}
                width="max-w-md"
                footer={<>
                    <Btn onClick={() => setNoteFor(null)}>Cancel</Btn>
                    <Btn variant="primary" onClick={saveNote} disabled={isSavingNote}>{isSavingNote ? 'Saving…' : 'Add note'}</Btn>
                </>}
            >
                <textarea
                    className={TEXTAREA}
                    rows={4}
                    autoFocus
                    placeholder="e.g. Customer asked for delivery after 5 pm"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-400">Staff-only. It is added to the order’s timeline.</p>
            </Modal>

            <PrintOrdersModal job={printJob} onClose={() => setPrintJob(null)} />
        </div>
    );
}
