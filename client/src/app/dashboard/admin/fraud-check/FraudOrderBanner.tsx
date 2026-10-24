"use client";

import React from 'react';
import Link from 'next/link';
import { LuShieldAlert, LuArrowRight } from 'react-icons/lu';
import { cx } from '@/components/admin/ui';
import { useGetFraudForOrderQuery } from '@/redux/api/fraudApi';

/**
 * A short warning on the admin order page when this customer refused a parcel or cancelled
 * before. Renders nothing while loading, when the history is clean, or if the API fails.
 */
export default function FraudOrderBanner({ orderId }: { orderId?: string }) {
    const { data, isError } = useGetFraudForOrderQuery(orderId || '', { skip: !orderId });
    const h = data?.data;
    if (!orderId || isError || !h) return null;

    const high = h.risk === 'high';
    const bits = [
        h.refused && `${h.refused} parcel${h.refused === 1 ? '' : 's'} not taken`,
        h.cancelled && `${h.cancelled} cancelled`,
        `${h.delivered} delivered`,
    ].filter(Boolean).join(' · ');

    return (
        <div role="status" className={cx('flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between',
            high ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50')}>
            <div className="flex min-w-0 items-start gap-3">
                <LuShieldAlert size={20} className={cx('mt-0.5 shrink-0', high ? 'text-red-600' : 'text-amber-600')} />
                <div className="min-w-0">
                    <p className={cx('text-sm font-semibold', high ? 'text-red-900' : 'text-amber-900')}>
                        {high ? 'High risk customer' : 'Check this customer'} — {bits}
                    </p>
                    {h.lastProblem && (
                        <p className={cx('mt-0.5 text-xs', high ? 'text-red-800/80' : 'text-amber-800/80')}>
                            Last: {h.lastProblem.orderId} {h.lastProblem.kind === 'refused' ? 'not taken' : 'cancelled'}{h.lastProblem.reason ? ` — ${h.lastProblem.reason}` : ''}
                        </p>
                    )}
                </div>
            </div>
            <Link href={`/dashboard/admin/fraud-check?q=${encodeURIComponent(h.phone)}`}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-white/70 sm:self-auto">
                History <LuArrowRight size={13} />
            </Link>
        </div>
    );
}
