/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * Add order — an order taken by phone or for a walk-in customer. Super admin, admin,
 * manager and online sales (access.ts → createOrder). Karmo's mattresses and foam are
 * priced by size exactly as on the website (karmoCatalogue.ts); any line's price can
 * be changed for this order. Save it as Pending, or Confirm it straight away.
 */
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    LuPlus, LuMinus, LuX, LuSearch, LuUserCheck, LuUserPlus, LuPackagePlus, LuCheck, LuPenLine, LuChevronDown,
} from 'react-icons/lu';
import { useViewRole } from '@/components/admin/viewRole';
import { useCreateAdminOrderMutation, type ManualOrderInput } from '@/redux/api/orderApi';
import { useLookupCustomerQuery } from '@/redux/api/userApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetShippingSettingsQuery } from '@/redux/api/shippingApi';
import { can } from '@/components/admin/access';
import { PageHeader, Btn, Field, INPUT, TEXTAREA, Segmented, taka, cx } from '@/components/admin/ui';
import { karmoCatalogue, quoteItem, heightRule, referenceSize, type CatalogueItem } from '@/components/admin/orders/karmoCatalogue';

/* ─── Lines ──────────────────────────────────────────────── */

type Line = {
    key: string;
    kind: 'catalogue' | 'product' | 'custom';
    item?: CatalogueItem;
    productId?: string;
    image: string;
    name: string;
    division: string;
    sizeId: string;
    w: string; l: string; h: string;
    option: string;
    sizeText: string;
    qty: number;
    price: string;
    mrp: number;
    priceEdited: boolean;
};

const DIVISIONS = [
    { value: 'mattress', label: 'Mattress' },
    { value: 'foam', label: 'Foam' },
    { value: 'fiber_pillow', label: 'Fiber Pillow' },
    { value: 'hometex', label: 'Hometex' },
    { value: 'chemicals', label: 'Chemicals' },
];
const divisionLabel = (d: string) => DIVISIONS.find((x) => x.value === d)?.label || d || 'General';

const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on delivery' },
    { id: 'bkash', label: 'bKash' },
    { id: 'nagad', label: 'Nagad' },
    { id: 'rocket', label: 'Rocket' },
] as const;
type PayMethod = (typeof PAYMENT_METHODS)[number]['id'];

const num = (v: string) => (v.trim() === '' ? NaN : Number(v));
const newKey = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const normalisePhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    return d.startsWith('880') ? `0${d.slice(3)}` : d;
};

/** A catalogue line's price follows its size until staff type their own. */
function requote(line: Line): Line {
    if (line.kind !== 'catalogue' || !line.item || line.priceEdited) return line;
    const q = quoteItem(line.item, num(line.w), num(line.l), num(line.h));
    return q.ok ? { ...line, price: String(q.unit), mrp: q.mrp } : { ...line, price: '', mrp: 0 };
}

function catalogueLine(item: CatalogueItem): Line {
    const ref = referenceSize(item);
    return requote({
        key: newKey(), kind: 'catalogue', item, image: item.image, name: item.name, division: item.division,
        sizeId: ref?.id || 'custom', w: String(ref?.w || ''), l: String(ref?.l || ''), h: String(ref?.h || item.defaultHeight),
        option: item.options[0]?.id || '', sizeText: '', qty: 1, price: '', mrp: 0, priceEdited: false,
    });
}

function productLine(p: any): Line {
    const price = Number(p.price) || 0;
    return {
        key: newKey(), kind: 'product', productId: p._id, image: p.thumbnail || '', name: p.name,
        division: String(p.division || p.category?.name || '').toLowerCase().replace(/[\s-]+/g, '_'),
        sizeId: '', w: '', l: '', h: '', option: '', sizeText: '', qty: 1,
        price: String(price), mrp: Number(p.originalPrice) > price ? Number(p.originalPrice) : 0, priceEdited: false,
    };
}

const customLine = (): Line => ({
    key: newKey(), kind: 'custom', image: '', name: '', division: 'mattress', sizeId: '', w: '', l: '', h: '',
    option: '', sizeText: '', qty: 1, price: '', mrp: 0, priceEdited: true,
});

/** What goes on the order as the line's size, e.g. "Damask 1 · 69 × 81 × 12 inch". */
function sizeOf(line: Line) {
    if (line.kind !== 'catalogue' || !line.item) return line.sizeText.trim();
    const opt = line.item.options.find((o) => o.id === line.option)?.label;
    return [opt, `${line.w} × ${line.l} × ${line.h} inch`].filter(Boolean).join(' · ');
}

/* ─── Product picker ─────────────────────────────────────── */

function ProductPicker({ onPick, onCustom }: { onPick: (l: Line) => void; onCustom: () => void }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const box = useRef<HTMLDivElement>(null);
    const catalogue = useMemo(() => karmoCatalogue(), []);
    const { data: productsRes } = useGetProductsQuery({ status: 'active', includeDrafts: true, limit: 100, sort: 'name' }, { skip: !open });
    const products: any[] = productsRes?.data || [];

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const t = q.trim().toLowerCase();
    const match = (name: string) => !t || name.toLowerCase().includes(t);
    const groups = [
        { title: 'Mattress', rows: catalogue.filter((c) => c.division === 'mattress' && match(c.name)).map((c) => ({ id: c.key, name: c.name, image: c.image, hint: `from ${taka(c.price)}`, line: () => catalogueLine(c) })) },
        { title: 'Foam', rows: catalogue.filter((c) => c.division === 'foam' && match(c.name)).map((c) => ({ id: c.key, name: c.name, image: c.image, hint: `from ${taka(c.price)}`, line: () => catalogueLine(c) })) },
        { title: 'Other products', rows: products.filter((p) => match(p.name || '')).map((p) => ({ id: p._id, name: p.name, image: p.thumbnail, hint: taka(p.price), line: () => productLine(p) })) },
    ].filter((g) => g.rows.length);

    return (
        <div ref={box} className="relative">
            <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setOpen((o) => !o)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">
                    <LuPackagePlus size={16} /> Add product <LuChevronDown size={14} className="text-gray-400" />
                </button>
                <button type="button" onClick={onCustom}
                    className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                    <LuPenLine size={15} /> Custom item
                </button>
            </div>

            {open && (
                <div className="absolute left-0 top-12 z-30 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3">
                        <LuSearch size={15} className="text-gray-400" />
                        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…"
                            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1">
                        {groups.length === 0 && <p className="px-4 py-6 text-center text-sm text-gray-400">Nothing matches “{q}”.</p>}
                        {groups.map((g) => (
                            <div key={g.title}>
                                <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{g.title}</p>
                                {g.rows.map((r) => (
                                    <button key={r.id} type="button" onClick={() => { onPick(r.line()); setOpen(false); setQ(''); }}
                                        className="flex w-full items-center gap-3 px-4 py-2 text-left transition hover:bg-gray-50">
                                        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                            {r.image && <img src={r.image} alt="" className="h-full w-full object-cover" />}
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{r.name}</span>
                                        <span className="shrink-0 text-xs text-gray-400">{r.hint}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── One line ───────────────────────────────────────────── */

const SMALL = 'h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition focus:border-[var(--color-primary)]';

function LineRow({ line, onChange, onRemove }: { line: Line; onChange: (l: Line) => void; onRemove: () => void }) {
    const set = (patch: Partial<Line>) => onChange(requote({ ...line, ...patch }));
    const price = num(line.price);
    const total = Number.isFinite(price) ? price * line.qty : 0;
    const item = line.item;
    const hr = item ? heightRule(item) : null;

    return (
        <li className="px-4 py-4 sm:px-5">
            <div className="flex gap-3">
                <span className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                    {line.image && <img src={line.image} alt="" className="h-full w-full object-cover" />}
                </span>

                <div className="min-w-0 flex-1 space-y-3">
                    {/* Name + remove */}
                    <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            {line.kind === 'custom' ? (
                                <input className={cx(SMALL, 'w-full font-medium')} placeholder="Product name" value={line.name} autoFocus
                                    onChange={(e) => set({ name: e.target.value })} />
                            ) : <p className="truncate font-medium text-gray-900">{line.name}</p>}
                            <p className="mt-0.5 text-xs text-gray-400">{divisionLabel(line.division)}</p>
                        </div>
                        <button type="button" onClick={onRemove} aria-label="Remove line"
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                            <LuX size={16} />
                        </button>
                    </div>

                    {/* Size */}
                    {item ? (
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                                {item.sizes.map((s) => (
                                    <button key={s.id} type="button"
                                        onClick={() => set(s.id === 'custom' ? { sizeId: 'custom' } : { sizeId: s.id, w: String(s.w), l: String(s.l), h: String(hr?.fixed ?? (line.h || s.h)) })}
                                        className={cx('rounded-lg border px-2.5 py-1.5 text-xs transition',
                                            line.sizeId === s.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                                        {s.note}{s.id !== 'custom' && <span className={cx('ml-1', line.sizeId === s.id ? 'text-white/60' : 'text-gray-400')}>{s.label}</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                {line.sizeId === 'custom' ? (<>
                                    <input className={cx(SMALL, 'w-16 text-center')} inputMode="numeric" aria-label="Width (inch)" value={line.w} onChange={(e) => set({ w: e.target.value })} />
                                    ×
                                    <input className={cx(SMALL, 'w-16 text-center')} inputMode="numeric" aria-label="Length (inch)" value={line.l} onChange={(e) => set({ l: e.target.value })} />
                                    ×
                                </>) : <span>{line.w} × {line.l} ×</span>}
                                {hr?.options ? (
                                    <select className={cx(SMALL, 'cursor-pointer')} aria-label="Height (inch)" value={line.h} onChange={(e) => set({ h: e.target.value })}>
                                        {hr.options.map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                ) : hr?.fixed != null ? <span>{hr.fixed}</span> : (
                                    <input className={cx(SMALL, 'w-16 text-center')} inputMode="numeric" aria-label="Height (inch)"
                                        title={hr?.min != null ? `${hr.min}–${hr.max ?? ''} inch` : undefined}
                                        value={line.h} onChange={(e) => set({ h: e.target.value })} />
                                )}
                                <span>inch</span>
                                {item.options.length > 0 && (
                                    <select className={cx(SMALL, 'ml-auto cursor-pointer')} aria-label={item.optionTitle} value={line.option}
                                        onChange={(e) => set({ option: e.target.value })}>
                                        {item.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                                    </select>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <input className={cx(SMALL, 'min-w-0 flex-1')} placeholder="Size / details (e.g. 72 × 80 × 6 inch, blue)" value={line.sizeText}
                                onChange={(e) => set({ sizeText: e.target.value })} />
                            {line.kind === 'custom' && (
                                <select className={cx(SMALL, 'cursor-pointer')} aria-label="Division" value={line.division} onChange={(e) => set({ division: e.target.value })}>
                                    {DIVISIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Qty · price · total */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex h-9 items-center rounded-lg border border-gray-200">
                            <button type="button" aria-label="Less" onClick={() => set({ qty: Math.max(1, line.qty - 1) })}
                                className="flex h-full w-9 items-center justify-center text-gray-500 hover:text-gray-900"><LuMinus size={14} /></button>
                            <input className="h-full w-10 bg-transparent text-center text-sm outline-none" inputMode="numeric" aria-label="Quantity" value={line.qty}
                                onChange={(e) => set({ qty: Math.max(1, Math.min(999, Number(e.target.value.replace(/\D/g, '')) || 1)) })} />
                            <button type="button" aria-label="More" onClick={() => set({ qty: Math.min(999, line.qty + 1) })}
                                className="flex h-full w-9 items-center justify-center text-gray-500 hover:text-gray-900"><LuPlus size={14} /></button>
                        </div>
                        <span className="text-gray-300">×</span>
                        <label className="relative">
                            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">৳</span>
                            <input className={cx(SMALL, 'w-28 pl-6', line.price !== '' && !Number.isFinite(price) && 'border-red-300')} inputMode="numeric"
                                aria-label="Unit price" placeholder="Price" value={line.price}
                                onChange={(e) => onChange({ ...line, price: e.target.value.replace(/[^\d.]/g, ''), priceEdited: true })} />
                        </label>
                        {line.mrp > price && Number.isFinite(price) && <span className="text-xs text-gray-400 line-through">{taka(line.mrp)}</span>}
                        {line.priceEdited && line.kind === 'catalogue' && (
                            <button type="button" onClick={() => onChange(requote({ ...line, priceEdited: false }))}
                                className="text-xs font-medium text-[var(--color-primary)] hover:underline">Website price</button>
                        )}
                        <span className="ml-auto text-sm font-semibold tabular-nums text-gray-900">{taka(total)}</span>
                    </div>
                </div>
            </div>
        </li>
    );
}

/* ─── Small pieces ───────────────────────────────────────── */

function Section({ title, hint, children, aside }: { title: string; hint?: string; children: React.ReactNode; aside?: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white">
            <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
                    {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
                </div>
                {aside}
            </header>
            <div className="px-5 pb-5">{children}</div>
        </section>
    );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button type="button" role="radio" aria-checked={on} onClick={onClick}
            className={cx('rounded-lg border px-3.5 py-2 text-sm transition',
                on ? 'border-gray-900 bg-gray-900 font-medium text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300')}>
            {children}
        </button>
    );
}

/* ─── Page ───────────────────────────────────────────────── */

// useSearchParams needs a Suspense boundary.
export default function AddOrderPage() {
    return (
        <Suspense fallback={null}>
            <AddOrder />
        </Suspense>
    );
}

function AddOrder() {
    // ?phone=…&name=… (from an inquiry) starts the form with that customer.
    const params = useSearchParams();
    const router = useRouter();
    const { role } = useViewRole();
    const mayMarkPaid = can(role, 'payment');
    const [createOrder, { isLoading: saving }] = useCreateAdminOrderMutation();
    const [savingAs, setSavingAs] = useState<'pending' | 'confirmed' | null>(null);

    /* Customer */
    const [cust, setCust] = useState({ phone: params.get('phone') || '', fullName: params.get('name') || '', email: '', address: '', city: '', area: '' });
    const phone = normalisePhone(cust.phone);
    const phoneOk = /^01\d{9}$/.test(phone);
    const { currentData: lookup, isFetching: lookingUp } = useLookupCustomerQuery(phone, { skip: !phoneOk });
    const existing: any = phoneOk ? lookup?.data || null : null;

    // A known number fills the empty fields once (staff's own typing is never overwritten).
    const [filledFor, setFilledFor] = useState('');
    if (existing && filledFor !== existing._id) {
        setFilledFor(existing._id);
        const addr = existing.shippingAddresses?.find((a: any) => a.isDefault) || existing.shippingAddresses?.[0];
        setCust((c) => ({
            ...c,
            fullName: c.fullName || `${existing.firstName || ''} ${existing.lastName && existing.lastName !== '.' ? existing.lastName : ''}`.trim(),
            email: c.email || (/@(guest\.|phone\.)/.test(existing.email || '') ? '' : existing.email || ''),
            address: c.address || addr?.address || '',
            area: c.area || addr?.area || '',
            city: c.city || addr?.city || '',
        }));
    }

    /* Lines */
    const [lines, setLines] = useState<Line[]>([]);
    const addLine = (l: Line) => setLines((ls) => [...ls, l]);
    const changeLine = (l: Line) => setLines((ls) => ls.map((x) => (x.key === l.key ? l : x)));
    const removeLine = (key: string) => setLines((ls) => ls.filter((x) => x.key !== key));
    const subtotal = lines.reduce((s, l) => s + (Number.isFinite(num(l.price)) ? num(l.price) * l.qty : 0), 0);
    const pieces = lines.reduce((n, l) => n + l.qty, 0);

    /* Delivery */
    const { data: ship } = useGetShippingSettingsQuery();
    const [area, setArea] = useState<'inside_dhaka' | 'outside_dhaka' | ''>('');
    const areaNow = area || (/dhaka/i.test(cust.city) ? 'inside_dhaka' : cust.city.trim() ? 'outside_dhaka' : '');
    const inside = ship?.defaultInsideDhakaRate ?? 60;
    const outside = ship?.defaultOutsideDhakaRate ?? 120;
    const freeOver = ship?.freeShippingByThresholdEnabled !== false ? ship?.freeShippingThreshold ?? 0 : 0;
    const [shipMode, setShipMode] = useState<'auto' | 'free' | 'custom'>('auto');
    const [shipAmount, setShipAmount] = useState('');
    const autoCharge = subtotal <= 0 ? 0 : freeOver > 0 && subtotal >= freeOver ? 0 : areaNow === 'inside_dhaka' ? inside : outside;
    const delivery = shipMode === 'free' ? 0 : shipMode === 'custom' ? (Number.isFinite(num(shipAmount)) ? num(shipAmount) : 0) : autoCharge;

    /* Discount, payment, notes */
    const [discount, setDiscount] = useState('');
    const discountNum = Math.min(subtotal, Number.isFinite(num(discount)) ? num(discount) : 0);
    const total = Math.max(0, subtotal - discountNum) + delivery;
    const [method, setMethod] = useState<PayMethod>('cod');
    const [sender, setSender] = useState('');
    const [trx, setTrx] = useState('');
    const [paid, setPaid] = useState(false);
    const [note, setNote] = useState('');
    const [adminNote, setAdminNote] = useState('');

    const submit = async (status: 'pending' | 'confirmed') => {
        if (!phoneOk) { toast.error('Enter the mobile number (01XXXXXXXXX)'); return; }
        if (!cust.fullName.trim()) { toast.error('Enter the customer’s name'); return; }
        if (!cust.address.trim()) { toast.error('Enter the delivery address'); return; }
        if (!lines.length) { toast.error('Add at least one product'); return; }
        for (const l of lines) {
            if (!l.name.trim()) { toast.error('Every line needs a product name'); return; }
            if (l.kind === 'catalogue' && !(num(l.w) > 0 && num(l.l) > 0 && num(l.h) > 0)) { toast.error(`Enter the size of “${l.name}”`); return; }
            if (!(num(l.price) >= 0)) { toast.error(`Enter the price of “${l.name}”`); return; }
        }
        if (shipMode === 'custom' && !(num(shipAmount) >= 0)) { toast.error('Enter the delivery charge'); return; }

        const body: ManualOrderInput = {
            items: lines.map((l) => ({
                ...(l.kind === 'catalogue' ? { product: l.item!.slug } : l.kind === 'product' ? { product: l.productId } : {}),
                name: l.name.trim(),
                quantity: l.qty,
                price: Math.round(num(l.price)),
                ...(l.mrp > num(l.price) ? { originalPrice: Math.round(l.mrp) } : {}),
                division: l.division,
                size: sizeOf(l) || undefined,
                image: l.image || undefined,
            })),
            shippingAddress: {
                fullName: cust.fullName.trim(),
                phone,
                email: cust.email.trim() || undefined,
                address: cust.address.trim(),
                city: cust.city.trim() || undefined,
                area: cust.area.trim() || undefined,
            },
            paymentMethod: method,
            ...(method !== 'cod' && (sender.trim() || trx.trim()) ? { paymentDetails: { senderNumber: sender.trim() || undefined, transactionId: trx.trim() || undefined } } : {}),
            paymentStatus: mayMarkPaid && paid ? 'paid' : 'pending',
            status,
            ...(areaNow ? { deliveryArea: areaNow } : {}),
            shipping: shipMode === 'custom' ? { mode: 'custom', amount: Math.round(num(shipAmount)) } : { mode: shipMode },
            ...(discountNum > 0 ? { discount: Math.round(discountNum) } : {}),
            note: note.trim() || undefined,
            adminNote: adminNote.trim() || undefined,
        };

        setSavingAs(status);
        try {
            const res = await createOrder(body).unwrap();
            toast.success(`Order ${res?.data?.orderId || ''} ${status === 'confirmed' ? 'confirmed' : 'saved'}`);
            router.push(res?.data?._id ? `/dashboard/admin/orders/${res.data._id}` : '/dashboard/admin/orders');
        } catch (err: any) {
            toast.error(err?.data?.errorMessages?.[0]?.message || err?.data?.message || 'Could not create the order');
        } finally {
            setSavingAs(null);
        }
    };

    return (
        <div className="mx-auto max-w-6xl">
            <PageHeader back={{ href: '/dashboard/admin/orders', label: 'Orders' }} title="Add order" subtitle="An order taken by phone or for a walk-in customer." />

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                    {/* Customer */}
                    <Section title="Customer" hint="Type the mobile number first — a returning customer is filled in for you.">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Mobile number" required error={cust.phone && !phoneOk ? '11 digits, starting with 01' : undefined}>
                                <input className={INPUT} inputMode="tel" placeholder="01XXXXXXXXX" autoFocus value={cust.phone}
                                    onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
                            </Field>
                            <Field label="Name" required>
                                <input className={INPUT} value={cust.fullName} onChange={(e) => setCust({ ...cust, fullName: e.target.value })} />
                            </Field>
                        </div>
                        {phoneOk && !lookingUp && (
                            <p className={cx('mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm', existing ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-50 text-gray-600')}>
                                {existing ? <LuUserCheck size={15} /> : <LuUserPlus size={15} />}
                                {existing ? 'Returning customer — details filled in' : 'New customer — added with this order'}
                            </p>
                        )}
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Field label="Address" required className="sm:col-span-2">
                                <textarea className={TEXTAREA} rows={2} placeholder="House, road, area" value={cust.address}
                                    onChange={(e) => setCust({ ...cust, address: e.target.value })} />
                            </Field>
                            <Field label="District / city">
                                <input className={INPUT} placeholder="e.g. Dhaka" value={cust.city} onChange={(e) => setCust({ ...cust, city: e.target.value })} />
                            </Field>
                            <Field label="Area / thana">
                                <input className={INPUT} value={cust.area} onChange={(e) => setCust({ ...cust, area: e.target.value })} />
                            </Field>
                            <Field label="Email" hint="Optional." className="sm:col-span-2">
                                <input className={INPUT} type="email" value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} />
                            </Field>
                        </div>
                    </Section>

                    {/* Products */}
                    <section className="rounded-2xl border border-gray-200 bg-white">
                        <header className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5">
                            <div>
                                <h2 className="text-[15px] font-semibold text-gray-900">Products</h2>
                                <p className="mt-0.5 text-sm text-gray-500">Mattress and foam are priced by size, as on the website. Change any price for this order.</p>
                            </div>
                        </header>
                        {lines.length > 0 && (
                            <ul className="divide-y divide-gray-100 border-y border-gray-100">
                                {lines.map((l) => <LineRow key={l.key} line={l} onChange={changeLine} onRemove={() => removeLine(l.key)} />)}
                            </ul>
                        )}
                        <div className="px-5 py-4">
                            <ProductPicker onPick={addLine} onCustom={() => addLine(customLine())} />
                        </div>
                    </section>

                    {/* Delivery & payment */}
                    <Section title="Delivery & payment">
                        <div className="space-y-5">
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">Delivery area</p>
                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Delivery area">
                                    <Choice on={areaNow === 'inside_dhaka'} onClick={() => setArea('inside_dhaka')}>Inside Dhaka · {taka(inside)}</Choice>
                                    <Choice on={areaNow === 'outside_dhaka'} onClick={() => setArea('outside_dhaka')}>Outside Dhaka · {taka(outside)}</Choice>
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">Delivery charge</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Segmented<'auto' | 'free' | 'custom'> value={shipMode} onChange={setShipMode}
                                        options={[{ value: 'auto', label: 'Normal' }, { value: 'free', label: 'Free' }, { value: 'custom', label: 'Custom' }]} />
                                    {shipMode === 'custom' && (
                                        <label className="relative">
                                            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">৳</span>
                                            <input className={cx(SMALL, 'w-28 pl-6')} inputMode="numeric" aria-label="Delivery charge" value={shipAmount}
                                                onChange={(e) => setShipAmount(e.target.value.replace(/[^\d.]/g, ''))} />
                                        </label>
                                    )}
                                </div>
                                {shipMode === 'auto' && freeOver > 0 && <p className="mt-1.5 text-xs text-gray-400">Free over {taka(freeOver)}.</p>}
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">Payment</p>
                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Payment method">
                                    {PAYMENT_METHODS.map((m) => <Choice key={m.id} on={method === m.id} onClick={() => setMethod(m.id)}>{m.label}</Choice>)}
                                </div>
                                {method !== 'cod' && (
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <input className={INPUT} inputMode="tel" placeholder="Sender number" value={sender} onChange={(e) => setSender(e.target.value)} />
                                        <input className={INPUT} placeholder="Transaction ID" value={trx} onChange={(e) => setTrx(e.target.value)} />
                                    </div>
                                )}
                                {mayMarkPaid && (
                                    <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                                        <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />
                                        Payment already received
                                    </label>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* Notes */}
                    <Section title="Notes">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="For delivery" hint="Printed on the memo.">
                                <textarea className={TEXTAREA} rows={2} placeholder="e.g. Call before coming" value={note} onChange={(e) => setNote(e.target.value)} />
                            </Field>
                            <Field label="Internal" hint="Staff only.">
                                <textarea className={TEXTAREA} rows={2} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
                            </Field>
                        </div>
                    </Section>
                </div>

                {/* Summary */}
                <aside className="lg:sticky lg:top-20">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <h2 className="text-[15px] font-semibold text-gray-900">Summary</h2>
                        <dl className="mt-4 space-y-2.5 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Subtotal · {pieces} pc{pieces === 1 ? '' : 's'}</dt><dd className="tabular-nums text-gray-900">{taka(subtotal)}</dd></div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-gray-500">Discount</dt>
                                <dd className="relative">
                                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">−৳</span>
                                    <input className={cx(SMALL, 'h-8 w-24 pl-7 text-right')} inputMode="numeric" aria-label="Discount" placeholder="0" value={discount}
                                        onChange={(e) => setDiscount(e.target.value.replace(/[^\d.]/g, ''))} />
                                </dd>
                            </div>
                            <div className="flex justify-between"><dt className="text-gray-500">Delivery</dt><dd className="tabular-nums text-gray-900">{subtotal > 0 && delivery === 0 ? 'Free' : taka(delivery)}</dd></div>
                            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
                                <dt className="font-semibold text-gray-900">Total</dt>
                                <dd className="font-semibold tabular-nums text-gray-900">{taka(total)}</dd>
                            </div>
                        </dl>

                        <div className="mt-5 space-y-2">
                            <Btn variant="primary" className="w-full" icon={<LuCheck size={16} />} disabled={saving || !lines.length} onClick={() => submit('confirmed')}>
                                {savingAs === 'confirmed' ? 'Confirming…' : 'Confirm order'}
                            </Btn>
                            <Btn className="w-full" disabled={saving || !lines.length} onClick={() => submit('pending')}>
                                {savingAs === 'pending' ? 'Saving…' : 'Save as pending'}
                            </Btn>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-gray-400">
                            Confirm when the customer has agreed on the phone — the factory gets it at once. Pending waits for a call.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
