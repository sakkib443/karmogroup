'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LuCalendarDays, LuChevronDown, LuDownload, LuFileSpreadsheet, LuLoaderCircle } from 'react-icons/lu';
import { Dropdown, MenuDivider, MenuItem, MenuLabel } from '@/components/admin/orders/OrderListUi';
import { cx } from '@/components/admin/ui';
import { downloadOrdersExcel, type OrdersExportParams } from '@/lib/downloadOrders';
import { dateRange } from './dateRange';

const QUICK = [
    { value: 'today', label: 'Today', file: 'Today' },
    { value: 'yesterday', label: 'Yesterday', file: 'Yesterday' },
    { value: '7d', label: 'Last 7 days', file: 'Last-7-days' },
    { value: '30d', label: 'Last 30 days', file: 'Last-30-days' },
    { value: 'this_month', label: 'This month', file: 'This-month' },
    { value: 'last_month', label: 'Last month', file: 'Last-month' },
] as const;

const SQ_BTN =
    'inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * "Export" on the Orders page → an Excel file of the orders for the day(s) you pick.
 * The quick choices swap only the dates; every other filter on screen (status, payment,
 * search…) is kept and listed in the menu, so what you download is what you expect.
 * "As on screen" downloads exactly the list you are looking at, dates included.
 * The server builds the file from ALL matching orders, not just the rows loaded so far.
 */
export default function ExportMenu({
    baseParams, screenRange, screenLabel, activeFilters, total,
}: {
    /** Every filter on screen except the dates. */
    baseParams: OrdersExportParams;
    /** The dates the list is showing now (undefined = all time). */
    screenRange: { from?: string; to?: string };
    screenLabel: string;
    /** Plain-language list of the other filters in use, e.g. ["Status: Pending"]. */
    activeFilters: string[];
    total: number;
}) {
    const [busy, setBusy] = useState<string | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const run = async (key: string, range: { from?: string; to?: string }, title: string, file: string, close: () => void) => {
        setBusy(key);
        try {
            const n = await downloadOrdersExcel({ ...baseParams, dateFrom: range.from, dateTo: range.to }, title, file);
            if (n === 0) toast.error(`No orders found for ${title.toLowerCase()}`);
            else { toast.success(n > 0 ? `Excel ready — ${n} order${n === 1 ? '' : 's'}` : 'Excel downloaded'); close(); }
        } catch (e) {
            toast.error((e as Error)?.message || 'Could not download the Excel file');
        } finally {
            setBusy(null);
        }
    };

    return (
        <Dropdown
            align="right"
            width={288}
            ariaLabel="Export orders to Excel"
            buttonClassName={SQ_BTN}
            button={<><LuDownload size={15} /> Export <LuChevronDown size={14} className="text-gray-400" /></>}
        >
            {(close) => (
                <div>
                    <div className="flex items-center gap-2 px-2.5 pb-1 pt-2">
                        <LuFileSpreadsheet size={16} className="text-emerald-600" />
                        <p className="text-sm font-semibold text-gray-900">Download as Excel</p>
                    </div>
                    {activeFilters.length > 0 && (
                        <p className="px-2.5 pb-1 text-xs leading-snug text-gray-500">
                            Keeps your filters: <span className="text-gray-700">{activeFilters.join(' · ')}</span>
                        </p>
                    )}

                    <MenuLabel>Pick the day(s)</MenuLabel>
                    {QUICK.map((q) => (
                        <MenuItem
                            key={q.value}
                            icon={busy === q.value ? <LuLoaderCircle size={14} className="animate-spin" /> : <LuCalendarDays size={14} />}
                            onClick={() => !busy && run(q.value, dateRange(q.value, '', ''), q.label, q.file, close)}
                        >
                            {q.label}
                        </MenuItem>
                    ))}

                    <MenuDivider />
                    <MenuLabel>Any dates</MenuLabel>
                    <div className="grid grid-cols-2 gap-2 px-2.5 pb-2">
                        <label className="text-xs text-gray-500">
                            From
                            <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)}
                                className="mt-0.5 h-9 w-full rounded-md border border-gray-200 px-2 text-sm text-gray-800 outline-none focus:border-gray-400" />
                        </label>
                        <label className="text-xs text-gray-500">
                            To
                            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)}
                                className="mt-0.5 h-9 w-full rounded-md border border-gray-200 px-2 text-sm text-gray-800 outline-none focus:border-gray-400" />
                        </label>
                        <button
                            type="button"
                            disabled={!!busy || (!from && !to)}
                            onClick={() => {
                                const title = from && to ? (from === to ? from : `${from} to ${to}`) : from ? `From ${from}` : `Up to ${to}`;
                                run('custom', dateRange('custom', from, to), title, title.replace(/\s+/g, '_'), close);
                            }}
                            className={cx(
                                'col-span-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                            )}
                        >
                            {busy === 'custom' ? <LuLoaderCircle size={14} className="animate-spin" /> : <LuDownload size={14} />} Download these dates
                        </button>
                    </div>

                    <MenuDivider />
                    <MenuItem
                        icon={busy === 'screen' ? <LuLoaderCircle size={14} className="animate-spin" /> : <LuFileSpreadsheet size={14} />}
                        hint={`${screenLabel}${total ? ` · ${total} order${total === 1 ? '' : 's'}` : ''}`}
                        onClick={() => !busy && run('screen', screenRange, screenLabel, 'On-screen', close)}
                    >
                        As on screen
                    </MenuItem>
                </div>
            )}
        </Dropdown>
    );
}
