/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/** Every SMS the order desk sent to customers, newest first. Agency staff see their own. */
import React, { useState } from 'react';
import Link from 'next/link';
import { LuMessageSquareText } from 'react-icons/lu';
import { useGetSmsLogQuery } from '@/redux/api/orderApi';
import { PageHeader, SelectPill, FilterBar, Badge, TableCard, TH, TD, TR, EmptyRow, SkeletonRows, Pager, fmtDateTime, type Tone } from '@/components/admin/ui';

const PAGE_SIZE = 25;
const STATUS: Record<string, { label: string; tone: Tone }> = {
    sent: { label: 'Sent', tone: 'green' },
    failed: { label: 'Failed', tone: 'red' },
    not_configured: { label: 'Gateway not set up', tone: 'amber' },
};

export default function SmsLogPage() {
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useGetSmsLogQuery({ page, limit: PAGE_SIZE, status: status !== 'all' ? status : undefined });
    const rows: any[] = data?.data || [];
    const meta = data?.meta || { total: 0, totalPages: 1 };

    return (
        <div>
            <PageHeader title="SMS log" subtitle="Every SMS the order desk sent to customers, newest first." />

            <FilterBar>
                <SelectPill ariaLabel="Status" className="sm:w-52" value={status} onChange={(v) => { setStatus(v); setPage(1); }}
                    options={[{ value: 'all', label: 'All SMS' }, ...Object.entries(STATUS).map(([value, s]) => ({ value, label: s.label }))]} />
            </FilterBar>

            <TableCard footer={<Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} count={rows.length} onPage={setPage} noun="SMS" />}>
                <table className={`w-full ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
                    <thead>
                        <tr>
                            <th className={TH}>Sent</th>
                            <th className={TH}>Order</th>
                            <th className={TH}>To</th>
                            <th className={TH}>Type</th>
                            <th className={TH}>Status</th>
                            <th className={TH}>By</th>
                            <th className={TH}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <SkeletonRows cols={7} /> : rows.length === 0 ? (
                            <EmptyRow colSpan={7}>
                                <LuMessageSquareText size={28} className="mx-auto mb-2 text-gray-300" />
                                No SMS yet.
                            </EmptyRow>
                        ) : rows.map((r, i) => {
                            const st = STATUS[r.sms?.status] || { label: r.sms?.status, tone: 'gray' as Tone };
                            return (
                                <tr key={`${r.orderObjectId}-${i}`} className={TR}>
                                    <td className={`${TD} whitespace-nowrap text-gray-500`}>{fmtDateTime(r.sms?.at)}</td>
                                    <td className={TD}>
                                        <Link href={`/dashboard/admin/orders/${r.orderObjectId}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{r.orderId}</Link>
                                        <p className="text-xs text-gray-400">{r.customer}</p>
                                    </td>
                                    <td className={`${TD} whitespace-nowrap font-mono text-xs`}>{r.sms?.to}</td>
                                    <td className={`${TD} capitalize`}>{r.sms?.kind}</td>
                                    <td className={TD}>
                                        <Badge tone={st.tone}>{st.label}</Badge>
                                        {r.sms?.error && r.sms?.status === 'failed' && <p className="mt-1 max-w-[200px] text-xs text-red-600">{r.sms.error}</p>}
                                    </td>
                                    <td className={`${TD} whitespace-nowrap`}>{r.sms?.by?.name || '—'}</td>
                                    <td className={`${TD} max-w-[360px]`}><p className="line-clamp-2 text-xs text-gray-600" title={r.sms?.message}>{r.sms?.message}</p></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </TableCard>
        </div>
    );
}
