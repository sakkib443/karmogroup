"use client";

/**
 * Staff activity — what each staff member did in a date range: orders taken by phone,
 * confirmed, cancelled, sent to the courier, SMS sent, pieces scanned, challans issued and
 * inquiries called back — and the log behind it. Super admin, admin, manager.
 * Data: GET /api/reports/staff and /api/reports/staff/log.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import PageGuide from '@/components/admin/PageGuide';
import { PageHeader, Card, Badge, Pager, SelectPill, cx, fmtDateTime } from '@/components/admin/ui';
import { ROLE_LABEL } from '@/components/admin/access';
import { getStatusConfig } from '@/lib/orderStatus';
import { useGetStaffReportQuery, useGetStaffLogQuery, type StaffCounts } from '@/redux/api/reportApi';
import RangeBar, { startRange } from '../analytics/_components/RangeBar';
import { fmtPeriod } from '../analytics/_components/period';

const COLS: { key: keyof StaffCounts; label: string; hint: string }[] = [
    { key: 'taken', label: 'Taken', hint: 'Orders taken by phone / walk-in' },
    { key: 'confirmed', label: 'Confirmed', hint: 'Orders confirmed with the customer' },
    { key: 'cancelled', label: 'Cancelled', hint: 'Orders cancelled' },
    { key: 'sms', label: 'SMS', hint: 'SMS sent to customers' },
    { key: 'inquiries', label: 'Inquiries', hint: 'Website messages called back' },
    { key: 'shipped', label: 'To courier', hint: 'Parcels sent to the courier' },
    { key: 'scans', label: 'Scans', hint: 'Pieces scanned at the factory' },
    { key: 'challans', label: 'Challans', hint: 'Challans issued' },
];
const n = (v: unknown) => Number(v || 0).toLocaleString('en-IN');
const roleName = (r: string) => ROLE_LABEL[r as keyof typeof ROLE_LABEL] || r;

export default function StaffActivityPage() {
    const [range, setRange] = useState(startRange('7d'));
    const [actor, setActor] = useState('all');
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useGetStaffReportQuery({ from: range.from, to: range.to });
    const { data: logData, isFetching: logLoading } = useGetStaffLogQuery({ from: range.from, to: range.to, actor: actor !== 'all' ? actor : undefined, page });
    const r = data?.data;
    const rows = r?.rows || [];
    const log = logData?.data || [];
    const meta = logData?.meta || { total: 0, totalPages: 1 };
    const pick = (v: typeof range) => { setRange(v); setPage(1); };

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader title="Staff activity" subtitle={r ? `Who did what · ${fmtPeriod(r.from, r.to)}` : 'Who did what'} actions={<PageGuide page="staff" />} />

            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3"><RangeBar value={range} onChange={pick} /></div>

            {/* The day's work at a glance */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-8">
                {COLS.map((c) => (
                    <div key={c.key} className="rounded-2xl border border-gray-200 bg-white px-4 py-3" title={c.hint}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">{c.label}</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">{isLoading ? '…' : n(r?.totals[c.key])}</p>
                    </div>
                ))}
            </div>

            <Card className="mb-4" title="By staff member" description="Click a name to see only their actions below.">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-sm">
                        <thead><tr className="text-left text-xs font-semibold text-gray-500">
                            <th className="py-2 pr-3">Staff</th>
                            {COLS.map((c) => <th key={c.key} className="py-2 pr-3 text-right" title={c.hint}>{c.label}</th>)}
                            <th className="py-2 text-right">Total</th>
                        </tr></thead>
                        <tbody>
                            {rows.map((s) => (
                                <tr key={s.id} className={cx('border-t border-gray-100', actor === s.id && 'bg-sky-50', !s.total && 'text-gray-400')}>
                                    <td className="py-2.5 pr-3">
                                        <button type="button" onClick={() => { setActor(actor === s.id ? 'all' : s.id); setPage(1); }} className="text-left">
                                            <span className={cx('font-medium', s.total ? 'text-gray-900 hover:text-[var(--color-primary)]' : '')}>{s.name || '—'}</span>
                                            <Badge className="ml-1.5">{roleName(s.role)}</Badge>
                                            {s.status === 'blocked' && <Badge tone="red" className="ml-1">Blocked</Badge>}
                                        </button>
                                    </td>
                                    {COLS.map((c) => <td key={c.key} className="py-2.5 pr-3 text-right tabular-nums">{s[c.key] ? n(s[c.key]) : <span className="text-gray-300">–</span>}</td>)}
                                    <td className="py-2.5 text-right font-semibold tabular-nums">{n(s.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!rows.length && <p className="py-8 text-center text-sm text-gray-400">{isLoading ? 'Loading…' : 'No staff yet.'}</p>}
                </div>
            </Card>

            <Card title="Activity log" description="Every change staff made to orders, newest first."
                actions={<SelectPill ariaLabel="Staff" value={actor} onChange={(v) => { setActor(v); setPage(1); }} className="sm:w-56"
                    options={[{ value: 'all', label: 'Everyone' }, ...rows.map((s) => ({ value: s.id, label: s.name || roleName(s.role) }))]} />}>
                {!log.length ? <p className="py-8 text-center text-sm text-gray-400">{logLoading ? 'Loading…' : 'Nothing in this period.'}</p> : (
                    <ul className="divide-y divide-gray-100">
                        {log.map((l, i) => {
                            const st = getStatusConfig(l.status);
                            return (
                                <li key={`${l.orderObjectId}-${l.at}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                                    <span className="w-36 shrink-0 text-xs text-gray-400">{fmtDateTime(l.at)}</span>
                                    <span className="font-medium text-gray-900">{l.by?.name || '—'}</span>
                                    <span className={cx('rounded-full px-2 py-0.5 text-xs font-semibold', st.badgeBg, st.badgeText)}>{st.label}</span>
                                    <Link href={`/dashboard/admin/orders/${l.orderObjectId}`} className="font-semibold text-gray-700 hover:text-[var(--color-primary)]">{l.orderId}</Link>
                                    {l.note && <span className="min-w-0 flex-1 truncate text-xs text-gray-500">{l.note}</span>}
                                </li>
                            );
                        })}
                    </ul>
                )}
                {meta.totalPages > 1 && <div className="mt-3 border-t border-gray-100 pt-3"><Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={30} count={log.length} onPage={setPage} noun="actions" /></div>}
            </Card>
        </div>
    );
}
