"use client";

/** Preset buttons (Today … This year) plus a from–to pair — Sales reports and Staff activity. */
import React from 'react';
import { cx } from '@/components/admin/ui';
import { PRESETS } from './period';

export type RangeState = { preset: string; from: string; to: string };

export const startRange = (key = '30d'): RangeState => {
    const p = PRESETS.find((x) => x.key === key) || PRESETS[3];
    return { preset: p.key, ...p.range() };
};

export default function RangeBar({ value, onChange, keys = ['today', 'yesterday', '7d', '30d', 'month', 'lastMonth', 'year'] }: {
    value: RangeState; onChange: (v: RangeState) => void; keys?: string[];
}) {
    const DATE = 'h-8 w-36 rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-[var(--color-primary)]';
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.filter((p) => keys.includes(p.key)).map((p) => (
                <button key={p.key} type="button" onClick={() => onChange({ preset: p.key, ...p.range() })}
                    className={cx('h-8 rounded-full px-3 text-xs font-semibold transition',
                        value.preset === p.key ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100')}>
                    {p.label}
                </button>
            ))}
            <span className="ml-1 flex items-center gap-1.5">
                <input type="date" aria-label="From" value={value.from} max={value.to} className={DATE}
                    onChange={(e) => e.target.value && onChange({ preset: 'custom', from: e.target.value, to: value.to })} />
                <span className="text-gray-300">–</span>
                <input type="date" aria-label="To" value={value.to} min={value.from} className={DATE}
                    onChange={(e) => e.target.value && onChange({ preset: 'custom', from: value.from, to: e.target.value })} />
            </span>
        </div>
    );
}
