"use client";

/**
 * Courier payouts & accounts — what went out with Pathao and Steadfast, what they
 * collected, what they charged, what they paid and what they still owe. Super admin and
 * admin only (the server checks again). Everything comes from /api/courier-payouts.
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
    LuClock, LuTruck, LuWallet, LuUndo2, LuArrowRight, LuRefreshCw, LuSend, LuPackage, LuCalendarCheck,
    LuCircleCheck, LuBanknote, LuSearch, LuPlus, LuTrash2,
} from 'react-icons/lu';
import CourierTabs from '@/components/admin/courier/CourierTabs';
import PageGuide from '@/components/admin/PageGuide';
import { Btn, Card, Modal, Field, INPUT, TEXTAREA, SelectPill, Segmented, Badge, Pager, taka, cx, fmtDate } from '@/components/admin/ui';
import { useGetCourierBalanceQuery } from '@/redux/api/courierApi';
import {
    useGetCourierOverviewQuery, useGetCourierPayoutsQuery, useSyncCourierPayoutsMutation, useAddCourierPayoutMutation,
    useDeleteCourierPayoutMutation, type PayoutCarrier, type ICourierOverview,
} from '@/redux/api/payoutApi';
import { BD_DIVISIONS, BD_DISTRICTS, getDistrict, getDivision, districtTerms, divisionTerms } from '@/lib/bdGeo';

const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');
const COURIER = '/dashboard/admin/courier';
const errMsg = (e: unknown, fallback: string) => (e as { data?: { message?: string } })?.data?.message || fallback;

const OUTCOME = {
    delivered: { label: 'Delivered', color: '#10b981' },
    progress: { label: 'In progress', color: '#f59e0b' },
    partial: { label: 'Partly delivered', color: '#0ea5e9' },
    returned: { label: 'Returned', color: '#ef4444' },
} as const;
type Outcome = keyof typeof OUTCOME;
const OUTCOMES = Object.keys(OUTCOME) as Outcome[];

/* ─── Dates (the browser's own day — Bangladesh) ─── */
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysAgo = (k: number) => { const d = new Date(); d.setDate(d.getDate() - k); return ymd(d); };
const PERIODS = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '3', label: 'Last 3 days' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: 'month', label: 'This month' },
];
function periodRange(p: string): { from?: string; to?: string } {
    if (p === 'today') return { from: daysAgo(0), to: daysAgo(0) };
    if (p === 'yesterday') return { from: daysAgo(1), to: daysAgo(1) };
    if (['3', '7', '30'].includes(p)) return { from: daysAgo(Number(p) - 1), to: daysAgo(0) };
    if (p === 'month') { const d = new Date(); return { from: ymd(new Date(d.getFullYear(), d.getMonth(), 1)), to: daysAgo(0) }; }
    return {};
}

/* ─── Small pieces ─── */

function NowRow({ icon, tone, title, hint, value, sub, href }: {
    icon: React.ReactNode; tone: string; title: string; hint?: string; value: React.ReactNode; sub?: React.ReactNode; href?: string;
}) {
    const body = (
        <>
            <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', tone)}>{icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900">{title}</span>
                {hint && <span className="block text-xs text-amber-600">{hint}</span>}
            </span>
            <span className="text-right">
                <span className="block text-lg font-semibold tabular-nums text-gray-900">{value}</span>
                {sub && <span className="block text-[11px] text-gray-400">{sub}</span>}
            </span>
            {href && <LuArrowRight size={15} className="text-gray-300" />}
        </>
    );
    return href
        ? <Link href={href} className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50/60">{body}</Link>
        : <div className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0">{body}</div>;
}

function Tile({ label, value, hint, icon, tone = 'text-gray-900', className }: {
    label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode; icon?: React.ReactNode; tone?: string; className?: string;
}) {
    return (
        <div className={cx('rounded-2xl border border-gray-200 bg-white p-4', className)}>
            <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">{icon}{label}</p>
            <p className={cx('mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums', tone)}>{value}</p>
            {hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

function Mini({ label, value, hint, tone = 'text-gray-900' }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">{label}</p>
            <p className={cx('mt-1 text-xl font-semibold tabular-nums', tone)}>{value}</p>
            {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
        </div>
    );
}

/** Parcels booked each day, stacked by how they ended. */
function DailyBars({ daily }: { daily: ICourierOverview['daily'] }) {
    const W = 620, H = 170, L = 26, B = 18;
    const max = Math.max(1, ...daily.map((d) => d.delivered + d.progress + d.partial + d.returned));
    const top = Math.ceil(max / 2) * 2;
    const slot = (W - L) / daily.length;
    const bar = Math.max(3, slot * 0.72);
    const y = (v: number) => (H - B) - (v / top) * (H - B - 6);
    const label = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Parcels booked each day">
            {[0, top / 2, top].map((v) => (
                <g key={v}>
                    <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#f1f5f9" />
                    <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
                </g>
            ))}
            {daily.map((d, i) => {
                let acc = 0;
                const x = L + i * slot + (slot - bar) / 2;
                return (
                    <g key={d.date}>
                        <title>{`${label(d.date)}: ${OUTCOMES.map((k) => `${OUTCOME[k].label} ${d[k]}`).join(', ')}`}</title>
                        {OUTCOMES.map((k) => {
                            const v = d[k];
                            if (!v) return null;
                            const y1 = y(acc + v), y0 = y(acc);
                            acc += v;
                            return <rect key={k} x={x} y={y1} width={bar} height={Math.max(1, y0 - y1)} fill={OUTCOME[k].color} rx={1.5} />;
                        })}
                    </g>
                );
            })}
            {[0, Math.floor(daily.length / 2), daily.length - 1].map((i) => daily[i] && (
                <text key={i} x={L + i * slot + slot / 2} y={H - 4} textAnchor={i === 0 ? 'start' : i === daily.length - 1 ? 'end' : 'middle'} fontSize="9" fill="#9ca3af">{label(daily[i].date)}</text>
            ))}
        </svg>
    );
}

/* ─── Add a payout by hand (Pathao, or anything Sync missed) ─── */

function AddPayout({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [add, { isLoading }] = useAddCourierPayoutMutation();
    const [form, setForm] = useState({ carrier: 'pathao' as PayoutCarrier, paidAt: ymd(new Date()), amount: '', reference: '', parcels: '', note: '' });
    const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
    const save = async () => {
        try {
            await add({ ...form, amount: Number(form.amount) }).unwrap();
            toast.success('Payout saved');
            setForm((f) => ({ ...f, amount: '', reference: '', parcels: '', note: '' }));
            onClose();
        } catch (e) {
            toast.error(errMsg(e, 'Could not save the payout'));
        }
    };
    return (
        <Modal open={open} onClose={onClose} title="Add a payout" subtitle="Money the courier sent — from its statement."
            footer={<>
                <Btn onClick={onClose}>Cancel</Btn>
                <Btn variant="primary" onClick={save} disabled={isLoading || !(Number(form.amount) > 0)}>{isLoading ? 'Saving…' : 'Save payout'}</Btn>
            </>}>
            <div className="space-y-4">
                <Field label="Courier">
                    <Segmented value={form.carrier} onChange={set('carrier')} options={[{ value: 'pathao', label: 'Pathao' }, { value: 'steadfast', label: 'Steadfast' }]} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Paid on" required><input type="date" className={INPUT} value={form.paidAt} onChange={(e) => set('paidAt')(e.target.value)} /></Field>
                    <Field label="Amount received (৳)" required><input type="number" min={0} className={INPUT} value={form.amount} onChange={(e) => set('amount')(e.target.value)} /></Field>
                </div>
                <Field label="Reference" hint="Invoice or payment number from the courier"><input className={INPUT} value={form.reference} onChange={(e) => set('reference')(e.target.value)} /></Field>
                <Field label="Parcels in this payout" hint="Consignment IDs or order numbers, separated by commas or new lines — each is marked paid">
                    <textarea rows={3} className={TEXTAREA} value={form.parcels} onChange={(e) => set('parcels')(e.target.value)} />
                </Field>
                <Field label="Note"><input className={INPUT} value={form.note} onChange={(e) => set('note')(e.target.value)} /></Field>
            </div>
        </Modal>
    );
}

/* ─── The page ─── */

export default function CourierPayoutsPage() {
    const [carrier, setCarrier] = useState<'all' | PayoutCarrier>('all');
    const [period, setPeriod] = useState('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [search, setSearch] = useState('');
    const [division, setDivision] = useState('all');
    const [district, setDistrict] = useState('all');
    const [pay, setPay] = useState<'all' | 'cod' | 'prepaid'>('all');
    const [asTable, setAsTable] = useState(false);
    const [adding, setAdding] = useState(false);
    const [page, setPage] = useState(1);

    const pickPeriod = (p: string) => { setPeriod(p); const r = periodRange(p); setFrom(r.from || ''); setTo(r.to || ''); setPage(1); };
    const places = useMemo(() => {
        const d = district !== 'all' ? getDistrict(district) : undefined;
        const v = !d && division !== 'all' ? getDivision(division) : undefined;
        const t = d ? districtTerms(d) : v ? divisionTerms(v) : [];
        return t.length ? t.join('|') : undefined;
    }, [division, district]);

    const c = carrier !== 'all' ? carrier : undefined;
    const { data, isLoading, isFetching, refetch } = useGetCourierOverviewQuery({
        carrier: c, from: from || undefined, to: to || undefined, search: search.trim() || undefined, places, pay: pay !== 'all' ? pay : undefined,
    });
    const o = data?.data;
    const { data: payoutsData, isFetching: payoutsFetching } = useGetCourierPayoutsQuery({ carrier: c, from: from || undefined, to: to || undefined, page, limit: 10 });
    const { data: balanceData } = useGetCourierBalanceQuery(undefined, { skip: !o?.setup.steadfast });
    const [sync, { isLoading: syncing }] = useSyncCourierPayoutsMutation();
    const [remove] = useDeleteCourierPayoutMutation();

    const doSync = async () => {
        try {
            const r = await sync().unwrap();
            toast.success(r.message || 'Synced');
        } catch (e) {
            toast.error(errMsg(e, 'Could not sync payouts'));
        }
    };
    const doRemove = async (id: string) => {
        if (!window.confirm('Remove this payout? Its parcels will count as unpaid again.')) return;
        try { await remove(id).unwrap(); toast.success('Payout removed'); } catch (e) { toast.error(errMsg(e, 'Could not remove it')); }
    };

    const carrierName = carrier === 'all' ? 'Pathao + Steadfast' : carrier === 'pathao' ? 'Pathao' : 'Steadfast';
    const a = o?.accounts;
    const dash = isLoading ? '…' : undefined;
    const payouts = payoutsData?.data || [];
    const pmeta = payoutsData?.meta || { total: 0, totalPages: 1 };

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <CourierTabs title={<>Courier · {carrierName}</>} subtitle="What the courier collected, charged, paid and still owes."
                status={o?.setup}
                right={<>
                    <Segmented value={carrier} onChange={(v) => { setCarrier(v); setPage(1); }} options={[{ value: 'all', label: 'All' }, { value: 'pathao', label: 'Pathao' }, { value: 'steadfast', label: 'Steadfast' }]} />
                    <PageGuide page="payouts" />
                </>} />

            {/* Accounts by date */}
            <h2 className="mb-3 text-[15px] font-semibold text-gray-900">Accounts by date</h2>
            <section className="mb-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">Sent:</span>
                    {PERIODS.map((p) => (
                        <button key={p.value} type="button" onClick={() => pickPeriod(p.value)}
                            className={cx('h-8 rounded-full px-3 text-xs font-semibold transition', period === p.value ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100')}>
                            {p.label}
                        </button>
                    ))}
                    <span className="flex items-center gap-1.5">
                        <input type="date" aria-label="From" value={from} onChange={(e) => { setFrom(e.target.value); setPeriod('custom'); setPage(1); }} className={cx(INPUT, 'h-8 w-36 text-xs')} />
                        <span className="text-gray-300">–</span>
                        <input type="date" aria-label="To" value={to} onChange={(e) => { setTo(e.target.value); setPeriod('custom'); setPage(1); }} className={cx(INPUT, 'h-8 w-36 text-xs')} />
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]">
                    <label className="relative block">
                        <LuSearch size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order #, name, phone, consignment or tracking code…" className={cx(INPUT, 'pl-9')} />
                    </label>
                    <SelectPill ariaLabel="Division" value={division} onChange={(v) => { setDivision(v); setDistrict('all'); }}
                        options={[{ value: 'all', label: 'All divisions' }, ...BD_DIVISIONS.map((v) => ({ value: v.key, label: `${v.name} · ${v.bn}` }))]} />
                    <SelectPill ariaLabel="District" value={district} onChange={setDistrict}
                        options={[{ value: 'all', label: 'All districts' }, ...(division !== 'all' ? BD_DISTRICTS.filter((x) => x.division === division) : BD_DISTRICTS).map((x) => ({ value: x.key, label: `${x.name} · ${x.bn}` }))]} />
                    <SelectPill ariaLabel="Payment" value={pay} onChange={(v) => setPay(v as typeof pay)}
                        options={[{ value: 'all', label: 'COD + prepaid' }, { value: 'cod', label: 'COD only' }, { value: 'prepaid', label: 'Prepaid only' }]} />
                </div>
            </section>

            <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-700">Courier owes you</p>
                    <p className="mt-1 text-3xl font-semibold text-amber-700">{dash ?? taka(a?.owes)}</p>
                    <p className="mt-1 text-xs text-amber-700/80">
                        Collected on delivered parcels, less the courier&apos;s charge, not paid out yet.
                        {!!a?.chargesUnknown && ` Charges on ${n(a.chargesUnknown)} parcel(s) are not reported yet, so the real figure is a little lower.`}
                    </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">Courier has paid you</p>
                    <p className="mt-1 text-3xl font-semibold text-emerald-700">{dash ?? taka(a?.paid.value)}</p>
                    <p className="mt-1 text-xs text-emerald-700/80">{n(a?.paid.n)} payouts in this period (by payout date).</p>
                </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Mini label="Parcels sent" value={n(a?.sent.n)} hint={`${n(a?.sent.delivered)} delivered · ${n(a?.sent.partial)} partial · ${n(a?.sent.returned)} returned · ${n(a?.sent.onTheWay)} on the way`} />
                <Mini label="COD asked" value={taka(a?.codAsked)} hint="What buyers were asked to pay on delivery" />
                <Mini label="COD collected" tone="text-emerald-600" value={taka(a?.codCollected)} hint="Collected by the courier on delivered parcels" />
                <Mini label="Still with the courier" tone="text-sky-600" value={taka(a?.stillWithCourier)} hint="COD on parcels not delivered yet" />
                <Mini label="Courier charges" tone="text-red-600" value={taka(a?.courierCharges.value)} hint={a?.courierCharges.unknown ? `${n(a.courierCharges.unknown)} parcel(s) not reported yet` : 'All charges reported'} />
                <Mini label="Return charges" value={taka(a?.returnCharges.value)} hint={`${n(a?.returnCharges.returned)} returned parcel(s)`} />
                <Mini label="Buyers paid for delivery" value={taka(a?.buyersPaid)} hint="Delivery charge on these orders" />
                <Mini label="Delivery: you − courier" tone={(a?.deliveryDiff || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}
                    value={`${(a?.deliveryDiff || 0) >= 0 ? '+' : '−'}${taka(Math.abs(a?.deliveryDiff || 0))}`} hint="What buyers paid for delivery, less what the courier charged" />
            </div>

            {/* Payouts */}
            <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3.5">
                    <h2 className="text-[15px] font-semibold text-gray-900">Payouts from {carrierName}</h2>
                    <div className="flex flex-wrap gap-2">
                        <Btn icon={<LuPlus size={15} />} onClick={() => setAdding(true)}>Add payout</Btn>
                        <Btn icon={<LuRefreshCw size={15} className={syncing ? 'animate-spin' : ''} />} onClick={doSync} disabled={syncing || !o?.setup.steadfast}
                            title={o?.setup.steadfast ? undefined : 'Steadfast is not connected'}>Sync payouts</Btn>
                    </div>
                </div>
                {!payouts.length ? (
                    <p className="px-5 py-12 text-center text-sm text-gray-500">{payoutsFetching ? 'Loading…' : 'এই সময়ে কোনো পেআউট নেই। Steadfast-এর নতুন পেআউট আনতে "Sync payouts" চাপুন, Pathao-রটা "Add payout" দিয়ে যোগ করুন।'}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500">
                                    <th className="px-5 py-3">Paid on</th><th className="px-3 py-3">Courier</th><th className="px-3 py-3">Reference</th>
                                    <th className="px-3 py-3 text-right">Parcels</th><th className="px-3 py-3 text-right">COD</th><th className="px-3 py-3 text-right">Charges</th>
                                    <th className="px-3 py-3 text-right">Received</th><th className="px-3 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((p) => (
                                    <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                        <td className="px-5 py-3 text-gray-700">{fmtDate(p.paidAt)}</td>
                                        <td className="px-3 py-3"><Badge tone={p.carrier === 'pathao' ? 'red' : 'green'}>{p.carrier === 'pathao' ? 'Pathao' : 'Steadfast'}</Badge>{p.source === 'manual' && <span className="ml-1.5 text-[11px] text-gray-400">by hand</span>}</td>
                                        <td className="px-3 py-3 font-mono text-xs text-gray-600">{p.reference || '—'}{p.note && <span className="block font-sans text-[11px] text-gray-400">{p.note}</span>}</td>
                                        <td className="px-3 py-3 text-right tabular-nums">{n(p.parcels?.length)}</td>
                                        <td className="px-3 py-3 text-right tabular-nums">{taka(p.codTotal)}</td>
                                        <td className="px-3 py-3 text-right tabular-nums text-red-600">{taka(p.chargeTotal)}</td>
                                        <td className="px-3 py-3 text-right font-semibold tabular-nums text-emerald-700">{taka(p.amount)}</td>
                                        <td className="px-3 py-3 text-right">
                                            <button type="button" onClick={() => doRemove(p._id)} aria-label="Remove payout" className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"><LuTrash2 size={15} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {pmeta.totalPages > 1 && <div className="border-t border-gray-100 px-5 py-3"><Pager page={page} totalPages={pmeta.totalPages} total={pmeta.total} pageSize={10} count={payouts.length} onPage={setPage} noun="payouts" /></div>}
            </section>

            {/* Right now + quick actions */}
            <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card title="Right now" actions={<button type="button" onClick={() => refetch()} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)]"><LuRefreshCw size={13} className={isFetching ? 'animate-spin' : ''} /> Refresh</button>}>
                    <NowRow icon={<LuClock size={17} />} tone="bg-amber-50 text-amber-600" title="In review" hint="Added, not picked up by the courier yet" value={dash ?? n(o?.rightNow.inReview)} href={`${COURIER}?tab=sent`} />
                    <NowRow icon={<LuTruck size={17} />} tone="bg-sky-50 text-sky-600" title="Delivery processing" value={dash ?? n(o?.rightNow.processing)} href={`${COURIER}?tab=in_transit`} />
                    <NowRow icon={<LuWallet size={17} />} tone="bg-emerald-50 text-emerald-600" title="COD processing" hint="Delivered, the courier has not paid yet"
                        value={dash ?? n(o?.rightNow.codProcessing.n)} sub={o && taka(o.rightNow.codProcessing.value)} />
                    <NowRow icon={<LuUndo2 size={17} />} tone="bg-red-50 text-red-500" title="Returns (30 days)" value={dash ?? n(o?.rightNow.returns30)} href={`${COURIER}?tab=returned`} />
                </Card>
                <Card title="Quick actions">
                    <div className="grid grid-cols-2 gap-3">
                        <Link href={`${COURIER}?tab=ready`} className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 py-6 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                            <LuSend size={20} className="text-[var(--color-primary)]" /> Send to courier
                        </Link>
                        <Link href={`${COURIER}?tab=all`} className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 py-6 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                            <LuPackage size={20} className="text-[var(--color-primary)]" /> All parcels
                        </Link>
                        <button type="button" onClick={doSync} disabled={syncing || !o?.setup.steadfast} title={o?.setup.steadfast ? 'Pull new payouts from Steadfast' : 'Steadfast is not connected'}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 py-6 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <LuRefreshCw size={20} className={cx('text-[var(--color-primary)]', syncing && 'animate-spin')} /> {syncing ? 'Syncing…' : 'Sync payouts'}
                        </button>
                        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 py-6">
                            <span className="text-xs text-gray-500">Steadfast balance</span>
                            <span className="text-lg font-semibold text-gray-900">{o?.setup.steadfast ? (typeof balanceData?.data?.current_balance === 'number' ? taka(balanceData.data.current_balance) : '…') : '—'}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Last 30 days */}
            <h2 className="mb-3 text-[15px] font-semibold text-gray-900">Your last 30 days</h2>
            <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Tile icon={<LuCalendarCheck size={13} />} label="Booked today" value={dash ?? n(o?.last30.bookedToday)} hint={`${n(o?.last30.bookedYesterday)} yesterday`} />
                <Tile icon={<LuPackage size={13} />} label="Booked · 30 days" value={dash ?? n(o?.last30.booked)} />
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><LuCircleCheck size={13} />Delivery success</p>
                    <p className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-gray-900">{dash ?? `${o?.last30.success.pct ?? 0}%`}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${o?.last30.success.pct || 0}%` }} /></div>
                    <p className="mt-2 text-xs text-gray-400">{n(o?.last30.success.delivered)} delivered of {n(o?.last30.success.finished)} finished</p>
                </div>
                <Tile icon={<LuBanknote size={13} />} label="Delivered, not yet paid" tone="text-emerald-600" value={dash ?? taka(o?.last30.notPaid.value)}
                    hint={`${n(o?.last30.notPaid.n)} parcels · after charges you get ${taka(o?.last30.notPaid.afterCharges)}`} />
            </div>

            {/* Chart + how they ended */}
            <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <Card title="Parcels booked each day" description="Coloured by how each day's parcels have ended up so far.">
                    <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {OUTCOMES.map((k) => <span key={k} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: OUTCOME[k].color }} />{OUTCOME[k].label}</span>)}
                    </div>
                    {o ? (asTable ? (
                        <div className="max-h-72 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-xs text-gray-500"><th className="py-1.5">Date</th>{OUTCOMES.map((k) => <th key={k} className="py-1.5 text-right">{OUTCOME[k].label}</th>)}</tr></thead>
                                <tbody>{[...o.daily].reverse().map((d) => (
                                    <tr key={d.date} className="border-t border-gray-50"><td className="py-1.5 text-gray-600">{fmtDate(d.date)}</td>{OUTCOMES.map((k) => <td key={k} className="py-1.5 text-right tabular-nums">{d[k]}</td>)}</tr>
                                ))}</tbody>
                            </table>
                        </div>
                    ) : <DailyBars daily={o.daily} />) : <div className="h-44 animate-pulse rounded-xl bg-gray-50" />}
                    <button type="button" onClick={() => setAsTable((v) => !v)} className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-800">› {asTable ? 'Show as a chart' : 'Show as a table'}</button>
                </Card>
                <Card title="How they ended up" description={`${n(o?.ended.total)} parcels booked in 30 days`}>
                    <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                        {o && OUTCOMES.map((k) => o.ended[k] ? <div key={k} style={{ width: `${(o.ended[k] / Math.max(1, o.ended.total)) * 100}%`, background: OUTCOME[k].color }} /> : null)}
                    </div>
                    <ul className="space-y-2.5 text-sm">
                        {OUTCOMES.map((k) => (
                            <li key={k} className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: OUTCOME[k].color }} />
                                <span className="flex-1 text-gray-700">{OUTCOME[k].label}</span>
                                <b className="tabular-nums text-gray-900">{n(o?.ended[k])}</b>
                                <span className="w-10 text-right text-xs tabular-nums text-gray-400">{o?.ended.total ? Math.round((o.ended[k] / o.ended.total) * 100) : 0}%</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <AddPayout open={adding} onClose={() => setAdding(false)} />
        </div>
    );
}
