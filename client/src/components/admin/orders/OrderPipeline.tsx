/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { LuCheck, LuCopy, LuZap, LuArrowRight, LuUndo2, LuTruck, LuX } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { useUpdateOrderStatusMutation, useSendWithPathaoMutation } from '@/redux/api/orderApi';
import { ORDER_DESK_STEPS, STATUS_COLOR as STEP_COLOR, getStatusConfig } from '@/lib/orderStatus';
import { orderSummaryText, orderDivisions, divisionLabel, openOrderPapers, type PaperKind } from './orderPapers';

/** What the step means for whoever is at the desk. */
const STEP_HINT: Record<string, string> = {
    pending: 'New order from the website. Call the customer, check the size and price, then confirm.',
    confirmed: 'Confirmed with the customer. Copy the summary for the team, then send it to the factory.',
    factory: 'At the factory. Print the memo and one challan per division, then mark the challans ready.',
    challan_ready: 'Challans are ready. When the goods are packed, move the order to courier entry.',
    courier_entry: 'Ready for the courier. Send it with Pathao to book the parcel — the order then moves to Shipped.',
    shipped: 'Handed to the courier.',
};

const NEXT_LABEL: Record<string, string> = {
    confirmed: 'Send to factory',
    factory: 'Mark challan ready',
    challan_ready: 'Move to courier entry',
};

function apiError(e: unknown, fallback: string) {
    return (e as { data?: { message?: string } })?.data?.message || fallback;
}

export default function OrderPipeline({ order }: { order: any }) {
    const [updateStatus, { isLoading: isMoving }] = useUpdateOrderStatusMutation();
    const [sendWithPathao, { isLoading: isBooking }] = useSendWithPathaoMutation();
    const [copied, setCopied] = useState(false);

    const status: string = order?.status || 'pending';
    const idx = ORDER_DESK_STEPS.indexOf(status);
    const onDesk = idx >= 0;
    const divisions = orderDivisions(order);
    const busy = isMoving || isBooking;

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

    const papers = (paper: PaperKind) => {
        try {
            openOrderPapers(order, paper);
        } catch (e) {
            toast.error((e as Error).message || 'Could not open the papers');
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

    const next = ORDER_DESK_STEPS[idx + 1];
    const prev = idx > 0 ? ORDER_DESK_STEPS[idx - 1] : null;

    return (
        <section className="rounded-md border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 className="font-bold text-gray-800">Order desk</h2>
                    <p className="text-xs text-gray-500">{onDesk ? STEP_HINT[status] : `This order is ${getStatusConfig(status).label.toLowerCase()}.`}</p>
                </div>
                {prev && status !== 'shipped' && (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => move(prev, `Moved back to ${getStatusConfig(prev).label}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50"
                    >
                        <LuUndo2 size={13} /> Back to {getStatusConfig(prev).label}
                    </button>
                )}
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
            {onDesk && (
                <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start">
                    <div className="flex flex-wrap items-center gap-2">
                        {status === 'pending' && (<>
                            <button type="button" disabled={busy} onClick={() => move('confirmed', 'Order confirmed')}
                                className="inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
                                style={{ background: STEP_COLOR.confirmed }}>
                                <LuCheck size={16} /> Confirm order
                            </button>
                            <button type="button" disabled={busy}
                                onClick={() => { if (window.confirm('Cancel this order?')) move('cancelled', 'Order cancelled'); }}
                                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50">
                                <LuX size={15} /> Cancel order
                            </button>
                        </>)}

                        {idx >= 1 && (
                            <button type="button" onClick={copySummary}
                                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2373B5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d6199]">
                                {copied ? <LuCheck size={15} /> : <LuCopy size={15} />} Copy Summary
                            </button>
                        )}

                        {status === 'courier_entry' && (
                            <button type="button" disabled={busy} onClick={pathao}
                                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-400 bg-gray-100 px-5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-200 disabled:opacity-50">
                                <LuTruck size={16} /> {isBooking ? 'Sending…' : 'Send with Pathao'}
                            </button>
                        )}

                        {NEXT_LABEL[status] && next && (
                            <button type="button" disabled={busy} onClick={() => move(next, `Moved to ${getStatusConfig(next).label}`)}
                                className="inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
                                style={{ background: STEP_COLOR[next] }}>
                                {NEXT_LABEL[status]} <LuArrowRight size={15} />
                            </button>
                        )}

                        {status === 'courier_entry' && (
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

                    {/* Papers: from the factory step on */}
                    {idx >= 2 && (
                        <div className="w-full shrink-0 rounded-md bg-gray-50 p-3 lg:ml-auto lg:w-60">
                            <button type="button" onClick={() => papers({ kind: 'all' })}
                                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-[#2373B5] text-sm font-semibold text-white transition hover:bg-[#1d6199]">
                                <LuZap size={14} className="text-amber-300" /> Download All
                            </button>
                            <div className="mt-2 space-y-1.5">
                                <PaperButton onClick={() => papers({ kind: 'memo' })}>Download Memo</PaperButton>
                                {divisions.map((d) => (
                                    <PaperButton key={d} onClick={() => papers({ kind: 'challan', division: d })}>
                                        Challan: {divisionLabel(d)}
                                    </PaperButton>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

function PaperButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button type="button" onClick={onClick}
            className="flex h-9 w-full items-center justify-center rounded-md border border-[#3B4CCA] bg-white text-sm text-[#3B4CCA] transition hover:bg-[#3B4CCA]/5">
            {children}
        </button>
    );
}
