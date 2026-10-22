/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    LuCheck, LuCopy, LuArrowRight, LuUndo2, LuTruck, LuX, LuEye, LuFileText, LuReceiptText, LuCopyPlus,
    LuScanBarcode, LuShieldCheck, LuLock, LuPrinter,
} from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import {
    useUpdateOrderStatusMutation, useSendWithPathaoMutation, useIssueMemoMutation, useReprintMemoMutation,
    useIssueChallanMutation, useReprintChallanMutation,
} from '@/redux/api/orderApi';
import { useViewRole } from '@/components/admin/viewRole';
import { ORDER_DESK_STEPS, STATUS_COLOR as STEP_COLOR, getStatusConfig } from '@/lib/orderStatus';
import { can, nextStatuses } from '@/components/admin/access';
import { Btn, Modal, Field, TEXTAREA, cx } from '@/components/admin/ui';
import { CancelOrderModal, SmsButton } from './OrderActions';
import { orderSummaryText, orderDivisions, divisionLabel, openOrderPapers, openMemo, openChallan, openPieceLabels } from './orderPapers';

/** What the step means for whoever is at the desk. */
const STEP_HINT: Record<string, string> = {
    pending: 'New order from the website. Call the customer, check the size and price, then confirm.',
    confirmed: 'Confirmed with the customer. Copy the summary for the team, then send it to the factory.',
    factory: 'At the factory. Each piece is scanned out, then its division’s challan is issued — once.',
    challan_ready: 'Every challan is issued. When the goods are packed, move the order to courier entry.',
    courier_entry: 'Ready for the courier. Send it with Pathao to book the parcel — the order then moves to Shipped.',
    shipped: 'Handed to the courier.',
};
const FACTORY_HINT = 'Scan every piece at the scan station, then issue the challan. Each challan is issued once.';

const NEXT_LABEL: Record<string, string> = {
    confirmed: 'Send to factory',
    factory: 'Mark challan ready',
    challan_ready: 'Move to courier entry',
};

const ALL = [...ORDER_DESK_STEPS, 'delivered', 'cancelled', 'returned', 'refunded'];

function apiError(e: unknown, fallback: string) {
    return (e as { data?: { message?: string } })?.data?.message || fallback;
}
const when = (d?: string) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');
const tryOpen = (fn: () => void) => {
    try { fn(); } catch (e) { toast.error((e as Error).message || 'Could not open the paper'); }
};

type Reprint = { kind: 'memo' } | { kind: 'challan'; job: any };

export default function OrderPipeline({ order }: { order: any }) {
    const { role } = useViewRole();
    const [updateStatus, { isLoading: isMoving }] = useUpdateOrderStatusMutation();
    const [sendWithPathao, { isLoading: isBooking }] = useSendWithPathaoMutation();
    const [issueMemo, { isLoading: isIssuingMemo }] = useIssueMemoMutation();
    const [reprintMemo, { isLoading: isReprintingMemo }] = useReprintMemoMutation();
    const [issueChallan] = useIssueChallanMutation();
    const [reprintChallan, { isLoading: isReprintingChallan }] = useReprintChallanMutation();
    const [copied, setCopied] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [issuingJob, setIssuingJob] = useState<string | null>(null);
    const [reprint, setReprint] = useState<Reprint | null>(null);
    const [reason, setReason] = useState('');

    const status: string = order?.status || 'pending';
    const idx = ORDER_DESK_STEPS.indexOf(status);
    const onDesk = idx >= 0;
    const busy = isMoving || isBooking;
    const allowed = nextStatuses(role, status, ALL);
    const may = (to: string) => allowed.includes(to);
    const isFactory = role === 'factory';
    const jobs: any[] = order?.jobs || [];

    const move = async (to: string, done: string) => {
        try {
            await updateStatus({ id: order._id, status: to }).unwrap();
            toast.success(done);
        } catch (e) {
            toast.error(apiError(e, 'Could not change the status'));
        }
    };

    const copySummary = async () => {
        try {
            await navigator.clipboard.writeText(orderSummaryText(order));
            setCopied(true);
            toast.success('Order summary copied');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Could not copy — your browser blocked the clipboard');
        }
    };

    const pathao = async () => {
        try {
            const res = await sendWithPathao(order._id).unwrap();
            const cid = (res?.data as any)?.consignmentId;
            toast.success(cid ? `Sent with Pathao — consignment ${cid}` : 'Sent with Pathao');
        } catch (e) {
            toast.error(apiError(e, 'Pathao did not take the parcel'), { duration: 7000 });
        }
    };

    /* ── Paperwork: originals once, view copies any time, duplicates by an admin ── */

    const doIssueMemo = async () => {
        if (!window.confirm('Issue the memo now? The original prints once — after that only view copies, or a duplicate from an admin.')) return;
        try {
            const res: any = await issueMemo(order._id).unwrap();
            toast.success('Memo issued');
            tryOpen(() => openMemo(res?.data || order, 'original'));
        } catch (e) {
            toast.error(apiError(e, 'Could not issue the memo'), { duration: 6000 });
        }
    };

    const doIssueChallan = async (job: any) => {
        const waiting = (job.unitsTotal || 0) - (job.unitsScanned || 0);
        const msg = waiting > 0
            ? `${waiting} piece(s) on ${job.challanNo} are not scanned. Issue the challan anyway? (admins only)`
            : `Issue challan ${job.challanNo}? The original prints once.`;
        if (!window.confirm(msg)) return;
        setIssuingJob(job._id);
        try {
            const res: any = await issueChallan({ id: order._id, jobId: job._id }).unwrap();
            toast.success(res?.message || 'Challan issued');
            const fresh = res?.data || order;
            const freshJob = (fresh.jobs || []).find((j: any) => j._id === job._id) || job;
            tryOpen(() => openChallan(fresh, freshJob, 'original'));
        } catch (e) {
            toast.error(apiError(e, 'Could not issue the challan'), { duration: 6000 });
        } finally {
            setIssuingJob(null);
        }
    };

    const submitReprint = async () => {
        if (!reprint) return;
        const why = reason.trim();
        if (why.length < 3) { toast.error('Write why a duplicate is needed'); return; }
        try {
            if (reprint.kind === 'memo') {
                const res: any = await reprintMemo({ id: order._id, reason: why }).unwrap();
                tryOpen(() => openMemo(res?.data || order, 'duplicate', why));
            } else {
                const res: any = await reprintChallan({ id: order._id, jobId: reprint.job._id, reason: why }).unwrap();
                const fresh = res?.data || order;
                const freshJob = (fresh.jobs || []).find((j: any) => j._id === reprint.job._id) || reprint.job;
                tryOpen(() => openChallan(fresh, freshJob, 'duplicate', why));
            }
            toast.success('Duplicate recorded on the order');
            setReprint(null);
            setReason('');
        } catch (e) {
            toast.error(apiError(e, 'Could not make the duplicate'));
        }
    };

    const next = ORDER_DESK_STEPS[idx + 1];
    const prev = idx > 0 ? ORDER_DESK_STEPS[idx - 1] : null;
    const hint = isFactory && ['confirmed', 'factory'].includes(status) ? FACTORY_HINT : STEP_HINT[status];

    // Papers show once the order is confirmed, to whoever may see them.
    const showPapers = idx >= 1 && (can(role, 'viewPapers') || can(role, 'issueMemo') || can(role, 'issueChallan'));
    const memo = order?.memo || {};

    return (
        <section className="rounded-md border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 className="font-bold text-gray-800">Order desk</h2>
                    <p className="text-xs text-gray-500">{onDesk ? hint : `This order is ${getStatusConfig(status).label.toLowerCase()}.`}</p>
                </div>
                <div className="flex items-center gap-4">
                    {prev && status !== 'shipped' && may(prev) && (
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => move(prev, `Moved back to ${getStatusConfig(prev).label}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50"
                        >
                            <LuUndo2 size={13} /> Back to {getStatusConfig(prev).label}
                        </button>
                    )}
                    {status !== 'pending' && may('cancelled') && (
                        <button type="button" disabled={busy} onClick={() => setCancelOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50">
                            <LuX size={13} /> Cancel order
                        </button>
                    )}
                </div>
            </header>

            {/* Steps */}
            <ol className="flex gap-1 overflow-x-auto px-5 pt-5">
                {ORDER_DESK_STEPS.map((step, i) => {
                    const reached = onDesk && i <= idx;
                    const current = i === idx;
                    const color = STEP_COLOR[step];
                    return (
                        <li key={step} className="flex min-w-[112px] flex-1 flex-col gap-2">
                            <div className="h-1.5 rounded-full" style={{ background: reached ? color : '#E5E7EB' }} />
                            <span
                                className="flex items-center gap-1.5 text-xs font-semibold"
                                style={{ color: reached ? color : '#9CA3AF' }}
                            >
                                <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                                    style={{ background: reached ? color : '#D1D5DB', boxShadow: current ? `0 0 0 3px ${color}33` : undefined }}
                                >
                                    {reached && !current ? <LuCheck size={10} /> : i + 1}
                                </span>
                                {getStatusConfig(step).label}
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* What to do now */}
            <div className="flex flex-wrap items-center gap-2 px-5 py-5">
                {status === 'pending' && (<>
                    {may('confirmed') && (
                        <button type="button" disabled={busy} onClick={() => move('confirmed', 'Order confirmed')}
                            className="inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
                            style={{ background: STEP_COLOR.confirmed }}>
                            <LuCheck size={16} /> Confirm order
                        </button>
                    )}
                    {may('cancelled') && (
                        <button type="button" disabled={busy} onClick={() => setCancelOpen(true)}
                            className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50">
                            <LuX size={15} /> Cancel order
                        </button>
                    )}
                    {!may('confirmed') && <p className="text-sm text-gray-500">Waiting for the call centre to confirm.</p>}
                </>)}

                {(idx >= 1 || status === 'cancelled') && can(role, 'sms') && <SmsButton order={order} />}

                {idx >= 1 && (
                    <button type="button" onClick={copySummary}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2373B5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d6199]">
                        {copied ? <LuCheck size={15} /> : <LuCopy size={15} />} Copy Summary
                    </button>
                )}

                {isFactory && ['confirmed', 'factory'].includes(status) && (
                    <Link href="/dashboard/admin/factory"
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700">
                        <LuScanBarcode size={16} /> Open scan station
                    </Link>
                )}

                {status === 'courier_entry' && can(role, 'courier') && (
                    <button type="button" disabled={busy} onClick={pathao}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-400 bg-gray-100 px-5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-200 disabled:opacity-50">
                        <LuTruck size={16} /> {isBooking ? 'Sending…' : 'Send with Pathao'}
                    </button>
                )}

                {NEXT_LABEL[status] && next && may(next) && (
                    <button type="button" disabled={busy} onClick={() => move(next, `Moved to ${getStatusConfig(next).label}`)}
                        className="inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
                        style={{ background: STEP_COLOR[next] }}>
                        {NEXT_LABEL[status]} <LuArrowRight size={15} />
                    </button>
                )}

                {status === 'courier_entry' && may('shipped') && (
                    <button type="button" disabled={busy}
                        onClick={() => { if (window.confirm('Mark shipped without booking through Pathao?')) move('shipped', 'Marked shipped'); }}
                        className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline disabled:opacity-50">
                        Shipped another way
                    </button>
                )}

                {status === 'shipped' && order?.consignmentId && (
                    <p className="text-sm text-gray-700">
                        {order.carrier || 'Courier'} consignment <b className="font-semibold">{order.consignmentId}</b>
                        {order.courierStatus ? ` · ${order.courierStatus}` : ''}
                    </p>
                )}
            </div>

            {/* Papers */}
            {showPapers && (
                <div className="border-t border-gray-100 px-5 py-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Memo &amp; challans</h3>
                            <p className="text-xs text-gray-500">Originals print once. View copies are marked VIEW COPY; duplicates need an admin and a reason.</p>
                        </div>
                        {can(role, 'viewPapers') && !isFactory && (
                            <button type="button" onClick={() => tryOpen(() => openOrderPapers(order, { kind: 'all' }))}
                                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                                <LuPrinter size={14} /> All view copies
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        {/* Memo — the customer's bill; the factory never sees it */}
                        {!isFactory && (
                            <PaperRow
                                icon={<LuReceiptText size={16} />}
                                title="Memo"
                                sub="Customer’s bill"
                                state={memo.issuedAt
                                    ? <Issued at={memo.issuedAt} by={memo.issuedBy?.name} reprints={memo.reprints?.length || 0} />
                                    : <span className="text-xs text-gray-400">Not issued yet</span>}
                            >
                                {!memo.issuedAt && can(role, 'issueMemo') && (
                                    <SmallBtn primary disabled={isIssuingMemo} onClick={doIssueMemo}>
                                        <LuShieldCheck size={13} /> {isIssuingMemo ? 'Issuing…' : 'Issue memo'}
                                    </SmallBtn>
                                )}
                                {can(role, 'viewPapers') && (
                                    <SmallBtn onClick={() => tryOpen(() => openMemo(order, 'view'))}><LuEye size={13} /> View</SmallBtn>
                                )}
                                {memo.issuedAt && can(role, 'reprint') && (
                                    <SmallBtn onClick={() => { setReason(''); setReprint({ kind: 'memo' }); }}><LuCopyPlus size={13} /> Duplicate</SmallBtn>
                                )}
                            </PaperRow>
                        )}

                        {/* Challans — one per division, numbered by the server */}
                        {jobs.length > 0 ? jobs.map((job) => {
                            const total = job.unitsTotal || 0;
                            const scanned = job.unitsScanned || 0;
                            const allScanned = total > 0 && scanned >= total;
                            const top = role === 'superadmin' || role === 'admin';
                            return (
                                <PaperRow
                                    key={job._id}
                                    icon={<LuFileText size={16} />}
                                    title={`Challan ${job.challanNo || ''}`}
                                    sub={job.label || divisionLabel(job.division)}
                                    state={job.issuedAt
                                        ? <Issued at={job.issuedAt} by={job.issuedBy?.name} reprints={job.reprints?.length || 0} />
                                        : (
                                            <span className={cx('inline-flex items-center gap-1.5 text-xs font-medium', allScanned ? 'text-emerald-700' : 'text-amber-700')}>
                                                <LuScanBarcode size={13} /> {scanned}/{total} pieces scanned
                                            </span>
                                        )}
                                >
                                    {!job.issuedAt && can(role, 'issueChallan') && (allScanned || top) && (
                                        <SmallBtn primary disabled={issuingJob === job._id} onClick={() => doIssueChallan(job)}>
                                            <LuShieldCheck size={13} /> {issuingJob === job._id ? 'Issuing…' : 'Issue challan'}
                                        </SmallBtn>
                                    )}
                                    {!job.issuedAt && !allScanned && can(role, 'issueChallan') && !top && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400"><LuLock size={12} /> Scan every piece first</span>
                                    )}
                                    {!job.issuedAt && can(role, 'scan') && (
                                        <SmallBtn onClick={() => tryOpen(() => openPieceLabels(order, job))}><LuPrinter size={13} /> Piece labels</SmallBtn>
                                    )}
                                    {can(role, 'viewPapers') && (
                                        <SmallBtn onClick={() => tryOpen(() => openChallan(order, job, 'view'))}><LuEye size={13} /> View</SmallBtn>
                                    )}
                                    {job.issuedAt && can(role, 'reprint') && (
                                        <SmallBtn onClick={() => { setReason(''); setReprint({ kind: 'challan', job }); }}><LuCopyPlus size={13} /> Duplicate</SmallBtn>
                                    )}
                                </PaperRow>
                            );
                        }) : orderDivisions(order).map((d) => (
                            // Older orders (before challan numbers) — view copies only.
                            <PaperRow key={d} icon={<LuFileText size={16} />} title="Challan" sub={divisionLabel(d)}
                                state={<span className="text-xs text-gray-400">Older order — no challan number</span>}>
                                {can(role, 'viewPapers') && (
                                    <SmallBtn onClick={() => tryOpen(() => openOrderPapers(order, { kind: 'challan', division: d }))}><LuEye size={13} /> View</SmallBtn>
                                )}
                            </PaperRow>
                        ))}
                    </div>
                </div>
            )}

            {cancelOpen && <CancelOrderModal order={order} open onClose={() => setCancelOpen(false)} />}

            <Modal
                open={!!reprint}
                onClose={() => setReprint(null)}
                title={reprint?.kind === 'memo' ? 'Duplicate memo' : `Duplicate challan ${reprint?.kind === 'challan' ? reprint.job.challanNo : ''}`}
                subtitle="The paper prints marked DUPLICATE, and the reason is saved on the order."
                width="max-w-md"
                footer={<>
                    <Btn onClick={() => setReprint(null)}>Cancel</Btn>
                    <Btn variant="primary" onClick={submitReprint} disabled={isReprintingMemo || isReprintingChallan}>
                        {isReprintingMemo || isReprintingChallan ? 'Saving…' : 'Print duplicate'}
                    </Btn>
                </>}
            >
                <Field label="Why is a duplicate needed?" required>
                    <textarea className={TEXTAREA} rows={3} autoFocus value={reason} onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. The original was torn in the factory" />
                </Field>
            </Modal>
        </section>
    );
}

function PaperRow({ icon, title, sub, state, children }: {
    icon: React.ReactNode; title: string; sub?: string; state: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">{icon}</span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{title}{sub && <span className="ml-1.5 font-normal text-gray-500">· {sub}</span>}</p>
                    <div className="mt-0.5">{state}</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">{children}</div>
        </div>
    );
}

function Issued({ at, by, reprints }: { at: string; by?: string; reprints: number }) {
    return (
        <span className="inline-flex flex-wrap items-center gap-x-2 text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700"><LuCheck size={12} /> Issued {when(at)}</span>
            {by && <span className="text-gray-500">by {by}</span>}
            {reprints > 0 && <span className="font-medium text-amber-700">· {reprints} duplicate{reprints > 1 ? 's' : ''}</span>}
        </span>
    );
}

function SmallBtn({ primary, disabled, onClick, children }: {
    primary?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode;
}) {
    return (
        <button type="button" disabled={disabled} onClick={onClick}
            className={cx('inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-semibold transition disabled:opacity-50',
                primary ? 'bg-gray-900 text-white hover:bg-gray-700' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')}>
            {children}
        </button>
    );
}
