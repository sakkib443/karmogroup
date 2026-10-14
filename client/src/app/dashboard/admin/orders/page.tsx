/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    LuPlus, LuDownload, LuEye, LuExternalLink, LuStickyNote, LuX, LuPackage, LuBarcode, LuReceiptText, LuRepeat,
    LuCheck, LuCopy, LuZap, LuFileText, LuTruck, LuArrowRight, LuSlidersHorizontal, LuColumns3, LuArrowUp,
    LuArrowDown, LuChevronsUpDown, LuChevronDown, LuBan, LuWallet, LuMapPin, LuClipboardList, LuSend,
} from 'react-icons/lu';
import {
    useGetAdminOrdersQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useGetOrderStatsQuery,
    useAddAdminNoteMutation,
    useSendWithPathaoMutation,
    useSendOrderSmsMutation,
} from '@/redux/api/orderApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetZonesQuery } from '@/redux/api/shippingApi';
import { BD_DIVISIONS, BD_DISTRICTS, getDivision, getDistrict, districtTerms, divisionTerms, zoneTerms } from '@/lib/bdGeo';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS_CONFIG, ORDER_DESK_STEPS, getStatusConfig, paymentMethodLabel, statusColor } from '@/lib/orderStatus';
import {
    PageHeader, Btn, SearchInput, SelectPill, TableCard, TR, EmptyRow, SkeletonRows, RowMenu, Modal,
    TEXTAREA, taka, cx,
} from '@/components/admin/ui';
import { Dropdown, MenuItem, MenuLabel, MenuDivider, PillSelect, type PillOption } from '@/components/admin/orders/OrderListUi';
import { orderSummaryText, orderDocumentText, orderDivisions, divisionLabel, openOrderPapers, openOrdersPapers, type PaperKind } from '@/components/admin/orders/orderPapers';
import PrintOrdersModal, { type PrintJob, type PrintKind } from '@/components/admin/print/PrintOrdersModal';
import { CancelOrderModal, SmsButton, CANCEL_REASONS } from '@/components/admin/orders/OrderActions';
import { can, nextStatuses } from '@/components/admin/access';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/* ─── Small corners ──────────────────────────────────────── */

// The shared admin controls are pills; on this page every box keeps small, rounded-md corners.
const SQ = 'rounded-md!';
const Select = (p: React.ComponentProps<typeof SelectPill>) => <SelectPill {...p} selectClassName={SQ} />;
const Search = (p: React.ComponentProps<typeof SearchInput>) => <SearchInput {...p} inputClassName={SQ} />;
const Button = (p: React.ComponentProps<typeof Btn>) => <Btn {...p} className={cx(SQ, p.className)} />;

/* ─── Options ────────────────────────────────────────────── */

const CLOSED = ['delivered', 'cancelled', 'returned', 'refunded'];

/** Status pills: the order desk's steps first, in order, then the closing states. */
const STATUS_PILLS: PillOption[] = [
    ...ORDER_DESK_STEPS.map((s) => ({ value: s, label: getStatusConfig(s).label, color: statusColor(s), group: 'Order desk' })),
    ...CLOSED.map((s) => ({ value: s, label: getStatusConfig(s).label, color: statusColor(s), group: 'Closed' })),
];
const ALL_STATUSES = STATUS_PILLS.map((p) => p.value);

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

// Column choice, row height and page size are remembered per browser. The page reads them
// with useSyncExternalStore (server snapshot = defaults), so there is no load-then-set effect.
// A private window that refuses storage still works — the view just lives in memory.
const VIEW_KEY = 'karmo.admin.orders.view';
const PAGE_SIZES = [25, 50, 100];
let memView = '';
const viewListeners = new Set<() => void>();
const subscribeView = (cb: () => void) => { viewListeners.add(cb); return () => { viewListeners.delete(cb); }; };
const readView = () => { try { return localStorage.getItem(VIEW_KEY) ?? memView; } catch { return memView; } };
const writeView = (v: { hidden: string[]; dense: boolean; pageSize: number }) => {
    memView = JSON.stringify(v);
    try { localStorage.setItem(VIEW_KEY, memView); } catch { /* memory only */ }
    viewListeners.forEach((l) => l());
};
function parseView(raw: string) {
    let v: any = {};
    try { v = JSON.parse(raw || '{}') || {}; } catch { /* defaults */ }
    return {
        hidden: new Set<ColKey>(Array.isArray(v.hidden) ? v.hidden : []),
        dense: v.dense === true,
        pageSize: PAGE_SIZES.includes(v.pageSize) ? (v.pageSize as number) : 50,
    };
}

/* ─── Helpers ────────────────────────────────────────────── */

const customerName = (o: any) =>
    o.shippingAddress?.fullName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Guest';
const customerPhone = (o: any) => o.shippingAddress?.phone || o.user?.phone || '';
const customerPlace = (o: any) => [o.shippingAddress?.area, o.shippingAddress?.city].filter(Boolean).join(', ');
const consignment = (o: any) =>
    o.consignmentId || (o.packages || []).map((p: any) => p.consignmentId).filter(Boolean).join(', ');
const pieces = (o: any) => (o.items || []).reduce((n: number, it: any) => n + (Number(it.quantity) || 0), 0);
/** An order is copied (summary / details) only once the customer has confirmed it. */
const canCopy = (o: any) => (o.status || 'pending') !== 'pending';

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
            className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
        >
            <LuRepeat size={11} /> {label}
        </Link>
    );
}

const ACTION = 'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition disabled:opacity-50';
const ICON_BTN = 'inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent';
const ACTION_OUTLINE = cx(ACTION, 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50');

/** A quiet action button — dark for the main step (Confirm), outlined for the rest. */
function ActionBtn({ primary, icon, onClick, disabled, children }: {
    primary?: boolean; icon?: React.ReactNode; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
    return (
        <button type="button" onClick={onClick} disabled={disabled}
            className={primary ? cx(ACTION, 'bg-gray-900 text-white hover:bg-gray-700') : ACTION_OUTLINE}>
            {icon}{children}
        </button>
    );
}

/** The small arrow that moves an order on to its next desk step. */
function NextArrow({ to, onClick, disabled }: { to: string; onClick: () => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={`Move to ${getStatusConfig(to).label}`}
            aria-label={`Move to ${getStatusConfig(to).label}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50"
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

const PILL_INPUT = 'h-9 w-full rounded-md border border-transparent bg-gray-100 px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary-border)] focus:bg-white';
const DARK_BTN = 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20';

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

    // View (remembered in this browser) — read straight from the store, so no load effect.
    const rawView = useSyncExternalStore(subscribeView, readView, () => '');
    const { hidden, dense, pageSize } = useMemo(() => parseView(rawView), [rawView]);
    const saveView = (patch: { hidden?: ColKey[]; dense?: boolean; pageSize?: number }) =>
        writeView({ hidden: Array.from(hidden), dense, pageSize, ...patch });
    // "See more" adds whole pages below the ones already shown.
    const [extraPages, setExtraPages] = useState(0);
    const visible = pageSize * (extraPages + 1);

    // Work
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [busyId, setBusyId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [noteFor, setNoteFor] = useState<any>(null);
    const [noteText, setNoteText] = useState('');
    const [printJob, setPrintJob] = useState<PrintJob | null>(null);
    const [cancelFor, setCancelFor] = useState<any>(null);
    const [bulkCancel, setBulkCancel] = useState(false);
    const [bulkReason, setBulkReason] = useState(CANCEL_REASONS[0]);

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
    const [sendSms] = useSendOrderSmsMutation();
    const [addNote, { isLoading: isSavingNote }] = useAddAdminNoteMutation();
    // What this person may do here comes from their role (components/admin/access.ts);
    // the server checks every step again.
    const role = useSelector((s: RootState) => s.auth.user?.role);
    const seeMoney = can(role, 'seeMoney');
    const allowed = (o: any) => nextStatuses(role, o.status || 'pending', ALL_STATUSES);
    const mayMove = (o: any, to: string) => allowed(o).includes(to);

    const orders: any[] = useMemo(() => ordersData?.data || [], [ordersData]);
    const meta = ordersData?.meta || { total: 0, totalPages: 1 };
    const stats = statsData?.data || {};
    const products: any[] = productsData?.data || [];
    const hasMore = orders.length < (meta.total || 0);
    // The factory sees no prices, so the Payment and Amount columns are not there for it.
    const show = (k: ColKey) => !hidden.has(k) && (seeMoney || (k !== 'payment' && k !== 'amount'));
    const colCount = 3 + COLUMNS.filter((c) => show(c.key)).length;

    // Any change of filter goes back to the first page and starts a fresh selection.
    const resetPage = () => { setExtraPages(0); setSelected(new Set()); };
    const withReset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); resetPage(); };

    const shownTotals = useMemo(() => orders.reduce((acc, o) => {
        const m = money(o);
        if (o.status !== 'cancelled') acc.value += Number(o.total || 0);
        acc.due += m.due;
        return acc;
    }, { value: 0, due: 0 }), [orders]);

    /* ── Single-order actions ── */

    const move = async (o: any, to: string) => {
        // Cancelling needs a reason — the modal asks for it.
        if (to === 'cancelled') { setCancelFor(o); return; }
        setBusyId(o._id);
        try {
            await updateStatus({ id: o._id, status: to }).unwrap();
            // Just confirmed → offer the confirmation SMS to the customer straight away.
            if (to === 'confirmed' && can(role, 'sms')) {
                toast((t) => (
                    <span className="flex items-center gap-3">
                        <span><b>{o.orderId}</b> confirmed</span>
                        <button type="button" onClick={() => { toast.dismiss(t.id); smsNow(o); }}
                            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700">
                            <LuSend size={12} /> Send SMS
                        </button>
                    </span>
                ), { icon: '✅', duration: 10000 });
            } else {
                toast.success(`${o.orderId} → ${getStatusConfig(to).label}`);
            }
        } catch (err) {
            toast.error(apiError(err, 'Failed to update status'));
        } finally {
            setBusyId(null);
        }
    };

    /** The confirmation (or cancellation) SMS to the customer, in one click. */
    const smsNow = async (o: any) => {
        const tId = toast.loading(`Sending SMS to ${customerName(o)}…`);
        try {
            const res: any = await sendSms({ id: o._id, kind: 'confirmed' }).unwrap();
            const status = res?.data?.sms?.status;
            if (status === 'sent') toast.success(`SMS sent to ${customerPhone(o) || customerName(o)}`, { id: tId });
            else if (status === 'not_configured') toast('SMS gateway is not set up yet — nothing was sent. Add SMS_PROVIDER, SMS_API_KEY and SMS_SENDER_ID on the server.', { id: tId, icon: '⚠️', duration: 8000 });
            else toast.error(res?.message || 'SMS failed', { id: tId });
        } catch (err) {
            toast.error(apiError(err, 'Could not send the SMS'), { id: tId });
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

    // Summary = the short note for the factory team; details = the whole order with its history.
    // Neither goes out before the call to the customer has confirmed the order.
    const copyText = async (o: any, kind: 'summary' | 'details') => {
        if (!canCopy(o)) { toast.error('Confirm the order first — then it can be copied'); return; }
        try {
            await navigator.clipboard.writeText(kind === 'summary' ? orderSummaryText(o) : orderDocumentText(o));
            setCopiedId(o._id);
            toast.success(`${o.orderId} ${kind} copied`);
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
        if (to === 'cancelled') { setBulkReason(CANCEL_REASONS[0]); setBulkCancel(true); return; }
        runBulk(`moved to ${getStatusConfig(to).label}`, (id) => updateStatus({ id, status: to }).unwrap());
    };
    const confirmBulkCancel = () => {
        setBulkCancel(false);
        runBulk('cancelled', (id) => updateStatus({ id, status: 'cancelled', note: bulkReason }).unwrap());
    };
    const bulkPayment = (to: string) =>
        runBulk(`marked ${PAYMENT[to]?.label || to}`, (id) => updatePayment({ id, paymentStatus: to }).unwrap());

    const bulkCopy = async (kind: 'summary' | 'details') => {
        const ready = selectedOrders.filter(canCopy);
        const skipped = selectedOrders.length - ready.length;
        if (!ready.length) { toast.error('Confirm these orders first — pending orders cannot be copied'); return; }
        try {
            const text = ready.map(kind === 'summary' ? orderSummaryText : orderDocumentText).join('\n\n────────────\n\n');
            await navigator.clipboard.writeText(text);
            toast.success(`${ready.length} ${kind === 'summary' ? 'summaries' : 'orders'} copied${skipped ? ` · ${skipped} pending skipped` : ''}`);
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

    const toggleCol = (k: ColKey) => {
        const next = new Set(hidden);
        if (next.has(k)) next.delete(k); else next.add(k);
        saveView({ hidden: Array.from(next) });
    };

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
            buttonClassName={ACTION_OUTLINE}
            button={<><LuFileText size={13} /> Papers <LuChevronDown size={12} className="text-gray-400" /></>}
        >
            {(close) => <>
                <MenuItem icon={<LuZap size={14} />} onClick={() => { close(); papers(o, { kind: 'all' }); }}>Download All</MenuItem>
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

    const waiting = (text: string) => <span className="text-xs text-gray-400">{text}</span>;

    /** The one thing to do next at the order desk, by status and by who is looking. */
    const nextStep = (o: any) => {
        const busy = busyId === o._id;
        // The agency's own confirmations / cancellations: the one-click SMS to the customer.
        if (role === 'agency' && o.status !== 'pending') return <SmsButton order={o} compact />;
        switch (o.status) {
            case 'pending':
                return mayMove(o, 'confirmed')
                    ? <ActionBtn primary icon={<LuCheck size={13} />} disabled={busy} onClick={() => move(o, 'confirmed')}>Confirm</ActionBtn>
                    : waiting('Waiting for the call');
            case 'confirmed':
                if (mayMove(o, 'factory')) {
                    return (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {/* The customer's confirmation SMS — one click, shows "sent" afterwards */}
                            {can(role, 'sms') && <SmsButton order={o} compact />}
                            <ActionBtn disabled={busy} onClick={() => move(o, 'factory')}>
                                Send to factory <LuArrowRight size={13} />
                            </ActionBtn>
                        </div>
                    );
                }
                if (can(role, 'sms') && role !== 'factory') {
                    return (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <SmsButton order={o} compact />
                            {can(role, 'viewPapers') && papersMenu(o)}
                        </div>
                    );
                }
                if (role === 'factory') {
                    return <Link href="/dashboard/admin/factory" className={ACTION_OUTLINE}><LuBarcode size={13} /> Scan</Link>;
                }
                return can(role, 'viewPapers') ? papersMenu(o) : waiting('With the factory');
            case 'factory':
                if (role === 'factory') {
                    return <Link href="/dashboard/admin/factory" className={ACTION_OUTLINE}><LuBarcode size={13} /> Scan</Link>;
                }
                return (
                    <div className="flex items-center gap-1.5">
                        {can(role, 'viewPapers') && papersMenu(o)}
                        {mayMove(o, 'challan_ready') && <NextArrow to="challan_ready" disabled={busy} onClick={() => move(o, 'challan_ready')} />}
                    </div>
                );
            case 'challan_ready':
                if (!mayMove(o, 'courier_entry')) return can(role, 'viewPapers') ? papersMenu(o) : waiting('Ready for the courier');
                return (
                    <ActionBtn disabled={busy} onClick={() => move(o, 'courier_entry')}>
                        Courier entry <LuArrowRight size={13} />
                    </ActionBtn>
                );
            case 'courier_entry':
                if (!can(role, 'courier')) return waiting('Booking with the courier');
                return (
                    <ActionBtn icon={<LuTruck size={13} />} disabled={busy} onClick={() => pathao(o)}>
                        {busy ? 'Sending…' : 'Send with Pathao'}
                    </ActionBtn>
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
        <RowMenu buttonClassName={SQ} items={[
            { label: 'Open full page', icon: <LuExternalLink size={15} />, href: `/dashboard/admin/orders/${o._id}` },
            { label: 'Add note', icon: <LuStickyNote size={15} />, hidden: !can(role, 'note'), onClick: () => { setNoteFor(o); setNoteText(''); } },
            { label: 'Memo & challans (view)', icon: <LuFileText size={15} />, hidden: !can(role, 'viewPapers') || o.status === 'pending', onClick: () => papers(o, { kind: 'all' }) },
            { label: 'Print invoice', icon: <LuReceiptText size={15} />, hidden: !seeMoney, onClick: () => setPrintJob({ kind: 'invoices', ids: [o._id] }) },
            { label: 'Print label', icon: <LuBarcode size={15} />, hidden: !can(role, 'courier'), onClick: () => setPrintJob({ kind: 'labels', ids: [o._id] }) },
            { label: 'Cancel order', icon: <LuBan size={15} />, danger: true, hidden: !mayMove(o, 'cancelled'), onClick: () => move(o, 'cancelled') },
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

    /**
     * Beside the eye: one Copy button with both choices — the short summary for the
     * team, or the full details with history. Locked until the order is confirmed.
     */
    const copyMenu = (o: any) => {
        const ok = canCopy(o);
        const done = copiedId === o._id;
        return (
            <Dropdown
                ariaLabel="Copy order"
                title={ok ? 'Copy summary or full details' : 'Confirm the order first — then it can be copied'}
                disabled={!ok}
                width={244}
                align="right"
                buttonClassName={cx(ICON_BTN, done && 'text-gray-900')}
                button={done ? <LuCheck size={16} /> : <LuCopy size={16} />}
            >
                {(close) => <>
                    <MenuItem icon={<LuCopy size={14} />} hint="Short note for the factory team" onClick={() => { close(); copyText(o, 'summary'); }}>
                        Copy summary
                    </MenuItem>
                    <MenuItem icon={<LuClipboardList size={14} />} hint="Customer, items, payment & history" onClick={() => { close(); copyText(o, 'details'); }}>
                        Copy full details
                    </MenuItem>
                </>}
            </Dropdown>
        );
    };

    // Only the moves this role may make are offered; with none, the pill is just a label.
    const statusPill = (o: any) => {
        const current = o.status || 'pending';
        const next = allowed(o);
        return (
            <PillSelect ariaLabel="Order status" value={current} disabled={next.length === 0}
                options={STATUS_PILLS.filter((p) => p.value === current || next.includes(p.value))}
                fallbackLabel={getStatusConfig(o.status).label} onChange={(v) => move(o, v)} />
        );
    };
    const paymentPill = (o: any) => (
        <PillSelect ariaLabel="Payment status" value={o.paymentStatus || 'pending'} options={PAYMENT_PILLS}
            disabled={!can(role, 'payment')} onChange={(v) => setPayment(o, v)} />
    );

    /* ── Render ── */

    return (
        <div>
            <PageHeader
                title="Orders"
                subtitle="Every sales order — from the store and taken by phone — from first call to the courier."
                actions={<>
                    {can(role, 'export') && <Button icon={<LuDownload size={15} />} onClick={() => exportOrdersCsv(orders, 'orders')}>Export</Button>}
                    {can(role, 'createOrder') && <Button variant="primary" icon={<LuPlus size={16} />} href="/dashboard/admin/orders/new">Add order</Button>}
                </>}
            />

            {/* Status tiles — one per step; colour only in the small dot */}
            <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5 2xl:grid-cols-10">
                {TILES.map((key) => {
                    const active = statusFilter === key;
                    const value = key === 'all' ? stats.total : stats[key];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { setStatusFilter(active && key !== 'all' ? 'all' : key); resetPage(); }}
                            className={cx(
                                'rounded-md border bg-white px-3.5 py-3 text-left transition',
                                active ? 'border-gray-900 shadow-[0_0_0_1px_#111827]' : 'border-gray-200 hover:border-gray-300',
                            )}
                        >
                            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-gray-500">
                                {key !== 'all' && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: statusColor(key) }} />}
                                {key === 'all' ? 'All orders' : getStatusConfig(key).label}
                            </p>
                            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-gray-900">{Number(value || 0).toLocaleString('en-IN')}</p>
                        </button>
                    );
                })}
            </div>

            {/* Main filters */}
            <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
                <Search className="lg:w-80" value={search} onChange={withReset(setSearch)} placeholder="Order no, customer, phone, consignment…" />
                <Select ariaLabel="Date" className="lg:w-40" value={datePreset} onChange={withReset(setDatePreset)} options={DATE_PRESETS} />
                {datePreset === 'custom' && (
                    <div className="flex items-center gap-1.5">
                        <input type="date" aria-label="From date" className={cx(PILL_INPUT, 'lg:w-40')} value={customFrom} max={customTo || undefined}
                            onChange={(e) => { setCustomFrom(e.target.value); resetPage(); }} />
                        <span className="text-gray-400">–</span>
                        <input type="date" aria-label="To date" className={cx(PILL_INPUT, 'lg:w-40')} value={customTo} min={customFrom || undefined}
                            onChange={(e) => { setCustomTo(e.target.value); resetPage(); }} />
                    </div>
                )}
                {seeMoney && (
                    <Select ariaLabel="Payment status" className="lg:w-40" value={paymentFilter} onChange={withReset(setPaymentFilter)}
                        options={[{ value: 'all', label: 'All payments' }, ...PAYMENT_OPTIONS]} />
                )}
                <Select ariaLabel="Sort" className="lg:w-52" value={sort} onChange={withReset(setSort)}
                    options={seeMoney ? SORTS : SORTS.filter((s) => !s.value.endsWith('total'))} />

                <div className="flex items-center gap-2 lg:ml-auto">
                    <Button
                        icon={<LuSlidersHorizontal size={15} />}
                        onClick={() => setShowFilters((s) => !s)}
                        className={cx(showFilters && 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800')}
                    >
                        Filters
                        {advancedCount > 0 && (
                            <span className={cx('ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-[11px]', showFilters ? 'bg-white text-gray-900' : 'bg-gray-900 text-white')}>{advancedCount}</span>
                        )}
                    </Button>
                    <Dropdown
                        ariaLabel="Customize columns"
                        width={240}
                        align="right"
                        buttonClassName="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        button={<><LuColumns3 size={15} /> Columns</>}
                    >
                        {() => <>
                            <MenuLabel>Show columns</MenuLabel>
                            {COLUMNS.filter((c) => seeMoney || (c.key !== 'payment' && c.key !== 'amount')).map((c) => (
                                <label key={c.key} className="flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <input type="checkbox" checked={show(c.key)} onChange={() => toggleCol(c.key)}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[var(--color-primary)]" />
                                    {c.label}
                                </label>
                            ))}
                            <MenuDivider />
                            <MenuLabel>Row height</MenuLabel>
                            <div className="mx-2 mb-2 grid grid-cols-2 gap-1 rounded-md bg-gray-100 p-1">
                                {[{ v: false, text: 'Comfortable' }, { v: true, text: 'Compact' }].map((opt) => (
                                    <button key={opt.text} type="button" onClick={() => saveView({ dense: opt.v })}
                                        className={cx('h-7 rounded text-xs font-medium transition', dense === opt.v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                            <MenuDivider />
                            <MenuItem onClick={() => saveView({ hidden: [], dense: false })}>Reset view</MenuItem>
                        </>}
                    </Dropdown>
                </div>
            </div>

            {/* More filters */}
            {showFilters && (
                <div className="mb-3 rounded-md border border-gray-200 bg-white p-4">
                    <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        <LuMapPin size={13} /> Location
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <FilterField label="Division · বিভাগ">
                            <Select ariaLabel="Division" value={geoDivision} onChange={pickDivision}
                                options={[{ value: 'all', label: 'All divisions' }, ...BD_DIVISIONS.map((v) => ({ value: v.key, label: `${v.name} · ${v.bn}` }))]} />
                        </FilterField>
                        <FilterField label="District · জেলা">
                            <Select ariaLabel="District" value={geoDistrict} onChange={pickDistrict}
                                options={[{ value: 'all', label: geoDivision !== 'all' ? `All districts of ${getDivision(geoDivision)?.name}` : 'All districts' }, ...districtOptions]} />
                        </FilterField>
                        <FilterField label="Zone · জোন">
                            {zones.length > 0 ? (
                                <Select ariaLabel="Zone" value={zoneFilter} onChange={withReset(setZoneFilter)}
                                    options={[{ value: 'all', label: 'All zones' }, ...zones.map((z) => ({
                                        value: z._id,
                                        label: `${z.name}${z.regions?.length ? ` (${z.regions.length} district${z.regions.length > 1 ? 's' : ''})` : ''}`,
                                    }))]} />
                            ) : (
                                <Link href="/dashboard/admin/shipping" className="flex h-9 items-center rounded-md border border-dashed border-gray-300 px-4 text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-800">
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
                        <Select ariaLabel="Order status" value={statusFilter} onChange={withReset(setStatusFilter)}
                            options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
                    </FilterField>
                    {seeMoney && (
                        <FilterField label="Payment method">
                            <Select ariaLabel="Payment method" value={methodFilter} onChange={withReset(setMethodFilter)}
                                options={[{ value: 'all', label: 'All methods' }, ...METHOD_OPTIONS]} />
                        </FilterField>
                    )}
                    <FilterField label="Product">
                        <Select ariaLabel="Product" value={productFilter} onChange={withReset(setProductFilter)}
                            options={[{ value: 'all', label: 'All products' }, ...products.map((p) => ({ value: p._id, label: p.name }))]} />
                    </FilterField>
                    <FilterField label="Product division">
                        <Select ariaLabel="Product division" value={divisionFilter} onChange={withReset(setDivisionFilter)}
                            options={[{ value: 'all', label: 'Foam, mattress, all…' }, ...DIVISION_OPTIONS]} />
                    </FilterField>
                    <FilterField label="Courier">
                        <Select ariaLabel="Courier" value={courierFilter} onChange={withReset(setCourierFilter)}
                            options={[{ value: 'all', label: 'Any' }, ...COURIER_OPTIONS]} />
                    </FilterField>
                    {seeMoney && (
                        <FilterField label="Amount (৳)">
                            <div className="flex items-center gap-1.5">
                                <input type="number" min={0} inputMode="numeric" placeholder="Min" aria-label="Minimum amount" className={PILL_INPUT}
                                    value={minTotal} onChange={(e) => { setMinTotal(e.target.value); resetPage(); }} />
                                <span className="text-gray-400">–</span>
                                <input type="number" min={0} inputMode="numeric" placeholder="Max" aria-label="Maximum amount" className={PILL_INPUT}
                                    value={maxTotal} onChange={(e) => { setMaxTotal(e.target.value); resetPage(); }} />
                            </div>
                        </FilterField>
                    )}
                    </div>
                </div>
            )}

            {/* Active filters */}
            {chips.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {chips.map((c) => (
                        <span key={c.key} className="inline-flex h-7 items-center gap-1 rounded-md border border-gray-200 bg-white pl-3 pr-1 text-xs text-gray-700">
                            {c.text}
                            <button type="button" aria-label={`Remove ${c.text}`} onClick={() => { c.clear(); resetPage(); }}
                                className="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <LuX size={12} />
                            </button>
                        </span>
                    ))}
                    <button type="button" onClick={clearAll} className="px-1 text-xs font-semibold text-[var(--color-primary)] hover:underline">Clear all</button>
                </div>
            )}

            {/* Bulk actions — appear once orders are ticked */}
            {selected.size > 0 && (
                <div className="sticky top-0 z-30 mb-4 flex flex-col gap-3 rounded-md bg-gray-900 px-4 py-3 text-white shadow-lg lg:flex-row lg:items-center">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-white px-2 text-xs font-semibold text-gray-900">{selected.size}</span>
                        order{selected.size > 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
                        {can(role, 'bulkStatus') && (
                            <Dropdown ariaLabel="Change status" width={210} buttonClassName={DARK_BTN}
                                button={<>Change status <LuChevronDown size={13} /></>}>
                                {(close) => STATUS_PILLS.filter((o) => role !== 'manager' || o.value !== 'refunded').map((o, i, list) => (
                                    <React.Fragment key={o.value}>
                                        {o.group !== list[i - 1]?.group && <>{i > 0 && <MenuDivider />}<MenuLabel>{o.group}</MenuLabel></>}
                                        <MenuItem color={o.color} onClick={() => { close(); bulkStatus(o.value); }}>{o.label}</MenuItem>
                                    </React.Fragment>
                                ))}
                            </Dropdown>
                        )}
                        {can(role, 'payment') && (
                            <Dropdown ariaLabel="Payment" width={180} buttonClassName={DARK_BTN}
                                button={<><LuWallet size={14} /> Payment <LuChevronDown size={13} /></>}>
                                {(close) => PAYMENT_PILLS.map((o) => (
                                    <MenuItem key={o.value} color={o.color} onClick={() => { close(); bulkPayment(o.value); }}>Mark {o.label.toLowerCase()}</MenuItem>
                                ))}
                            </Dropdown>
                        )}
                        <Dropdown ariaLabel="Copy" width={236} buttonClassName={DARK_BTN}
                            button={<><LuCopy size={14} /> Copy <LuChevronDown size={13} /></>}>
                            {(close) => <>
                                <MenuItem icon={<LuCopy size={14} />} hint="Pending orders are skipped" onClick={() => { close(); bulkCopy('summary'); }}>Copy summaries</MenuItem>
                                <MenuItem icon={<LuClipboardList size={14} />} hint="With history · pending skipped" onClick={() => { close(); bulkCopy('details'); }}>Copy full details</MenuItem>
                            </>}
                        </Dropdown>
                        {can(role, 'viewPapers') && (
                            <Dropdown ariaLabel="Papers" width={220} buttonClassName={DARK_BTN}
                                button={<><LuFileText size={14} /> Papers <LuChevronDown size={13} /></>}>
                                {(close) => <>
                                    <MenuLabel>View copies</MenuLabel>
                                    <MenuItem icon={<LuZap size={14} />} onClick={() => { close(); bulkPapers('all'); }}>Memo + challans</MenuItem>
                                    <MenuItem icon={<LuReceiptText size={14} />} onClick={() => { close(); bulkPapers('memo'); }}>Memos only</MenuItem>
                                    <MenuItem icon={<LuFileText size={14} />} onClick={() => { close(); bulkPapers('challans'); }}>Challans only</MenuItem>
                                </>}
                            </Dropdown>
                        )}
                        {seeMoney && <button type="button" className={DARK_BTN} onClick={() => printSelected('invoices')}><LuReceiptText size={14} /> Invoices</button>}
                        {can(role, 'courier') && <button type="button" className={DARK_BTN} onClick={() => printSelected('labels')}><LuBarcode size={14} /> Labels</button>}
                        {can(role, 'export') && <button type="button" className={DARK_BTN} onClick={() => exportOrdersCsv(selectedOrders, 'selected')}><LuDownload size={14} /> Export</button>}
                        <button type="button" aria-label="Clear selection" onClick={clearSelection}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white">
                            <LuX size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop: table */}
            <TableCard className={cx('hidden lg:block', SQ)} footer={null}>
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
                            <th className={`${th} w-28`} />
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
                                                {isToday(o.createdAt) && <span className="ml-1.5 font-medium text-gray-600">· Today</span>}
                                            </p>
                                        </td>
                                    )}
                                    {show('order') && (
                                        <td className={td}>
                                            <Link href={`/dashboard/admin/orders/${o._id}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{o.orderId}</Link>
                                            {o.source === 'manual' && (
                                                <span title={o.createdBy?.name ? `Added by ${o.createdBy.name}` : 'Added at the desk'}
                                                    className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Manual</span>
                                            )}
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
                                                        : <span className="text-gray-400">Settled</span>}
                                            </p>
                                        </td>
                                    )}
                                    {show('status') && <td className={td}>{statusPill(o)}</td>}
                                    {show('next') && <td className={td}>{nextStep(o)}</td>}
                                    <td className={cx(td, 'whitespace-nowrap pr-3 text-right')}>
                                        <Link href={`/dashboard/admin/orders/${o._id}`} aria-label="View order" title="View order" className={ICON_BTN}>
                                            <LuEye size={16} />
                                        </Link>
                                        {copyMenu(o)}
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
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-md bg-gray-100" />)
                    : orders.length === 0 ? (
                        <div className="rounded-md border border-gray-200 px-4 py-12 text-center text-sm text-gray-500">No orders match these filters.</div>
                    ) : orders.map((o, i) => {
                        const m = money(o);
                        const isSel = selected.has(o._id);
                        return (
                            <div key={o._id} className={cx('rounded-md border bg-white p-4', isSel ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-lightest)]' : 'border-gray-200')}>
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
                                    <div className="flex shrink-0 items-center">
                                        {copyMenu(o)}
                                        {rowMenu(o)}
                                    </div>
                                </div>
                                <div className="mt-3 flex items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{customerName(o)}</p>
                                        <p className="truncate text-xs text-gray-400">
                                            {customerPhone(o) && <a href={`tel:${customerPhone(o)}`} className="text-gray-500">{customerPhone(o)}</a>}
                                            {customerPlace(o) && ` · ${customerPlace(o)}`}
                                        </p>
                                    </div>
                                    {seeMoney && (
                                        <div className="shrink-0 text-right">
                                            <p className="font-semibold text-gray-900">{taka(o.total)}</p>
                                            {!m.refunded && <p className={cx('text-xs', m.due > 0 ? 'text-amber-600' : 'text-gray-400')}>{m.due > 0 ? `Due ${taka(m.due)}` : 'Settled'}</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                                    {statusPill(o)}
                                    {seeMoney && paymentPill(o)}
                                    {seeMoney && <span className="text-xs text-gray-400">{o.paymentMethod ? paymentMethodLabel(o.paymentMethod) : ''}</span>}
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
                        {seeMoney && <>
                            <span className="mx-2 text-gray-300">|</span>Value <b className="font-semibold text-gray-800">{taka(shownTotals.value)}</b>
                            <span className="mx-2 text-gray-300">|</span>Due <b className="font-semibold text-amber-600">{taka(shownTotals.due)}</b>
                        </>}
                    </>)}
                </p>
                <div className="flex items-center gap-2">
                    <Select ariaLabel="Orders per load" className="w-32" value={String(pageSize)}
                        onChange={(v) => { saveView({ pageSize: Number(v) }); resetPage(); }}
                        options={PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} per load` }))} />
                    {hasMore && (
                        <Button onClick={() => setExtraPages((n) => n + 1)} disabled={isFetching}>
                            {isFetching ? 'Loading…' : `See more (${Math.min(pageSize, (meta.total || 0) - orders.length)})`}
                        </Button>
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
                    <Button onClick={() => setNoteFor(null)}>Cancel</Button>
                    <Button variant="primary" onClick={saveNote} disabled={isSavingNote}>{isSavingNote ? 'Saving…' : 'Add note'}</Button>
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

            {cancelFor && <CancelOrderModal order={cancelFor} open onClose={() => setCancelFor(null)} />}

            <Modal
                open={bulkCancel}
                onClose={() => setBulkCancel(false)}
                title={`Cancel ${selected.size} order${selected.size > 1 ? 's' : ''}`}
                subtitle="The reason is saved on each order's timeline."
                width="max-w-md"
                footer={<>
                    <Button onClick={() => setBulkCancel(false)}>Keep orders</Button>
                    <Button variant="danger" onClick={confirmBulkCancel}>Cancel orders</Button>
                </>}
            >
                <div className="space-y-2">
                    {CANCEL_REASONS.filter((r) => r !== 'Other').map((r) => (
                        <label key={r} className={cx('flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition',
                            bulkReason === r ? 'border-red-300 bg-red-50 text-red-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                            <input type="radio" name="bulk-cancel-reason" checked={bulkReason === r} onChange={() => setBulkReason(r)} className="accent-red-600" />
                            {r}
                        </label>
                    ))}
                </div>
            </Modal>

            <PrintOrdersModal job={printJob} onClose={() => setPrintJob(null)} />
        </div>
    );
}
