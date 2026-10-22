/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Factory scan station. A USB barcode scanner types the code and presses Enter, so the
 * box below takes a scan without any click. Each piece counts once; a repeat is refused,
 * logged on the order and reported to the admins. When every piece of a challan is
 * scanned, its original is issued — once — and prints as Office Copy + Factory Copy.
 */
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useViewRole } from '@/components/admin/viewRole';
import {
    LuScanBarcode, LuCircleCheck, LuCircleX, LuPrinter, LuTag, LuKeyboard, LuFactory, LuHistory, LuEye, LuHand,
} from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { useGetFactoryQueueQuery, useFactoryScanMutation, useIssueChallanMutation } from '@/redux/api/orderApi';
import { PageHeader, Btn, Card, Badge, Segmented, cx } from '@/components/admin/ui';
import { can } from '@/components/admin/access';
import { openChallan, openPieceLabels } from '@/components/admin/orders/orderPapers';

const apiError = (e: unknown, fallback: string) =>
    (e as { data?: { message?: string } })?.data?.message || fallback;

/** A short beep — high for a good scan, low for a refused one. */
function beep(ok: boolean) {
    try {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = ok ? 1200 : 220;
        o.type = ok ? 'sine' : 'square';
        g.gain.value = 0.08;
        o.connect(g); g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + (ok ? 0.09 : 0.35));
    } catch { /* no audio */ }
}

const when = (d?: string) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');

type Flash = { ok: boolean; title: string; detail?: string } | null;

export default function FactoryPage() {
    return (
        <Suspense fallback={null}>
            <FactoryStation />
        </Suspense>
    );
}

function FactoryStation() {
    const { role } = useViewRole();
    const focusChallan = useSearchParams().get('challan');
    const { data, isLoading, refetch } = useGetFactoryQueueQuery(undefined, { pollingInterval: 30000 });
    const [scan, { isLoading: isScanning }] = useFactoryScanMutation();
    const [issue, { isLoading: isIssuing }] = useIssueChallanMutation();

    const [code, setCode] = useState('');
    const [typed, setTyped] = useState(false);
    const [flash, setFlash] = useState<Flash>(null);
    const [log, setLog] = useState<{ at: number; ok: boolean; text: string }[]>([]);
    const [tab, setTab] = useState<'todo' | 'issued'>('todo');
    const inputRef = useRef<HTMLInputElement>(null);

    const rows: any[] = useMemo(() => data?.data || [], [data]);
    const todo = rows.filter((r) => !r.job.issuedAt);
    const issued = rows.filter((r) => r.job.issuedAt);
    const list = (tab === 'todo' ? todo : issued).slice().sort((a, b) => {
        if (focusChallan) {
            if (a.job.challanNo === focusChallan) return -1;
            if (b.job.challanNo === focusChallan) return 1;
        }
        const ra = a.job.unitsScanned >= a.job.unitsTotal ? 0 : a.job.unitsScanned > 0 ? 1 : 2;
        const rb = b.job.unitsScanned >= b.job.unitsTotal ? 0 : b.job.unitsScanned > 0 ? 1 : 2;
        return ra - rb;
    });

    // Keep the scanner box focused so a scan always lands in it.
    useEffect(() => { inputRef.current?.focus(); }, []);
    const refocus = () => setTimeout(() => inputRef.current?.focus(), 50);

    const record = (ok: boolean, text: string) => setLog((l) => [{ at: Date.now(), ok, text }, ...l].slice(0, 12));

    const doScan = async (raw: string, method: 'scan' | 'manual' = typed ? 'manual' : 'scan') => {
        const value = raw.trim();
        if (!value) return;
        try {
            const res = await scan({ code: value, method }).unwrap();
            const d = res?.data;
            beep(true);
            const title = `${d?.code} · ${d?.itemName}`;
            const detail = d?.remaining ? `${d.remaining} piece${d.remaining === 1 ? '' : 's'} left on this challan` : 'Every piece scanned — issue the challan';
            setFlash({ ok: true, title, detail });
            record(true, `${title} (${d?.orderId})`);
        } catch (e) {
            beep(false);
            const msg = apiError(e, 'Scan refused');
            setFlash({ ok: false, title: value.toUpperCase(), detail: msg });
            record(false, `${value.toUpperCase()} — ${msg}`);
        } finally {
            setCode('');
            refocus();
        }
    };

    const doIssue = async (row: any) => {
        if (!window.confirm(`Issue challan ${row.job.challanNo}? The original prints once — it cannot be printed again.`)) return;
        try {
            const res: any = await issue({ id: row.order._id, jobId: row.job._id }).unwrap();
            const order = res?.data;
            const job = (order?.jobs || []).find((j: any) => String(j._id) === String(row.job._id));
            toast.success(res?.message || 'Challan issued');
            try { openChallan(order, job, 'original'); } catch (err) { toast.error((err as Error).message); }
            refetch();
        } catch (e) {
            toast.error(apiError(e, 'Could not issue the challan'));
        } finally {
            refocus();
        }
    };

    // For papers printed from the queue (view copies and labels), a minimal order is enough.
    const paperOrder = (row: any) => ({
        _id: row.order._id, orderId: row.order.orderId,
        shippingAddress: { fullName: row.order.customer?.name, phone: row.order.customer?.phone },
    });

    return (
        <div>
            <PageHeader
                title="Factory scan station"
                subtitle="Scan each product once. When a challan's pieces are all scanned, issue it — the original prints only once."
                actions={<Btn icon={<LuHistory size={15} />} onClick={() => refetch()}>Refresh</Btn>}
            />

            {/* Scanner */}
            <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
                <form onSubmit={(e) => { e.preventDefault(); doScan(code); }} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <LuScanBarcode size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={inputRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onBlur={() => { if (!document.activeElement || document.activeElement === document.body) refocus(); }}
                            placeholder="Scan a piece (M1000-1) or a challan (M1000)…"
                            autoComplete="off"
                            spellCheck={false}
                            className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-gray-50 pl-14 pr-4 font-mono text-lg tracking-wider text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
                        />
                    </div>
                    <Btn variant="primary" type="submit" className="h-14 px-6" disabled={isScanning}>{isScanning ? 'Checking…' : 'Scan'}</Btn>
                </form>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={typed} onChange={(e) => { setTyped(e.target.checked); refocus(); }} className="accent-[var(--color-primary)]" />
                    <LuKeyboard size={15} /> Typing by hand (no scanner) — recorded as manual
                </label>

                {flash && (
                    <div className={cx('mt-4 flex items-start gap-3 rounded-2xl px-4 py-3.5',
                        flash.ok ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-red-50 text-red-800 ring-1 ring-red-200')}>
                        {flash.ok ? <LuCircleCheck size={24} className="mt-0.5 shrink-0" /> : <LuCircleX size={24} className="mt-0.5 shrink-0" />}
                        <div>
                            <p className="font-mono text-base font-semibold">{flash.title}</p>
                            {flash.detail && <p className="mt-0.5 text-sm">{flash.detail}</p>}
                        </div>
                    </div>
                )}
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <Segmented value={tab} onChange={setTab} options={[
                            { value: 'todo', label: `To do (${todo.length})` },
                            { value: 'issued', label: `Issued (${issued.length})` },
                        ]} />
                    </div>

                    {isLoading ? <div className="h-48 animate-pulse rounded-2xl bg-gray-100" /> : list.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-14 text-center text-sm text-gray-500">
                            <LuFactory size={30} className="mx-auto mb-2 text-gray-300" />
                            {tab === 'todo' ? 'Nothing waiting at the factory.' : 'No challans issued in the last three days.'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {list.map((row) => {
                                const { order, job } = row;
                                const done = job.unitsScanned >= job.unitsTotal;
                                const pct = job.unitsTotal ? Math.round((job.unitsScanned / job.unitsTotal) * 100) : 0;
                                const focused = focusChallan === job.challanNo;
                                return (
                                    <section key={job._id} className={cx('rounded-2xl border bg-white p-5', focused ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15' : 'border-gray-200')}>
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xl font-bold tracking-wide text-gray-900">{job.challanNo}</span>
                                                    <Badge tone="purple">{job.label}</Badge>
                                                    {job.issuedAt ? <Badge tone="green">Issued</Badge> : done ? <Badge tone="blue">Ready to issue</Badge> : job.unitsScanned ? <Badge tone="amber">In progress</Badge> : <Badge tone="gray">Waiting</Badge>}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">Order #{order.orderId} · {order.customer?.name} · {order.customer?.phone}</p>
                                                {order.note && <p className="mt-0.5 text-xs text-amber-700">Note: {order.note}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-semibold text-gray-900">{job.unitsScanned}<span className="text-base text-gray-400">/{job.unitsTotal}</span></p>
                                                <p className="text-xs text-gray-500">pieces scanned</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                                            <div className={cx('h-full rounded-full transition-all', done ? 'bg-emerald-500' : 'bg-violet-500')} style={{ width: `${pct}%` }} />
                                        </div>

                                        <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
                                            {job.lines.map((l: any) => (
                                                <li key={l.itemIndex} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                                                    <span className="min-w-0">
                                                        <span className="font-medium text-gray-900">{l.name}</span>
                                                        {(l.size || l.color) && <span className="block truncate text-xs text-gray-500">{[l.size, l.color].filter(Boolean).join(' · ')}</span>}
                                                    </span>
                                                    <span className={cx('shrink-0 font-semibold', l.scanned >= l.quantity ? 'text-emerald-600' : 'text-gray-700')}>{l.scanned}/{l.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {job.units.map((u: any) => (
                                                <span key={u.code} title={u.scannedAt ? `${when(u.scannedAt)} · ${u.scannedBy?.name || ''}${u.method === 'manual' ? ' · manual' : ''}` : 'Not scanned'}
                                                    className={cx('rounded-md px-2 py-0.5 font-mono text-[11px]', u.scannedAt ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-500')}>
                                                    {u.scannedAt ? '✓ ' : ''}{u.code}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                                            {!job.issuedAt && (
                                                <>
                                                    <Btn icon={<LuTag size={15} />} onClick={() => { openPieceLabels(paperOrder(row), job); refocus(); }}>Print piece labels</Btn>
                                                    {!done && (
                                                        <Btn icon={<LuHand size={15} />} onClick={() => doScan(job.challanNo, 'manual')} disabled={isScanning}>Mark next piece</Btn>
                                                    )}
                                                    {can(role, 'issueChallan') && (
                                                        <Btn variant="primary" icon={<LuPrinter size={15} />} onClick={() => doIssue(row)} disabled={!done || isIssuing}
                                                            title={done ? 'Issue the original — once' : 'Scan every piece first'}>
                                                            Issue challan
                                                        </Btn>
                                                    )}
                                                </>
                                            )}
                                            {job.issuedAt && (
                                                <>
                                                    <span className="text-sm text-gray-600">Issued {when(job.issuedAt)}{job.issuedBy?.name ? ` by ${job.issuedBy.name}` : ''}</span>
                                                    <Btn icon={<LuEye size={15} />} onClick={() => { openChallan(paperOrder(row), job, 'view'); refocus(); }}>View copy</Btn>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>

                <aside className="space-y-4">
                    <Card title="This session" description="Your last scans">
                        {log.length === 0 ? <p className="text-sm text-gray-500">Scans you make show up here.</p> : (
                            <ul className="space-y-2">
                                {log.map((l) => (
                                    <li key={l.at} className={cx('flex items-start gap-2 text-sm', l.ok ? 'text-gray-700' : 'text-red-700')}>
                                        {l.ok ? <LuCircleCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" /> : <LuCircleX size={15} className="mt-0.5 shrink-0" />}
                                        <span className="min-w-0 break-words">{l.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                    <Card title="How it works">
                        <ol className="list-decimal space-y-1.5 pl-4 text-sm text-gray-600">
                            <li>Print the piece labels and stick one on each product.</li>
                            <li>Scan each product as it leaves — every label counts once.</li>
                            <li>When all pieces are scanned, issue the challan. Office and Factory copies print together.</li>
                            <li>A challan cannot be printed again. If it is lost, an admin allows a duplicate.</li>
                        </ol>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
