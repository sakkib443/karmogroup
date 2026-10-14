/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * The order desk's small shared actions: cancel with a reason, and the one-click SMS
 * to the customer. Used by the agency dashboard, the order list and the order page.
 */
import React, { useState } from 'react';
import { LuSend, LuCheck, LuTriangleAlert } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { useUpdateOrderStatusMutation, useSendOrderSmsMutation } from '@/redux/api/orderApi';
import { Btn, Modal, Field, TEXTAREA, cx } from '@/components/admin/ui';

const apiError = (e: unknown, fallback: string) =>
    (e as { data?: { message?: string } })?.data?.message || fallback;

export const CANCEL_REASONS = [
    'Customer did not answer the phone',
    'Customer cancelled the order',
    'Fake or test order',
    'Duplicate order',
    'Outside our delivery area',
    'Product not available',
    'Other',
];

/** Cancel an order — a reason is required (the server refuses without one). */
export function CancelOrderModal({ order, open, onClose, onDone }: {
    order: any; open: boolean; onClose: () => void; onDone?: () => void;
}) {
    const [reason, setReason] = useState(CANCEL_REASONS[0]);
    const [detail, setDetail] = useState('');
    const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();

    const submit = async () => {
        const text = reason === 'Other' ? detail.trim() : [reason, detail.trim()].filter(Boolean).join(' — ');
        if (text.length < 3) { toast.error('Write why the order is cancelled'); return; }
        try {
            await updateStatus({ id: order._id, status: 'cancelled', note: text }).unwrap();
            toast.success(`${order.orderId} cancelled`);
            setDetail('');
            onClose();
            onDone?.();
        } catch (e) {
            toast.error(apiError(e, 'Could not cancel the order'));
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Cancel ${order?.orderId || 'order'}`}
            subtitle={order?.shippingAddress?.fullName}
            width="max-w-md"
            footer={<>
                <Btn onClick={onClose}>Keep order</Btn>
                <Btn variant="danger" onClick={submit} disabled={isLoading}>{isLoading ? 'Cancelling…' : 'Cancel order'}</Btn>
            </>}
        >
            <div className="space-y-2">
                {CANCEL_REASONS.map((r) => (
                    <label key={r} className={cx('flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition',
                        reason === r ? 'border-red-300 bg-red-50 text-red-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                        <input type="radio" name="cancel-reason" checked={reason === r} onChange={() => setReason(r)} className="accent-red-600" />
                        {r}
                    </label>
                ))}
            </div>
            <Field label={reason === 'Other' ? 'Reason' : 'Details (optional)'} required={reason === 'Other'} className="mt-4">
                <textarea className={TEXTAREA} rows={2} value={detail} onChange={(e) => setDetail(e.target.value)}
                    placeholder={reason === 'Other' ? 'Why is it cancelled?' : 'Anything the team should know'} />
            </Field>
        </Modal>
    );
}

const when = (d?: string) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');

/**
 * "Send SMS" — one click sends the confirmation (or cancellation) SMS to the customer.
 * Once sent it shows when; sending again asks first.
 */
export function SmsButton({ order, compact = false }: { order: any; compact?: boolean }) {
    const [sendSms, { isLoading }] = useSendOrderSmsMutation();
    const kind = order?.status === 'cancelled' ? 'cancelled' : 'confirmed';
    const sent = (order?.sms || []).filter((s: any) => s.kind === kind && s.status === 'sent');
    const last = sent[sent.length - 1];
    const lastAttempt = (order?.sms || []).slice(-1)[0];

    if (order?.status === 'pending') return null;

    const send = async () => {
        if (last && !window.confirm(`An SMS already went to this customer (${when(last.at)}). Send it again?`)) return;
        try {
            const res = await sendSms({ id: order._id, kind }).unwrap();
            const status = res?.data?.sms?.status;
            if (status === 'sent') toast.success('SMS sent');
            else if (status === 'not_configured') toast('SMS gateway is not set up yet — nothing was sent. Add SMS_PROVIDER, SMS_API_KEY and SMS_SENDER_ID on the server.', { icon: '⚠️', duration: 7000 });
            else toast.error(res?.message || 'SMS failed');
        } catch (e) {
            toast.error(apiError(e, 'Could not send the SMS'));
        }
    };

    if (last) {
        return (
            <span className={cx('inline-flex items-center gap-2', compact ? 'text-xs' : 'text-sm')}>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700"><LuCheck size={14} /> SMS sent {when(last.at)}</span>
                <button type="button" onClick={send} disabled={isLoading} className="text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline disabled:opacity-50">
                    Resend
                </button>
            </span>
        );
    }

    return (
        <span className="inline-flex flex-col items-start gap-1">
            <button
                type="button"
                onClick={send}
                disabled={isLoading}
                className={cx('inline-flex items-center gap-1.5 rounded-full bg-emerald-600 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60',
                    compact ? 'h-7 px-3 text-xs' : 'h-9 px-4 text-sm')}
            >
                <LuSend size={compact ? 12 : 14} /> {isLoading ? 'Sending…' : 'Send SMS'}
            </button>
            {lastAttempt && lastAttempt.status !== 'sent' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
                    <LuTriangleAlert size={11} /> {lastAttempt.status === 'not_configured' ? 'Gateway not set up' : 'Last try failed'}
                </span>
            )}
        </span>
    );
}
